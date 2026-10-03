/* ==========================================================================
   A tiny desktop OS for Fatima's portfolio
   Sections: utils · data · sound · window manager · desktop icons · gadgets ·
   taskbar & tray · start menu · context menu · toasts · apps · screensaver ·
   power · boot
   ========================================================================== */
(() => {
'use strict';

/* ------------------------------------------------------------------ utils */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const isPhone = () => window.matchMedia('(max-width: 768px)').matches;
const isTouch = (e) => e && e.pointerType === 'touch';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const bootTime = Date.now();

const store = {
    get(k, d) { try { const v = localStorage.getItem('fatos:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('fatos:' + k, JSON.stringify(v)); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem('fatos:' + k); } catch { /* ignore */ } }
};

const desktopEl = $('#desktop');
const winLayer = $('#windows');
const deskRect = () => ({ w: desktopEl.clientWidth, h: desktopEl.clientHeight });

/* ------------------------------------------------------------------ data */

const PROJECTS = [
    { id: 'flowstate', title: 'FlowState', file: 'flowstate.html', thumb: 'assets/thumbs/flowstate.webp', icon: '📱', group: 'msc', isNew: true, album: 'flowstate',
      kind: 'UX / UI case study', blurb: "A focus app that pauses distracting apps until you've verified the task is done. Taken from interviews through paper, lo-fi and hi-fi prototypes to think-aloud testing.",
      tags: ['UX Research', 'Figma', 'Usability Testing', 'Mobile UI'] },
    { id: 'plant-buddy', title: 'Smart Plant Buddy', file: 'plant-buddy.html', thumb: 'assets/thumbs/plant-buddy.webp', icon: '🪴', group: 'msc', isNew: true, album: 'plant',
      kind: 'IoT system', blurb: "An ESP32 plant monitor with four sensors, Firebase logging, a live Chart.js dashboard and an OLED face that shows the plant's mood.",
      tags: ['ESP32', 'IoT', 'Firebase', 'Data Analysis'] },
    { id: 'ai-study-buddy', title: 'AI Study Buddy', file: 'ai-study-buddy.html', thumb: 'assets/thumbs/study-buddy.webp', icon: '🤖', group: 'earlier', album: 'study',
      kind: 'Educational robot', blurb: 'An ESP32-powered robot study companion with speech recognition, flashcards and adaptive learning.',
      tags: ['ESP32', 'AI Integration', 'UX Design'] },
    { id: 'snake-ai', title: 'A* Pathfinding Snake', file: 'snake-ai.html', thumb: 'assets/thumbs/snake.webp', icon: '🐍', group: 'earlier',
      kind: 'Algorithm / game', blurb: 'Classic snake with an AI that uses A* search to reach the food while avoiding itself. There is a playable version in the Snake app on this desktop.',
      tags: ['Python', 'A* Algorithm', 'Game Dev'] },
    { id: 'wildwise', title: 'Wildwise', file: 'wildwise.html', thumb: 'assets/thumbs/wildwise.webp', icon: '🐾', group: 'earlier', album: 'wildwise',
      kind: 'Brand & campaign', blurb: 'A conservation brand spanning a Roblox game, social campaign and poster series.',
      tags: ['Roblox Studio', 'Branding', 'Graphic Design'] },
    { id: 'arduino-fan', title: 'Automated Exhaust Fan', file: 'arduino-fan.html', thumb: 'assets/thumbs/fan.webp', icon: '🌀', group: 'earlier', album: 'fan',
      kind: 'Physical computing', blurb: 'An Arduino system that switches an exhaust fan based on sensor readings, with LCD feedback.',
      tags: ['Arduino', 'C++', 'Sensors'] },
    { id: 'bakery', title: 'Bakery Website', file: 'bakery.html', thumb: 'assets/thumbs/bakery.webp', icon: '🧁', group: 'earlier', album: 'bakery',
      kind: 'Web design & build', blurb: 'A full-stack website for a bakery with a product catalogue, ordering and an admin dashboard.',
      tags: ['HTML/CSS', 'JavaScript', 'PHP', 'MySQL'] }
];
const projectById = (id) => PROJECTS.find((p) => p.id === id);

const A = (dir, names) => names.map(([f, cap]) => ({ src: `assets/${dir}/${f}`, cap }));
const ALBUMS = [
    { id: 'flowstate', name: 'FlowState', icon: '📱', project: 'flowstate', photos: A('FlowState', [
        ['home.webp', 'Home screen'], ['trigger.webp', 'The moment of temptation'], ['intervention.webp', 'Instagram is paused'], ['breakdown.webp', 'Break it down'],
        ['focus-timer.webp', 'Focus timer'], ['verify.webp', 'How would you like to verify?'], ['upload.webp', 'Upload proof'], ['social-key.webp', 'Social key'],
        ['success.webp', 'Break earned!'], ['persona.webp', 'Persona: Marcus'], ['flow-v1.webp', 'First user flow'], ['flow-final.webp', 'Final user flow'],
        ['paper-1.webp', 'Paper prototype testing'], ['paper-2.webp', 'Paper prototype, first iteration'], ['paper-3.webp', 'Paper prototype, final iteration'],
        ['paper-notes.webp', 'The full paper flow'], ['testing.webp', 'Think-aloud testing'], ['competitor-table.webp', 'Competitive analysis']]) },
    { id: 'plant', name: 'Plant Buddy', icon: '🪴', project: 'plant-buddy', photos: A('PlantBuddy', [
        ['setup.webp', 'The setup'], ['oled.webp', 'OLED showing "happy"'], ['circuit.webp', 'Circuit schematic'], ['architecture.webp', 'Three-tier architecture'],
        ['dashboard-live.webp', 'Live dashboard'], ['dashboard-overview.webp', 'Dashboard overview'], ['time-series.webp', '7 days of readings'],
        ['correlation.webp', 'Sensor correlations'], ['mood-distribution.webp', 'Mood distribution'], ['serial-log.webp', 'Serial monitor']]) },
    { id: 'wildwise', name: 'Wildwise', icon: '🐾', project: 'wildwise', photos: A('Wildwise', [
        ['brandboard.webp', 'Brand board'], ['brandmoodboard.webp', 'Brand mood board'], ['posterswildwise.webp', 'Poster series'], ['gamemoodboard.webp', 'Game mood board'],
        ['storyboard.webp', 'Game storyboard'], ['Group 124 2.webp', 'Social post'], ['Group 126 2.webp', 'Social post']]) },
    { id: 'bakery', name: 'Bakery', icon: '🧁', project: 'bakery', photos: A('Bakery', [
        ['CakeSwirlHompage.webp', 'Homepage'], ['ProductGallery.webp', 'Product gallery'], ['CustomerReviewSection.webp', 'Customer reviews'],
        ['basicwireframe.webp', 'Basic wireframe'], ['advancedwireframe.webp', 'Advanced wireframe'], ['cakeswirlmoodboard.webp', 'Mood board']]) },
    { id: 'fan', name: 'Exhaust Fan', icon: '🌀', project: 'arduino-fan', photos: A('fan', [
        ['final1.webp', 'Final build'], ['final2.webp', 'Final build'], ['final3.webp', 'Final build'], ['final4.webp', 'Final build'],
        ['finalscematic.webp', 'Schematic'], ['test1.webp', 'Testing'], ['test2.webp', 'Testing']]) },
    { id: 'study', name: 'Study Buddy', icon: '🤖', project: 'ai-study-buddy', photos: A('StudyBuddy', [
        ['studybuddyiconheroimage.jpg', 'Study Buddy'], ['studybuddybuilding.jpg', 'Building it'], ['studybuddy3.jpg', 'Study Buddy'], ['Studybuddyschmatic.png', 'Schematic']]) }
];

/* ------------------------------------------------------------------ sound */

const Sound = {
    on: store.get('sound', false),
    ctx: null,
    notes: {
        click: [[1200, 0.025]],
        open: [[523, 0.06], [784, 0.09]],
        close: [[659, 0.05], [440, 0.08]],
        min: [[700, 0.05], [460, 0.07]],
        error: [[196, 0.14], [147, 0.2]],
        notify: [[784, 0.08], [1175, 0.14]],
        startup: [[392, 0.14], [523, 0.14], [659, 0.14], [784, 0.14], [1047, 0.4]],
        off: [[784, 0.14], [523, 0.14], [392, 0.14], [262, 0.4]]
    },
    play(type) {
        if (!this.on) return;
        try {
            this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
            const c = this.ctx;
            let t = c.currentTime + 0.01;
            (this.notes[type] || []).forEach(([f, d]) => {
                const o = c.createOscillator();
                const g = c.createGain();
                o.type = 'triangle';
                o.frequency.value = f;
                g.gain.setValueAtTime(0.0001, t);
                g.gain.exponentialRampToValueAtTime(0.07, t + 0.012);
                g.gain.exponentialRampToValueAtTime(0.0001, t + d);
                o.connect(g).connect(c.destination);
                o.start(t);
                o.stop(t + d + 0.03);
                t += d * 0.85;
            });
        } catch { /* no audio */ }
    },
    set(on) {
        this.on = on;
        store.set('sound', on);
        $('#tray-vol').textContent = on ? '🔊' : '🔇';
        $('#tray-vol').setAttribute('aria-label', 'Sound: ' + (on ? 'on' : 'off'));
        $('#vol-switch').setAttribute('aria-checked', String(on));
        $$('[data-setting="sound"]').forEach((s) => s.setAttribute('aria-checked', String(on)));
        if (on) this.play('notify');
    }
};

/* --------------------------------------------------------- window manager */

const WM = {
    wins: new Map(),
    z: 20,
    cascade: 0,
    focused: null,

    open(appId, opts = {}) {
        const app = APPS[appId];
        if (!app) return null;
        let w = this.wins.get(appId);
        if (w) {
            if (w.min) this.restore(w);
            this.focus(w);
            if (app.reopen) app.reopen(w, opts);
            return w;
        }
        const el = h(`<section class="win" role="dialog" aria-label="${esc(app.title)}" data-app="${appId}">
            <header class="win-bar"><span class="win-ico" aria-hidden="true">${app.icon}</span><span class="win-title">${esc(app.title)}</span>
                <div class="win-ctrls"><button class="wc min" aria-label="Minimize"></button><button class="wc max" aria-label="Maximize"></button><button class="wc close" aria-label="Close"></button></div>
            </header>
            <div class="win-body${app.pad ? ' pad' : ''}"></div>
            <i class="rz n" data-d="n"></i><i class="rz s" data-d="s"></i><i class="rz e" data-d="e"></i><i class="rz w" data-d="w"></i>
            <i class="rz ne" data-d="ne"></i><i class="rz nw" data-d="nw"></i><i class="rz se" data-d="se"></i><i class="rz sw" data-d="sw"></i>
        </section>`);
        const body = $('.win-body', el);
        if (app.tpl) body.append(document.getElementById(app.tpl).content.cloneNode(true));
        w = { id: appId, app, el, body, min: false, max: false, prev: null, cleanup: [] };

        const D = deskRect();
        const ww = Math.min(opts.w || app.w, D.w - 24);
        const hh = Math.min(opts.h || app.h, D.h - 24);
        const off = (this.cascade++ % 6) * 28;
        const x = opts.x != null ? opts.x : Math.round((D.w - ww) / 2 - 70 + off);
        const y = opts.y != null ? opts.y : Math.round(Math.max(14, (D.h - hh) / 2 - 30) + off);
        this.setRect(w, clamp(x, 0, Math.max(0, D.w - ww)), clamp(y, 0, Math.max(0, D.h - hh)), ww, hh);

        if (opts.from) {
            const r = opts.from.getBoundingClientRect();
            el.style.setProperty('--ox', (r.left + r.width / 2 - parseFloat(el.style.left)) + 'px');
            el.style.setProperty('--oy', (r.top + r.height / 2 - parseFloat(el.style.top)) + 'px');
        }

        winLayer.append(el);
        this.wins.set(appId, w);
        this.bind(w);
        if (app.render) app.render(w, opts);
        Taskbar.add(w);
        this.focus(w);
        Sound.play('open');
        if (!isTouch(opts.event) && !opts.noFocus) {
            const first = $('input, textarea, [autofocus]', body);
            if (first && app.autofocus) setTimeout(() => first.focus({ preventScroll: true }), 60);
        }
        return w;
    },

    setRect(w, x, y, width, height) {
        Object.assign(w.el.style, { left: x + 'px', top: y + 'px', width: width + 'px', height: height + 'px' });
    },
    rect(w) {
        return { x: w.el.offsetLeft, y: w.el.offsetTop, w: w.el.offsetWidth, h: w.el.offsetHeight };
    },

    focus(w) {
        if (!w) return;
        this.z += 1;
        w.el.style.zIndex = this.z;
        this.focused = w;
        this.wins.forEach((o) => o.el.classList.toggle('focused', o === w));
        Taskbar.sync();
    },
    focusTop() {
        let top = null;
        this.wins.forEach((o) => { if (!o.min && (!top || +o.el.style.zIndex > +top.el.style.zIndex)) top = o; });
        if (top) this.focus(top); else { this.focused = null; this.wins.forEach((o) => o.el.classList.remove('focused')); Taskbar.sync(); }
    },

    minimize(w) {
        if (w.min) return;
        const btn = Taskbar.btn(w);
        const r = w.el.getBoundingClientRect();
        const b = btn ? btn.getBoundingClientRect() : { left: r.left, top: window.innerHeight, width: 40, height: 10 };
        const dx = b.left + b.width / 2 - (r.left + r.width / 2);
        const dy = b.top + b.height / 2 - (r.top + r.height / 2);
        w.el.classList.add('minimizing');
        w.el.style.transform = `translate(${dx}px, ${dy}px) scale(0.12)`;
        w.el.style.opacity = '0';
        Sound.play('min');
        w.min = true;
        setTimeout(() => {
            w.el.classList.remove('minimizing');
            w.el.classList.add('min');
            w.el.style.transform = '';
            w.el.style.opacity = '';
            if (w.app.pause) w.app.pause(w);
        }, 280);
        this.focusTop();
    },
    restore(w) {
        if (!w.min) return;
        w.min = false;
        const btn = Taskbar.btn(w);
        w.el.classList.remove('min');
        if (btn) {
            const b = btn.getBoundingClientRect();
            w.el.style.setProperty('--ox', (b.left + b.width / 2 - w.el.offsetLeft) + 'px');
            w.el.style.setProperty('--oy', (b.top - w.el.offsetTop) + 'px');
        }
        w.el.style.animation = 'none';
        void w.el.offsetWidth;
        w.el.style.animation = '';
        Sound.play('open');
        this.focus(w);
        if (w.app.resume) w.app.resume(w);
    },

    toggleMax(w) {
        const D = deskRect();
        w.el.classList.add('animating');
        if (w.max) {
            const p = w.prev || { x: 60, y: 40, w: Math.min(w.app.w, D.w - 40), h: Math.min(w.app.h, D.h - 40) };
            this.setRect(w, p.x, p.y, p.w, p.h);
            w.max = false;
            w.el.classList.remove('max');
        } else {
            w.prev = this.rect(w);
            this.setRect(w, 0, 0, D.w, D.h);
            w.max = true;
            w.el.classList.add('max');
        }
        $('.wc.max', w.el).setAttribute('aria-label', w.max ? 'Restore' : 'Maximize');
        setTimeout(() => w.el.classList.remove('animating'), 240);
        this.focus(w);
    },
    snap(w, zone) {
        const D = deskRect();
        if (zone === 'max') { if (!w.max) { this.toggleMax(w); } return; }
        w.prev = w.prev || this.rect(w);
        w.el.classList.add('animating');
        const half = Math.round(D.w / 2);
        if (zone === 'left') this.setRect(w, 0, 0, half, D.h);
        if (zone === 'right') this.setRect(w, D.w - half, 0, half, D.h);
        setTimeout(() => w.el.classList.remove('animating'), 240);
    },

    close(w) {
        if (!w || !this.wins.has(w.id)) return;
        this.wins.delete(w.id);
        Taskbar.remove(w);
        w.cleanup.forEach((fn) => { try { fn(); } catch { /* ignore */ } });
        Sound.play('close');
        w.el.classList.add('closing');
        setTimeout(() => w.el.remove(), 180);
        this.focusTop();
    },
    closeAll() { [...this.wins.values()].forEach((w) => this.close(w)); },

    setTitle(w, title) {
        $('.win-title', w.el).textContent = title;
        w.el.setAttribute('aria-label', title);
        Taskbar.retitle(w, title);
    },

    bind(w) {
        const el = w.el;
        el.addEventListener('pointerdown', () => { if (this.focused !== w) this.focus(w); }, true);
        $('.wc.min', el).addEventListener('click', (e) => { e.stopPropagation(); this.minimize(w); });
        $('.wc.max', el).addEventListener('click', (e) => { e.stopPropagation(); this.toggleMax(w); });
        $('.wc.close', el).addEventListener('click', (e) => { e.stopPropagation(); this.close(w); });

        const bar = $('.win-bar', el);
        bar.addEventListener('dblclick', (e) => { if (!e.target.closest('.wc') && !isPhone()) this.toggleMax(w); });
        bar.addEventListener('contextmenu', (e) => { e.preventDefault(); Ctx.show(e.clientX, e.clientY, this.menu(w)); });

        // Drag by the title bar, with edge snapping
        bar.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.target.closest('.wc') || isPhone()) return;
            const start = { px: e.clientX, py: e.clientY, ...this.rect(w) };
            let moved = false;
            let zone = null;
            const preview = $('#snap-preview');
            bar.setPointerCapture(e.pointerId);
            const move = (ev) => {
                const dx = ev.clientX - start.px;
                const dy = ev.clientY - start.py;
                if (!moved && Math.hypot(dx, dy) < 4) return;
                if (!moved) {
                    moved = true;
                    document.body.classList.add('dragging');
                    if (w.max) {
                        // pull out of maximised, keeping the grab point proportional
                        const p = w.prev || { w: w.app.w, h: w.app.h };
                        const ratio = (start.px) / start.w;
                        w.max = false;
                        w.el.classList.remove('max');
                        start.w = p.w; start.h = p.h;
                        start.x = start.px - p.w * ratio; start.y = 0;
                        this.setRect(w, start.x, start.y, p.w, p.h);
                    }
                }
                const D = deskRect();
                const nx = start.x + dx;
                const ny = clamp(start.y + dy, 0, D.h - 36);
                w.el.style.left = nx + 'px';
                w.el.style.top = ny + 'px';
                zone = zoneAt(ev);
                if (zone) {
                    const half = Math.round(D.w / 2);
                    const r = zone === 'max' ? [0, 0, D.w, D.h] : zone === 'left' ? [0, 0, half, D.h] : [D.w - half, 0, half, D.h];
                    Object.assign(preview.style, { left: r[0] + 6 + 'px', top: r[1] + 6 + 'px', width: r[2] - 12 + 'px', height: r[3] - 12 + 'px', zIndex: this.z - 1 });
                    preview.classList.add('on');
                } else preview.classList.remove('on');
            };
            const zoneAt = (ev) => ev.clientY <= 6 ? 'max' : ev.clientX <= 8 ? 'left' : ev.clientX >= window.innerWidth - 8 ? 'right' : null;
            const up = (ev) => {
                if (moved && ev && ev.type === 'pointerup') zone = zoneAt(ev);
                bar.removeEventListener('pointermove', move);
                bar.removeEventListener('pointerup', up);
                bar.removeEventListener('pointercancel', up);
                document.body.classList.remove('dragging');
                preview.classList.remove('on');
                if (zone) this.snap(w, zone);
                else if (moved) w.prev = null;
            };
            bar.addEventListener('pointermove', move);
            bar.addEventListener('pointerup', up);
            bar.addEventListener('pointercancel', up);
        });

        // Resize from any edge
        $$('.rz', el).forEach((handle) => {
            handle.addEventListener('pointerdown', (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();
                const d = handle.dataset.d;
                const s = { px: e.clientX, py: e.clientY, ...this.rect(w) };
                const minW = 300, minH = 180;
                handle.setPointerCapture(e.pointerId);
                document.body.classList.add('dragging');
                const move = (ev) => {
                    const dx = ev.clientX - s.px;
                    const dy = ev.clientY - s.py;
                    let { x, y, w: ww, h: hh } = s;
                    if (d.includes('e')) ww = Math.max(minW, s.w + dx);
                    if (d.includes('s')) hh = Math.max(minH, s.h + dy);
                    if (d.includes('w')) { ww = Math.max(minW, s.w - dx); x = s.x + (s.w - ww); }
                    if (d.includes('n')) { hh = Math.max(minH, s.h - dy); y = Math.max(0, s.y + (s.h - hh)); }
                    this.setRect(w, x, y, ww, hh);
                    if (w.app.resize) w.app.resize(w);
                };
                const up = () => {
                    handle.removeEventListener('pointermove', move);
                    handle.removeEventListener('pointerup', up);
                    document.body.classList.remove('dragging');
                };
                handle.addEventListener('pointermove', move);
                handle.addEventListener('pointerup', up);
            });
        });
    },

    menu(w) {
        return [
            { i: '▁', label: 'Minimize', fn: () => this.minimize(w) },
            { i: w.max ? '❐' : '□', label: w.max ? 'Restore' : 'Maximize', fn: () => this.toggleMax(w) },
            { i: '◧', label: 'Snap left', fn: () => this.snap(w, 'left') },
            { i: '◨', label: 'Snap right', fn: () => this.snap(w, 'right') },
            '-',
            { i: '✕', label: 'Close', fn: () => this.close(w) }
        ];
    },

    fitAll() {
        const D = deskRect();
        this.wins.forEach((w) => {
            if (w.max) { this.setRect(w, 0, 0, D.w, D.h); return; }
            const r = this.rect(w);
            const nw = Math.min(r.w, D.w), nh = Math.min(r.h, D.h);
            this.setRect(w, clamp(r.x, -nw + 120, D.w - 120), clamp(r.y, 0, D.h - 36), nw, nh);
        });
    }
};

/* ---------------------------------------------------------- open helpers */

function openProject(id, from) {
    const p = projectById(id);
    if (!p) return;
    if (isPhone()) { window.location.href = p.file; return; }
    const w = WM.open('browser', { project: id, from });
    if (w && w.nav) w.nav({ project: id });
}

// Buttons/links inside windows: data-open="app", data-project="id"
document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open]');
    if (openBtn && !openBtn.closest('.sm-item')) { e.preventDefault(); WM.open(openBtn.dataset.open, { from: openBtn }); return; }
    const projLink = e.target.closest('[data-project]:not(.news-slide)');
    if (projLink) { e.preventDefault(); openProject(projLink.dataset.project, projLink); }
});

