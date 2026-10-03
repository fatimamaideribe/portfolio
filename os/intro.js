/* ==========================================================================
   Intro — a 3D laptop you open to enter the desktop.
   Drag the lid up (or click / press Enter). Esc or "Skip intro" skips.
   Runs only when <html> has the `intro` class (set by an inline script in
   index.html). Fires `fatos:intro-done` on window when finished.
   Loaded as a classic script (not a module) so it also works when index.html
   is opened straight from Finder (file://); Three.js comes from the CDN.
   ========================================================================== */

(() => {
'use strict';
window.__fatIntroAlive = true;
const LOGO_IMPERIAL = 'data:image/png;base64,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';
const LOGO_RAVENSBOURNE = 'data:image/png;base64,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';
const root = document.documentElement;
const overlay = document.getElementById('intro');
const canvas = document.getElementById('intro-canvas');
const hint = overlay.querySelector('.intro-hint');
const loading = overlay.querySelector('.intro-loading');
const skipBtn = overlay.querySelector('.intro-skip');

let resolvePlay = null;
let finished = false;

function finish() {
    if (finished) return;
    finished = true;
    root.classList.add('intro-out');
    setTimeout(() => window.dispatchEvent(new Event('fatos:intro-done')), 250);
    setTimeout(() => {
        root.classList.remove('intro', 'intro-out');
        if (window.FatIntro) window.FatIntro.stop();
        if (resolvePlay) { resolvePlay(); resolvePlay = null; }
    }, 750);
}

// Skip / Esc / the 6s fail-safe live in a plain inline script in index.html; they call this.
window.FatIntroFinish = finish;
const watchdog = 0;

async function init() {
    let THREE, RoundedBoxGeometry, RoomEnvironment;
    try {
        const [t, rb, re] = await Promise.all([
            import('three'),
            import('three/addons/geometries/RoundedBoxGeometry.js'),
            import('three/addons/environments/RoomEnvironment.js')
        ]);
        THREE = t; RoundedBoxGeometry = rb.RoundedBoxGeometry; RoomEnvironment = re.RoomEnvironment;
    } catch (err) {
        finish();
        return;
    }

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
        finish();
        return;
    }
    clearTimeout(watchdog);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100);

    /* ------------------------------------------------ canvas textures */

    const tex = (cv) => {
        const t = new THREE.CanvasTexture(cv);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return t;
    };
    const mkCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };

    // Don't block on fonts or images: draw now, redraw the moment they arrive
    const fontsReady = Promise.all([document.fonts.load('80px VT323'), document.fonts.load('40px "Fira Code"'), document.fonts.load('30px Nunito')]).catch(() => {});
    // On file:// local images taint canvases (WebGL then refuses them), so fall back to drawn text there
    const localImagesOk = location.protocol !== 'file:';
    const loadImg = (src) => { const i = new Image(); if (localImagesOk) i.src = src; return i; };
    const wallpaper = loadImg('background1.jpeg');
    // School logos are embedded (data URIs) so they work everywhere, including file://.
    // Sources: assets/stickers/imperial.png and assets/stickers/ravensbourne.png
    const logoImperial = new Image(); logoImperial.src = LOGO_IMPERIAL;
    const logoRavens = new Image(); logoRavens.src = LOGO_RAVENSBOURNE;

    // Keyboard deck (colour map + backlight glow map)
    const kbW = 1024, kbH = 440;
    const kb = mkCanvas(kbW, kbH), kbGlow = mkCanvas(kbW, kbH);
    const drawKeyboard = () => {
        const c = kb.getContext('2d'), g = kbGlow.getContext('2d');
        c.fillStyle = '#b9a9e8'; c.fillRect(0, 0, kbW, kbH);
        g.fillStyle = '#000'; g.fillRect(0, 0, kbW, kbH);
        rr(c, 18, 18, kbW - 36, kbH - 36, 22); c.fillStyle = '#231d3d'; c.fill();
        const rows = [14, 14, 13, 12, 11];
        const special = { '0,0': '#ff66ff', '2,12': '#00ffcc', '4,5': null };
        const labels = ['esc 1 2 3 4 5 6 7 8 9 0 - ⌫', 'tab Q W E R T Y U I O P [ ]', 'caps A S D F G H J K L ; ↵', 'shift Z X C V B N M , . /', 'fn ctrl alt ⌘ space ⌘ alt ◀ ▼ ▶'];
        let y = 40;
        const kh = 62, gap = 12;
        rows.forEach((n, ri) => {
            const keys = labels[ri].split(' ');
            let x = 40;
            const total = kbW - 80;
            const widths = keys.map((k) => (k === 'space' ? 4.2 : k.length > 2 ? 1.6 : 1));
            const unit = (total - gap * (keys.length - 1)) / widths.reduce((a, b) => a + b, 0);
            keys.forEach((k, ki) => {
                const w = widths[ki] * unit;
                const col = special[ri + ',' + ki];
                rr(c, x, y, w, kh, 10);
                c.fillStyle = col || '#3a3160'; c.fill();
                c.fillStyle = col ? '#1a0033' : '#cfc6ff';
                c.font = `${k.length > 2 ? 20 : 26}px "Fira Code", monospace`;
                c.textAlign = 'center'; c.textBaseline = 'middle';
                c.fillText(k === 'space' ? '' : k, x + w / 2, y + kh / 2 + 1);
                // backlight: glow around each key + legend
                g.save();
                g.shadowColor = '#00ffcc'; g.shadowBlur = 18;
                rr(g, x + 3, y + 3, w - 6, kh - 6, 8);
                g.strokeStyle = 'rgba(0,255,204,0.55)'; g.lineWidth = 3; g.stroke();
                g.restore();
                g.fillStyle = '#9ffff0';
                g.font = c.font; g.textAlign = 'center'; g.textBaseline = 'middle';
                g.fillText(k === 'space' ? '' : k, x + w / 2, y + kh / 2 + 1);
                x += w + gap;
            });
            y += kh + gap;
        });
    };
    drawKeyboard();
    const kbTex = tex(kb), kbGlowTex = tex(kbGlow);

    // Stickers on the back of the lid: schools + cute ones
    const stW = 1024, stH = 700;
    const st = mkCanvas(stW, stH);
    let stTex = null;
    const drawStickers = () => {
        const c = st.getContext('2d');
        c.clearRect(0, 0, stW, stH);
        // every sticker: white die-cut edge (stroke) under a colour fill, with a soft drop shadow
        const sticker = (x, y, rot, draw) => {
            c.save(); c.translate(x, y); c.rotate(rot);
            c.shadowColor = 'rgba(40,20,80,0.28)'; c.shadowBlur = 12; c.shadowOffsetY = 5;
            draw(true);
            c.shadowColor = 'transparent';
            draw(false);
            c.restore();
        };
        const edge = (path, width = 20) => { path(); c.strokeStyle = '#fff'; c.lineWidth = width; c.lineJoin = 'round'; c.stroke(); c.fillStyle = '#fff'; c.fill(); };
        const face = (x, y, s = 1) => {
            c.fillStyle = '#2a1f3d';
            c.beginPath(); c.arc(x - 16 * s, y, 5 * s, 0, Math.PI * 2); c.arc(x + 16 * s, y, 5 * s, 0, Math.PI * 2); c.fill();
            c.fillStyle = 'rgba(255,120,170,0.6)';
            c.beginPath(); c.ellipse(x - 30 * s, y + 10 * s, 8 * s, 5 * s, 0, 0, Math.PI * 2); c.ellipse(x + 30 * s, y + 10 * s, 8 * s, 5 * s, 0, 0, Math.PI * 2); c.fill();
            c.strokeStyle = '#2a1f3d'; c.lineWidth = 3 * s; c.lineCap = 'round';
            c.beginPath(); c.arc(x, y + 5 * s, 7 * s, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
        };
        const sparkle = (x, y, r, col) => {
            c.beginPath();
            for (let k = 0; k < 8; k++) { const rad = k % 2 ? r * 0.28 : r, a = (k / 8) * Math.PI * 2 - Math.PI / 2; c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); }
            c.closePath(); c.fillStyle = col; c.fill();
        };

        // ☁ kawaii cloud
        sticker(170, 330, -0.08, (base) => {
            const blobs = [[-55, 12, 44], [-10, -18, 56], [48, 0, 48], [-30, 34, 38], [22, 34, 40]];
            const path = () => { c.beginPath(); blobs.forEach(([x, y, r]) => { c.moveTo(x + r, y); c.arc(x, y, r, 0, Math.PI * 2); }); };
            if (base) { blobs.forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r + 10, 0, Math.PI * 2); c.fillStyle = '#fff'; c.fill(); }); return; }
            path(); c.fillStyle = '#bfe3ff'; c.fill();
            face(0, 14);
        });

        // 🌈 rainbow
        sticker(858, 330, 0.12, (base) => {
            if (base) { c.beginPath(); c.arc(0, 40, 104, Math.PI, 0); c.arc(0, 40, 22, 0, Math.PI, true); c.closePath(); c.fillStyle = '#fff'; c.fill(); [[-70, 44], [70, 44]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 36, 0, Math.PI * 2); c.fill(); }); return; }
            ['#ff6b8b', '#ffa94d', '#ffd166', '#7ee0a1', '#74b9ff', '#b58bff'].forEach((col, k) => {
                c.beginPath(); c.arc(0, 40, 90 - k * 11, Math.PI, 0); c.strokeStyle = col; c.lineWidth = 11; c.stroke();
            });
            [[-70, 44], [70, 44]].forEach(([x, y]) => {
                c.fillStyle = '#fff'; c.strokeStyle = '#e4e0f5'; c.lineWidth = 2;
                c.beginPath(); c.arc(x - 12, y + 4, 16, 0, Math.PI * 2); c.arc(x + 12, y + 4, 16, 0, Math.PI * 2); c.arc(x, y - 8, 18, 0, Math.PI * 2); c.fill();
            });
        });

        // ☕ kawaii coffee
        sticker(215, 565, 0.1, (base) => {
            const cup = () => { c.beginPath(); c.roundRect(-58, -34, 116, 96, [6, 6, 34, 34]); };
            const handle = () => { c.beginPath(); c.arc(62, 10, 24, -Math.PI / 2, Math.PI / 2); };
            if (base) {
                cup(); c.lineWidth = 22; c.strokeStyle = '#fff'; c.lineJoin = 'round'; c.stroke(); c.fillStyle = '#fff'; c.fill();
                handle(); c.lineWidth = 36; c.stroke();
                c.beginPath(); c.roundRect(-40, -104, 80, 70, 20); c.fill();
                return;
            }
            handle(); c.strokeStyle = '#ffb3c7'; c.lineWidth = 14; c.stroke();
            cup(); c.fillStyle = '#ffd6e0'; c.fill();
            c.beginPath(); c.ellipse(0, -34, 58, 12, 0, 0, Math.PI * 2); c.fillStyle = '#8a5a3c'; c.fill();
            c.strokeStyle = '#c9b8ee'; c.lineWidth = 6; c.lineCap = 'round';
            [-22, 0, 22].forEach((x) => { c.beginPath(); c.moveTo(x, -52); c.bezierCurveTo(x + 12, -64, x - 12, -76, x, -92); c.stroke(); });
            face(0, 10, 0.9);
        });

        // 🪴 kawaii plant pot (for Plant Buddy)
        sticker(505, 585, -0.06, (base) => {
            const leaves = [[-26, -58, -0.6], [26, -58, 0.6], [0, -74, 0]];
            if (base) {
                leaves.forEach(([x, y, r]) => { c.beginPath(); c.ellipse(x, y, 26, 44, r, 0, Math.PI * 2); c.fillStyle = '#fff'; c.fill(); });
                c.beginPath(); c.moveTo(-62, -30); c.lineTo(62, -30); c.lineTo(46, 62); c.lineTo(-46, 62); c.closePath(); c.lineWidth = 20; c.strokeStyle = '#fff'; c.lineJoin = 'round'; c.stroke(); c.fill();
                return;
            }
            leaves.forEach(([x, y, r], k) => { c.beginPath(); c.ellipse(x, y, 18, 36, r, 0, Math.PI * 2); c.fillStyle = k === 2 ? '#5fd38a' : '#43b86f'; c.fill(); });
            c.beginPath(); c.moveTo(-58, -26); c.lineTo(58, -26); c.lineTo(44, 58); c.lineTo(-44, 58); c.closePath(); c.fillStyle = '#f09a6c'; c.fill();
            c.fillStyle = '#e07f52'; c.fillRect(-62, -34, 124, 20);
            face(0, 16, 0.85);
        });

        // ♥ heart
        sticker(655, 150, 0.22, (base) => {
            const heart = () => { c.beginPath(); c.moveTo(0, 34); c.bezierCurveTo(-70, -8, -40, -62, 0, -28); c.bezierCurveTo(40, -62, 70, -8, 0, 34); c.closePath(); };
            if (base) { edge(heart, 22); return; }
            heart(); c.fillStyle = '#ff6fa8'; c.fill();
            c.beginPath(); c.ellipse(-22, -22, 8, 12, -0.6, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,0.7)'; c.fill();
        });

        // ✿ flower badge, centre
        sticker(512, 340, 0, (base) => {
            if (base) { c.beginPath(); c.arc(0, 0, 126, 0, Math.PI * 2); c.fillStyle = '#fff'; c.fill(); return; }
            const gr = c.createLinearGradient(-116, -116, 116, 116); gr.addColorStop(0, '#00ffcc'); gr.addColorStop(1, '#ff66ff');
            c.beginPath(); c.arc(0, 0, 114, 0, Math.PI * 2); c.fillStyle = gr; c.fill();
            c.fillStyle = '#fff'; c.font = '150px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('✿', 0, -6);
        });

        // name pill
        sticker(808, 118, 0.16, (base) => {
            if (base) { edge(() => { c.beginPath(); c.roundRect(-104, -36, 208, 72, 36); }, 16); return; }
            c.beginPath(); c.roundRect(-104, -36, 208, 72, 36); c.fillStyle = '#1f6fd0'; c.fill();
            c.fillStyle = '#fff'; c.font = '58px VT323'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Fatima', 0, 3);
        });

        // Imperial College London
        sticker(262, 118, -0.07, (base) => {
            if (base) { edge(() => { c.beginPath(); c.roundRect(-170, -52, 340, 104, 16); }, 12); return; }
            c.beginPath(); c.roundRect(-170, -52, 340, 104, 16); c.fillStyle = '#fff'; c.fill();
            if (logoImperial.complete && logoImperial.naturalWidth) c.drawImage(logoImperial, -140, -30, 280, 280 * logoImperial.naturalHeight / logoImperial.naturalWidth);
            else { c.fillStyle = '#0000cd'; c.font = 'bold 40px "Fira Code", monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('IMPERIAL', 0, -12); }
            c.fillStyle = '#0000cd'; c.font = '17px "Fira Code", monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.fillText('Design Engineering · MSc', 0, 30);
        });

        // Ravensbourne University London
        sticker(772, 560, 0.07, (base) => {
            if (base) { edge(() => { c.beginPath(); c.roundRect(-160, -56, 320, 112, 18); }, 12); return; }
            c.beginPath(); c.roundRect(-160, -56, 320, 112, 18); c.fillStyle = '#fff'; c.fill();
            if (logoRavens.complete && logoRavens.naturalWidth) {
                const lw = 272, lh = lw * logoRavens.naturalHeight / logoRavens.naturalWidth;
                c.drawImage(logoRavens, -lw / 2, -lh / 2, lw, lh);
            } else {
                c.fillStyle = '#000'; c.textAlign = 'center'; c.textBaseline = 'middle';
                c.font = 'bold 38px "Fira Code", sans-serif'; c.fillText('Ravensbourne', 0, -14);
                c.font = '24px "Fira Code", sans-serif'; c.fillText('University London', 0, 24);
            }
        });

        // sparkles
        sparkle(96, 150, 26, '#ffd166');
        sparkle(392, 470, 20, '#ffffff');
        sparkle(640, 470, 24, '#ffd166');
        sparkle(958, 200, 18, '#ffffff');
        sparkle(930, 640, 16, '#ffd166');

        if (stTex) stTex.needsUpdate = true;
    };
    drawStickers();
    stTex = tex(st);

    fontsReady.then(() => { drawKeyboard(); kbTex.needsUpdate = true; kbGlowTex.needsUpdate = true; drawStickers(); });
    [logoImperial, logoRavens].forEach((img) => img.addEventListener('load', drawStickers));

    // The screen: off → boot → desktop
    const scW = 1280, scH = 800;
    const sc = mkCanvas(scW, scH);
    const scCtx = sc.getContext('2d');
    const scTex = tex(sc);
    const drawScreen = (mode, t = 0) => {
        const c = scCtx;
        c.save();
        if (mode === 'off') {
            const g = c.createLinearGradient(0, 0, scW, scH);
            g.addColorStop(0, '#15162a'); g.addColorStop(0.45, '#07070f'); g.addColorStop(0.55, '#0b0b18'); g.addColorStop(1, '#030308');
            c.fillStyle = g; c.fillRect(0, 0, scW, scH);
        } else if (mode === 'boot') {
            c.fillStyle = '#000'; c.fillRect(0, 0, scW, scH);
            const g = c.createLinearGradient(300, 0, 980, 0); g.addColorStop(0, '#00ffcc'); g.addColorStop(1, '#ff66ff');
            c.fillStyle = g; c.font = '130px VT323'; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.fillText("Fatima's Laptop", scW / 2, scH / 2 - 20);
            c.strokeStyle = '#555'; c.lineWidth = 4; rr(c, scW / 2 - 200, scH / 2 + 90, 400, 34, 6); c.stroke();
            c.save(); rr(c, scW / 2 - 196, scH / 2 + 94, 392, 26, 4); c.clip();
            const off = ((t * 360) % 480) - 90;
            for (let i = 0; i < 4; i++) { c.fillStyle = '#2f6fe0'; c.fillRect(scW / 2 - 196 + off + i * 26, scH / 2 + 96, 20, 22); }
            c.restore();
        } else {
            // mini desktop, so the zoom lands on something that matches the real one
            if (wallpaper.naturalWidth) {
                const r = Math.max(scW / wallpaper.naturalWidth, scH / wallpaper.naturalHeight);
                const w = wallpaper.naturalWidth * r, h = wallpaper.naturalHeight * r;
                c.drawImage(wallpaper, (scW - w) / 2, (scH - h) / 2, w, h);
            } else { c.fillStyle = '#3a78c9'; c.fillRect(0, 0, scW, scH); }
            const icons = [['🗂️', 'Projects'], ['📱', 'FlowState'], ['🪴', 'PlantBuddy'], ['🌺', 'About Me'], ['✨', 'Skills'], ['✉️', 'Contact']];
            c.textAlign = 'center';
            icons.forEach(([e, n], i) => {
                c.font = '46px serif'; c.textBaseline = 'middle'; c.fillText(e, 60, 64 + i * 108);
                c.font = '17px "Fira Code"'; c.fillStyle = '#fff'; c.shadowColor = 'rgba(0,0,0,0.9)'; c.shadowBlur = 4;
                c.fillText(n, 60, 108 + i * 108); c.shadowBlur = 0;
            });
            c.save(); c.translate(360, 60); c.rotate(-0.03);
            c.fillStyle = '#fff79a'; c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.fillRect(0, 0, 260, 220); c.restore();
            c.fillStyle = '#3a3000'; c.font = '500 22px Nunito, Arial'; c.textAlign = 'left';
            c.fillText("Hi, I'm Fatima 👋", 380, 130); c.fillText('poke around!', 380, 170);
            const bar = c.createLinearGradient(0, scH - 56, 0, scH); bar.addColorStop(0, '#2a8fe0'); bar.addColorStop(1, '#0e5596');
            c.fillStyle = bar; c.fillRect(0, scH - 56, scW, 56);
            const st = c.createLinearGradient(0, scH - 50, 0, scH - 6); st.addColorStop(0, '#5fd35f'); st.addColorStop(1, '#268a26');
            rr(c, 8, scH - 49, 130, 42, [6, 20, 20, 6]); c.fillStyle = st; c.fill();
            c.fillStyle = '#fff'; c.font = '34px VT323'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('✿ start', 72, scH - 27);
            c.font = '22px "Fira Code"'; c.textAlign = 'right';
            const now = new Date();
            c.fillText(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), scW - 24, scH - 28);
        }
        c.restore();
        scTex.needsUpdate = true;
    };
    drawScreen('off');

    // Soft contact shadow + faint Y2K grid on the desk
    const shadowCv = mkCanvas(256, 256);
    {
        const c = shadowCv.getContext('2d');
        const g = c.createRadialGradient(128, 128, 10, 128, 128, 128);
        g.addColorStop(0, 'rgba(0,0,10,0.75)'); g.addColorStop(0.55, 'rgba(0,0,10,0.35)'); g.addColorStop(1, 'rgba(0,0,10,0)');
        c.fillStyle = g; c.fillRect(0, 0, 256, 256);
    }
    const gridCv = mkCanvas(1024, 1024);
    {
        const c = gridCv.getContext('2d');
        c.strokeStyle = 'rgba(160, 120, 255, 0.55)'; c.lineWidth = 2;
        for (let i = 0; i <= 1024; i += 64) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 1024); c.moveTo(0, i); c.lineTo(1024, i); c.stroke(); }
        c.globalCompositeOperation = 'destination-in';
        const m = c.createRadialGradient(512, 512, 60, 512, 512, 512);
        m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = m; c.fillRect(0, 0, 1024, 1024);
    }

    /* ------------------------------------------------------ the laptop */

    const W = 3.4, D = 2.3, BASE_H = 0.13, LID_H = 2.2, LID_T = 0.07;
    const laptop = new THREE.Group();
    scene.add(laptop);

    const shell = new THREE.MeshPhysicalMaterial({
        color: 0xcdbdf5, metalness: 0.55, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.2,
        iridescence: 0.55, iridescenceIOR: 1.35, iridescenceThicknessRange: [200, 600]
    });

    const base = new THREE.Mesh(new RoundedBoxGeometry(W, BASE_H, D, 5, 0.06), shell);
    base.position.y = BASE_H / 2;
    laptop.add(base);

    const deck = new THREE.Mesh(
        new THREE.PlaneGeometry(W * 0.9, W * 0.9 * (kbH / kbW)),
        new THREE.MeshStandardMaterial({ map: kbTex, emissiveMap: kbGlowTex, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.6, metalness: 0.1 })
    );
    deck.rotation.x = -Math.PI / 2;
    deck.position.set(0, BASE_H + 0.002, -D * 0.12);
    laptop.add(deck);

    const pad = new THREE.Mesh(new RoundedBoxGeometry(1.15, 0.01, 0.68, 2, 0.004), new THREE.MeshPhysicalMaterial({ color: 0xbfaff0, metalness: 0.4, roughness: 0.18, clearcoat: 1 }));
    pad.position.set(0, BASE_H + 0.001, D * 0.3);
    laptop.add(pad);

    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, W * 0.86, 24), new THREE.MeshStandardMaterial({ color: 0x8f82bd, metalness: 0.8, roughness: 0.3 }));
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, BASE_H, -D / 2 + 0.05);
    laptop.add(hinge);

    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, BASE_H, -D / 2 + 0.03);
    laptop.add(lidPivot);

    const lid = new THREE.Mesh(new RoundedBoxGeometry(W, LID_H, LID_T, 5, 0.03), shell);
    lid.position.set(0, LID_H / 2, -LID_T / 2);
    lidPivot.add(lid);

    const bezel = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.975, LID_H * 0.955), new THREE.MeshStandardMaterial({ color: 0x0a0a14, roughness: 0.25, metalness: 0.2 }));
    bezel.position.set(0, LID_H / 2, 0.001);
    lidPivot.add(bezel);

    const SCR_W = W * 0.92, SCR_H = SCR_W * (scH / scW);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCR_W, SCR_H), new THREE.MeshBasicMaterial({ map: scTex, toneMapped: false }));
    screen.position.set(0, LID_H / 2 + 0.02, 0.002);
    lidPivot.add(screen);

    const camDot = new THREE.Mesh(new THREE.CircleGeometry(0.018, 16), new THREE.MeshBasicMaterial({ color: 0x223355 }));
    camDot.position.set(0, LID_H * 0.965, 0.003);
    lidPivot.add(camDot);

    const back = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.9, W * 0.9 * (stH / stW)), new THREE.MeshStandardMaterial({ map: stTex, transparent: true, roughness: 0.45 }));
    back.rotation.set(0, Math.PI, Math.PI); // readable while the lid is closed (that's what visitors see first)
    back.position.set(0, LID_H / 2, -LID_T - 0.002);
    lidPivot.add(back);

    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.7, D * 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCv), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.001;
    scene.add(shadow);

    const grid = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), new THREE.MeshBasicMaterial({ map: tex(gridCv), transparent: true, depthWrite: false, opacity: 0.55 }));
    grid.rotation.x = -Math.PI / 2;
    scene.add(grid);

    /* ---------------------------------------------------------- lights */

    scene.add(new THREE.HemisphereLight(0xcfd8ff, 0x2a1a55, 0.6));
    const key = new THREE.DirectionalLight(0xfff1e6, 1.6);
    key.position.set(3, 6, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0xff66ff, 14, 12);
    rim.position.set(-3.5, 2.5, -3);
    scene.add(rim);
    const rim2 = new THREE.PointLight(0x00ffcc, 10, 12);
    rim2.position.set(3.8, 1.5, -2.5);
    scene.add(rim2);
    const glow = new THREE.PointLight(0x9fd8ff, 0, 5);
    glow.position.set(0, 1.2, 0.9);
    scene.add(glow);

    /* ---------------------------------------------------------- state */

    const CLOSED = Math.PI / 2 - 0.004;
    const OPEN = -0.3;
    const S = {
        open: 0, openTarget: null, dragging: false, stage: 'closed', // closed → opening → booting → zooming → done
        power: 0, bootT: 0, px: 0, py: 0, sx: 0, sy: 0, zoom: 0
    };
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const camStart = new THREE.Vector3();
    const lookStart = new THREE.Vector3(0, 0.55, 0);
    const fitCamera = () => {
        const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        // far enough that the whole laptop fits the width on narrow/portrait screens
        const fitW = 2.25 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect);
        const dist = Math.max(6.4, fitW);
        camStart.set(0, dist * 0.52, dist * 0.86);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    fitCamera();
    window.addEventListener('resize', fitCamera);

    /* ------------------------------------------------------ interaction */

    let downY = 0, downOpen = 0, downT = 0, moved = false;
    canvas.addEventListener('pointerdown', (e) => {
        if (S.stage !== 'closed' && S.stage !== 'opening') return;
        S.dragging = true;
        moved = false;
        downY = e.clientY; downOpen = S.open; downT = performance.now();
        S.openTarget = null;
        canvas.setPointerCapture(e.pointerId);
        overlay.classList.add('grabbing');
    });
    canvas.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        S.px = (e.clientX - r.left) / r.width - 0.5;
        S.py = (e.clientY - r.top) / r.height - 0.5;
        if (!S.dragging) return;
        const dy = downY - e.clientY;
        if (Math.abs(dy) > 4) moved = true;
        S.open = Math.min(1, Math.max(0, downOpen + dy / (r.height * 0.38)));
        if (S.open > 0.02) S.stage = 'opening';
        if (S.open > 0.08) hint.classList.add('faded');
    });
    const release = () => {
        if (!S.dragging) return;
        S.dragging = false;
        overlay.classList.remove('grabbing');
        const quick = performance.now() - downT < 280;
        if (!moved || S.open > 0.33 || (quick && S.open > 0.1)) openLid();
        else { S.openTarget = 0; }
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    window.addEventListener('keydown', (e) => {
        if (!root.classList.contains('intro')) return;
        if ((e.key === 'Enter' || e.key === ' ') && (S.stage === 'closed' || S.stage === 'opening')) { e.preventDefault(); openLid(); }
    });

    function openLid() {
        S.openTarget = 1;
        S.stage = 'opening';
        hint.classList.add('faded');
    }

    /* ------------------------------------------------------ the loop */

    const tmpV = new THREE.Vector3(), tmpN = new THREE.Vector3(), tmpUp = new THREE.Vector3();
    const look = new THREE.Vector3().copy(lookStart);
    const camPos = new THREE.Vector3();
    let zoomFrom = null;
    let last = performance.now();
    let raf = 0;

    const frame = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        // lid physics: spring towards target when not dragging
        if (!S.dragging && S.openTarget != null) {
            const k = S.openTarget === 1 ? 5.5 : 9;
            S.open += (S.openTarget - S.open) * Math.min(1, dt * k);
            if (Math.abs(S.openTarget - S.open) < 0.002) {
                S.open = S.openTarget;
                if (S.openTarget === 0) { S.stage = 'closed'; S.openTarget = null; hint.classList.remove('faded'); }
                else if (S.stage === 'opening') { S.stage = 'booting'; S.bootT = 0; }
            }
        }
        // a little overshoot as it settles open
        const settle = S.stage === 'opening' && S.openTarget === 1 ? Math.sin(S.open * Math.PI) * 0.04 : 0;
        lidPivot.rotation.x = lerp(CLOSED, OPEN, S.open) - settle;

        // screen power & boot sequence
        if (S.stage === 'booting') {
            S.bootT += dt;
            S.power = Math.min(1, S.power + dt * 1.6);
            if (S.bootT < 1.5) drawScreen('boot', S.bootT);
            else if (S.bootT < 1.55) drawScreen('desktop');
            if (S.bootT > 2.2) {
                S.stage = 'zooming';
                S.zoom = 0;
                zoomFrom = { pos: camera.position.clone(), look: look.clone(), up: camera.up.clone() };
            }
        } else if (S.stage === 'opening' && S.open > 0.55) {
            S.power = Math.min(0.35, S.power + dt * 0.8);
        }
        deck.material.emissiveIntensity = S.power * 1.15;
        glow.intensity = S.power * 5;
        screen.material.color.setScalar(S.stage === 'closed' || S.stage === 'opening' ? 1 : 0.4 + S.power * 0.6);

        // camera: gentle parallax, then fly into the screen
        const t = now / 1000;
        if (S.stage !== 'zooming' && S.stage !== 'done') {
            const openLift = S.open * 0.35;
            camPos.set(
                camStart.x + S.px * 1.4 + Math.sin(t * 0.35) * 0.08,
                camStart.y - S.py * 0.8 - openLift + Math.sin(t * 0.5) * 0.04,
                camStart.z - S.open * 0.9
            );
            camera.position.lerp(camPos, Math.min(1, dt * 3));
            look.lerp(tmpV.set(0, 0.55 + S.open * 0.55, -S.open * 0.35), Math.min(1, dt * 3));
            camera.up.set(0, 1, 0);
            camera.lookAt(look);
        } else if (S.stage === 'zooming') {
            S.zoom = Math.min(1, S.zoom + dt / 1.35);
            const k = ease(S.zoom);
            screen.getWorldPosition(tmpV);
            tmpN.set(0, 0, 1).applyQuaternion(screen.getWorldQuaternion(new THREE.Quaternion()));
            tmpUp.set(0, 1, 0).applyQuaternion(screen.getWorldQuaternion(new THREE.Quaternion()));
            const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const dH = (SCR_H / 2) / tan, dW = (SCR_W / 2) / (tan * camera.aspect);
            const d = Math.min(dH, dW) * 0.985;
            const target = tmpV.clone().addScaledVector(tmpN, d);
            camera.position.lerpVectors(zoomFrom.pos, target, k);
            look.lerpVectors(zoomFrom.look, tmpV, k);
            camera.up.lerpVectors(zoomFrom.up, tmpUp, k).normalize();
            camera.lookAt(look);
            if (S.zoom >= 1) { S.stage = 'done'; finish(); }
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
    };

    loading.hidden = true;
    overlay.classList.add('ready');
    raf = requestAnimationFrame(frame);

    window.FatIntro = {
        stop() {
            cancelAnimationFrame(raf);
            raf = 0;
        },
        // Replay from a closed lid (used by Start → Restart)
        play() {
            return new Promise((resolve) => {
                resolvePlay = resolve;
                finished = false;
                Object.assign(S, { open: 0, openTarget: null, dragging: false, stage: 'closed', power: 0, bootT: 0, zoom: 0 });
                drawScreen('off');
                camera.position.copy(camStart);
                look.copy(lookStart);
                camera.up.set(0, 1, 0);
                hint.classList.remove('faded');
                root.classList.remove('intro-out');
                root.classList.add('intro');
                fitCamera();
                last = performance.now();
                if (!raf) raf = requestAnimationFrame(frame);
            });
        }
    };
    camera.position.copy(camStart);
}

if (root.classList.contains('intro')) init().catch(() => finish());
else {
    // Not shown this time, but load quietly so Restart can replay it
    clearTimeout(watchdog);
    const lazy = () => init().catch(() => {});
    if (window.matchMedia('(max-width: 768px)').matches) { /* phones restart without the 3D laptop */ }
    else if ('requestIdleCallback' in window) requestIdleCallback(lazy, { timeout: 4000 }); else setTimeout(lazy, 2500);
}
})();
