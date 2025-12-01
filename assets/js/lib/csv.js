// assets/js/lib/csv.js
// Robust CSV parser supporting quoted fields & commas inside quotes

export function parseCSVToRows(text) {
  const rows = [];
  let cur = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        field += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }

      if (ch === ',') {
        cur.push(field);
        field = '';
        i++;
        continue;
      }

      if (ch === '\r') {
        i++;
        continue;
      }

      if (ch === '\n') {
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = '';
        i++;
        continue;
      }

      field += ch;
      i++;
      continue;
    }
  }

  // Push last row if remaining
  if (field !== '' || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }

  return rows;
}

// Convert array-of-arrays to array-of-objects
export function csvToObjects(csvText) {
  const rows = parseCSVToRows(csvText);
  if (!rows.length) return [];

  const headers = rows[0].map(h => (h || '').toString().trim().toLowerCase());
  const objs = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row.length) continue;

    const emptyRow = row.every(cell => (cell || '').trim() === '');
    if (emptyRow) continue;

    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c] || `col${c}`;
      obj[key] = row[c] !== undefined ? row[c].trim() : '';
    }
    objs.push(obj);
  }

  return objs;
}
