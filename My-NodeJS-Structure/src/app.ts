import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cvRoutes from "./routes/cvRoutes.routes";

dotenv.config();

const app: Application = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

// Middleware
app.use(express.json());

// Register Routes
app.use('/userCv', cvRoutes);

// Debug: Log Registered Routes
app._router.stack.forEach((middleware: { route: { path: any; }; }) => {
  if (middleware.route) {
    console.log(`✅ Registered Route: ${middleware.route.path}`);
  }
});


export default app;
