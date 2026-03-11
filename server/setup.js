const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ El archivo server/.env ya existe. No se sobreescribirá.');
  process.exit(0);
}

const envContent = `PORT=5000
DB_USER=neondb_owner
DB_PASSWORD=npg_ne2baMdHYW6G
DB_HOST=ep-purple-shadow-aifiyie5-pooler.c-4.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_SSL=true
JWT_SECRET=super_secret_vinyl_horizon_key_change_me_in_productio
GEMINI_API_KEY=AIzaSyDn7da7kSKOeCaMaKRPff5C0WYLQ9vyOaU
`;

fs.writeFileSync(envPath, envContent);
console.log('✅ Archivo server/.env creado. Ya puedes levantar el servidor.');
