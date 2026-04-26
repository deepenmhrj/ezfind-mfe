const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
const apiUrl = (process.env.EZFIND_API_URL || '').trim();
const googleClientId = (process.env.EZFIND_GOOGLE_CLIENT_ID || '').trim();

const fileContents = `export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(apiUrl)},
  googleClientId: ${JSON.stringify(googleClientId)},
};
`;

fs.writeFileSync(outputPath, fileContents);

