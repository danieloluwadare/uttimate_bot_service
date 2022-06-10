import dotenv from 'dotenv';

dotenv.config();

export default {
    app_in_dockerized_state: process.env.APP_IN_DOCKERIZED_STATE || 'false',
    port: process.env.PORT || 3001,
    environment: process.env.NODE_ENV || 'development',
    opt: process.env.OPT || './opt/logs',
    ultimateAiUrl: process.env.Ai_URL || "https://api-dbank.free.beeceptor.com/utimate/intents",
    ultimateAiAuthorization: process.env.Ai_AUTHORIZATION || "headerAi",

    database: {
        url: process.env.DATABASE_URL,
        docker: process.env.DOCKER_DATABASE_URL
    },
    development: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production'
};
