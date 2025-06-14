from algopy import ARC4Contract, String, UInt64, Account, GlobalState, LocalState, Txn, Global, itxn, Asset, op
from algopy.arc4 import abimethod, Bool

class CarbonCreditContract(ARC4Contract):
    def __init__(self) -> None:
        self.carbon_credit_interval = GlobalState(UInt64, key="carbon_credit_interval")  
        # Global States
        self.token_asset_id = GlobalState(UInt64, key="token_asset_id")
        self.total_supply = GlobalState(UInt64, key="total_supply")
        self.manager = GlobalState(Account, key="manager")
        self.reserve = GlobalState(Account, key="reserve")
        self.freeze = GlobalState(Account, key="freeze")
        self.clawback = GlobalState(Account, key="clawback")
        self.whitelist = GlobalState(Account, key="whitelist")
        self.last_mint_time = GlobalState(UInt64, key="last_mint_time")

        # Local States
        self.user_balance = LocalState(UInt64, key="balance")
        self.user_last_mint = LocalState(UInt64, key="last_mint")
        self.user_mint_count = LocalState(UInt64, key="mint_count")
        self.user_redemption_count = LocalState(UInt64, key="redeemed")
        self.user_token_history = LocalState(UInt64, key="history")
        self.opted_in = LocalState(Bool, key="opted_in")  # Track if user has opted in

    @abimethod
    def initialize(
        self,
        manager: Account,
        reserve: Account,
        freeze: Account,
        clawback: Account,
        total_supply: UInt64,
        asset_name: String,
        unit_name: String,
        decimals: UInt64,
        url: String
    ) -> UInt64:
        assert Txn.sender == Global.creator_address, "Only creator can initialize"
        assert self.token_asset_id.get(UInt64(0)) == UInt64(0), "Already initialized"

        self.token_asset_id.value = UInt64(1)
        self.total_supply.value = total_supply
        self.manager.value = manager
        self.reserve.value = reserve
        self.freeze.value = freeze
        self.clawback.value = clawback
        self.carbon_credit_interval.value = UInt64(86400)
        return self.token_asset_id.get(UInt64(0))
    @abimethod
    def set_whitelist(self, address: Account) -> None:
        assert Txn.sender == self.manager.get(Account()), "Only manager can set whitelist"
        self.whitelist.value = address

    @abimethod
    def opt_in_user(self, asset: Asset) -> None:
        sender = Txn.sender
        
        # Initialize user's local state if not already done
        if not self.opted_in.get(sender, Bool(False)):
            self.user_balance[sender] = UInt64(0)
            self.user_last_mint[sender] = UInt64(0)
            self.user_mint_count[sender] = UInt64(0)
            self.user_redemption_count[sender] = UInt64(0)
            self.user_token_history[sender] = UInt64(0)
            self.opted_in[sender] = Bool(True)

        # Create asset opt-in transaction
        itxn.AssetTransfer(
            asset_receiver=sender,
            xfer_asset=asset,
            asset_amount=UInt64(0),
            fee=UInt64(0)
        ).submit()

    @abimethod(readonly=True)
    def is_user_opted_in(self, user: Account) -> Bool:
        # Check if the user is opted in to the application
        return Bool(op.app_opted_in(user, Global.current_application_id))

    @abimethod
    def mint_token(self, amount: UInt64, receiver: Account) -> None:
        # Ensure receiver is opted in to the application
        assert op.app_opted_in(receiver, Global.current_application_id), "Receiver not opted in"
        assert Txn.sender == self.manager.get(Account()), "Only manager can mint"
        assert amount > UInt64(0), "Amount must be positive"

        current_time = Global.latest_timestamp
        last_mint = self.last_mint_time.get(UInt64(0))
        interval = self.carbon_credit_interval.get(UInt64(86400))  # fallback default
        assert current_time >= last_mint + interval, "Mint cooldown active"

        new_supply = self.total_supply.get(UInt64(0)) + amount
        self.total_supply.value = new_supply
        self.last_mint_time.value = current_time

        balance = self.user_balance.get(receiver, UInt64(0))
        self.user_balance[receiver] = balance + amount

    @abimethod
    def transfer_token(self, amount: UInt64, receiver: Account) -> None:
        sender = Txn.sender
        whitelist = self.whitelist.get(Account())
        if whitelist:
            assert sender == whitelist or receiver == whitelist, "Address not whitelisted"

        sender_balance = self.user_balance.get(sender, UInt64(0))
        assert sender_balance >= amount, "Insufficient balance"

        receiver_balance = self.user_balance.get(receiver, UInt64(0))
        self.user_balance[sender] = sender_balance - amount
        self.user_balance[receiver] = receiver_balance + amount

    @abimethod
    def redeem_token(self, amount: UInt64) -> None:
        sender = Txn.sender
        balance = self.user_balance.get(sender, UInt64(0))
        assert balance >= amount, "Insufficient balance"

        self.user_balance[sender] = balance - amount
        redeemed = self.user_redemption_count.get(sender, UInt64(0))
        self.user_redemption_count[sender] = redeemed + amount
        self.total_supply.value = self.total_supply.get(UInt64(0)) - amount

    @abimethod
    def recover_token(self, user_id: String) -> None:
        sender = Txn.sender
        mint_count = self.user_mint_count.get(sender, UInt64(0))
        last_mint = self.user_last_mint.get(sender, UInt64(0))
        assert mint_count < UInt64(2), "Recovery limit reached"
        cooldown = self.carbon_credit_interval.get(UInt64(86400))  # fallback to 86400 if not yet set
        assert Global.latest_timestamp >= last_mint + cooldown, "Cooldown active"

        self.mint_token(UInt64(100), sender)
        self.user_mint_count[sender] = mint_count + UInt64(1)
        self.user_last_mint[sender] = Global.latest_timestamp

    @abimethod
    def get_balance(self, account: Account) -> UInt64:
        return self.user_balance.get(account, UInt64(0))

    @abimethod
    def get_total_supply(self) -> UInt64:
        return self.total_supply.get(UInt64(0))

    @abimethod
    def freeze_account(self, target: Account) -> None:
        assert Txn.sender == self.freeze.get(Account()), "Only freeze account"
        # Placeholder for real freeze implementation

    @abimethod
    def clawback_tokens(self, target: Account, amount: UInt64) -> None:
        assert Txn.sender == self.clawback.get(Account()), "Only clawback"
        # Placeholder for real clawback logic

    @abimethod
    def get_user_redemptions(self, user: Account) -> UInt64:
        return self.user_redemption_count.get(user, UInt64(0))

    @abimethod
    def get_user_mint_count(self, user: Account) -> UInt64:
        return self.user_mint_count.get(user, UInt64(0))










