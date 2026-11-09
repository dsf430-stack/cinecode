"""Prepare timed narration and the mix plan for Cinecode's render tools."""
import argparse
import asyncio
import json
from pathlib import Path
import subprocess
import sys

LINES = [
    ("一九四四年六月六日，", 0.40, 4.0),
    ("盟軍登陸諾曼第。", 4.12, 8.0),
    ("士兵冒著炮火搶灘，", 8.10, 12.0),
    ("為解放西歐開闢道路。", 12.04, 15.0),
]
VOICE = "zh-TW-HsiaoChenNeural"


def duration(file):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", str(file)
    ], text=True))


def timestamp(value):
    ms = round(value * 1000)
    return f"00:00:{ms // 1000:02},{ms % 1000:03}"


async def prepare():
    import edge_tts

    raw = Path("audio/raw")
    raw.mkdir(parents=True, exist_ok=True)
    paths = []
    for i, (line, _, _) in enumerate(LINES, 1):
        mp3 = raw / f"line-{i}.mp3"
        speaker = edge_tts.Communicate(line, VOICE, rate="+20%", pitch="+5Hz",
                                       connect_timeout=15, receive_timeout=30)
        await asyncio.wait_for(speaker.save(str(mp3)), timeout=50)
        paths.append(str(mp3))

    subprocess.run([
        sys.executable, "tools/voice_treat.py", "apply", *paths,
        "--medium", "clean", "--space", "dry", "--target", "-16", "--out", "audio/vo"
    ], check=True)
    cues, layers = [], [{"file": "audio/score.wav", "at": 0, "gain_db": -1, "bus": "music"}]
    for i, (line, start, limit) in enumerate(LINES, 1):
        wav = Path(f"audio/vo/line-{i}.wav")
        end = start + duration(wav)
        if end > limit:
            raise ValueError(f"Narration line {i} ends at {end:.2f}s, beyond its {limit}s shot")
        cues.append({"start": start, "end": round(end, 3), "text": line})
        layers.append({"file": str(wav), "at": start, "bus": "dialogue"})
        print(f"Line {i}: {start:.3f}–{end:.3f}s {line}")
    Path("timing.js").write_text("window.CUES=" + json.dumps(cues, ensure_ascii=False) + ";\n",
                                 encoding="utf-8")
    deliver = Path("deliver")
    deliver.mkdir(exist_ok=True)
    (deliver / "Normandy_Watercolor_068.srt").write_text("\n\n".join(
        f"{i}\n{timestamp(c['start'])} --> {timestamp(c['end'])}\n{c['text']}"
        for i, c in enumerate(cues, 1)
    ) + "\n", encoding="utf-8")
    (deliver / "cue-timing.json").write_text(json.dumps(cues, ensure_ascii=False, indent=2), encoding="utf-8")
    Path("audio/mix.json").write_text(json.dumps({
        "duration": 15, "out": "audio/mix.wav", "layers": layers
    }, indent=2), encoding="utf-8")


def verify():
    file = "deliver/Normandy_Watercolor_068.mp4"
    probe = json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_format", "-show_streams", "-of", "json", file
    ], text=True))
    streams = {s["codec_type"]: s for s in probe["streams"]}
    video, audio = streams["video"], streams["audio"]
    assert (video["codec_name"], video["width"], video["height"], video["pix_fmt"]) == (
        "h264", 1080, 1920, "yuv420p")
    assert video["avg_frame_rate"] == "30/1" and int(video["nb_frames"]) == 450
    assert audio["codec_name"] == "aac"
    assert abs(float(probe["format"]["duration"]) - 15) < .05
    subprocess.run(["ffmpeg", "-v", "error", "-xerror", "-i", file, "-f", "null", "-"], check=True)
    Path("deliver/ffprobe.json").write_text(json.dumps(probe, indent=2))
    print("Verified full decode: 15 s, 450 frames, 1080×1920, H.264 + AAC")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("step", choices=["prepare", "verify"])
    if parser.parse_args().step == "prepare":
        asyncio.run(prepare())
    else:
        verify()
