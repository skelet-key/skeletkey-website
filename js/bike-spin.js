// Puca 360 — Three.js WebGL spin with crossfade between frames
(function () {
  const N = 32;
  const root = document.getElementById("bikeSpin");
  const canvas = document.getElementById("bikeSpinCanvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  const hint = root.querySelector(".spin-hint");
  const loader = new THREE.TextureLoader();
  const textures = [];
  let loaded = 0;

  function loadTex(i) {
    const id = String(i).padStart(2, "0");
    return new Promise(function (resolve) {
      loader.load(
        "assets/spin/" + id + ".jpg",
        function (tex) {
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.colorSpace = THREE.SRGBColorSpace;
          textures[i] = tex;
          resolve();
        },
        undefined,
        function () {
          resolve();
        }
      );
    });
  }

  const jobs = [];
  for (let i = 0; i < N; i++) jobs.push(loadTex(i));

  Promise.all(jobs).then(function () {
    if (textures.filter(Boolean).length < 8) return;
    init();
  });

  function init() {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x0a0a0f, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      tA: { value: textures[0] },
      tB: { value: textures[1] || textures[0] },
      mixAmt: { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
        "  vUv = uv;",
        "  gl_Position = vec4(position, 1.0);",
        "}",
      ].join("\n"),
      fragmentShader: [
        "uniform sampler2D tA;",
        "uniform sampler2D tB;",
        "uniform float mixAmt;",
        "varying vec2 vUv;",
        "void main() {",
        "  vec4 a = texture2D(tA, vUv);",
        "  vec4 b = texture2D(tB, vUv);",
        "  gl_FragColor = mix(a, b, mixAmt);",
        "}",
      ].join("\n"),
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    let angle = 0; // 0..N
    let vel = 0;
    let dragging = false;
    let lastX = 0;
    const PX = 14;

    function applyFrame() {
      let a = angle % N;
      if (a < 0) a += N;
      const i0 = Math.floor(a) % N;
      const i1 = (i0 + 1) % N;
      uniforms.tA.value = textures[i0] || textures[0];
      uniforms.tB.value = textures[i1] || textures[0];
      uniforms.mixAmt.value = a - Math.floor(a);
    }

    function resize() {
      const w = root.clientWidth || 800;
      const h = Math.round(w * (2 / 3));
      renderer.setSize(w, h, false);
    }
    resize();
    window.addEventListener("resize", resize);

    root.classList.add("is-webgl");

    function tick() {
      if (!dragging) {
        vel *= 0.92;
        if (Math.abs(vel) > 0.002) {
          angle += vel;
          applyFrame();
        } else {
          vel = 0;
        }
      }
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    applyFrame();
    tick();

    root.addEventListener("pointerdown", function (e) {
      root.setPointerCapture(e.pointerId);
      dragging = true;
      vel = 0;
      lastX = e.clientX;
      if (hint) hint.style.opacity = "0";
    });
    root.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const da = -dx / PX;
      angle += da;
      vel = da;
      applyFrame();
    });
    function end() {
      dragging = false;
    }
    root.addEventListener("pointerup", end);
    root.addEventListener("pointercancel", end);
    root.addEventListener("lostpointercapture", end);
  }
})();