/* ---------------------------------------------------------- desktop icons */

const ICONS = [
    { id: 'explorer', label: 'Projects', glyph: '🗂️', open: (from) => WM.open('explorer', { from }) },
    { id: 'flowstate', label: 'FlowState', glyph: '📱', badge: 'NEW', project: 'flowstate' },
    { id: 'plant', label: 'PlantBuddy', glyph: '🪴', badge: 'NEW', project: 'plant-buddy' },
    { id: 'about', label: 'About Me', glyph: '🌺' },
    { id: 'skills', label: 'Skills', glyph: '✨' },
    { id: 'contact', label: 'Contact', glyph: '✉️' },
    { id: 'snake', label: 'Snake Game', glyph: '🐍' },
    { id: 'photos', label: 'Photos', glyph: '🖼️' },
    { id: 'terminal', label: 'Terminal', glyph: '💻' },
    { id: 'bin', label: 'Recycle Bin', glyph: '🗑️' }
];
const CELL_W = 96, CELL_H = 100, PAD = 10;

const Icons = {
    el: $('#icons'),
    pos: store.get('icons', {}),

    render() {
        this.el.innerHTML = '';
        ICONS.forEach((ic) => {
            const b = h(`<button class="icon" role="listitem" data-id="${ic.id}" aria-label="${esc(ic.label)}${ic.badge ? ' (new)' : ''}">
                <span class="glyph" aria-hidden="true">${ic.glyph}${ic.badge ? `<span class="badge">${ic.badge}</span>` : ''}</span>
                <span class="name">${esc(ic.label)}</span></button>`);
            this.el.append(b);
        });
        this.layout();
    },
    rows() { return Math.max(1, Math.floor((deskRect().h - PAD * 2) / CELL_H)); },
    cellXY(col, row) { return [PAD + col * CELL_W, PAD + row * CELL_H]; },
    layout() {
        if (isPhone()) return;
        const rows = this.rows();
        const taken = new Set();
        const D = deskRect();
        const place = (b, col, row) => {
            const [x, y] = this.cellXY(col, row);
            b.style.left = x + 'px';
            b.style.top = y + 'px';
            taken.add(col + ',' + row);
        };
        // saved positions first
        const pending = [];
        $$('.icon', this.el).forEach((b) => {
            const p = this.pos[b.dataset.id];
            if (p && p[1] < rows && PAD + p[0] * CELL_W < D.w - CELL_W && !taken.has(p[0] + ',' + p[1])) place(b, p[0], p[1]);
            else pending.push(b);
        });
        let i = 0;
        pending.forEach((b) => {
            while (taken.has(Math.floor(i / rows) + ',' + (i % rows))) i++;
            place(b, Math.floor(i / rows), i % rows);
        });
    },
    cellOf(b) { return [Math.round((b.offsetLeft - PAD) / CELL_W), Math.round((b.offsetTop - PAD) / CELL_H)]; },
    save() {
        const out = {};
        $$('.icon', this.el).forEach((b) => { out[b.dataset.id] = this.cellOf(b); });
        this.pos = out;
        store.set('icons', out);
    },
    arrange() { this.pos = {}; store.del('icons'); this.layout(); },
    select(list) { $$('.icon', this.el).forEach((b) => b.classList.toggle('selected', list.includes(b))); },
    open(b) {
        const ic = ICONS.find((x) => x.id === b.dataset.id);
        if (!ic) return;
        Sound.play('click');
        if (ic.project) openProject(ic.project, b);
        else if (ic.open) ic.open(b);
        else WM.open(ic.id, { from: b });
    },
    bind() {
        this.el.addEventListener('dblclick', (e) => { const b = e.target.closest('.icon'); if (b) this.open(b); });
        this.el.addEventListener('keydown', (e) => {
            const b = e.target.closest('.icon');
            if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); this.open(b); }
        });
        this.el.addEventListener('contextmenu', (e) => {
            const b = e.target.closest('.icon');
            if (!b) return;
            e.preventDefault();
            e.stopPropagation();
            this.select([b]);
            const ic = ICONS.find((x) => x.id === b.dataset.id);
            const p = ic.project && projectById(ic.project);
            const items = [{ i: '↗', label: 'Open', fn: () => this.open(b) }];
            if (p) {
                items.push({ i: '⧉', label: 'Open in new browser tab', fn: () => window.open(p.file, '_blank', 'noopener') });
                if (p.album) items.push({ i: '🖼️', label: 'View photos', fn: () => WM.open('photos', { album: p.album }) });
            }
            items.push('-', { i: '▦', label: 'Arrange icons', fn: () => this.arrange() });
            Ctx.show(e.clientX, e.clientY, items);
        });

        // Select, drag (grid-snapped), tap-to-open on touch
        this.el.addEventListener('pointerdown', (e) => {
            const b = e.target.closest('.icon');
            if (!b || e.button !== 0) return;
            if (isPhone()) return;
            let group = $$('.icon.selected', this.el);
            if (!group.includes(b)) { group = e.shiftKey || e.metaKey || e.ctrlKey ? [...group, b] : [b]; this.select(group); }
            const starts = group.map((g) => [g, g.offsetLeft, g.offsetTop]);
            const sx = e.clientX, sy = e.clientY;
            let dragging = false;
            b.setPointerCapture(e.pointerId);
            const move = (ev) => {
                const dx = ev.clientX - sx, dy = ev.clientY - sy;
                if (!dragging && Math.hypot(dx, dy) < 5) return;
                dragging = true;
                starts.forEach(([g, x, y]) => { g.classList.add('dragging'); g.style.left = x + dx + 'px'; g.style.top = y + dy + 'px'; });
            };
            const up = (ev) => {
                b.removeEventListener('pointermove', move);
                b.removeEventListener('pointerup', up);
                if (dragging) {
                    const rows = this.rows();
                    const maxCol = Math.max(0, Math.floor((deskRect().w - PAD) / CELL_W) - 1);
                    const others = $$('.icon', this.el).filter((o) => !group.includes(o)).map((o) => this.cellOf(o).join(','));
                    const used = new Set(others);
                    starts.forEach(([g]) => {
                        let [c, r] = this.cellOf(g);
                        c = clamp(c, 0, maxCol); r = clamp(r, 0, rows - 1);
                        // nearest free cell
                        let best = [c, r], bestD = Infinity;
                        for (let cc = 0; cc <= maxCol; cc++) for (let rr = 0; rr < rows; rr++) {
                            if (used.has(cc + ',' + rr)) continue;
                            const d = Math.abs(cc - c) + Math.abs(rr - r);
                            if (d < bestD) { bestD = d; best = [cc, rr]; }
                        }
                        used.add(best.join(','));
                        g.classList.remove('dragging');
                        const [x, y] = this.cellXY(best[0], best[1]);
                        g.style.left = x + 'px';
                        g.style.top = y + 'px';
                    });
                    this.save();
                } else if (isTouch(ev)) this.open(b);
            };
            b.addEventListener('pointermove', move);
            b.addEventListener('pointerup', up);
        });

        // Phone: single tap opens
        this.el.addEventListener('click', (e) => {
            const b = e.target.closest('.icon');
            if (b && isPhone()) this.open(b);
        });
    }
};

