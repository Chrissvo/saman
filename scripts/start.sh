# scripts/start.sh

set -e            # fail fast
set -o pipefail   # don't ignore exit codes when piping output
# set -x          # enable debugging

source scripts/functions.sh

# check for outdated, incorrect, and unused dependencies
info "Checking npm-packages"
./node_modules/npm-check-updates/bin/npm-check-updates
info "Checking bower-packages"
./node_modules/npm-check-updates/bin/npm-check-updates -m bower

# run ember server
info "Starting ember-cli"
ember server