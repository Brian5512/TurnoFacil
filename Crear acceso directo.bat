@echo off
setlocal
title TurnoFacil - Crear acceso directo

set "TURNOFACIL_APP=%~dp0index.html"
set "TURNOFACIL_ICON=%~dp0assets\burger-king.ico"

if not exist "%TURNOFACIL_APP%" (
  echo No se encontro index.html. Mantenga este archivo dentro de la carpeta de TurnoFacil.
  pause
  exit /b 1
)

if not exist "%TURNOFACIL_ICON%" (
  echo No se encontro el icono de Burger King en la carpeta assets.
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$app=(Resolve-Path -LiteralPath $env:TURNOFACIL_APP).Path; $icon=(Resolve-Path -LiteralPath $env:TURNOFACIL_ICON).Path; $desktop=[Environment]::GetFolderPath('Desktop'); $link=(New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $desktop 'TurnoFacil.lnk')); $link.TargetPath=$app; $link.WorkingDirectory=(Split-Path -Parent $app); $link.IconLocation=$icon + ',0'; $link.Description='TurnoFacil - Gestion de turnos'; $link.Save()"

if errorlevel 1 (
  echo No se pudo crear el acceso directo.
  pause
  exit /b 1
)

echo Acceso directo TurnoFacil creado correctamente en el escritorio.
pause
