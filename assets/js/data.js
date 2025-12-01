// assets/js/data.js
import { csvToObjects } from './lib/csv.js';

// your published CSV URL (already provided)
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTubYyjpwN1iI_aehty3fzEyFT3QrVGvBuS1ufRMmDcfM9coq7YNkj-FZvLKUCdTUdFqD9Hea3uAbx8/pub?output=csv";

function stripQuotes(s){
  if(!s && s !== 0) return '';
  return String(s).replace(/^"(.*)"$/, '$1').replace(/(^["“”\s]+|["”\s]+$)/g,'').trim();
}

export async function loadData(){
  const res = await fetch(CSV_URL, { cache: 'no-store' });
  const txt = await res.text();
  const rows = csvToObjects(txt);

  // normalize and map fields
  const mapped = rows.map(r => {
    // lowercase keys already set in csvToObjects
    const get = k => stripQuotes(r[k] || r[k.toLowerCase()] || '');

    return {
      // primary identifiers
      id: get('id') || get('item_id') || get('unique id') || '',
      name: get('name') || '',
      rarity: (get('rarity') || '').toUpperCase(),
      rank: (get('rank') || '').toString(),
      stats: get('stats') || '',
      // numeric stat columns if present (we won't show raw numeric tags)
      strength: get('strength') || '0',
      intelligence: get('intelligence') || '0',
      defense: get('defense') || '0',
      dexterity: get('dexterity') || '0',
      health: get('health') || '0',
      weapon_type: get('weapon type') || get('weapon_type') || '',
      quality: get('quality') || '',
      which_bis: get('which bis') || get('which_bis') || get('Which BIS') || '',
      price: get('price') || '',
      currency: get('currency') || ''
    };
  });

  // filter only B/C and rank 5
  return mapped.filter(it => (it.rarity === 'B' || it.rarity === 'C') && it.rank === '5');
}
