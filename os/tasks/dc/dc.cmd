@echo off
:START
set Dir1=%~1
if not %Dir1:~-1%==\ ( set Dir1="%~1\" ) else ( set Dir1="%~1" )
set Dir2=%~2
if not %Dir2:~-1%==\ ( set Dir2="%~2\" ) else ( set Dir2="%~2" )
call :BEGINCOMP %Dir1% %Dir2%
goto END

:BEGINCOMP

set DIRCMD=/a:-d/b
dir %1 >nul 2>nul
if %errorlevel%==0 (
  for /f "tokens=*" %%i in ('dir %1') do (
    if exist "%~2%%i" (
      fc "%~1%%i" "%~2%%i" >nul
      if errorlevel 1 (
        @echo File "%%i" in %1 IS NOT EQUAL "%%i" in %2
      ) else (
        @echo File "%%i" in %1 IS EQUAL "%%i" in %2
      )
    ) else (
      @echo File "%%i" EXISTS in %1 but NOT EXISTS in %2
    )
  )
)
dir %2 >nul 2>nul
if %errorlevel%==0 (
  for /f "tokens=*" %%i in ('dir %2') do (
      if not exist "%~1%%i" (
        @echo File "%%i" EXISTS in %2 but NOT EXISTS in %1
      )
  )
)

set DIRCMD=/a:d/b
for /f "tokens=*" %%i in ('dir %1') do (
  if exist "%~2%%i" (
    call :BEGINCOMP "%~1%%i\" "%~2%%i\"
  ) else (
    @echo Directory "%%i" EXISTS in %1 but NOT EXISTS in %2
  )
)
for /f "tokens=*" %%i in ('dir %2') do (
  if not exist "%~1%%i" (
    @echo Directory "%%i" EXISTS in %2 but NOT EXISTS in %1
  )
)

:END
endlocal