@echo off
set /a T=%1*1000
ping 10.254.245.254 /n 1 /w %T% >nul