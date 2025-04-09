#!/bin/bash

# 배포 스크립트
# 사용법: ./scripts/deploy.sh "커밋 메시지"

# 오류 시 스크립트 중단
set -e

# 현재 브랜치 확인
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "현재 브랜치가 main이 아닙니다. main 브랜치로 전환합니다."
  git checkout main
fi

# 변경사항 스테이징
git add .

# 커밋 메시지 확인
COMMIT_MSG=${1:-"자동 배포: $(date +%Y-%m-%d_%H:%M:%S)"}
echo "커밋 메시지: $COMMIT_MSG"

# 변경사항 커밋
git commit -m "$COMMIT_MSG"

# GitHub에 푸시
echo "GitHub에 푸시 중..."
git push origin main

echo "배포가 성공적으로 완료되었습니다." 