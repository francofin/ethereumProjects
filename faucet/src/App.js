import React, { useEffect, useState, useCallback } from "react";
import './App.css';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import {loadContract} from "./utils/load-contract";


function App() {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  })

  const [account, setAccount] = useState(null)

  const [balance, setBalance] = useState(null)

  const [shouldReload, reload] = useState(false)

  const canConnectToContract = account && web3Api.contract

  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])

  useEffect(() => {
    const loadProvider = async () => {
      // With metamask, we have access to window.ethereum
      //Also have access to window.web3. Metamask injects a global api into websites. 
      //This api allows websites to request users accounts, read data to blockchain, 
      //sign messages, and transactions. 

      // let provider = null;
      const provider = await detectEthereumProvider()
      
      const setAccountListener = provider => {
        provider.on("accountsChanged",_ => window.location.reload())
        provider.on("chainChanged",_ => window.location.reload()) //called when changing networks.
        // provider.on("accountsChanged", accounts => setAccount(accounts[0]))

        // provider._jsonRpcConnection.events.on("notification", payload => {
        //   const {method} = payload
        //   if(method === "metamask_unlockStateChanged"){
        //     setAccount(null)
        //   }
        // })
      }

      // console.log(contract);
      if (provider) {
        const contract = await loadContract("Faucet", provider)
        setAccountListener(provider)
        // provider.request({method:"eth_requestAccounts"})
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded:true
        })
      } 
      else {
        // setWeb3Api({...web3Api, isProviderLoaded:true})
        setWeb3Api((api) => {
          return {
            ...api,
            isProviderLoaded: true
          }
        })
        console.error('Please install MetaMask!')
      }

      // if (window.ethereum) {
      //   provider = window.ethereum;
      //   try{
      //     // await provider.enable();
      //     await provider.request({method:"eth_requestAccounts"})
      //   } catch{
      //     console.error("User denied account access")
      //   }


      // setWeb3Api({
      //   web3: new Web3(provider),
      //   provider
      // })

    }
    loadProvider();
  }, [])


  useEffect(() => {
    const getAccount = async () => {

      const accounts = await web3Api.web3.eth.getAccounts();
      // debugger;
      setAccount(accounts[0]);
    }
    //called only when web3 api is inialized, so we need to watch for this state, first undefined then set, we listen to the changes.
    //get acocunts only executed when web3Api.web3 is initialized. 
    web3Api.web3 && getAccount();
  }, [web3Api.web3])


  useEffect(() => {
    const loadBalance = async () => {
      const {contract, web3} = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }

    web3Api.contract && loadBalance()
  }, [web3Api, shouldReload])


  const addFunds = useCallback(async () => {
    const {contract, web3} = web3Api
    await contract.addFunds({
      from: account, 
      value: web3.utils.toWei("1", "ether")
    })
    // window.location.reload()
    reloadEffect()
  }, [web3Api, account,reloadEffect])

  const withdrawFunds = async () => {
      const {contract, web3} = web3Api
      const withdrawAmount = web3.utils.toWei("0.1", "ether")
      await contract.withdrawFunds( withdrawAmount, {
        from:account,
      })

      reloadEffect()
  }

  // console.log(web3Api.web3);


  return (
    <>
      <div className="faucet-wrapper">
          <div className="faucet">
          {web3Api.isProviderLoaded ?
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">
                  Account: 
                </strong>
                </span>
                  {account ? 
                    <div>{account}</div>:
                  !web3Api.provider ?
                  <>
                  <div className="notification is-warning is-rounded">
                    Wallet is not detected {` `}
                    <a href="https://docs.metamask.io" tarket="_blank" rel="noopener noreferrer"> Install Metamask</a>
                  </div>
                  </> :
                  <button className="button is-success is-focused mr-2"
                  onClick ={async () => web3Api.provider.request({method:"eth_requestAccounts"})}
                  >Connect to Metamask</button>}
                </div> :
                <span>Looking For Web3...</span>
          }
            <div className="balance-view is-size-2 my-4">
              Current Balance: <strong>{balance}</strong> ETH
            </div>
            {!canConnectToContract && <i className="is-block">Connect to Ganache Network</i>}
            <button className="button is-primary  mr-2"
            onClick={addFunds}
            disabled={!canConnectToContract}>Donate 1eth</button>
            <button className="button is-danger"
            onClick={withdrawFunds}
            disabled={!canConnectToContract}>WithDraw</button>
          </div>
      </div>
    </>
  );
}

export default App;
