import {useState, createContext, useEffect} from 'react';
import Header from './components/Header'
import Main from './components/Main'
import Login from './components/Login'
import { ethers } from 'ethers';
import w3pay from './w3pay/w3pay.json';

import * as PushAPI from "@pushprotocol/restapi";
import { Chat } from "@pushprotocol/uiweb";

const AppState = createContext();

function App() {
  const {ethereum} = window;
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('');
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('');
  const [ercTokenAddress, setErcTokenAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [w3payContractAddress, setw3payContractAddress] = useState('');
  const [explorer, setExplorer] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tokenChanged, setTokenChanged] = useState(false);
  const [showErc, setShowErc] = useState(false);
  const [ercLoading, setErcLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false)
  const [showRecentTx, setShowRecentTx] = useState(false)
  const [recentTx, setRecentTx] = useState({
    txhash: '',
    from: '',
    to: '',
    amount: '',
    symbol: ''
  })
  const [saveTxLoad, setSaveTxLoad] = useState(false);
  
async function getBal() {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    setBalance(ethers.utils.formatEther(balance))
}


const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const ERCABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_channel",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "_identity",
				"type": "bytes"
			}
		],
		"name": "sendNotification",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
// const ERCABI = [
//   "function balanceOf(address) view returns (uint)",
//   "function transfer(address to, uint amount) returns (bool)",
//   "function symbol() external view returns (string memory)",
//   "function name() external view returns (string memory)"
// ]

// Contracts 
const ERCContract = new ethers.Contract(ercTokenAddress, ERCABI, signer);
const w3payContract = new ethers.Contract(w3payContractAddress, w3pay.output.abi, signer);


const selectToken = async () => {
  try {
  setErcLoading(true);
  const name = await ERCContract.name();
  const balance = await ERCContract.balanceOf(address);
  const symbol = await ERCContract.symbol();
  setBalance(ethers.utils.formatEther(balance))
  setSymbol(symbol)
  setCurrency(name)
  setTokenChanged(true);
  setErcLoading(false);
  } catch(error) {
    setError(error.message)
    setErcLoading(false);
  }
}

const removeToken = async () => {
  try {
  if(chain == "FVM") {
    setCurrency("TFIL")
    setSymbol("tFIL")
  } else if(chain == "Goerli") {
    setCurrency("GoerliEther")
    setSymbol("GoerliETH")
  } else if(chain == "polygon") {
    setCurrency("Matic")
    setSymbol("Matic")
  }

  setErcTokenAddress('');
  setShowErc(false);
  setTokenChanged(false);
  getBal();
  } catch(error) {
    setError(error.message)
  }
}

const transferAmount = async () => {
  setMessage('');
  setTxLoading(true);
  try {
    if(tokenChanged) {
      const tx = await ERCContract.transfer(recipientAddress, ethers.utils.parseEther(amount));
      await tx.wait();
      selectToken();

      setRecentTx({
        txhash: tx.hash,
        from: address,
        to: recipientAddress,
        amount: amount,
        symbol: symbol
      })

      setShowRecentTx(true);

    } else {
      const tx = await w3payContract._transfer(recipientAddress, symbol, {
        value: ethers.utils.parseEther(amount)
      });

      await tx.wait();
      getBal();
    }

    setMessage("Transaction Sucessfull!")
    setAmount('');
  } catch (error) {
    setError(error.message)
  }

  setTxLoading(false);
 
}

const saveTx = async () => {
  setSaveTxLoad(true);
  try {
    const tx = await w3payContract.saveTx(recentTx.from, recentTx.to, ethers.utils.parseEther(recentTx.amount), recentTx.symbol);
    await tx.wait();

    setMessage("Transaction Saved Sucessfully!")
  } catch (error) {
    setError(error.message)
  }
  
  setShowRecentTx(false);
  setSaveTxLoad(false);
}

  useEffect(() => {
    ethereum.on("chainChanged", async (chainId) => {
      // if(chainId == "0x3141") {
      if(chainId == 3141) {
        setChain("FVM")
        setCurrency("TFIL")
        setSymbol("tFIL")
        setw3payContractAddress('0xE647Ea94f0cc08e5fB19e0166938f8f372806127')
        setExplorer("https://hyperspace.filscan.io/")
      } else if(chainId == 5) {
        setChain("Goerli")
        setCurrency("GoerliEther")
        setSymbol("GoerliETH")
        // setw3payContractAddress('0xfCA8FDC0844112Be84e541C695175851F93255b6')
        setw3payContractAddress('0xe71e354C888bf0789a21331D928c510F684de6Ef')
        setExplorer("https://goerli.etherscan.io")
      } else if(chainId == "0x13881") { //80001
        setChain("Polygon")
        setCurrency("Matic")
        setSymbol("Matic")
        setw3payContractAddress('0xfCA8FDC0844112Be84e541C695175851F93255b6')
        setExplorer("https://mumbai.polygonscan.com")
      } else {
        setLogin(false);
        // setLogin(true);
      }

      getBal();
    })

    ethereum.on("accountsChanged", async (accounts) => {
      setAddress(accounts[0]) 
    })
  })

  useEffect(() => {
    if(tokenChanged) {
      selectToken();
    } else {
      getBal()
    }
  }, [address]) 

  useEffect(() => {
    removeToken();
  }, [chain])

  return (
    <>
    <AppState.Provider value={{login, setLogin, address, setAddress, chain, setChain, symbol, setSymbol, balance, setBalance, currency, setCurrency, getBal, ercTokenAddress, setErcTokenAddress, recipientAddress, setRecipientAddress, amount, setAmount, w3payContractAddress, setw3payContractAddress, explorer, setExplorer, error, setError, message, setMessage, tokenChanged, setTokenChanged, removeToken, selectToken, transferAmount, showErc, setShowErc, ercLoading, setErcLoading, txLoading, setTxLoading, showRecentTx, setShowRecentTx, recentTx, setRecentTx, saveTxLoad, setSaveTxLoad, saveTx, w3payContract }}>

    <div className="min-w-full h-screen">
      { login ?
      <div className="min-w-full min-h-full">
        {/* Main Application */}
        <Header />
        <Main />
      </div>
      :
      <Login />
      }
    </div>
    </AppState.Provider>

    <Chat
                    // account={account} //user address 
                    account= {address} //user address 
                    supportAddress={recipientAddress} //support address
                    // apiKey="jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0"
                    apiKey="vzOQa8Hda3.lD6Yvrij1T4qHrE07Mp7XcE3mRWu8Yl6WAmOzLSfI63xWuGSoNkXsHeBDVvG63Hs"
                    env="staging"
        />
    </>
  );
}

export default App;
export {AppState}
