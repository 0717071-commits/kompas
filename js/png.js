/* Итог картинкой PNG: роза сфер, ценности и шаги. Рисуем на canvas сами — без сторонних библиотек.
   Палитра всегда светлая: картинку открывают в мессенджере, где тёмная тема сайта не нужна. */
const PNG_C={paper:'#F8F5EF',surface:'#FFFDF9',ink:'#3B4743',muted:'#77716A',line:'#E5DDCF',accent:'#2F6153',warm:'#C46A42',warmSoft:'#F7E6DC',blob1:'#F6D3C2',blob2:'#D3E5DA'};
const PNG_W=1080,PNG_PAD=72,PNG_SCALE=2;
const F_DISP='"Cormorant Garamond",Georgia,serif',F_BODY='"Golos Text",-apple-system,Arial,sans-serif';

function wrapLines(ctx,text,maxW){
  const out=[];String(text).split('\n').forEach(par=>{let line='';
    par.split(/\s+/).forEach(w=>{if(!w)return;const t=line?line+' '+w:w;
      if(ctx.measureText(t).width>maxW&&line){out.push(line);line=w}else line=t});
    out.push(line)});
  return out}

function roseImage(){
  const svg=roseSVG({highlight:true,labels:false,colors:{line:PNG_C.line,surface:PNG_C.surface,accent:PNG_C.accent,warm:PNG_C.warm,muted:PNG_C.muted}});
  return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}

/* один проход раскладки: draw=false — только считаем высоту */
function layoutPNG(ctx,img,draw){
  const W=PNG_W,P=PNG_PAD,CW=W-2*P;let y=P;
  const text=(t,font,color,x,yy,align)=>{if(!draw)return;ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align||'left';ctx.fillText(t,x,yy)};
  // шапка
  ctx.font=`600 26px ${F_BODY}`;
  text('КОМПАС ЦЕННОСТЕЙ · ИТОГ',`600 24px ${F_BODY}`,PNG_C.warm,P,y+24);y+=40;
  text(fmtDate(S.date,true),`600 72px ${F_DISP}`,PNG_C.ink,P,y+64);y+=100;
  // роза: SVG viewBox 448×368, рисуем на всю ширину контента
  const rw=CW,rh=rw*368/448,rx=P,ry=y;
  if(draw){
    ctx.fillStyle=PNG_C.surface;roundRect(ctx,P-24,ry-24,CW+48,rh+110,32);ctx.fill();ctx.strokeStyle=PNG_C.line;ctx.lineWidth=2;ctx.stroke();
    ctx.drawImage(img,rx,ry,rw,rh);
    // подписи сфер — тем же расчётом, что и в розе
    const k=rw/448,ox=rx+44*k,oy=ry+4*k;
    SPHERES.forEach((s,i)=>{const a=roseAngle(i),[lx,ly]=rosePt(a,ROSE.RM+22),on=S.chosen.includes(s.id);
      ctx.font=`${on?600:400} ${Math.round(12*k)}px ${F_BODY}`;ctx.fillStyle=on?PNG_C.ink:PNG_C.muted;
      ctx.textAlign=Math.abs(Math.sin(a))<0.2?'center':(Math.sin(a)>0?'left':'right');
      ctx.fillText(s.short,ox+lx*k,oy+(ly+4)*k)});
  }
  y+=rh+14;
  // легенда
  if(draw){ctx.font=`400 24px ${F_BODY}`;ctx.textAlign='left';
    const items=[[PNG_C.accent,'как важно'],[PNG_C.warm,'сколько делал(а)']];
    if(S.prev)items.push([null,'в прошлый раз']);
    let total=0;items.forEach(([,t])=>total+=36+ctx.measureText(t).width+28);total-=28;let x=(W-total)/2;
    items.forEach(([c,t])=>{if(c){ctx.fillStyle=c;roundRect(ctx,x,y+4,22,22,5);ctx.fill()}else{ctx.setLineDash([5,5]);ctx.strokeStyle=PNG_C.muted;ctx.lineWidth=3;roundRect(ctx,x,y+4,22,22,5);ctx.stroke();ctx.setLineDash([])}
      ctx.fillStyle=PNG_C.muted;ctx.fillText(t,x+34,y+24);x+=36+ctx.measureText(t).width+28})}
  y+=96;
  // сферы
  S.chosen.forEach(id=>{const s=sp(id),v=S.values[id]||{},st=S.steps[id]||{},r=S.ratings[id]||{};
    text(s.name,`600 52px ${F_DISP}`,PNG_C.ink,P,y+44);y+=62;
    text(`важно ${r.imp} · действий ${r.act}`,`400 24px ${F_BODY}`,PNG_C.muted,P,y+22);y+=50;
    const rows=[['Направление',v.who],['В поступках',v.deeds],['Уже получалось',v.memory],['Шаг на неделю',st.what?st.what+(st.when?` · ${st.when}`:''):''],['Может помешать',st.barriers]];
    rows.forEach(([k,val])=>{if(!val)return;
      text(k.toUpperCase(),`600 20px ${F_BODY}`,k==='Шаг на неделю'?PNG_C.warm:PNG_C.muted,P,y+20);y+=32;
      ctx.font=`400 30px ${F_BODY}`;wrapLines(ctx,val,CW).forEach(l=>{text(l,`400 30px ${F_BODY}`,PNG_C.ink,P,y+30);y+=44});y+=18});
    if(draw){ctx.strokeStyle=PNG_C.line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(P,y+10);ctx.lineTo(W-P,y+10);ctx.stroke()}
    y+=50});
  text('Ответы клиента. Это не оценка и не диагноз, а карта на сегодня.',`400 22px ${F_BODY}`,PNG_C.muted,W/2,y+20,'center');y+=20+P;
  return y}

function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}

async function renderPNG(){
  try{await Promise.all([document.fonts.load(`600 72px ${F_DISP}`),document.fonts.load(`400 30px ${F_BODY}`),document.fonts.load(`600 24px ${F_BODY}`)])}catch(e){}
  const img=await roseImage();
  const cv=document.createElement('canvas'),ctx=cv.getContext('2d');
  const H=Math.ceil(layoutPNG(ctx,img,false));
  cv.width=PNG_W*PNG_SCALE;cv.height=H*PNG_SCALE;ctx.scale(PNG_SCALE,PNG_SCALE);
  // фон: бумага и два тёплых пятна, как на сайте
  ctx.fillStyle=PNG_C.paper;ctx.fillRect(0,0,PNG_W,H);
  [[PNG_W-60,40,420,PNG_C.blob1],[-40,520,420,PNG_C.blob2]].forEach(([x,y,r,c])=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,c+'00');ctx.fillStyle=g;ctx.fillRect(0,0,PNG_W,H)});
  layoutPNG(ctx,img,true);
  return new Promise(res=>cv.toBlob(res,'image/png'))}

async function downloadPNG(btn){
  if(btn)btn.disabled=true;
  try{
    const blob=await renderPNG();
    const d=(S.date?new Date(S.date):new Date()).toISOString().slice(0,10);
    const name=`kompas-${d}.png`,file=new File([blob],name,{type:'image/png'});
    if(navigator.canShare&&matchMedia('(pointer:coarse)').matches&&navigator.canShare({files:[file]})){
      try{await navigator.share({files:[file],title:'Компас ценностей'});return}catch(e){if(e.name==='AbortError')return}}
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),4000);toast('Картинка сохранена');
  }catch(e){toast('Не получилось создать картинку. Скопируйте текст')}
  finally{if(btn)btn.disabled=false}
}
