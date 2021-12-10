const { writeFile } = require('fs');
const { argv } = require('yargs');

require('dotenv').config();

const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

if (
  !process.env.FBASE_API_KEY ||
  !process.env.FBASE_AUTH_DOMAIN ||
  !process.env.FBASE_DATABASE_URL ||
  !process.env.FBASE_PROJECT_ID ||
  !process.env.FBASE_STORAGE_BUCKET ||
  !process.env.FBASE_MESSAGING_SENDER_ID
) {
  console.error("\x1b[31m", 'All the required environment variables were not provided!');
  console.error("\x1b[31m", 'Are you sure that you included the .env file?', "\x1b[0m");
  process.exit(-1);
}

const environmentProps = {
  production: isProduction,
  firebaseConf: {
    apiKey: process.env.FBASE_API_KEY,
    authDomain: process.env.FBASE_AUTH_DOMAIN,
    databaseURL: process.env.FBASE_DATABASE_URL,
    projectId: process.env.FBASE_PROJECT_ID,
    storageBucket: process.env.FBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FBASE_MESSAGING_SENDER_ID,
  },
};

const environmentFileContent = `
    export const environment = ${JSON.stringify(environmentProps)};
`;

writeFile(targetPath, environmentFileContent, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("\x1b[32m", `Wrote variables to ${targetPath}`, "\x1b[0m");
});
