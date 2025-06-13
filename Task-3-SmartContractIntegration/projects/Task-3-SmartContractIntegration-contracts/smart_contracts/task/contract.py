from algopy import ARC4Contract, arc4, UInt64, Txn

class MintSimulator(ARC4Contract):
    total_minted: UInt64
    total_bought: UInt64
    total_sold: UInt64
    whitelist_0: arc4.Address
    whitelist_1: arc4.Address
    whitelist_2: arc4.Address

    def __init__(self) -> None:
        self.total_minted = UInt64(0)
        self.total_bought = UInt64(0)
        self.total_sold = UInt64(0)
        self.whitelist_0 = arc4.Address()
        self.whitelist_1 = arc4.Address()
        self.whitelist_2 = arc4.Address()

    @arc4.abimethod
    def set_whitelist(
        self,
        addr0: arc4.Address,
        addr1: arc4.Address,
        addr2: arc4.Address
    ) -> None:
        self.whitelist_0 = addr0
        self.whitelist_1 = addr1
        self.whitelist_2 = addr2

    @arc4.abimethod
    def mint(self) -> arc4.Bool:
        sender: arc4.Address = arc4.Address(Txn.sender)
        if not (
            sender == self.whitelist_0 or
            sender == self.whitelist_1 or
            sender == self.whitelist_2
        ):
            return arc4.Bool(False)
        self.total_minted += UInt64(1)
        return arc4.Bool(True)

    @arc4.abimethod
    def buy(self) -> arc4.Bool:
        # Simulate a buy action (custom logic, e.g., increment a counter)
        self.total_bought += UInt64(1)
        return arc4.Bool(True)

    @arc4.abimethod
    def sell(self) -> arc4.Bool:
        # Simulate a sell action (custom logic, e.g., increment a counter)
        self.total_sold += UInt64(1)
        return arc4.Bool(True)

    @arc4.abimethod(readonly=True)
    def get_total_minted(self) -> arc4.UInt64:
        return arc4.UInt64(self.total_minted)

    @arc4.abimethod(readonly=True)
    def get_total_bought(self) -> arc4.UInt64:
        return arc4.UInt64(self.total_bought)

    @arc4.abimethod(readonly=True)
    def get_total_sold(self) -> arc4.UInt64:
        return arc4.UInt64(self.total_sold)
