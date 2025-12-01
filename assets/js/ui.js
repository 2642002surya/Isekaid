// assets/js/ui.js
import { addToCart as addItemToCart, getCart, removeFromCart, updateQty, clearCart, cartSummary, cartIdList } from './cart.js';

export function wireCartUI(root){
  const cartEl = document.getElementById('cart');
  const toggle = document.getElementById('cart-toggle');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const cartItems = document.getElementById('cart-items');
  const cartClear = document.getElementById('cart-clear');
  const cartCheckout = document.getElementById('cart-checkout');
  const cartTotalBottom = document.getElementById('cart-total-bottom');

  // additional ID display area
  function renderIdsArea(){
    let idsDiv = document.getElementById('cart-ids');
    if(!idsDiv){
      idsDiv = document.createElement('div');
      idsDiv.id = 'cart-ids';
      idsDiv.style.marginTop = '10px';
      idsDiv.style.display = 'flex';
      idsDiv.style.gap = '8px';
      idsDiv.style.alignItems = 'center';
      // insert before actions
      cartItems.parentNode.insertBefore(idsDiv, cartItems.nextSibling);
    }
    const idList = cartIdList();
    idsDiv.innerHTML = `
      <div style="font-size:13px;color:var(--muted)">IDs:</div>
      <input id="cart-ids-input" style="flex:1;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:#fff" value="${idList}" readonly />
      <button id="copy-ids" class="ghost">Copy IDs</button>
    `;

    // copy button behavior
    const copyBtn = document.getElementById('copy-ids');
    copyBtn.addEventListener('click', () => {
      const input = document.getElementById('cart-ids-input');
      input.select();
      try {
        document.execCommand('copy');
        copyBtn.textContent = 'Copied';
        setTimeout(()=> copyBtn.textContent = 'Copy IDs', 1200);
      } catch (e) {
        alert('Copy failed — select and copy manually: ' + input.value);
      }
    });
  }

  function refreshCart(){
    const { totalItems, totalValue, totalFormatted } = cartSummary();
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalFormatted || '0';
    cartTotalBottom.textContent = totalFormatted || '0';

    const items = getCart();
    cartItems.innerHTML = '';
    items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.dataset.id = it.id;
      div.innerHTML = `
        <div style="display:flex;flex-direction:column">
          <div><b>${it.name}</b></div>
          <div style="font-size:12px;color:var(--muted)">ID: ${it.id}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <input style="width:64px;padding:6px;border-radius:6px" type="number" min="1" value="${it.qty}" data-cart-qty />
          <button data-remove class="ghost">Remove</button>
        </div>
      `;
      cartItems.appendChild(div);
    });

    // render ids area and set input value
    renderIdsArea();
  }

  // toggle open/close
  let open = false;
  function setOpen(v){
    open = v;
    if(open){ cartEl.classList.remove('cart-closed'); cartEl.classList.add('cart-open'); toggle.textContent = 'Close'; }
    else { cartEl.classList.add('cart-closed'); cartEl.classList.remove('cart-open'); toggle.textContent = 'Open'; }
  }
  toggle.addEventListener('click', ()=> setOpen(!open));

  cartClear.addEventListener('click', () => { clearCart(); refreshCart(); });

  cartCheckout.addEventListener('click', () => {
    const { totalItems, totalFormatted } = cartSummary();
    const ids = cartIdList();
    alert(`COSMETIC CHECKOUT\nItems: ${totalItems}\nTotal: ${totalFormatted}\nIDs: ${ids}\n\nThis is only a price calculator. No data stored.`);
  });

  // delegate remove & qty change
  cartItems.addEventListener('click', (ev) => {
    const rem = ev.target.closest('[data-remove]');
    if (rem) {
      const id = rem.closest('.cart-item').dataset.id;
      removeFromCart(id);
      refreshCart();
    }
  });

  cartItems.addEventListener('change', (ev) => {
    const q = ev.target.closest('[data-cart-qty]');
    if (q) {
      const p = q.closest('.cart-item');
      const id = p.dataset.id;
      const val = Math.max(1, parseInt(q.value || 1));
      updateQty(id, val);
      refreshCart();
    }
  });

  // expose helper for other modules
  return { refreshCart, addAndRefresh: (item, qty=1) => { addItemToCart(item, qty); refreshCart(); } };
}
