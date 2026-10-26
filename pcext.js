/* Kotazaic Launcher (ПК): дополнения из автообновлений — «Котозайцы в космосе» */
(function(){
if(window.__kzSpace)return;window.__kzSpace=1;
const st=document.createElement('style');st.textContent=`
.sphero{min-height:250px;margin-top:22px;background:linear-gradient(160deg,#3a2a8a,#120c35 80%);overflow:hidden}
.sphero .spbg{position:absolute;inset:0;width:100%;height:100%}
.sphero .in{align-items:center}.sphero .in>div:first-child{display:flex;align-items:center;gap:12px}
.splogo{font:900 44px/.92 "Nunito KZ","Segoe UI",system-ui,sans-serif;letter-spacing:-1px;background:linear-gradient(135deg,#ffd34d,#ff9be0 50%,#9fe8ff);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 18px rgba(159,232,255,.35))}
.splogo span{display:block;font-size:.62em}
#spOv{position:fixed;inset:0;z-index:30;display:none;background:#0b0820}#spOv iframe{width:100%;height:100%;border:0;display:block}`;
document.head.appendChild(st);
const SP={v:+lsGet('kz_upd_space_v')||0,label:lsGet('kz_upd_space_l')||'',html:null,busy:false,latest:0,latestL:''};
window.SP=SP;
async function spCache(){try{return window.caches?await caches.open('space'):null}catch(e){return null}}
async function spLoad(){if(!SP.v)return;try{const c=await spCache(),r=c&&await c.match('/space.html');if(r)SP.html=await r.text();else SP.v=0}catch(e){SP.v=0}}
async function spCheck(manual){if(SP.busy)return;SP.busy=true;spSoft();
 try{const b=await koBase(),j=await (await fetch(b+'version.json?t='+Date.now(),{cache:'no-store'})).json(),k=j.space;if(!k)throw 0;SP.latest=k.version;SP.latestL=k.label||'';
  if(k.version>SP.v||!SP.html){const buf=await (await fetch(b+(k.file||'space.html')+'?t='+Date.now(),{cache:'no-store'})).arrayBuffer();
   if(k.sha256&&window.crypto&&crypto.subtle){const h=[...new Uint8Array(await crypto.subtle.digest('SHA-256',buf))].map(x=>x.toString(16).padStart(2,'0')).join('');if(h!==k.sha256)throw 1}
   const t=new TextDecoder().decode(buf),c=await spCache();if(c)try{await c.put('/space.html',new Response(t,{headers:{'Content-Type':'text/html'}}))}catch(e){}
   const was=SP.v;SP.html=t;SP.v=k.version;SP.label=SP.latestL;lsSet('kz_upd_space_v',SP.v);lsSet('kz_upd_space_l',SP.label);toast(was?'✨ «Котозайцы в космосе» обновились до '+SP.label:'✓ «Котозайцы в космосе» установлены')}
  else if(manual)toast('✓ У тебя последняя версия «Котозайцев в космосе»')}
 catch(e){if(manual||!SP.html)toast(e===1?'⚠ Файл игры повреждён — попробуй ещё раз':'Нет связи с сервером обновлений «Котозайцев в космосе»')}
 SP.busy=false;spSoft();if(manual&&page==='set')renderSet()}
function spStat(){try{return JSON.parse(lsGet('kz_space'))||{}}catch(e){return{}}}
function spMeta(){const s=spStat();return `<b style="font-size:18px">Котозайцы в космосе</b><small>Лети через 5 галактик домой: собирай кристаллы-топливо, сбивай космопсов, побеждай боссов</small><small>${SP.html?'Версия '+esc(SP.label||SP.v):'Не установлена'}${SP.latest>SP.v?' · есть обновление':''}${s.sector!=null&&SP.html?' · 🗺 '+(s.won?'дома! 🏠':'сектор '+Math.min(25,(s.sector|0)+1)+'/25')+' · ⭐ '+(s.stars|0)+' · 💎 '+(s.crystals|0)+(s.best?' · ♾ '+s.best:''):''}</small>`}
function spBtns(){return SP.busy?`<button class="btn big" disabled>⏳ ${SP.html?'Обновляю…':'Скачиваю…'}</button>`:SP.html?'<button class="btn big mint" data-a="spplay">▶ Играть</button><button class="btn ghost" data-a="spcheck" title="Проверить обновления">🔄</button>':'<button class="btn big mint" data-a="spcheck">⬇ Установить</button>'}
function spSoft(){const b=document.getElementById('spBtns'),m=document.getElementById('spMeta');if(b)b.innerHTML=spBtns();if(m)m.innerHTML=spMeta()}
const SP_BG=`<svg class="spbg" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice"><circle cx="330" cy="40" r="46" fill="#ff8a3d" opacity=".35"/><ellipse cx="330" cy="40" rx="78" ry="12" fill="none" stroke="#ffb36b" stroke-width="3" opacity=".45" transform="rotate(-14 330 40)"/><g fill="#fff">${Array.from({length:40},(_,i)=>`<circle cx="${(i*97)%400}" cy="${(i*53)%160}" r="${i%5?0.9:1.6}" opacity="${.4+(i%3)*.2}"/>`).join('')}</g><path d="M250 120l8-14 8 14-8 10z" fill="#9fe8ff" opacity=".7"/><path d="M200 30l6-10 6 10-6 7z" fill="#c79bff" opacity=".7"/><path d="M370 120l6-10 6 10-6 7z" fill="#ffd84a" opacity=".7"/></svg>`;
function spIcon(){const c=curUser(),s=SK[c?skinOf(c.a):'grey']||SK.grey;return `<svg viewBox="0 0 120 90" width="104" height="78"><g stroke="#1d1838" stroke-width="3.2" stroke-linejoin="round"><path d="M28 32L12 14 8 16l10 22z" fill="#5ab8ff"/><path d="M28 62L12 80 8 78l10-22z" fill="#5ab8ff"/><path d="M12 47l-14-6v12z" fill="#ffb36b" stroke="none"/><path d="M108 47q-12-18-44-17l-20 4q-10 13 0 26l20 4q32 1 44-17z" fill="#f4f1ff"/><path d="M108 47q-5-9-14-12 4 12 0 24 9-3 14-12z" fill="#ff6fa8"/><circle cx="70" cy="34" r="16" fill="rgba(120,190,255,.45)"/></g>${kz(c?skinOf(c.a):'grey',30).replace('<svg ','<svg x="55" y="19" ')}<circle cx="70" cy="34" r="16" fill="none" stroke="#1d1838" stroke-width="3.2"/></svg>`}
function spHero(){return `<div class="hero sphero" id="spaceg">${SP_BG}<div class="in"><div>${spIcon()}<div class="splogo">Котозайцы<span>в космосе</span></div></div><div class="meta" id="spMeta">${spMeta()}</div><div id="spBtns" class="row">${spBtns()}</div></div></div>`}
function spFixSec(){try{if(typeof LSECS!=='undefined'&&LSECS[0]&&LSECS[0].g<3){LSECS[0].g=3;LSECS[0].d='Kotazaic and Stars, koto.io и Космос'}
 const sec=document.querySelector('.libsec[data-sec-id="k"] .sech small');if(sec)sec.textContent='· 3 игры';
 const bt=document.querySelector('.secbar [data-sec="k"] small');if(bt)bt.textContent=LSECS[0].d+' · 3 игры';
 const sub=document.querySelector('#main p.sub');if(sub&&/их две/.test(sub.textContent))sub.textContent='Твои игры — выбирай 😉 · Enter — играть'}catch(e){}}
{const _rl=renderLib;renderLib=function(soft){const r=_rl.apply(this,arguments);if(soft&&document.getElementById('spaceg'))spSoft();else{const s=document.getElementById('koto')||document.getElementById('libStats');if(s&&!document.getElementById('spaceg'))s.insertAdjacentHTML('afterend',spHero())}spFixSec();return r}}
{const _rs=renderSet;renderSet=function(){_rs.apply(this,arguments);const h=`<h2>Котозайцы в космосе</h2><div class="opt"><div><b>🚀 Котозайцы в космосе</b><small>${SP.html?'Установлена версия '+esc(SP.label||SP.v):'Не установлена'}${SP.latest>SP.v?' · доступно обновление '+esc(SP.latestL):''} · обновляется при запуске лаунчера</small></div><button class="btn ghost" data-a="spcheck">🔄 Проверить обновления</button></div>`;
 const d=[...$('#main').querySelectorAll('h2')].find(x=>(x.dataset.orig||x.textContent)==='Данные');if(d)d.insertAdjacentHTML('beforebegin',h);else $('#main').insertAdjacentHTML('beforeend',h)}}
function spPlay(){if(!SP.html)return;const c=curUser(),cfg={nick:c&&c.u!=='__guest'?c.a.nick:'',skin:SK[c?skinOf(c.a):'grey']||SK.grey,embedded:true};
 let ov=document.getElementById('spOv');if(!ov){ov=document.createElement('div');ov.id='spOv';document.body.appendChild(ov)}ov.innerHTML='<iframe allow="autoplay; fullscreen"></iframe>';const fr=ov.firstChild;
 fr.srcdoc=SP.html.replace('<head>','<head><script>window.SPACE='+JSON.stringify(cfg).replace(/</g,'\\u003c')+'<\/script>');ov.style.display='block';setTimeout(()=>fr.focus(),50);toast('🚀 Запускаю «Котозайцев в космосе»…')}
function spClose(){const ov=document.getElementById('spOv');if(ov){ov.style.display='none';ov.innerHTML=''}try{setTimeout(sync,300)}catch(e){}if(page==='lib')renderLib()}
addEventListener('message',e=>{const ov=document.getElementById('spOv'),fr=ov&&ov.firstChild;if(fr&&e.source===fr.contentWindow&&e.data&&e.data.space==='exit')spClose()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;if(b.dataset.a==='spplay')spPlay();if(b.dataset.a==='spcheck')spCheck(true)});
spLoad().then(()=>{spSoft();setTimeout(()=>{if(!(SP.html&&ST.settings&&ST.settings.autoUpdate===false))spCheck(0)},2600)});
if(page==='lib')renderLib();else if(page==='set')renderSet();
})();
