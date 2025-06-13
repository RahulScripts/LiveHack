from algopy import *
from algopy.arc4 import abimethod


class Task(ARC4Contract):

    @abimethod
    def createAsset(self) -> UInt64:
        itxn_result = itxn.AssetConfig(
            total=100_00,
            decimals=5,
            unit_name="TestUnit",
            asset_name="TaskAsset",
        ).submit()

        return itxn_result.created_asset.id

    @abimethod
    def asset_opt_in(self, asset: Asset) -> None:
        itxn.AssetTransfer(
            asset_receiver=Global.current_application_address,
            xfer_asset=asset,
            asset_amount=0,
            fee=0,
        ).submit()

    @abimethod
    def assetTransfer(self, asset: Asset, receiver: Account, amount: UInt64) -> None:
        itxn.AssetTransfer(
            asset_receiver=receiver,
            xfer_asset=asset,
            asset_amount=amount,
            fee=0,
        ).submit()
