#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/create-all-test.sh
# Must be executed from the root directory of the project.

INPUT_DIR="examples"
EXAMPLES_OUT_FILE="test/test-example-description.mjs"
ERRORS_OUT_FILE="test/test-error-description.mjs"
CREATE_TEST_SCRIPT="bin/test-scripts/create-test.sh"
CREATE_ERR_TEST_SCRIPT="scripts/create-err-test.sh"
OVERRIDE_EXISTING="true" # "true" para sobrescribir, "false" para añadir sin duplicar

example_entries=()
error_entries=()

entry_exists() {
  local file_path="$1"
  local test_base_name="$2"
  [ -f "$file_path" ] && grep -q "input: '${test_base_name}\.calc'" "$file_path"
}

while IFS= read -r -d '' file; do
  test_base_name="$(basename "$file" .calc)"

  if [[ "$test_base_name" == *err* ]]; then
    if [ "$OVERRIDE_EXISTING" = "false" ] && entry_exists "$ERRORS_OUT_FILE" "$test_base_name"; then
      continue
    fi

    if [ -x "$CREATE_ERR_TEST_SCRIPT" ]; then
      "$CREATE_ERR_TEST_SCRIPT" "$file"
    else
      bash "$CREATE_ERR_TEST_SCRIPT" "$file"
    fi

    error_entries+=("  {
    input: '${test_base_name}.calc',
    output: 'outerr-${test_base_name}.txt',
    correctErr: 'correct-${test_base_name}.txt'
  }")
  else
    if [ "$OVERRIDE_EXISTING" = "false" ] && entry_exists "$EXAMPLES_OUT_FILE" "$test_base_name"; then
      continue
    fi

    if [ -x "$CREATE_TEST_SCRIPT" ]; then
      "$CREATE_TEST_SCRIPT" "$file"
    else
      bash "$CREATE_TEST_SCRIPT" "$file"
    fi

    example_entries+=("  {
    input: '${test_base_name}.calc',
    output: 'out-${test_base_name}.js',
    expected: 'expected-${test_base_name}.js',
    correctOut: 'correct-out-${test_base_name}.txt'
  }")
  fi
done < <(find "$INPUT_DIR" -type f -name "*.calc" -print0 | sort -z)

write_js_array() {
  local target_file="$1"
  local export_name="$2"
  local mode="$3" # "override" o "append"
  shift 3
  local items=("$@")

  if [ "${#items[@]}" -eq 0 ]; then
    echo "No entries to write for $target_file"
    return
  fi

  local joined=""
  for item in "${items[@]}"; do
    if [ -z "$joined" ]; then
      joined="$item"
    else
      joined="${joined},
${item}"
    fi
  done

  if [ "$mode" = "append" ] && [ -f "$target_file" ]; then
    local existing_body
    existing_body="$(sed -n '/^export const /,$p' "$target_file" | sed '1d;$d')"
    if [ -n "$existing_body" ]; then
      joined="${existing_body},
${joined}"
    fi
  fi

  {
    printf 'export const %s = [\n' "$export_name"
    printf '%s\n' "$joined"
    printf '];\n'
  } > "$target_file"

  echo "Updated $target_file"
}

if [ "$OVERRIDE_EXISTING" = "true" ]; then
  write_js_array "$EXAMPLES_OUT_FILE" "TestExample" "override" "${example_entries[@]+"${example_entries[@]}"}"
  write_js_array "$ERRORS_OUT_FILE" "TestErrorSyntax" "override" "${error_entries[@]+"${error_entries[@]}"}"
else
  write_js_array "$EXAMPLES_OUT_FILE" "TestExample" "append" "${example_entries[@]+"${example_entries[@]}"}"
  write_js_array "$ERRORS_OUT_FILE" "TestErrorSyntax" "append" "${error_entries[@]+"${error_entries[@]}"}"
fi