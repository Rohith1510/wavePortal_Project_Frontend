import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";


const getEthereumObject = () => window.ethereum;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [text, setText] = useState("");
  const [allWaves, setAllWaves] = useState([]);

  console.log("Data-2",text);

  const contractAddress = "0x6f172536F038198EfB8592267ef323aE334543ED";
  const contractABI = abi.abi;

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.wave(text);
        console.log("Messaging...");
        
        const wavestotal = wavePortalContract.getAllWaves();
        console.log("Got All Waves..",wavestotal)
        
        
        let wavesCleaned = [];
        for (let i = 0; i < wavestotal.length; i++) {
          const wave = wavestotal[i];
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        }
        setAllWaves(wavesCleaned);
        setText("");

      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error('Error in wave function:', error.message);
      console.error(error.stack);
    }
  };

  useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  console.log("allWaves",allWaves);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          Hey {<img src='src/favicon.ico' alt="img" style={{height: "30px"}}/> } I'm Rohith
        </div>
        <div className="bio">
          Think, type, click – that's all it takes. Send your thoughts, share a smile, and let the magic happen with just a simple click.
          <b>Connect your Ethereum (Sepolia) wallet and wave at me!</b>
        </div>

        {!currentAccount && (
        <button className="walletButton" onClick={ connectWallet }
          >
          Connect Wallet
        </button>
      )}
      
        <div class="form-group">
          <label>
            <input class="form-control" style={{width:'100%', marginLeft:"-6px"}} id="exampleFormControlTextarea1" rows="3" placeholder="Wave Me" onChange={(e)=>{setText(e.target.value)}} />
          </label>
        </div>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
       
        
        <div className="dImage">
          <img src="src/img1.png" alt="The Image"></img>
        </div>

        <div>
          <h1>Hello Data</h1>
        </div>
        
        <div>
          <h1>Hello</h1>
          {allWaves.map((wave, index) => {
          <label>Address: {wave.address} Time: {wave.timestamp.toString()} Message: {wave.message}</label>
          })}
        </div>
      </div>
    </div>
  );
};
 
export default App;
