import{i as e}from"./shared-D5z5EA6R.js";/* empty css              */var t=`modulepreload`,n=function(e){return`/`+e},r={},i=function(e,i,a){let o=Promise.resolve();if(i&&i.length>0){let e=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}o=l(i.map(i=>{if(i=n(i,a),i in r)return;r[i]=!0;let o=i.endsWith(`.css`),s=o?`[rel="stylesheet"]`:``;if(a)for(let t=e.length-1;t>=0;t--){let n=e[t];if(n.href===i&&(!o||n.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${i}"]${s}`))return;let l=document.createElement(`link`);if(l.rel=o?`stylesheet`:t,o||(l.as=`script`),l.crossOrigin=``,l.href=i,c&&l.setAttribute(`nonce`,c),document.head.appendChild(l),o)return new Promise((e,t)=>{l.addEventListener(`load`,e),l.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${i}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(t=>{for(let e of t||[])e.status===`rejected`&&s(e.reason);return e().catch(s)})},a=[{x:0,rotY:0,scale:1,opacity:1,z:10},{x:38,rotY:-42,scale:.82,opacity:.6,z:8},{x:64,rotY:-60,scale:.65,opacity:.32,z:6},{x:82,rotY:-70,scale:.52,opacity:.13,z:4},{x:95,rotY:-75,scale:.42,opacity:0,z:1}],o=.1,s=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,c=()=>window.innerWidth<=768,l=[],u=0,d=0,f=0,p=[],m,h,g,_;document.addEventListener(`DOMContentLoaded`,async()=>{e(),v();try{let{DRAGONS:e}=await i(async()=>{let{DRAGONS:e}=await import(`./data-r0Y9rXUx.js`).then(e=>e.o);return{DRAGONS:e}},[]);l=e,await b(l[0]?.img),y(),x(),requestAnimationFrame(C),k()}catch(e){console.error(`[CoverFlow]`,e),y()}});function v(){let e=document.querySelector(`.page-content`);e&&(e.innerHTML=`
    <div id="carousel-loader">
      <div class="loader-ring"></div>
      <p class="loader-text">Awakening Dragons…</p>
    </div>`)}function y(){document.getElementById(`carousel-loader`)?.remove()}function b(e){return e?new Promise(t=>{let n=new Image;n.onload=n.onerror=t,n.src=e}):Promise.resolve()}function x(){let e=document.querySelector(`.page-content`);if(!e)return;let t=document.querySelector(`.page-hero`);t&&document.documentElement.style.setProperty(`--hero-h`,t.offsetHeight+`px`),e.innerHTML=`
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
  `,m=document.getElementById(`dragon-cf`),h=document.getElementById(`cf-detail-inner`),g=document.getElementById(`cf-counter`),_=document.getElementById(`cf-dots`);let n=document.getElementById(`cf-stage`);l.forEach((e,t)=>{let r=document.createElement(`div`);r.className=`cf-card`,r.dataset.i=t,r.style.setProperty(`--cf-accent`,e.accent),r.style.setProperty(`--cf-glow-strong`,e.accent+`55`);let i=e.status===`alive`?`char-status-alive`:`char-status-dead`;r.innerHTML=`
      <div class="cf-card-img">
        ${e.img?`<img src="${e.img}" alt="${e.name}" loading="lazy"
                 onerror="this.parentElement.innerHTML='<div class=\\'cf-card-fallback\\'>🐉</div>'">`:`<div class="cf-card-fallback">🐉</div>`}
      </div>
      <span class="cf-status ${i}">${e.status}</span>
      <div class="cf-label">
        <div class="cf-label-name">${e.name}</div>
      </div>`,r.addEventListener(`click`,()=>{t!==u&&S(t)}),n.appendChild(r),p.push(r)}),l.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`cf-dot`,n.setAttribute(`aria-label`,`Dragon ${t+1}`),n.addEventListener(`click`,()=>S(t)),_.appendChild(n)}),document.getElementById(`cf-prev`).addEventListener(`click`,()=>{S((u-1+l.length)%l.length)}),document.getElementById(`cf-next`).addEventListener(`click`,()=>{S((u+1)%l.length)}),window.addEventListener(`keydown`,e=>{(e.key===`ArrowLeft`||e.key===`ArrowUp`)&&S((u-1+l.length)%l.length),(e.key===`ArrowRight`||e.key===`ArrowDown`)&&S((u+1)%l.length)});let r=0;n.addEventListener(`touchstart`,e=>{r=e.touches[0].clientX},{passive:!0}),n.addEventListener(`touchend`,e=>{let t=e.changedTouches[0].clientX-r;Math.abs(t)>45&&S(t<0?(u+1)%l.length:(u-1+l.length)%l.length)},{passive:!0}),D(0,!0)}function S(e){d=e,D(e)}function C(){if(requestAnimationFrame(C),s)f=d;else{let e=d-f;Math.abs(e)>.002?f+=e*o:f=d}w(f)}function w(e){let t=l.length,n=c();p.forEach((r,i)=>{let a=i-e;a>t/2&&(a-=t),a<-t/2&&(a+=t);let o=Math.abs(a),s=a>=0?1:-1,c=Math.floor(o),l=c+1,u=o-c,d=T(c,n),f=T(l,n),p=E(d.x,f.x,u)*s,m=E(d.rotY,f.rotY,u)*s,h=E(d.scale,f.scale,u),g=E(d.opacity,f.opacity,u),_=Math.round(E(d.z,f.z,u));r.style.transform=`translateX(${p}%) rotateY(${m}deg) scale(${h})`,r.style.opacity=g,r.style.zIndex=_,r.style.pointerEvents=g<.05?`none`:`auto`,r.classList.toggle(`cf-active`,o<.15)})}function T(e,t){let n=a[Math.min(e,a.length-1)];return t?{...n,x:n.x*.6,scale:n.scale*.9}:n}function E(e,t,n){return e+(t-e)*n}function D(e,t=!1){u=e;let n=l[e];n&&(m&&(m.style.setProperty(`--cf-accent`,n.accent),m.style.setProperty(`--cf-glow`,n.accent+`18`)),_?.querySelectorAll(`.cf-dot`).forEach((t,r)=>{let i=r===e;t.classList.toggle(`active`,i),t.style.background=i?n.accent:``}),t?O(n,e):(h.classList.add(`fading`),setTimeout(()=>{O(n,e),h.classList.remove(`fading`)},160)))}function O(e,t){let n=e.status===`alive`?`char-status-alive`:`char-status-dead`,r=String(t+1).padStart(2,`0`),i=String(l.length).padStart(2,`0`);h.innerHTML=`
    <p class="cf-eyebrow" style="color:${e.accent}">Fire &amp; Blood · Dragon Lore</p>
    <div class="cf-rule" style="background:${e.accent};width:52px"></div>
    <h2 class="cf-name">${e.name}</h2>
    <p class="cf-rider">${e.rider}</p>
    <p class="cf-desc">${e.description}</p>
    <div class="cf-stats">
      <div class="cf-stat-item">
        <span class="cf-stat-label">Dragonfire</span>
        <span class="cf-stat-val" style="color:${e.accent}">${e.fire}</span>
      </div>
      <div class="cf-stat-item">
        <span class="cf-stat-label">Stature</span>
        <span class="cf-stat-val">${e.size}</span>
      </div>
      <div class="cf-stat-item">
        <span class="cf-stat-label">Fate</span>
        <span class="cf-stat-val">
          <span class="cf-status-badge ${n}">${e.status}</span>
        </span>
      </div>
    </div>`,g&&(g.innerHTML=`
      <span class="cf-num">${r}</span>
      <span class="cf-of">of ${i}</span>`)}function k(){let e=document.createElement(`canvas`);e.id=`ember-canvas`,document.body.prepend(e);let t=e.getContext(`2d`),n=()=>{e.width=innerWidth,e.height=innerHeight};if(n(),window.addEventListener(`resize`,n,{passive:!0}),s)return;let r=Array.from({length:32},()=>A(e));r.forEach(t=>{t.y=Math.random()*e.height});function i(){t.clearRect(0,0,e.width,e.height),r.forEach(n=>{n.y-=n.s,n.x+=n.d,n.a-=.001,(n.a<=0||n.y<-6)&&Object.assign(n,A(e)),t.save(),t.globalAlpha=Math.max(0,n.a),t.shadowBlur=6,t.shadowColor=n.c,t.fillStyle=n.c,t.beginPath(),t.arc(n.x,n.y,n.r,0,Math.PI*2),t.fill(),t.restore()}),requestAnimationFrame(i)}i()}function A(e){return{x:Math.random()*e.width,y:e.height+6,r:Math.random()*1.6+.4,s:Math.random()*.5+.15,d:(Math.random()-.5)*.3,a:Math.random()*.55+.2,c:Math.random()>.5?`#c41e3a`:`#e07020`}}