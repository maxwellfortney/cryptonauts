<script>
    import { selectedAccount } from "../../stores/wallet";
    import { isCryptonaut } from "../../stores/contract";

    let isAstronaut = false;
</script>

<div class="flex flex-col items-center justify-start w-10/12 min-h-screen">
    {#if $selectedAccount}
        <div class="flex items-center self-start mt-12">
            <h1 class="mr-4 text-4xl font-bold">Inventory</h1>
            {#if isAstronaut}
                <p class="mt-1 text-base">| Cryptonaut #1</p>
            {:else}
                <p class="mt-1 text-base">| Burn fuel to join next launch</p>
            {/if}
        </div>
    {:else}
        <p>Please login to see your items</p>
    {/if}
</div>
