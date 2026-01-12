const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize'); // ADD THIS LINE
require('dotenv').config();
const { Project, Milestone, Escrow, Payment, syncDatabase } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
syncDatabase();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Flow8 Backend is running!' });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Milestone, as: 'milestones' }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, projects });
  } catch (error) {
    console.error('Get projects failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get projects for a specific user (by wallet address)
app.get('/api/my-projects/:address', async (req, res) => {
  try {
    const { address } = req.params;

    // Find projects where user is either client OR freelancer
    const projects = await Project.findAll({
      where: {
        [Sequelize.Op.or]: [
          { clientAddress: address },
          { freelancerAddress: address }
        ]
      },
      include: [
        { model: Milestone, as: 'milestones' },
        { model: Escrow, as: 'escrow' }
      ],
      order: [['createdAt', 'DESC']],
    });

    // Separate into client and freelancer projects
    const clientProjects = projects.filter(p => p.clientAddress === address);
    const freelancerProjects = projects.filter(p => p.freelancerAddress === address);

    res.json({ 
      success: true, 
      projects: {
        asClient: clientProjects,
        asFreelancer: freelancerProjects,
        all: projects
      }
    });
  } catch (error) {
    console.error('Get my projects failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: Milestone, as: 'milestones' },
        { model: Escrow, as: 'escrow' },
        { model: Payment, as: 'payments' },
      ],
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    console.error('Get project failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    const { id, clientAddress, freelancerAddress, title, description, totalAmount, milestones } =
      req.body;

    const project = await Project.create({
      id,
      clientAddress,
      freelancerAddress,
      title,
      description,
      totalAmount,
      status: 'pending',
    });

    if (milestones && milestones.length > 0) {
      await Milestone.bulkCreate(
        milestones.map((m) => ({
          ...m,
          projectId: id,
        }))
      );
    }

    const fullProject = await Project.findByPk(id, {
      include: [{ model: Milestone, as: 'milestones' }],
    });

    res.json({ success: true, project: fullProject });
  } catch (error) {
    console.error('Create project failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update milestone
app.patch('/api/milestones/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) {
      return res.status(404).json({ success: false, error: 'Milestone not found' });
    }

    await milestone.update(req.body);
    res.json({ success: true, milestone });
  } catch (error) {
    console.error('Update milestone failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Flow8 Backend running on port ${PORT}`);
  console.log(`💾 Database configured`);
});