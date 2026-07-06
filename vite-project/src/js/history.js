/* ═══════════════════════════════════════════════════════════════════
   HISTORY PAGE JS — Animated timeline
   ═══════════════════════════════════════════════════════════════════ */
import { TIMELINE } from './data.js'
import { initNavbar, initFadeUp } from './shared.js'

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initFadeUp()
  renderTimeline()
})

function renderTimeline() {
  const container = document.getElementById('timeline')
  if (!container) return

  TIMELINE.forEach((event, i) => {
    const el = document.createElement('div')
    el.className = 'timeline-event'
    el.style.transitionDelay = `${(i % 3) * 80}ms`

    el.innerHTML = `
      <div class="timeline-icon">${event.icon}</div>
      <p class="timeline-era">${event.era}</p>
      <p class="timeline-year">${event.year}</p>
      <h3 class="timeline-title">${event.title}</h3>
      <p class="timeline-desc">${event.description}</p>
    `
    container.appendChild(el)
  })

  // IntersectionObserver for staggered entrance
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15 })

  container.querySelectorAll('.timeline-event').forEach(el => obs.observe(el))
}
