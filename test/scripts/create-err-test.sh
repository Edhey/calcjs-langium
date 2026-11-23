#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/create-err-test.sh <error_file>
# Must be executed from the root directory of the project.

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <error_file>" >&2
  exit 1
fi

error_file="$1"
if [ ! -f "$error_file" ]; then
  echo "Error: file '$error_file' does not exist." >&2
  exit 1
fi

base_name="$(basename "$error_file" .calc)"
syntax_error_dir="test/errors/syntax-error"
correct_err_dir="test/errors/correct-err"
syntax_error_file="${syntax_error_dir}/${base_name}.calc"
output_txt="${correct_err_dir}/correct-${base_name}.txt"
cli_bin="./bin/cli"

mkdir -p "$syntax_error_dir" "$correct_err_dir"
cp "$error_file" "$syntax_error_file"

set +e
"$cli_bin" "$syntax_error_file" 2> "$output_txt"
exit_code=$?
set -e

# Elimina códigos de color ANSI para que el esperado no dependa de la terminal
if [ -f "$output_txt" ]; then
  sed -i -E 's/\x1B\[[0-9;]*[mK]//g' "$output_txt"
fi

if [ "$exit_code" -eq 0 ]; then
  echo "Warning: '$syntax_error_file' exited with code 0 (no error reported)." >&2
fi