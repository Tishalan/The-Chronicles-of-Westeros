/* ═══════════════════════════════════════════════════════════════════
   DRAGONS — CoverFlow 3D Carousel JS
   Clean center-focused layout · Arrow navigation · RAF lerp · 60fps
   ═══════════════════════════════════════════════════════════════════ */

import { initNavbar } from './shared.js'

/* ─────────────────────────────────────────────────────────────────
   CONFIG
   ───────────────────────────────────────────────────────────────── */
// How many cards visible each side (rest hidden)
const VISIBLE_EACH_SIDE = 3

// Transform per position slot (offset from center)
// Each entry: { x:%, rotY:deg, scale, opacity, zIndex }
const POSITIONS = [
  // center
  { x: 0,     rotY:   0, scale: 1.00, opacity: 1.00, z: 10 },
  // ±1
  { x: 38,    rotY: -42, scale: 0.82, opacity: 0.60, z: 8  },
  // ±2
  { x: 64,    rotY: -60, scale: 0.65, opacity: 0.32, z: 6  },
  // ±3
  { x: 82,    rotY: -70, scale: 0.52, opacity: 0.13, z: 4  },
  // ±4+ (hidden off-edge)
  { x: 95,    rotY: -75, scale: 0.42, opacity: 0.00, z: 1  },
]

const LERP_FACTOR = 0.10
const REDUCED     = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isMob       = () => window.innerWidth <= 768

/* ─────────────────────────────────────────────────────────────────
   STATE
   ───────────────────────────────────────────────────────────────── */
let dragons    = []
let activeIdx  = 0
let targetIdx  = 0
let fracIdx    = 0    // fractional animated index for lerp
let cards      = []   // DOM card elements in order
let wrapEl, detailInner, counterEl, dotsEl

/* ─────────────────────────────────────────────────────────────────
   BOOTSTRAP
   ───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initNavbar()
  showLoader()
  try {
    const { DRAGONS } = await import('./data.js')
    dragons = DRAGONS
    await preloadFirst(dragons[0]?.img)
    hideLoader()
    build()
    requestAnimationFrame(loop)
    initEmbers()
  } catch (e) {
    console.error('[CoverFlow]', e)
    hideLoader()
  }
})

/* ─────────────────────────────────────────────────────────────────
   LOADER
   ───────────────────────────────────────────────────────────────── */
function showLoader() {
  const s = document.querySelector('.page-content')
  if (s) s.innerHTML = `
    <div id="carousel-loader">
      <div class="loader-ring"></div>
      <p class="loader-text">Awakening Dragons…</p>
    </div>`
}
function hideLoader() { document.getElementById('carousel-loader')?.remove() }
function preloadFirst(src) {
  if (!src) return Promise.resolve()
  return new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = src })
}

/* ─────────────────────────────────────────────────────────────────
   BUILD DOM
   ───────────────────────────────────────────────────────────────── */
