<script>
    import {
        isWaitingForAccount,
        promptForMetaMask,
        selectedAccount,
    } from "../stores/wallet.js";
</script>

<div class="flex items-center justify-between w-11/12 Navbar">
    <a href="/#/" class="text-4xl font-black">Cryptonauts</a>
    <div class="flex items-center">
        <a href="/#/mining" class="mr-8 font-semibold">Mining</a>
        <a href="/#/mining" class="mr-8 font-semibold">Info</a>

        {#if $selectedAccount}
            <a
                class="riseOnHover transition flex items-center px-3.5 font-semibold text-black bg-white rounded-lg py-2.5"
                href="/#/inventory">{$selectedAccount.substr(0, 10)}...</a
            >
        {:else if $isWaitingForAccount}
            <div
                class="flex items-center justify-center w-24 py-2 bg-white rounded-lg"
            >
                <div class="loader" />
            </div>
        {:else}
            <button
                on:click={promptForMetaMask}
                class="riseOnHover transition flex items-center px-8 font-semibold text-black bg-white rounded-lg py-2.5"
            >
                Login
            </button>
        {/if}
    </div>
</div>

<style>
    .Navbar {
        height: 115px;
        min-height: 115px;
        max-height: 115px;
    }
    .loader {
        border: 4px solid #3a3a3aad; /* Light grey */
        border-top: 4px solid #dbdbdb; /* Blue */
        border-radius: 50%;
        width: 25px;
        height: 25px;
        animation: spin 1s linear infinite;
    }
    .riseOnHover:hover {
        transform: translateY(-3px);
    }
</style>
