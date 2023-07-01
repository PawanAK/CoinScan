import React, { useState, useContext } from 'react'
import {AppState} from '../App'

const Login = () => {
  const App = useContext(AppState)

  const {ethereum} = window;
  const [error, setError] = useState('');

  const LoginWallet = async () => {
    try {
      await ethereum.request({method: "wallet_requestPermissions", params: [{eth_accounts: {}}]})
      const accounts = await ethereum.request({method: "eth_requestAccounts"})
      App.setAddress(accounts[0])
      
      const chainId = await ethereum.request({method: "eth_chainId"})

      App.getBal();
    
      if(chainId == 3141) {
        App.setChain("FVM")
        App.setCurrency("TFIL")
        App.setSymbol("tFIL")
        App.setLogin(true);
        App.setw3payContractAddress('0xE647Ea94f0cc08e5fB19e0166938f8f372806127')
        App.setExplorer("https://hyperspace.filscan.io/")
      } else if(chainId == 5) {
        App.setChain("Goerli")
        App.setCurrency("GoerliEther")
        App.setSymbol("GoerliETH")
        App.setLogin(true);
        App.setw3payContractAddress('0xe71e354C888bf0789a21331D928c510F684de6Ef')
        App.setExplorer("https://goerli.etherscan.io")
      } else if(chainId == "0x13881") {
        App.setChain("Polygon")
        App.setCurrency("Matic")
        App.setSymbol("Matic")
        App.setw3payContractAddress('0xfCA8FDC0844112Be84e541C695175851F93255b6')
        App.setLogin(true);
        App.setExplorer("https://mumbai.polygonscan.com")
      } else {
        setError("Can only access with Filecoin Hyperspace, Goerli, Polygon Mumbai")
        App.setLogin(false);
        // App.setLogin(true);
      }
      
    } catch (error) {
      setError(`"${error.message}"`)
    }
  } 

  return (
    <div className='min-w-full h-4/5 flex justify-center flex-col items-center'>
      <img className='h-20' src='w3pay.png' />
      <div className='w-1/3 h-40 mt-4 bg-black bg-opacity-70 p-2 rounded-lg shadow-lg border-opacity-40 border-4 border-black flex flex-col justify-center items-center'>
        <h1 className='text-white text-2xl font-medium text-center'>Login</h1>
        {ethereum != undefined ?
         <div onClick={LoginWallet} className='flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-blue-800 cursor-pointer bg-green-800 text-white mt-4 rounded-lg justify-center items-center py-1 px-2'>
          Connect With Metamask 
          <img className='h-10' src='metamask.png' />
         </div>
          :
          <div className='flex flex-col justify-center items-center'>
            {/* install Metamask */}
            <a target={"_blank"} href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">
              <div className='flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-blue-800 cursor-pointer bg-green-800 text-white mt-4 rounded-lg justify-center items-center py-1 px-2'>
               Install Metamask
               <img className='h-10' src='metamask.png' />
              </div>
            </a>
              <p className='text-red-600 text-lg mt-2'>Login Required Metamask Extension</p>
          </div>
        }
        <p className='text-red-600 text-lg mt-2'>{error}</p>
      </div>
    </div>
  )
}

export default Login