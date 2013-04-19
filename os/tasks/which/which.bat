@echo off
rem проходим по все директори€м переменной окружени€ path
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
rem создаем путь к файлу (директори€_из_path\им€_файла.расширение_файла)
set Q=%~2\%~1%~3
rem если существует испольн€ющий файл, то выводим путь к этом файлу
if exist "%Q%" echo %Q%
exit /b

:checkfile
set Q=%~2\%~1
if exist "%Q%" echo %Q%
exit /b
:eof