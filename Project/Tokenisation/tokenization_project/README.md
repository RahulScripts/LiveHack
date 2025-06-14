# Algorand Tokenization Project

This project demonstrates the creation and management of tokens on the Algorand blockchain using Python.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your Algorand node:
   - For development, you can use the Algorand Sandbox or a local node
   - Update the `ALGOD_ADDRESS` and `ALGOD_TOKEN` in `config.py` if needed

3. Create a `.env` file in the project root with your account mnemonic (optional):
```
ACCOUNT_MNEMONIC="your 25-word mnemonic phrase here"
```

## Project Structure

- `config.py`: Configuration settings and utility functions
- `token_manager.py`: Main token management functionality
- `example.py`: Example usage of the token manager

## Features Implemented (Task 1)

- Token creation with configurable parameters
- Token transfer functionality
- Balance checking
- Asset management roles (manager, reserve, freeze, clawback)

## Usage

Run the example script to create and transfer tokens:
```bash
python example.py
```

## Next Steps

The following tasks will be implemented in future updates:
- Task 2: ARC-53 metadata and asset role management
- Task 3: Smart contract integration
- Task 4: User application
- Task 5: Token recovery system
- Task 6: Advanced features and integrations

## Security Notes

- Never commit your private keys or mnemonics
- Always use testnet for development
- Keep your `.env` file secure and never share it
