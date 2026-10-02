/* ===== EDIT ME ===== */
const CURRENCY = '£';
const DELIVERY_FEE = 2.5;
const MIN_DELIVERY = 15;

/* Direct Unsplash image URLs. Replace any URL with a local path if preferred. */
const IMAGES = {
  hero:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85',
  s1:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  s2:'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=900&q=80',
  s3:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  m1:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  m2:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80',
  m3:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  m4:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80',
  d1:'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80',
  d2:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
  t1:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
  k1:'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
  k2:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80'
};

const MENU = [
  {id:'s1',cat:'Starters',name:'Whipped feta',desc:'Honey, chilli oil, toasted seeds, warm flatbread.',price:7.5,tag:'Vegetarian'},
  {id:'s2',cat:'Starters',name:'Charred halloumi',desc:'Pomegranate, mint and lemon.',price:8,tag:'Vegetarian'},
  {id:'s3',cat:'Starters',name:'Spiced lamb koftas',desc:'Yoghurt, cucumber and sumac onions.',price:9},
  {id:'m1',cat:'Mains',name:'Slow-cooked lamb shoulder',desc:'Eight hours in the oven, with saffron rice.',price:19.5},
  {id:'m2',cat:'Mains',name:'Wood-fired chicken',desc:'Half bird, garlic butter and charred lemon.',price:16.5},
  {id:'m3',cat:'Mains',name:'Roast cauliflower steak',desc:'Tahini, harissa, almonds and herbs.',price:14,tag:'Vegan'},
  {id:'m4',cat:'Mains',name:'Margherita flatbread',desc:'Tomato, mozzarella and basil.',price:11.5,tag:'Vegetarian'},
  {id:'d1',cat:'Sides',name:'Saffron rice',desc:'Butter, barberries and toasted nuts.',price:4.5,tag:'Vegetarian'},
  {id:'d2',cat:'Sides',name:'Smoky fries',desc:'Paprika salt and garlic mayo.',price:4.5},
  {id:'t1',cat:'Desserts',name:'Honey and pistachio cake',desc:'Orange blossom cream.',price:6.5,tag:'Vegetarian'},
  {id:'k1',cat:'Drinks',name:'Fresh mint lemonade',desc:'Pressed to order.',price:3.8,tag:'Vegan'},
  {id:'k2',cat:'Drinks',name:'Turkish coffee',desc:'Served with a square of Turkish delight.',price:3.2}
];
/* ==================== */

const $ = s => document.querySelector(s);
const money = n => CURRENCY + n.toFixed(2);
const cats = ['All', ...new Set(MENU.map(m => m.cat))];
let activeCat = 'All';
let cart = {};
try { cart = JSON.parse(localStorage.getItem('cart') || '{}'); } catch(e) {}

function applyImages(root){
  root.querySelectorAll('.ph').forEach(el => {
    const src = IMAGES[el.dataset.img];
    if (src && !el.querySelector('img')) {
      const img = new Image(); img.src = src; img.alt = '';
      img.onload = () => el.classList.add('has-img');
      el.appendChild(img);
    }
  });
}

function renderChips(){
  $('#chips').innerHTML = cats.map(c => `<button class="chip" aria-pressed="${c===activeCat}" data-cat="${c}">${c}</button>`).join('');
}
function renderMenu(){
  const items = MENU.filter(m => activeCat==='All' || m.cat===activeCat);
  $('#grid').innerHTML = items.map(m => `
    <article class="card">
      <div class="ph" data-img="${m.id}"><span>Photo: ${m.name}</span></div>
      <div class="body">
        ${m.tag ? `<span class="tag">${m.tag}</span>` : ''}
        <h3>${m.name}</h3><p>${m.desc}</p>
        <div class="row"><span class="price">${money(m.price)}</span>
        <button class="add" data-add="${m.id}" aria-label="Add ${m.name} to order">Add</button></div>
      </div>
    </article>`).join('');
  applyImages($('#grid'));
}

