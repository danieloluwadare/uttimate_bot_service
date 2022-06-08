import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  opt: process.env.OPT || './opt/logs',
  ultimateAiUrl: process.env.Ai_URL || "https://www.good.bye.com/utimate/intents",
  ultimateAiAuthorization: process.env.Ai_AUTHORIZATION || "gshgshh",

  database: {
    url: process.env.DATABASE_URL,
    testUrl: process.env.TEST_DATABASE_URL,
    host: process.env.DATABASE_HOST || 'host.docker.internal',
  },
};
