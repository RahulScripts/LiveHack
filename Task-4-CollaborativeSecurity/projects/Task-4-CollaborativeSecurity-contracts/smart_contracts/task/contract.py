from algokit_utils import (
    AlgorandClient,
    AlgoAmount,
    MultisigMetadata,
)
from algosdk.transaction import AssetConfigTxn, AssetTransferTxn

# --- SETUP ---

# Connect to LocalNet (loranet) using AlgoKit's default settings
algorand_client = AlgorandClient.default_localnet()

# Use KMD to get or create three accounts
account_a = algorand_client.account.from_kmd("account_a")
account_b = algorand_client.account.from_kmd("account_b")
account_c = algorand_client.account.from_kmd("account_c")

# Create a 2-of-3 multisig account
multisig_account = algorand_client.account.multisig(
    metadata=MultisigMetadata(
        version=1,
        threshold=2,
        addresses=[
            account_a.address,
            account_b.address,
            account_c.address,
        ],
    ),
    signing_accounts=[account_a, account_b, account_c],
)

# Fund the multisig account for fees (using account_a as the funder)
algorand_client.account.ensure_funded(
    multisig_account.address, account_a, AlgoAmount(algo=10)
)

# --- CREATE AN ASA AND ASSIGN MULTISIG AS CLAWBACK ---

params = algorand_client.client.suggested_params()

txn = AssetConfigTxn(
    sender=account_a.address,
    sp=params,
    total=1000000,
    default_frozen=False,
    unit_name="MSGTKN",
    asset_name="MultisigToken",
    manager=account_a.address,
    reserve=account_a.address,
    freeze=account_a.address,
    clawback=multisig_account.address,  # Assign multisig as clawback
    decimals=0,
)

signed_txn = txn.sign(account_a.private_key)
txid = algorand_client.client.send_transaction(signed_txn)
result = algorand_client.client.pending_transaction_info(txid)
asa_id = result["asset-index"]

print(f"Created ASA with ID: {asa_id}")

# --- OPT-IN AND CLAWBACK ---

# Opt-in account_b to the ASA
optin_txn = AssetTransferTxn(
    sender=account_b.address,
    sp=algorand_client.client.suggested_params(),
    receiver=account_b.address,
    amt=0,
    index=asa_id,
)
signed_optin = optin_txn.sign(account_b.private_key)
algorand_client.client.send_transaction(signed_optin)

# Clawback: transfer 10 tokens from account_a to account_b using multisig
clawback_txn = AssetTransferTxn(
    sender=multisig_account.address,
    sp=algorand_client.client.suggested_params(),
    receiver=account_b.address,
    amt=10,
    index=asa_id,
    revocation_target=account_a.address,
)

# Sign the transaction with the multisig account (requires 2 signatures)
signed_clawback_txn = multisig_account.signer(clawback_txn)
algorand_client.client.send_transaction(signed_clawback_txn)

print("Clawback transaction sent successfully.")
