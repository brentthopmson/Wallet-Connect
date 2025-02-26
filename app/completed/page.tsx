"use client";

import { useState, useEffect } from 'react';
import { Web3Provider } from "@walletconnect/web3-provider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

export default function WalletConnectPage() {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initWalletConnect = async () => {
      const walletProvider = new Web3Provider({
        projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect Project ID
        relayUrl: "wss://relay.walletconnect.com",
        metadata: {
          name: "Your App Name",
          description: "Your App Description",
          url: "https://yourapp.com",
          icons: ["https://yourapp.com/icon.png"],
        },
      });

      setProvider(walletProvider);

      walletProvider.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }

        const { accounts } = payload.params[0];
        setAccounts(accounts);
        setConnected(true);
        setLoading(false);
      });

      walletProvider.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }

        const { accounts } = payload.params[0];
        setAccounts(accounts);
      });

      walletProvider.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }

        setConnected(false);
        setAccounts([]);
      });

      await walletProvider.connect();
    };

    initWalletConnect();
  }, []);

  const handleOpenWallet = () => {
    if (provider) {
      provider.connector.uri && window.open(`wc:${provider.connector.uri}`, '_blank');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-6 lg:p-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">WalletConnect Integration</h2>
          {connected ? (
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Connected to WalletConnect with the following accounts:
              </p>
              <ul className="list-disc list-inside text-lg text-gray-600 dark:text-gray-400">
                {accounts.map((account, index) => (
                  <li key={index}>{account}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please click the button below to open your WalletConnect-compatible wallet and connect.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleOpenWallet}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Open WalletConnect
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Action Required</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please connect your wallet to proceed with the dApp functionalities.
          </p>
        </section>

        {/* Contact Information Block */}
        <div className="w-full max-w-7xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Contact Us Directly
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you have any immediate questions, you can reach us using the following methods:
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="text-blue-600 h-6 w-6 mr-2" />
              <a href="tel:+13322692147" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                +1 (332) 269 2147
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 h-6 w-6 mr-2" />
              <a href="mailto:recruiting@radiateresources.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                recruiting@radiateresources.com
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 h-6 w-6 mr-2" />
              <p className="text-gray-600 dark:text-gray-400">
                Available Monday to Friday, 8 AM - 7 PM (EST)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}