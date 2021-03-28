import { get } from "svelte/store";
import BN from "bn.js";
import { web3 as _web3 } from "./wallet.js";

const BASE_DIFFICULTY = new BN(
    "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    16
).div(new BN(300));
const DIFFICULTY_RAMP = 3;

function cleanAddress(address) {
    return String(address).toLowerCase();
}

export function generationOf(_tokenId) {
    return Math.floor(Math.log2(_tokenId));
}

function getDifficulty(tokenId) {
    const generation = generationOf(parseInt(tokenId));
    let difficulty = BASE_DIFFICULTY.div(
        new BN(Math.pow(DIFFICULTY_RAMP, generation))
    );
    if (generation > 13) {
        difficulty.div(new BN(parseInt(tokenId) - Math.pow(2, 14) + 1));
    }
    return difficulty;
}

function Hash(address, prev, nonce) {
    return get(_web3).utils.soliditySha3Raw(
        { t: "address", v: address },
        { t: "bytes32", v: prev },
        { t: "uint256", v: nonce }
    );
}

export function AttemptMine(tokenId, address, prev_hash, nonce) {
    // console.log("Nonce: ", nonce);
    // console.log("TokenID: ", tokenId);
    // console.log("Address: ", address);
    // console.log("Prevhash: ", prev_hash);
    const difficulty = getDifficulty(tokenId);
    const _hash = Hash(
        cleanAddress(address),
        prev_hash ? prev_hash : "",
        nonce
    );
    // console.log(_hash.slice(2))
    const hash = new BN(_hash.slice(2), 16);
    // console.log(hash.lt(difficulty))
    return hash.lt(difficulty);
}

export function getGenerationForTokenId(tokenId) {
    if (tokenId < 4) {
        return 1;
    } else if (tokenId < 8) {
        return 2;
    } else if (tokenId < 16) {
        return 3;
    } else if (tokenId < 32) {
        return 4;
    } else if (tokenId < 64) {
        return 5;
    } else if (tokenId < 128) {
        return 6;
    } else if (tokenId < 256) {
        return 7;
    } else if (tokenId < 512) {
        return 8;
    } else if (tokenId < 1024) {
        return 9;
    } else if (tokenId < 2048) {
        return 10;
    } else if (tokenId < 4096) {
        return 11;
    } else if (tokenId < 8192) {
        return 12;
    } else if (tokenId < 16384) {
        return 13;
    } else {
        return 14;
    }
}

function getDifficultyForGeneration(generation) {
    if (generation > 13) {
        // throw Error(`Difficulty not available for generation ${generation}`)
    }
    return BASE_DIFFICULTY.div(new BN(Math.pow(DIFFICULTY_RAMP, generation)));
}
