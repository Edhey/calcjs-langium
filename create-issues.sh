#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <issues_file>"
  exit 1
fi

issues_file="$1"

if [ ! -f "$issues_file" ]; then
  echo "Error: File '$issues_file' not found."
  exit 1
fi

while IFS= read -r issue; do
  if [ -n "$issue" ]; then
    gh issue create --title "$issue" --body ""
  fi
done < "$issues_file"
