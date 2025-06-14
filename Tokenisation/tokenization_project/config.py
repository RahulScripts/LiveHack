from algosdk.v2client import algod
from algosdk import account, mnemonic
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Algorand node configuration
ALGOD_ADDRESS = "http://localhost:4001"
ALGOD_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

# Asset configuration
ASSET_NAME = "MyToken"
ASSET_UNIT_NAME = "MTK"
TOTAL_SUPPLY = 1000000
DECIMALS = 6

# Initialize algod client
def get_algod_client():
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

# Generate or load account
def get_account():
    if os.getenv("ACCOUNT_MNEMONIC"):
        private_key = mnemonic.to_private_key(os.getenv("ACCOUNT_MNEMONIC"))
        return account.address_from_private_key(private_key), private_key
    else:
        private_key = account.generate_account()[0]
        return account.address_from_private_key(private_key), private_key
