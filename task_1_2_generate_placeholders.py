import secrets

keys = ['DB_PASSWORD', 'API_KEY', 'JWT_SECRET', 'ENCRYPTION_KEY', 'WEBHOOK_TOKEN']

with open('secure_placeholders.txt', 'w') as f:
    for i, key in enumerate(keys):
        placeholder = f"{key}={{REDACTED_{i}}}_{secrets.token_hex(8)}"
        f.write(placeholder + '\n')
        print(placeholder)

print("\nGenerated secure_placeholders.txt")
