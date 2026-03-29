// ============================================================
// STRIPE — Remplace avec ta vraie clé publiable
// Obtiens-la sur https://dashboard.stripe.com/apikeys
// ============================================================
const STRIPE_PK = 'pk_live_51PJa2p03wJRtI4Rfas1lRwewqWWIJOXbJuHxeowt4P3JJuWXMu4ymmQo9pajNUlx6iAQhGUYDtH6UOvGt1nsWGKN00eQd4JNN3';
// Pour le paiement réel tu auras aussi besoin d'un backend léger
// (Netlify Function gratuite) — je t'explique tout dans le prochain message.

// ============================================================
// HORAIRES
// Jours : 0=Dim 1=Lun 2=Mar 3=Mer 4=Jeu 5=Ven 6=Sam
// ============================================================
const SCHEDULE = {
    0:{open:20,close:3},   // Dim
    3:{open:20,close:3},   // Mer
    4:{open:20,close:3},   // Jeu
    5:{open:20,close:4},   // Ven
    6:{open:20,close:4},   // Sam
};
const DAY_FR = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

function isNowOpen(){
    const now=new Date(), h=now.getHours(), d=now.getDay();
    if(SCHEDULE[d]){
        const s=SCHEDULE[d];
        if(h>=s.open||h<s.close) return {open:true,closes:s.close};
    }
    const prev=(d+6)%7;
    if(SCHEDULE[prev]&&now.getHours()<SCHEDULE[prev].close) return {open:true,closes:SCHEDULE[prev].close};
    for(let i=1;i<=7;i++){const nd=(d+i)%7;if(SCHEDULE[nd])return{open:false,nextDay:nd,nextHour:SCHEDULE[nd].open};}
    return {open:false};
}

function updateStatusBar(){
    const bar=document.getElementById('statusBar');
    const txt=document.getElementById('statusText');
    const stat=isNowOpen();
    if(stat.open){
        bar.className='open-bar';
        txt.textContent=`Ouvert maintenant · Livraison jusqu'à ${stat.closes}h`;
        const el=document.getElementById('closeTimeStat');
        if(el) el.textContent=stat.closes+'h';
    } else {
        bar.className='closed-bar';
        txt.textContent=stat.nextDay!==undefined
            ?`Fermé · Prochain service : ${DAY_FR[stat.nextDay]} à ${stat.nextHour}h`
            :'Fermé aujourd\'hui';
    }
}

