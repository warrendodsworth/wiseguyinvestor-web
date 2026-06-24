@echo off

call ng build --prod

call pnpm run sw REM google sw-precache service worker generator

call pnpm run static-serve

echo "deployed"
