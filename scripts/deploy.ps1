# PowerShell 배포 스크립트
# 사용법: .\scripts\deploy.ps1 "커밋 메시지"

# 오류 발생 시 스크립트 중단
$ErrorActionPreference = "Stop"

# 현재 브랜치 확인
$Branch = git rev-parse --abbrev-ref HEAD
if ($Branch -ne "main") {
    Write-Host "현재 브랜치가 main이 아닙니다. main 브랜치로 전환합니다."
    git checkout main
}

# 변경사항 스테이징
git add .

# 커밋 메시지 확인
$CommitMsg = if ($args[0]) { $args[0] } else { "자동 배포: $(Get-Date -Format 'yyyy-MM-dd_HH:mm:ss')" }
Write-Host "커밋 메시지: $CommitMsg"

# 변경사항 커밋
git commit -m "$CommitMsg"

# GitHub에 푸시
Write-Host "GitHub에 푸시 중..."
git push origin main

Write-Host "배포가 성공적으로 완료되었습니다." 