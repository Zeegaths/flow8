# Flow8 

Milestone-based escrow platform for freelancers and clients, powered by blockchain and AI verification.

## Contract Addresses:
0x9242d46eA52140859aa3AC7FD9CC2C7f6E2290fC
0x632517F9BeEeE4eBAeF1fcE9F7f7a0f63Ef20CD3

## What is Flow8?

Flow8 eliminates payment disputes in the gig economy by using smart contracts to hold funds in escrow and AI to verify milestone completion. When milestones are verified, payments release automatically—no delays, no disputes.

## Features

- **Smart Contract Escrow**: Secure fund holding with automated release
- **Bitcoin Wallet Integration**: Connect with Leather, Xverse, or UniSat
- **Milestone Tracking**: Break projects into verifiable milestones
- **MNEE Stablecoin**: Stable payments without crypto volatility
- **AI Verification**: (Coming soon) Automated deliverable checking
- **Transparent**: All transactions on-chain and auditable

##  Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Bitcoin (via Stacks)
- **Wallets**: Leather, Xverse, UniSat
- **Payments**: MNEE Stablecoin

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Bitcoin wallet (Leather, Xverse, or UniSat)

### Installation
```bash
# Clone the repository
git clone https://github.com/Zeegaths/Flow8.git
cd Flow8

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure
```
Flow8/
├── src/
│   ├── components/       # React components
│   │   ├── layout/       # Navbar, Footer, etc.
│   │   └── pages/        # Page components
│   ├── services/         # Blockchain & API services
│   │   ├── WalletService.ts
│   │   ├── MNEEService.ts
│   │   └── BackendService.ts
│   └── App.tsx
├── .env.example          # Environment template
└── package.json
```

## 🔧 Configuration

Copy `.env.example` to `.env` and configure:
```bash
VITE_NETWORK=testnet
VITE_MNEE_CONTRACT_ADDRESS=your_contract_here
VITE_ESCROW_CONTRACT_ADDRESS=your_contract_here
VITE_RPC_ENDPOINT=your_rpc_endpoint
```

## 🎮 Usage

1. **Connect Wallet**: Click "Connect Wallet" and choose your Bitcoin wallet
2. **Create Project**: Set up project with milestones and payment amounts
3. **Deposit Funds**: Client deposits MNEE to escrow contract
4. **Complete Milestones**: Freelancer submits deliverables
5. **Verify & Release**: AI verifies, funds auto-release to freelancer

## 🚧 Roadmap

- [ ] Complete MNEE stablecoin integration
- [ ] Implement AI verification system
- [ ] Add dispute resolution mechanism
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Mobile app (iOS/Android)
- [ ] Integration with Upwork/Fiverr

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file


## 👥 Team

**Zee** - Founder & Lead Developer
- [GitHub](https://github.com/Zeegaths)
- [Twitter/X](https://x.com/gathoni_zarah)

## 🏆 Hackathon

Built for the MNEE Hackathon - Programmable Money for Agents, Commerce, and Automated Finance

## 📧 Contact

Questions? Reach out:
- Email: zarahgathoni76@gmail.com
- Discord: .gathoni

---

Built with 💜 for the future of freelance payments