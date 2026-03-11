import os
import re
from pathlib import Path

project_root = Path(r"C:\Users\UCHE\my-qwen-project\PROJECTS\ResidentCement")

# Read placeholders
placeholders = {}
with open(project_root / "secure_placeholders.txt", "r") as f:
    for line in f:
        if "=" in line:
            key, value = line.strip().split("=", 1)
            placeholders[key] = value

print(f"Loaded {len(placeholders)} placeholders")

# Find all .env files (excluding backups, node_modules, audit folders)
env_files = []
for root, dirs, files in os.walk(project_root):
    # Skip node_modules, .audit, forensics folders
    if "node_modules" in root or ".audit" in root or "forensics" in root:
        continue
    for file in files:
        if file.startswith(".env") and not file.endswith(".bak"):
            full_path = Path(root) / file
            env_files.append(full_path)

print(f"Found {len(env_files)} .env files to process")

# Redact secrets
total_redactions = 0
for env_file in env_files:
    try:
        with open(env_file, "r") as f:
            content = f.read()
        
        original_content = content
        for key, placeholder in placeholders.items():
            # Match KEY=anything pattern
            pattern = rf"^{re.escape(key)}=.*$"
            if re.search(pattern, content, re.MULTILINE | re.IGNORECASE):
                content = re.sub(pattern, f"{key}={placeholder}", content, flags=re.MULTILINE | re.IGNORECASE)
                total_redactions += 1
        
        if content != original_content:
            with open(env_file, "w") as f:
                f.write(content)
            print(f"Redacted: {env_file}")
    except Exception as e:
        print(f"Error processing {env_file}: {e}")

print(f"\nTotal redactions: {total_redactions}")

# Verify redactions
redacted_count = 0
for root, dirs, files in os.walk(project_root):
    if "node_modules" in root or ".audit" in root or "forensics" in root:
        continue
    for file in files:
        if file.startswith(".env") and not file.endswith(".bak"):
            with open(Path(root) / file, "r") as f:
                if "REDACTED_" in f.read():
                    redacted_count += 1

print(f"Files with REDACTED_ placeholders: {redacted_count}")
