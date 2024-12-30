# ClarityScribe: Decentralized Academic Credential Verification System

ClarityScribe is a blockchain-based solution for verifying academic credentials using the Stacks blockchain and Clarity smart contracts. The system implements a unique reputation staking mechanism where educational institutions stake their reputation to verify credentials.

## 🌟 Features

### Core Functionality
- **Institution Registration**: Educational institutions can register by staking STX tokens
- **Credential Issuance**: Registered institutions can issue verifiable academic credentials
- **Cross-Institution Verification**: Multiple institutions can verify and endorse credentials
- **Reputation System**: Dynamic reputation scoring based on network participation

### Security Features
- Stake-based participation ensures institutional accountability
- Multi-level verification system
- Immutable credential records
- Transparent verification history

## 🚀 Getting Started

### Prerequisites
- [Stacks CLI](https://docs.stacks.co/docs/cli/overview)
- [Clarinet](https://github.com/hirosystems/clarinet)
- Node.js and npm (for frontend development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/clarity-scribe.git
cd clarity-scribe
```

2. Install Clarinet:
```bash
curl -L https://install.clarinet.sh | sh
```

3. Initialize the project:
```bash
clarinet new
```

### Smart Contract Deployment

1. Test the contract:
```bash
clarinet test
```

2. Deploy to testnet:
```bash
clarinet deployment apply --testnet
```

## 📖 Usage

### For Institutions

```clarity
;; Register as an institution
(contract-call? .clarity-scribe register-institution "University Name")

;; Issue a credential
(contract-call? .clarity-scribe issue-credential 
    "CREDENTIAL-ID" 
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 
    "Bachelor of Science" 
    u2024 
    "https://metadata.url"
)
```

### For Students

```clarity
;; View credential
(contract-call? .clarity-scribe get-credential 
    "CREDENTIAL-ID" 
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)
```

### For Verifiers

```clarity
;; Endorse a credential
(contract-call? .clarity-scribe endorse-credential 
    "CREDENTIAL-ID" 
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)
```

## 🏗 Project Structure

```
clarity-scribe/
├── contracts/
│   └── clarity-scribe.clar
├── tests/
│   └── clarity-scribe_test.clar
├── frontend/
│   ├── src/
│   └── public/
└── README.md
```

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
clarinet test
```

## 🛣 Roadmap

### Phase 1: Core Features
- [x] Institution registration
- [x] Basic credential issuance
- [x] Verification system
- [x] Reputation tracking

### Phase 2: Enhanced Features
- [ ] Time-locked credential revocation
- [ ] Skill-based endorsements
- [ ] Professional certification integration
- [ ] Alumni networks

### Phase 3: Integration & Scaling
- [ ] Job market integration
- [ ] API development
- [ ] Mobile app development
- [ ] Cross-chain compatibility

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Stacks Foundation
- Clarity Community
- All contributing educational institutions
