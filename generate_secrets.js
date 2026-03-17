const crypto = require('crypto');

console.log('DB_PASSWORD=' + crypto.randomBytes(24).toString('base64url'));
console.log('MONGO_PASSWORD=' + crypto.randomBytes(24).toString('base64url'));
console.log('REDIS_PASSWORD=' + crypto.randomBytes(16).toString('base64url'));
console.log('JWT_SECRET=' + crypto.randomBytes(48).toString('base64url'));
console.log('API_KEY=' + crypto.randomBytes(32).toString('hex'));
console.log('MINIO_PASSWORD=' + crypto.randomBytes(16).toString('base64url'));
console.log('KEYCLOAK_PASSWORD=' + crypto.randomBytes(16).toString('base64url'));
