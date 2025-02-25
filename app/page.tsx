"use client";

import React, { useState } from 'react';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

export default function Home() {
  // Change account state to hold an array of accounts
  const [accounts, setAccounts] = useState<string[]>([]);
  const [provider, setProvider] = useState<any>(null);

  const connectWallet = async () => {
    try {
      const walletConnectProvider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
        },
      });

      // This will open the wallet's connection interface
      await walletConnectProvider.enable();

      const web3 = new Web3(walletConnectProvider);
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      setProvider(walletConnectProvider);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const disconnectWallet = async () => {
    if (provider) {
      await provider.disconnect();
      setAccounts([]);
      setProvider(null);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Wallet Connect</h1>
        {accounts.length > 0 ? (
          <div className="text-center">
            <p className="mb-4">Connected Accounts:</p>
            <ul className="mb-4">
              {accounts.map((account, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                  {account}
                </li>
              ))}
            </ul>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </main>
  );
}
