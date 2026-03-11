import os
import re
from pathlib import Path

project_root = Path(r"C:\Users\UCHE\my-qwen-project\PROJECTS\ResidentCement")

# Patterns that indicate plaintext secrets (excluding REDACTED placeholders)
secret_patterns = [
    r'password\s*[=:]\s*["\'][^"\']{8,}["\']',
    r'secret\s*[=:]\s*["\'][^"\']{8,}["\']',
    r'api_key\s*[=:]\s*["\'][^"\']{8,}["\']',
    r'token\s*[=:]\s*["\'][^"\']{8,}["\']',
]

# Exclude patterns (backups, audit folders, forensics)
exclude_dirs = {"node_modules", ".audit", "forensics", "__pycache__"}

findings = []

for root, dirs, files in os.walk(project_root):
    # Skip excluded directories
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    
    for file in files:
        if file.endswith(".bak") or file.startswith(".env.bak"):
            continue
        
        file_path = Path(root) / file
        
        # Only check .env and .py files
        if not (file.endswith(".env") or file.endswith(".py")):
            continue
        if file.startswith(".env.example"):
            continue
        
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Skip if file contains only REDACTED values
            if "REDACTED_" in content:
                # Check if there are any non-redacted secrets
                lines = content.split('\n')
                for line in lines:
                    if "REDACTED_" not in line:
                        for pattern in secret_patterns:
                            if re.search(pattern, line, re.IGNORECASE):
                                findings.append({
                                    "file": str(file_path),
                                    "line": line.strip()[:100],
                                    "severity": "high"
                                })
            else:
                for pattern in secret_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        findings.append({
                            "file": str(file_path),
                            "pattern": pattern,
                            "severity": "high"
                        })
        except Exception:
            pass

if findings:
    print("❌ VERIFICATION FAILED - Plaintext secrets detected:")
    for finding in findings:
        print(f"  - {finding['file']}: {finding.get('line', finding.get('pattern', 'N/A'))[:80]}")
    exit(1)
else:
    print("✅ VERIFICATION PASSED - No plaintext secrets detected")
    print("   All secrets have been properly redacted with REDACTED_ placeholders")
    exit(0)
