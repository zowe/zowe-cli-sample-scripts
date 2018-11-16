#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

# Setup
./demo.setup.sh

# Run
./demo.run.sh

# Clean
./demo.cleanup.sh

echo ""
echo "We did it! :)"