// Rubber-band selection on the empty desktop
(function rubberBand() {
    const rect = $('#select-rect');
    desktopEl.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || isPhone()) return;
        if (e.target !== desktopEl && e.target !== Icons.el) return;
        Menus.closeAll();
        Icons.select([]);
        const sx = e.clientX, sy = e.clientY;
        desktopEl.setPointerCapture(e.pointerId);
        const move = (ev) => {
            const x = Math.min(sx, ev.clientX), y = Math.min(sy, ev.clientY);
            const w = Math.abs(ev.clientX - sx), hh = Math.abs(ev.clientY - sy);
            Object.assign(rect.style, { display: 'block', left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' });
            const hits = $$('.icon', Icons.el).filter((b) => {
                const r = b.getBoundingClientRect();
                return r.right > x && r.left < x + w && r.bottom > y && r.top < y + hh;
            });
            Icons.select(hits);
        };
        const up = () => {
            rect.style.display = 'none';
            desktopEl.removeEventListener('pointermove', move);
            desktopEl.removeEventListener('pointerup', up);
        };
        desktopEl.addEventListener('pointermove', move);
        desktopEl.addEventListener('pointerup', up);
    });
    desktopEl.addEventListener('contextmenu', (e) => {
        if (e.target !== desktopEl && e.target !== Icons.el) return;
        e.preventDefault();
        Ctx.show(e.clientX, e.clientY, [
            { i: '↻', label: 'Refresh', fn: refreshDesktop },
            { i: '▦', label: 'Arrange icons', fn: () => Icons.arrange() },
            '-',
            { i: '📝', label: 'New sticky note', fn: () => Gadgets.newNote(e.clientX, e.clientY) },
            { i: '💻', label: 'Open terminal', fn: () => WM.open('terminal') },
            { i: '📊', label: 'Task Manager', fn: () => WM.open('taskmgr') },
            '-',
            { i: '🖼️', label: 'Next wallpaper', fn: () => Settings.nextWallpaper() },
            { i: '⚙️', label: 'Personalise…', fn: () => WM.open('settings') }
        ]);
    });
})();

function refreshDesktop() {
    Icons.el.style.transition = 'opacity 0.15s';
    Icons.el.style.opacity = '0';
    setTimeout(() => { Icons.layout(); Icons.el.style.opacity = '1'; }, 180);
}

/* --------------------------------------------------------------- gadgets */

const Gadgets = {
    state: store.get('gadgets', {}),
    notes: store.get('notes', []),

    init() {
        $$('.gadget').forEach((g) => this.setup(g));
        this.notes.forEach((n) => this.makeNote(n));
        this.news();
    },
    place(g) {
        const s = this.state[g.id];
        const D = deskRect();
        if (s && s.hidden) { g.hidden = true; return; }
        let x, y;
        if (s && s.x != null) { x = s.x; y = s.y; }
        else {
            const d = Object.fromEntries((g.dataset.default || 'left:200,top:40').split(',').map((kv) => kv.split(':')));
            x = d.left != null ? +d.left : D.w - +d.right - g.offsetWidth;
            y = +d.top;
        }
        g.style.left = clamp(x, 0, Math.max(0, D.w - 60)) + 'px';
        g.style.top = clamp(y, 0, Math.max(0, D.h - 40)) + 'px';
    },
    save(g, patch) {
        this.state[g.id] = { ...(this.state[g.id] || {}), ...patch };
        store.set('gadgets', this.state);
    },
    setup(g) {
        this.place(g);
        const grab = $('.grab', g);
        grab.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.target.closest('button') || isPhone()) return;
            const sx = e.clientX, sy = e.clientY, ox = g.offsetLeft, oy = g.offsetTop;
            g.classList.add('dragging');
            g.style.zIndex = 3;
            grab.setPointerCapture(e.pointerId);
            const move = (ev) => {
                const D = deskRect();
                g.style.left = clamp(ox + ev.clientX - sx, -g.offsetWidth + 60, D.w - 60) + 'px';
                g.style.top = clamp(oy + ev.clientY - sy, 0, D.h - 30) + 'px';
            };
            const up = () => {
                g.classList.remove('dragging');
                grab.removeEventListener('pointermove', move);
                grab.removeEventListener('pointerup', up);
                if (g.dataset.note) this.saveNote(g); else this.save(g, { x: g.offsetLeft, y: g.offsetTop });
            };
            grab.addEventListener('pointermove', move);
            grab.addEventListener('pointerup', up);
        });
        const x = $('.x', g);
        if (x) x.addEventListener('click', () => {
            g.style.transition = 'opacity 0.2s, transform 0.2s';
            g.style.opacity = '0';
            g.style.transform = 'scale(0.8) rotate(8deg)';
            Sound.play('close');
            setTimeout(() => {
                g.hidden = true;
                g.style.cssText = g.style.cssText.replace(/transition[^;]*;|opacity[^;]*;|transform[^;]*;/g, '');
                if (g.dataset.note) { this.notes = this.notes.filter((n) => n.id !== g.id); store.set('notes', this.notes); g.remove(); }
                else this.save(g, { hidden: true });
            }, 200);
        });
        const body = $('.body', g);
        if (body && g.classList.contains('sticky')) {
            const saved = store.get('note-text:' + g.id, null);
            if (saved !== null && !g.dataset.note) body.innerHTML = saved;
            body.addEventListener('input', () => {
                if (g.dataset.note) this.saveNote(g); else store.set('note-text:' + g.id, body.innerHTML);
            });
        }
    },
    makeNote(n) {
        const colors = ['', 'pink', 'mint'];
        const g = h(`<section class="gadget sticky ${n.color || ''}" id="${n.id}" data-note="1" style="--r:${n.r || 0}deg" aria-label="Sticky note">
            <div class="grab"><span>Note</span><button class="x" aria-label="Remove note">×</button></div>
            <div class="body" contenteditable="true" spellcheck="false"></div></section>`);
        $('.body', g).innerHTML = n.html || '';
        g.style.left = n.x + 'px';
        g.style.top = n.y + 'px';
        desktopEl.insertBefore(g, $('#select-rect'));
        this.setup(g);
        g.style.left = n.x + 'px';
        g.style.top = n.y + 'px';
        if (!n.color && n.color !== '') n.color = colors[Math.floor(Math.random() * 3)];
        return g;
    },
    newNote(x, y) {
        const D = deskRect();
        const n = {
            id: 'note-' + Date.now(), html: 'New note ✎',
            x: clamp((x || D.w / 2) - 110, 0, D.w - 230), y: clamp((y || 120) - 20, 0, D.h - 200),
            r: (Math.random() * 6 - 3).toFixed(1), color: ['', 'pink', 'mint'][Math.floor(Math.random() * 3)]
        };
        this.notes.push(n);
        store.set('notes', this.notes);
        const g = this.makeNote(n);
        g.style.animation = 'win-open 0.3s var(--ease)';
        const body = $('.body', g);
        body.focus();
        document.getSelection().selectAllChildren(body);
        Sound.play('open');
        return g;
    },
    saveNote(g) {
        const n = this.notes.find((m) => m.id === g.id);
        if (!n) return;
        n.x = g.offsetLeft; n.y = g.offsetTop; n.html = $('.body', g).innerHTML;
        store.set('notes', this.notes);
    },
    reset() {
        this.state = {};
        store.del('gadgets');
        $$('.gadget:not([data-note])').forEach((g) => {
            g.hidden = false;
            store.del('note-text:' + g.id);
            this.place(g);
        });
    },
    news() {
        const g = $('#g-news');
        const slides = $$('.news-slide', g);
        const count = $('.news-count', g);
        let i = 0;
        const show = (n) => {
            i = (n + slides.length) % slides.length;
            slides.forEach((s, k) => s.classList.toggle('on', k === i));
            count.textContent = `${i + 1} / ${slides.length}`;
        };
        $('.next', g).addEventListener('click', () => show(i + 1));
        $('.prev', g).addEventListener('click', () => show(i - 1));
        $('.all', g).addEventListener('click', (e) => WM.open('explorer', { from: e.currentTarget }));
        slides.forEach((s) => s.addEventListener('click', () => openProject(s.dataset.project, s)));
        let t = setInterval(() => show(i + 1), 6000);
        g.addEventListener('pointerenter', () => clearInterval(t));
        g.addEventListener('pointerleave', () => { clearInterval(t); t = setInterval(() => show(i + 1), 6000); });
    }
};

/* ------------------------------------------------------ taskbar & tray */

const Taskbar = {
    el: $('#tasks'),
    btn(w) { return $(`.task[data-win="${w.id}"]`, this.el); },
    add(w) {
        const b = h(`<button class="task" data-win="${w.id}"><span aria-hidden="true">${w.app.icon}</span><span>${esc(w.app.title)}</span></button>`);
        b.addEventListener('click', () => {
            if (w.min) WM.restore(w);
            else if (WM.focused === w) WM.minimize(w);
            else WM.focus(w);
        });
        b.addEventListener('contextmenu', (e) => { e.preventDefault(); Ctx.show(e.clientX, e.clientY, WM.menu(w), 'up'); });
        this.el.append(b);
    },
    remove(w) { const b = this.btn(w); if (b) b.remove(); },
    retitle(w, t) { const b = this.btn(w); if (b) b.lastElementChild.textContent = t; },
    sync() {
        $$('.task', this.el).forEach((b) => {
            const w = WM.wins.get(b.dataset.win);
            if (!w) return;
            b.classList.toggle('front', WM.focused === w && !w.min);
            b.classList.toggle('minimized', w.min);
            b.setAttribute('aria-pressed', String(WM.focused === w && !w.min));
        });
        $$('.pin').forEach((p) => {
            const w = WM.wins.get(p.dataset.app);
            p.classList.toggle('running', !!w);
            p.classList.toggle('front', !!w && WM.focused === w && !w.min);
        });
    }
};
$$('.pin').forEach((p) => p.addEventListener('click', () => {
    const w = WM.wins.get(p.dataset.app);
    if (w && WM.focused === w && !w.min) WM.minimize(w);
    else WM.open(p.dataset.app, { from: p });
}));

// Menus/flyouts registry so one click elsewhere closes them all
const Menus = {
    closeAll(except) {
        if (except !== 'start') StartMenu.toggle(false);
        if (except !== 'ctx') Ctx.hide();
        $$('.flyout.open').forEach((f) => { if (f.id !== except) f.classList.remove('open'); });
    }
};
document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.start-menu, #start-btn, .ctx, .flyout, .tray')) return;
    Menus.closeAll();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') Menus.closeAll(); });

function flyout(id, anchorBtn) {
    const f = $('#' + id);
    const open = !f.classList.contains('open');
    Menus.closeAll(id);
    f.classList.toggle('open', open);
    if (open && id === 'fly-cal') Tray.renderCal(), Tray.weather();
    Sound.play('click');
    return open;
}

