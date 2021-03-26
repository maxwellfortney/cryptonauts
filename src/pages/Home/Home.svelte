<script>
    import { onMount } from "svelte";
    import CoolGlobe from "./CoolGlobe.svelte";
</script>

<div
    class="flex flex-col items-center justify-center flex-auto w-11/12 realtive heroContainer"
>
    <div class="flex flex-col items-center justify-center heroTextContainer">
        <h1 class="text-4xl font-bold text-center 2xl:text-5xl">
            Uncover Rare Earth <br />Materials.
        </h1>
        <h2 class="text-xl font-semibold text-center 2xl:text-2xl">
            Board The Spaceship.
        </h2>
        <h2 class="text-6xl font-black text-center 2xl:text-7xl">
            Pioneer The Galaxy.
        </h2>
    </div>
    <CoolGlobe />
    <div class="flex flex-col items-center justify-start text-center">
        <h2 class="self-start text-5xl font-bold mb-14">How it works</h2>
        <p class="w-3/4 mb-8 text-xl">
            In order to board The Spaceship to explore the galaxy, you must
            contribute to the fuel supply or pay the boarding fee. This can be
            done by mining <a href="/materials/coal" class="linkUnderline"
                >Coal</a
            >, <a href="/materials/oil" class="linkUnderline">Oil</a> or
            <a href="/materials/uranium" class="linkUnderline">Uranium</a>, or
            by discovering a
            <a href="/materials/solar-panel" class="linkUnderline"
                >Solar Panel</a
            >, and adding the item to The Spaceship’s inventory (burning the
            token).
        </p>
        <p class="w-3/4 mb-8 text-xl text-center">
            Once you obtain a boarding pass you will automatically board The
            Spaceship upon the next launch, and will become a permanent resident
            onboard (Dont forget to say goodbye to dear old Mother Earth).
        </p>
        <p class="w-3/4 text-xl text-center">
            Permanent residents are capable of mining asteroids, and will reap
            the benefits.<br />Who knows whats out there....
        </p>
    </div>
</div>

<style>
    .heroTextContainer {
        min-height: calc(75vh - 115px);
    }
    /* .heroTextContainer {
        transform: translateY(-18vh);
    } */
    .linkUnderline {
        color: #3ea2ff;
        text-decoration: underline;
        text-decoration-color: #3ea2ff;
    }
</style>
