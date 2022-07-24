import React from "react";
import Minter from "./Minter";
import { useState, useEffect } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";

export default function Global() {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState();
  const [chainID, setChainID] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);

      addWalletListener();
      detectChain();
    }
    fetchData();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  async function detectChain() {
    const cid = await window.ethereum.request({
      method: "eth_chainId",
    });
    setChainID(cid);

    window.ethereum.on("chainChanged", (_chainId) => {
      //window.location.reload();
      setChainID(_chainId);
      console.log(_chainId);
    });
  }

  const addWalletListener = () => {
    if (window.ethereum.request.ethereum) {
      window.ethereum.request.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  };

  return (
    <div>
      <Minter
        walletAddress={walletAddress}
        connectWalletPressed={connectWalletPressed}
      />
    </div>
  );
}