const Tray = {
    calOffset: 0,
    tick() {
        const now = new Date();
        $('#clock-time').textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        $('#clock-date').textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        if ($('#fly-cal').classList.contains('open')) {
            $('#cal-time').textContent = now.toLocaleTimeString('en-GB');
        }
    },
    renderCal() {
        const now = new Date();
        const view = new Date(now.getFullYear(), now.getMonth() + this.calOffset, 1);
        $('#cal-time').textContent = now.toLocaleTimeString('en-GB');
        $('#cal-date').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        $('#cal-month').textContent = view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        const grid = $('#cal-grid');
        grid.innerHTML = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => `<span class="dow">${d}</span>`).join('');
        const lead = (view.getDay() + 6) % 7;
        const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
        const prevDays = new Date(view.getFullYear(), view.getMonth(), 0).getDate();
        for (let i = lead; i > 0; i--) grid.insertAdjacentHTML('beforeend', `<span class="d muted">${prevDays - i + 1}</span>`);
        for (let d = 1; d <= days; d++) {
            const today = this.calOffset === 0 && d === now.getDate();
            grid.insertAdjacentHTML('beforeend', `<span class="d${today ? ' today' : ''}">${d}</span>`);
        }
    },
    weatherAt: 0,
    async weather() {
        if (Date.now() - this.weatherAt < 10 * 60 * 1000) return;
        const box = $('#weather');
        const codes = { 0: ['☀️', 'Clear'], 1: ['🌤️', 'Mostly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Overcast'], 45: ['🌫️', 'Fog'], 48: ['🌫️', 'Fog'],
            51: ['🌦️', 'Drizzle'], 53: ['🌦️', 'Drizzle'], 55: ['🌧️', 'Drizzle'], 61: ['🌧️', 'Rain'], 63: ['🌧️', 'Rain'], 65: ['🌧️', 'Heavy rain'],
            71: ['🌨️', 'Snow'], 73: ['🌨️', 'Snow'], 75: ['❄️', 'Heavy snow'], 80: ['🌦️', 'Showers'], 81: ['🌧️', 'Showers'], 82: ['⛈️', 'Heavy showers'], 95: ['⛈️', 'Thunderstorm'] };
        try {
            const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=-0.13&current=temperature_2m,weather_code,relative_humidity_2m&timezone=Europe%2FLondon');
            const j = await r.json();
            const c = j.current;
            const [icon, label] = codes[c.weather_code] || ['🌡️', 'Weather'];
            box.innerHTML = `<span class="wi">${icon}</span><div><b>${Math.round(c.temperature_2m)}°C</b><small>London · ${label} · ${c.relative_humidity_2m}% humidity</small></div>`;
            this.weatherAt = Date.now();
        } catch {
            box.innerHTML = '<span class="wi">🌂</span><div><b>--°</b><small>London · weather offline (bring a brolly anyway)</small></div>';
        }
    },
    init() {
        this.tick();
        setInterval(() => this.tick(), 1000);
        $('#tray-clock').addEventListener('click', () => { this.calOffset = 0; flyout('fly-cal'); });
        $('#cal-prev').addEventListener('click', () => { this.calOffset--; this.renderCal(); });
        $('#cal-next').addEventListener('click', () => { this.calOffset++; this.renderCal(); });
        $('#tray-vol').addEventListener('click', () => flyout('fly-vol'));
        $('#vol-switch').addEventListener('click', () => Sound.set(!Sound.on));

        const net = () => {
            const on = navigator.onLine;
            $('#tray-net').textContent = on ? '📶' : '⚠️';
            $('#tray-net').title = on ? 'Connected to the internet' : 'No internet connection';
        };
        net();
        window.addEventListener('online', () => { net(); toast({ icon: '📶', title: 'Back online', text: 'Reconnected to the internet.' }); });
        window.addEventListener('offline', () => { net(); toast({ icon: '⚠️', title: 'You are offline', text: 'The laptop still works. The weather does not.' }); });
        $('#tray-net').addEventListener('click', () => toast({ icon: '📶', title: navigator.onLine ? 'Connected' : 'Offline', text: navigator.onLine ? 'Network: Fatimas_WiFi_5G · Signal: excellent' : 'No internet connection.' }));

        const batt = $('#tray-batt');
        if (navigator.getBattery) {
            navigator.getBattery().then((b) => {
                const show = () => {
                    const pct = Math.round(b.level * 100);
                    batt.innerHTML = `${b.charging ? '⚡' : pct < 20 ? '🪫' : '🔋'}<span>${pct}%</span>`;
                    batt.title = `Battery ${pct}%${b.charging ? ', charging' : ''}`;
                };
                show();
                b.addEventListener('levelchange', show);
                b.addEventListener('chargingchange', show);
            }).catch(() => { batt.innerHTML = '🔌<span>AC</span>'; });
        } else batt.innerHTML = '🔌<span>AC</span>';
        batt.addEventListener('click', () => toast({ icon: '🔋', title: 'Power', text: batt.title || 'Plugged in. Running on creativity and coffee.' }));
        Sound.set(Sound.on);
    }
};

/* ------------------------------------------------------------ start menu */

const StartMenu = {
    el: $('#start-menu'),
    btn: $('#start-btn'),
    items: [],
    toggle(open) {
        open = open == null ? !this.el.classList.contains('open') : open;
        if (open) Menus.closeAll('start');
        this.el.classList.toggle('open', open);
        this.btn.setAttribute('aria-expanded', String(open));
        if (open) {
            Sound.play('click');
            const s = $('#sm-search');
            s.value = '';
            this.search('');
            if (!isPhone()) setTimeout(() => s.focus(), 140);
        }
    },
    init() {
        const proj = (p) => ({ icon: p.icon, label: p.title, tag: p.isNew ? 'NEW' : '', keys: [p.title, p.kind, ...p.tags].join(' '), fn: () => openProject(p.id) });
        const app = (id, extra = '') => ({ icon: APPS[id].icon, label: APPS[id].title, keys: APPS[id].title + ' ' + extra, fn: () => WM.open(id) });
        const col1 = [
            { label: 'New work' }, ...PROJECTS.filter((p) => p.group === 'msc').map(proj),
            { label: 'Earlier projects' }, ...PROJECTS.filter((p) => p.group === 'earlier').map(proj)
        ];
        const col2 = [
            app('explorer', 'projects files folder'), app('about', 'me bio education'), app('skills'), app('contact', 'email linkedin hire'),
            app('photos', 'gallery images pictures'), app('terminal', 'command shell cli'), app('notepad', 'text notes'), app('snake', 'game play a star'),
            app('taskmgr', 'processes cpu'), app('settings', 'wallpaper theme sound accent personalise'),
            { icon: '💼', label: 'LinkedIn ↗', keys: 'linkedin social', fn: () => window.open('https://www.linkedin.com/in/fatima-ibrahim-maideribe', '_blank', 'noopener') }
        ];
        const extras = [
            { icon: '📝', label: 'New sticky note', keys: 'note sticky create', fn: () => Gadgets.newNote() },
            { icon: '🖼️', label: 'Change wallpaper', keys: 'wallpaper background', fn: () => Settings.nextWallpaper() },
            { icon: '↻', label: 'Restart', keys: 'restart reboot', fn: () => Power.restart() },
            { icon: '⏻', label: 'Shut down', keys: 'shut down power off', fn: () => Power.shutdown() }
        ];
        this.items = [...col1, ...col2, ...extras].filter((i) => i.fn);
        const render = (list, host) => {
            host.innerHTML = '';
            list.forEach((it) => {
                if (!it.fn) { host.insertAdjacentHTML('beforeend', `<span class="sm-label">${esc(it.label)}</span>`); return; }
                const b = h(`<button class="sm-item" role="menuitem"><span class="i" aria-hidden="true">${it.icon}</span>${esc(it.label)}${it.tag ? `<em>${it.tag}</em>` : ''}</button>`);
                b.addEventListener('click', () => { this.toggle(false); it.fn(); });
                host.append(b);
            });
        };
        render(col1, $('#sm-projects'));
        render(col2, $('#sm-apps'));
        this.renderResults = (list) => render(list, $('#sm-results'));

        this.btn.addEventListener('click', () => this.toggle());
        $('#sm-search').addEventListener('input', (e) => this.search(e.target.value));
        $('#sm-search').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { const first = $('#sm-results .sm-item'); if (first) first.click(); }
            if (e.key === 'ArrowDown') { e.preventDefault(); const f = $(this.el.classList.contains('searching') ? '#sm-results .sm-item' : '.sm-body .sm-item'); if (f) f.focus(); }
        });
        this.el.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
            const list = $$('.sm-item', this.el).filter((b) => b.offsetParent);
            const i = list.indexOf(document.activeElement);
            if (i < 0) return;
            e.preventDefault();
            (list[i + (e.key === 'ArrowDown' ? 1 : -1)] || (e.key === 'ArrowUp' ? $('#sm-search') : list[i])).focus();
        });
        // Start typing while the menu is open to search, like a real Start menu
        document.addEventListener('keydown', (e) => {
            if (!this.el.classList.contains('open') || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.target.closest('input, textarea, [contenteditable="true"]')) return;
            $('#sm-search').focus();
        });
        $('#sm-restart').addEventListener('click', () => { this.toggle(false); Power.restart(); });
        $('#sm-shutdown').addEventListener('click', () => { this.toggle(false); Power.shutdown(); });
    },
    search(q) {
        q = q.trim().toLowerCase();
        this.el.classList.toggle('searching', !!q);
        if (!q) return;
        const hits = this.items.filter((it) => (it.label + ' ' + (it.keys || '')).toLowerCase().includes(q));
        this.renderResults(hits.length ? hits : []);
        if (!hits.length) $('#sm-results').innerHTML = `<p class="none">No results for “${esc(q)}”. Try "plant", "figma" or "snake".</p>`;
        else $('#sm-results .sm-item').classList.add('hit');
    }
};

/* ---------------------------------------------------------- context menu */

const Ctx = {
    el: $('#ctx'),
    show(x, y, items) {
        Menus.closeAll('ctx');
        this.el.innerHTML = '';
        items.forEach((it) => {
            if (it === '-') { this.el.append(document.createElement('hr')); return; }
            const b = h(`<button role="menuitem"><span class="i" aria-hidden="true">${it.i || ''}</span>${esc(it.label)}${it.kbd ? `<kbd>${it.kbd}</kbd>` : ''}</button>`);
            b.addEventListener('click', () => { this.hide(); Sound.play('click'); it.fn(); });
            this.el.append(b);
        });
        this.el.classList.add('open');
        const r = this.el.getBoundingClientRect();
        this.el.style.left = clamp(x, 4, window.innerWidth - r.width - 4) + 'px';
        this.el.style.top = clamp(y, 4, window.innerHeight - r.height - 4) + 'px';
        const first = $('button', this.el);
        if (first) first.focus({ preventScroll: true });
    },
    hide() { this.el.classList.remove('open'); }
};
Ctx.el.addEventListener('keydown', (e) => {
    const list = $$('button', Ctx.el);
    const i = list.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (list[i + 1] || list[0]).focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); (list[i - 1] || list[list.length - 1]).focus(); }
});
// Keep the real browser menu out of the way on the desktop chrome
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.taskbar, .start-menu, .ctx, .flyout')) e.preventDefault();
});

/* ---------------------------------------------------------------- toasts */

function toast({ icon = '💬', title, text = '', actions = [], timeout = 6000 }) {
    const t = h(`<div class="toast" role="status"><span class="ti" aria-hidden="true">${icon}</span><div class="tb"><b>${esc(title)}</b><p>${esc(text)}</p>${actions.length ? '<div class="ta"></div>' : ''}</div><button class="tx" aria-label="Dismiss">×</button></div>`);
    const kill = () => { t.classList.add('out'); setTimeout(() => t.remove(), 300); };
    actions.forEach((a) => {
        const b = h(`<button class="btn${a.solid ? ' solid' : ''}">${esc(a.label)}</button>`);
        b.addEventListener('click', () => { kill(); a.fn(); });
        $('.ta', t).append(b);
    });
    $('.tx', t).addEventListener('click', kill);
    $('#toasts').append(t);
    Sound.play('notify');
    if (timeout) {
        let timer = setTimeout(kill, timeout);
        t.addEventListener('pointerenter', () => clearTimeout(timer));
        t.addEventListener('pointerleave', () => { timer = setTimeout(kill, 2500); });
    }
    return t;
}

/* ================================================================== APPS */

/* ------------------------------------------------------------- explorer */

