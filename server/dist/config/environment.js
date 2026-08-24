import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost/ner_landslide',
    mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
    isProduction: (process.env.NODE_ENV || 'development') === 'production',
};
//# sourceMappingURL=environment.js.map