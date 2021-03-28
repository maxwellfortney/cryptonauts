<script>
    import { onMount } from "svelte";

    export let miningHistory;
    export let yMax;
    export let yMin;
    export let width;
    export let height;
    let canvas;

    let background = "#FFFFFF";
    let bars = "#000000";

    function render() {
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);

        // console.log("Ymax: ", yMax);
        // console.log("Ymin: ", yMin);

        // const yDiff = yMax = yMin;

        ctx.fillStyle = bars;
        for (let x = 0; x < miningHistory.length; x++) {
            let y = (miningHistory[x] / yMax) * height;
            ctx.fillRect(x, y, 5, height - y);
            // console.log(y);
        }
    }

    function refresh() {
        if (canvas) {
            render();
            requestAnimationFrame(refresh);
        }
    }

    onMount(refresh);
</script>

<canvas class="mx-auto" bind:this={canvas} {width} {height} />

<style>
    canvas {
        outline: #222222 solid 2px;
    }
</style>