// ============================================================
// PRODUCTS
// ============================================================
const PRODUCTS=[
    {id:1, cat:'Whisky',    name:"Jack Daniel's",      vol:'70cl',   price:30.90,c:'#3D1400',lc:'#C9A227',type:'w'},
    {id:2, cat:'Whisky',    name:"Ballantine's",        vol:'1L',     price:34.90,c:'#2A0E00',lc:'#D4AA40',type:'w'},
    {id:3, cat:'Whisky',    name:"Label 5",             vol:'70cl',   price:20.90,c:'#1A0A00',lc:'#CC9920',type:'w'},
    {id:4, cat:'Vodka',     name:'Grey Goose',          vol:'70cl',   price:49.90,c:'#0A1525',lc:'#A0C8E8',type:'v'},
    {id:5, cat:'Vodka',     name:'Absolut',             vol:'1L',     price:31.90,c:'#0E1C2A',lc:'#B8D8F0',type:'v'},
    {id:6, cat:'Vodka',     name:'Eristoff White',      vol:'70cl',   price:36.90,c:'#081018',lc:'#90B8D8',type:'v'},
    {id:7, cat:'Gin',       name:'Tanqueray',           vol:'70cl',   price:33.90,c:'#061A06',lc:'#80C880',type:'g'},
    {id:8, cat:'Gin',       name:"Hendrick's",          vol:'70cl',   price:45.90,c:'#0A0A1A',lc:'#A0A0D0',type:'g'},
    {id:9, cat:'Gin',       name:'Bulldog London Dry',  vol:'1L',     price:31.90,c:'#060E16',lc:'#70A0C0',type:'g'},
    {id:10,cat:'Rhum',      name:'Bumbu Rhum',          vol:'70cl',   price:43.90,c:'#200800',lc:'#C07828',type:'r'},
    {id:11,cat:'Rhum',      name:'Don Papa',            vol:'70cl',   price:49.90,c:'#2A0E00',lc:'#C88030',type:'r'},
    {id:12,cat:'Rhum',      name:'Captain Morgan Gold', vol:'70cl',   price:17.90,c:'#180600',lc:'#B86820',type:'r'},
    {id:13,cat:'Apéritif',  name:'Aperol',              vol:'1L',     price:29.90,c:'#5C1400',lc:'#FF7800',type:'a'},
    {id:14,cat:'Apéritif',  name:'Ricard Pastis',       vol:'1L',     price:36.90,c:'#3A2400',lc:'#D4A800',type:'a'},
    {id:15,cat:'Apéritif',  name:'Picon Orange',        vol:'70cl',   price:15.90,c:'#4A1800',lc:'#E07820',type:'a'},
    {id:16,cat:'Champagne', name:'Mumm Cordon Rouge',   vol:'75cl',   price:64.90,c:'#280808',lc:'#E8C840',type:'ch'},
    {id:17,cat:'Soft',      name:'Red Bull 24×25cl',    vol:'Caisse', price:47.90,c:'#0A0A2A',lc:'#4060FF',type:'s'},
    {id:18,cat:'Soft',      name:'Coca-Cola 24×20cl',   vol:'Caisse', price:19.90,c:'#2A0000',lc:'#CC0000',type:'s'},
    {id:19,cat:'Apéritif',  name:'Martini Rosso',       vol:'1L',     price:17.90,c:'#2A0808',lc:'#CC4040',type:'a'},
    {id:20,cat:'Apéritif',  name:'Martini Bianco',      vol:'1L',     price:13.90,c:'#141420',lc:'#D0D0E0',type:'a'},
    {id:21,cat:'Apéritif',  name:'Calem Porto Tawny',   vol:'75cl',   price:10.90,c:'#2A0E0E',lc:'#B04040',type:'a'},
    {id:22,cat:'Apéritif',  name:'Offley White Port',   vol:'75cl',   price:11.90,c:'#1A1408',lc:'#C8A850',type:'a'},
    {id:23,cat:'Vin',       name:'Pinot Gris Alsace',   vol:'75cl',   price:11.90,c:'#181A08',lc:'#C8C060',type:'vi'},
    {id:24,cat:'Vin',       name:'Mateus Rosé',         vol:'75cl',   price:6.90, c:'#2A0E14',lc:'#D08090',type:'vi'},
    {id:25,cat:'Vin',       name:'Chusclan Colombier Rouge',vol:'75cl',price:8.90,c:'#2A0808',lc:'#A03030',type:'vi'},
    {id:26,cat:'Vin',       name:'Quinta Vista Reserva',vol:'75cl',   price:8.90, c:'#200808',lc:'#903030',type:'vi'},
    {id:27,cat:'Liqueur',   name:'Jägermeister',        vol:'70cl',   price:21.90,c:'#081408',lc:'#60A040',type:'l'},
    {id:28,cat:'Liqueur',   name:'GET 27 Menthe',       vol:'70cl',   price:22.90,c:'#082010',lc:'#40C870',type:'l'},
    {id:29,cat:'Soft',      name:'Schweppes Tonic',     vol:'1.5L',   price:3.90, c:'#1A1808',lc:'#D0C040',type:'s'},
];