function build() {
  const sec = document.querySelector('.page-content')
  if (!sec) return

  // Measure hero height for CSS var
  const hero = document.querySelector('.page-hero')
  if (hero) {
    document.documentElement.style.setProperty('--hero-h', hero.offsetHeight + 'px')
  }

  sec.innerHTML = `
    <div id="dragon-cf">
      <!-- Stage -->
      <div id="cf-stage"></div>

      <!-- Detail Panel -->
      <div id="cf-detail">
        <div class="cf-detail-inner" id="cf-detail-inner"></div>
        <div class="cf-counter" id="cf-counter"></div>
      </div>

      <!-- Nav Row -->
      <div id="cf-nav">
        <button class="cf-arrow" id="cf-prev" aria-label="Previous">&#8249;</button>
        <div id="cf-dots"></div>
        <button class="cf-arrow" id="cf-next" aria-label="Next">&#8250;</button>
      </div>
    </div>
  `

  wrapEl      = document.getElementById('dragon-cf')
  detailInner = document.getElementById('cf-detail-inner')
  counterEl   = document.getElementById('cf-counter')
  dotsEl      = document.getElementById('cf-dots')

  const stage = document.getElementById('cf-stage')

  /* Create card elements */
  dragons.forEach((d, i) => {
    const card = document.createElement('div')
    card.className = 'cf-card'
    card.dataset.i  = i
    card.style.setProperty('--cf-accent',      d.accent)
    card.style.setProperty('--cf-glow-strong', d.accent + '55')

    const sCls = d.status === 'alive' ? 'char-status-alive' : 'char-status-dead'
    card.innerHTML = `
      <div class="cf-card-img">
        ${d.img
          ? `<img src="${d.img}" alt="${d.name}" loading="lazy"
                 onerror="this.parentElement.innerHTML='<div class=\\'cf-card-fallback\\'>🐉</div>'">`
          : `<div class="cf-card-fallback">🐉</div>`
        }
      </div>
      <span class="cf-status ${sCls}">${d.status}</span>
      <div class="cf-label">
        <div class="cf-label-name">${d.name}</div>
      </div>`

    card.addEventListener('click', () => { if (i !== activeIdx) goTo(i) })
    stage.appendChild(card)
    cards.push(card)
  })

  /* Dots */
  dragons.forEach((_, i) => {
    const dot = document.createElement('button')
    dot.className = 'cf-dot'
    dot.setAttribute('aria-label', `Dragon ${i + 1}`)
    dot.addEventListener('click', () => goTo(i))
    dotsEl.appendChild(dot)
  })

  /* Arrows */
  document.getElementById('cf-prev').addEventListener('click', () => {
    goTo((activeIdx - 1 + dragons.length) % dragons.length)
  })
  document.getElementById('cf-next').addEventListener('click', () => {
    goTo((activeIdx + 1) % dragons.length)
  })

  /* Keyboard */
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')
      goTo((activeIdx - 1 + dragons.length) % dragons.length)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
      goTo((activeIdx + 1) % dragons.length)
  })

  /* Touch */
  let tx = 0
  stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX }, { passive: true })
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx
    if (Math.abs(dx) > 45)
      goTo(dx < 0
        ? (activeIdx + 1) % dragons.length
        : (activeIdx - 1 + dragons.length) % dragons.length)
  }, { passive: true })

  setActive(0, true)
}

/* ─────────────────────────────────────────────────────────────────
   NAVIGATE
   ───────────────────────────────────────────────────────────────── */
function goTo(idx) {
  targetIdx = idx
  setActive(idx)
}

/* ─────────────────────────────────────────────────────────────────
   RAF LOOP — lerp fracIdx toward targetIdx, then layout cards
   ───────────────────────────────────────────────────────────────── */
