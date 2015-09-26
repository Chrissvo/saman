BLA="$(echo -e "\033[30m")"
RED="$(echo -e "\033[31m")"
GRE="$(echo -e "\033[32m")"
YEL="$(echo -e "\033[33m")"
BLU="$(echo -e "\033[34m")"
PUR="$(echo -e "\033[35m")"
CYA="$(echo -e "\033[36m")"
WHI="$(echo -e "\033[37m")"
RES="$(echo -e "\033[0m")"

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