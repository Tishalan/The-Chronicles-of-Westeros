/* ═══════════════════════════════════════════════════════════════════
   HOME — 7 Kingdoms Parallax Curtain Wipe System
   No heavy 3D transforms or expensive CSS filters (no lag!).
   Buttery smooth 60fps scroll reveal.
   ═══════════════════════════════════════════════════════════════════ */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { KINGDOMS, HOUSES, CHARACTERS, DRAGONS } from './data.js'
import { initNavbar, initFadeUp, initCardReveal, initHouseCardHover } from './shared.js'
import { FireSystem } from './fire-effect.js'
gsap.registerPlugin(ScrollTrigger)

let activeIdx = -1
let panels = []
let panelsBg = []

// ── Wait for DOM ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  buildRuneBar()
  buildDots()
  buildPanels()
  renderHouses()
  renderCharacterPreview()
  renderDragonPreview()

  // Hides loader instantly and boots engine
  const loader = document.getElementById('kLoading')
  if (loader) loader.classList.add('hidden')
  
  initParallaxCurtain()
  initFadeUp()
  
  setTimeout(() => {
    initCardReveal('.house-card')
    initCardReveal('.preview-card')
    initHouseCardHover()
  }, 100)
})

// ═══════════════════════════════════════════════════════════════════
// BUILD PANELS (Injected into Stacked Scene Container)
// ═══════════════════════════════════════════════════════════════════
function buildPanels() {
  const container = document.getElementById('kingdomsPanels')
  if (!container) return
  
  container.className = 'tunnel-scene'
  container.innerHTML = ''

  KINGDOMS.forEach((k, i) => {
    const panel = document.createElement('div')
    panel.className = `kingdom-panel${i === 0 ? ' is-first' : ''}`
    panel.id = `kpanel-${i}`
    panel.style.setProperty('--k-accent', k.accent)

    // Background Layer
    if (k.img) {
      panel.innerHTML = `
        <div class="kingdom-panel-bg" style="background-image:url('${k.img}')"></div>
        <div class="kingdom-overlay"></div>
      `
    } else {
      panel.innerHTML = `
        <div class="kingdom-panel-bg gradient" style="background:${k.bg}; display:flex; align-items:center; justify-content:center;">
          <div class="fallback-sigil-glow" style="font-size: clamp(140px, 20vw, 280px); opacity: 0.1; filter: drop-shadow(0 0 50px ${k.accent}); color: ${k.accent}; pointer-events: none; select: none;">${k.sigil}</div>
        </div>
        <div class="kingdom-overlay" style="background:linear-gradient(to right,rgba(2,2,2,0.95) 0%,rgba(2,2,2,0.45) 60%,rgba(2,2,2,0.65) 100%)"></div>
      `
    }

    container.appendChild(panel)
  })

  panels = document.querySelectorAll('.kingdom-panel')
  panelsBg = document.querySelectorAll('.kingdom-panel-bg')
}

// ═══════════════════════════════════════════════════════════════════
// RUNE DECORATIVE TICK BAR
// ═══════════════════════════════════════════════════════════════════
function buildRuneBar() {
  const bar = document.getElementById('kRuneBar')
  if (!bar) return
  for (let i = 0; i < 90; i++) {
    const tick = document.createElement('div')
    tick.className = 'k-rune-tick'
    bar.appendChild(tick)
  }
  // Entrance fade-in animation
  gsap.fromTo('.k-rune-tick',
    { scaleY: 0, opacity: 0 },
    { scaleY: 1, opacity: 1, stagger: 0.015, duration: 0.5, ease: 'power2.out', delay: 0.5 }
  )
}

// ═══════════════════════════════════════════════════════════════════
// PROGRESS INDICATOR DOTS
// ═══════════════════════════════════════════════════════════════════
function buildDots() {
  const dots = document.getElementById('kDots')
  if (!dots) return
  KINGDOMS.forEach((_, i) => {
    const dot = document.createElement('div')
    dot.className = `k-dot${i === 0 ? ' active' : ''}`
    dots.appendChild(dot)
  })
}

function updateDots(idx) {
  document.querySelectorAll('.k-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx)
  })
}

// ═══════════════════════════════════════════════════════════════════
// PARALLAX CURTAIN WIPE SYSTEM
// ═══════════════════════════════════════════════════════════════════
function initParallaxCurtain() {
  const wrapper = document.getElementById('kingdomsWrapper')
  const sticky  = document.getElementById('kingdomsSticky')
  if (!wrapper || !sticky) return

  // 1.5x screen height scroll space per kingdom
  const scrollPerKingdom = window.innerHeight * 1.5
  const totalScroll = scrollPerKingdom * (KINGDOMS.length - 1)
  wrapper.style.height = `${totalScroll + window.innerHeight}px`

  // Initial state setup
  updateCurtainScene(0)

  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    end: `+=${totalScroll}`,
    pin: sticky,
    pinSpacing: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      const progress = self.progress // 0 to 1
      const currentPos = progress * (KINGDOMS.length - 1)
      const currentIdx = Math.round(currentPos)

      // Drive curtain translations
      updateCurtainScene(currentPos)

      // Progress bar fill length and color sync
      const fill = document.getElementById('kProgressFill')
      if (fill) {
        fill.style.width = `${progress * 100}%`
        fill.style.background = `linear-gradient(to right, rgba(201,168,76,0.3), ${KINGDOMS[currentIdx].accent})`
      }

      // Sync active state/text on index threshold change
      if (currentIdx !== activeIdx) {
        syncKingdomText(currentIdx, activeIdx)
        activeIdx = currentIdx
      }
    }
  })
}

