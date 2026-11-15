@echo off
rem Publica o agentic-kit no npm a partir da main. Para no primeiro erro.
rem Antes da primeira vez: rode "npm login" num terminal.
setlocal
cd /d "%~dp0"

echo == Conferindo o login no npm
call npm whoami || goto :erro

echo == Atualizando a main
git checkout main || goto :erro
git pull --ff-only || goto :erro

echo == Instalando dependencias
call npm ci || goto :erro

echo == Publicando (o prepublishOnly roda check, build e validate:kit antes)
call npm publish || goto :erro

echo.
echo Publicado. Teste com: npx @thiagosp29/agentic-kit list
pause
exit /b 0

:erro
echo.
echo Falhou no passo acima. Nada mais foi executado.
pause
exit /b 1
