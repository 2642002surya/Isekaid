import { loadData } from './data.js';
import { filterBySearch } from './filters.js';
import { getSortableKeys, multiSort } from './sorting.js';
import { renderCards, renderGrid, renderTable } from './views.js';
import { wireCartUI } from './ui.js';
import { formatPrice } from './format.js';

// boot
const RESULTS = document.getElementById('results');
const search = document.getElementById('search');
const primarySort = document.getElementById('primarySort');
const primaryDir = document.getElementById('primaryDir');
const secondarySort = document.getElementById('secondarySort');
const secondaryDir = document.getElementById('secondaryDir');
const presetButtons = document.querySelectorAll('.preset-buttons button');
const viewButtons = document.querySelectorAll('.view-toggle button');

let RAW = [];
let VIEW = 'cards'; // 'cards'|'grid'|'table'
let UI_CART;

function populateSortOptions(){
  const keys = getSortableKeys();
  keys.forEach(k=>{
    const o1 = document.createElement('option'); o1.value = k; o1.textContent = k;
    const o2 = o1.cloneNode(true);
    primarySort.appendChild(o1);
    secondarySort.appendChild(o2);
  });
}

function renderCurrent(){
  // filter by search & rank/rarity already handled by data loader
  const q = search.value.trim();
  let data = filterBySearch(RAW, q);
  const pKey = primarySort.value;
  const pDir = primaryDir.value;
  const sKey = secondarySort.value;
  const sDir = secondaryDir.value;
  if(pKey) data = multiSort(data, pKey, pDir, sKey, sDir);

  // render based on VIEW
  RESULTS.classList.remove('cards-view','grid-view','table-view');
  if(VIEW === 'cards') { RESULTS.classList.add('cards-view'); renderCards(data, RESULTS); }
  else if(VIEW === 'grid') { RESULTS.classList.add('grid-view'); renderGrid(data, RESULTS); }
  else { RESULTS.classList.add('table-view'); renderTable(data, RESULTS); }

  // wire add-to-cart buttons (delegation)
  RESULTS.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      const card = ev.target.closest('[data-item-id]');
      const id = card.dataset.itemId;
      // find item in data
      const item = data.find(x => (x.id||x.name) == id);
      if(!item) return;
      const qtyInput = card.querySelector('[data-qty]');
      const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1));
      UI_CART.addAndRefresh(item, qty);
    });
  });

  // in table view, qty inputs exist in table rows too
  RESULTS.querySelectorAll('button[data-add]').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      const row = ev.target.closest('tr');
      const id = row.dataset.itemId;
      const item = data.find(x => (x.id||x.name) == id);
      if(!item) return;
      const qtyInput = row.querySelector('[data-qty]');
      const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1));
      UI_CART.addAndRefresh(item, qty);
    });
  });
}

// presets: tank, mage, bruiser, balanced
function applyPreset(name){
  if(name === 'tank'){
    primarySort.value = 'defense'; primaryDir.value = 'desc';
    secondarySort.value = 'health'; secondaryDir.value = 'desc';
  } else if(name === 'mage'){
    primarySort.value = 'intelligence'; primaryDir.value = 'desc';
    secondarySort.value = 'dexterity'; secondaryDir.value = 'desc';
  } else if(name === 'bruiser'){
    primarySort.value = 'strength'; primaryDir.value = 'desc';
    secondarySort.value = 'defense'; secondaryDir.value = 'desc';
  } else {
    primarySort.value = 'strength'; primaryDir.value = 'desc';
    secondarySort.value = 'intelligence'; secondaryDir.value = 'desc';
  }
  renderCurrent();
}

(async function init(){
  RAW = await loadData();
  populateSortOptions();

  // wire cart
  UI_CART = wireCartUI(document.body);

  // initial render
  renderCurrent();

  // events
  search.addEventListener('input', ()=> renderCurrent());
  primarySort.addEventListener('change', () => renderCurrent());
  primaryDir.addEventListener('change', () => renderCurrent());
  secondarySort.addEventListener('change', () => renderCurrent());
  secondaryDir.addEventListener('change', () => renderCurrent());
  presetButtons.forEach(b => b.addEventListener('click', e => applyPreset(e.target.dataset.preset)));
  viewButtons.forEach(b => b.addEventListener('click', e=>{
    viewButtons.forEach(x=>x.classList.remove('active'));
    e.target.classList.add('active');
    VIEW = e.target.dataset.view;
    renderCurrent();
  }));

})();
