/* ═══════════════════════════════════════════════════════════════════
   SHARED — Navbar scroll effect + Hamburger + IntersectionObserver
   ═══════════════════════════════════════════════════════════════════ */

import Lenis from '@studio-freight/lenis'

export function initNavbar() {
  initSmoothScroll()
  initPageTransitions()
  const navbar = document.getElementById('navbar')
  const hamburger = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobileMenu')

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  }, { passive: true })

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open')
      mobileMenu.classList.toggle('open')
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : ''
    })

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open')
        mobileMenu.classList.remove('open')
        document.body.style.overflow = ''
      })
    })
  }
}

// ── IntersectionObserver helper for .fade-up elements ──
export function initFadeUp() {
  const els = document.querySelectorAll('.fade-up')
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100)
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15 })
  els.forEach(el => obs.observe(el))
}

// ── Card staggered entrance via IntersectionObserver ──
export function initCardReveal(selector) {
  const cards = document.querySelectorAll(selector)
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(cards).indexOf(entry.target)
        setTimeout(() => entry.target.classList.add('visible'), idx * 100)
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  cards.forEach(card => obs.observe(card))
}

// ── House card hover (tilt + content swap) ──
export function initHouseCardHover() {
  document.querySelectorAll('.house-card').forEach(card => {
    const sigilWrap = card.querySelector('.house-sigil-wrap')
    const content = card.querySelector('.house-content')
    const hoverContent = card.querySelector('.house-hover-content')

    card.addEventListener('mouseenter', () => {
      if (content) content.classList.add('content-hidden')
      if (hoverContent) hoverContent.classList.add('hover-visible')
    })

    card.addEventListener('mouseleave', () => {
      if (content) content.classList.remove('content-hidden')
      if (hoverContent) hoverContent.classList.remove('hover-visible')
      if (sigilWrap) sigilWrap.style.transform = ''
    })

    card.addEventListener('mousemove', (e) => {
      if (!sigilWrap) return
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14
      sigilWrap.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) scale(1.06)`
    })
  })
}

// ── Smooth Scrolling (Lenis) ──
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

// ── Smooth Page Transitions (Ajax feel) ──
function initPageTransitions() {
  const overlay = document.createElement('div')
  overlay.className = 'page-transition-overlay'
  document.body.appendChild(overlay)

  setTimeout(() => overlay.classList.add('loaded'), 50)

  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href')
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')) {
        e.preventDefault()
        overlay.classList.remove('loaded')
        setTimeout(() => {
          window.location.href = href
        }, 400)
      }
    })
  })
}
