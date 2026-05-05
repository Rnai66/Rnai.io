const fs = require('fs');

const f = fs.readFileSync('/Users/chanakhongdi/Downloads/rnai-io-firebase-adminsdk-fbsvc-65cdce7c99.json', 'utf-8');
const data = JSON.parse(f);

let envLocal = fs.readFileSync('/Users/chanakhongdi/Downloads/rnai-platform/.env.local', 'utf-8');

envLocal += `\nFIREBASE_ADMIN_PROJECT_ID="${data.project_id}"\n`;
envLocal += `FIREBASE_ADMIN_CLIENT_EMAIL="${data.client_email}"\n`;
// Replace actual newlines with literal \\n for the env file
envLocal += `FIREBASE_ADMIN_PRIVATE_KEY="${data.private_key.replace(/\n/g, '\\n')}"\n`;

fs.writeFileSync('/Users/chanakhongdi/Downloads/rnai-platform/.env.local', envLocal);
console.log('Successfully updated .env.local');
