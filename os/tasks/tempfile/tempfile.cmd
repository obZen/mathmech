@echo off
rem tempfile (���)
rem � �������� �������� ������� ����� ����
:START
if not "%~2"=="" (
  pushd "%~2"
  cd /d "%~2"
)

:GENERATEFN
set FileName="%~1"_%RANDOM%%RANDOM%
if exist %FileName% goto :GENERATEFN

echo >nul 2>%FileName%
if not ."%~2"==."" popd

:END
