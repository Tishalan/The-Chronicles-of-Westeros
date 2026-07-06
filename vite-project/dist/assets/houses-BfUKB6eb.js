import{r as e}from"./data-r0Y9rXUx.js";import{i as t,n,r,t as i}from"./shared-D5z5EA6R.js";/* empty css               *//* empty css              */document.addEventListener(`DOMContentLoaded`,()=>{t(),n(),a();let e=window.location.hash.replace(`#`,``);if(e){let t=document.getElementById(`house-${e}`);t&&setTimeout(()=>t.scrollIntoView({behavior:`smooth`,block:`center`}),400)}});function a(){let t=document.getElementById(`allHousesGrid`);t&&(e.forEach((e,n)=>{let r=document.createElement(`div`);r.className=`house-card house-card--${e.id}`,r.id=`house-${e.id}`,r.style.cssText=`--accent:${e.accent}; --border:${e.border}; --glow:${e.glow}; background:${e.bg};`,r.style.transitionDelay=`${n%3*100}ms`,r.innerHTML=`
      <span class="corner corner-tl"></span>
      <span class="corner corner-tr"></span>
      <span class="corner corner-bl"></span>
      <span class="corner corner-br"></span>
      <div class="card-glow"></div>
      <div class="house-sigil-wrap">
        ${e.img?`<img class="house-sigil-img" src="${e.img}" alt="House ${e.name}" onerror="this.parentElement.innerHTML='<div class=\\'house-sigil-fallback\\'>${e.sigil[0]}</div><div class=\\'sigil-ring\\'></div>'">`:`<div class="house-sigil-fallback">${e.sigil[0]}</div>`}
        <div class="sigil-ring"></div>
      </div>
      <div class="house-content">
        <p class="house-region">${e.region}</p>
        <div class="house-divider">
          <span class="divider-line"></span>
          <span class="divider-diamond"></span>
          <span class="divider-line"></span>
        </div>
        <h2 class="house-name">HOUSE<br>${e.name}</h2>
        <p class="house-seat">${e.seat}</p>
        <p class="house-sigil-label">${e.sigil}</p>
      </div>
      <div class="house-hover-content">
        <p class="hover-words">${e.words}</p>
        <div class="house-divider hover-divider">
          <span class="divider-line"></span>
          <span class="divider-diamond"></span>
          <span class="divider-line"></span>
        </div>
        <h2 class="hover-name">HOUSE ${e.name}</h2>
        <p class="hover-desc">${e.description}</p>
      </div>
      <div class="card-accent-bar"></div>
    `,t.appendChild(r)}),setTimeout(()=>{i(`.house-card`),r()},100))}