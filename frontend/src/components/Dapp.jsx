import React, { useState, useEffect } from "react"

import { ethers } from "ethers"

import AdoptionArtifact from "../contracts/Adoption.json"
import contractAddress from "../contracts/contract-address.json"

import ConnectWallet from "./ConnectWallet"
import Pets from "./Pets"

const HARDHAT_NETWORK_ID = '31337'

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const Dapp = () => {

    const [ selectedAddress, setSelectedAddress ] = useState()

    const [ txBeingSent, setTxBeingSent ] = useState()
    const [ transactionError, setTransactionError ] = useState()
    const [ networkError, setNetworkError ] = useState()

    const [ pollDataInterval, setPollDataInterval ] = useState()

    const [ provider, setProvider ] = useState()
    const [ adoption, setAdoption ] = useState()

    const [ pets, setPets ] = useState()

    const [ adoptionData, setAdoptionData ] = useState()

    useEffect(() => {
        setPets(require("../pets.json"))
        console.log("reading pets")
    }, [])
    
    useEffect(() => {
        if(adoption) {
            getAdoptionData()
        }
    }, [adoption])

    const checkNetwork = () => {
        if(window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            return true
        } else {
            setNetworkError("Please connect Metamask to Localhost:8545")
            return false
        }
    }

    const connectWallet = async () => {
        const [ _selectedAddress ] = await window.ethereum.enable()

        if(!checkNetwork()) {
            return
        }

        initialize(_selectedAddress)

        window.ethereum.on("accountsChanged", ([newAddress]) => {
            stopPollingData()
            if(newAddress === undefined) {
                return resetState()
            }

            initialize(newAddress())
        })

        window.ethereum.on("networkChanged", ([networkId]) => {
            stopPollingData()
            resetState()
        })
    }

    const resetState = () => {
        setSelectedAddress(undefined)
        setTxBeingSent(undefined)
        setTransactionError(undefined)
        setNetworkError(undefined)
        setPollDataInterval(undefined)
    }

    const initialize = (userAddress) => {
        console.log(userAddress)
        setSelectedAddress(userAddress)

        initializeEthers()
        startPollingData()
    }

    const initializeEthers = () => {
        const _provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(_provider)
        setAdoption(new ethers.Contract(
            contractAddress.Adoption,
            AdoptionArtifact.abi,
            _provider.getSigner(0)
        ))
    }


    const getAdoptionData = async () => {
        try {
            let petsData = await adoption.getAdopters()
            let petsCopy = pets.map((pet, i) => ({
                ...pet,
                owner: petsData[i]
            }))
            console.log(adoption)
            setPets(petsCopy)
            setAdoptionData(petsData)
        } catch(error) {
            console.log(error)
        }
    }

    const startPollingData = () => {
        setPollDataInterval(setInterval(() => console.log("update balance"), 1000))
        // update smthng
    }

    const stopPollingData = () => {
        clearInterval(pollDataInterval)
        pollDataInterval = undefined
    }

    const adopt = async (id) => {
        try {
            let tx = await adoption.adopt(id, {from: selectedAddress}) 
            console.log(tx)
        } catch(error) {
            console.log(error)
        }
    }

    if(window.ethereum === undefined) {
        return (<div> No Wallet Detected </div>)
    }

    if(!selectedAddress) {
        return (
            <ConnectWallet 
                connectWallet={connectWallet}
                networkError={networkError}
                dismis={() => console.log("Dismiss")}
            />
                
        )
    }

    if(!adoptionData) {
        return (<h1> Loading... </h1>)
    }

    return (
        <React.Fragment>
            <h1>Petshop</h1>
            <h4>Connected as {selectedAddress}</h4>
            <Pets
                pets={pets}
                selectedAddress={selectedAddress}
                adopt={adopt}
            />
        </React.Fragment>
    )
}

export default Dapp
