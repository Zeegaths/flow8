import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Flow8 Backend API', status: 'healthy' });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json({ success: true, projects: result.rows });
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, project: result.rows[0] });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, clientAddress, freelancerAddress, totalAmount, milestones } = req.body;
    
    const result = await pool.query(
      `INSERT INTO projects (title, description, client_address, freelancer_address, total_amount, status, milestones, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [title, description, clientAddress, freelancerAddress, totalAmount, 'pending', JSON.stringify(milestones)]
    );

    res.json({ success: true, project: result.rows[0] });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update milestone
app.patch('/api/milestones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // For now, just return success
    // In production, update the milestone in the projects table
    res.json({ success: true, milestone: { id, ...updates } });
  } catch (error: any) {
    console.error('Update milestone error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});