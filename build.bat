@echo off
echo Building Maintenance App...
set CSC_IDENTITY_AUTO_DISCOVERY=false
set ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
set ELECTRON_SKIP_BINARY_DOWNLOAD=false
npm run build
