@echo off 
FOR /F "tokens=14 usebackq" %%S IN (`ipconfig ^| findstr "IP.*[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*"`) DO ( 
     echo %%S 
     ) 
pause