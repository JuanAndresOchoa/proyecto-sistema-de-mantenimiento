#!/bin/bash
echo "Building Maintenance App..."
export CSC_IDENTITY_AUTO_DISCOVERY=false
export ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
export ELECTRON_SKIP_BINARY_DOWNLOAD=false
npm run build
