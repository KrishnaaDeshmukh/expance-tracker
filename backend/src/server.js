require('dotenv').config();
const app = require('./app');
require('./config/supabase');

const PORT = process.env.PORT || 5000;

const start = async () => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other process or change PORT in backend/.env.`);
      return;
    }

    throw error;
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