function renderExplorer(w, opts) {
    const st = { section: opts.section || 'all', view: store.get('x-view', 'grid'), q: '', sel: null };
    w.body.innerHTML = `<div class="explorer">
        <div class="x-toolbar">
            <button class="tbtn" data-view="grid" title="Icons view" aria-label="Icons view">▦</button>
            <button class="tbtn" data-view="list" title="List view" aria-label="List view">☰</button>
            <div class="x-path" aria-live="polite"></div>
            <input class="x-search" type="search" placeholder="🔍 Search projects" aria-label="Search projects">
        </div>
        <div class="x-main">
            <nav class="x-side" aria-label="Folders">
                <button data-sec="msc">⭐ MSc work</button>
                <button data-sec="all">📁 All projects</button>
                <button data-sec="earlier">🕘 Earlier work</button>
                <hr>
                <button data-app="photos">🖼️ Photos</button>
                <button data-app="browser">🌐 Browser</button>
                <button data-app="bin">🗑️ Recycle Bin</button>
            </nav>
            <div class="x-files" role="listbox" aria-label="Projects"></div>
            <aside class="x-detail" aria-live="polite"></aside>
        </div>
        <div class="x-status"><span class="x-count"></span><span>C:\\ · Fatima's laptop</span></div>
    </div>`;
    const files = $('.x-files', w.body), detail = $('.x-detail', w.body);
    const names = { all: 'All projects', msc: 'MSc work', earlier: 'Earlier work' };

    const list = () => PROJECTS.filter((p) => (st.section === 'all' || p.group === st.section) &&
        (!st.q || (p.title + ' ' + p.kind + ' ' + p.tags.join(' ') + ' ' + p.blurb).toLowerCase().includes(st.q)));

    const showDetail = () => {
        const p = projectById(st.sel);
        if (!p) { detail.innerHTML = '<p class="hint">Select a project to see details.<br><br>Double-click to open it.</p>'; return; }
        detail.innerHTML = `<img src="${p.thumb}" alt="">
            <h3>${esc(p.title)}</h3><span class="kind">${esc(p.kind)}${p.group === 'msc' ? ' · MSc, Imperial' : ''}</span>
            <p>${esc(p.blurb)}</p>
            <div class="chips">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
            <div class="chips">
                <button class="btn solid" data-act="open">↗ Open</button>
                ${p.album ? '<button class="btn" data-act="photos">🖼️ Photos</button>' : ''}
                <a class="btn" href="${p.file}" target="_blank" rel="noopener" title="Open in a new browser tab">⧉</a>
            </div>`;
        $('[data-act="open"]', detail).addEventListener('click', (e) => openProject(p.id, e.currentTarget));
        const ph = $('[data-act="photos"]', detail);
        if (ph) ph.addEventListener('click', () => WM.open('photos', { album: p.album }));
    };

    const draw = () => {
        $$('.x-side [data-sec]', w.body).forEach((b) => b.classList.toggle('on', b.dataset.sec === st.section));
        $$('[data-view]', w.body).forEach((b) => b.classList.toggle('on', b.dataset.view === st.view));
        files.classList.toggle('list', st.view === 'list');
        $('.x-path', w.body).textContent = `C:\\Users\\Fatima\\Projects${st.section === 'all' ? '' : '\\' + names[st.section]}${st.q ? `  ·  search: “${st.q}”` : ''}`;
        const items = list();
        files.innerHTML = items.length ? '' : '<p class="x-empty">Nothing here matches. Try "esp32" or "figma".</p>';
        items.forEach((p) => {
            const f = h(`<button class="file${st.sel === p.id ? ' sel' : ''}" role="option" aria-selected="${st.sel === p.id}" data-id="${p.id}">
                <span class="thumb"><img src="${p.thumb}" alt="" loading="lazy">${p.isNew ? '<span class="badge">NEW</span>' : ''}</span>
                <span class="fname">${p.icon} ${esc(p.title)}</span><span class="fmeta">${esc(p.kind)}</span></button>`);
            files.append(f);
        });
        $('.x-count', w.body).textContent = `${items.length} item${items.length === 1 ? '' : 's'}${st.sel ? ' · 1 selected' : ''}`;
        w.body.dataset.section = st.section;
        showDetail();
    };

    files.addEventListener('click', (e) => {
        const f = e.target.closest('.file');
        if (!f) { st.sel = null; draw(); return; }
        st.sel = f.dataset.id;
        $$('.file', files).forEach((x) => { x.classList.toggle('sel', x === f); x.setAttribute('aria-selected', String(x === f)); });
        $('.x-count', w.body).textContent = `${files.children.length} items · 1 selected`;
        showDetail();
        if (isPhone()) openProject(f.dataset.id, f);
    });
    files.addEventListener('dblclick', (e) => { const f = e.target.closest('.file'); if (f) openProject(f.dataset.id, f); });
    files.addEventListener('keydown', (e) => {
        const f = e.target.closest('.file');
        if (f && e.key === 'Enter') { e.preventDefault(); openProject(f.dataset.id, f); }
    });
    files.addEventListener('contextmenu', (e) => {
        const f = e.target.closest('.file');
        if (!f) return;
        e.preventDefault();
        const p = projectById(f.dataset.id);
        st.sel = p.id; draw();
        Ctx.show(e.clientX, e.clientY, [
            { i: '↗', label: 'Open', fn: () => openProject(p.id) },
            { i: '⧉', label: 'Open in new browser tab', fn: () => window.open(p.file, '_blank', 'noopener') },
            ...(p.album ? [{ i: '🖼️', label: 'View photos', fn: () => WM.open('photos', { album: p.album }) }] : [])
        ]);
    });
    $$('.x-side [data-sec]', w.body).forEach((b) => b.addEventListener('click', () => { st.section = b.dataset.sec; st.sel = null; draw(); }));
    $$('.x-side [data-app]', w.body).forEach((b) => b.addEventListener('click', () => WM.open(b.dataset.app, { from: b })));
    $$('[data-view]', w.body).forEach((b) => b.addEventListener('click', () => { st.view = b.dataset.view; store.set('x-view', st.view); draw(); }));
    $('.x-search', w.body).addEventListener('input', (e) => { st.q = e.target.value.trim().toLowerCase(); draw(); });
    w.reopenSection = (sec) => { if (sec) { st.section = sec; draw(); } };
    draw();
}

/* --------------------------------------------------------------- browser */

function renderBrowser(w, opts) {
    w.body.innerHTML = `<div class="browser">
        <div class="b-bar">
            <button class="tbtn" data-b="back" aria-label="Back" title="Back">←</button>
            <button class="tbtn" data-b="fwd" aria-label="Forward" title="Forward">→</button>
            <button class="tbtn" data-b="reload" aria-label="Reload" title="Reload">↻</button>
            <button class="tbtn" data-b="home" aria-label="Home" title="Home">⌂</button>
            <label class="b-url"><span class="lock" aria-hidden="true">🔒</span><input aria-label="Address" spellcheck="false"></label>
            <button class="tbtn" data-b="ext" aria-label="Open in a new browser tab" title="Open in a new browser tab">⧉</button>
        </div>
        <div class="b-view"><div class="b-load"></div><iframe title="Browser page"></iframe>
            <div class="b-home" hidden>
                <h2>my work</h2><p class="tag">the information superhighway, but it's just my projects</p>
                <input type="search" placeholder="Search Fatima's work…" aria-label="Search projects">
                <div class="b-links"></div>
            </div>
        </div>
    </div>`;
    const frame = $('iframe', w.body), home = $('.b-home', w.body), url = $('.b-url input', w.body), load = $('.b-load', w.body);
    const hist = [];
    let idx = -1;
    let expect = null;

    const drawHome = (q = '') => {
        q = q.toLowerCase();
        $('.b-links', home).innerHTML = PROJECTS.filter((p) => !q || (p.title + p.kind + p.tags.join(' ')).toLowerCase().includes(q)).map((p) =>
            `<button class="b-link" data-id="${p.id}"><img src="${p.thumb}" alt="" loading="lazy"><span>${p.icon} ${esc(p.title)}<small>${esc(p.kind)}</small></span></button>`).join('');
    };
    $('input', home).addEventListener('input', (e) => drawHome(e.target.value));
    home.addEventListener('click', (e) => { const b = e.target.closest('.b-link'); if (b) go({ project: b.dataset.id }); });

    const show = (entry) => {
        if (entry.project) {
            const p = projectById(entry.project);
            home.hidden = true;
            frame.hidden = false;
            url.value = `portfolio://projects/${p.id}`;
            WM.setTitle(w, `${p.title} — Browser`);
            if (!frame.src.endsWith('/' + p.file)) {
                expect = p.file;
                load.style.opacity = '1';
                load.style.width = '0';
                requestAnimationFrame(() => { load.style.width = '70%'; });
                frame.src = p.file;
            }
        } else {
            home.hidden = false;
            frame.hidden = true;
            url.value = 'portfolio://home';
            WM.setTitle(w, 'Browser');
            drawHome($('input', home).value);
        }
        $('[data-b="back"]', w.body).disabled = idx <= 0;
        $('[data-b="fwd"]', w.body).disabled = idx >= hist.length - 1;
    };
    const go = (entry) => {
        const cur = hist[idx];
        if (cur && cur.project === entry.project) { show(entry); return; }
        hist.splice(idx + 1);
        hist.push(entry);
        idx = hist.length - 1;
        show(entry);
    };
    w.nav = go;

    frame.addEventListener('load', () => {
        load.style.width = '100%';
        setTimeout(() => { load.style.opacity = '0'; }, 300);
        let path = '';
        try { path = frame.contentWindow.location.pathname; } catch { return; }
        const file = path.split('/').pop() || 'index.html';
        if (file === 'index.html') { frame.src = 'about:blank'; go({}); return; } // never load the desktop inside itself
        const p = PROJECTS.find((x) => x.file === file);
        if (p && file !== expect) {
            // link clicked inside the page (e.g. Next project)
            expect = file;
            hist.splice(idx + 1);
            hist.push({ project: p.id });
            idx = hist.length - 1;
            url.value = `portfolio://projects/${p.id}`;
            WM.setTitle(w, `${p.title} — Browser`);
            $('[data-b="back"]', w.body).disabled = idx <= 0;
            $('[data-b="fwd"]', w.body).disabled = true;
        }
        try {
            frame.contentDocument.addEventListener('pointerdown', () => { WM.focus(w); Menus.closeAll(); });
        } catch { /* cross-origin */ }
    });

    $('[data-b="back"]', w.body).addEventListener('click', () => { if (idx > 0) { idx--; show(hist[idx]); } });
    $('[data-b="fwd"]', w.body).addEventListener('click', () => { if (idx < hist.length - 1) { idx++; show(hist[idx]); } });
    $('[data-b="reload"]', w.body).addEventListener('click', () => { if (!frame.hidden) { try { frame.contentWindow.location.reload(); } catch { /* ignore */ } } else drawHome(); });
    $('[data-b="home"]', w.body).addEventListener('click', () => go({}));
    $('[data-b="ext"]', w.body).addEventListener('click', () => {
        const cur = hist[idx];
        const p = cur && projectById(cur.project);
        window.open(p ? p.file : 'index.html', '_blank', 'noopener');
    });
    url.addEventListener('focus', () => url.select());
    url.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const q = url.value.trim().toLowerCase().replace(/^portfolio:\/\/(projects\/)?/, '');
        if (/^https?:\/\//.test(q)) { window.open(q, '_blank', 'noopener'); toast({ icon: '🌐', title: 'Opened in a new tab', text: 'This browser only shows Fatima\'s projects. Everything else gets a real browser tab.' }); return; }
        if (!q || q === 'home') { go({}); return; }
        const p = PROJECTS.find((x) => x.id === q || x.title.toLowerCase().includes(q) || x.tags.join(' ').toLowerCase().includes(q));
        if (p) go({ project: p.id });
        else { go({}); $('input', home).value = q; drawHome(q); }
        url.blur();
    });

    go(opts.project ? { project: opts.project } : {});
}

/* ---------------------------------------------------------------- photos */

function renderPhotos(w, opts) {
    const st = { album: opts.album || 'flowstate', i: 0 };
    w.body.innerHTML = `<div class="photos">
        <nav class="p-albums x-side" aria-label="Albums">${ALBUMS.map((a) => `<button data-album="${a.id}">${a.icon} ${esc(a.name)} <span class="muted" style="margin-left:auto">${a.photos.length}</span></button>`).join('')}</nav>
        <div class="p-grid"></div>
    </div>
    <div class="p-viewer" role="dialog" aria-label="Photo viewer">
        <div class="p-stage"><button class="p-nav prev" aria-label="Previous photo">‹</button><img alt=""><button class="p-nav next" aria-label="Next photo">›</button></div>
        <div class="p-foot"><span class="p-cap grow"></span><span class="p-n"></span><button class="btn" data-p="project">Open project ↗</button><button class="btn" data-p="close">✕ Close</button></div>
    </div>`;
    const grid = $('.p-grid', w.body), viewer = $('.p-viewer', w.el) || $('.p-viewer', w.body);
    w.el.append(viewer);
    const album = () => ALBUMS.find((a) => a.id === st.album);
    const draw = () => {
        $$('[data-album]', w.body).forEach((b) => b.classList.toggle('on', b.dataset.album === st.album));
        grid.innerHTML = album().photos.map((p, i) => `<button data-i="${i}" aria-label="${esc(p.cap)}"><img src="${encodeURI(p.src)}" alt="${esc(p.cap)}" loading="lazy"></button>`).join('');
        WM.setTitle(w, `Photos — ${album().name}`);
    };
    const view = (i) => {
        const a = album();
        st.i = (i + a.photos.length) % a.photos.length;
        const p = a.photos[st.i];
        const img = $('img', viewer);
        img.src = encodeURI(p.src);
        img.alt = p.cap;
        img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
        $('.p-cap', viewer).textContent = p.cap;
        $('.p-n', viewer).textContent = `${st.i + 1} / ${a.photos.length}`;
        viewer.classList.add('on');
    };
    grid.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) view(+b.dataset.i); });
    $$('[data-album]', w.body).forEach((b) => b.addEventListener('click', () => { st.album = b.dataset.album; viewer.classList.remove('on'); draw(); }));
    $('.prev', viewer).addEventListener('click', () => view(st.i - 1));
    $('.next', viewer).addEventListener('click', () => view(st.i + 1));
    $('[data-p="close"]', viewer).addEventListener('click', () => viewer.classList.remove('on'));
    $('[data-p="project"]', viewer).addEventListener('click', () => openProject(album().project));
    w.onKey = (e) => {
        if (!viewer.classList.contains('on')) return false;
        if (e.key === 'ArrowRight') { view(st.i + 1); return true; }
        if (e.key === 'ArrowLeft') { view(st.i - 1); return true; }
        if (e.key === 'Escape') { viewer.classList.remove('on'); return true; }
        return false;
    };
    w.setAlbum = (id) => { if (id && ALBUMS.some((a) => a.id === id)) { st.album = id; viewer.classList.remove('on'); draw(); } };
    draw();
}

/* -------------------------------------------------------------- terminal */

