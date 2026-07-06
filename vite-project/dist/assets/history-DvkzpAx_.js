import{a as e}from"./data-r0Y9rXUx.js";import{i as t,n}from"./shared-D5z5EA6R.js";/* empty css              */document.addEventListener(`DOMContentLoaded`,()=>{t(),n(),r()});function r(){let t=document.getElementById(`timeline`);if(!t)return;e.forEach((e,n)=>{let r=document.createElement(`div`);r.className=`timeline-event`,r.style.transitionDelay=`${n%3*80}ms`,r.innerHTML=`
      <div class="timeline-icon">${e.icon}</div>
      <p class="timeline-era">${e.era}</p>
      <p class="timeline-year">${e.year}</p>
      <h3 class="timeline-title">${e.title}</h3>
      <p class="timeline-desc">${e.description}</p>
    `,t.appendChild(r)});let n=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`visible`),n.unobserve(e.target))})},{threshold:.15});t.querySelectorAll(`.timeline-event`).forEach(e=>n.observe(e))}