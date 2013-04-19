@echo off
rem sleep_time (число)
rem подождать заданное число секунд
rem использовать команду или переменную time
set TimeInMs=0
call :convertTimeToMs %time%
set /a StopTime=%TimeInMs%+%1*1000
rem echo %StopTime%

:wait
set CurrentTime=%time%
call :convertTimeToMs %CurrenTime%
if %TimeInMs% LEQ %StopTime% goto :wait
goto :eof
:convertTimeToMs
set tm=%1
rem echo %time%
for /f "useback delims=: tokens=1-3" %%h in (`echo %time%`) do call :parseLol %%h %%i %%j
goto :eof
:parseLol
call :checkint %~1
set /a TimeInMS=%check%*3600000

call :checkint %~2
set /a TimeInMs+=%check%*60000

call :checkint %~3
set /a TimeInMs+=%check%*1000

call :checkint %~4
set /a TimeInMs+=%check%
goto :eof

:checkint
set check=%1
set c=%check:~0,1%
set q=%check:~1,1%
if "%c%"=="0" set check=%q%
goto :eof

:eof