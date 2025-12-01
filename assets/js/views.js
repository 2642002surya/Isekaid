// assets/js/views.js
import { formatPrice } from './format.js';
import { parseStatsString, summarizeStats, capitalize } from './format.js';

function tagEl(content, klass){
  if(!content) return '';
  return `<span class="tag ${klass}">${content}</span>`;
}

/* ------------------------------
   CARD VIEW
   ------------------------------ */
export function renderCards(items, container){
  container.innerHTML = '';

  items.forEach(it => {
    const el = document.createElement('div');
    el.className = `card big-card rank-r5 ${it.rarity === 'B' ? 'rarity-B' : 'rarity-C'}`;

    // sanitize and parse stats (remove stray quotes)
    const rawStats = (it.stats || '').replace(/["“”]/g, '').trim();
    const statsArray = parseStatsString(rawStats);
    const summary = summarizeStats(statsArray);

    // Build HTML - show ID (if present) under name
    el.innerHTML = `
      <div class="item-header">
        <div class="item-name">${it.name}</div>
        ${it.id ? `<div class="item-id" style="font-size:12px;color:var(--muted);margin-top:6px">ID: <b>${it.id}</b></div>` : ''}
      </div>

      <div class="tags" style="margin-top:10px">
        ${tagEl(it.rarity, `tag-rarity ${it.rarity==='B' ? 'b' : 'c'}`)}
        ${tagEl('Rank 5', 'tag')}
        ${tagEl(it.quality, 'tag')}
        ${tagEl(it.which_bis, 'tag')}
        ${tagEl(it.weapon_type, 'tag')}
      </div>

      <div class="stats" data-mode="summary" style="margin-top:12px">

        <!-- SUMMARY (DEFAULT) -->
        <div class="summary-stats">
          ${Object.entries(summary).length ? Object.entries(summary)
            .map(([name,count]) => `${capitalize(name)}: ${count}`)
            .join('<br>') : '<span style="color:var(--muted)">No stat rolls listed</span>'}
        </div>

        <!-- DETAILED (HIDDEN) -->
        <div class="detailed-stats" style="display:none;">
          ${statsArray.length ? statsArray.map(s => `${capitalize(s.name)}: ${s.value}`).join('<br>')
            : '<span style="color:var(--muted)">No detailed lines</span>'}
        </div>

        <button class="toggle-stats ghost stats-btn" style="margin-top:10px">Show Detailed</button>
      </div>

      <div class="buy-area" style="margin-top:14px">
        <input type="number" min="1" value="1" class="qty-input" data-qty />
        <button data-add class="ghost add-btn">Add to cart</button>
      </div>
    `;

    container.appendChild(el);

    // toggle behavior
    const toggleBtn = el.querySelector('.toggle-stats');
    const summaryDiv = el.querySelector('.summary-stats');
    const detailedDiv = el.querySelector('.detailed-stats');
    const statsBlock = el.querySelector('.stats');

    toggleBtn.addEventListener('click', () => {
      const mode = statsBlock.dataset.mode;
      if (mode === 'summary') {
        summaryDiv.style.display = 'none';
        detailedDiv.style.display = 'block';
        statsBlock.dataset.mode = 'detailed';
        toggleBtn.textContent = 'Show Summary';
      } else {
        summaryDiv.style.display = 'block';
        detailedDiv.style.display = 'none';
        statsBlock.dataset.mode = 'summary';
        toggleBtn.textContent = 'Show Detailed';
      }
    });

    // store id
    el.dataset.itemId = it.id || it.name;
  });
}

/* ------------------------------
   GRID VIEW
   ------------------------------ */
export function renderGrid(items, container){
  container.classList.remove('cards-view');
  container.classList.add('grid-view');
  // small tweak: reuse cards rendering
  renderCards(items, container);
}

/* ------------------------------
   TABLE VIEW
   ------------------------------ */
export function renderTable(items, container){
  container.innerHTML = '';
  container.classList.remove('cards-view','grid-view');
  container.classList.add('table-view');

  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';

  const table = document.createElement('table');
  table.className = 'neon-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Name (ID)</th>
      <th>Rarity</th>
      <th>Quality</th>
      <th>BIS</th>
      <th>Summary Stats</th>
      <th>Price</th>
      <th>Action</th>
    </tr>
  `;

  const tbody = document.createElement('tbody');

  items.forEach(it => {
    const rawStats = (it.stats || '').replace(/["“”]/g, '').trim();
    const statsArray = parseStatsString(rawStats);
    const summary = summarizeStats(statsArray);

    const tr = document.createElement('tr');

    const nameCell = `${it.name}${it.id ? ` <span style="color:var(--muted)">(${it.id})</span>` : ''}`;

    tr.innerHTML = `
      <td>${nameCell}</td>
      <td>${it.rarity}</td>
      <td>${it.quality}</td>
      <td>${it.which_bis}</td>
      <td>${Object.entries(summary).length ? Object.entries(summary).map(([n,c]) => `${capitalize(n)}: ${c}`).join('<br>') : ''}</td>
      <td>${it.price ? formatPrice(it.price,it.currency) : ''}</td>
      <td>
        <input type="number" min="1" value="1" class="qty-input-small" data-qty />
        <button data-add class="ghost">Add</button>
      </td>
    `;

    tr.dataset.itemId = it.id || it.name;
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  wrap.appendChild(table);
  container.appendChild(wrap);
}
