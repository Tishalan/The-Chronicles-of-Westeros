/* ═══════════════════════════════════════════════════════════════════
   CHARACTERS PAGE JS
   ═══════════════════════════════════════════════════════════════════ */
import { CHARACTERS } from './data.js'
import { initNavbar, initFadeUp } from './shared.js'

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initFadeUp()
  renderCharacters(CHARACTERS)
  initFilters()
  initModal()
  // Scroll to hash if present
  const hash = window.location.hash.replace('#', '')
  if (hash) {
    const target = document.getElementById(`char-${hash}`)
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400)
  }
})

function renderCharacters(list) {
  const grid = document.getElementById('charsGrid')
  if (!grid) return
  grid.innerHTML = ''

  list.forEach((char, i) => {
    const card = document.createElement('div')
    card.className = 'char-card'
    card.id = `char-${char.id}`
    card.style.setProperty('--card-accent', char.accent)
    card.style.setProperty('--card-glow', char.accent + '18')
    card.style.transitionDelay = `${(i % 4) * 80}ms`
    card.dataset.status  = char.status
    card.dataset.house   = char.house
    card.dataset.charId  = char.id

    const statusCls = char.status === 'alive' ? 'char-status-alive' : 'char-status-dead'

    card.innerHTML = `
      <div class="char-card-portrait">
        ${char.img
          ? `<img src="${char.img}" alt="${char.name}" onerror="this.outerHTML='<div class=\\'char-card-fallback\\'>${char.name[0]}</div>'">`
          : `<div class="char-card-fallback">${char.name[0]}</div>`
        }
      </div>
      <span class="char-card-status ${statusCls}">${char.status}</span>
      <div class="char-card-body">
        <p class="char-card-house">${char.house}</p>
        <h3 class="char-card-name">${char.name}</h3>
        <p class="char-card-title">${char.titles[0]}</p>
      </div>
    `

    card.addEventListener('click', () => openModal(char))
    grid.appendChild(card)
  })

  // IntersectionObserver entrance
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  grid.querySelectorAll('.char-card').forEach(el => obs.observe(el))
}

function initFilters() {
  const btns = document.querySelectorAll('.filter-btn')
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const filter = btn.dataset.filter

      let filtered = CHARACTERS
      if (filter === 'alive') filtered = CHARACTERS.filter(c => c.status === 'alive')
      else if (filter === 'dead') filtered = CHARACTERS.filter(c => c.status === 'dead')
      else if (filter !== 'all') filtered = CHARACTERS.filter(c => c.house.includes(filter))

      renderCharacters(filtered)
    })
  })
}

function initModal() {
  const overlay = document.getElementById('charModal')
  const closeBtn = document.getElementById('modalClose')

  if (closeBtn) closeBtn.addEventListener('click', closeModal)
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal() })
}

function openModal(char) {
  const overlay  = document.getElementById('charModal')
  const portrait = document.getElementById('modalPortrait')
  const house    = document.getElementById('modalHouse')
  const name     = document.getElementById('modalName')
  const status   = document.getElementById('modalStatus')
  const titles   = document.getElementById('modalTitles')

  if (!overlay) return

  portrait.innerHTML = char.img
    ? `<img src="${char.img}" alt="${char.name}" onerror="this.outerHTML='<div class=\\'modal-portrait-fallback\\'>${char.name[0]}</div>'">`
    : `<div class="modal-portrait-fallback">${char.name[0]}</div>`

  house.textContent  = `House ${char.house}`
  name.textContent   = char.name
  const statusCls    = char.status === 'alive' ? 'char-status-alive' : 'char-status-dead'
  status.className   = `modal-status ${statusCls}`
  status.textContent = char.status
  status.style.color = char.status === 'alive' ? '#4a7c3f' : '#a04040'
  status.style.borderColor = char.status === 'alive' ? 'rgba(74,124,63,0.4)' : 'rgba(160,64,64,0.4)'

  titles.innerHTML = char.titles
    .map(t => `<p class="modal-title-item">${t}</p>`)
    .join('')

  overlay.classList.add('open')
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  const overlay = document.getElementById('charModal')
  if (overlay) overlay.classList.remove('open')
  document.body.style.overflow = ''
}
