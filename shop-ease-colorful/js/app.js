const state={products:PRODUCTS.slice(),page:0,perPage:6,cart:JSON.parse(localStorage.getItem('cart')||'{}')};
const productsEl=document.getElementById('products');
const loadMoreBtn=document.getElementById('load-more');
const cartBtn=document.getElementById('cart-btn');
const cartDrawer=document.getElementById('cart-drawer');
const closeCart=document.getElementById('close-cart');
const cartItemsEl=document.getElementById('cart-items');
const cartTotal=document.getElementById('cart-total');
const cartCount=document.getElementById('cart-count');
const modal=document.getElementById('modal');
const modalClose=document.getElementById('modal-close');
const modalImages=document.getElementById('modal-images');
const modalTitle=document.getElementById('modal-title');
const modalPrice=document.getElementById('modal-price');
const modalDesc=document.getElementById('modal-desc');
const modalQty=document.getElementById('modal-qty');
const modalAdd=document.getElementById('modal-add');

function formatPrice(p){return '₹'+p;}
function renderProducts(reset=false){
 if(reset){productsEl.innerHTML='';state.page=0;}
 const start=state.page*state.perPage;
 const list=PRODUCTS;
 const slice=list.slice(start,start+state.perPage);
 slice.forEach(p=>productsEl.appendChild(card(p)));
 state.page++;
 if(state.page*state.perPage>=list.length)loadMoreBtn.style.display='none';
}
function card(p){
 const c=document.createElement('div');c.className='product-card';
 c.innerHTML=`<img src="${p.images[0]}" alt=""><div class="product-meta"><span>${formatPrice(p.price)}</span><button class="btn">View</button></div>`;
 c.querySelector('.btn').onclick=()=>openModal(p);
 return c;
}
function openModal(p){
 modal.classList.add('show');
 modalTitle.textContent=p.name;
 modalPrice.textContent=formatPrice(p.price);
 modalDesc.textContent=p.desc;
 modalImages.innerHTML=`<img src="${p.images[0]}"><img src="${p.images[1]}">`;
 modalAdd.onclick=()=>{addToCart(p.id,Number(modalQty.value));closeModal();};
}
function closeModal(){modal.classList.remove('show');}
function addToCart(id,qty=1){state.cart[id]=(state.cart[id]||0)+qty;persist();updateCart();}
function removeFromCart(id){delete state.cart[id];persist();updateCart();}
function persist(){localStorage.setItem('cart',JSON.stringify(state.cart));}
function updateCart(){
 cartItemsEl.innerHTML='';let total=0,count=0;
 for(const [id,qty] of Object.entries(state.cart)){
   const p=PRODUCTS.find(x=>x.id===id);if(!p)continue;
   total+=p.price*qty;count+=qty;
   const row=document.createElement('div');row.className='cart-row';
   row.innerHTML=`<span>${p.name} x ${qty}</span><span>${formatPrice(p.price*qty)} <button class="btn ghost">Remove</button></span>`;
   row.querySelector('button').onclick=()=>removeFromCart(id);
   cartItemsEl.appendChild(row);
 }
 cartTotal.textContent=total;cartCount.textContent=count;
}

cartBtn.onclick=()=>cartDrawer.classList.add('show');
closeCart.onclick=()=>cartDrawer.classList.remove('show');
window.addEventListener('click',e=>{if(e.target===modal)closeModal();});
modalClose.onclick=closeModal;
loadMoreBtn.onclick=()=>renderProducts();

renderProducts();updateCart();