const PACKS=[
    {id:'p1',name:'Pack Spritz Party',badge:'⭐ Best-seller',emoji:'🍹',desc:'Le combo parfait pour un apéro Spritz pour 6 personnes.',items:['Aperol 1L','Prosecco 75cl × 2','Eau gazeuse 1.5L'],price:54.90,oldPrice:72.00,saves:17.10},
    {id:'p2',name:'Pack Soirée Whisky',badge:'🥃 Classique',emoji:'🥃',desc:'Tout pour une soirée whisky : bouteille + mixer.',items:["Jack Daniel's 70cl","Coca-Cola 1.5L",'Glaçons offerts'],price:34.90,oldPrice:39.90,saves:5.00},
    {id:'p3',name:'Pack Nuit Festive',badge:'🎉 Populaire',emoji:'🎉',desc:'Vodka + énergie + softs : le trio indétrônable.',items:['Vodka Absolut 1L','Red Bull 25cl × 4','Coca-Cola 1.5L'],price:44.90,oldPrice:55.90,saves:11.00},
];

// BOTTLE IMAGES — real product photos
const FX_MAP={w:'fx-whisky',v:'fx-vodka',g:'fx-gin',r:'fx-rhum',a:'fx-aperitif',ch:'fx-champagne',s:'fx-soft',vi:'fx-vin',l:'fx-liqueur'};
function bottleImg(id,type){
    const vapor=type==='v'?'<div class="vapor-fx" style="position:absolute;bottom:15%;left:20%;width:60%;height:8px;background:radial-gradient(ellipse,rgba(180,220,255,.35),transparent);border-radius:50%;z-index:4;pointer-events:none;opacity:0"></div><div class="vapor-fx" style="position:absolute;bottom:20%;left:30%;width:40%;height:6px;background:radial-gradient(ellipse,rgba(180,220,255,.25),transparent);border-radius:50%;z-index:4;pointer-events:none;opacity:0"></div><div class="vapor-fx" style="position:absolute;bottom:25%;left:25%;width:50%;height:5px;background:radial-gradient(ellipse,rgba(180,220,255,.2),transparent);border-radius:50%;z-index:4;pointer-events:none;opacity:0"></div>':'';
    return `<img src="img/b${id}.png" alt="" loading="lazy">${vapor}`;
}
function fxClass(type){return FX_MAP[type]||'';}

// CART
const ZONE_MINS={'1':25,'2':35,'3':65};
const ZONE_FEES={'1':4.90,'2':9.90,'3':14.90};
let cart={};
let stockData={};
const fmt=n=>n.toFixed(2).replace('.',',')+' €';

function renderFilters(){
    const cats=['Tout',...new Set(PRODUCTS.map(p=>p.cat))];
    document.getElementById('catFilters').innerHTML=cats.map(c=>`<button class="cat-btn ${c==='Tout'?'active':''}" onclick="filterBy('${c}')">${c}</button>`).join('');
}
function filterBy(cat){
    document.querySelectorAll('.cat-btn').forEach(b=>b.classList.toggle('active',b.textContent===cat));
    renderProducts(cat);
}
function renderProducts(filter){
    const inStock=p=>stockData[String(p.id)]!==false;
    const items=(filter==='Tout'?PRODUCTS:PRODUCTS.filter(p=>p.cat===filter)).filter(inStock);
    document.getElementById('productsGrid').innerHTML=items.map(p=>`
        <div class="product-card ${fxClass(p.type)} reveal" id="pc-${p.id}">
            <span class="added-badge" id="ab-${p.id}">Ajouté ✓</span>
            <div class="prod-bottle">${bottleImg(p.id,p.type)}</div>
            <div class="prod-cat">${p.cat}</div>
            <div class="prod-name">${p.name}</div>
            <div class="prod-vol">${p.vol}</div>
            <div class="prod-price">${fmt(p.price)}</div>
            <button class="add-btn" onclick="addToCart(${p.id})">+ Ajouter au panier</button>
        </div>`).join('');
    setTimeout(()=>document.querySelectorAll('.reveal').forEach(el=>observer.observe(el)),80);
}
function renderPacks(){
    document.getElementById('packsGrid').innerHTML=PACKS.map(p=>`
        <div class="pack-card reveal">
            <span class="pack-badge">${p.badge}</span>
            <span class="pack-emoji">${p.emoji}</span>
            <div class="pack-name">${p.name}</div>
            <div class="pack-desc">${p.desc}</div>
            <div class="pack-includes">${p.items.map(i=>`<div class="pack-item">${i}</div>`).join('')}</div>
            <div class="pack-pricing">
                <span class="pack-price">${fmt(p.price)}</span>
                <span class="pack-old">${fmt(p.oldPrice)}</span>
                <span class="pack-saving">−${fmt(p.saves)}</span>
            </div>
            <button class="pack-add" onclick="addPack('${p.id}')">+ Ajouter ce pack</button>
        </div>`).join('');
    setTimeout(()=>document.querySelectorAll('.reveal').forEach(el=>observer.observe(el)),80);
}

