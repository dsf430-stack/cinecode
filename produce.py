"""Synthesize the supplied script, derive captions from the audio, and verify the MP4."""
import asyncio
import json
import math
from pathlib import Path
import subprocess
import sys

SCRIPT = [
    (0, "如果拜佛有用，"),
    (0, "那你連廟門都進不去。"),
    (1, "如果吃苦就能致富，"),
    (2, "那最有錢的應該是頭驢。"),
    (3, "如果種地可以賺錢，"),
    (4, "那農民將無地可種。"),
    (5, "所以別信什麼天道酬勤。"),
    (5, "老話說得好，"),
    (5, "人無偏財難暴富，"),
    (6, "馬無偏草，牠不長膘。"),
    (7, "做人眼界得放寬，"),
    (7, "腦子活絡的才能越走越寬。"),
]
FPS = 30
FILENAME = "Donkey_Gold_Cart_Woodcut_Natural_068"


def probe(file):
    return json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_format", "-show_streams", "-of", "json", str(file)
    ], text=True))


def timestamp(seconds):
    ms = round(seconds * 1000)
    return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"


async def prepare():
    import edge_tts

    raw = Path("audio/raw")
    raw.mkdir(parents=True, exist_ok=True)
    deliver = Path("deliver")
    deliver.mkdir(exist_ok=True)
    narration = "".join(text for _, text in SCRIPT)
    audio_file = raw / "narration.mp3"
    speaker = edge_tts.Communicate(
        narration, "zh-TW-HsiaoChenNeural", rate="-10%", pitch="+5Hz",
        boundary="WordBoundary", connect_timeout=15, receive_timeout=30
    )
    marks = []
    def written(text):
        return "".join(c for c in text if c.isalnum())

    async def collect():
        with audio_file.open("wb") as audio:
            async for chunk in speaker.stream():
                if chunk["type"] == "audio":
                    audio.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    word = written(chunk["text"])
                    if word:
                        marks.append((word, chunk["offset"] / 1e7,
                                      (chunk["offset"] + chunk["duration"]) / 1e7))

    await asyncio.wait_for(collect(), timeout=80)
    if "".join(word for word, _, _ in marks) != written(narration):
        raise ValueError("Speech boundary text does not cover the narration exactly")
    subprocess.run([
        sys.executable, "tools/voice_treat.py", "apply", str(audio_file),
        "--medium", "clean", "--space", "dry", "--target", "-16", "--out", "audio/vo"
    ], check=True)
    voice = Path("audio/vo/narration.wav")
    voice_duration = float(probe(voice)["format"]["duration"])
    lead = .25
    layers = [
        {"file": "audio/score.wav", "at": 0, "gain_db": 1, "bus": "music"},
        {"file": str(voice), "at": lead, "bus": "dialogue"},
    ]
    # Expand each timed token over its covered characters. Subtitle cuts are
    # selected from the service boundaries, without splitting the speech audio.
    character_marks = [ (begin, end) for word, begin, end in marks for _ in word ]
    cues, position = [], 0
    for scene, caption in SCRIPT:
        count = len(written(caption))
        start = lead + character_marks[position][0]
        end = lead + character_marks[position + count - 1][1]
        position += count
        scene_start = start if not cues or cues[-1]["scene"] != scene else cues[-1]["sceneStart"]
        cues.append({"scene": scene, "sceneStart": scene_start, "start": round(start, 4),
                     "end": round(end, 4), "text": caption})
    for cue, next_cue in zip(cues, cues[1:]):
        cue["end"] = min(cue["end"], next_cue["start"])
    if cues[-1]["end"] > lead + voice_duration + .20:
        raise ValueError("Final speech boundary is outside the audio")
    frames = math.ceil((lead + voice_duration + .38) * FPS)
    timeline = {"frames": frames, "cues": cues}
    Path("timing.js").write_text("window.TIMING=" + json.dumps(timeline, ensure_ascii=False) + ";\n")
    (deliver / f"{FILENAME}.srt").write_text("\n\n".join(
        f"{i}\n{timestamp(c['start'])} --> {timestamp(c['end'])}\n{c['text']}"
        for i, c in enumerate(cues, 1)
    ) + "\n", encoding="utf-8")
    (deliver / "timing.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=2))
    Path("audio/mix.json").write_text(json.dumps({
        "duration": frames / FPS, "out": "audio/mix.wav", "layers": layers
    }))
    print(f"Aligned {len(cues)} narration segments. {frames} frames at {FPS} fps.")


def verify():
    video = Path(f"deliver/{FILENAME}.mp4")
    report = probe(video)
    streams = {s["codec_type"]: s for s in report["streams"]}
    v, a = streams["video"], streams["audio"]
    frames = json.loads(Path("deliver/timing.json").read_text())["frames"]
    assert (v["codec_name"], v["width"], v["height"], v["pix_fmt"]) == (
        "h264", 1080, 1920, "yuv420p")
    assert v["avg_frame_rate"] == "30/1" and int(v["nb_frames"]) == frames
    assert a["codec_name"] == "aac"
    assert abs(float(report["format"]["duration"]) - frames / FPS) < .05
    subprocess.run(["ffmpeg", "-v", "error", "-xerror", "-i", str(video), "-f", "null", "-"], check=True)
    result = subprocess.run([
        "ffmpeg", "-hide_banner", "-i", str(video), "-an",
        "-vf", "blackdetect=d=0.1:pix_th=0.10,freezedetect=n=-55dB:d=1.5",
        "-f", "null", "-"
    ], capture_output=True, text=True, check=True)
    anomalies = [line for line in result.stderr.splitlines() if "black_start:" in line or "freeze_start:" in line]
    if anomalies:
        raise ValueError("\n".join(anomalies))
    Path("deliver/ffprobe.json").write_text(json.dumps(report, indent=2))
    print(f"Full decode passed. {frames/FPS:.2f}s, {frames} frames, no black or frozen intervals.")


if __name__ == "__main__":
    if sys.argv[1] == "prepare":
        asyncio.run(prepare())
    elif sys.argv[1] == "verify":
        verify()
    else:
        raise SystemExit("Usage: produce.py prepare|verify")
