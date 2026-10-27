/* Компас ценностей: состояние, экраны и навигация */
const SPHERES=[
 {id:'family',name:'Семья',short:'Семья',hint:'Родители, братья и сёстры, другие родственники'},
 {id:'couple',name:'Пара',short:'Пара',hint:'Партнёрство, брак, близкие отношения'},
 {id:'kids',name:'Дети',short:'Дети',hint:'Родительство и воспитание'},
 {id:'friends',name:'Дружба',short:'Дружба',hint:'Друзья, общение, люди рядом'},
 {id:'work',name:'Работа',short:'Работа',hint:'Профессия, коллеги, дело, которым вы заняты'},
 {id:'growth',name:'Учёба и рост',short:'Рост',hint:'Знания, навыки, развитие'},
 {id:'rest',name:'Отдых и радость',short:'Отдых',hint:'Увлечения, игра, удовольствие, творчество'},
 {id:'body',name:'Тело и здоровье',short:'Здоровье',hint:'Сон, еда, движение, забота о себе'},
 {id:'spirit',name:'Смысл и духовность',short:'Смысл',hint:'Вера, практики, связь с чем-то бо́льшим'},
 {id:'world',name:'Мир вокруг',short:'Мир',hint:'Сообщество, природа, искусство, вклад в общее'}
];
/* иконки сфер: линейные, цвет берут из текста */
const ICONS={
 family:'<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>',
 couple:'<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
 kids:'<circle cx="8" cy="6" r="2.5"/><path d="M4 21v-6a4 4 0 0 1 8 0v6"/><circle cx="17" cy="11" r="2"/><path d="M14 21v-4a3 3 0 0 1 6 0v4"/>',
 friends:'<path d="M4 5h11v8H8l-4 3z"/><path d="M15 9h5v8l-3-2h-6v-2"/>',
 work:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 12.5h18"/>',
 growth:'<path d="M12 21v-9"/><path d="M12 12c0-4-3-6.5-7-6.5 0 4 3 6.5 7 6.5z"/><path d="M12 10c0-3.2 2.2-5.5 6-5.5 0 3.2-2.2 5.5-6 5.5z"/>',
 rest:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
 body:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 spirit:'<path d="M12 3c3 4 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 2-6 5-10z"/><path d="M12 18c-1.4 0-2.2-1-2.2-2.3 0-1.5 1-2.6 2.2-4.2 1.2 1.6 2.2 2.7 2.2 4.2 0 1.3-.8 2.3-2.2 2.3z"/>',
 world:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>'
};
const IMG=window.KOMPAS_IMAGES||{spheres:{}};
const ic=(id,cls='ico')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[id]}</svg>`;
const icw=id=>`<span class="icw">${ic(id)}</span>`;
/* крупный знак сферы: иллюстрация из img/, если есть, иначе иконка */
const badge=(id,warm)=>IMG.spheres&&IMG.spheres[id]?`<div class="badge art"><img class="soft-edges" src="${IMG.spheres[id]}" alt="" width="360" height="486"></div>`:`<div class="badge ${warm?'warm':''}">${ic(id,'ico lg')}</div>`;

/* компас для заставки: зелёный безель со шкалой, стороны света, роза ветров, объёмная стрелка */
function compass(){
  const P=(r,deg)=>{const a=deg*Math.PI/180;return[(100+r*Math.sin(a)).toFixed(1),(100-r*Math.cos(a)).toFixed(1)]};
  let ticks='';for(let i=0;i<72;i++){const d=i*5,l=i%18===0?9:i%2===0?6:3.5,[x1,y1]=P(95,d),[x2,y2]=P(95-l,d);
    ticks+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${i%18===0?2:1}"/>`}
  // роза ветров: длинные лучи по сторонам света, короткие между ними; у каждого луча светлая и тёмная половина
  const ray=(deg,len,w,dark,light)=>{const[tx,ty]=P(len,deg),[lx,ly]=P(w,deg-45),[rx,ry]=P(w,deg+45);
    return `<path d="M100 100 L${tx} ${ty} L${lx} ${ly}Z" style="fill:${dark}"/><path d="M100 100 L${tx} ${ty} L${rx} ${ry}Z" style="fill:${light}"/>`};
  let star='';[45,135,225,315].forEach(d=>star+=ray(d,42,8,'color-mix(in srgb,var(--muted) 45%,var(--surface))','var(--line)'));
  [0,90,180,270].forEach(d=>star+=ray(d,60,11,'color-mix(in srgb,var(--accent) 45%,var(--surface))','color-mix(in srgb,var(--accent) 15%,var(--surface))'));
  const letter=(t,deg,col)=>{const[x,y]=P(70,deg);return `<text x="${x}" y="${(+y+6).toFixed(1)}" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="19" font-weight="700" fill="${col}">${t}</text>`};
  return `<svg class="compass" viewBox="0 0 200 200" aria-hidden="true">
  <circle cx="100" cy="100" r="98" fill="var(--accent)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity=".5"/>
  <g stroke="var(--surface)" opacity=".85">${ticks}</g>
  <circle cx="100" cy="100" r="82" fill="var(--surface)"/>
  <circle cx="100" cy="100" r="82" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".35"/>
  <circle cx="100" cy="100" r="56" fill="none" stroke="var(--line)" stroke-width="1"/>
  ${star}
  ${letter('С',0,'var(--warm)')}${letter('В',90,'var(--ink)')}${letter('Ю',180,'var(--ink)')}${letter('З',270,'var(--ink)')}
  <g class="needle">
   <path d="M100 30 L110 100 L100 100Z" style="fill:color-mix(in srgb,var(--warm) 70%,var(--surface))"/><path d="M100 30 L90 100 L100 100Z" fill="var(--warm)"/>
   <path d="M100 170 L110 100 L100 100Z" fill="var(--ink)"/><path d="M100 170 L90 100 L100 100Z" style="fill:color-mix(in srgb,var(--ink) 55%,var(--surface))"/>
  </g>
  <circle cx="100" cy="100" r="8" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="100" cy="100" r="3" fill="var(--accent)"/>
  </svg>`}