let toastTimeout=null;
function addToCart(id){
    const p=PRODUCTS.find(x=>x.id===id);
    if(!cart[id]) cart[id]={...p,qty:0};
    cart[id].qty++;
    updateCartUI();
    const card=document.getElementById('pc-'+id);
    if(card){card.classList.add('just-added');setTimeout(()=>card.classList.remove('just-added'),1500);}
    showToast(p);
}
function addPack(pid){
    const p=PACKS.find(x=>x.id===pid);
    if(!p) return;
    const key='pack_'+pid;
    if(!cart[key]) cart[key]={id:key,name:p.name,vol:'Pack',price:p.price,qty:0,cat:'Pack'};
    cart[key].qty++;
    updateCartUI();
    showToast({name:p.name,cat:'Pack'});
}
/* ── TOAST with smart upsell ── */
function showToast(product){
    const toast=document.getElementById('toast');
    const text=document.getElementById('toastText');
    const upsellDiv=document.getElementById('toastUpsell');
    const upsellText=document.getElementById('toastUpsellText');
    const drinkOptions=document.getElementById('toastDrinkOptions');
    text.textContent=product.name+' ajouté ✓';
    upsellDiv.style.display='none';
    drinkOptions.innerHTML='';
    // Smart upsell based on product category
    const cat=(product.cat||'').toLowerCase();
    if(['whisky','vodka','gin','rhum','liqueur'].includes(cat)){
        // Suggest softs
        const softs=[
            {id:18,name:'Coca-Cola 24×20cl',emoji:'🥤'},
            {id:17,name:'Red Bull 24×25cl',emoji:'⚡'},
            {id:29,name:'Schweppes Tonic 1.5L',emoji:'🍋'}
        ];
        upsellText.textContent='🥤 Ajouter un soft ?';
        softs.forEach(s=>{
            const btn=document.createElement('button');
            btn.className='toast-drink-btn';
            btn.textContent=s.emoji+' '+s.name;
            btn.onclick=()=>{addToCart(s.id);hideToast();};
            drinkOptions.appendChild(btn);
        });
        upsellDiv.style.display='flex';
    } else if(['champagne','vin','apéritif'].includes(cat)){
        // Suggest appetizers/snacks
        upsellText.textContent='🧊 Ajouter un accompagnement ?';
        const suggestions=[
            {id:29,name:'Schweppes Tonic 1.5L',emoji:'🍋'},
            {id:18,name:'Coca-Cola 24×20cl',emoji:'🥤'}
        ];
        suggestions.forEach(s=>{
            const btn=document.createElement('button');
            btn.className='toast-drink-btn';
            btn.textContent=s.emoji+' '+s.name;
            btn.onclick=()=>{addToCart(s.id);hideToast();};
            drinkOptions.appendChild(btn);
        });
        upsellDiv.style.display='flex';
    } else if(cat==='soft'){
        // Suggest spirits
        upsellText.textContent='🍸 Ajouter un spiritueux ?';
        const spirits=[
            {id:1,name:"Jack Daniel's",emoji:'🥃'},
            {id:5,name:'Absolut Vodka',emoji:'🍸'},
            {id:13,name:'Aperol',emoji:'🍹'}
        ];
        spirits.forEach(s=>{
            const btn=document.createElement('button');
            btn.className='toast-drink-btn';
            btn.textContent=s.emoji+' '+s.name;
            btn.onclick=()=>{addToCart(s.id);hideToast();};
            drinkOptions.appendChild(btn);
        });
        upsellDiv.style.display='flex';
    }
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout=setTimeout(hideToast,8000);
}
function hideToast(){
    document.getElementById('toast').classList.remove('show');
    clearTimeout(toastTimeout);
}
function changeQty(id,d){
    if(cart[id]){cart[id].qty+=d;if(cart[id].qty<=0)delete cart[id];}
    updateCartUI();
}
function updateCartUI(){
    const items=Object.values(cart).filter(i=>i.qty>0);
    const wrap=document.getElementById('cartItemsWrap');
    wrap.innerHTML=items.length
        ?items.map(i=>`<div class="cart-item"><div class="ci-info"><div class="ci-name">${i.name}</div><div class="ci-vol">${i.vol} · ${fmt(i.price)}/unit</div></div><div class="ci-controls"><button class="qb" onclick="changeQty('${i.id}',-1)">−</button><span class="ci-qty">${i.qty}</span><button class="qb" onclick="changeQty('${i.id}',1)">+</button></div><div class="ci-price">${fmt(i.price*i.qty)}</div></div>`).join('')
        :'<div class="cart-empty">Votre panier est vide<span style="font-size:2rem;display:block;margin-top:1rem">🍾</span></div>';
    const sub=items.reduce((s,i)=>s+i.price*i.qty,0);
    document.getElementById('cartSubtotalDisplay').textContent=fmt(sub);
    const tot=items.reduce((s,i)=>s+i.qty,0);
    document.getElementById('cartCountNav').textContent=tot;
    document.getElementById('cartPlural').textContent=tot>1?'s':'';
    document.getElementById('cartPill').classList.toggle('visible',tot>0);
    recalc();
}
function recalc(){
    const items=Object.values(cart).filter(i=>i.qty>0);
    const sub=items.reduce((s,i)=>s+i.price*i.qty,0);
    const zone=document.getElementById('zoneSelect').value;
    const warn=document.getElementById('cartWarn'),fee=document.getElementById('cartFeeInfo'),btn=document.getElementById('checkoutBtn');
    const prog=document.getElementById('cartProgress'),cpText=document.getElementById('cpText'),cpFill=document.getElementById('cpFill');
    // Progress bar logic
    if(!items.length){
        prog.classList.remove('visible');
        warn.style.display='none';fee.style.display='none';btn.disabled=true;return;
    }
    const min=zone?ZONE_MINS[zone]:ZONE_MINS['1']; // Default to Zone 1 min if no zone selected
    const remaining=Math.max(0,min-sub);
    const pct=Math.min(100,Math.round((sub/min)*100));
    prog.classList.add('visible');
    cpFill.style.width=pct+'%';
    cpFill.className='cp-fill '+(pct>=100?'full':pct>=60?'mid':'low');
    if(remaining<=0){
        cpText.innerHTML='<span class="cp-success">✅ Minimum atteint !</span> Vous pouvez passer commande';
    } else if(pct>=60){
        cpText.innerHTML='🔥 Plus que <span class="cp-amount">'+fmt(remaining)+'</span> ! Ajoutez un article pour commander';
    } else {
        cpText.innerHTML='🛒 Plus que <span class="cp-amount">'+fmt(remaining)+'</span> pour atteindre le minimum de <span class="cp-amount">'+min+' €</span>';
    }
    // Zone-dependent checkout logic
    if(!zone){warn.style.display='none';fee.style.display='none';btn.disabled=true;return;}
    const actualMin=ZONE_MINS[zone],fr=ZONE_FEES[zone];
    if(sub<actualMin){warn.textContent=`⚠ Minimum ${actualMin}€ pour Zone ${zone} · Actuel : ${fmt(sub)}`;warn.style.display='block';fee.style.display='none';btn.disabled=true;}
    else{warn.style.display='none';fee.style.display='block';fee.textContent=`✓ Livraison : ${fmt(fr)} — Total : ${fmt(sub+fr)}`;btn.disabled=false;}
}

