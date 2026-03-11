import re
from pathlib import Path

project_root = Path(r"C:\Users\UCHE\my-qwen-project\PROJECTS\ResidentCement")

# Find docker-compose files
compose_files = list((project_root / "infrastructure" / "docker").glob("docker-compose*.yml"))

print(f"Found {len(compose_files)} docker-compose files")

# Update each file
for compose_file in compose_files:
    with open(compose_file, "r") as f:
        content = f.read()
    
    original = content
    
    # Replace hardcoded passwords with env var references
    replacements = [
        (r'(POSTGRES_PASSWORD:)\s*\S+', r'\1 ${DB_PASSWORD:-REDACTED_MVP}'),
        (r'(MONGO_INITDB_ROOT_PASSWORD:)\s*\S+', r'\1 ${MONGO_PASSWORD:-REDACTED_MVP}'),
        (r'(JWT_SECRET:)\s*\S+', r'\1 ${JWT_SECRET:-REDACTED_MVP}'),
        (r'(API_KEY:)\s*\S+', r'\1 ${API_KEY:-REDACTED_MVP}'),
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    
    if content != original:
        with open(compose_file, "w") as f:
            f.write(content)
        print(f"Updated: {compose_file}")
    else:
        print(f"No changes: {compose_file}")

print("\nDocker-compose env reference update complete")
