#!/bin/bash

# Usage: scripts/create-all-test.sh
# It must be executed from the root directory of the project.
#
# Finds all .calc files in the examples/ directory,
# runs create-test.sh for each file, and generates a test description file.

set -e  # Exit immediately if a command exits with a non-zero status.

# Configuration
INPUT_DIR="examples/"
OUTPUT_FILE="test/test-example-description.js"
ERROR_OUTPUT_FILE="test/test-error-description.js"
CREATE_TEST_SCRIPT="bin/test-scripts/create-test.sh" # Path to create-test.sh
CREATE_ERR_TEST_SCRIPT="bin/test-scripts/create-err-test.sh" # Path to create-err-test.sh
OVERRIDE_EXISTING="true" # Set to "true" to override existing entries

# Initialize the entries array
entries=()
error_entries=()

# Function to check if a test description entry exists
test_entry_exists() {
  local test_base_name="$1"
  grep -q "input: '${test_base_name}.calc'" "$OUTPUT_FILE"
}

# Function to check if an error test description entry exists
error_test_entry_exists() {
  local test_base_name="$1"
  grep -q "input: '${test_base_name}.calc'" "$ERROR_OUTPUT_FILE"
}

# Find all .calc files
for file in $(find "$INPUT_DIR" -name "*.calc"); do
  # Extract the base name of the file
  test_base_name=$(basename "$file" .calc)

  if [[ "$file" == *err* ]]; then
    # Check if the error test entry already exists
    if [ "$OVERRIDE_EXISTING" == "false" ] && error_test_entry_exists "$test_base_name"; then
      continue
    fi

    # Run create-err-test.sh
    $CREATE_ERR_TEST_SCRIPT "$file"
    echo "Finished running $CREATE_ERR_TEST_SCRIPT for $file"

    # Create the error test description entry
    error_entry="{
      input: '${test_base_name}.calc',
      output: 'outerr-${test_base_name}.txt',
      correctErr: 'correct-${test_base_name}.txt'
    }"

    # Append the entry to the error_entries array
    error_entries+=("$error_entry")
  else
    # Check if the test entry already exists
    if [ "$OVERRIDE_EXISTING" == "false" ] && test_entry_exists "$test_base_name"; then
      continue
    fi

    # Run create-test.sh
    $CREATE_TEST_SCRIPT "$file"
    echo "Finished running $CREATE_TEST_SCRIPT for $file"

    # Create the test description entry
    entry="{
      input: '${test_base_name}.calc',
      output: 'out-${test_base_name}.js',
      expected: 'expected-${test_base_name}.js',
      correctOut: 'correct-out-${test_base_name}.txt'
    }"

    # Append the entry to the entries array
    entries+=("$entry")
  fi
done

# Function to update the output file with new entries
update_output_file() {
  local output_file="$1"
  local new_entries=("${!2}")

  # Check if there are new entries
  if [ ${#new_entries[@]} -gt 0 ]; then
    # Read the existing content of the output file
    if [ -f "$output_file" ]; then
      existing_content=$(sed '$d' "$output_file")
    else
      existing_content="module.exports = ["
    fi

    # Generate the JavaScript code for the new entries
    js_code=""
    for entry in "${new_entries[@]}"; do
      js_code+="$entry,\n"
    done

    # Combine the existing content with the new entries
    combined_content="${existing_content}\n${js_code%\\n}\n]"

    # Write the combined content to the output file
    echo -e "$combined_content" > "$output_file"

    echo "Generated $output_file"
  else 
    echo "No new entries to add to $output_file"
  fi
}

# Function to override the output file with new entries
override_output_file() {
  local output_file="$1"
  local new_entries=("${!2}")

  # Check if there are new entries
  if [ ${#new_entries[@]} -gt 0 ]; then
    # Generate the JavaScript code for the new entries
    js_code="module.exports = [\n"
    for entry in "${new_entries[@]}"; do
      js_code+="$entry,\n"
    done
    js_code="${js_code%\\n}\n]"

    # Write the new entries to the output file
    echo -e "$js_code" > "$output_file"

    echo "Overwritten $output_file"
  else 
    echo "No new entries to add to $output_file"
  fi
}

# Update the output files with new entries or override existing entries
if [ "$OVERRIDE_EXISTING" == "true" ]; then
  override_output_file "$OUTPUT_FILE" entries[@]
  override_output_file "$ERROR_OUTPUT_FILE" error_entries[@]
else
  update_output_file "$OUTPUT_FILE" entries[@]
  update_output_file "$ERROR_OUTPUT_FILE" error_entries[@]
fi
