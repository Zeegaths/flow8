require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected');
    release();
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flow8 Backend API', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, projects: result.rows });
  } catch (error) {
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
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      clientAddress, 
      freelancerAddress, 
      totalAmount, 
      milestones 
    } = req.body;

    // Validate required fields
    if (!title || !clientAddress || !freelancerAddress || !totalAmount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    const result = await pool.query(
      `INSERT INTO projects (
        title, 
        description, 
        client_address, 
        freelancer_address, 
        total_amount, 
        status, 
        milestones, 
        created_at, 
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *`,
      [
        title, 
        description, 
        clientAddress, 
        freelancerAddress, 
        totalAmount, 
        'pending', 
        JSON.stringify(milestones || [])
      ]
    );

    res.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update milestone
app.patch('/api/milestones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // For demo: just return success
    // In production: update milestone in projects.milestones JSONB column
    res.json({ 
      success: true, 
      milestone: { id, ...updates, updated_at: new Date() } 
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initialize database tables
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        client_address VARCHAR(255) NOT NULL,
        freelancer_address VARCHAR(255) NOT NULL,
        total_amount NUMERIC NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        milestones JSONB,
        escrow_tx_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Flow8 Backend running on port ${PORT}`);
  await initDatabase();
});