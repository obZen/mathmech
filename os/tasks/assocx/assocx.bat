@echo off
rem assocx (имя)
rem все действия по заданному расширению
rem использовать команду reg

FOR /F "usebackq tokens=2 delims==" %%a in (`assoc %1`) do set typeOfFile=%%a

echo Type of file: %typeOfFile%
FOR /F "usebackq tokens=4 delims=\" %%d in (`reg query HKEY_CLASSES_ROOT\%typeOfFile%\shell /f * /k`) do call :writeInfoAboutType %%d %typeOfFile%
goto :eof

:writeInfoAboutType
echo %1
reg query HKEY_CLASSES_ROOT\%2\shell\%1 /s
goto :eof