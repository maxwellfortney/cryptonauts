import { get, readable, writable } from "svelte/store";

import Web3Modal from "web3modal";
import Fortmatic from "fortmatic";

export let isWaitingForAccount = writable(false);
export let selectedAccount = writable();
export let web3 = writable();

let web3Modal;
let provider;
const providerOptions = {
    fortmatic: {
        package: Fortmatic,
        options: {
            // Mikko's TESTNET api key
            key: "pk_test_391E26A3B43A3350",
        },
    },
};

export async function promptForMetaMask() {
    isWaitingForAccount.set(true);
    try {
        provider = await web3Modal.connect();
    } catch (e) {
        if (e === "Modal closed by user") {
            isWaitingForAccount.set(false);
            return;
        }
    }
    console.log("Provider: ", provider);
    const _web3 = new Web3(provider);
    web3.set(_web3);
    console.log("Web3: ", _web3);
    const accounts = await _web3.eth.getAccounts();
    console.log(accounts);
    if (accounts.length > 0) {
        selectedAccount.set(accounts[0]);
    }
}

export async function initWallet() {
    web3Modal = new Web3Modal({
        // network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
    });

    if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
        console.log("Provider: ", provider);
        const _web3 = new Web3(provider);
        web3.set(_web3);
        console.log("Web3: ", _web3);
        const accounts = await _web3.eth.getAccounts();
        console.log(accounts);
        if (accounts.length > 0) {
            selectedAccount.set(accounts[0]);
        }
    }
}
