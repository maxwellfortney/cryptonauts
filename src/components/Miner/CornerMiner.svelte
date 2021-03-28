<script>
    import { AttemptMine } from "../../stores/minehash";
    import {
        highestId,
        last_hash,
        mine as transactionMine,
        onMineConfirmed,
    } from "../../stores/contract";
    import { selectedAccount } from "../../stores/wallet";
    import BN from "bn.js";
    import MinerGraph from "./MinerGraph.svelte";

    // import SuccessAudio from "../../assets/audio/success_sound.mp3";

    let expandMiner = false;

    let maxSpeedOccured = 1;
    let minSpeedOccured = 1;
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

    let miningHistory = [];
    let graphContWidth, graphContHeight;
    let average_hashRate = 0;

    let enableAlarm = false;
    let autoTransaction = true;
    let autoRemine = true;

    onMineConfirmed((_tokenId, hash) => {
        console.log("HEHEHEHEHHEHE");
        mined(hash, true);
    });

    // onTransactionSubmit((func, params) => {
    //     if (func === "mine") {
    //         if (auto_transaction) {
    //         }
    //         if (demand_cancel) {
    //             submitted_will_fail = true;
    //         }
    //         stop_blink();
    //         clear_alarm();
    //     }
    // });

    function mined(hash, wasMe) {
        nonce = new BN(0);
        found = false;

        // stop_blink();
        // clear_alarm();

        if (wasMe) {
            wasMining = false;
            if (autoRemine) {
                startMining();
            }
            // }else if(requested.mine){
            //     demand_cancel = true;
            // }else if(pending.mine){
        } else {
            if (mining || wasMining) mine();
        }
    }

    async function mine() {
        let time0 = new Date();
        for (let i = 0; i < speed; i++) {
            doMine();
        }

        let time1 = new Date();
        mineInterval = Math.max(time1 - time0, 1);
        miningHistory.push(
            Math.round(((1000 * speed) / mineInterval) * mining)
        );

        maxSpeedOccured = Math.max(...miningHistory);
        minSpeedOccured = Math.min(...miningHistory);
        if (miningHistory.length > graphContWidth * 0.85) {
            miningHistory.splice(0, 1);
        }

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

    function doMine() {
        if (found) return;
        nonce = nonce.add(new BN(1));
        if (
            AttemptMine(
                highestId + 1,
                $selectedAccount,
                last_hash,
                nonce.toString()
            )
        ) {
            console.log("Found token #: ", parseInt(highestId) + 1);
            found = true;
        }
    }

    function mineClick() {
        mining = !mining;
        wasMining = false;
        if (mining) mine();
    }

    function startMining() {
        mining = true;
        wasMining = false;
        mine();
    }
</script>

<div
    class={`fixed z-20 flex items-center transition-all bg-white rounded-lg bottom-2 right-2 ${
        expandMiner ? "expandedMiner" : "closedMiner"
    }`}
>
    <!-- svelte-ignore a11y-media-has-caption -->
    <audio class="hidden" id="successAudioElement" controls loop>
        <source src="https://sndup.net/27fn/d" type="audio/mp3" />
    </audio>
    <div class="relative flex items-center w-full h-full px-4 py-3 text-black">
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
            <!-- <div
                class={`absolute left-1 top-1 flex-none w-4 h-4 rounded-full ${
                    mining ? "myGreen" : "myRed"
                }`}
            /> -->
            <div class="flex flex-col flex-auto h-full mt-2">
                <p class="mx-auto font-semibold">
                    {`${Math.round(
                        ((1000 * speed) / mineInterval) * mining
                    )} hashes/s`}
                </p>
                <div
                    class="flex items-center justify-center flex-auto"
                    bind:clientWidth={graphContWidth}
                    bind:clientHeight={graphContHeight}
                >
                    <MinerGraph
                        {miningHistory}
                        yMax={maxSpeedOccured}
                        yMin={minSpeedOccured}
                        width={graphContWidth * 0.95}
                        height={graphContHeight}
                    />
                </div>
                <div
                    class="flex flex-col items-start justify-start flex-none pt-2 pb-3"
                >
                    <div
                        on:click={mineClick}
                        class={`flex mx-auto transition-all cursor-pointer riseOnHover px-2 py-1 font-semibold rounded-lg ${
                            mining ? "myRed" : "myGreen"
                        }`}
                    >
                        {mining ? "Stop Mining" : "Start Mining"}
                    </div>
                    <p class="text-xl font-semibold">Settings</p>
                    <div
                        class="flex flex-col items-start justify-start ml-3 font-semibold"
                    >
                        <div class="flex items-center">
                            <p class="mr-3">Success Sound:</p>
                            <label class="shadow-inner switch">
                                <input
                                    checked={!enableAlarm}
                                    type="checkbox"
                                    on:click={() =>
                                        (enableAlarm = !enableAlarm)}
                                />
                                <span class="slider round" />
                            </label>
                            <p
                                class="ml-2 cursor-pointer hover:opacity-70"
                                on:click={() => {
                                    const audio = document.getElementById(
                                        "successAudioElement"
                                    );
                                    audio.currentTime = 0;
                                    if (audio.paused) {
                                        audio.play();
                                    } else {
                                        audio.pause();
                                    }
                                }}
                            >
                                Test
                            </p>
                        </div>
                        <div class="flex items-center">
                            <p class="mr-3">Auto Transaction:</p>
                            <label class="shadow-inner switch">
                                <input
                                    checked={!autoTransaction}
                                    type="checkbox"
                                    on:click={() =>
                                        (autoTransaction = !autoTransaction)}
                                />
                                <span class="slider round" />
                            </label>
                        </div>
                        <div class="flex items-center">
                            <p class="mr-3">Auto Remine:</p>
                            <label class="shadow-inner switch">
                                <input
                                    checked={!autoRemine}
                                    type="checkbox"
                                    on:click={() => (autoRemine = !autoRemine)}
                                />
                                <span class="slider round" />
                            </label>
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
                {mining
                    ? `${Math.round(
                          ((1000 * speed) / mineInterval) * mining
                      )} hashes/s`
                    : "Click To Mine"}
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
    .myGreenText {
        color: #00ff2a;
    }
    .myRedText {
        color: #fd1818;
    }
    .expandedMiner {
        width: 30vw;
        height: 30vw;
    }
    .closedMiner {
        width: 180px;
        height: 48px;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 35px;
        height: 20px;
        border: 1px solid #9c9c9c;
        border-radius: 999px;
        padding: 1px 0;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 1px;
        bottom: 0px;
        background-color: #00ff2a;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }
    /* 
    input:checked + .slider {
        background-color: #2196f3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196f3;
    } */

    input:checked + .slider:before {
        -webkit-transform: translateX(14px);
        -ms-transform: translateX(14px);
        transform: translateX(14px);
        background-color: #fd1818;
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 999px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    .riseOnHover:hover {
        transform: translateY(-3px);
    }
</style>
