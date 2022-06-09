import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  opt: process.env.OPT || './opt/logs',
  ultimateAiUrl: process.env.Ai_URL || "https://www.good.bye.com/utimate/intents",
  ultimateAiAuthorization: process.env.Ai_AUTHORIZATION || "gshgshh",

  database: {
    authSource:process.env.DATABASE_AUTH_SOURCE || 'admin',
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'host.docker.internal',
    port:process.env.DATABASE_PORT || '27017',
    name:process.env.DATABASE_NAME || 'ultimate'
  },
  development: process.env.NODE_ENV === 'development',
  production: process.env.NODE_ENV === 'production'
};
