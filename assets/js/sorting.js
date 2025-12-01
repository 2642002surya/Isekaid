import { safeInt } from './format.js';

function cmp(a,b,dir){
  if(typeof a === 'string' && typeof b === 'string'){
    return dir === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  }
  return dir === 'asc' ? (a - b) : (b - a);
}

// map selectable keys to extractors
const keyGetters = {
  name: x => x.name || '',
  rarity: x => x.rarity || '',
  quality: x => x.quality || '',
  'which bis': x => x.which_bis || '',
  strength: x => safeInt(x.strength),
  intelligence: x => safeInt(x.intelligence),
  defense: x => safeInt(x.defense),
  dexterity: x => safeInt(x.dexterity),
  health: x => safeInt(x.health),
  price: x => Number(String(x.price||'').replace(/[^0-9.-]+/g,'')) || 0
};

export function getSortableKeys(){
  return Object.keys(keyGetters);
}

export function multiSort(items, primaryKey, primaryDir, secondaryKey, secondaryDir){
  if(!primaryKey) return items;
  const p = keyGetters[primaryKey];
  const s = secondaryKey ? keyGetters[secondaryKey] : null;
  return items.slice().sort((a,b)=>{
    const av = p(a), bv = p(b);
    const first = cmp(av,bv,primaryDir);
    if(first !== 0 || !s) return first;
    const av2 = s(a), bv2 = s(b);
    return cmp(av2,bv2,secondaryDir);
  });
}
