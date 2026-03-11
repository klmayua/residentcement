import os
import re
from pathlib import Path

project_root = Path(r"C:\Users\UCHE\my-qwen-project\PROJECTS\ResidentCement")

# Track changes
changes_made = 0

# Walk through Python files (excluding node_modules, audit, forensics)
for root, dirs, files in os.walk(project_root):
    # Skip excluded directories
    if any(skip in root for skip in ["node_modules", ".audit", "forensics", "__pycache__"]):
        continue
    
    for file in files:
        if not file.endswith(".py"):
            continue
        
        file_path = Path(root) / file
        
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            original = content
            
            # Replace unsafe execute patterns with parametrized placeholder comments
            # Pattern 1: /* PARAMETERIZED_QUERY_REQUIRED */ execute("SELECT ... %s" % var)
            content = re.sub(
                r'(execute\s*\(\s*["\'].*?%s.*?["\'].*?%.*?\))',
                r'/* PARAMETERIZED_QUERY_REQUIRED */ \1',
                content
            )
            
            # Pattern 2: /* PARAMETERIZED_QUERY_REQUIRED */ execute(query + var)
            content = re.sub(
                r'(execute\s*\([^)]*\+[^)]*\))',
                r'/* PARAMETERIZED_QUERY_REQUIRED */ \1',
                content
            )
            
            # Pattern 3: .format( in SQL context
            content = re.sub(
                r'(["\']SELECT.*?["\']\.format\([^)]*\))',
                r'/* PARAMETERIZED_QUERY_REQUIRED */ \1',
                content,
                flags=re.IGNORECASE
            )
            
            if content != original:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                changes_made += 1
                print(f"Marked for parameterization: {file_path}")
        
        except Exception as e:
            pass

print(f"\nTotal files marked: {changes_made}")
print("Note: Manual review required for actual parametrization")
