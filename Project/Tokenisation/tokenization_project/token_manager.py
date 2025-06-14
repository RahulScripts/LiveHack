from algosdk.future import transaction
from algosdk import account
from config import get_algod_client, get_account, ASSET_NAME, ASSET_UNIT_NAME, TOTAL_SUPPLY, DECIMALS

class TokenManager:
    def __init__(self):
        self.algod_client = get_algod_client()
        self.creator_address, self.creator_private_key = get_account()
        self.asset_id = None

    def create_token(self):
        """Create a new token/ASA"""
        # Get network parameters
        params = self.algod_client.suggested_params()

        # Create asset creation transaction
        txn = transaction.AssetCreateTxn(
            sender=self.creator_address,
            sp=params,
            total=TOTAL_SUPPLY,
            decimals=DECIMALS,
            default_frozen=False,
            manager=self.creator_address,
            reserve=self.creator_address,
            freeze=self.creator_address,
            clawback=self.creator_address,
            unit_name=ASSET_UNIT_NAME,
            asset_name=ASSET_NAME,
            url="",  # Will be updated with IPFS URL in Task 2
            note=None
        )

        # Sign transaction
        signed_txn = txn.sign(self.creator_private_key)

        # Submit transaction
        try:
            txid = self.algod_client.send_transaction(signed_txn)
            print(f"Transaction ID: {txid}")

            # Wait for confirmation
            confirmed_txn = transaction.wait_for_confirmation(self.algod_client, txid, 4)
            self.asset_id = confirmed_txn["asset-index"]
            print(f"Asset ID: {self.asset_id}")
            return self.asset_id
        except Exception as e:
            print(f"Error creating asset: {e}")
            return None

    def transfer_token(self, receiver_address, amount):
        """Transfer tokens to another address"""
        if not self.asset_id:
            print("Asset not created yet")
            return False

        # Get network parameters
        params = self.algod_client.suggested_params()

        # Create transfer transaction
        txn = transaction.AssetTransferTxn(
            sender=self.creator_address,
            sp=params,
            receiver=receiver_address,
            amt=amount,
            index=self.asset_id
        )

        # Sign transaction
        signed_txn = txn.sign(self.creator_private_key)

        # Submit transaction
        try:
            txid = self.algod_client.send_transaction(signed_txn)
            print(f"Transfer Transaction ID: {txid}")

            # Wait for confirmation
            confirmed_txn = transaction.wait_for_confirmation(self.algod_client, txid, 4)
            print(f"Transfer confirmed in round {confirmed_txn['confirmed-round']}")
            return True
        except Exception as e:
            print(f"Error transferring asset: {e}")
            return False

    def get_token_balance(self, address):
        """Get token balance for an address"""
        if not self.asset_id:
            print("Asset not created yet")
            return 0

        try:
            account_info = self.algod_client.account_info(address)
            for asset in account_info.get("assets", []):
                if asset["asset-id"] == self.asset_id:
                    return asset["amount"]
            return 0
        except Exception as e:
            print(f"Error getting balance: {e}")
            return 0
