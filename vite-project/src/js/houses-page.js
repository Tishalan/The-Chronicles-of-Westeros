/* ═══════════════════════════════════════════════════════════════════
   HOUSES PAGE JS
   ═══════════════════════════════════════════════════════════════════ */
import { HOUSES } from './data.js'
import { initNavbar, initFadeUp, initCardReveal, initHouseCardHover } from './shared.js'

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initFadeUp()
  renderAllHouses()

  const hash = window.location.hash.replace('#', '')
  if (hash) {
    const target = document.getElementById(`house-${hash}`)
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400)
  }
})

function renderAllHouses() {
  const grid = document.getElementById('allHousesGrid')
  if (!grid) return

  HOUSES.forEach((house, i) => {
    const card = document.createElement('div')
    card.className = `house-card house-card--${house.id}`
    card.id = `house-${house.id}`
    card.style.cssText = `--accent:${house.accent}; --border:${house.border}; --glow:${house.glow}; background:${house.bg};`
    card.style.transitionDelay = `${(i % 3) * 100}ms`

    card.innerHTML = `
      <span class="corner corner-tl"></span>
      <span class="corner corner-tr"></span>
      <span class="corner corner-bl"></span>
      <span class="corner corner-br"></span>
      <div class="card-glow"></div>
      <div class="house-sigil-wrap">
        ${house.img
          ? `<img class="house-sigil-img" src="${house.img}" alt="House ${house.name}" onerror="this.parentElement.innerHTML='<div class=\\'house-sigil-fallback\\'>${house.sigil[0]}</div><div class=\\'sigil-ring\\'></div>'">`
          : `<div class="house-sigil-fallback">${house.sigil[0]}</div>`
        }
        <div class="sigil-ring"></div>
      </div>
      <div class="house-content">
        <p class="house-region">${house.region}</p>
        <div class="house-divider">
          <span class="divider-line"></span>
          <span class="divider-diamond"></span>
          <span class="divider-line"></span>
        </div>
        <h2 class="house-name">HOUSE<br>${house.name}</h2>
        <p class="house-seat">${house.seat}</p>
        <p class="house-sigil-label">${house.sigil}</p>
      </div>
      <div class="house-hover-content">
        <p class="hover-words">${house.words}</p>
        <div class="house-divider hover-divider">
          <span class="divider-line"></span>
          <span class="divider-diamond"></span>
          <span class="divider-line"></span>
        </div>
        <h2 class="hover-name">HOUSE ${house.name}</h2>
        <p class="hover-desc">${house.description}</p>
      </div>
      <div class="card-accent-bar"></div>
    `
    grid.appendChild(card)
  })

  setTimeout(() => {
    initCardReveal('.house-card')
    initHouseCardHover()
  }, 100)
}
