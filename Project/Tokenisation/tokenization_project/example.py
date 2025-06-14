from token_manager import TokenManager
from algosdk import account

def main():
    # Create token manager instance
    token_manager = TokenManager()

    # Create new token
    print("Creating new token...")
    asset_id = token_manager.create_token()
    if not asset_id:
        print("Failed to create token")
        return

    # Generate a test receiver account
    receiver_private_key = account.generate_account()[0]
    receiver_address = account.address_from_private_key(receiver_private_key)
    print(f"\nReceiver address: {receiver_address}")

    # Transfer some tokens to the receiver
    transfer_amount = 1000
    print(f"\nTransferring {transfer_amount} tokens to receiver...")
    if token_manager.transfer_token(receiver_address, transfer_amount):
        print("Transfer successful!")

        # Check balances
        creator_balance = token_manager.get_token_balance(token_manager.creator_address)
        receiver_balance = token_manager.get_token_balance(receiver_address)

        print(f"\nCreator balance: {creator_balance}")
        print(f"Receiver balance: {receiver_balance}")

if __name__ == "__main__":
    main()
