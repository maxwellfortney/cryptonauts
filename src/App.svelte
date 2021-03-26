<script>
    import { onMount } from "svelte";
    import Tailwind from "./Tailwind.svelte";
    import Router from "svelte-spa-router";
    import { routes } from "./routes.js";
    import Navbar from "./components/Navbar.svelte";
    import Footer from "./components/Footer.svelte";
    import CornerMiner from "./components/Miner/CornerMiner.svelte";

    import { initWallet, selectedAccount } from "./stores/wallet.js";
    import { connect } from "./stores/contract.js";

    let statusMessage = "Connect to MetaMask";

    onMount(async () => {
        await initWallet();
        await connect();
    });
</script>

<Tailwind />

<div class="flex flex-col items-center justify-start w-full h-full">
    {#if $selectedAccount}
        <CornerMiner />
    {/if}
    <Navbar />
    <Router {routes} />
    <Footer />
</div>

<style>
</style>
