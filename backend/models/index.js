const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with Railway DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
});

// Project Model
const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  clientAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  freelancerAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'completed', 'disputed', 'cancelled'),
    defaultValue: 'pending',
  },
  escrowTxId: {
    type: DataTypes.STRING,
  },
});

// Milestone Model
const Milestone = sequelize.define('Milestone', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'in_progress',
      'submitted',
      'under_review',
      'verified',
      'paid',
      'disputed'
    ),
    defaultValue: 'pending',
  },
  deliverables: {
    type: DataTypes.JSONB,
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  submittedAt: {
    type: DataTypes.DATE,
  },
  verifiedAt: {
    type: DataTypes.DATE,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  releaseTxId: {
    type: DataTypes.STRING,
  },
  verificationMethod: {
    type: DataTypes.ENUM('ai', 'validator', 'client'),
    defaultValue: 'client',
  },
});

// Escrow Model
const Escrow = sequelize.define('Escrow', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  escrowAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  escrowWif: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  clientAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  released: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('locked', 'partially_released', 'fully_released', 'refunded'),
    defaultValue: 'locked',
  },
  lockTxId: {
    type: DataTypes.STRING,
  },
  lockedAt: {
    type: DataTypes.DATE,
  },
});

// Payment Model
const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  milestoneId: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.ENUM('escrow_lock', 'milestone_release', 'refund', 'validator_fee'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fromAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  txId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'failed'),
    defaultValue: 'pending',
  },
  confirmedAt: {
    type: DataTypes.DATE,
  },
});

// Define relationships
Project.hasMany(Milestone, { foreignKey: 'projectId', as: 'milestones' });
Milestone.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasOne(Escrow, { foreignKey: 'projectId', as: 'escrow' });
Escrow.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Payment, { foreignKey: 'projectId', as: 'payments' });
Payment.belongsTo(Project, { foreignKey: 'projectId' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: true });
    console.log('✅ Database tables created');
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Project,
  Milestone,
  Escrow,
  Payment,
  syncDatabase,
};