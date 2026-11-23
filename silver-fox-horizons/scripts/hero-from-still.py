#!/usr/bin/env python3
"""
Turns a still image into the hero films with a slow, sub-pixel-smooth camera move.

  assets/hero.mp4      1920x1080, 10 s: whole globe -> close on Africa (scroll sequence source)
  assets/hero-720.mp4  720x1280, seamless ping-pong loop for phones

Each frame is rendered at 2x and scaled down, so the city lights stay steady
instead of shimmering. Needs Pillow, numpy and ffmpeg.

  python3 scripts/hero-from-still.py assets/source/earth-at-night.jpg
  python3 scripts/hero-from-still.py assets/source/earth-at-night.jpg --preview out/
Then run  SKIP_MOBILE=1 bash scripts/build-hero.sh  to cut the desktop frames.
"""
import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image

SS = 2  # supersampling factor

# Measured on the source (1920x1920): globe centre and radius, Africa's centre.
GLOBE = (954.0, 966.0)
RADIUS = 800.0
AFRICA = (668.0, 1165.0)


def ease(t):  # ease-in-out sine: zero velocity at both ends
    return 0.5 - 0.5 * math.cos(math.pi * t)


def lerp(a, b, t):
    return a + (b - a) * t


def render(src, out_w, out_h, point, anchor, view_h, angle_deg):
    """Map source `point` to output `anchor` (fractions), showing `view_h` source px of height."""
    W, H = out_w * SS, out_h * SS
    s = view_h / H  # source px per output px
    a = math.radians(angle_deg)
    c, n = math.cos(a) * s, math.sin(a) * s
    ax, ay = anchor[0] * W, anchor[1] * H
    px, py = point
    data = (c, -n, px - c * ax + n * ay, n, c, py - n * ax - c * ay)
    big = src.transform((W, H), Image.AFFINE, data, resample=Image.BICUBIC, fillcolor=(0, 0, 0))
    return big.resize((out_w, out_h), Image.LANCZOS)


def desktop_camera(t):
    e = ease(t)
    point = (lerp(GLOBE[0], AFRICA[0], e), lerp(GLOBE[1], AFRICA[1], e))
    anchor = (lerp(0.64, 0.62, e), lerp(0.5, 0.46, e))
    view_h = math.exp(lerp(math.log(RADIUS * 2 * 1.16), math.log(1080.0), e))
    angle = lerp(5.0, 0.0, e)
    return point, anchor, view_h, angle


def mobile_camera(t):
    e = ease(t)
    start = (lerp(GLOBE[0], AFRICA[0], 0.45), lerp(GLOBE[1], AFRICA[1], 0.45))
    end = (lerp(GLOBE[0], AFRICA[0], 0.6), lerp(GLOBE[1], AFRICA[1], 0.6))
    point = (lerp(start[0], end[0], e), lerp(start[1], end[1], e))
    anchor = (0.5, 0.31)
    view_h = lerp(2350.0, 2150.0, e)  # source px of height in a 9:16 frame
    angle = lerp(0.0, 2.5, e)
    return point, anchor, view_h, angle


def encode(path, w, h, fps, crf, frames_iter):
    cmd = [
        'ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
        '-s', f'{w}x{h}', '-r', str(fps), '-i', '-', '-an',
        '-c:v', 'libx264', '-crf', str(crf), '-preset', 'slow', '-profile:v', 'high',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for im in frames_iter:
        proc.stdin.write(np.asarray(im, dtype=np.uint8).tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        sys.exit('ffmpeg failed for ' + path)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = Image.open(sys.argv[1]).convert('RGB')
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

    if len(sys.argv) > 3 and sys.argv[2] == '--preview':
        out = sys.argv[3]
        os.makedirs(out, exist_ok=True)
        for t in (0, 0.4, 0.9, 1):
            render(src, 1920, 1080, *desktop_camera(t)).save(f'{out}/desk-{int(t*100)}.jpg', quality=90)
            render(src, 720, 1280, *mobile_camera(t)).save(f'{out}/mob-{int(t*100)}.jpg', quality=90)
        return

    fps = 24
    n = fps * 10
    encode(os.path.join(root, 'assets/hero.mp4'), 1920, 1080, fps, 14,
           (render(src, 1920, 1080, *desktop_camera(i / (n - 1))) for i in range(n)))

    half = fps * 7
    forward = [render(src, 720, 1280, *mobile_camera(i / (half - 1))) for i in range(half)]
    loop = forward + forward[-2:0:-1]  # ping-pong without repeating the end frames
    encode(os.path.join(root, 'assets/hero-720.mp4'), 720, 1280, fps, 26, loop)
    forward[0].save(os.path.join(root, 'assets/hero-mobile.webp'), quality=72)
    print('hero.mp4 and hero-720.mp4 written')


if __name__ == '__main__':
    main()
