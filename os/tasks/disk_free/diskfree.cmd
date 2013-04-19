@echo off
:START
set DIRCMD=
set disk=%1:

if not %disk:~1,1%==: (
  @echo ERROR: Incorrect disk letter: "%disk%"
  goto END
)

for /f "delims=" %%i in ('dir %disk:~0,1%:\') do set X=%%i
for /f "tokens=3 delims= " %%i in ("%X%") do (
   @echo Free on disk %disk:~0,1%: %%i bytes 
)

:END