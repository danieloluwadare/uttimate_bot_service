import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  opt: process.env.OPT || './opt/logs',
  ultimateAiUrl: "https://api-dbank.free.beeceptor.com/utimate/intents",
  ultimateAiAuthorization:  "headerAi",

  database: {
    url: process.env.DATABASE_URL,
    testUrl: process.env.TEST_DATABASE_URL,
    host: process.env.DATABASE_HOST || 'host.docker.internal',
  },
  development: process.env.NODE_ENV === 'development',
  production: process.env.NODE_ENV === 'production'
};
