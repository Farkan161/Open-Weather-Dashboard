import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/index.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('../client/dist'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(routes);

// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
