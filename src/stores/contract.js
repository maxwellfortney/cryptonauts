import { get, readable, writable } from "svelte/store";
import { web3 as _web3, selectedAccount } from "./wallet";
import { getGenerationForTokenId, generationOf } from "./minehash";
import CryptonautsContract from "../contracts/Cryptonauts.json";
import BN from "bn.js";

export let state = writable("initial");

export let last_hash = writable();
export let highestId = writable();

let contract = null;
let networkId = null;

const BASE_COST = new BN(get(_web3)?.utils?.toWei("0.000045"));

function cleanAddress(address) {
    return String(address).toLowerCase();
}

export async function connect() {
    console.log("Connecting to contract...");
    let web3 = get(_web3);
    if (web3) {
        networkId = await web3.eth.net.getId();

        const deployedNetwork = CryptonautsContract.networks[networkId];

        contract = new web3.eth.Contract(
            CryptonautsContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        last_hash = await contract.methods.LAST_HASH().call();
        console.log(get(last_hash));
        highestId = await contract.methods.totalSupply().call();

        startContractListeners();
    }
}

function startContractListeners() {
    contract.events.Mined(async () => {
        console.log("mined");
        last_hash = await contract.methods.LAST_HASH().call();
        console.log(get(last_hash));
        highestId = await contract.methods.totalSupply().call();
    });

    contract.events.Transfer(async () => {
        console.log("herh");
        last_hash = await contract.methods.LAST_HASH().call();
        console.log(get(last_hash));
        highestId = await contract.methods.totalSupply().call();
    });
}

export async function mine(nonce) {
    try {
        const tokenId = parseInt(get(highestId)) + 1;

        const cost = calculate_cost(tokenId);

        console.log(cost);

        const overrides = {
            from: cleanAddress(get(selectedAccount)),
            value: cost,
        };
        console.log(await contract.methods.LAST_HASH().call());
        const tx = await contract.methods.mine(nonce).send(overrides);

        console.log(tx);
        // register_transaction(tx,'mine', {
        //     nonce
        // });

        // DO SOMETHING WITH THE TRANSACTION
        // expectedToken = tokenId;
        // expectedToken_hash = tx.hash;
    } catch (e) {
        // cancel_transaction('mine', {nonce});

        // alert_error(e);
        console.log(e);
        return false;
    }
}

const calculate_cost = (_tokenId) => {
    console.log(_tokenId);
    const generation = generationOf(_tokenId);
    return new BN(Math.pow(2, generation) - 1).mul(BASE_COST);
};

export async function prev_hash() {
    return last_hash;
}
