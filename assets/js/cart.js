// assets/js/cart.js
import { formatPrice } from './format.js';

let CART = [];

// helpers
function findIndex(id){ return CART.findIndex(c => c.id === id); }

export function addToCart(item, qty = 1){
  const id = item.id || item.name;
  const idx = findIndex(id);
  if (idx >= 0) {
    CART[idx].qty += qty;
  } else {
    CART.push({
      id,
      name: item.name,
      price: item.price || 0,
      currency: item.currency || '',
      qty
    });
  }
  return CART.slice();
}

export function removeFromCart(id){
  CART = CART.filter(c => c.id !== id);
  return CART.slice();
}

export function updateQty(id, qty){
  const idx = findIndex(id);
  if (idx >= 0) CART[idx].qty = qty;
  return CART.slice();
}

export function clearCart(){
  CART = [];
  return CART.slice();
}

export function getCart(){
  return CART.slice();
}

export function cartSummary(){
  const totalItems = CART.reduce((s,i)=> s + (i.qty||0), 0);
  const totalValue = CART.reduce((s,i)=> s + (Number(String(i.price||0).replace(/[^0-9.-]+/g,''))||0) * (i.qty||0), 0);
  return { totalItems, totalValue, totalFormatted: formatPrice(totalValue) };
}

// NEW: return list of IDs as string "ID1,ID2,ID3"
export function cartIdList(){
  // repeat ID per qty
  const arr = [];
  CART.forEach(item => {
    const count = Math.max(1, Number(item.qty || 1));
    for (let i = 0; i < count; i++) arr.push(item.id);
  });
  return arr.join(',');
}
