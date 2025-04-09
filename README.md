# DeFi Shield

DeFi Shield is a sophisticated protection application designed to detect and prevent value extraction attacks, with a special focus on sandwich trades in DeFi (Decentralized Finance) transactions. Built with React, Node.js, and Express, the application helps users identify malicious activities and secure their financial transactions in the blockchain ecosystem.

![DeFi Shield Dashboard](https://i.imgur.com/YOUR_SCREENSHOT_ID.png)

## Features

### Real-Time Attack Detection
- **Sandwich Attack Detection**: Identifies front-running and back-running transactions that squeeze user trades
- **Pattern Recognition**: Analyzes transaction sequences to detect common attack patterns
- **Confidence Scoring**: Provides a confidence level for each detected attack

### Transaction Analysis
- **Transaction Verification**: Analyze specific transactions using Venn IDs
- **Mock Analysis**: Demonstration feature showing sandwich attack detection capabilities
- **No-Threat Identification**: Clearly marks safe transactions as "No Threat"

### Monitoring & Visualization
- **Statistics Dashboard**: Real-time metrics on detected attacks, value at risk, and protected transactions
- **Attack Visualization**: Visual representation of sandwich attack patterns
- **Exchange Monitoring**: Tracks activity across multiple DeFi exchanges

### Protection Tools
- **Block Attackers**: Ability to add detected attackers to a block list
- **Watchlist**: Monitor specific addresses for suspicious activities
- **Transaction History**: Comprehensive log of analyzed transactions

## Technical Documentation

### Architecture
DeFi Shield follows a client-server architecture:
- **Frontend**: React application with TanStack Query for data fetching
- **Backend**: Express.js server with RESTful API endpoints
- **Storage**: In-memory database (can be extended to PostgreSQL)

### Project Structure
```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Application pages
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express server
│   ├── services/           # Business logic services
│   │   ├── blockchain.ts   # Blockchain interaction service
│   │   └── sandwich-detector.ts # Detection algorithms
│   ├── routes.ts           # API route definitions
│   └── storage.ts          # Data storage interface
└── shared/                 # Shared code between client and server
    └── schema.ts           # Data model definitions
```

### Key Components

#### Sandwich Attack Detection
The core of the application is the `sandwich-detector.ts` service, which:
- Analyzes transaction hash and block number
- Identifies related front-running and back-running transactions
- Calculates confidence scores based on multiple indicators
- Provides detailed explanations for detected patterns

#### Storage Interface
The application uses a flexible storage interface defined in `storage.ts` that:
- Maintains attack records, user information, and statistics
- Supports filtering by status, exchange, and other criteria
- Can be extended to use persistent databases

#### Real-Time Dashboard
The dashboard provides:
- Key metrics on attack frequency and value at risk
- Visualization of recent attack patterns
- Tools for interactive analysis of suspicious transactions

### Data Model

The application uses the following main data entities:

#### Attack
```typescript
{
  id: number;
  status: "Confirmed Attack" | "Potential Attack" | "False Positive" | "No Threat";
  exchange: string;
  tokenPair: string;
  valueExtracted: number;
  frontRunTxHash: string;
  victimTxHash: string;
  backRunTxHash: string;
  // Additional fields...
}
```

#### Statistics
```typescript
{
  totalAttacks: number;
  potentialAttacks: number;
  confirmedAttacks: number;
  valueAtRisk: number;
  protectedTransactions: number;
  monitoredDexs: number;
}
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/defi-shield.git
cd defi-shield
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser
```
http://localhost:5000
```

## Usage Guide

### Analyzing Transactions
1. Navigate to the Dashboard page
2. Enter a Venn ID (transaction hash) in the "Analyze Transaction" section
3. Click "Check" to analyze the transaction
4. View results in the "Recent Attack Detections" table

### Using the Mock Feature
1. Click the "Mock" button to simulate detecting a sandwich attack
2. Review the detected attack details in the dashboard
3. Examine the visualization of front-run and back-run patterns

### Managing Detected Attacks
1. Click "View Details" on any detected attack
2. Review the detailed transaction information
3. Use "Block Attacker" to add the address to your block list
4. Add to Watchlist to monitor the address for future activities

## Future Enhancements
- Integration with live blockchain data feeds
- Advanced machine learning algorithms for pattern detection
- Browser extension for real-time protection
- Mobile applications for on-the-go monitoring
- Multi-chain support across various blockchains

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- The Venn Network for their innovative approach to MEV protection
- The DeFi community for ongoing research into value extraction attacks