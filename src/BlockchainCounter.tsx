import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/providers";
import SimpleCounterAbi, {
  SimpleCounterAddress,
} from "contract_refs/SimpleCounter";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}

const BlockchainCounter = () => {
  // Component State.
  const [counter, setCounter] = useState("");

  // const [ethersProvider, setEthersProvider] =
  //   useState<ethers.providers.Web3Provider>();
  // const [ethersSigner, setEthersSigner] =
  //   useState<ethers.providers.JsonRpcSigner>();
  const [contract, setContract] = useState<ethers.Contract>();

  useEffect(() => {
    async function connectToBlockchain() {
      // Connect to MetaMask.
      await window.ethereum.enable();

      // A Web3Provider wraps a standard Web3 provider, which is
      // what Metamask injects as window.ethereum into each page
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      // setEthersProvider(ethersProvider);

      // The Metamask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      const ethersSigner = ethersProvider.getSigner();
      // setEthersSigner(ethersSigner);

      // Set the contract with its ABI.
      const contract = new ethers.Contract(
        SimpleCounterAddress,
        SimpleCounterAbi,
        ethersSigner
      );

      setContract(contract);

      showCounterValue(contract);
    }
    connectToBlockchain();
  }, []); // Note empty array here as a second argument.

  async function showCounterValue(contract: ethers.Contract) {
    if (!contract) {
      console.warn("Contract object not loaded");
      return;
    }

    const counterValue: BigNumber = await contract.getCounterValue();
    setCounter(counterValue.toString());
  }

  // Event handlers. You may also use arrow functions.
  async function handleRefreshValue() {
    if (!contract) {
      console.warn("Contract object not loaded");
      return;
    }

    showCounterValue(contract);
  }

  async function handleIncrementCounter(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (!contract) {
      console.warn("Contract object not loaded");
      return;
    }

    // Invoke contract to increment the counter.
    const txnResponse: TransactionResponse = await contract.incrementCounter();

    // Update view. Must be done after the transaction is mined.
    const txnReceipt: TransactionReceipt = await txnResponse.wait();

    alert(`Successfully Mined at block: ${txnReceipt.blockNumber}`);

    showCounterValue(contract);
  }

  return (
    <>
      <div>COUNTER VALUE</div>
      <div>
        <label>Value</label>
        <input readOnly={true} value={counter} />
      </div>
      <br />
      <div>
        <button type="button" onClick={handleRefreshValue}>
          Refresh Value
        </button>
        <button type="button" onClick={handleIncrementCounter}>
          Increment Value
        </button>
      </div>
    </>
  );
};

export default BlockchainCounter;
