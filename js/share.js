/* Ссылка с результатом: ответы сжимаются lz-string и кладутся в адрес после #r=
   Часть после # браузер не отправляет на сервер. */
const SHARE_VER=1;
const MSG_LIMIT=4000; // Telegram не пропускает сообщения длиннее 4096 знаков

function packState(){
  const r={};SPHERES.forEach(s=>{const x=S.ratings[s.id];if(x)r[s.id]=[x.imp,x.act,(x.skip?1:0)|(x.ti?2:0)|(x.ta?4:0)]});
  const p=S.prev?{}:null;if(p)SPHERES.forEach(s=>{const x=S.prev[s.id];if(x)p[s.id]=[x.act,x.skip?1:0]});
  const v={},st={};S.chosen.forEach(id=>{const a=S.values[id]||{},b=S.steps[id]||{};
    v[id]=[a.who||'',a.deeds||'',a.memory||''];st[id]=[b.what||'',b.when||'',b.barriers||'']});
  return {v:SHARE_VER,d:S.date,r,c:S.chosen,val:v,st,p};
}
function unpackState(o){
  if(!o||o.v!==SHARE_VER||!o.r)throw new Error('format');
  const ids=new Set(SPHERES.map(s=>s.id)),str=x=>typeof x==='string'?x.slice(0,4000):'',num=x=>Math.max(0,Math.min(10,+x|0));
  const s=blank();s.step='result';s.date=typeof o.d==='string'?o.d:null;
  for(const k in o.r){if(!ids.has(k))continue;const[i,a,f]=o.r[k];s.ratings[k]={imp:num(i),act:num(a),skip:!!(f&1),ti:!!(f&2),ta:!!(f&4)}}
  s.chosen=(Array.isArray(o.c)?o.c:[]).filter(k=>ids.has(k)).slice(0,3);
  s.chosen.forEach(k=>{const a=(o.val||{})[k]||[],b=(o.st||{})[k]||[];
    s.values[k]={who:str(a[0]),deeds:str(a[1]),memory:str(a[2])};s.steps[k]={what:str(b[0]),when:str(b[1]),barriers:str(b[2])}});
  if(o.p){s.prev={};for(const k in o.p){if(!ids.has(k))continue;const[a,f]=o.p[k];s.prev[k]={act:num(a),skip:!!f}}}
  return s;
}
function resultURL(){
  const code=LZString.compressToEncodedURIComponent(JSON.stringify(packState()));
  return location.origin+location.pathname+'#r='+code;
}
function shareLink(){
  const url=resultURL();
  const long=url.length>MSG_LIMIT;
  const done=()=>toast(long?'Ссылка скопирована. Она длинная: если мессенджер её обрежет, отправьте картинку':'Ссылка скопирована — вставьте её в чат с психологом');
  // на телефоне — системное меню «Поделиться», на компьютере — копирование
  if(navigator.share&&matchMedia('(pointer:coarse)').matches){
    navigator.share({title:'Компас ценностей',url}).catch(err=>{if(err&&err.name!=='AbortError')copyText(url,'Ссылка скопирована',()=>prompt('Скопируйте ссылку',url))});
    return}
  copyText(url,'',()=>prompt('Скопируйте ссылку',url));done();
}

/* запуск: #r=… открывает результат только для просмотра, #example — пример */
(function start(){
  const h=location.hash;
  if(h.startsWith('#r=')){
    try{const json=LZString.decompressFromEncodedURIComponent(h.slice(3));S=unpackState(JSON.parse(json));VIEW=true;document.title='Результат клиента — Компас ценностей'}
    catch(e){S=load();render();toast('Ссылка повреждена или обрезана. Попросите клиента прислать её ещё раз');return}
    render();return}
  if(h==='#example'){fillExample();S.step='result';VIEW=false;history.replaceState(null,'',location.pathname);render();return}
  render();
})();
window.addEventListener('hashchange',()=>location.reload());
