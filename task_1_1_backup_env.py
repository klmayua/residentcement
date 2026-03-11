import os
import shutil
from pathlib import Path

# Target ResidentCement project
project_root = Path(r"C:\Users\UCHE\my-qwen-project\PROJECTS\ResidentCement")

# Find all .env files excluding node_modules
env_files = []
for root, dirs, files in os.walk(project_root):
    if "node_modules" in root:
        continue
    for file in files:
        if file.startswith(".env"):
            full_path = Path(root) / file
            env_files.append(full_path)

print(f"Found {len(env_files)} .env files")

# Backup each file
backed_up = 0
for env_file in env_files:
    backup_path = Path(str(env_file) + ".bak")
    try:
        shutil.copy2(env_file, backup_path)
        print(f"Backed up: {env_file}")
        backed_up += 1
    except Exception as e:
        print(f"Failed to backup {env_file}: {e}")

print(f"\nBackup complete: {backed_up}/{len(env_files)} files")
