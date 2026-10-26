#!/usr/bin/env sh
# Godot 웹 빌드: godot/build/web/ 에 index.html 을 만든다.
# 필요: Godot 4.4.x 와 같은 버전의 export templates (Editor → Manage Export Templates).
# GODOT 환경 변수로 실행 파일 경로를 바꿀 수 있다.
set -e
cd "$(dirname "$0")"
GODOT="${GODOT:-godot}"
mkdir -p build/web
"$GODOT" --headless --path . --import
"$GODOT" --headless --path . --export-release "Web" build/web/index.html
echo "built godot/build/web — serve it with: python3 -m http.server -d build/web"
