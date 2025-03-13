import app from './app';
import http from 'http';
import { pool } from './providers/database';
import dotenv from 'dotenv';


dotenv.config();

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Ensure database connection before starting the server
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected');
    connection.release(); // Release the connection after testing

    // Start the server
    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