function totals(){
  const sub = Object.entries(cart).reduce((s,[id,q]) => s + MENU.find(m=>m.id===id).price*q, 0);
  const delivery = document.querySelector('[name=type]:checked').value === 'delivery';
  const fee = delivery && sub>0 ? DELIVERY_FEE : 0;
  return {sub, fee, total: sub+fee, delivery};
}
function renderCart(){
  const ids = Object.keys(cart);
  const n = ids.reduce((s,id)=>s+cart[id],0);
  $('#count').textContent = n;
  $('#lines').innerHTML = ids.length ? ids.map(id => {
    const m = MENU.find(x=>x.id===id);
    return `<div class="line"><div><b>${m.name}</b><small>${money(m.price)} each</small></div>
      <div class="qty"><button data-dec="${id}" aria-label="Remove one ${m.name}">&minus;</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Add one ${m.name}">+</button></div>
      <b>${money(m.price*cart[id])}</b></div>`;
  }).join('') : '<p class="empty">Your order is empty. Add something from the menu.</p>';
  const t = totals();
  $('#sub').textContent = money(t.sub); $('#fee').textContent = money(t.fee); $('#total').textContent = money(t.total);
  $('#place').disabled = !ids.length;
  $('#addrRow').hidden = !t.delivery;
  try { localStorage.setItem('cart', JSON.stringify(cart)); } catch(e) {}
}

function change(id, d){
  cart[id] = (cart[id]||0) + d;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}
function openCart(o){
  $('#drawer').classList.toggle('open', o);
  $('#overlay').classList.toggle('open', o);
  $('#drawer').setAttribute('aria-hidden', !o);
  if (o) $('#closeCart').focus();
}

/* Replace the body of this function to send orders to your own server or email service. */
async function submitOrder(order){
  // await fetch('/api/orders', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(order)});
  return {ref: 'SS' + Math.floor(1000 + Math.random()*9000)};
}

$('#chips').addEventListener('click', e => {
  const c = e.target.dataset.cat; if (!c) return;
  activeCat = c; renderChips(); renderMenu();
});
$('#grid').addEventListener('click', e => {
  const id = e.target.dataset.add; if (!id) return;
  change(id, 1);
  e.target.textContent = 'Added'; setTimeout(()=>e.target.textContent='Add', 700);
});
$('#lines').addEventListener('click', e => {
  if (e.target.dataset.inc) change(e.target.dataset.inc, 1);
  if (e.target.dataset.dec) change(e.target.dataset.dec, -1);
});
$('#openCart').onclick = () => openCart(true);
$('#closeCart').onclick = $('#overlay').onclick = () => openCart(false);
document.addEventListener('keydown', e => { if (e.key==='Escape') { openCart(false); $('#modal').classList.remove('open'); }});
$('#form').addEventListener('change', renderCart);

$('#place').onclick = async () => {
  const f = $('#form'), d = Object.fromEntries(new FormData(f));
  const t = totals(), err = $('#err');
  if (!d.name.trim() || !/^[\d\s+()-]{7,}$/.test(d.phone.trim())) { err.textContent = 'Enter your name and a valid phone number.'; return; }
  if (t.delivery && !d.address.trim()) { err.textContent = 'Enter a delivery address.'; return; }
  if (t.delivery && t.sub < MIN_DELIVERY) { err.textContent = `Delivery orders start at ${money(MIN_DELIVERY)}. Add more or choose collection.`; return; }
  err.textContent = '';
  $('#place').disabled = true; $('#place').textContent = 'Sending…';
  const order = {customer:d, items:Object.entries(cart).map(([id,qty])=>({id,qty})), ...t};
  try {
    const res = await submitOrder(order);
    $('#mText').textContent = `Thanks ${d.name.split(' ')[0]}. Your order ${res.ref} is confirmed for ${t.delivery?'delivery':'collection'}. Total ${money(t.total)}. We'll call ${d.phone} if there's an issue.`;
    cart = {}; f.reset(); renderCart(); openCart(false);
    $('#modal').classList.add('open'); $('#mClose').focus();
  } catch(e) {
    err.textContent = 'Something went wrong sending your order. Please try again or call us.';
  }
  $('#place').textContent = 'Place order'; renderCart();
};
$('#mClose').onclick = () => $('#modal').classList.remove('open');

$('#yr').textContent = new Date().getFullYear();
applyImages(document);
renderChips(); renderMenu(); renderCart();