// ═══════════════════════════════════════════════════════════════════
// CURTAIN WIPE TRANSLATIONS LOOP
// ═══════════════════════════════════════════════════════════════════
function updateCurtainScene(currentPos) {
  panels.forEach((panel, i) => {
    // Current position relative to this panel
    const diff = i - currentPos

    let translateY = 0
    let bgTranslateY = 0

    if (diff <= -1) {
      // Panel fully scrolled past (moved up off-screen)
      translateY = -100
      bgTranslateY = 30
    } else if (diff >= 1) {
      // Panel waiting in background (hidden below screen)
      translateY = 100
      bgTranslateY = -30
    } else {
      // Panel is currently transitioning
      // diff ranges from -1 to 1
      translateY = diff * 100

      // Counter-parallax translation on the background image for 3D depth illusion
      bgTranslateY = -diff * 35 
    }

    // Direct DOM write for hardware acceleration (buttery smooth 60fps)
    panel.style.transform = `translate3d(0, ${translateY}%, 0)`
    panel.style.zIndex = i + 10 // Stack panels in order of index

    const bg = panelsBg[i]
    if (bg) {
      bg.style.transform = `translate3d(0, ${bgTranslateY}px, 0)`
    }
  })
}

// ═══════════════════════════════════════════════════════════════════
// TEXT TRANSITIONS AND STYLING (GSAP Orchestration)
// ═══════════════════════════════════════════════════════════════════
function syncKingdomText(newIdx, oldIdx) {
  const k = KINGDOMS[newIdx]

  // References
  const region   = document.getElementById('kRegion')
  const house    = document.getElementById('kHouseName')
  const words    = document.getElementById('kWords')
  const desc     = document.getElementById('kDesc')
  const bgNum    = document.getElementById('kBgNum')
  const counter  = document.getElementById('kCounterNum')
  const btnSolid = document.getElementById('kBtnSolid')
  const ctaRow   = document.getElementById('kCta')

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Outward fade of old texts first
  if (oldIdx >= 0) {
    tl.to([region, house, words, desc], {
      opacity: 0,
      y: -15,
      duration: 0.2,
      ease: 'power2.in',
    })
  }

  // Update DOM content dynamically
  tl.call(() => {
    if (region)   region.textContent  = k.region
    if (house)    house.textContent   = k.place
    if (words)    words.textContent   = k.kingdom
    if (desc)     desc.textContent    = k.desc
    if (bgNum)    bgNum.textContent   = k.bgNum
    if (counter)  counter.textContent = `${k.bgNum} / 07`
    
    if (btnSolid) {
      btnSolid.textContent = k.ctaLabel
      btnSolid.href = k.ctaHref
    }

    // Set accent color variables globally
    document.documentElement.style.setProperty('--k-accent', k.accent)
    const label = document.getElementById('kChapterLabel')
    if (label) label.textContent = `${k.bgNum} / 07`
    updateDots(newIdx)
  })

  // 1. Curtain wipe/reveal on region label
  tl.fromTo(region,
    { clipPath: 'inset(0 0 100% 0)', y: 10, opacity: 1 },
    { clipPath: 'inset(0 0 0% 0)',   y: 0,  duration: 0.5 },
    oldIdx >= 0 ? '+=0.05' : 0
  )

  // 2. Place name slide + skew reveal
  tl.fromTo(house,
    { x: -50, opacity: 0, skewX: -4 },
    { x: 0,   opacity: 1, skewX: 0, duration: 0.6 },
    '-=0.35'
  )

  // 3. Motto/Words letter-spacing collapse
  tl.fromTo(words,
    { letterSpacing: '0.4em', opacity: 0, x: 15 },
    { letterSpacing: '0.04em', opacity: 1, x: 0, duration: 0.65 },
    '-=0.4'
  )

  // 4. Description blur wipe
  tl.fromTo(desc,
    { filter: 'blur(8px)', opacity: 0, y: 8 },
    { filter: 'blur(0px)',  opacity: 1, y: 0,  duration: 0.6 },
    '-=0.4'
  )

  // 5. CTA Row slide up
  if (ctaRow) {
    tl.fromTo(ctaRow.querySelectorAll('a'),
      { y: 15, opacity: 0 },
      { y: 0,  opacity: 1, stagger: 0.08, duration: 0.4 },
      '-=0.3'
    )
  }

  // 6. Giant background number drift
  if (bgNum) {
    tl.fromTo(bgNum,
      { x: 40, opacity: 0 },
      { x: 0,  opacity: 1, duration: 0.5 },
      '-=0.6'
    )
  }
}