function openCart(){document.getElementById('cartOverlay').classList.add('open');document.getElementById('cartSidebar').classList.add('open');document.body.style.overflow='hidden';}
function closeCart(){document.getElementById('cartOverlay').classList.remove('open');document.getElementById('cartSidebar').classList.remove('open');document.body.style.overflow='';}

function openCheckout(){
    const items=Object.values(cart).filter(i=>i.qty>0);
    const sub=items.reduce((s,i)=>s+i.price*i.qty,0);
    const zone=document.getElementById('zoneSelect').value;
    const fr=ZONE_FEES[zone]||0,total=sub+fr;
    document.getElementById('recapLines').innerHTML=
        items.map(i=>`<div class="recap-line"><span>${i.name} ×${i.qty}</span><span style="color:var(--gold)">${fmt(i.price*i.qty)}</span></div>`).join('')+
        `<div class="recap-line"><span style="opacity:.5">Livraison Zone ${zone}</span><span style="opacity:.5">${fmt(fr)}</span></div><div class="recap-total"><span>TOTAL TTC</span><span>${fmt(total)}</span></div>`;
    document.getElementById('finalAmt').textContent=fmt(total);
    const sn=document.getElementById('stripeSetupNote');if(sn)sn.style.display='none';
    document.getElementById('checkoutModal').classList.add('open');
}
function closeCheckout(){document.getElementById('checkoutModal').classList.remove('open');}

