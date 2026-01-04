#!/bin/bash

# Bundles instructions and skills into a single context file for Gemini
# Must be run from project root

OUTPUT_FILE=".agent/gemini_context.md"

# Ensure we are in project root
if [ ! -d ".agent" ]; then
  echo "Error: .agent directory not found. Please run from project root."
  exit 1
fi

echo "Bundling instructions for Gemini..."

echo "# Persona: Complete Instructions for Gemini" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "You are an AI assistant helping users build a unique portfolio website from scratch." >> "$OUTPUT_FILE"
echo "Below are your core instructions and all necessary skills combined into one context." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## Gemini Operational Protocol" >> "$OUTPUT_FILE"
echo "Because you have the full project context loaded, you must strictly adhere to this sequential workflow to stay focused:" >> "$OUTPUT_FILE"
echo "1. **Phase 1: Analysis** - Read the profile and materials. Do not generate code yet. Output a summary of your understanding." >> "$OUTPUT_FILE"
echo "2. **Phase 2: Design Strategy** - Propose a visual direction based on the 'Design' skill. **STOP** and wait for user approval." >> "$OUTPUT_FILE"
echo "3. **Phase 3: Implementation** - Only after approval, build the site file-by-file. Focus on one component/section at a time." >> "$OUTPUT_FILE"
echo '4. **Phase 4: Verification** - Run `npm run build` (auto-clears cache) and fix any errors.' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**CRITICAL:** Do not skip ahead. Do not hallucinate files that don't exist. Always check your current phase." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo '**CACHE RECOVERY:** If you encounter "Cannot find module lightningcss" or similar Turbopack/native module errors, run `npm run clean` then retry. The build script auto-clears cache, but dev server may need manual cleanup if cache corrupts during rapid file edits.' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## Core Instructions" >> "$OUTPUT_FILE"
cat .agent/instructions.md >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## Skills Reference" >> "$OUTPUT_FILE"
echo "The following skills are available to you and should be applied as needed." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for file in .agent/skills/*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        skill_name="${filename%.*}"
        echo "### Skill: $skill_name" >> "$OUTPUT_FILE"
        echo "Content from $file:" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "---" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Include profile.yaml if it exists, otherwise warn
if [ -f "profile.yaml" ]; then
    echo "## User Profile Configuration" >> "$OUTPUT_FILE"
    echo "This is the current configuration set by the user (profile.yaml):" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`yaml" >> "$OUTPUT_FILE"
    cat "profile.yaml" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
elif [ -f "profile.example.yaml" ]; then
     echo "## User Profile Configuration (EXAMPLE)" >> "$OUTPUT_FILE"
    echo "No 'profile.yaml' found. Using 'profile.example.yaml' as context." >> "$OUTPUT_FILE"
    echo "The user SHOULD have configured this, but hasn't yet." >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`yaml" >> "$OUTPUT_FILE"
    cat "profile.example.yaml" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
else
    echo "WARNING: No profile.yaml found."
fi

echo "End of bundled instructions." >> "$OUTPUT_FILE"

echo "Created $OUTPUT_FILE"
