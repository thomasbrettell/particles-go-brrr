<script lang="ts">
  import Lenis from "lenis";
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import Stats from "stats.js";
  import {
    generateIsoPositions,
    generateTorusPositions,
  } from "./utils/generatePositions";
  import padPositions from "./utils/padPositions";
  import frag from "./shaders/particle/frag.glsl";
  import vert from "./shaders/particle/vert.glsl";

  const url = new URL(window.location.href);
  const showFPS = Boolean(url.searchParams.get("fps"));

  gsap.registerPlugin(ScrollTrigger);

  let canvasContainerRef: HTMLElement;

  onMount(() => {
    const lenis = new Lenis({
      autoRaf: true,
      infinite: true,
      lerp: 0.05,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const stats = new Stats();
    if (showFPS) document.body.appendChild(stats.dom);

    const seconaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-secondary")
      .trim();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainerRef.appendChild(renderer.domElement);

    const isoPositions = generateIsoPositions();
    const torusPositions = padPositions(
      generateTorusPositions(),
      isoPositions.count
    );
    // const ringPositions = generateRingPositions();
    // console.log(ringPositions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", isoPositions);
    geometry.setAttribute("position_2", torusPositions);

    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uSize: new THREE.Uniform(0.005),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * devicePixelRatio
          )
        ),
        uProgress: new THREE.Uniform(0),
      },
      transparent: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    particles.rotation.set(Math.PI, Math.PI, 0);

    // const tl = gsap.timeline({
    //   paused: true,
    //   defaults: {
    //     ease: "linear",
    //   },
    // });
    // tl.to(
    //   particles.rotation,
    //   {
    //     x: Math.PI * 2,
    //   },
    //   0
    // );
    // tl.to(
    //   particles.rotation,
    //   {
    //     y: Math.PI * 2,
    //   },
    //   0
    // );
    // tl.to(
    //   particles.rotation,
    //   {
    //     z: Math.PI * 2,
    //   },
    //   0
    // );

    const progressTl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "linear",
      },
    });
    progressTl.to(particles.material.uniforms.uProgress, {
      value: 1,
    });
    progressTl.to(particles.material.uniforms.uProgress, {
      value: 0,
    });

    ScrollTrigger.create({
      trigger: "#root",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      immediateRender: true,
      onUpdate: (e) => {
        progressTl.progress(e.progress);
      },
    });

    function animate() {
      stats.begin();

      renderer.render(scene, camera);

      stats.end();
    }
    renderer.setAnimationLoop(animate);
  });
</script>

<div id="root">
  <div class="canvas-container" bind:this={canvasContainerRef}></div>
</div>

<style>
  #root {
    height: 10000px;
  }

  .canvas-container {
    position: fixed;
    top: 0;
  }
</style>
