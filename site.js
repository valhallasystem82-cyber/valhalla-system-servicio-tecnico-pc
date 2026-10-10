// Valhalla System - datos online en Firebase Realtime Database
const cloneSiteData=o=>JSON.parse(JSON.stringify(o));
const FB_URL='https://valhalla-system-pagina-tecnica-default-rtdb.firebaseio.com/valhallaSite.json';
let CLOUD_DATA=null;

function normalizeData(source){
 const merged=Object.assign(cloneSiteData(window.DEFAULT_DATA),source||{});
 ['services','products','systems','gallery'].forEach(k=>{
   if(Array.isArray(merged[k])) {
     merged[k]=merged[k].filter(x=>{
       const t=String(x?.title||'').trim().toLowerCase(), d=String(x?.text||'').trim().toLowerCase();
       return !(t==='nuevo' && (d===''||d==='descripción'||d==='descripcion'));
     });

   }
 });
 merged.services=Array.isArray(merged.services)?merged.services:[];
 const ps=merged.services.find(x=>String(x?.id||'')==='power-shock'||/power\s*shock/i.test(String(x?.title||'')));
 const power={id:'power-shock',title:'Reparación y colocación de placas Power Shock y cercos eléctricos',icon:'⚡',iconImage:'assets/power-shock.jpg',image:'',text:'Reparación, colocación y diagnóstico de placas Power Shock, energizadores y sistemas de cercos eléctricos.',href:'power-shock.html'};
 if(ps){ if(!ps.href) ps.href='power-shock.html'; if(!ps.text||/pc|notebook/i.test(ps.text)) ps.text=power.text; if(ps.image==='assets/power-shock.jpg'){ ps.image=''; if(Array.isArray(ps.images)) ps.images=ps.images.filter(x=>x!=='assets/power-shock.jpg'); } }
 else merged.services.push({...power,images:[]});
 return merged;
}
window.getSiteData=()=>normalizeData(CLOUD_DATA||{});
window.saveSiteData=async function(d){
 CLOUD_DATA=cloneSiteData(d);
 try{localStorage.setItem('valhallaData',JSON.stringify(d))}catch(e){}
 const r=await fetch(FB_URL,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
 if(!r.ok) throw new Error('Firebase '+r.status);
 return true;
};

function setupCommon(){
 window.D=getSiteData();
 D.settings=D.settings||{};
 const defaults={primary:'#079cff',accent:'#00e8ff',pageBg:'#050a10',cardBg:'#0d1824',textColor:'#f4f7fb',lightBg:'#f5f8fb',lightText:'#111d29',headerBg:'#03080e',serviceVisualBg:'#0d2b3d'};
 Object.entries(defaults).forEach(([k,v])=>{if(!D.settings[k])D.settings[k]=v});
 document.documentElement.style.setProperty('--p',D.settings.primary);document.documentElement.style.setProperty('--a',D.settings.accent);document.documentElement.style.setProperty('--pagebg',D.settings.pageBg);document.documentElement.style.setProperty('--card',D.settings.cardBg);document.documentElement.style.setProperty('--txt',D.settings.textColor);document.documentElement.style.setProperty('--lightbg',D.settings.lightBg);document.documentElement.style.setProperty('--lighttxt',D.settings.lightText);document.documentElement.style.setProperty('--headerbg',D.settings.headerBg);
 const phone=(D.settings.phone||'').replace(/\D/g,''); window.WA=phone?`https://wa.me/${phone.startsWith('54')?phone:'54'+phone}`:'#';
 const nav=[['index.html','Inicio'],['servicio-tecnico.html','Servicios'],['camaras.html','Cámaras IP'],['consolas.html','Consolas'],['hardware.html','Hardware'],['almacenamiento.html','Almacenamiento'],['productos.html','Productos'],['outlet.html','Tienda Outlet'],['sistemas.html','Sistemas'],['reciclaje.html','Reciclaje'],['galeria.html','Galería'],['sponsors.html','Sponsors'],['contacto.html','Contacto']];
 const H=document.getElementById('siteHeader'); if(H) H.innerHTML=`<a class="brand" href="index.html"><img src="${D.settings.logo||'assets/logo.png'}"></a><button class="menuBtn" onclick="document.querySelector('.mainNav').classList.toggle('open')">☰</button><nav class="mainNav">${nav.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('')}</nav><a class="wa" href="${WA}">WhatsApp</a>`;
 const F=document.getElementById('siteFooter'); if(F) F.innerHTML=`<div><img class="footerLogo" src="${D.settings.logo||'assets/logo.png'}"><div>${D.settings.tagline}</div></div><div><b>Enlaces</b><br><a href="servicio-tecnico.html">Servicios</a> · <a href="productos.html">Productos</a> · <a href="outlet.html">Tienda Outlet</a><br><a href="sistemas.html">Sistemas</a> · <a href="reciclaje.html">Reciclaje</a> · <a href="sponsors.html">Sponsors</a></div><div><b>Contacto</b><br>${D.settings.phone||'WhatsApp a configurar'}<br>${D.settings.email||'Email a configurar'}<br>${D.settings.zone}</div><div><a href="admin.html">Administración</a></div>`;
}
function imgs(c){let a=Array.isArray(c.images)?c.images.filter(Boolean):[];if(c.image&&!a.includes(c.image))a.unshift(c.image);return a}
window.card=function(c){let a=imgs(c);let visual=a.length?`<img class="iconPhoto" src="${a[0]}" alt="${String(c.title||'').replaceAll('\"','&quot;')}">`:(c.icon||'⚡');return `<article class="card"><div class="pic">${visual}</div><div class="body"><h3>${c.title}</h3><p>${c.text}</p>${c.href?`<a class="more" href="${c.href}">Ver más →</a>`:''}</div></article>`};
window.openGallery=function(arr,start=0){if(!arr||!arr.length)return;let i=start,ov=document.getElementById('photoLightbox');if(!ov){ov=document.createElement('div');ov.id='photoLightbox';ov.className='lightbox';document.body.appendChild(ov)}function draw(){ov.innerHTML=`<button class="lbClose">×</button><button class="lbPrev">‹</button><img src="${arr[i]}" alt="Foto ampliada"><button class="lbNext">›</button><div class="lbCount">${i+1} / ${arr.length}</div>`;ov.classList.add('show');ov.querySelector('.lbClose').onclick=()=>ov.classList.remove('show');ov.querySelector('.lbPrev').onclick=()=>{i=(i-1+arr.length)%arr.length;draw()};ov.querySelector('.lbNext').onclick=()=>{i=(i+1)%arr.length;draw()}}draw();ov.onclick=e=>{if(e.target===ov)ov.classList.remove('show')}};
window.addEventListener('keydown',e=>{let ov=document.getElementById('photoLightbox');if(ov?.classList.contains('show')&&e.key==='Escape')ov.classList.remove('show')});

(async()=>{
 let cloud=null;
 try{const r=await fetch(FB_URL,{cache:'no-store'});if(r.ok)cloud=await r.json()}catch(e){console.warn('Firebase sin conexión',e)}
 if(cloud){CLOUD_DATA=normalizeData(cloud)}else{
   let local=null;try{local=JSON.parse(localStorage.getItem('valhallaData')||'null')}catch(e){}
   CLOUD_DATA=normalizeData(local||window.DEFAULT_DATA);
   try{await saveSiteData(CLOUD_DATA)}catch(e){console.warn('No se pudo inicializar Firebase',e)}
 }
 setupCommon();
 window.dispatchEvent(new Event('valhalla-ready'));
})();