// URL API Vercel
const API_URL = '/api';

async function processOrder(){
    const n=document.getElementById('fName').value.trim();
    const p=document.getElementById('fPhone').value.trim();
    const a=document.getElementById('fAddress').value.trim();
    const e=document.getElementById('fEmail').value.trim();
    const note=document.getElementById('fNote').value.trim();
    const errDiv=document.getElementById('orderError');
    errDiv.style.display='none';

    if(!n||!p||!a||!e){errDiv.textContent='Veuillez remplir tous les champs obligatoires (*)';errDiv.style.display='block';return;}
    if(e&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){errDiv.textContent='Veuillez entrer une adresse email valide';errDiv.style.display='block';return;}

    const btn=document.getElementById('submitBtn');
    btn.disabled=true;
    btn.innerHTML='<span>⏳</span><span>Redirection vers Stripe…</span>';

    const items=Object.values(cart).filter(i=>i.qty>0);
    const zone=document.getElementById('zoneSelect').value;
    const fee=ZONE_FEES[zone]||0;

    try {
        const res = await fetch(API_URL+'/create-checkout', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                items: items.map(i=>({name:i.name, vol:i.vol, price:i.price, qty:i.qty})),
                zone, fee,
                customer: {name:n, phone:p, address:a, email:e, note}
            })
        });
        const data = await res.json();
        if(data.url){
            window.location.href = data.url; // Redirige vers Stripe Checkout
        } else {
            throw new Error(data.error||'Erreur inconnue');
        }
    } catch(err){
        errDiv.textContent='Erreur : '+err.message+' — Réessayez ou appelez-nous au +352 661 47 41 30';
        errDiv.style.display='block';
        btn.disabled=false;
        btn.innerHTML='<span>🔒</span><span>Payer par carte — <span id="finalAmt">'+fmt(items.reduce((s,i)=>s+i.price*i.qty,0)+fee)+'</span></span>';
    }
}
function showSuccess(){
    document.getElementById('checkoutModal').classList.remove('open');
    document.getElementById('successModal').classList.add('open');
    cart={};updateCartUI();
}
function closeSuccess(){document.getElementById('successModal').classList.remove('open');closeCart();}

