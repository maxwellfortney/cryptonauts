<script>
    import { getDifficulty, AttemptMine } from "../../stores/minehash";
    import {
        highestId,
        last_hash,
        mine as transactionMine,
    } from "../../stores/contract";
    import { selectedAccount } from "../../stores/wallet";
    import BN from "bn.js";
    import MinerGraph from "./MinerGraph.svelte";

    let expandMiner = false;

    let maxSpeedOccured = 1;
    let mining = false;
    let wasMining = false;
    let nonce = new BN(0);
    let found = false;
    let speed = 1;
    let targetHashRate = 50;
    let background = true;
    let mineInterval = 1;

    let difficulty;
    let nextId;

    let history = [];
    let average_hashRate = 0;

    let autoRemine = false;
    let autoTransaction = true;
    let enableAlarm = false;

    async function mine() {
        nextId = $highestId + 1;
        console.log($highestId);
        difficulty = getDifficulty(nextId);

        let time0 = new Date();

        for (let i = 0; i < speed; i++) {
            doMine();
        }

        let time1 = new Date();
        mineInterval = Math.max(time1 - time0, 1);
        history.push(speed);
        maxSpeedOccured = Math.max(...history);

        speed = Math.max(
            Math.round((speed / mineInterval) * targetHashRate),
            1
        );

        if (found) {
            // blink();
            wasMining = true;
            mining = false;

            if (autoTransaction) {
                await transactionMine(nonce.toString());
                found = false;
            }
        } else if (mining) {
            requestAnimationFrame(mine);
        }
    }

    let mineTime = Date.now();

    function doMine() {
        if (found) return;
        // console.log(highestId,previous_hash,me,nonce,speed);
        nonce = nonce.add(new BN(1));
        // console.log($last_hash);
        if (
            AttemptMine(
                $highestId,
                $selectedAccount,
                $last_hash,
                nonce.toString()
            )
        ) {
            console.log("FOUND TOKEID: ", $highestId + 1);
            found = true;
            // highestId.set($highestId + 1);
            // console.log(
            //     "Took ",
            //     timeDifference(new Date(Date.now()), new Date(mineTime))
            // );
            // mineTime = Date.now();
        }
    }

    function timeDifference(date1, date2) {
        var difference = date1.getTime() - date2.getTime();

        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        difference -= daysDifference * 1000 * 60 * 60 * 24;

        var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
        difference -= hoursDifference * 1000 * 60 * 60;

        var minutesDifference = Math.floor(difference / 1000 / 60);
        difference -= minutesDifference * 1000 * 60;

        var secondsDifference = Math.floor(difference / 1000);

        return (
            daysDifference +
            " day/s " +
            hoursDifference +
            " hour/s " +
            minutesDifference +
            " minute/s " +
            secondsDifference +
            " second/s "
        );
    }

    function mineClick() {
        mining = !mining;
        let wasMining = false;
        if (mining) mine();
    }
</script>

<div
    class={`fixed z-20 flex items-center transition-all bg-white rounded-lg bottom-2 right-2 ${
        expandMiner ? "expandedMiner" : "closedMiner"
    }`}
>
    <div
        class="relative flex items-center w-full h-full py-3 pl-2 pr-4 text-black"
    >
        <svg
            on:click={() => (expandMiner = !expandMiner)}
            class="absolute right-0 w-6 transition-opacity cursor-pointer -top-1 expandMinerButton hover:opacity-75"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
            />
        </svg>
        {#if expandMiner}
            <div class="flex flex-col flex-auto h-full">
                <MinerGraph />
                <div class="flex flex-col items-start justify-start h-1/2">
                    <p class="text-xl font-semibold">Settings</p>
                    <div class="flex flex-col items-start justify-start ml-3">
                        <div class="flex">
                            <p class="mr-3 font-semibold">Success Sound</p>
                            <p
                                class={`${
                                    enableAlarm ? "myGreenText" : "myRedText"
                                }`}
                                on:click={() => (enableAlarm = !enableAlarm)}
                            >
                                {enableAlarm ? "On" : "Off"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <div
                class={`flex-none w-4 h-4 rounded-full ${
                    mining ? "myGreen" : "myRed"
                }`}
            />
            <p on:click={mineClick} class="ml-4 font-semibold cursor-pointer">
                {mining ? "Show Hashes" : "Click To Mine"}
            </p>
        {/if}
    </div>
</div>

<style>
    .myGreen {
        background-color: #00ff2a;
    }
    .myRed {
        background-color: #fd1818;
    }
    .myGreen {
        color: #00ff2a;
    }
    .myRed {
        color: #fd1818;
    }
    .expandedMiner {
        width: 30vw;
        height: 30vw;
    }
    .closedMiner {
        width: 170px;
        height: 48px;
    }
</style>
