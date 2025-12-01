export function filterBySearch(items, q){
  if(!q) return items;
  q = q.toLowerCase();
  return items.filter(it => (it.name||'').toLowerCase().includes(q) || (it.rarity||'').toLowerCase().includes(q) || (it.weapon_type||'').toLowerCase().includes(q));
}
