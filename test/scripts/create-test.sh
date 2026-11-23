#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/create-test.sh <input_file>
# Must be executed from the root directory of the project.
#
# Copies the input file to test/examples-data/input,
# transpiles it to test/examples-data/expected-js/expected-<name>.js,
# runs it with -r, and saves the output to test/examples-data/correct-out/correct-out-<name>.txt.

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <input_file>" >&2
  exit 1
fi

input_file="$1"
if [ ! -f "$input_file" ]; then
  echo "Error: input file '$input_file' does not exist." >&2
  exit 1
fi

base_name="$(basename "$input_file" .calc)"
input_dir="test/examples-data/input"
output_dir="test/examples-data/output"
expected_js_dir="test/examples-data/expected-js"
correct_out_dir="test/examples-data/correct-out"

input_test="${input_dir}/${base_name}.calc"
output_js="${expected_js_dir}/expected-${base_name}.js"
output_txt="${correct_out_dir}/correct-out-${base_name}.txt"
cli_bin="./bin/calc2js.mjs"

mkdir -p "$input_dir" "$output_dir" "$expected_js_dir" "$correct_out_dir"
cp "$input_file" "$input_test"

# Transpile to expected JS file
"$cli_bin" "$input_test" -o "$output_js"

# Execute and capture clean output without ANSI color codes
"$cli_bin" -r "$input_test" \
  | sed -E 's/\x1B\[[0-9;]*[mK]//g' \
  > "$output_txt"