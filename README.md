# Flow8 

Milestone-based escrow platform for freelancers and clients, powered by blockchain and AI verification. Built for the **MNEE Hackathon - Programmable Money for Agents, Commerce, and Automated Finance.**

## 📍 Contract Addresses (Ethereum Sepolia)
* **MNEE Stablecoin:** `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`
* **Flow8 Escrow Vault:** `0x632517F9BeEeE4eBAeF1fcE9F7f7a0f63Ef20CD3`


## What is Flow8?

Flow8 eliminates payment disputes in the gig economy by using smart contracts to hold funds in escrow and AI to verify milestone completion. When milestones are verified, payments release automatically—no delays, no disputes.

## ✨ Features

- **Double-Locked Escrow**: Secure ERC-20 `approve` and `lockFunds` workflow for maximum safety.
- **Unified Authentication**: Powered by **Privy**, supporting login via Email, Socials, or EVM Wallets (MetaMask, Coinbase, etc.).
- **Milestone Tracking**: Granular project management with individual payment triggers.
- **MNEE Stablecoin**: Native integration with MNEE for 1:1 USD stable value, avoiding crypto volatility.
- **AI Verification**: (In Progress) Automated deliverable checking for code repositories and digital assets.
- **On-Chain Transparency**: Real-time tracking of funds from deposit to release via Etherscan.

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Authentication**: Privy (EVM & Social Login)
- **Blockchain**: Ethereum / EVM-compatible (Sepolia Testnet for development)
- **Smart Contract Logic**: Solidity / Ethers.js v6
- **Payments**: MNEE Stablecoin (ERC-20)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An EVM-compatible wallet or a Privy-supported social account

### Installation
```bash
# Clone the repository
git clone [https://github.com/Zeegaths/Flow8.git](https://github.com/Zeegaths/Flow8.git)
cd Flow8

# Install dependencies
npm install

# Create environment file
cp .env.example .env