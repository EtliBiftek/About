const lang="tr";
document.documentElement.lang="tr";
const spotlight=document.getElementById('spotlight');addEventListener('mousemove',e=>{spotlight.style.left=e.clientX+'px';spotlight.style.top=e.clientY+'px';spotlight.style.opacity=1});addEventListener('mouseleave',()=>spotlight.style.opacity=0);
document.querySelectorAll('.social-card').forEach(card=>card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',(e.clientX-r.left)+'px');card.style.setProperty('--my',(e.clientY-r.top)+'px')}));

// Kaydirma calisirken tum ana/panel scrollbarlarini gizle.
const hiddenScrollbarStyle=document.createElement('style');
hiddenScrollbarStyle.textContent=`
html,body,.overlay,.native-panel,.ataturk-panel,.reaction{scrollbar-width:none;-ms-overflow-style:none}
html::-webkit-scrollbar,body::-webkit-scrollbar,.overlay::-webkit-scrollbar,.native-panel::-webkit-scrollbar,.ataturk-panel::-webkit-scrollbar,.reaction::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
`;
document.head.appendChild(hiddenScrollbarStyle);

const overlay=document.getElementById('overlay'),backdrop=document.getElementById('backdrop'),frame=document.getElementById('frame'),panel=document.getElementById('reactionPanel'),ataturkPanel=document.getElementById('ataturkPanel'),cs2Panel=document.getElementById('cs2Panel'),pcPanel=document.getElementById('pcPanel');function hidePanels(){panel.classList.remove('show');ataturkPanel.classList.remove('show');cs2Panel.classList.remove('show');pcPanel.classList.remove('show');frame.style.display='none';frame.src=''}function showNativePanel(id){hidePanels();const el=document.getElementById(id);if(el){el.classList.add('show');el.style.height='auto';el.style.minHeight='100%';el.style.overflow='visible'}overlay.style.overflowY='auto';overlay.style.overflowX='hidden';overlay.style.webkitOverflowScrolling='touch';overlay.scrollTop=0;overlay.classList.add('open');backdrop.classList.add('open');document.body.style.overflow='hidden'}function closeOverlay(){overlay.classList.remove('open');backdrop.classList.remove('open');document.body.style.overflow='';setTimeout(()=>{overlay.scrollTop=0;hidePanels()},220)}document.querySelectorAll('.native-open').forEach(el=>el.addEventListener('click',()=>showNativePanel(el.dataset.panel)));
const ataturkLink=document.getElementById('ataturkLink');ataturkLink.onclick=e=>{e.preventDefault();showNativePanel('ataturkPanel')};document.getElementById('closeBtn').onclick=closeOverlay;backdrop.onclick=closeOverlay;addEventListener('keydown',e=>{if(e.key==='Escape')closeOverlay()});
const reactionLink=document.getElementById('reactionLink'),area=document.getElementById('reactionArea'),start=document.getElementById('reactionStart'),stats=document.getElementById('reactionStats');let round=0,times=[],readyAt=0,timer=null,state='idle';reactionLink.onclick=e=>{e.preventDefault();showNativePanel('reactionPanel')};function nextRound(){state='wait';area.className='reaction-area wait';area.textContent='Bekle...';timer=setTimeout(()=>{state='ready';readyAt=performance.now();area.className='reaction-area ready';area.textContent='ŞİMDİ!'},900+Math.random()*1800)}start.onclick=()=>{clearTimeout(timer);round=0;times=[];stats.textContent='0 / 5 · —';nextRound()};area.onclick=()=>{if(state==='wait'){clearTimeout(timer);area.textContent='Çok erken! Yeniden bekle...';setTimeout(nextRound,700);return}if(state!=='ready')return;times.push(Math.round(performance.now()-readyAt));round++;const avg=Math.round(times.reduce((a,b)=>a+b,0)/times.length);stats.textContent=`${round} / 5 · ${avg} ms`;state='idle';area.className='reaction-area';if(round>=5){area.textContent='Ortalama: '+avg+' ms'}else{area.textContent='Tur '+round+'/5';setTimeout(nextRound,700)}};
const email=document.getElementById('emailPill'),toast=document.getElementById('toast');email.onclick=e=>{e.preventDefault();navigator.clipboard?.writeText('official.pifo@gmail.com');toast.textContent='Kopyalandı';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1400)};

const copyCrosshairInline=document.getElementById('copyCrosshairInline');
if(copyCrosshairInline){
  copyCrosshairInline.onclick=async()=>{
    const code=document.getElementById('crosshairCodeInline').textContent.trim();
    try{await navigator.clipboard.writeText(code);copyCrosshairInline.textContent='Kopyalandı';setTimeout(()=>copyCrosshairInline.textContent='Kodu kopyala',1400)}
    catch(_){copyCrosshairInline.textContent='Kopyalanamadı'}
  };
}
