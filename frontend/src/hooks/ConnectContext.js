import { useState, createContext, useEffect } from "react";
import Web3 from "web3";

const rpc = "https://matic-mumbai.chainstacklabs.com";
const targetChainId = '0x13881';
const targetChainName = "PolygonTestnet";

const ConnectContext = createContext();

export function ConnectProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    tryReconnect();
  }, []);

  const tryReconnect = () => {
    if (window.ethereum && window.ethereum.isMetaMask) connect();
  };

  const connect = async () => {
    let address;
    let web3;

    if (window.ethereum) {

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: targetChainId,
                  rpcUrls: [rpc],
                  chainName: targetChainName,
                },
              ],
            });
          } catch (addError) {}
        }
      }
      web3 = new Web3(window.ethereum);
      address = accounts[0];
      setAddress(address);
      setWallet(web3);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setWallet(null);
  };

  return (
    <ConnectContext.Provider value={{ address, wallet, connect, disconnect }}>
      {children}
    </ConnectContext.Provider>
  );
}

export default ConnectContext;
