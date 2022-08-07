import React from "react";

export default function NavChain({ connectWalletPressed, walletAddress }) {
  return (
    <div className="col-xl-7 col-md-8 offset-xl-1">
      <button onClick={connectWalletPressed}>
        {walletAddress && walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
    </div>
  );
}
