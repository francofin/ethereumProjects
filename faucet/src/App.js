import React, { useEffect, useState } from "react";
import './App.css';
import Web3 from "web3";

function App() {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  })

  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      // With metamask, we have access to window.ethereum
      //Also have access to window.web3. Metamask injects a global api into websites. 
      //This api allows websites to request users accounts, read data to blockchain, 
      //sign messages, and transactions. 

      let provider = null;
      if (window.ethereum) {
        provider = window.ethereum;
        try{
          // await provider.enable();
          await provider.request({method:"eth_requestAccounts"})
        } catch{
          console.error("User denied account access")
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;

      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://localhost:7545")
      }

      setWeb3Api({
        web3: new Web3(provider),
        provider
      })

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

  // console.log(web3Api.web3);


  return (
    <>
      <div className="faucet-wrapper">
          <div className="faucet">
            <span>
              <strong>
                Account: 
              </strong>
              <h1>
                {account ? account: "not connected"}
              </h1>
            </span>
            <div className="balance-view is-size-2">
              Current Balance: <strong>10</strong> ETH
            </div>
            
            <button className="button is-primary  mr-2">Donate</button>
            <button className="button is-danger">WithDraw</button>
          </div>
      </div>
    </>
  );
}

export default App;
