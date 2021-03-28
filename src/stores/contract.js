import { get, readable, writable } from "svelte/store";
import { web3 as _web3, selectedAccount } from "./wallet";
import { getGenerationForTokenId, generationOf } from "./minehash";
import CryptonautsContract from "../contracts/Cryptonauts.json";
import BN from "bn.js";

export let state = writable("initial");

export let last_hash = writable();
export let highestId = writable();
export let isCryptonaut = writable();

let contract = null;
let networkId = null;

let expectedToken;
let expectedTokenHash;

const callbacks = {
    Transfer: [],
    Mined: [],
    Withdraw: [],
    Migrate: [],

    transaction: {
        Submit: [],
        Confirm: [],
        Fail: [],
        Cancel: [],
    },
};

let BASE_COST = new BN(get(_web3)?.utils?.toWei("0.000045"));

function cleanAddress(address) {
    return String(address).toLowerCase();
}

export async function connect() {
    console.log("Connecting to contract...");
    let web3 = get(_web3);
    if (web3) {
        BASE_COST = new BN(web3.utils?.toWei("0.000045"));
        console.log(BASE_COST);
        networkId = await web3.eth.net.getId();

        const deployedNetwork = CryptonautsContract.networks[networkId];

        contract = new web3.eth.Contract(
            CryptonautsContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        last_hash = await contract.methods.LAST_HASH().call();
        console.log(last_hash);
        highestId = parseInt(await contract.methods.totalSupply().call());

        startContractListeners();
    }
}

let mineConfirmed = [];
export function onMineConfirmed(callback) {
    mineConfirmed.push(callback);
}

function MineConfirmed(tokenId, hash) {
    for (let i = 0; i < mineConfirmed.length; i++) {
        mineConfirmed[i](tokenId, hash);
    }

    // trigger_metadata(tokenId);
}

function parse_Mined(_tokenId, hash, txHash) {
    if (_tokenId === expectedToken) {
        expectedToken = 0;

        if (txHash !== expectedTokenHash) {
            // minedRival(_tokenId, hash, true);
            console.log("Not match");
            console.log(expectedTokenHash);
            console.log(txHash);
        } else {
            console.log("My mine confirmed");
            MineConfirmed(_tokenId, hash);
        }
    } else {
        console.log(_tokenId);
        console.log(expectedToken);
        // minedRival(_tokenId, hash, false);
    }
}

function startContractListeners() {
    contract.events.Mined(async (options, event) => {
        console.log("mined");
        console.log(event);
        last_hash = await contract.methods.LAST_HASH().call();
        highestId = parseInt(await contract.methods.totalSupply().call());

        parse_Mined(
            parseInt(event.returnValues[0]),
            event.returnValues[1],
            event.transactionHash
        );
    });

    contract.events.Transfer(async () => {
        console.log("herh");
        last_hash = await contract.methods.LAST_HASH().call();
        console.log(last_hash);
        highestId = parseInt(await contract.methods.totalSupply().call());
    });
}

function transactionSubmitted(func, params) {
    for (let i = 0; i < callbacks.transaction.Submit.length; i++) {
        callbacks.transaction.Submit[i](func, params);
    }
}

export async function mine(nonce) {
    try {
        const tokenId = highestId + 1;

        const cost = calculate_cost(tokenId).toString();

        console.log(cost);
        console.log(cleanAddress(get(selectedAccount)));

        const overrides = {
            from: cleanAddress(get(selectedAccount)),
            value: cost,
        };
        console.log(await contract.methods.LAST_HASH().call());
        const tx = await contract.methods.mine(nonce).send(overrides);

        console.log(tx);
        // register_transaction(tx, "mine", {
        //     nonce,
        // });

        transactionSubmitted("mine", nonce);

        // DO SOMETHING WITH THE TRANSACTION
        expectedToken = tokenId;
        expectedTokenHash = tx.transactionHash;
    } catch (e) {
        // cancel_transaction('mine', {nonce});

        // alert_error(e);
        console.log(e);
        return false;
    }
}

const calculate_cost = (_tokenId) => {
    const generation = generationOf(_tokenId);
    return new BN(Math.pow(2, generation) - 1).mul(BASE_COST);
};

export async function prev_hash() {
    return last_hash;
}