function hero(slim){
  if(IMG.hero&&!slim)return `<div class="hero art"><img class="soft-edges" src="${IMG.hero}" alt="" width="2000" height="1333" fetchpriority="high"></div>`;
  return `<div class="hero ${slim?'slim':''}"><div class="halo"></div>${compass()}</div>`}

const QUALITIES=['забота','честность','терпение','любопытство','смелость','надёжность','щедрость','внимательность','юмор','открытость','уважение','справедливость','настойчивость','нежность','игривость','доброта к себе','спокойная твёрдость','благодарность'];
const WHEN=['Сегодня','Завтра','В будни','На выходных'];
const KEY='kompas-v1';
const blank=()=>({step:'intro',ratings:{},chosen:[],values:{},steps:{},prev:null,example:false,date:null});
/* режим просмотра: результат открыт по ссылке психологом, ничего не сохраняем */
let VIEW=false;
let S=load();

function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.ratings)return Object.assign(blank(),s)}catch(e){}return blank()}
function save(){if(VIEW||S.example)return; // пример не затирает ответы клиента
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const R=id=>S.ratings[id]||(S.ratings[id]={imp:5,act:5,ti:false,ta:false,skip:false});
const sp=id=>SPHERES.find(s=>s.id===id);
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rated=id=>{const r=S.ratings[id];return r&&!r.skip&&r.ti&&r.ta};
const fmtDate=(d,long)=>(d?new Date(d):new Date()).toLocaleDateString('ru-RU',long?{day:'numeric',month:'long',year:'numeric'}:undefined);

/* маршрут: intro, map, choose, dir:i, act:i, result */
function route(){const r=['intro','map','choose'];S.chosen.forEach((_,i)=>r.push('dir:'+i,'act:'+i));r.push('result');return r}

/* ---------- роза сфер ----------
   c — цвета; по умолчанию CSS-переменные, для картинки PNG передаются готовые значения.
   labels:false — без подписей (для PNG их рисует canvas) */
const ROSE={C:180,R0:26,RM:124};
function roseAngle(i){return i*2*Math.PI/SPHERES.length}
function rosePt(a,r){return[ROSE.C+r*Math.sin(a),ROSE.C-r*Math.cos(a)]}
function roseSVG(opts={}){
  const c=Object.assign({line:'var(--line)',surface:'var(--surface)',accent:'var(--accent)',warm:'var(--warm)',muted:'var(--muted)'},opts.colors||{});
  const {C,R0,RM}=ROSE,N=SPHERES.length,w=2*Math.PI/N*0.36;
  const rad=v=>R0+(RM-R0)*v/10,pt=rosePt;
  const arc=(a,r)=>{const[x1,y1]=pt(a-w,r),[x2,y2]=pt(a+w,r);return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`};
  const wedge=(a,r)=>{const[x0,y0]=pt(a-w,R0),[x1,y1]=pt(a-w,r),[x2,y2]=pt(a+w,r),[x3,y3]=pt(a+w,R0);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} A${R0} ${R0} 0 0 0 ${x0.toFixed(1)} ${y0.toFixed(1)}Z`};
  let g=`<circle cx="${C}" cy="${C}" r="${rad(10)}" fill="none" stroke="${c.line}"/>`+
        `<circle cx="${C}" cy="${C}" r="${rad(5)}" fill="none" stroke="${c.line}" stroke-dasharray="2 4"/>`+
        `<circle cx="${C}" cy="${C}" r="${R0}" fill="${c.surface}" stroke="${c.line}"/>`;
  SPHERES.forEach((s,i)=>{
    const a=roseAngle(i),r=S.ratings[s.id],on=S.chosen.includes(s.id);
    if(opts.labels!==false){const[lx,ly]=pt(a,RM+22);
      const anchor=Math.abs(Math.sin(a))<0.2?'middle':(Math.sin(a)>0?'start':'end');
      g+=`<text x="${lx.toFixed(1)}" y="${(ly+4).toFixed(1)}" text-anchor="${anchor}" class="${on&&opts.highlight?'lbl-on':''}">${s.short}</text>`}
    if(!r||r.skip){const[x,y]=pt(a,rad(5));g+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="${c.muted}" opacity=".6"/>`;return}
    if(r.ta) g+=`<path d="${wedge(a,rad(r.act))}" fill="${c.warm}" opacity="${opts.highlight&&!on?.3:.85}"/>`;
    const p=S.prev&&S.prev[s.id];
    if(p&&!p.skip) g+=`<path d="${arc(a,rad(p.act))}" fill="none" stroke="${c.muted}" stroke-width="2" stroke-dasharray="3 3"/>`;
    if(r.ti) g+=`<path d="${arc(a,rad(r.imp))}" fill="none" stroke="${c.accent}" stroke-width="4" stroke-linecap="round" opacity="${opts.highlight&&!on?.35:1}"/>`;
  });
  // стрелка компаса в центре
  g+=`<path d="M${C} ${C-16} L${C+5} ${C} L${C} ${C+16} L${C-5} ${C}Z" fill="${c.accent}" opacity=".9"/><circle cx="${C}" cy="${C}" r="2.5" fill="${c.surface}"/>`;
  return `<svg class="rose" xmlns="http://www.w3.org/2000/svg" viewBox="-44 -4 448 368" role="img" aria-label="Роза сфер: важность и действия по каждой сфере">${g}</svg>`;
}
function rose(opts={}){
  const leg=`<div class="legend"><span><i style="background:var(--accent)"></i>как важно</span><span><i style="background:var(--warm)"></i>сколько было действий</span>${S.prev?'<span><i style="border:2px dashed var(--muted)"></i>действия в прошлый раз</span>':''}</div>`;
  return roseSVG(opts)+leg}

/* ---------- мягкая проверка формулировок ---------- */
const W='(^|[^а-яё])';
const CHECKS=[
 {re:new RegExp(W+'(долж|надо|нужно|обязан|следует|приходится)','i'),t:'Слышится правило («должна», «надо»). За правилами обычно стоит ценность. Ради чего это для вас важно? Каким человеком вы при этом хотите быть?'},
 {re:new RegExp(W+'(чтобы (меня|мне|он|она|они|нас)|меня (ценил|уважал|любил|понимал|замечал|слушал)|ко мне относ)','i'),t:'Здесь речь о том, как поступают другие, а это не в вашей власти. Что вы сами хотите вносить в эти отношения?'},
 {re:new RegExp(W+'(счастлив|спокойн|не трево|не волнов|не бояться|без страха|уверенн|не грустит|не злит|не чувствовать)','i'),t:'Похоже на желаемое чувство. Чувства приходят и уходят, и управлять ими напрямую не получается. Каким вы хотите быть, даже когда чувствуете разное?'},
 {re:new RegExp(W+'(купить|получить|найти работу|заработать|похудеть|выйти замуж|жениться|поступить|сдать|накопить|достичь|добиться)','i'),t:'Это похоже на цель: её можно достичь и вычеркнуть. Ценность — направление, по которому можно идти всегда. Каким вы хотите быть на пути к этой цели?'}
];
const check=t=>{for(const c of CHECKS)if(c.re.test(t.toLowerCase()))return c.t;return ''};

/* ---------- экраны ---------- */
const app=document.getElementById('app');
function progressBar(){const r=route(),i=r.indexOf(S.step);if(i<1)return '';
  return `<div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${r.length-1}" aria-valuenow="${i}" aria-label="Шаг ${i} из ${r.length-1}">${r.slice(1).map((_,k)=>`<span class="${k<i-1?'done':k===i-1?'now':''}"></span>`).join('')}</div>`}

function vIntro(){
  const has=Object.keys(S.ratings).length>0&&!S.example;
  return `<div class="view stack" style="gap:20px">
  ${hero()}
  <div class="stack"><span class="eyebrow">Упражнение терапии принятия и ответственности</span>
  <h1>Компас ценностей</h1>
  <p>Ценности не пункт назначения, а направление: как стороны света, к ним можно идти всю жизнь. Это упражнение помогает увидеть, какие сферы жизни для вас важны, куда хочется двигаться в каждой и какой маленький шаг можно сделать уже на этой неделе.</p></div>
  <div class="stack"><button class="btn wide" data-go="map">${has?'Продолжить':'Начать'}</button>
   <button class="btn ghost wide" data-act="example">Посмотреть пример</button>
   ${has?'<button class="btn link" data-act="reset-ask" style="align-self:center">Начать заново</button><div id="resetbox"></div>':''}</div>
  <div class="card stack">${demoRose()}</div>
  <div class="stack small muted">
   <p><b style="color:var(--ink)">Займёт 15–20 минут.</b> Правильных ответов нет: пишите своими словами, как думаете и чувствуете.</p>
   <p><b style="color:var(--ink)">Всё остаётся на этом устройстве.</b> Ответы никуда не отправляются; поделиться с психологом можно в конце, если захотите.</p>
   <p>Разговор о ценностях иногда задевает: замечать, где жизнь идёт не так, как хочется, бывает больно. Это нормально и даже говорит о том, что вам это важно. Можно сделать паузу и вернуться позже — ответы сохранятся.</p>
  </div>
  </div>`}

function demoRose(){ // показываем образ розы с примерными данными, не трогая состояние
  const keep={r:S.ratings,c:S.chosen,p:S.prev};
  if(!Object.keys(S.ratings).length){S.ratings=exampleRatings();S.chosen=[];S.prev=null}
  const html=rose()+`<p class="small muted" style="text-align:center">${keep.r&&Object.keys(keep.r).length?'Ваша карта сфер':'Так выглядит карта сфер (пример)'}: зелёная дуга — насколько сфера важна, терракотовый сектор — сколько в ней было действий. Разрыв между ними подсказывает, куда направить внимание.</p>`;
  S.ratings=keep.r;S.chosen=keep.c;S.prev=keep.p;return html}

function vMap(){
  return `<div class="view stack" style="gap:18px">${progressBar()}
  <div class="stack"><span class="eyebrow">Шаг 1 · Карта сфер</span><h2>Что для вас важно и чем вы живёте сейчас</h2>
  <p class="muted">Для каждой сферы отметьте две вещи: насколько она важна для вас в целом и сколько вы на самом деле делали в ней за последнюю неделю. Если сфера сейчас не про вас, её можно пропустить.</p></div>
  ${S.prev?'<div class="hint">Пунктиром на розе показано, сколько действий было в прошлый раз. Можно сравнить.</div>':''}
  <div class="card" id="rosebox">${rose()}</div>
  <div class="card stack" style="gap:18px">
  ${SPHERES.map(s=>{const r=R(s.id);return `<div class="sphere ${r.skip?'skip':''}" data-sid="${s.id}">
   <div class="sphere-head"><div class="titled">${icw(s.id)}<div><h3>${s.name}</h3><p class="small muted">${s.hint}</p></div></div>
    <button class="btn link" data-act="skip" data-sid="${s.id}">${r.skip?'Вернуть':'Пропустить'}</button></div>
   <div class="scales stack" style="gap:4px">
    <div class="scale imp ${r.ti?'':'untouched'}"><label for="i-${s.id}">Насколько важно для меня</label><output id="oi-${s.id}">${r.ti?r.imp:'—'}</output>
     <input type="range" min="0" max="10" step="1" id="i-${s.id}" value="${r.imp}" style="--p:${r.imp*10}%" data-k="imp" data-sid="${s.id}"></div>
    <div class="scale act ${r.ta?'':'untouched'}"><label for="a-${s.id}">Сколько действий было за неделю</label><output id="oa-${s.id}">${r.ta?r.act:'—'}</output>
     <input type="range" min="0" max="10" step="1" id="a-${s.id}" value="${r.act}" style="--p:${r.act*10}%" data-k="act" data-sid="${s.id}"></div>
   </div></div>`}).join('')}
  </div>
  <p class="small muted">0 — совсем не важно / ничего не делал(а), 10 — очень важно / жил(а) этим каждый день.</p>
  </div>`}

function gaps(){return SPHERES.filter(s=>rated(s.id)).map(s=>({s,imp:S.ratings[s.id].imp,act:S.ratings[s.id].act,gap:S.ratings[s.id].imp-S.ratings[s.id].act})).sort((a,b)=>b.gap-a.gap||b.imp-a.imp)}

function vChoose(){
  const g=gaps();
  if(!S.chosen.length){S.chosen=g.filter(x=>x.imp>=6&&x.gap>=2).slice(0,2).map(x=>x.s.id);save()}
  return `<div class="view stack" style="gap:18px">${progressBar()}
  <div class="stack"><span class="eyebrow">Шаг 2 · Выбор направления</span><h2>С чего начнём?</h2>
  <p class="muted">Выберите одну–три сферы, с которыми хочется поработать. Мы отметили те, где разрыв между «важно» и «делаю» самый большой. Но можно выбрать и сферу, где всё и так неплохо: поддержать то, что уже работает, тоже ценно.</p></div>
  <div class="card">${rose({highlight:true})}</div>
  <div class="stack" style="gap:8px">${g.map(x=>{const on=S.chosen.includes(x.s.id);return `<button class="pick" aria-pressed="${on}" data-act="pick" data-sid="${x.s.id}">
   <span class="box">${on?'✓':''}</span>${ic(x.s.id)}<div><b>${x.s.name}</b><div class="small muted">важно ${x.imp} · действий ${x.act}</div></div>
   ${x.gap>=2?`<span class="gap">разрыв ${x.gap}</span>`:''}</button>`}).join('')}</div>
  <p class="small muted">Выбрано: ${S.chosen.length} из 3.</p>
  </div>`}

function vDir(i){
  const id=S.chosen[i],s=sp(id),r=S.ratings[id],v=S.values[id]||(S.values[id]={who:'',deeds:'',memory:''});
  return `<div class="view stack" style="gap:18px">${progressBar()}
  <div class="stack">${badge(id)}<span class="eyebrow">${s.name} · Направление</span><h2>Каким вы хотите быть в этой сфере?</h2>
  <p class="muted">Важность ${r.imp}, действий ${r.act}. Отвечайте о себе, о том, что в вашей власти: каким человеком вы хотите быть, а не каким должен быть кто-то другой или как всё должно сложиться.</p></div>
  ${field('who','Какие качества вы хотите проявлять здесь?','Каким человеком вы хотите быть в этой сфере, если бы выбирали сами, без оглядки на «надо»?',v.who,'Например: внимательной и терпеливой, честно говорить о том, что чувствую…')}
  <details class="card"><summary>Не знаю, что написать</summary><div class="stack">
   <p>Попробуйте один из вопросов:</p>
   <p class="quote">Представьте, что одобрение всех важных для вас людей уже гарантировано. Каким бы вы тогда были в этой сфере?</p>
   <p class="quote">Через много лет вы оглядываетесь назад. Что вам хотелось бы увидеть о себе в этой части жизни?</p>
   <p class="small muted">Слова для вдохновения — нажмите, чтобы добавить в ответ:</p>
   <div class="chips">${QUALITIES.map(q=>`<button class="chip" data-act="q" data-q="${q}">${q}</button>`).join('')}</div>
  </div></details>
  ${field('deeds','Как это выглядело бы в поступках?','Что заметил бы человек, который понаблюдал за вами неделю?',v.deeds,'Например: звоню маме по воскресеньям и правда слушаю, а не листаю ленту…')}
  ${field('memory','Был ли момент, когда у вас это получалось?','Необязательно. Что вы тогда делали?',v.memory,'')}
  </div>`}

function field(k,label,sub,val,ph){const h=check(val);return `<div class="field">
  <label for="f-${k}">${label}</label><span class="sub">${sub}</span>
  <textarea id="f-${k}" data-f="${k}" placeholder="${esc(ph)}">${esc(val)}</textarea>
  <div class="hint" id="h-${k}" ${h?'':'hidden'}>${h}</div></div>`}

function vAct(i){
  const id=S.chosen[i],s=sp(id),st=S.steps[id]||(S.steps[id]={what:'',when:'',barriers:''}),v=S.values[id]||{};
  return `<div class="view stack" style="gap:18px">${progressBar()}
  <div class="stack">${badge(id,true)}<span class="eyebrow">${s.name} · Шаг</span><h2>Один маленький шаг на этой неделе</h2>
  ${v.who?`<p class="muted">Ваше направление: <i>${esc(v.who)}</i></p>`:''}
  <p class="muted">Выберите шаг настолько маленький, чтобы он получился даже в трудный день. Не нужно менять всю жизнь сразу, важно повернуть в нужную сторону.</p></div>
  <div class="field"><label for="f-what">Что я сделаю?</label><span class="sub">Конкретное действие, которое можно увидеть со стороны.</span>
   <textarea id="f-what" data-s="what" placeholder="Например: в субботу позову подругу на прогулку">${esc(st.what)}</textarea></div>
  <div class="field"><span style="font-weight:600">Когда?</span>
   <div class="chips">${WHEN.map(w=>`<button class="chip" aria-pressed="${st.when===w}" data-act="when" data-w="${w}">${w}</button>`).join('')}</div>
   <input type="text" id="f-when" data-s="when" value="${esc(WHEN.includes(st.when)?'':st.when)}" placeholder="Или точнее: в среду после работы"></div>
  <div class="field"><label for="f-barriers">Какие мысли и чувства могут встать на пути?</label>
   <span class="sub">Необязательно. Например: «будет неловко», «ничего не изменится», усталость.</span>
   <textarea id="f-barriers" data-s="barriers">${esc(st.barriers)}</textarea>
   <div class="hint">Их не нужно побеждать или ждать, пока пройдут. Достаточно заметить и взять с собой в дорогу — как попутчиков, которые ворчат, но не держат руль.</div></div>
  </div>`}

const I_LINK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>';
const I_IMG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
const I_TXT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';

function resultSpheres(){return S.chosen.map(id=>{const s=sp(id),v=S.values[id]||{},st=S.steps[id]||{},r=S.ratings[id]||{};
   return `<div class="res-sphere"><div class="titled">${icw(id)}<h3>${s.name}</h3></div><p class="small muted">важно ${r.imp} · действий ${r.act}</p><dl class="kv">
    ${v.who?`<dt>Направление</dt><dd>${esc(v.who)}</dd>`:''}
    ${v.deeds?`<dt>В поступках</dt><dd>${esc(v.deeds)}</dd>`:''}
    ${v.memory?`<dt>Уже получалось</dt><dd>${esc(v.memory)}</dd>`:''}
    ${st.what?`<dt>Шаг</dt><dd>${esc(st.what)}${st.when?` · <b>${esc(st.when)}</b>`:''}</dd>`:''}
    ${st.barriers?`<dt>Может помешать</dt><dd>${esc(st.barriers)}</dd>`:''}</dl></div>`}).join('')||'<p class="muted">Сферы не выбраны.</p>'}

function vResult(){
  const ds=fmtDate(S.date,true);
  if(VIEW)return `<div class="view stack" style="gap:18px">
  <div class="banner warm"><span><b>Результат клиента, только для просмотра.</b> Ответы пришли внутри ссылки и нигде не сохранялись.</span></div>
  <div class="stack"><span class="eyebrow">Итог · ${ds}</span><h2>Компас клиента</h2></div>
  <div class="card">${rose({highlight:true})}</div>
  <div class="card stack" style="gap:16px">${resultSpheres()}</div>
  <div class="card share"><h3>Сохранить у себя</h3>
   <div class="row split"><button class="btn ghost" data-act="png">${I_IMG}Картинка</button><button class="btn ghost" data-act="copy">${I_TXT}Текст</button></div>
   <pre class="copy" id="copytext" hidden>${esc(asText())}</pre></div>
  </div>`;
  return `<div class="view stack" style="gap:18px">
  ${S.example?`<div class="banner"><span><b>Это пример заполнения.</b> Так выглядит итог.</span><button class="btn" data-act="own">Начать своё</button></div>`:''}
  ${hero(true)}
  <div class="stack"><span class="eyebrow">Итог · ${ds}</span><h2>Ваш компас</h2>
  <p class="muted">Это не оценка и не диагноз, а карта на сегодня. Через неделю можно отметить сферы заново и посмотреть, что изменилось.</p></div>
  <div class="card">${rose({highlight:true})}</div>
  <div class="card stack" style="gap:16px">${resultSpheres()}</div>
  <div class="card share"><h3>Поделиться с психологом</h3>
   <p class="small muted">Выберите удобный способ и отправьте психологу в мессенджере. Ничего не уходит само.</p>
   <button class="btn wide" data-act="link">${I_LINK}Отправить ссылку</button>
   <div class="row split"><button class="btn ghost" data-act="png">${I_IMG}Картинка</button><button class="btn ghost" data-act="copy">${I_TXT}Текст</button></div>
   <details><summary class="small">Что внутри ссылки</summary><p class="small muted">Ответы сжаты и записаны прямо в адрес ссылки, после знака #. Эта часть адреса не передаётся на сервер: психолог откроет ссылку и увидит итог только для просмотра.</p></details>
   <pre class="copy" id="copytext" hidden>${esc(asText())}</pre></div>
  <div class="card stack"><h3>Через неделю</h3>
   <p class="small muted">Вернитесь сюда и отметьте карту сфер заново. Ваши направления и шаги сохранятся, а на розе будет видно, где действий стало больше.</p>
   <div class="row"><button class="btn ghost" data-act="week">Отметить новую неделю</button>
   <button class="btn link" data-act="reset-ask">Стереть всё</button></div><div id="resetbox"></div></div>
  </div>`}

function asText(){
  const d=fmtDate(S.date);
  let t=`Компас ценностей — ${d}\n\nКарта сфер (важно / действий):\n`;
  SPHERES.forEach(s=>{const r=S.ratings[s.id];if(!r)return;t+=r.skip?`• ${s.name}: пропущено\n`:`• ${s.name}: ${r.imp} / ${r.act}${S.prev&&S.prev[s.id]&&!S.prev[s.id].skip?` (в прошлый раз действий ${S.prev[s.id].act})`:''}\n`});
  S.chosen.forEach(id=>{const s=sp(id),v=S.values[id]||{},st=S.steps[id]||{};
    t+=`\n${s.name.toUpperCase()}\n`;
    if(v.who)t+=`Направление: ${v.who}\n`;if(v.deeds)t+=`В поступках: ${v.deeds}\n`;if(v.memory)t+=`Уже получалось: ${v.memory}\n`;
    if(st.what)t+=`Шаг на неделю: ${st.what}${st.when?` (${st.when})`:''}\n`;if(st.barriers)t+=`Может помешать: ${st.barriers}\n`});
  return t.trim()}

/* ---------- отрисовка и навигация ---------- */
const nav=document.getElementById('nav'),next=document.getElementById('next'),back=document.getElementById('back'),navinfo=document.getElementById('navinfo');
function render(){
  const st=S.step;let h='';
  if(st==='intro')h=vIntro();else if(st==='map')h=vMap();else if(st==='choose')h=vChoose();
  else if(st.startsWith('dir:'))h=vDir(+st.slice(4));else if(st.startsWith('act:'))h=vAct(+st.slice(4));else h=vResult();
  app.innerHTML=h;
  nav.hidden=st==='intro'||VIEW;
  if(st==='result'){next.hidden=true;back.textContent='Изменить ответы'}else{next.hidden=false;back.textContent='Назад'}
  updateNav();save();
}
function canNext(){const st=S.step;
  if(st==='map')return SPHERES.filter(s=>rated(s.id)).length>=3;
  if(st==='choose')return S.chosen.length>=1;
  if(st.startsWith('dir:'))return !!(S.values[S.chosen[+st.slice(4)]]||{}).who?.trim();
  if(st.startsWith('act:'))return !!(S.steps[S.chosen[+st.slice(4)]]||{}).what?.trim();
  return true}
function updateNav(){const st=S.step;next.disabled=!canNext();
  const r=route(),i=r.indexOf(st);next.textContent=r[i+1]==='result'?'Готово':'Дальше';
  if(st==='map'){const n=SPHERES.filter(s=>rated(s.id)||R(s.id).skip).length;navinfo.textContent=`${n} из ${SPHERES.length}`}
  else if(st.startsWith('dir:'))navinfo.textContent=canNext()?'':'Ответьте на первый вопрос';
  else if(st.startsWith('act:'))navinfo.textContent=canNext()?'':'Опишите шаг';
  else navinfo.textContent=''}
function go(step){S.step=step;if(step==='result'&&!S.example)S.date=S.date||new Date().toISOString();render();window.scrollTo({top:0})}
if(next)next.onclick=()=>{const r=route();go(r[r.indexOf(S.step)+1])};
if(back)back.onclick=()=>{if(S.step==='result'){go('map');return}const r=route();go(r[Math.max(0,r.indexOf(S.step)-1)])};

app&&app.addEventListener('input',e=>{const t=e.target;
  if(t.type==='range'){const r=R(t.dataset.sid);r[t.dataset.k]=+t.value;r[t.dataset.k==='imp'?'ti':'ta']=true;
    t.style.setProperty('--p',t.value*10+'%');
    const box=t.closest('.scale');box.classList.remove('untouched');box.querySelector('output').textContent=t.value;
    document.getElementById('rosebox').innerHTML=rose();
    save();updateNav();return}
  if(t.dataset.f){const id=S.chosen[+S.step.slice(4)];S.values[id][t.dataset.f]=t.value;
    clearTimeout(t._h);t._h=setTimeout(()=>{const h=check(t.value),el=document.getElementById('h-'+t.dataset.f);if(!el)return;el.textContent=h;el.hidden=!h},500);save();updateNav()}
  if(t.dataset.s){const id=S.chosen[+S.step.slice(4)];S.steps[id][t.dataset.s]=t.value;
    if(t.dataset.s==='when')document.querySelectorAll('[data-act=when]').forEach(c=>c.setAttribute('aria-pressed','false'));save();updateNav()}
});
app&&app.addEventListener('click',e=>{const b=e.target.closest('button,a[data-act]');if(!b)return;const a=b.dataset.act;
  if(b.dataset.go){go(b.dataset.go);return}
  if(a==='skip'){const r=R(b.dataset.sid);r.skip=!r.skip;if(r.skip)S.chosen=S.chosen.filter(x=>x!==b.dataset.sid);render();return}
  if(a==='pick'){const id=b.dataset.sid;if(S.chosen.includes(id))S.chosen=S.chosen.filter(x=>x!==id);else if(S.chosen.length<3)S.chosen.push(id);else{toast('Можно выбрать до трёх сфер');return}render();return}
  if(a==='q'){const ta=document.getElementById('f-who');const v=ta.value.trim();ta.value=v?(v.replace(/[.,;]\s*$/,'')+', '+b.dataset.q):b.dataset.q[0].toUpperCase()+b.dataset.q.slice(1);ta.dispatchEvent(new Event('input',{bubbles:true}));ta.focus();return}
  if(a==='when'){const id=S.chosen[+S.step.slice(4)];S.steps[id].when=b.dataset.w;document.getElementById('f-when').value='';
    document.querySelectorAll('[data-act=when]').forEach(c=>c.setAttribute('aria-pressed',c===b));save();updateNav();return}
  if(a==='copy'){copyText(asText(),'Скопировано',()=>selectCopy());return}
  if(a==='link'){shareLink();return}
  if(a==='png'){downloadPNG(b);return}
  if(a==='leave'){e.preventDefault();location.href=location.pathname;return}
  if(a==='week'){S.prev=JSON.parse(JSON.stringify(S.ratings));SPHERES.forEach(s=>{const r=R(s.id);r.ta=false});S.date=null;go('map');toast('Отметьте, сколько действий было на этой неделе');return}
  if(a==='reset-ask'){document.getElementById('resetbox').innerHTML=`<div class="hint row" style="justify-content:space-between"><span>Стереть все ответы на этом устройстве?</span><span class="row"><button class="btn danger" data-act="reset">Стереть</button><button class="btn ghost" data-act="reset-no">Отмена</button></span></div>`;return}
  if(a==='reset-no'){document.getElementById('resetbox').innerHTML='';return}
  if(a==='reset'){S=blank();save();render();toast('Ответы стёрты');return}
  if(a==='example'){fillExample();go('result');return}
  if(a==='own'){S=load();go('map');return}
});
function copyText(t,msg,fallback){const ok=()=>toast(msg);
  try{navigator.clipboard.writeText(t).then(ok,fallback)}catch(err){fallback()}}
function selectCopy(){const el=document.getElementById('copytext');el.hidden=false;const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Текст выделен — скопируйте его')}
let tt;function toast(m){const t=document.getElementById('toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600)}

/* ---------- пример ---------- */
function exampleRatings(){const d={family:[8,4],couple:[9,5],kids:[0,0,1],friends:[8,2],work:[7,8],growth:[6,5],rest:[6,2],body:[8,3],spirit:[4,3],world:[5,1]};
  const o={};for(const k in d)o[k]={imp:d[k][0],act:d[k][1],ti:true,ta:true,skip:!!d[k][2]};return o}
function fillExample(){S=blank();S.example=true;S.ratings=exampleRatings();S.chosen=['friends','body'];S.date=new Date().toISOString();
  S.prev=null;
  S.values={friends:{who:'Быть другом, который сам проявляет инициативу и правда интересуется жизнью близких людей, а не только отвечает, когда пишут.',deeds:'Сама пишу первой, предлагаю встретиться, помню, что у подруги была важная неделя, и спрашиваю, как всё прошло.',memory:'Прошлым летом мы каждую пятницу гуляли с Олей, и я сама это придумала.'},
    body:{who:'Относиться к своему телу с заботой и уважением, как к другу, а не как к инструменту, который должен работать без перерыва.',deeds:'Ложусь спать до полуночи, обедаю не за компьютером, гуляю хотя бы двадцать минут в день.',memory:''}};
  S.steps={friends:{what:'Напишу Оле и предложу прогулку в субботу',when:'Завтра',barriers:'«Она занята, я ей навязываюсь», неловкость'},
    body:{what:'Три вечера на неделе ложусь до 23:30, телефон оставляю на кухне',when:'В будни',barriers:'Усталость и желание «доделать ещё чуть-чуть»'}}}
