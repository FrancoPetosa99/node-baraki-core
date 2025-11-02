require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';

const jwtSecret = process.env.JWT_SECRET;
const bcryptSaltRounds = process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 10;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const dbUri = process.env.DB_URI || process.env.MONGO_URI || null;

// Fail fast in production if critical secrets are missing
if (NODE_ENV === 'production' && (!jwtSecret || jwtSecret.length === 0)) {
  throw new Error('Missing required environment variable JWT_SECRET in production');
}

module.exports = {
  nodeEnv: NODE_ENV,
  jwtSecret: jwtSecret || 'supersecretdevkey', // dev fallback
  bcryptSaltRounds,
  port,
  dbUri
};
