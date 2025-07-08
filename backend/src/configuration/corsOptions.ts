export const corsOptions = {
  origin: (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:8080')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
  credentials: true,
};
