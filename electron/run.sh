#!/bin/sh
set -e

echo "[run] args: $*"

# 如果没有参数，默认使用 /data
if [ "$#" -eq 0 ]; then
  set -- /data
fi

xvfb-run --auto-servernum \
  --server-args="-screen 0 1920x1080x24" \
  -- \
  electron \
  --no-sandbox \
  --disable-gpu \
  --enable-unsafe-swiftshader \
  --disable-features=UseDBus \
  --log-level=3 \
  "$@"
