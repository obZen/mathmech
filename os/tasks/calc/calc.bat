@echo off
if "%1"=="/?" echo BBegu 4uCJIoBoe BbIpa}i{eHue & goto :end
set in=
:lab 
set in=%in% %1
shift
if not ""=="%1" goto :lab
set /a c= %in%
echo %c%
:end
