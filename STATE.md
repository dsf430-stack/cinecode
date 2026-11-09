# 驢拉金車
- Target: original Traditional Chinese satire, full user text, vertical 1080x1920 H.264/AAC MP4, 068 voice at +20% / +5Hz, embedded subtitles, original score.
- Style: official Woodcut Print recipe and unmodified LemoLab engine at d33bdea74eeecde3922b0fbad227f0d3dc7afe75. Black and paper with one ochre plate. Original scene code and narration staging. Tools copied from the Cinecode project.
- Source transcription: converted to Traditional Chinese. The homophone 報富 is normalized to 暴富. The pronoun referring to the horse is written 牠.
- DONE: 29.533 s, 886 frames, 1080×1920 at 30 fps. H.264/AAC, full decode passed, no black or freeze intervals, measured −14.0 LUFS. Speech audibility was measured; subjective listening was unavailable.
- Verified run: https://github.com/dsf430-stack/cinecode/actions/runs/42545384834 at 87057068951bbfedc5b50a9fbcae93a5e189b83b. MP4 and timed SRT in the Actions artifact.
- Initial render failed repeat-frame determinism. Reset canvases each frame and switched 2D rasterization to software while keeping the upstream WebGL print compositor. Recheck passed. Second render flagged low motion at the temple and last road shot. Increased gate, queue and walking movement. Final verification passed.
- MP4 saved as Donkey_Gold_Cart_Woodcut_068.mp4, Library ID libfile_151219d52e148191ae8934c560adb5a8. Resume from this run and delivered file.