const FS = {
    '~': ['about.txt', 'skills.txt', 'contact.txt', 'projects/', 'photos/', 'secrets.txt'],
    '~/projects': PROJECTS.map((p) => p.id + '.case'),
    '~/photos': ALBUMS.map((a) => a.id + '/')
};
const FILES = {
    'about.txt': () => "Fatima Ibrahim Maideribe · design engineer & creative technologist\nBSc Creative Computing, Ravensbourne → MSc Design Engineering, Imperial College London.\nI build things between people and technology: habit-nudging apps,\ndevices that make data feel human, playful interfaces.\nOff the clock: the outdoors, new recipes, fantasy novels.",
    'skills.txt': () => 'UX research & design · user interviews, think-aloud testing, prototyping, Figma\nCode · JavaScript, Python, C++, PHP, HTML/CSS, Node.js, Chart.js\nData · pandas, matplotlib, seaborn, time-series & correlation analysis\nHardware · Arduino, ESP32/ESP8266, sensors & calibration, Firebase',
    'contact.txt': () => 'email     fatimamaideribe@gmail.com\nlinkedin  linkedin.com/in/fatima-ibrahim-maideribe\n(or type "contact" to open the Contact app)',
    'secrets.txt': () => "1. The plant is still alive.\n2. I did not procrastinate on FlowState. Much.\n3. There is no coffee machine."
};

function renderTerminal(w) {
    w.body.innerHTML = '<div class="term" role="log" aria-live="polite"><pre class="out"></pre><div class="line"><span class="ps"><b>fatima@laptop</b>:<span class="cwd">~</span>$</span><input aria-label="Terminal command" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>';
    const term = $('.term', w.body), out = $('.out', w.body), input = $('input', w.body), cwdEl = $('.cwd', w.body);
    const hist = store.get('term-history', []);
    let hi = hist.length;
    let cwd = '~';
    const print = (html = '') => { out.insertAdjacentHTML('beforeend', html + '\n'); term.scrollTop = term.scrollHeight; };
    const p = (s, cls) => print(cls ? `<span class="${cls}">${esc(s)}</span>` : esc(s));

    const commands = {
        help: () => print(`Available commands:
  <span class="ok">help</span>          this list              <span class="ok">ls</span> / <span class="ok">cd</span> / <span class="ok">cat</span>   browse files
  <span class="ok">open</span> &lt;thing&gt;   open an app or project  <span class="ok">projects</span>      open File Explorer
  <span class="ok">new</span>           what's new               <span class="ok">flowstate</span> / <span class="ok">plant</span>
  <span class="ok">about</span>  <span class="ok">skills</span>  <span class="ok">contact</span>          <span class="ok">photos</span>  <span class="ok">snake</span>  <span class="ok">notepad</span>
  <span class="ok">neofetch</span>      system info              <span class="ok">wallpaper</span> [name]
  <span class="ok">sound</span> on|off  system sounds            <span class="ok">create</span>        new sticky note
  <span class="ok">date</span>  <span class="ok">whoami</span>  <span class="ok">echo</span>  <span class="ok">history</span>  <span class="ok">clear</span>  <span class="ok">exit</span>
  <span class="ok">restart</span>  <span class="ok">shutdown</span>
<span class="dim">Tip: ↑/↓ for history, Tab to autocomplete. There are hidden commands too.</span>`),
        about: () => { WM.open('about'); p('Opening about.txt in a window…', 'dim'); },
        skills: () => { WM.open('skills'); p('Opening skills…', 'dim'); },
        contact: () => { WM.open('contact'); p('Opening Contact…', 'dim'); },
        projects: () => { WM.open('explorer'); p('Opening C:\\Users\\Fatima\\Projects…', 'dim'); },
        photos: () => { WM.open('photos'); p('Opening Photos…', 'dim'); },
        snake: () => { WM.open('snake'); p('Loading Snake*Search… watch the AI hunt with A*.', 'dim'); },
        'fix-game': () => commands.snake(),
        notepad: () => { WM.open('notepad'); },
        taskmgr: () => { WM.open('taskmgr'); },
        settings: () => { WM.open('settings'); },
        new: () => print(`New from my MSc at Imperial:
  📱 <span class="ok">FlowState</span>          completion-based focus app (UX, Figma)
  🪴 <span class="ok">Smart Plant Buddy</span>  ESP32 plant monitor (IoT, Firebase)
Type <span class="ok">flowstate</span> or <span class="ok">plant</span> to open one.`),
        whatsnew: () => commands.new(),
        flowstate: () => { p('Launching FlowState.fig…', 'dim'); openProject('flowstate'); },
        plant: () => { p('Booting PlantBuddy.exe… 🪴 (^ ^)', 'dim'); openProject('plant-buddy'); },
        plantbuddy: () => commands.plant(),
        open: (arg) => {
            const a = (arg || '').toLowerCase().replace(/\.case$|\/$/, '');
            if (!a) return p('Usage: open <app|project>   e.g. open photos, open flowstate', 'err');
            const proj = PROJECTS.find((x) => x.id === a || x.title.toLowerCase().includes(a));
            const appId = Object.keys(APPS).find((k) => k === a || APPS[k].title.toLowerCase().includes(a));
            if (appId) { WM.open(appId); p(`Opening ${APPS[appId].title}…`, 'dim'); }
            else if (proj) { openProject(proj.id); p(`Opening ${proj.title}…`, 'dim'); }
            else p(`open: nothing called "${a}"`, 'err');
        },
        ls: (arg) => {
            const dir = arg ? resolve(arg) : cwd;
            if (!FS[dir]) return p(`ls: cannot access '${arg}': No such directory`, 'err');
            print(FS[dir].map((f) => f.endsWith('/') ? `<span class="ok">${esc(f)}</span>` : esc(f)).join('   '));
        },
        cd: (arg) => {
            if (!arg || arg === '~') { cwd = '~'; }
            else {
                const d = resolve(arg);
                if (!FS[d]) return p(`cd: ${arg}: No such directory`, 'err');
                cwd = d;
            }
            cwdEl.textContent = cwd;
        },
        cat: (arg) => {
            if (!arg) return p('Usage: cat <file>', 'err');
            if (FILES[arg] && cwd === '~') return p(FILES[arg]());
            const pr = PROJECTS.find((x) => x.id + '.case' === arg);
            if (pr && cwd === '~/projects') return print(`<span class="ok">${esc(pr.title)}</span> · ${esc(pr.kind)}\n${esc(pr.blurb)}\n<span class="dim">tags: ${esc(pr.tags.join(', '))}</span>\n<span class="dim">→ open ${esc(pr.id)}</span>`);
            p(`cat: ${arg}: No such file`, 'err');
        },
        neofetch: () => {
            const mins = Math.max(1, Math.round((Date.now() - bootTime) / 60000));
            const logo = ['      .-.      ', '   .-(   )-.   ', '  (    o    )  ', "   '-(   )-'   ", "      '-'      ", '       |       ', '     \\ | /     ', '      \\|/      ', '    ~~~~~~~    ', '               ', '               '];
            const info = [
                '<span class="ok">fatima</span>@<span class="ok">laptop</span>', '------------',
                `<span class="ok">OS</span>: Fatima's Laptop (Y2K edition)`,
                `<span class="ok">Host</span>: Dyson School of Design Engineering, Imperial`,
                `<span class="ok">Kernel</span>: BSc @ Ravensbourne → MSc @ Imperial`,
                `<span class="ok">Uptime</span>: ${mins} min`,
                `<span class="ok">Packages</span>: ${PROJECTS.length} projects (2 new)`,
                `<span class="ok">Resolution</span>: ${window.innerWidth}x${window.innerHeight}`,
                `<span class="ok">Theme</span>: ${Settings.wpName()} · accent ${esc(Settings.accentName())}`,
                `<span class="ok">CPU</span>: Curiosity @ 100%`,
                `<span class="ok">Memory</span>: 1 plant (alive, thanks to sensors)`
            ];
            print(logo.map((l, i) => `<span class="ascii">${esc(l)}</span>  ${info[i] || ''}`).join('\n') +
                '\n               ' + ['#000033', '#ff66ff', '#9933ff', '#00ffcc', '#66ffff', '#ffd166', '#ffffff'].map((c) => `<span style="color:${c}">███</span>`).join(''));
        },
        date: () => p(new Date().toString()),
        whoami: () => p('visitor (probably a lovely recruiter). The owner is Fatima.'),
        echo: (...args) => p(args.join(' ')),
        history: () => print(hist.map((c, i) => `  ${String(i + 1).padStart(3)}  ${esc(c)}`).join('\n') || '(empty)'),
        clear: () => { out.innerHTML = ''; },
        cls: () => commands.clear(),
        exit: () => WM.close(w),
        create: () => { Gadgets.newNote(); p('Created a new sticky note!', 'ok'); },
        wallpaper: (name) => {
            if (!name) return print(`Wallpapers: ${Settings.WALLPAPERS.map((x) => x.id === Settings.wp ? `<span class="ok">[${x.id}]</span>` : x.id).join('  ')}\nUsage: wallpaper &lt;name&gt;`);
            if (Settings.setWallpaper(name)) p(`Wallpaper set to ${name}.`, 'ok'); else p(`wallpaper: unknown "${name}"`, 'err');
        },
        sound: (v) => { if (v === 'on' || v === 'off') { Sound.set(v === 'on'); p(`Sound ${v}.`, 'ok'); } else p('Usage: sound on|off', 'err'); },
        restart: () => { p('Restarting…', 'dim'); setTimeout(() => Power.restart(), 400); },
        reboot: () => commands.restart(),
        shutdown: () => { p('Goodbye 👋', 'dim'); setTimeout(() => Power.shutdown(), 400); },
        sudo: () => p("Nice try, you're not root 😏", 'err'),
        hello: () => p('Hello there! Nice to meet you. Type "help" to see what I can do.'),
        hi: () => commands.hello(),
        42: () => p('Yes, that is indeed the answer to life, the universe, and everything.'),
        coffee: () => print(`<span class="ascii">        ( (
         ) )
      .........
      |       |]
      \\       /
       \`-----'</span>
<span class="err">Error: Coffee machine not found. Please insert coin to continue.</span>`),
        rm: () => p('rm: permission denied. These files are load-bearing. 🗑️', 'err'),
        vim: () => p("You're now stuck in vim forever. (Kidding. Type 'exit' to close the terminal.)", 'dim'),
        matrix: () => {
            let n = 0;
            const t = setInterval(() => {
                print(`<span class="ok">${Array.from({ length: 60 }, () => (Math.random() > 0.5 ? String.fromCharCode(0x30a0 + Math.random() * 96) : ' ')).join('')}</span>`);
                if (++n > 24) { clearInterval(t); p('Wake up, Neo… (just kidding, it\'s still my laptop)', 'dim'); }
            }, 60);
        }
    };
    function resolve(arg) {
        if (arg === '..') return '~';
        if (arg.startsWith('~')) return arg.replace(/\/$/, '');
        return (cwd === '~' ? '~/' : cwd + '/') + arg.replace(/\/$/, '');
    }
    const run = (raw) => {
        const line = raw.trim();
        print(`<span class="ps"><b>fatima@laptop</b>:${esc(cwd)}$</span> ${esc(line)}`);
        if (!line) return;
        hist.push(line);
        if (hist.length > 60) hist.shift();
        store.set('term-history', hist);
        hi = hist.length;
        const [cmd, ...args] = line.split(/\s+/);
        const fn = commands[cmd.toLowerCase()];
        if (fn) fn(...args);
        else { p(`Command not found: ${cmd}. Type "help" for available commands.`, 'err'); Sound.play('error'); }
    };
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { run(input.value); input.value = ''; }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi]; } }
        else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) { hi++; input.value = hist[hi]; } else { hi = hist.length; input.value = ''; } }
        else if (e.key === 'Tab') {
            e.preventDefault();
            const parts = input.value.split(/\s+/);
            const last = parts[parts.length - 1].toLowerCase();
            const pool = parts.length === 1 ? Object.keys(commands) : [...(FS[cwd] || []), ...Object.keys(APPS), ...PROJECTS.map((x) => x.id)];
            const hits = pool.filter((c) => c.toLowerCase().startsWith(last));
            if (hits.length === 1) { parts[parts.length - 1] = hits[0]; input.value = parts.join(' ') + (hits[0].endsWith('/') ? '' : ' '); }
            else if (hits.length > 1) print(`<span class="dim">${esc(hits.join('   '))}</span>`);
        } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); commands.clear(); }
    });
    term.addEventListener('click', () => { if (!getSelection().toString()) input.focus(); });
    w.run = run;

    // typed welcome
    const welcome = "Design Engineering Terminal\nType 'help' to see available commands.";
    let i = 0;
    const type = () => {
        if (i <= welcome.length) {
            out.textContent = welcome.slice(0, i++);
            w.typer = setTimeout(type, 14 + Math.random() * 24);
        } else out.insertAdjacentHTML('beforeend', '\n\n');
    };
    type();
    w.cleanup.push(() => clearTimeout(w.typer));
}

/* --------------------------------------------------------------- notepad */

