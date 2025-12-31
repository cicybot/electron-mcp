#!/bin/sh
set -e

echo "[entry] args: $*"

export ELECTRON_ENABLE_LOGGING=1
export ELECTRON_ENABLE_STACK_DUMPING=1

if [ "$1" = "bash" ] || [ "$1" = "sh" ]; then
  exec "$@"
fi

# 2️⃣ 如果存在自定义 run.sh，则执行
if [ -f /data/run.sh ]; then
  echo "[entry] using /data/run.sh"
  exec sh /data/run.sh "$@"
fi