function loop() {
  requestAnimationFrame(loop)

  // Lerp fractional index
  if (REDUCED) {
    fracIdx = targetIdx
  } else {
    const delta = targetIdx - fracIdx
    if (Math.abs(delta) > 0.002) {
      fracIdx += delta * LERP_FACTOR
    } else {
      fracIdx = targetIdx
    }
  }

  layoutCards(fracIdx)
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT CARDS — compute transform for each card relative to fracIdx
   ───────────────────────────────────────────────────────────────── */
function layoutCards(fi) {
  const n   = dragons.length
  const mob = isMob()

  cards.forEach((card, i) => {
    // Distance from fractional center (shortest wrap path)
    let offset = i - fi
    if (offset > n / 2)  offset -= n
    if (offset < -n / 2) offset += n

    const absOff = Math.abs(offset)
    const sign   = offset >= 0 ? 1 : -1

    // Interpolate between position slots
    const lo     = Math.floor(absOff)
    const hi     = lo + 1
    const t      = absOff - lo  // fractional between slots

    const pLo    = getPos(lo, mob)
    const pHi    = getPos(hi, mob)

    const x      = lerp(pLo.x,       pHi.x,       t) * sign
    const rotY   = lerp(pLo.rotY,    pHi.rotY,    t) * sign  // mirror for left side
    const scale  = lerp(pLo.scale,   pHi.scale,   t)
    const op     = lerp(pLo.opacity, pHi.opacity, t)
    const z      = Math.round(lerp(pLo.z, pHi.z, t))

    card.style.transform = `translateX(${x}%) rotateY(${rotY}deg) scale(${scale})`
    card.style.opacity   = op
    card.style.zIndex    = z
    card.style.pointerEvents = op < 0.05 ? 'none' : 'auto'

    // Active class only on exact center
    card.classList.toggle('cf-active', absOff < 0.15)
  })
}

function getPos(idx, mob) {
  const capped = Math.min(idx, POSITIONS.length - 1)
  const p = POSITIONS[capped]
  return mob ? { ...p, x: p.x * 0.6, scale: p.scale * 0.9 } : p
}

function lerp(a, b, t) { return a + (b - a) * t }

/* ─────────────────────────────────────────────────────────────────
   SET ACTIVE — update glow, detail, dots
   ───────────────────────────────────────────────────────────────── */
function setActive(idx, instant = false) {
  activeIdx = idx
  const d = dragons[idx]
  if (!d) return

  // CSS vars for accent glow
  if (wrapEl) {
    wrapEl.style.setProperty('--cf-accent', d.accent)
    wrapEl.style.setProperty('--cf-glow',   d.accent + '18')
  }

  // Dots
  dotsEl?.querySelectorAll('.cf-dot').forEach((dot, i) => {
    const on = i === idx
    dot.classList.toggle('active', on)
    dot.style.background = on ? d.accent : ''
  })

  // Detail panel
  if (instant) {
    renderDetail(d, idx)
  } else {
    detailInner.classList.add('fading')
    setTimeout(() => {
      renderDetail(d, idx)
      detailInner.classList.remove('fading')
    }, 160)
  }
}

function renderDetail(d, idx) {
  const sCls = d.status === 'alive' ? 'char-status-alive' : 'char-status-dead'
  const n    = String(idx + 1).padStart(2, '0')
  const tot  = String(dragons.length).padStart(2, '0')

  detailInner.innerHTML = `
    <p class="cf-eyebrow" style="color:${d.accent}">Fire &amp; Blood · Dragon Lore</p>
    <div class="cf-rule" style="background:${d.accent};width:52px"></div>
    <h2 class="cf-name">${d.name}</h2>
    <p class="cf-rider">${d.rider}</p>
    <p class="cf-desc">${d.description}</p>
    <div class="cf-stats">
      <div class="cf-stat-item">
        <span class="cf-stat-label">Dragonfire</span>
        <span class="cf-stat-val" style="color:${d.accent}">${d.fire}</span>
      </div>
      <div class="cf-stat-item">
        <span class="cf-stat-label">Stature</span>
        <span class="cf-stat-val">${d.size}</span>
      </div>
      <div class="cf-stat-item">
        <span class="cf-stat-label">Fate</span>
        <span class="cf-stat-val">
          <span class="cf-status-badge ${sCls}">${d.status}</span>
        </span>
      </div>
    </div>`

  if (counterEl) {
    counterEl.innerHTML = `
      <span class="cf-num">${n}</span>
      <span class="cf-of">of ${tot}</span>`
  }
}

/* ─────────────────────────────────────────────────────────────────
   EMBER CANVAS
   ───────────────────────────────────────────────────────────────── */
function initEmbers() {
  const cv  = document.createElement('canvas')
  cv.id     = 'ember-canvas'
  document.body.prepend(cv)
  const ctx = cv.getContext('2d')

  const resize = () => { cv.width = innerWidth; cv.height = innerHeight }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  if (REDUCED) return

  const E = Array.from({ length: 32 }, () => mkEmber(cv))
  E.forEach(e => { e.y = Math.random() * cv.height }) // scatter init

  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height)
    E.forEach(e => {
      e.y -= e.s; e.x += e.d; e.a -= 0.001
      if (e.a <= 0 || e.y < -6) Object.assign(e, mkEmber(cv))
      ctx.save()
      ctx.globalAlpha = Math.max(0, e.a)
      ctx.shadowBlur  = 6
      ctx.shadowColor = e.c
      ctx.fillStyle   = e.c
      ctx.beginPath()
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    requestAnimationFrame(draw)
  }
  draw()
}

function mkEmber(cv) {
  return {
    x: Math.random() * cv.width,
    y: cv.height + 6,
    r: Math.random() * 1.6 + 0.4,
    s: Math.random() * 0.5 + 0.15,
    d: (Math.random() - 0.5) * 0.3,
    a: Math.random() * 0.55 + 0.2,
    c: Math.random() > 0.5 ? '#c41e3a' : '#e07020'
  }
}