function renderNotepad(w) {
    const fallback = 'Type your quick notes here...\n\n- Finish portfolio updates\n- Update resume\n- Research new tech trends';
    w.body.innerHTML = `<div class="notepad">
        <div class="np-menu"><button data-n="new">New</button><button data-n="save">Save</button><button data-n="download">Download .txt</button><button data-n="time">Time/Date</button></div>
        <textarea aria-label="Notepad text" spellcheck="false"></textarea>
        <div class="np-status"><span class="np-pos">Ln 1, Col 1</span><span class="np-saved">Saved</span></div>
    </div>`;
    const ta = $('textarea', w.body), pos = $('.np-pos', w.body), saved = $('.np-saved', w.body);
    ta.value = store.get('notepad', fallback);
    let t;
    const save = () => { store.set('notepad', ta.value); saved.textContent = 'Saved'; };
    const caret = () => {
        const before = ta.value.slice(0, ta.selectionStart).split('\n');
        pos.textContent = `Ln ${before.length}, Col ${before[before.length - 1].length + 1} · ${ta.value.length} chars`;
    };
    ta.addEventListener('input', () => { saved.textContent = 'Editing…'; clearTimeout(t); t = setTimeout(save, 500); caret(); });
    ['keyup', 'click'].forEach((ev) => ta.addEventListener(ev, caret));
    $('[data-n="new"]', w.body).addEventListener('click', () => { ta.value = ''; save(); ta.focus(); caret(); });
    $('[data-n="save"]', w.body).addEventListener('click', () => { save(); toast({ icon: '💾', title: 'Saved', text: 'Saved to C:\\Users\\Visitor\\notes.txt (well, your browser).' }); });
    $('[data-n="download"]', w.body).addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([ta.value], { type: 'text/plain' }));
        a.download = 'notes.txt';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    $('[data-n="time"]', w.body).addEventListener('click', () => {
        const s = new Date().toLocaleString('en-GB');
        ta.setRangeText(s, ta.selectionStart, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
        ta.focus();
    });
    caret();
}

/* ----------------------------------------------------------------- snake */

function renderSnake(w) {
    const N = 40, C = 10;
    w.body.innerHTML = `<div class="snake">
        <canvas width="400" height="400" aria-label="Snake game board"></canvas>
        <div class="side">
            <div class="score"><span class="sc">0</span><small>score · best <span class="best">${store.get('snake-best', 0)}</span></small></div>
            <p class="msg">The AI is playing. Hit “Player mode” to take over.</p>
            <div class="modes">
                <button class="btn solid" data-m="ai">🤖 AI mode (A*)</button>
                <button class="btn pink" data-m="player">🎮 Player mode</button>
            </div>
            <label><input type="checkbox" class="showsearch" checked> Show A* search</label>
            <label>Speed <input type="range" class="speed" min="30" max="200" value="80" aria-label="Speed"></label>
            <p class="legend"><i style="background:#00ffcc"></i>head · <i style="background:#9933ff"></i>body<br><i style="background:rgba(120,90,255,.35)"></i>explored · <i style="border:2px solid #ff66ff"></i>planned path</p>
            <p class="legend">Arrow keys / WASD steer in player mode while this window is focused.</p>
        </div>
    </div>`;
    const cv = $('canvas', w.body), ctx = cv.getContext('2d');
    const scEl = $('.sc', w.body), bestEl = $('.best', w.body), msg = $('.msg', w.body);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = 400 * dpr; cv.height = 400 * dpr; ctx.scale(dpr, dpr);
    let snake, dir, nextDir, food, score, mode = 'ai', timer = null, over = false, path = [], explored = [];

    const key = (x, y) => y * N + x;
    const occupied = () => new Set(snake.map((s) => key(s.x, s.y)));
    const placeFood = () => {
        const occ = occupied();
        let f;
        do { f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; } while (occ.has(key(f.x, f.y)));
        food = f;
    };
    const reset = () => {
        snake = [{ x: 12, y: 20 }, { x: 11, y: 20 }, { x: 10, y: 20 }, { x: 9, y: 20 }];
        dir = nextDir = { x: 1, y: 0 };
        score = 0; over = false; path = []; explored = [];
        scEl.textContent = '0';
        placeFood();
    };
    const nbrs = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter((p) => p.x >= 0 && p.y >= 0 && p.x < N && p.y < N);

    // A* from head to food; the tail cell counts as free because it moves on
    const astar = () => {
        const blocked = new Set(snake.slice(0, -1).map((s) => key(s.x, s.y)));
        const start = snake[0];
        const hFn = (p) => Math.abs(p.x - food.x) + Math.abs(p.y - food.y);
        const open = [{ ...start, g: 0, f: hFn(start) }];
        const came = new Map(), g = new Map([[key(start.x, start.y), 0]]), closed = new Set();
        const seen = [];
        while (open.length) {
            let bi = 0;
            for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
            const cur = open.splice(bi, 1)[0];
            const ck = key(cur.x, cur.y);
            if (closed.has(ck)) continue;
            closed.add(ck);
            seen.push(cur);
            if (cur.x === food.x && cur.y === food.y) {
                const out = [];
                let k = ck;
                while (came.has(k)) { out.unshift({ x: k % N, y: Math.floor(k / N) }); k = came.get(k); }
                return { path: out, seen };
            }
            for (const n of nbrs(cur.x, cur.y)) {
                const nk = key(n.x, n.y);
                if (blocked.has(nk) || closed.has(nk)) continue;
                const ng = cur.g + 1;
                if (ng < (g.has(nk) ? g.get(nk) : Infinity)) {
                    g.set(nk, ng);
                    came.set(nk, ck);
                    open.push({ ...n, g: ng, f: ng + hFn(n) });
                }
            }
        }
        return { path: [], seen };
    };
    const floodSize = (from, blocked) => {
        const q = [from], s = new Set([key(from.x, from.y)]);
        while (q.length && s.size < 400) {
            const c = q.shift();
            for (const n of nbrs(c.x, c.y)) { const k = key(n.x, n.y); if (!s.has(k) && !blocked.has(k)) { s.add(k); q.push(n); } }
        }
        return s.size;
    };
    const aiStep = () => {
        const r = astar();
        explored = r.seen;
        path = r.path;
        const head = snake[0];
        let next = path[0];
        // Don't follow a path into a dead end: check there's room after the move
        const blocked = new Set(snake.slice(0, -1).map((s) => key(s.x, s.y)));
        if (next) {
            const after = new Set(blocked); after.add(key(next.x, next.y));
            if (floodSize(next, after) < snake.length) next = null;
        }
        if (!next) {
            let best = null, bestSize = -1;
            nbrs(head.x, head.y).forEach((n) => {
                if (blocked.has(key(n.x, n.y))) return;
                const after = new Set(blocked); after.add(key(n.x, n.y));
                const s = floodSize(n, after);
                if (s > bestSize) { bestSize = s; best = n; }
            });
            next = best;
            path = [];
        }
        if (next) dir = { x: next.x - head.x, y: next.y - head.y };
    };

    const draw = () => {
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, 400, 400);
        ctx.strokeStyle = 'rgba(40, 60, 160, 0.35)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= N; i++) { ctx.beginPath(); ctx.moveTo(i * C + 0.5, 0); ctx.lineTo(i * C + 0.5, 400); ctx.moveTo(0, i * C + 0.5); ctx.lineTo(400, i * C + 0.5); ctx.stroke(); }
        const show = $('.showsearch', w.body).checked && mode === 'ai';
        if (show) {
            ctx.fillStyle = 'rgba(120, 90, 255, 0.28)';
            explored.forEach((p) => ctx.fillRect(p.x * C + 1, p.y * C + 1, C - 1, C - 1));
            ctx.strokeStyle = '#ff66ff';
            ctx.lineWidth = 1.5;
            path.forEach((p) => ctx.strokeRect(p.x * C + 2, p.y * C + 2, C - 4, C - 4));
        }
        snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? '#00ffcc' : `rgba(153, 51, 255, ${1 - (i / snake.length) * 0.55})`;
            ctx.fillRect(s.x * C + 1, s.y * C + 1, C - 2, C - 2);
        });
        ctx.fillStyle = '#ff66ff';
        ctx.shadowColor = '#ff66ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(food.x * C + C / 2, food.y * C + C / 2, C / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (over) {
            ctx.fillStyle = 'rgba(0, 0, 30, 0.7)';
            ctx.fillRect(0, 160, 400, 80);
            ctx.fillStyle = '#fff';
            ctx.font = '32px VT323, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', 200, 198);
            ctx.font = '18px VT323, monospace';
            ctx.fillText(mode === 'ai' ? 'the AI will try again…' : 'press Player mode to retry', 200, 222);
        }
    };
    const step = () => {
        if (over) return;
        if (mode === 'ai') aiStep(); else dir = nextDir;
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        const hitSelf = snake.slice(0, -1).some((s) => s.x === head.x && s.y === head.y);
        if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || hitSelf) {
            over = true;
            draw();
            msg.textContent = mode === 'ai' ? `The AI trapped itself at length ${snake.length}. Restarting…` : `Game over! Score ${score}.`;
            Sound.play('error');
            if (mode === 'ai') setTimeout(() => { if (mode === 'ai' && WM.wins.has('snake')) { reset(); } }, 1600);
            return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scEl.textContent = score;
            if (mode === 'player' && score > store.get('snake-best', 0)) { store.set('snake-best', score); bestEl.textContent = score; }
            placeFood();
            Sound.play('click');
        } else snake.pop();
        draw();
    };
    const run = () => {
        clearInterval(timer);
        timer = setInterval(step, 230 - +$('.speed', w.body).value);
    };
    $('.speed', w.body).addEventListener('input', () => { if (timer) run(); });
    $('[data-m="ai"]', w.body).addEventListener('click', () => { mode = 'ai'; reset(); msg.textContent = 'The AI is planning each move with A* (Manhattan heuristic).'; run(); });
    $('[data-m="player"]', w.body).addEventListener('click', () => { mode = 'player'; reset(); msg.textContent = 'Your turn! Arrow keys or WASD.'; run(); cv.focus(); });
    $('.showsearch', w.body).addEventListener('change', draw);
    w.onKey = (e) => {
        if (mode !== 'player') return false;
        const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
        const m = map[e.key];
        if (!m) return false;
        if (m[0] !== -dir.x || m[1] !== -dir.y) nextDir = { x: m[0], y: m[1] };
        return true;
    };
    w.app.pause = () => clearInterval(timer);
    w.app.resume = () => { if (!over || mode === 'ai') run(); };
    w.cleanup.push(() => clearInterval(timer));
    reset();
    draw();
    run();
}

/* ----------------------------------------------------------- task manager */

