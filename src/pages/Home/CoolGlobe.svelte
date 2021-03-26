<script>
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import ResizeObserver from "svelte-resize-observer";
    import Globe from "../../assets/globe.jpg";
    import Albedo from "../../assets/Albedo.jpg";
    import Bump from "../../assets/Bump.png";
    import Clouds from "../../assets/Clouds2.jpg";
    import SpecularMap from "../../assets/Ocean_Mask.png";

    let WIDTH = 500;
    let HEIGHT = 500;

    const VIEW_ANGLE = 45;
    $: ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    let camera, scene, renderer, controls;
    let earth, clouds;
    let container;

    let lastLaunchMS = 1616389177966;

    let nextLaunchTimeString = "7d 00h 00m 00s";

    function nextweek() {
        var lastLaunch = new Date(lastLaunchMS);
        var nextweek = new Date(
            lastLaunch.getFullYear(),
            lastLaunch.getMonth(),
            lastLaunch.getDate() + 7
        );
        return nextweek;
    }

    function onWindowResize() {
        camera.aspect = ASPECT;
        controlEarthScale();
        camera.updateProjectionMatrix();
        // earth.updateMatrix();

        controls ? controls.update() : null;
        renderer.setSize(WIDTH, HEIGHT);
    }

    function controlEarthScale() {
        // let bodyWidth = document.body.clientWidth;
        console.log(WIDTH);
        if (WIDTH >= 1400) {
            camera.position.z = 2.6;
            console.log("CAMERA Z : 2.6");
            return;
        } else if (WIDTH < 1400 && WIDTH >= 1000) {
            camera.position.z = 2.9;
            console.log("CAMERA Z : 2.9");
            return;
        } else if (WIDTH < 1000 && WIDTH >= 700) {
            camera.position.z = 3.6;
            console.log("CAMERA Z : 3.6");
            return;
        } else if (WIDTH < 700 && WIDTH >= 500) {
            camera.position.z = 3.9;
            console.log("CAMERA Z : 3.9");
            return;
        } else if (WIDTH < 500) {
            camera.position.z = 4.3;
            console.log("CAMERA Z : 4.3");
            return;
        }
    }

    async function startLaunchCountdown() {
        var x = setInterval(function () {
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = nextweek() - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            var minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            nextLaunchTimeString =
                days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

            // If the count down is finished, write some text
            if (distance < 1000 * 60 * 60 * 24) {
                clearInterval(x);
                nextLaunchTimeString = "Launched Recently";
            }
        }, 1000);
    }

    onMount(async () => {
        // Start the launch timer interal
        startLaunchCountdown();

        // Initialize MOTHER EARTH
        container = document.getElementsByClassName("globeContainer")[0];
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(WIDTH, HEIGHT);

        container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, ASPECT, 0.1, 1000);
        camera.position.z = 2.6;
        controls = new OrbitControls(camera, renderer.domElement);
        controls.dampingFactor = 0.25;
        controls.enableZoom = false;

        const light = new THREE.AmbientLight(0xeeeeee); // soft white light
        scene.add(light);

        var light2 = new THREE.DirectionalLight(0xffffff);
        light2.position.set(0, 1, 1).normalize();
        scene.add(light2);

        const loader = new THREE.TextureLoader();

        const map = loader.load(Albedo);
        const bumpMap = loader.load(Bump);
        const specularMap = loader.load(SpecularMap);

        earth = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshPhongMaterial({
                map,
                bumpMap,
                specularMap,
                // specular: new THREE.Color("black"),
            })
        );

        clouds = new THREE.Mesh(
            new THREE.SphereGeometry(1.005, 32, 32),
            new THREE.MeshPhongMaterial({
                map: loader.load(Clouds),
                alphaMap: loader.load(Clouds),
                side: THREE.DoubleSide,
                opacity: 0.65,
                transparent: true,
                depthWrite: false,
            })
        );
        earth.add(clouds);
        scene.add(earth);

        let itCount = 0;
        var animate = function () {
            requestAnimationFrame(animate);
            if (itCount > 10) {
                earth.rotation.x -= 0.001;
                itCount = 0;
            }
            itCount++;
            earth.rotation.y += 0.0006;
            clouds.rotation.y += 0.0003;

            renderer.render(scene, camera);
        };

        animate();
    });
</script>

<div
    class="relative flex items-center justify-center w-full globeContainer"
    bind:clientHeight={HEIGHT}
    bind:clientWidth={WIDTH}
>
    <ResizeObserver on:resize={(e) => onWindowResize(e)} />
    <!-- <div class="relative flex w-full h-full">
        
    </div> -->
    <div
        class="absolute flex flex-col items-center mx-auto nextLaunchContainer"
    >
        <p class="text-4xl font-bold">Next Launch</p>
        <div
            class="flex items-center justify-center flex-none px-4 py-5 text-4xl font-bold text-black bg-white md:text-5xl lg:text-6xl 2xl:text-7xl rounded-xl"
        >
            {nextLaunchTimeString}
        </div>
    </div>
</div>

<style>
    .globeContainer {
        min-height: 75vh;
        margin-bottom: 11vh;
    }

    .globeContainer:hover {
        cursor: grab;
    }

    .nextLaunchContainer {
        top: 55%;
        max-width: 850px;
    }

    .nextLaunchContainer:hover {
        cursor: auto !important;
    }
</style>
