import React, {useState, useContext, useEffect} from 'react'
import { AppState } from "../App";
import {ethers} from 'ethers';

const Payees = () => {
  const App = useContext(AppState);

  const [payeeAddress, setPayeeAddress] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState([])
  const [num, setNum] = useState(0)

  useEffect(() => {
    async function getData() {
      const payees = await App.w3payContract.filters.recipeints(App.address)
      const recipentsData = await App.w3payContract.queryFilter(payees);
      setData(recipentsData)
    }

    getData();
  }, [num])

  const addPayee = async () => {
    try {
      const tx = await App.w3payContract.addPayee(payeeAddress, payeeName);
      await tx.wait();
      setMessage("Payee Saved Sucessfully!")  
      setPayeeAddress('');
      setPayeeName('');    
    } catch (error) {
      setError(error.message)
    }

    let nextnum = num + 1;
    setNum(nextnum);
  }

  const setPayee = (address, name) => {
    App.setPayeeAddress(address)
    setMessage("Selected the " + name + "'s address")
  }

  return (
    <div className='flex flex-col items-center justify-center py-3 px-4 text-white'>
       <input onChange={(e) => setPayeeAddress(e.target.value)} value={payeeAddress} className="w-3/4 p-3 bg-black border-2 border-blue-900 border-opacity-60 bg-opacity-70 outline-none rounded-lg" placeholder="Payee Address" />

       <input onChange={(e) => setPayeeName(e.target.value)} value={payeeName} className="mt-2 w-3/4 p-3 bg-black border-2 border-blue-900 border-opacity-60 bg-opacity-70 outline-none rounded-lg" placeholder="Payee Name" />

       <div onClick={addPayee} className="flex mt-4 w-3/4 cursor-pointer justify-center items-center p-2 bg-green-700 bg-opacity-70 border-2 border-blue-900 border-opacity-80 text-xl font-medium rounded-lg">
        Add Payee
      </div>

      <p className="text-red-600 text-lg mt-2 px-3">{error}</p>
      <p className="text-green-600 text-lg mt-2 px-1">{message}</p>

      <div className='flex flex-col items-center justify-center mt-4 w-full'>
    
      {data.map((e) => {
        return (
        <div onClick={() => setPayee(e.args.payee, e.args.payeeName)} className={`bg-black cursor-pointer rounded-lg bg-opacity-60 border-2 border-blue-900 border-opacity-80 w-3/4 mt-2`}> 
        <div className="flex w-full items-center justify-center rounded-t-lg">
          <div className="w-full py-2 px-2">
            <p className="text-xl font-mono">Name: {e.args.payeeName}</p>
            <p className="text-xs font-mono">address: {e.args.payee}</p>
          </div>
        </div>
        </div>
      )})}

      </div>
    </div>
  )
}

export default Payees