function renderTaskMgr(w) {
    w.body.innerHTML = `<div class="tm">
        <div class="graphs">
            <div class="graph"><small>CPU</small><b class="cpu">0%</b><canvas class="gc" width="240" height="50"></canvas></div>
            <div class="graph"><small>Memory</small><b class="mem">0%</b><canvas class="gm" width="240" height="50"></canvas></div>
        </div>
        <table><thead><tr><th>Process</th><th>CPU</th><th></th><th></th></tr></thead><tbody></tbody></table>
    </div>`;
    const sys = [
        { id: 'sys-kernel', name: '🧠 kernel', cpu: 3, locked: true },
        { id: 'sys-curiosity', name: '✨ curiosity.exe', cpu: 38, locked: true },
        { id: 'sys-wall', name: '🖼️ wallpaper.dll', cpu: 1, locked: true },
        { id: 'sys-coffee', name: '☕ coffee-daemon (not responding)', cpu: 0, locked: false }
    ];
    if (store.get('coffee-killed', false)) sys.pop();
    const hc = [], hm = [];
    const spark = (cv, data, color) => {
        const c = cv.getContext('2d');
        c.clearRect(0, 0, cv.width, cv.height);
        c.strokeStyle = color; c.lineWidth = 2;
        c.fillStyle = color.replace('rgb', 'rgba').replace(')', ', 0.15)');
        c.beginPath();
        data.forEach((v, i) => { const x = (i / 39) * cv.width, y = cv.height - (v / 100) * cv.height; i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.stroke();
        c.lineTo(cv.width, cv.height); c.lineTo(0, cv.height); c.closePath(); c.fill();
    };
    const tick = () => {
        const rows = [
            ...[...WM.wins.values()].map((o) => ({ id: o.id, name: `${o.app.icon} ${$('.win-title', o.el).textContent}`, cpu: o.id === 'snake' ? 22 + Math.random() * 18 : 2 + Math.random() * 9, win: o })),
            ...sys.map((s) => ({ ...s, cpu: s.id === 'sys-curiosity' ? 30 + Math.random() * 25 : s.cpu + Math.random() * 2 }))
        ];
        const total = Math.min(99, rows.reduce((a, r) => a + r.cpu, 0) * 0.6);
        const mem = Math.min(95, 28 + WM.wins.size * 7 + Math.random() * 3);
        hc.push(total); hm.push(mem);
        if (hc.length > 40) { hc.shift(); hm.shift(); }
        $('.cpu', w.body).textContent = Math.round(total) + '%';
        $('.mem', w.body).textContent = Math.round(mem) + '%';
        spark($('.gc', w.body), hc, 'rgb(0, 255, 204)');
        spark($('.gm', w.body), hm, 'rgb(255, 102, 255)');
        $('tbody', w.body).innerHTML = rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${r.cpu.toFixed(1)}%</td><td><div class="bar"><i style="width:${Math.min(100, r.cpu * 1.6)}%"></i></div></td>
            <td><button class="btn" data-end="${r.id}" style="padding:3px 9px;font-size:11px">End task</button></td></tr>`).join('');
    };
    w.body.addEventListener('click', (e) => {
        const b = e.target.closest('[data-end]');
        if (!b) return;
        const id = b.dataset.end;
        if (WM.wins.has(id)) { if (id === 'taskmgr') { WM.close(w); return; } WM.close(WM.wins.get(id)); tick(); return; }
        const s = sys.find((x) => x.id === id);
        if (!s) return;
        if (s.locked) { Sound.play('error'); toast({ icon: '⛔', title: 'Access denied', text: `This laptop can't run without ${s.name.replace(/^\S+ /, '')}. Nice try though.` }); return; }
        sys.splice(sys.indexOf(s), 1);
        store.set('coffee-killed', true);
        toast({ icon: '☕', title: 'coffee-daemon ended', text: 'Productivity down 12%. Yawning up 40%.' });
        tick();
    });
    tick();
    const t = setInterval(tick, 1000);
    w.cleanup.push(() => clearInterval(t));
}

/* --------------------------------------------------------------- settings */

const Settings = {
    WALLPAPERS: [
        { id: 'bliss', name: 'Bliss', sw: "url('background1.jpeg') center / cover" },
        { id: 'y2k', name: 'Y2K Sunset', sw: 'linear-gradient(160deg, #2b0a5e, #7a1fa2 45%, #ff5fa2 80%, #ffb36b)' },
        { id: 'night', name: 'Night Sky', sw: 'linear-gradient(#01010f, #0a0f3d 70%, #13206b)' },
        { id: 'mat', name: 'Cutting Mat', sw: '#1f4a3d' },
        { id: 'teal', name: 'Lagoon', sw: 'radial-gradient(circle at 30% 20%, #19b5a0, #0b5f6e 55%, #062b3d)' }
    ],
    ACCENTS: [['Teal', '#00ffcc'], ['Pink', '#ff66ff'], ['Lilac', '#b58bff'], ['Tangerine', '#ffa94d'], ['Lime', '#b6ff5c']],
    wp: store.get('wallpaper', 'bliss'),
    accent: store.get('accent', '#00ffcc'),
    saver: store.get('saver', true),
    apply() {
        $('#wallpaper').dataset.wp = this.wp;
        document.documentElement.style.setProperty('--accent', this.accent);
    },
    wpName() { return (this.WALLPAPERS.find((x) => x.id === this.wp) || {}).name || this.wp; },
    accentName() { return (this.ACCENTS.find((a) => a[1] === this.accent) || ['Custom'])[0]; },
    setWallpaper(id) {
        if (!this.WALLPAPERS.some((x) => x.id === id)) return false;
        this.wp = id;
        store.set('wallpaper', id);
        const wpEl = $('#wallpaper');
        wpEl.style.filter = 'brightness(1.8) blur(4px)';
        setTimeout(() => { this.apply(); wpEl.style.filter = ''; }, 150);
        $$('.wp-opt').forEach((b) => b.classList.toggle('on', b.dataset.wp === id));
        return true;
    },
    nextWallpaper() {
        const i = this.WALLPAPERS.findIndex((x) => x.id === this.wp);
        this.setWallpaper(this.WALLPAPERS[(i + 1) % this.WALLPAPERS.length].id);
    },
    setAccent(c) {
        this.accent = c;
        store.set('accent', c);
        this.apply();
        $$('.accents button').forEach((b) => b.classList.toggle('on', b.dataset.c === c));
    }
};

function renderSettings(w) {
    w.body.innerHTML = `<div class="settings">
        <h3>Wallpaper</h3>
        <div class="wp-grid">${Settings.WALLPAPERS.map((x) => `<button class="wp-opt${x.id === Settings.wp ? ' on' : ''}" data-wp="${x.id}"><div class="sw" style="background:${x.sw}"></div><span>${esc(x.name)}</span></button>`).join('')}</div>
        <h3>Accent colour</h3>
        <div class="accents">${Settings.ACCENTS.map(([n, c]) => `<button data-c="${c}" style="background:${c}" class="${c === Settings.accent ? 'on' : ''}" aria-label="${n}" title="${n}"></button>`).join('')}</div>
        <h3>System</h3>
        <div class="toggle"><span>System sounds<small>Clicks, chimes &amp; bloops (off by default)</small></span><button class="switch" data-setting="sound" role="switch" aria-checked="${Sound.on}" aria-label="System sounds"></button></div>
        <div class="toggle"><span>Screensaver<small>Bouncing logo after 2 minutes idle</small></span><button class="switch" data-setting="saver" role="switch" aria-checked="${Settings.saver}" aria-label="Screensaver"></button></div>
        <div class="toggle"><span>Reset desktop<small>Put icons, notes &amp; widgets back where they started</small></span><button class="btn" data-reset>Reset</button></div>
        <h3>About this computer</h3>
        <p class="muted" style="font-size:12.5px;line-height:1.7">Y2K edition · hand-built with HTML, CSS &amp; vanilla JavaScript by Fatima Ibrahim Maideribe.<br>Screen ${window.innerWidth}×${window.innerHeight} · ${PROJECTS.length} projects installed · no frameworks were harmed.</p>
    </div>`;
    $$('.wp-opt', w.body).forEach((b) => b.addEventListener('click', () => Settings.setWallpaper(b.dataset.wp)));
    $$('.accents button', w.body).forEach((b) => b.addEventListener('click', () => Settings.setAccent(b.dataset.c)));
    $('[data-setting="sound"]', w.body).addEventListener('click', () => Sound.set(!Sound.on));
    $('[data-setting="saver"]', w.body).addEventListener('click', (e) => {
        Settings.saver = !Settings.saver;
        store.set('saver', Settings.saver);
        e.currentTarget.setAttribute('aria-checked', String(Settings.saver));
    });
    $('[data-reset]', w.body).addEventListener('click', () => {
        Icons.arrange();
        Gadgets.reset();
        toast({ icon: '🧹', title: 'Desktop reset', text: 'Icons, notes and widgets are back in their original spots.' });
    });
}

/* ---------------------------------------------------------- small apps */

function initContact(w) {
    const form = $('form', w.body);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#c-name', form).value.trim();
        const subject = $('#c-subject', form).value.trim();
        const msgText = $('#c-msg', form).value.trim();
        if (!name || !msgText) {
            Sound.play('error');
            (!name ? $('#c-name', form) : $('#c-msg', form)).focus();
            toast({ icon: '✏️', title: 'Almost there', text: 'Add your name and a message first.' });
            return;
        }
        const href = `mailto:fatimamaideribe@gmail.com?subject=${encodeURIComponent(subject || 'Hello from your portfolio')}&body=${encodeURIComponent(msgText + '\n\n— ' + name)}`;
        window.location.href = href;
        toast({ icon: '✉️', title: 'Opening your email app…', text: "Your message is filled in. Just hit send!" });
    });
}

function initBin(w) {
    $('[data-bin-empty]', w.body).addEventListener('click', () => {
        Sound.play('error');
        w.el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(0)' }], { duration: 320 });
        toast({ icon: '🗑️', title: "Can't empty the Recycle Bin", text: 'These files are load-bearing memories.' });
    });
}

/* ------------------------------------------------------------ app registry */

const APPS = {
    explorer: { title: 'Projects', icon: '🗂️', w: 940, h: 580, render: renderExplorer, reopen: (w, o) => w.reopenSection && w.reopenSection(o.section) },
    browser: { title: 'Browser', icon: '🌐', w: 1040, h: 700, render: renderBrowser, reopen: (w, o) => { if (o.project && w.nav) w.nav({ project: o.project }); } },
    photos: { title: 'Photos', icon: '🖼️', w: 880, h: 600, render: renderPhotos, reopen: (w, o) => w.setAlbum && w.setAlbum(o.album) },
    about: { title: 'About Me', icon: '🌺', w: 620, h: 600, tpl: 'tpl-about', pad: true },
    skills: { title: 'Skills', icon: '✨', w: 720, h: 470, tpl: 'tpl-skills', pad: true },
    contact: { title: 'Contact', icon: '✉️', w: 580, h: 620, tpl: 'tpl-contact', pad: true, render: initContact, autofocus: true },
    terminal: { title: 'Terminal', icon: '💻', w: 700, h: 400, render: renderTerminal, autofocus: true },
    notepad: { title: 'Notepad', icon: '📝', w: 540, h: 420, render: renderNotepad, autofocus: true },
    snake: { title: 'Snake*Search', icon: '🐍', w: 720, h: 500, render: renderSnake },
    taskmgr: { title: 'Task Manager', icon: '📊', w: 600, h: 480, render: renderTaskMgr },
    settings: { title: 'Settings', icon: '⚙️', w: 620, h: 560, render: renderSettings, pad: true },
    bin: { title: 'Recycle Bin', icon: '🗑️', w: 500, h: 380, tpl: 'tpl-bin', render: initBin }
};

// Keyboard: route keys to the focused window's app (snake, photos)
document.addEventListener('keydown', (e) => {
    const w = WM.focused;
    if (!w || w.min || !w.onKey) return;
    if (e.target.closest('input, textarea, [contenteditable="true"]')) return;
    if (w.onKey(e)) e.preventDefault();
});

/* ------------------------------------------------------------ screensaver */

const Saver = {
    el: $('#saver'),
    idle: 0,
    raf: null,
    init() {
        const wake = () => { this.idle = 0; if (this.el.classList.contains('on')) this.stop(); };
        ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => window.addEventListener(ev, wake, { passive: true }));
        setInterval(() => {
            if (document.hidden || !Settings.saver || $('#power').classList.contains('on') || document.documentElement.classList.contains('intro')) return;
            this.idle += 5;
            if (this.idle >= 120 && !this.el.classList.contains('on')) this.start();
        }, 5000);
    },
    start() {
        this.el.classList.add('on');
        const d = $('#dvd');
        let x = 60, y = 60, vx = 1.6, vy = 1.3;
        const colors = ['#00ffcc', '#ff66ff', '#ffd166', '#66ffff', '#b58bff', '#ff9f43'];
        let ci = 0;
        d.style.color = colors[0];
        const loop = () => {
            const W = window.innerWidth - d.offsetWidth, H = window.innerHeight - d.offsetHeight;
            x += vx; y += vy;
            if (x <= 0 || x >= W) { vx *= -1; x = clamp(x, 0, W); d.style.color = colors[++ci % colors.length]; }
            if (y <= 0 || y >= H) { vy *= -1; y = clamp(y, 0, H); d.style.color = colors[++ci % colors.length]; }
            d.style.transform = `translate(${x}px, ${y}px)`;
            this.raf = requestAnimationFrame(loop);
        };
        loop();
    },
    stop() { cancelAnimationFrame(this.raf); this.el.classList.remove('on'); }
};

/* ------------------------------------------------------------------ power */

const Power = {
    el: $('#power'),
    shutdown(thenBoot = false) {
        Menus.closeAll();
        Sound.play('off');
        WM.closeAll();
        setTimeout(() => {
            document.body.classList.add('crt-off');
            setTimeout(() => {
                document.body.classList.remove('crt-off');
                this.el.classList.add('on');
                if (thenBoot) { this.boot(); return; }
                this.el.innerHTML = '<div><p>It\'s now safe to turn off<br>your computer.</p><small>click or press any key to power on</small></div>';
                const on = () => { this.el.removeEventListener('click', on); window.removeEventListener('keydown', on); this.boot(); };
                setTimeout(() => { this.el.addEventListener('click', on); window.addEventListener('keydown', on); }, 400);
            }, 560);
        }, 250);
    },
    restart() {
        if (!window.FatIntro || isPhone()) { this.shutdown(true); return; }
        Menus.closeAll();
        Sound.play('off');
        WM.closeAll();
        setTimeout(() => {
            document.body.classList.add('crt-off');
            setTimeout(() => {
                document.body.classList.remove('crt-off');
                window.FatIntro.play().then(() => {
                    toast({ icon: '✿', title: 'Welcome back', text: 'Restarted. Everything is where you left it.' });
                });
            }, 560);
        }, 250);
    },
    boot() {
        this.el.innerHTML = '<div class="boot"><h1>Fatima&rsquo;s Laptop</h1><p style="font-size:22px;color:#aaa">Y2K edition</p><div class="bar"><i></i></div></div>';
        setTimeout(() => {
            this.el.classList.remove('on');
            this.el.innerHTML = '';
            Sound.play('startup');
            Icons.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
            toast({ icon: '✿', title: 'Welcome back', text: 'Restarted successfully. Everything is where you left it.' });
        }, 1800);
    }
};

/* ------------------------------------------------------------------- boot */

function boot() {
    Settings.apply();
    Icons.render();
    Icons.bind();
    Gadgets.init();
    Tray.init();
    StartMenu.init();
    Saver.init();

    window.addEventListener('resize', () => { Icons.layout(); WM.fitAll(); });

    // Anything that should "happen" once the visitor actually arrives waits for the 3D intro
    if (document.documentElement.classList.contains('intro')) window.addEventListener('fatos:intro-done', startSession, { once: true });
    else startSession();
}

function startSession() {
    Sound.play('startup');
    // The "ME RN LOL" clip loads only now, so it never competes with the intro (and never on phones, where it's hidden)
    const clip = $('#g-gif video');
    if (clip && !isPhone() && !clip.src) { clip.src = clip.dataset.src; clip.play().catch(() => {}); }
    // Deep links: index.html#flowstate, #photos, #terminal …
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash && projectById(hash)) openProject(hash);
    else if (hash && APPS[hash]) WM.open(hash);
    else if (!isPhone()) {
        const D = deskRect();
        WM.open('terminal', { x: 120, y: Math.max(20, D.h - 360), w: 660, h: 320, noFocus: true });
    }

    let welcomed = false;
    try { welcomed = sessionStorage.getItem('fatos:welcomed') === '1'; sessionStorage.setItem('fatos:welcomed', '1'); } catch { /* ignore */ }
    if (!welcomed) {
        setTimeout(() => toast({
            icon: '📬', title: 'Mail: 2 new projects',
            text: 'FlowState and Smart Plant Buddy just landed from my MSc at Imperial.',
            actions: [{ label: 'Open FlowState', solid: true, fn: () => openProject('flowstate') }, { label: 'Plant Buddy', fn: () => openProject('plant-buddy') }],
            timeout: 12000
        }), 1600);
    }
}

boot();
})();
