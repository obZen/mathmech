@echo off
rmdir /s/q result
mkdir result
for /f %%i in ('help') do call :exec %%i

:exec
help %1 1>nul 2>nul
if %errorlevel% == 1 help %1 >> ./result/%1.txt