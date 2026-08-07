(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const re={ru:[],en:[]};let V=null;function me(){return V||(V=fetch("/words.json").then(e=>{if(!e.ok)throw new Error(`Failed to load dictionary: ${e.status}`);return e.json()}).then(e=>{for(const t of["ru","en"]){const s=e.languages?.[t]?.words??[];re[t]=s.map(a=>a.toLowerCase().trim()).filter(a=>a.length>=3&&a.length<=10)}}),V)}function ve(e){const t=[...e];for(let s=t.length-1;s>0;s--){const a=Math.floor(Math.random()*(s+1));[t[s],t[a]]=[t[a],t[s]]}return t}function he(e,t){const s=re[t];if(s.length===0)throw new Error(`Dictionary empty for language: ${t}`);const a=ve(s).slice(0,e);for(;a.length<e;)a.push(s[Math.floor(Math.random()*s.length)]);return a}function ge(e){return e==="ё"?"е":e}function ye(e,t,s){for(let a=0;a<e.length;a++)if(!t.has(a)&&!s.has(ge(e[a][0])))return{word:e[a],index:a};return null}const I={targetId:null,buffer:""};function we(e){return/^[\u0400-\u04FFa-zA-Z]$/.test(e)}function _(e){return e==="ё"?"е":e}function be(e,t,s){if(e==="Backspace"){if(s.buffer.length===0)return{state:s};const i=s.buffer.slice(0,-1);return{state:{targetId:i.length===0?null:s.targetId,buffer:i}}}if(!we(e)||e.length!==1)return{state:s};const a=_(e.toLowerCase());if(s.targetId===null){const i=t.find(l=>_(l.word[0])===a);return i?i.word.length===1?{state:I,completedZombieId:i.id}:{state:{targetId:i.id,buffer:i.word[0]}}:{state:s,bonk:!0}}const n=t.find(i=>i.id===s.targetId);if(!n)return{state:I};if(_(n.word[s.buffer.length])===a){const i=s.buffer+n.word[s.buffer.length];return i.length===n.word.length?{state:I,completedZombieId:n.id}:{state:{targetId:n.id,buffer:i}}}return{state:s,bonk:!0}}let E=null,G=!1;function xe(){if(G)return null;if(E)return E;const e=window.AudioContext??window.webkitAudioContext;if(!e)return null;try{E=new e}catch{return null}return E}function ke(e){G=e,G&&E&&(E.close().catch(()=>{}),E=null)}function J(e,t,s,a,n,o){const i=e.currentTime;s.gain.setValueAtTime(0,i),s.gain.linearRampToValueAtTime(a,i+n),s.gain.exponentialRampToValueAtTime(.001,i+n+o),t.start(i),t.stop(i+n+o+.02)}function Te(e){const t=e.createOscillator(),s=e.createGain(),a=e.createBiquadFilter();a.type="lowpass",a.frequency.setValueAtTime(1200,e.currentTime),t.type="square",t.frequency.setValueAtTime(420,e.currentTime),t.frequency.exponentialRampToValueAtTime(80,e.currentTime+.08),t.connect(a).connect(s).connect(e.destination),J(e,t,s,.2,.002,.12)}function Le(e){const t=e.createOscillator(),s=e.createGain();t.type="sawtooth",t.frequency.setValueAtTime(180,e.currentTime),t.frequency.exponentialRampToValueAtTime(50,e.currentTime+.25),t.connect(s).connect(e.destination),J(e,t,s,.25,.005,.28)}function Se(e){const t=e.createOscillator(),s=e.createGain();t.type="triangle",t.frequency.setValueAtTime(140,e.currentTime),t.connect(s).connect(e.destination),J(e,t,s,.1,.002,.05)}function Me(e){[523,659,784].forEach((s,a)=>{const n=e.createOscillator(),o=e.createGain();n.type="square",n.frequency.value=s,n.connect(o).connect(e.destination);const i=e.currentTime+a*.1;o.gain.setValueAtTime(0,i),o.gain.linearRampToValueAtTime(.18,i+.01),o.gain.exponentialRampToValueAtTime(.001,i+.2),n.start(i),n.stop(i+.22)})}function Ce(e){[330,277,220].forEach((s,a)=>{const n=e.createOscillator(),o=e.createGain();n.type="sawtooth",n.frequency.value=s,n.connect(o).connect(e.destination);const i=e.currentTime+a*.15;o.gain.setValueAtTime(0,i),o.gain.linearRampToValueAtTime(.18,i+.01),o.gain.exponentialRampToValueAtTime(.001,i+.3),n.start(i),n.stop(i+.32)})}function $e(e){[523,659,784,1047].forEach((s,a)=>{const n=e.createOscillator(),o=e.createGain();n.type="triangle",n.frequency.value=s,n.connect(o).connect(e.destination);const i=e.currentTime+a*.11;o.gain.setValueAtTime(0,i),o.gain.linearRampToValueAtTime(.22,i+.01),o.gain.exponentialRampToValueAtTime(.001,i+.3),n.start(i),n.stop(i+.32)})}function z(e){const t=xe();if(t)try{switch(t.state==="suspended"&&t.resume(),e){case"shoot":Te(t);break;case"bite":Le(t);break;case"bonk":Se(t);break;case"level_win":Me(t);break;case"level_lose":Ce(t);break;case"day_win":$e(t);break}}catch{}}const le=[{number:1,baseTimePerChar:2.2,zombieCount:15,maxSimultaneous:3},{number:2,baseTimePerChar:1.8,zombieCount:15,maxSimultaneous:3},{number:3,baseTimePerChar:1.5,zombieCount:15,maxSimultaneous:3},{number:4,baseTimePerChar:1.2,zombieCount:15,maxSimultaneous:3},{number:5,baseTimePerChar:.95,zombieCount:15,maxSimultaneous:3}],ce=le.length,Ee=.6;function Re(e){const t=he(e.level.zombieCount,e.language),s=new Set,a=[];let n=1,o=3,i=0,l=0,d=0,T=0,h=I,w=0,m=!1,c=null,g=0;const v=performance.now();function y(){return performance.now()-g}function $(){const r=[0,0,0];for(const p of a)p.status==="alive"&&r[p.lane]++;const f=Math.min(r[0],r[1],r[2]),b=[];return r[0]===f&&b.push(0),r[1]===f&&b.push(1),r[2]===f&&b.push(2),b[Math.floor(Math.random()*b.length)]}function L(){return a.filter(r=>r.status==="alive")}function k(r){const f=new Set;for(const p of L()){const S=p.word[0];f.add(S==="ё"?"е":S)}const b=ye(t,s,f);return b?(s.add(b.index),a.push({id:n++,word:b.word,spawnTime:r,timerDuration:b.word.length*e.level.baseTimePerChar,lane:$(),status:"alive"}),!0):!1}function M(){cancelAnimationFrame(w),window.removeEventListener("keydown",H),document.removeEventListener("visibilitychange",q)}function C(r){if(m)return;m=!0,M(),z(r==="won"?"level_win":"level_lose");const f=y()-v,b=d+T,p=b>0?d/b:1,S=f/6e4,O=S>0?Math.round(i/S):0;e.onFinish({status:r,wpm:O,accuracy:p,timeMs:f,zombiesKilled:i,zombiesMissed:l,zombiesTotal:e.level.zombieCount})}function H(r){if(m||r.ctrlKey||r.altKey||r.metaKey)return;if(r.key==="Backspace"||/^[\u0400-\u04FF]$/.test(r.key))r.preventDefault();else return;const f=L(),b=h.buffer.length,p=be(r.key,f,h);if(h=p.state,p.bonk)T++,z("bonk");else if(p.completedZombieId!==void 0){d++;const S=a.find(O=>O.id===p.completedZombieId);S&&S.status==="alive"&&(S.status="killed",i++,z("shoot"),e.onZombieKilled(S))}else p.state.buffer.length>b&&d++}function q(){document.hidden?c===null&&(c=performance.now(),cancelAnimationFrame(w)):c!==null&&(g+=performance.now()-c,c=null,w=requestAnimationFrame(A))}function A(){if(m)return;const r=y();for(const p of a){if(p.status!=="alive")continue;(r-p.spawnTime)/1e3>=p.timerDuration&&(p.status="escaped",l++,o--,z("bite"),h.targetId===p.id&&(h=I),e.onZombieEscaped(p))}const f=L();if(o<=0){u(r,f),C("lost");return}const b=a.length;if(f.length<e.level.maxSimultaneous&&b<e.level.zombieCount){let p=f.length===0;if(!p){const S=f.reduce((te,ne)=>te.spawnTime>ne.spawnTime?te:ne);p=(r-S.spawnTime)/1e3/S.timerDuration>Ee}p&&k(r)}if(b>=e.level.zombieCount&&f.length===0){u(r,f),C("won");return}u(r,f),w=requestAnimationFrame(A)}function u(r,f){e.onFrame({zombies:a,aliveZombies:f,lives:o,killedCount:i,totalCount:e.level.zombieCount,input:h,virtualNow:r})}return window.addEventListener("keydown",H),document.addEventListener("visibilitychange",q),k(y()),w=requestAnimationFrame(A),{stop(){m||(m=!0,M())}}}const se="zombie-typing-events",Be=500;function B(e){const t={...e,ts:Date.now()};console.log("[analytics]",t);try{const s=localStorage.getItem(se),a=s?JSON.parse(s):[];for(a.push(t);a.length>Be;)a.shift();localStorage.setItem(se,JSON.stringify(a))}catch{}}const de="zombie-typing-v1";function Ae(){return crypto.randomUUID()}function ue(){return(navigator.language||"").toLowerCase().startsWith("en")?"en":"ru"}function Z(){return{version:1,userUuid:Ae(),language:ue(),streak:{count:0,lastDate:""},history:[],currentDayProgress:null}}function ze(){try{const e=localStorage.getItem(de);if(!e)return Z();const t=JSON.parse(e);return t?.version!==1?Z():(t.language!=="ru"&&t.language!=="en"&&(t.language=ue()),t)}catch{return Z()}}function Ie(e,t){if(e.language===t)return e;const s={...e,language:t};return X(s),s}function X(e){try{localStorage.setItem(de,JSON.stringify(e))}catch(t){console.warn("Unable to save state:",t)}}function R(){const e=new Date,t=e.getFullYear(),s=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0");return`${t}-${s}-${a}`}function Q(e,t){if(!e||!t)return 1/0;const[s,a,n]=e.split("-").map(Number),[o,i,l]=t.split("-").map(Number),d=Date.UTC(s,a-1,n),T=Date.UTC(o,i-1,l);return Math.round((T-d)/864e5)}function ee(e){return!e.streak.lastDate||Q(e.streak.lastDate,R())>1?0:e.streak.count}function De(e){return e.streak.lastDate&&Q(e.streak.lastDate,R())>1&&e.streak.count>0?{...e,streak:{count:0,lastDate:e.streak.lastDate}}:e}function Pe(e){const t=R();return e.history.some(s=>s.date===t&&s.completed)}function K(e){const t=R();return e.currentDayProgress&&e.currentDayProgress.date===t?e.currentDayProgress:{date:t,completedLevels:[],currentLevel:1,levelResults:[]}}function He(e,t){const s=K(e),a=[...s.completedLevels,t.level],n=[...s.levelResults,t],o=Math.min(t.level+1,5),i={...e,currentDayProgress:{date:s.date,completedLevels:a,currentLevel:o,levelResults:n}};return X(i),i}function qe(e){const t=K(e),s=R(),n=!e.history.find(d=>d.date===s);let o=e.history,i=e.streak;if(n){const d=t.levelResults.length||1,T=t.levelResults.reduce((m,c)=>m+c.wpm,0),h=t.levelResults.reduce((m,c)=>m+c.accuracy,0),w={date:t.date,wpm:Math.round(T/d),accuracy:h/d,completed:!0};o=[...e.history,w],e.streak.lastDate?i=Q(e.streak.lastDate,s)===1?{count:e.streak.count+1,lastDate:s}:{count:1,lastDate:s}:i={count:1,lastDate:s}}const l={...e,history:o,streak:i,currentDayProgress:null};return X(l),l}function Oe(){return`
<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="z-body">
    <rect x="24" y="10" width="32" height="32" fill="#7fa63a" stroke="#3a4d1f" stroke-width="2"/>
    <rect x="30" y="22" width="6" height="6" fill="#ff2e4d"/>
    <rect x="44" y="22" width="6" height="6" fill="#ff2e4d"/>
    <rect x="30" y="34" width="20" height="3" fill="#2a1a1a"/>
    <rect x="32" y="37" width="2" height="3" fill="#ff2e4d"/>
    <rect x="46" y="37" width="2" height="3" fill="#ff2e4d"/>
    <rect x="28" y="42" width="24" height="26" fill="#5a7a2a" stroke="#3a4d1f" stroke-width="2"/>
    <rect x="14" y="44" width="14" height="6" fill="#7fa63a" stroke="#3a4d1f" stroke-width="2"/>
    <rect x="52" y="44" width="14" height="6" fill="#7fa63a" stroke="#3a4d1f" stroke-width="2"/>
    <rect x="30" y="68" width="8" height="18" fill="#3a4d1f"/>
    <rect x="42" y="68" width="8" height="18" fill="#3a4d1f"/>
  </g>
</svg>`}function Ve(){return`
<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g>
    <rect x="24" y="8" width="32" height="30" fill="#e8d9b0" stroke="#3a2f1c" stroke-width="2"/>
    <rect x="30" y="18" width="5" height="5" fill="#0b0d09"/>
    <rect x="45" y="18" width="5" height="5" fill="#0b0d09"/>
    <rect x="32" y="28" width="16" height="3" fill="#c73c3c"/>
    <rect x="18" y="4" width="44" height="10" fill="#3a5a1f" stroke="#1f2f12" stroke-width="2"/>
    <rect x="26" y="38" width="28" height="26" fill="#3a5a1f" stroke="#1f2f12" stroke-width="2"/>
    <rect x="12" y="40" width="18" height="6" fill="#3a5a1f" stroke="#1f2f12" stroke-width="2"/>
    <rect x="50" y="40" width="22" height="6" fill="#2a2a2a" stroke="#0a0a0a" stroke-width="2"/>
    <rect x="70" y="38" width="4" height="10" fill="#c4ff3c"/>
    <rect x="28" y="64" width="9" height="18" fill="#2a3a1a"/>
    <rect x="43" y="64" width="9" height="18" fill="#2a3a1a"/>
  </g>
</svg>`}function Fe(){return`
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M10 17 L2 9 A4 4 0 0 1 10 5 A4 4 0 0 1 18 9 Z" fill="#ff2e4d" stroke="#8a0a1f" stroke-width="1.5"/>
</svg>`}function Ke(){return`
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M10 17 L2 9 A4 4 0 0 1 10 5 A4 4 0 0 1 18 9 Z" fill="none" stroke="#3f4433" stroke-width="1.5"/>
</svg>`}function _e(){return`
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 2 C6 2 3 6 3 11 V14 L5 16 V20 H9 V17 H11 V20 H13 V17 H15 V20 H19 V16 L21 14 V11 C21 6 18 2 12 2 Z" fill="#c4ff3c" stroke="#5a7a0a" stroke-width="1.2"/>
  <rect x="7" y="10" width="3" height="4" fill="#0b0d09"/>
  <rect x="14" y="10" width="3" height="4" fill="#0b0d09"/>
  <rect x="10" y="14" width="4" height="2" fill="#0b0d09"/>
</svg>`}function fe(){return`
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 2 C9 6 6 8 6 13 C6 17 9 21 12 21 C15 21 18 17 18 13 C18 10 15 9 15 6 C14 8 13 9 12 2 Z" fill="#ffb43a" stroke="#c77a10" stroke-width="1.2"/>
  <path d="M12 10 C10.5 12 9 13 9 16 C9 18 10.5 19 12 19 C13.5 19 15 18 15 16 C15 14 13.5 13 12 10 Z" fill="#ff2e4d"/>
</svg>`}const N=3;function Ze(e){const t=document.createElement("div");return t.className="zombie",t.dataset.id=String(e.id),t.dataset.lane=String(e.lane),t.style.setProperty("--progress","0"),t.innerHTML=`
    <div class="zombie-art">
      ${Oe()}
      <div class="zombie-timer-ring"><div class="timer-fill"></div></div>
    </div>
    <div class="zombie-word">
      <span class="typed"></span><span class="rest">${e.word}</span>
    </div>
  `,t}function ae(e,t){const s=[];for(let a=0;a<N;a++)s.push(`<span class="heart ${a<t?"full":"empty"}">${a<t?Fe():Ke()}</span>`);e.innerHTML=s.join("")}function Ue(e,t,s,a){e.innerHTML=`
    <main class="game-screen">
      <div class="scanlines"></div>
      <header class="game-topbar">
        <div class="topbar-section">
          <div class="topbar-label mono-caps">уровень</div>
          <div class="topbar-value"><span class="level-num">${t.number}</span>/5</div>
        </div>
        <div class="topbar-section">
          <div class="topbar-label mono-caps">зомби</div>
          <div class="topbar-value"><span class="progress-kills">0</span>/<span class="progress-total">${t.zombieCount}</span></div>
        </div>
        <div class="topbar-section">
          <div class="topbar-label mono-caps">жизни</div>
          <div class="topbar-value topbar-lives" aria-label="lives"></div>
        </div>
      </header>

      <div class="game-field">
        <div class="field-lanes" id="lanes"></div>
        <div class="field-player">${Ve()}</div>
        <div class="field-screen-flash"></div>
      </div>

      <div class="game-hint mono-caps">// печатай слово под зомби · Backspace — стереть</div>
    </main>
  `;const n=e.querySelector("#lanes"),o=e.querySelector(".topbar-lives"),i=e.querySelector(".progress-kills"),l=e.querySelector(".field-screen-flash");ae(o,N);const d=new Map;let T=N;function h(c){for(const g of c.zombies){let v=d.get(g.id);if(!v&&g.status==="alive"&&(v=Ze(g),n.appendChild(v),d.set(g.id,v)),!!v&&g.status==="alive"){const y=(c.virtualNow-g.spawnTime)/1e3,$=Math.min(1,Math.max(0,y/g.timerDuration));v.style.setProperty("--progress",$.toFixed(4));const L=c.input.targetId===g.id;v.classList.toggle("targeted",L),v.classList.toggle("urgent",$>.7);const k=L?c.input.buffer.length:0,M=v.querySelector(".typed"),C=v.querySelector(".rest");M&&C&&(M.textContent=g.word.slice(0,k),C.textContent=g.word.slice(k))}}c.lives!==T&&(ae(o,c.lives),c.lives<T&&(l.classList.remove("flash"),l.offsetWidth,l.classList.add("flash")),T=c.lives),i.textContent=String(c.killedCount)}function w(c,g){const v=d.get(c);v&&(v.classList.add(g),d.delete(c),window.setTimeout(()=>v.remove(),500))}const m=Re({level:t,language:s,onFrame:h,onZombieKilled:c=>w(c.id,"killed"),onZombieEscaped:c=>w(c.id,"biting"),onFinish:a.onFinish});return()=>m.stop()}function We(e){const[,t,s]=e.split("-");return`${s}.${t}`}function Ge(e,t,s){const a=ee(t),n=Pe(t),o=t.language;return e.innerHTML=`
    <main class="menu-screen">
      <div class="scanlines"></div>
      <header class="menu-top">
        <a href="/" class="logo" title="на лендинг">ZOMBIE_TYPING<span class="cursor"></span></a>
        <div class="menu-top-right">
          <div class="lang-switch" role="group" aria-label="язык слов">
            <button class="lang-btn ${o==="ru"?"active":""}" data-lang="ru" aria-pressed="${o==="ru"}">RU</button>
            <button class="lang-btn ${o==="en"?"active":""}" data-lang="en" aria-pressed="${o==="en"}">EN</button>
          </div>
          <div class="menu-date">// день ${We(R())}</div>
        </div>
      </header>

      <section class="menu-center">
        <div class="menu-streak" aria-live="polite">
          <div class="streak-icon">${fe()}</div>
          <div class="streak-meta">
            <div class="streak-count">${a}</div>
            <div class="streak-label">${a===1?"день подряд":"дней подряд"}</div>
          </div>
        </div>

        <h1 class="menu-title">
          отстреливай зомби<br/>одной клавиатурой
        </h1>

        <div class="menu-cta-wrap">
          ${n?'<div class="menu-badge mono-caps">✓ день уже пройден — можешь сыграть ещё</div>':""}
          <button class="cta-primary" id="play-btn">
            <span class="arrow">▶</span>
            <span>${n?"сыграть ещё":"играть"}</span>
            <span class="arrow">→</span>
          </button>
          <div class="menu-hint mono-caps">5 уровней · 3 жизни · слова на ${o==="ru"?"русском":"английском"}</div>
        </div>
      </section>

      <footer class="menu-foot mono-caps">
        <span>v0.1 MVP</span>
        <span>${n?"день в истории":"5 уровней впереди"}</span>
      </footer>
    </main>
  `,e.querySelector("#play-btn")?.addEventListener("click",s.onPlay),e.querySelectorAll(".lang-btn").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.lang;(d==="ru"||d==="en")&&s.onLanguageChange(d)})}),()=>{}}function pe(e){const[,t,s]=e.split("-");return`${s}.${t}`}function U(e,t,s,a,n,o,i){e.strokeStyle="#3f4433",e.lineWidth=2,e.strokeRect(t,s,a,n),e.fillStyle="#c4ff3c",e.textAlign="center",e.font='64px "Rubik Mono One", "Bungee", sans-serif',e.textBaseline="middle",e.fillText(o,t+a/2,s+n*.42),e.fillStyle="#8a8d7a",e.font='600 18px "IBM Plex Mono", monospace',e.fillText(i.toUpperCase(),t+a/2,s+n*.78)}async function Ne(e){if(document.fonts&&document.fonts.ready)try{await document.fonts.ready}catch{}const t=1080,s=1080,a=document.createElement("canvas");a.width=t,a.height=s;const n=a.getContext("2d");if(!n)throw new Error("Canvas 2D not supported");n.fillStyle="#0b0d09",n.fillRect(0,0,t,s);const o=n.createRadialGradient(t*.25,s*.28,0,t*.25,s*.28,t*.85);o.addColorStop(0,"rgba(196,255,60,0.14)"),o.addColorStop(1,"rgba(196,255,60,0)"),n.fillStyle=o,n.fillRect(0,0,t,s);const i=n.createRadialGradient(t*.85,s*.85,0,t*.85,s*.85,t*.7);i.addColorStop(0,"rgba(255,46,77,0.1)"),i.addColorStop(1,"rgba(255,46,77,0)"),n.fillStyle=i,n.fillRect(0,0,t,s),n.fillStyle="rgba(255,255,255,0.02)";for(let y=0;y<s;y+=4)n.fillRect(0,y,t,1);n.strokeStyle="#3f4433",n.lineWidth=3,n.strokeRect(40,40,t-80,s-80),n.textAlign="left",n.textBaseline="alphabetic",n.fillStyle="#c4ff3c",n.font='56px "Rubik Mono One", "Bungee", sans-serif',n.fillText("ZOMBIE_TYPING",100,140),n.fillStyle="#8a8d7a",n.font='600 24px "IBM Plex Mono", monospace',n.fillText("// день "+pe(e.date),100,185),n.textAlign="right",n.fillStyle="#c4ff3c",n.font='600 24px "IBM Plex Mono", monospace',n.fillText("✓ DAY COMPLETED",t-100,140),n.fillStyle="#8a8d7a",n.font='20px "IBM Plex Mono", monospace',n.fillText(e.siteHost,t-100,185),n.textAlign="center",n.textBaseline="middle",n.fillStyle="#c4ff3c",n.shadowColor="rgba(196,255,60,0.4)",n.shadowBlur=40,n.font='220px "Rubik Mono One", "Bungee", sans-serif',n.fillText(String(e.wpm),t/2,380),n.shadowBlur=0,n.fillStyle="#eae5d6",n.font='600 30px "IBM Plex Mono", monospace',n.fillText("СЛОВ В МИНУТУ",t/2,510);const l=280,d=24,T=l*3+d*2,h=(t-T)/2,w=580,m=130;U(n,h,w,l,m,`${Math.round(e.accuracy*100)}%`,"точность"),U(n,h+l+d,w,l,m,`🔥 ${e.streak}`,e.streak===1?"день подряд":"дней подряд"),U(n,h+(l+d)*2,w,l,m,String(e.zombiesKilled),"зомби убито");const c=770,g=38,v=Math.max(1,...e.levelResults.map(y=>y.wpm));return n.textBaseline="alphabetic",e.levelResults.forEach((y,$)=>{const L=c+$*g;n.textAlign="left",n.fillStyle="#7a7a70",n.font='600 20px "IBM Plex Mono", monospace',n.fillText(`ур. ${y.level}`,110,L+20);const k=210,M=t-k-260,C=y.wpm/v*M;n.fillStyle="#2a2e22",n.fillRect(k,L+4,M,20),n.fillStyle="#c4ff3c",n.fillRect(k,L+4,C,20),n.textAlign="right",n.fillStyle="#eae5d6",n.font='600 20px "IBM Plex Mono", monospace',n.fillText(`${y.wpm} слов/мин`,t-110,L+20)}),n.textAlign="center",n.fillStyle="#5a5d4d",n.font='20px "IBM Plex Mono", monospace',n.fillText("// зомби-тайпинг · тренажёр скорости печати",t/2,s-70),await new Promise((y,$)=>{a.toBlob(L=>L?y(L):$(new Error("Blob render failed")),"image/png")})}function ie(e){const t=Math.max(1,...e.levelResults.map(n=>n.wpm)),s=e.levelResults.map(n=>{const o=Math.max(1,Math.round(n.wpm/t*10));return`ур.${n.level} ${"█".repeat(o)}${"░".repeat(Math.max(0,10-o))} ${n.wpm}`}).join(`
`),a=e.streak===1?"день":"дней";return`🧟 Zombie Typing · ${pe(e.date)}
⚡ ${e.wpm} слов/мин · 🎯 ${Math.round(e.accuracy*100)}% · 🔥 ${e.streak} ${a}

${s}

https://${e.siteHost}/`}function je(e,t,s,a){const n=t+1;e.innerHTML=`
    <main class="transition-screen win">
      <div class="scanlines"></div>
      <div class="transition-card">
        <div class="trans-eyebrow mono-caps">// уровень ${t} пройден</div>
        <h1 class="trans-title"><span class="accent-toxic">чисто.</span></h1>
        <div class="trans-stats">
          <div class="trans-stat">
            <div class="stat-value">${s.wpm}</div>
            <div class="stat-label mono-caps">слов/мин</div>
          </div>
          <div class="trans-stat">
            <div class="stat-value">${Math.round(s.accuracy*100)}%</div>
            <div class="stat-label mono-caps">точность</div>
          </div>
          <div class="trans-stat">
            <div class="stat-value">${s.zombiesKilled}/${s.zombiesTotal}</div>
            <div class="stat-label mono-caps">зомби</div>
          </div>
        </div>
        <div class="trans-next">
          впереди — уровень <b>${n}/${ce}</b>, таймеры ужмутся.
        </div>
        <button class="cta-primary" id="trans-continue">
          <span class="arrow">▶</span>
          <span>уровень ${n}</span>
          <span class="arrow">→</span>
        </button>
        <div class="trans-hint mono-caps">жизни восстановлены · enter / space / клик</div>
      </div>
    </main>
  `;const o=e.querySelector("#trans-continue");o?.focus(),o?.addEventListener("click",a);const i=l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),a())};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)}function Ye(e,t,s,a){e.innerHTML=`
    <main class="transition-screen lose">
      <div class="scanlines"></div>
      <div class="transition-card">
        <div class="trans-eyebrow mono-caps">// уровень ${t} — зомби одолели</div>
        <div class="big-skull">${_e()}</div>
        <h1 class="trans-title">попробуй <span class="accent-blood">снова.</span></h1>
        <p class="trans-body">
          успел убить <b>${s.zombiesKilled}/${s.zombiesTotal}</b> — неплохо.
          следующий раз — допечатай быстрее.
        </p>
        <div class="trans-actions">
          <button class="cta-primary" id="retry-btn">
            <span class="arrow">↻</span>
            <span>уровень ${t} заново</span>
          </button>
          <button class="cta-secondary" id="menu-btn">
            <span>на главный</span>
          </button>
        </div>
        <div class="trans-hint mono-caps">enter / space — перезапуск</div>
      </div>
    </main>
  `;const n=e.querySelector("#retry-btn"),o=e.querySelector("#menu-btn");n?.focus(),n?.addEventListener("click",a.onRetry),o?.addEventListener("click",a.onMenu);const i=l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),a.onRetry())};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)}function oe(e,t){const s=URL.createObjectURL(e),a=document.createElement("a");a.href=s,a.download=t,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}function Je(e){const t=navigator;return typeof t.canShare=="function"&&t.canShare({files:e})}function Xe(){return typeof ClipboardItem<"u"&&!!navigator.clipboard&&typeof navigator.clipboard.write=="function"}function F(e,t,s,a=1800){return e.textContent=t,window.setTimeout(()=>{e.innerHTML=s},a)}function Qe(e,t,s,a,n){const o=t.levelResults.length||1,i=Math.round(t.levelResults.reduce((u,r)=>u+r.wpm,0)/o),l=t.levelResults.reduce((u,r)=>u+r.accuracy,0)/o,d=t.levelResults.reduce((u,r)=>u+r.zombiesKilled,0),T={wpm:i,accuracy:l,streak:s,date:t.date,levelResults:t.levelResults.map(u=>({level:u.level,wpm:u.wpm,accuracy:u.accuracy})),zombiesKilled:d,siteHost:window.location.host};e.innerHTML=`
    <main class="transition-screen win day-complete">
      <div class="scanlines"></div>
      <div class="share-card">
        <div class="share-eyebrow mono-caps">// день пройден</div>
        <div class="share-flame">${fe()}</div>
        <h1 class="share-title">ты выжил.</h1>

        <div class="share-preview-wrap">
          <div class="share-preview-skeleton" id="share-skeleton">
            <div class="skeleton-text mono-caps">// рендер карточки...</div>
          </div>
          <img class="share-preview" id="share-preview" alt="твоя карточка результата" style="display:none;" />
        </div>

        <div class="share-stats share-stats-compact">
          <div class="share-stat">
            <div class="share-stat-value">${i}</div>
            <div class="share-stat-label mono-caps">слов / мин</div>
          </div>
          <div class="share-stat">
            <div class="share-stat-value">${Math.round(l*100)}%</div>
            <div class="share-stat-label mono-caps">точность</div>
          </div>
          <div class="share-stat">
            <div class="share-stat-value">${s}</div>
            <div class="share-stat-label mono-caps">${s===1?"день подряд":"дней подряд"}</div>
          </div>
        </div>

        <div class="share-actions-grid">
          <button class="cta-primary share-action" id="share-btn" disabled>
            <span class="share-icon">▲</span>
            <span>поделиться</span>
          </button>
          <button class="cta-secondary share-action" id="download-btn" disabled>
            <span class="share-icon">⬇</span>
            <span>скачать PNG</span>
          </button>
          <button class="cta-secondary share-action" id="copy-text-btn">
            <span class="share-icon">📋</span>
            <span>скопировать текст</span>
          </button>
        </div>

        <button class="cta-ghost" id="menu-btn">
          <span>← на главный</span>
        </button>

        <div class="share-hint mono-caps">хочешь — сыграй ещё · серия продолжится завтра</div>
      </div>
    </main>
  `;const h=e.querySelector("#share-btn"),w=e.querySelector("#download-btn"),m=e.querySelector("#copy-text-btn"),c=e.querySelector("#menu-btn"),g=e.querySelector("#share-preview"),v=e.querySelector("#share-skeleton"),y=h.innerHTML,$=w.innerHTML,L=m.innerHTML;let k=null,M=null;const C=[];Ne(T).then(u=>{k=u,M=URL.createObjectURL(u),g.src=M,g.style.display="",v.style.display="none",h.disabled=!1,w.disabled=!1}).catch(u=>{console.error("Share image render failed",u),v.innerHTML='<div class="skeleton-text mono-caps">// не удалось нарисовать карточку</div>'});async function H(){if(!k)return;const u=new File([k],"zombie-typing.png",{type:"image/png"}),r={title:"Zombie Typing",text:ie(T),files:[u]};if(Je([u]))try{await navigator.share(r),n("native");return}catch(f){if(f?.name==="AbortError")return}if(Xe())try{await navigator.clipboard.write([new ClipboardItem({"image/png":k})]),C.push(F(h,"✓ картинка скопирована",y)),n("copy_image");return}catch{}oe(k,"zombie-typing.png"),C.push(F(h,"✓ скачано",y)),n("download")}function q(){k&&(oe(k,"zombie-typing.png"),C.push(F(w,"✓ скачано",$)),n("download"))}async function A(){try{await navigator.clipboard.writeText(ie(T)),C.push(F(m,"✓ скопировано",L)),n("copy_text")}catch{m.textContent="не удалось скопировать"}}return h.addEventListener("click",H),w.addEventListener("click",q),m.addEventListener("click",A),c.addEventListener("click",a),()=>{for(const u of C)clearTimeout(u);M&&URL.revokeObjectURL(M)}}let j,x,W=null;function D(e){W&&W(),j.innerHTML="",W=e(j)}function P(){D(e=>Ge(e,x,{onPlay:tt,onLanguageChange:et}))}function et(e){const t=x.language;x=Ie(x,e),x.language!==t&&P()}function tt(){const e=K(x);Y(e.currentLevel)}function Y(e){const t=le.find(s=>s.number===e);if(!t){P();return}B({type:"level_start",level:e,date:R()}),D(s=>Ue(s,t,x.language,{onFinish:a=>nt(e,a)}))}function nt(e,t){if(t.status==="lost"){B({type:"level_fail",level:e,zombiesKilledBeforeFail:t.zombiesKilled}),D(s=>Ye(s,e,t,{onRetry:()=>Y(e),onMenu:P}));return}if(B({type:"level_complete",level:e,wpm:t.wpm,accuracy:t.accuracy,timeMs:t.timeMs}),x=He(x,{level:e,wpm:t.wpm,accuracy:t.accuracy,zombiesKilled:t.zombiesKilled,zombiesTotal:t.zombiesTotal,timeMs:t.timeMs}),e>=ce){const s=K(x);x=qe(x),z("day_win");const a=ee(x),n=x.history[x.history.length-1];B({type:"day_complete",wpm:n?.wpm??0,accuracy:n?.accuracy??0,streak:a}),D(o=>Qe(o,s,a,P,i=>B({type:"share_click",platform:i})));return}D(s=>je(s,e,t,()=>Y(e+1)))}function st(e){j=e,x=De(ze()),B({type:"session_start",userUuid:x.userUuid,streak:ee(x)}),P()}function at(){const e=document.getElementById("app");if(!e){console.error("No #app root element");return}e.innerHTML=`
    <main class="loading-screen">
      <div class="scanlines"></div>
      <div class="loading-inner">
        <div class="logo">ZOMBIE_TYPING<span class="cursor"></span></div>
        <div class="loading-text mono-caps">// загрузка словаря...</div>
      </div>
    </main>
  `,localStorage.getItem("zt-muted")==="1"&&ke(!0),me().then(()=>st(e)).catch(s=>{console.error("Failed to load dictionary",s),e.innerHTML=`
        <main class="loading-screen">
          <div class="loading-inner">
            <div class="logo" style="color: var(--blood);">ОШИБКА</div>
            <div class="loading-text mono-caps">не удалось загрузить словарь. обнови страницу.</div>
          </div>
        </main>
      `})}at();
