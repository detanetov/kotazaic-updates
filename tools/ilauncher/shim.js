
/* ===== iPhone / iPad: Kotazaic Launcher as a home-screen web app =====
   Games are kept in the phone's storage (IndexedDB) and run inside the launcher page,
   so the account and progress are shared with the launcher. */
(function(){
const SELF=(document.currentScript&&document.currentScript.textContent)||'';
const MEM={},DB_NAME='kzl_files';let db=null;
function idb(){return new Promise(res=>{try{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=()=>res(null)}catch(e){res(null)}})}
function putP(n,t){return new Promise(res=>{try{if(!db)return res(false);const tx=db.transaction('f','readwrite');tx.objectStore('f').put(t,n);tx.oncomplete=()=>res(true);tx.onerror=tx.onabort=()=>res(false)}catch(e){res(false)}})}
function put(n,t){try{if(!db)return;const tx=db.transaction('f','readwrite');tx.objectStore('f').put(t,n)}catch(e){}}
function del(n){try{if(!db)return;db.transaction('f','readwrite').objectStore('f').delete(n)}catch(e){}}
function loadAll(){return new Promise(res=>{try{if(!db)return res();const tx=db.transaction('f','readonly'),st=tx.objectStore('f'),rq=st.openCursor();rq.onsuccess=()=>{const c=rq.result;if(c){MEM[c.key]=c.value;c.continue()}else res()};rq.onerror=()=>res()}catch(e){res()}})}
const okName=n=>/^[A-Za-z0-9_][A-Za-z0-9_.-]{0,60}$/.test(String(n||''));
const urls={};
function gameHtml(n){const t=MEM[n];if(t==null)return null;const inj='<script>try{window.KZAndroid=parent.KZ_IOS_GAME}catch(e){}<\/script>';const i=t.search(/<head[^>]*>/i);return i>=0?t.replace(/<head[^>]*>/i,m=>m+inj):inj+t}
window.KZAndroid={ios:true,
  isLauncher(){return true},
  writeFile(n,t){if(!okName(n)||t==null||n==='launcher.html')return false;MEM[n]=String(t);if(urls[n]){URL.revokeObjectURL(urls[n]);delete urls[n]}put(n,MEM[n]);return true},
  readFile(n){return MEM[n]==null?null:MEM[n]},
  delFile(n){if(!(n in MEM))return false;delete MEM[n];del(n);return true},
  fileSize(n){const t=MEM[n];return t==null?-1:(t.length*1.2|0)},
  fileUrl(n){if(MEM[n]==null)return'';if(!urls[n])urls[n]=URL.createObjectURL(new Blob([gameHtml(n)],{type:'text/html'}));return urls[n]},
  model(){const u=navigator.userAgent;return/iPad/.test(u)?'iPad':/iPhone/.test(u)?'iPhone':'iOS'},
  openUrl(u){try{window.open(u,'_blank')}catch(e){}},
  close(){},exit(){}};
/* the game frame */
window.KZ_IOS_GAME={isLauncher(){return true},model(){return window.KZAndroid.model()},exit(){kzIosClose()},close(){kzIosClose()}};
let fr=null;
window.kzIosOpen=function(g){const u=window.KZAndroid.fileUrl(g.file);if(!u){document.body.style.opacity='';toast('Игра ещё не скачана');return}
  fr=document.createElement('div');fr.id='kzFrame';fr.innerHTML=`<iframe src="${u}" allow="autoplay; fullscreen; clipboard-read; clipboard-write" title="${g.name}"></iframe><button id="kzHome" aria-label="Вернуться в лаунчер">⌂</button>`;document.body.appendChild(fr);document.body.style.opacity='';
  fr.querySelector('#kzHome').onclick=()=>{if(confirm('Вернуться в лаунчер? Прогресс сохранится.'))kzIosClose()}};
window.kzIosClose=function(){if(!fr)return;fr.remove();fr=null;if(window.KZ_IOS_PENDING){location.reload();return}try{if(ST.playing){const d=(Date.now()-ST.playing.t)/1000;if(d>3&&d<6*3600)ST.play[ST.playing.id]=(ST.play[ST.playing.id]||0)+d;delete ST.playing;save()}renderAll()}catch(e){}};
const st=document.createElement('style');st.textContent=`#kzFrame{position:fixed;inset:0;z-index:1000;background:#000}#kzFrame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
#kzHome{position:absolute;left:calc(env(safe-area-inset-left) + 8px);top:calc(env(safe-area-inset-top) + 8px);width:38px;height:38px;border-radius:50%;border:2px solid rgba(255,255,255,.55);background:rgba(10,8,30,.45);color:#fff;font-size:20px;line-height:1;z-index:2;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:.75}
#kzHome:active{transform:scale(.92)}`;document.head.appendChild(st);
/* first visit in Safari: show how to put the launcher on the home screen */
function hint(){const sa=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;if(sa||localStorage.getItem('kzl_ioshint'))return;const d=document.createElement('div');d.id='kzIosHint';
  d.innerHTML=`<div><b>📲 Добавь лаунчер на экран «Домой»</b><span>Нажми <b>Поделиться</b> <span style="font-size:18px">⎙</span> внизу Safari → <b>«На экран Домой»</b>. Лаунчер откроется как приложение, во весь экран.</span><button>Понятно</button></div>`;
  d.querySelector('button').onclick=()=>{try{localStorage.setItem('kzl_ioshint','1')}catch(e){}d.remove()};document.body.appendChild(d)}
const st2=document.createElement('style');st2.textContent=`#kzIosHint{position:fixed;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom) + 96px);z-index:50;display:flex;justify-content:center}#kzIosHint>div{max-width:520px;background:var(--card,#231f4d);color:var(--tx,#fff);border:2px solid var(--line,rgba(255,255,255,.15));border-radius:18px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.45);display:flex;flex-direction:column;gap:6px;font-size:14px}#kzIosHint button{align-self:flex-end;border:0;border-radius:12px;padding:8px 14px;font:inherit;font-weight:900;background:#ffcf33;color:#0d0a1f}`;document.head.appendChild(st2);
/* ---- auto-updates: the iPhone launcher follows the phone launcher (mlauncher.html) from the repo ---- */
const UIKEY='__ui__';
const HEAD='<title>Kotazaic Launcher</title>\n<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Kotazaic"><meta name="theme-color" content="#12102a"><link rel="apple-touch-icon" href="ilauncher-icon.png"><link rel="manifest" href="ilauncher.webmanifest">';
function rep1(t,a,b){const i=t.indexOf(a);if(i<0||t.indexOf(a,i+1)>=0)return null;return t.slice(0,i)+b+t.slice(i+a.length)}
function iosBuild(t){if(!SELF||!t||t.length<5000)return null;
  let h=rep1(t,'<title>Kotazaic Launcher</title>',HEAD);if(!h)return null;
  const h2=rep1(h,"setTimeout(()=>location.href=furl(g.file),120)}","setTimeout(()=>kzIosOpen(g),120)}");if(h2)h=h2;
  const i=h.lastIndexOf('<script>'),b=h.lastIndexOf('</body>');if(i<0||b<i)return null;
  h=h.slice(0,i)+'<script type="text/kz-main" id="kzmain">'+h.slice(i+8);
  const b2=h.lastIndexOf('</body>');return h.slice(0,b2)+'<script>'+SELF+'<\/script>\n'+h.slice(b2)}
/* new games: anything published to version.json with an .html file shows up in the library */
const SKIP={mlauncher:1,ilauncher:1,pcext:1,exe:1,launcher:1};
function cover(ic,a,b){return'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="220" fill="url(#g)"/><text x="200" y="140" font-size="110" text-anchor="middle">${ic}</text></svg>`)}
function discover(){let add=0;try{if(!INFO||typeof GAMES==='undefined')return 0;
  for(const k in INFO){const o=INFO[k];if(!o||typeof o!=='object'||SKIP[k]||!o.file||!/\.html$/i.test(o.file))continue;
   if(GAMES.some(g=>g.key===k||g.file===o.file))continue;
   const nm=String(o.title||o.name||k),c=nm.indexOf(':');const name=(c>0?nm.slice(0,c):nm).replace(/\s+v?\d+(\.\d+)*\s*$/,'').trim()||k;
   const ic=o.icon||(/ленив/i.test(nm)?'🦥':'🎮');GAMES.push({id:k,sec:/ленив/i.test(nm)?'l':'k',key:k,file:o.file,name,desc:o.desc||(c>0?nm.slice(c+1).trim():'Новая игра'),ic,auto:1});
   try{if(!COVERS[k])COVERS[k]=cover(ic,'#6a4cff','#ff6fa8')}catch(e){}add++}}catch(e){}return add}
function patchMain(){
  try{const _gi=window.getInfo;if(typeof _gi==='function')window.getInfo=async function(){const r=await _gi.apply(this,arguments);if(discover())try{renderAll()}catch(e){}return r}}catch(e){}
  /* launcher update on iPhone: rebuild the iPhone version from the new mlauncher.html, keep it on the phone, reload */
  window.selfUpdate=async function(){try{const m=INFO&&INFO.mlauncher;if(!m||!(m.version>ML_VER)||!m.file)return false;
    const b=await download(BASE+m.file);if(m.sha256&&(await sha256(b))!==m.sha256)return false;
    const h=iosBuild(new TextDecoder('utf-8').decode(b));if(!h)return false;const rec=JSON.stringify({v:m.version,h});
    if(!(await putP(UIKEY,rec)))return false;MEM[UIKEY]=rec;
    if(fr){toast('🚀 Лаунчер обновится, когда выйдешь из игры');window.KZ_IOS_PENDING=1;return false}
    lsSet('kzl_justupd',m.label||String(m.version));location.reload();return true}catch(e){return false}};
  let seen=null;const chk=()=>{try{if(INFO&&INFO!==seen){seen=INFO;if(discover())renderAll()}}catch(e){}};chk();setInterval(chk,800)}
(async()=>{db=await idb();await loadAll();
  const src=document.getElementById('kzmain').textContent,myV=+((src.match(/ML_VER=(\d+)/)||[])[1]||0);
  if(!window.KZ_IOS_CACHED&&MEM[UIKEY]){try{const o=JSON.parse(MEM[UIKEY]);if(o&&o.v>myV&&o.h){window.KZ_IOS_CACHED=1;document.open();document.write(o.h);document.close();return}}catch(e){}}
  const s=document.createElement('script');s.textContent=src;document.body.appendChild(s);patchMain();
  setTimeout(hint,1800)})();
})();
