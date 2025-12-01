// Format price (unchanged)
export function formatPrice(value, currency){
  if(value===undefined || value===null || value==='') return '';
  const n = Number(String(value).replace(/[^0-9.-]+/g,''));
  if(Number.isNaN(n)) return value;
  return new Intl.NumberFormat().format(n) + (currency ? ` ${currency}` : '');
}

export function safeInt(x){
  const n = parseInt(x);
  return Number.isNaN(n) ? 0 : n;
}

// NEW — parse "stats" string into array
export function parseStatsString(raw){
  if(!raw) return [];
  return raw.split(',')
            .map(x => x.trim().toLowerCase())
            .filter(Boolean)
            .map(x => {
              const [name, value] = x.split(':').map(p => p.trim());
              return { name, value: Number(value || 0) };
            });
}

// NEW — summarize counts (condensed stats view)
export function summarizeStats(statsArray){
  const out = {};
  for(const s of statsArray){
    out[s.name] = (out[s.name] || 0) + 1;
  }
  return out; // example: { intelligence: 3, health: 1 }
}

// Capitalize utility
export function capitalize(str){
  if(!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
