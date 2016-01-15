# scripts/functions.sh

BLA="$(echo "\033[30m")"
RED="$(echo "\033[31m")"
GRE="$(echo "\033[32m")"
YEL="$(echo "\033[33m")"
BLU="$(echo "\033[34m")"
PUR="$(echo "\033[35m")"
CYA="$(echo "\033[36m")"
WHI="$(echo "\033[37m")"
RES="$(echo "\033[0m")"

# color functions
info () {
  echo "$(tput setaf 6)$1$(tput sgr0)";
}
success () {
  echo "$(tput setaf 2)$1$(tput sgr0)";
}
warn () {
  echo "$(tput setaf 3)WARNING: $1$(tput sgr0)";
}
error () {
  echo "$(tput setaf 1)ERROR: $1$(tput sgr0)";
  exit 0;
}

confirm () {
  # call with a prompt string or use a default
  read -r -p "$YEL${1:-Are you sure? [y/N]}$RES " response
  case $response in
    [yY][eE][sS]|[yY])
      true
      ;;
    *)
      false
      ;;
  esac
}