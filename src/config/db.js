const mongoose = require('mongoose');

const MONGO_DB_URI = process.env.MONGO_DB_URI;
if (!MONGO_DB_URI) {
  console.log(MONGO_DB_URI);
  console.error('❌ MONGO_DB_URI no está definido en las variables de entorno.');
  // do not exit here to keep the module importable in non-production contexts
}

async function connect() {
  if (mongoose.connection.readyState === 1) return mongoose;
  try {
  await mongoose.connect(MONGO_DB_URI);
    console.log('✅ Conectado a MongoDB');
    return mongoose;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    throw error;
  }
}

async function ping() {
  // Ensure connection
  if (mongoose.connection.readyState !== 1) {
    await connect();
  }
  // Mongoose doesn't expose ping directly; use the native driver
  const admin = mongoose.connection.db.admin();
  const res = await admin.ping();
  return res;
}

module.exports = {
  mongoose,
  connect,
  ping,
};