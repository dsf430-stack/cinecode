# Project status

## 2026-11-08 — GitHub Actions cloud verification: DONE

- Upstream baseline: `67f9807112b97ae253d4a5f0eccaccc46c3b2633`.
- Verification workflow: `.github/workflows/cloud-smoke.yml`.
- Tested commit: `7452389c3d2f26e8bb8f82e133fe43c42e6c589b`.
- Successful run: https://github.com/dsf430-stack/cinecode/actions/runs/42497254923
- Ubuntu 24.04, Node 22, Python 3.12, Google Chrome and FFmpeg.
- Official suite: 231 tests, 230 passed, 1 Windows-only test skipped. Browser tests enabled and passed.
- Official Quick starter: 8 seconds, 270x480, 24 fps, 192 frames, Canvas 2D.
- Determinism: frame 96 identical when rendered again after frame 0.
- Soundtrack: 8 seconds, 48 kHz stereo, measured peak -1.1 dBFS before AAC encoding.
- Output: H.264/AAC MP4; audio/video stream and duration assertions passed; full FFmpeg decode passed.
- Evidence artifact: `cinecode-cloud-verification`, ID `13624167252`; expires 2026-11-15.
- Scope: runtime verification with the official starter, not a commissioned film. No narration or 3D GPU rendering was tested.
- The workflow is manually runnable from Actions; its creation also triggers a run. Actions provides a temporary job runner, not a continuously running web app.

## Resume here

For another runtime check, run `Cinecode cloud render verification` from Actions. For a film, obtain its brief, follow `SKILL.md`, keep production in a separate project folder and add a workflow for that production only after its requirements are established. Do not replace or modify unrelated video projects.
