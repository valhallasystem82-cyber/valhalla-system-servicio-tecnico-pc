// Persistencia local compartida entre la web y el panel Admin
const cloneSiteData=o=>JSON.parse(JSON.stringify(o));
window.getSiteData=function(){try{
 const saved=JSON.parse(localStorage.getItem('valhallaData')||'{}');
 const merged=Object.assign(cloneSiteData(window.DEFAULT_DATA),saved);
 // Limpieza real de tarjetas vacías creadas accidentalmente con + Agregar.
 ['services','products','systems','gallery'].forEach(k=>{
   if(Array.isArray(merged[k])) merged[k]=merged[k].filter(x=>{
     const t=String(x?.title||'').trim().toLowerCase();
     const d=String(x?.text||'').trim().toLowerCase();
     return !(t==='nuevo' && (d==='' || d==='descripción' || d==='descripcion'));
   });
 });
 // Migración: garantiza que este servicio exista aunque haya datos viejos guardados en el navegador.
 merged.services=Array.isArray(merged.services)?merged.services:[];
 const ps=merged.services.find(x=>String(x?.id||'')==='power-shock' || /power\s*shock/i.test(String(x?.title||'')));
 const power={id:'power-shock',title:'Reparación y colocación de placas Power Shock y cercos eléctricos',icon:'⚡',iconImage:'assets/power-shock.jpg',image:'assets/power-shock.jpg',text:'Reparación, colocación y diagnóstico de placas Power Shock, energizadores y sistemas de cercos eléctricos.',href:'power-shock.html'};
 if(ps) Object.assign(ps,power,{images:Array.isArray(ps.images)&&ps.images.length?ps.images:[power.image]}); else merged.services.push({...power,images:[power.image]});
 localStorage.setItem('valhallaData',JSON.stringify(merged));
 return merged;
}catch(e){return cloneSiteData(window.DEFAULT_DATA)}};
window.saveSiteData=function(d){localStorage.setItem('valhallaData',JSON.stringify(d))};

const D=getSiteData();
D.settings=D.settings||{};
const defaults={primary:'#079cff',accent:'#00e8ff',pageBg:'#050a10',cardBg:'#0d1824',textColor:'#f4f7fb',lightBg:'#f5f8fb',lightText:'#111d29',headerBg:'#03080e',serviceVisualBg:'#0d2b3d'};
Object.entries(defaults).forEach(([k,v])=>{if(!D.settings[k])D.settings[k]=v});
document.documentElement.style.setProperty('--p',D.settings.primary);document.documentElement.style.setProperty('--a',D.settings.accent);document.documentElement.style.setProperty('--pagebg',D.settings.pageBg);document.documentElement.style.setProperty('--card',D.settings.cardBg);document.documentElement.style.setProperty('--txt',D.settings.textColor);document.documentElement.style.setProperty('--lightbg',D.settings.lightBg);document.documentElement.style.setProperty('--lighttxt',D.settings.lightText);document.documentElement.style.setProperty('--headerbg',D.settings.headerBg);
const phone=(D.settings.phone||'').replace(/\D/g,''); const WA=phone?`https://wa.me/${phone.startsWith('54')?phone:'54'+phone}`:'#';
const nav=[['index.html','Inicio'],['servicio-tecnico.html','Servicios'],['camaras.html','Cámaras IP'],['consolas.html','Consolas'],['hardware.html','Hardware'],['almacenamiento.html','Almacenamiento'],['productos.html','Productos'],['outlet.html','Tienda Outlet'],['sistemas.html','Sistemas'],['reciclaje.html','Reciclaje'],['galeria.html','Galería'],['sponsors.html','Sponsors'],['contacto.html','Contacto']];
const H=document.getElementById('siteHeader'); if(H) H.innerHTML=`<a class="brand" href="index.html"><img src="${D.settings.logo||'assets/logo.png'}"></a><button class="menuBtn" onclick="document.querySelector('.mainNav').classList.toggle('open')">☰</button><nav class="mainNav">${nav.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('')}</nav><a class="wa" href="${WA}">WhatsApp</a>`;
const F=document.getElementById('siteFooter'); if(F) F.innerHTML=`<div><img class="footerLogo" src="${D.settings.logo||'assets/logo.png'}"><div>${D.settings.tagline}</div></div><div><b>Enlaces</b><br><a href="servicio-tecnico.html">Servicios</a> · <a href="productos.html">Productos</a> · <a href="outlet.html">Tienda Outlet</a><br><a href="sistemas.html">Sistemas</a> · <a href="reciclaje.html">Reciclaje</a> · <a href="sponsors.html">Sponsors</a></div><div><b>Contacto</b><br>${D.settings.phone||'WhatsApp a configurar'}<br>${D.settings.email||'Email a configurar'}<br>${D.settings.zone}</div><div><a href="admin.html">Administración</a></div>`;
function imgs(c){let a=Array.isArray(c.images)?c.images.filter(Boolean):[];if(c.image&&!a.includes(c.image))a.unshift(c.image);return a}
window.card=function(c){let a=imgs(c), first=a[0]||'', iconVisual=c.iconImage?`<img class="iconPhoto" src="${c.iconImage}" alt="">`:(c.icon||'⚡');return `<article class="card">${first?`<button class="pic picButton" type="button" onclick='openGallery(${JSON.stringify(a)},0)' aria-label="Abrir fotos"><img src="${first}" alt="${String(c.title||'').replaceAll('\"','&quot;')}">${a.length>1?`<span class="photoCount">📷 ${a.length}</span>`:''}</button>`:`<div class="pic">${iconVisual}</div>`}<div class="body"><h3>${c.title}</h3><p>${c.text}</p>${c.href?`<a class="more" href="${c.href}">Ver más →</a>`:''}</div></article>`};
window.openGallery=function(arr,start=0){if(!arr||!arr.length)return;let i=start;let ov=document.getElementById('photoLightbox');if(!ov){ov=document.createElement('div');ov.id='photoLightbox';ov.className='lightbox';document.body.appendChild(ov)};function draw(){ov.innerHTML=`<button class="lbClose" aria-label="Cerrar">×</button><button class="lbPrev" aria-label="Anterior">‹</button><img src="${arr[i]}" alt="Foto ampliada"><button class="lbNext" aria-label="Siguiente">›</button><div class="lbCount">${i+1} / ${arr.length}</div>`;ov.classList.add('show');ov.querySelector('.lbClose').onclick=()=>ov.classList.remove('show');ov.querySelector('.lbPrev').onclick=()=>{i=(i-1+arr.length)%arr.length;draw()};ov.querySelector('.lbNext').onclick=()=>{i=(i+1)%arr.length;draw()};}draw();ov.onclick=e=>{if(e.target===ov)ov.classList.remove('show')};};
window.addEventListener('keydown',e=>{let ov=document.getElementById('photoLightbox');if(ov?.classList.contains('show')&&e.key==='Escape')ov.classList.remove('show')});