// MAP
function initMap(){
    const map=L.map('map',{zoomControl:false,scrollWheelZoom:false,dragging:false}).setView([49.507,6.017],11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{opacity:.55,attribution:''}).addTo(map);
    const C=[49.507,6.017];
    L.circle(C,{color:'#22C55E',fillColor:'#22C55E',fillOpacity:.1,weight:2,radius:5000,dashArray:'6 4'}).addTo(map);
    L.circle(C,{color:'#C9A227',fillColor:'#C9A227',fillOpacity:.07,weight:1.5,radius:11000,dashArray:'6 4'}).addTo(map);
    L.circle(C,{color:'#EF4444',fillColor:'#EF4444',fillOpacity:.05,weight:1,radius:19000,dashArray:'6 4'}).addTo(map);
    const icon=L.divIcon({html:'<div style="background:#C9A227;width:13px;height:13px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 14px rgba(201,162,39,.9)"></div>',className:'',iconAnchor:[7,7]});
    L.marker(C,{icon}).bindTooltip('Drix Lux',{permanent:true,direction:'top'}).addTo(map);
}

// PARTICLES
function initParticles(){
    const cv=document.getElementById('particles'),ctx=cv.getContext('2d');
    cv.width=cv.parentElement.offsetWidth;cv.height=cv.parentElement.offsetHeight;
    const pts=Array.from({length:50},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.6+.4,vy:-(Math.random()*.4+.15),vx:(Math.random()-.5)*.22,op:Math.random()*.4+.08,gold:Math.random()>.4}));
    function draw(){ctx.clearRect(0,0,cv.width,cv.height);pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.gold?'#C9A227':'#ffffff';ctx.globalAlpha=p.op;ctx.fill();p.y+=p.vy;p.x+=p.vx;if(p.y<0){p.y=cv.height;p.x=Math.random()*cv.width;}});ctx.globalAlpha=1;requestAnimationFrame(draw);}
    draw();
    window.addEventListener('resize',()=>{cv.width=cv.parentElement.offsetWidth;cv.height=cv.parentElement.offsetHeight;});
}

function enterSite(){
    const ag=document.getElementById('ageGate');
    ag.style.transition='opacity .6s';ag.style.opacity='0';
    setTimeout(()=>{
        ag.style.display='none';
        initParticles();initMap();
        // Re-observe all .reveal elements after age gate is gone
        document.querySelectorAll('.reveal').forEach(el=>{observer.unobserve(el);observer.observe(el);});
        // Fallback: force-check after a short delay
        setTimeout(()=>{
            document.querySelectorAll('.reveal:not(.in)').forEach(el=>{
                const r=el.getBoundingClientRect();
                if(r.top<window.innerHeight&&r.bottom>0) el.classList.add('in');
            });
        },300);
    },600);
}
// Scroll fallback — catches any .reveal elements the observer misses
window.addEventListener('scroll',function(){
    document.querySelectorAll('.reveal:not(.in)').forEach(el=>{
        const r=el.getBoundingClientRect();
        if(r.top<window.innerHeight*1.1&&r.bottom>0) el.classList.add('in');
    });
},{passive:true});

function goTo(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'});}

const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');});},{threshold:.08});

document.addEventListener('DOMContentLoaded',async()=>{
    updateStatusBar();
    setInterval(updateStatusBar,60000);
    // Fetch stock before rendering
    try{const sr=await fetch(API_URL+'/stock');if(sr.ok)stockData=await sr.json();}catch(e){console.warn('Stock check failed');}
    renderFilters();
    renderProducts('Tout');
    renderPacks();
    setTimeout(()=>document.querySelectorAll('.reveal').forEach(el=>observer.observe(el)),200);

    // Gestion retour Stripe
    const params=new URLSearchParams(window.location.search);
    if(params.get('order')==='success'){
        setTimeout(()=>{
            document.getElementById('successModal').classList.add('open');
            cart={};updateCartUI();
            window.history.replaceState({},'','/');
        },500);
    }
    if(params.get('order')==='cancelled'){
        setTimeout(()=>{
            alert('Paiement annulé — votre panier est toujours là si vous souhaitez réessayer.');
            window.history.replaceState({},'','/');
        },500);
    }
});