// ═══════════════════════════════════════════════════════════════════
// NOBLE HOUSES GRID
// ═══════════════════════════════════════════════════════════════════
function renderHouses() {
  const grid = document.getElementById('housesGrid')
  if (!grid) return
  HOUSES.slice(0, 6).forEach(house => {
    const card = document.createElement('a')
    card.href = `/houses.html#${house.id}`
    card.className = `house-card house-card--${house.id}`
    card.style.cssText = `--accent:${house.accent};--border:${house.border};--glow:${house.glow};background:${house.bg};`
    card.innerHTML = `
      <span class="corner corner-tl"></span><span class="corner corner-tr"></span>
      <span class="corner corner-bl"></span><span class="corner corner-br"></span>
      <div class="card-glow"></div>
      <div class="house-sigil-wrap">
        ${house.img
          ? `<img class="house-sigil-img" src="${house.img}" alt="${house.name}" onerror="this.parentElement.innerHTML='<div class=\\'house-sigil-fallback\\'>${house.sigil[0]}</div><div class=\\'sigil-ring\\'></div>'">`
          : `<div class="house-sigil-fallback">${house.sigil[0]}</div>`
        }
        <div class="sigil-ring"></div>
      </div>
      <div class="house-content">
        <p class="house-region">${house.region}</p>
        <div class="house-divider">
          <span class="divider-line"></span><span class="divider-diamond"></span><span class="divider-line"></span>
        </div>
        <h2 class="house-name">HOUSE<br>${house.name}</h2>
        <p class="house-seat">${house.seat}</p>
        <p class="house-sigil-label">${house.sigil}</p>
      </div>
      <div class="house-hover-content">
        <p class="hover-words">${house.words}</p>
        <div class="house-divider hover-divider">
          <span class="divider-line"></span><span class="divider-diamond"></span><span class="divider-line"></span>
        </div>
        <h2 class="hover-name">HOUSE ${house.name}</h2>
        <p class="hover-desc">${house.description}</p>
      </div>
      <div class="card-accent-bar"></div>
    `
    grid.appendChild(card)
  })
}

// ═══════════════════════════════════════════════════════════════════
// CHARACTER PREVIEWS
// ═══════════════════════════════════════════════════════════════════
function renderCharacterPreview() {
  const c = document.getElementById('charsCards')
  if (!c) return
  CHARACTERS.slice(0, 4).forEach(char => {
    const card = document.createElement('a')
    card.href = `/characters.html#${char.id}`
    card.className = 'preview-card'
    card.style.setProperty('--accent', char.accent)
    const sc = char.status === 'alive' ? 'status-alive' : 'status-dead'
    card.innerHTML = `
      <span class="preview-card-status ${sc}">${char.status}</span>
      ${char.img
        ? `<img class="preview-card-img" src="${char.img}" alt="${char.name}" onerror="this.outerHTML='<div class=\\'preview-card-fallback\\'>${char.name[0]}</div>'">`
        : `<div class="preview-card-fallback">${char.name[0]}</div>`
      }
      <div class="preview-card-body">
        <p class="preview-card-house">${char.house}</p>
        <h3 class="preview-card-name">${char.name}</h3>
        <p class="preview-card-title">${char.titles[0]}</p>
      </div>`
    c.appendChild(card)
  })
}

// ═══════════════════════════════════════════════════════════════════
// DRAGON PREVIEWS
// ═══════════════════════════════════════════════════════════════════
function renderDragonPreview() {
  const c = document.getElementById('dragonsCards')
  if (!c) return
  // Display more dragons now that we have them
  DRAGONS.slice(0, 4).forEach(dragon => {
    const card = document.createElement('a')
    card.href = `/dragons.html#${dragon.id}`
    card.className = 'preview-card dragon-card'
    card.style.setProperty('--accent', dragon.accent)
    const sc = dragon.status === 'alive' ? 'status-alive' : 'status-dead'
    card.innerHTML = `
      <canvas class="dragon-fire-canvas"></canvas>
      <span class="preview-card-status ${sc}">${dragon.status}</span>
      ${dragon.img
        ? `<img class="preview-card-img" src="${dragon.img}" alt="${dragon.name}" onerror="this.outerHTML='<div class=\\'preview-card-fallback\\'>🐉</div>'">`
        : `<div class="preview-card-fallback">🐉</div>`
      }
      <div class="preview-card-body" style="position:relative; z-index:10;">
        <p class="preview-card-house">Rider: ${dragon.rider}</p>
        <h3 class="preview-card-name">${dragon.name}</h3>
        <p class="preview-card-title">${dragon.fire}</p>
      </div>`
    c.appendChild(card)
    
    // Initialize fire effect on hover
    const canvas = card.querySelector('.dragon-fire-canvas')
    const fire = new FireSystem(canvas)
    
    card.addEventListener('mouseenter', () => fire.start())
    card.addEventListener('mouseleave', () => fire.stop())
  })
}
