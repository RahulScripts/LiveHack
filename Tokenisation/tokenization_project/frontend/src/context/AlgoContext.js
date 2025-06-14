import React, { createContext, useContext, useState, useEffect } from 'react';
import algosdk from 'algosdk';
import { Algodv2 } from 'algosdk';

const AlgoContext = createContext();

export function AlgoProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);

  const algodClient = new Algodv2(
    process.env.REACT_APP_ALGOD_TOKEN,
    process.env.REACT_APP_ALGOD_SERVER,
    process.env.REACT_APP_ALGOD_PORT
  );

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (window.algorand) {
        const accounts = await window.algorand.enable();
        setAccount(accounts[0]);
        await initializeContract(accounts[0]);
      } else {
        setError('Algorand wallet not found. Please install MyAlgo or Pera Wallet.');
      }
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeContract = async (accountAddress) => {
    try {
      const contract = {
        get_balance: async (address) => {
          const accountInfo = await algodClient.accountInformation(address).do();
          const assetId = parseInt(process.env.REACT_APP_TOKEN_ID);
          const asset = accountInfo.assets.find(a => a['asset-id'] === assetId);
          return asset ? asset.amount : 0;
        },

        transfer_token: async (receiver, amount) => {
          const suggestedParams = await algodClient.getTransactionParams().do();
          const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            account,
            receiver,
            undefined,
            undefined,
            amount,
            undefined,
            parseInt(process.env.REACT_APP_TOKEN_ID),
            suggestedParams
          );

          const signedTxn = await window.algorand.signTransaction(txn);
          const { txId } = await algodClient.sendRawTransaction(signedTxn.blob).do();
          await algodClient.waitForConfirmation(txId, 3);
          return txId;
        },

        claim_certificate: async (courseId) => {
          const suggestedParams = await algodClient.getTransactionParams().do();
          const appArgs = [
            new Uint8Array(Buffer.from('claim_certificate')),
            new Uint8Array(Buffer.from(courseId))
          ];

          const txn = algosdk.makeApplicationCallTxnWithSuggestedParams(
            account,
            suggestedParams,
            parseInt(process.env.REACT_APP_APP_ID),
            appArgs,
            undefined,
            undefined,
            undefined,
            undefined
          );

          const signedTxn = await window.algorand.signTransaction(txn);
          const { txId } = await algodClient.sendRawTransaction(signedTxn.blob).do();
          await algodClient.waitForConfirmation(txId, 3);
          return txId;
        },

        burn_token: async (amount) => {
          const suggestedParams = await algodClient.getTransactionParams().do();
          const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            account,
            account, // Burn by sending to self
            undefined,
            undefined,
            amount,
            undefined,
            parseInt(process.env.REACT_APP_TOKEN_ID),
            suggestedParams
          );

          const signedTxn = await window.algorand.signTransaction(txn);
          const { txId } = await algodClient.sendRawTransaction(signedTxn.blob).do();
          await algodClient.waitForConfirmation(txId, 3);
          return txId;
        },

        recover_tokens: async (userId) => {
          const suggestedParams = await algodClient.getTransactionParams().do();
          const appArgs = [
            new Uint8Array(Buffer.from('recover_tokens')),
            new Uint8Array(Buffer.from(userId))
          ];

          const txn = algosdk.makeApplicationCallTxnWithSuggestedParams(
            account,
            suggestedParams,
            parseInt(process.env.REACT_APP_APP_ID),
            appArgs,
            undefined,
            undefined,
            undefined,
            undefined
          );

          const signedTxn = await window.algorand.signTransaction(txn);
          const { txId } = await algodClient.sendRawTransaction(signedTxn.blob).do();
          await algodClient.waitForConfirmation(txId, 3);
          return txId;
        }
      };

      setContract(contract);
      await updateBalance(accountAddress);
    } catch (err) {
      setError('Failed to initialize contract: ' + err.message);
    }
  };

  const updateBalance = async (address) => {
    try {
      const balance = await contract.get_balance(address);
      setTokenBalance(balance);
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  };

  useEffect(() => {
    if (account) {
      updateBalance(account);
    }
  }, [account]);

  return (
    <AlgoContext.Provider
      value={{
        account,
        tokenBalance,
        loading,
        error,
        contract,
        connectWallet,
      }}
    >
      {children}
    </AlgoContext.Provider>
  );
}

export function useAlgo() {
  const context = useContext(AlgoContext);
  if (!context) {
    throw new Error('useAlgo must be used within an AlgoProvider');
  }
  return context;
}
