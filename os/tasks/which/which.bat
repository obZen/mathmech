@echo off
rem �������� �� ��� ����������� ���������� ��������� path
for %%i in ("%PATH:;=" "%") do call :path %1 %%i

:path
rem echo %1 | findstr "."
echo %1 | findstr /c:.
if %errorlevel%==1  (
    for %%i in ("%PATHEXT:;=" "%") do call :check %1 %2 %%i
 ) else (
     call :checkfile %1 %2
 )
exit /b

:check
rem ������� ���� � ����� (����������_��_path\���_�����.����������_�����)
set Q=%~2\%~1%~3
rem ���� ���������� ������������ ����, �� ������� ���� � ���� �����
if exist "%Q%" echo %Q%
exit /b

:checkfile
set Q=%~2\%~1
if exist "%Q%" echo %Q%
exit /b
:eof