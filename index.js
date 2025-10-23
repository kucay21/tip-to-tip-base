import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");
  const tokenAddress = "0x586f3cb4a16c8dbf6a62b599a73eca9cd0b945fe"; // token kamu
  const defaultReceiver = "0x3f1888c74516B97d33FA3b71cE8d05E920bb0aA7"; // penerima default
  const abi = [
    "function transfer(address to, uint256 amount) public returns (bool)"
  ];

  async function connectWallet() {
    if (window.ethereum) {
      const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(addr);
    } else {
      alert("Please install MetaMask or compatible wallet");
    }
  }

  async function sendTip() {
    try {
      setStatus("Processing...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, abi, signer);
      const amount = ethers.parseUnits("1.0", 18); // send 1 token
      const tx = await contract.transfer(defaultReceiver, amount);
      await tx.wait();
      setStatus("✅ Tip sent successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error sending tip");
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Tip to Tip Mini App 💸</h1>
      <p>Network: Base (simulated)</p>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {account}</p>
          <button onClick={sendTip}>Send 1 Token Tip</button>
          <p>{status}</p>
        </>
      )}
    </div>
  );
}