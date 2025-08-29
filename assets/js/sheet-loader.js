function normalizeRank(rankRaw){
  if (!rankRaw) return {type:'', val:999};
  const r = String(rankRaw).toLowerCase().replace(/\s+/g,'');
  const m = r.match(/^(\d+)([dk])$/); // e.g., 3d, 10k
  if (!m) return {type:'', val:999};
  const num = parseInt(m[1], 10);
  const type = m[2];
  // order: higher dan first (e.g., 5d before 1d), then kyu ascending (1k before 2k)
  let sortVal = 0;
  if (type === 'd') sortVal = 100 - num; // 5d -> 95, 1d -> 99
  if (type === 'k') sortVal = 200 + num; // 1k -> 201, 10k -> 210
  return {type, val:sortVal, label: (num + (type==='d'?'d':'k'))};
}

// basic CSV parser (handles quoted fields)
function parseCSV(text){
  const rows = [];
  let row = [], i = 0, field = '', inQuotes = false;
  while (i < text.length){
    const c = text[i];
    if (inQuotes){
      if (c === '"'){
        if (text[i+1] === '"'){ field += '"'; i++; }
        else inQuotes = false;
      } else { field += c; }
    } else {
      if (c === '"'){ inQuotes = true; }
      else if (c === ','){ row.push(field); field = ''; }
      else if (c === '\n'){ row.push(field); rows.push(row); row = []; field=''; }
      else if (c === '\r'){ /* skip */ }
      else { field += c; }
    }
    i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function renderIscritti(data, mountSelector){
  const mount = document.querySelector(mountSelector);
  if (!mount) return;
  // Expect columns: Nome, Cognome, Email, Rank
  const header = data[0].map(h => h.trim().toLowerCase());
  const idxNome = header.indexOf('nome');
  const idxCognome = header.indexOf('cognome');
  const idxRank = header.indexOf('rank') >= 0 ? header.indexOf('rank') : header.indexOf('livello');
  const body = data.slice(1).filter(r => r.some(c => (c||'').trim().length));

  const iscritti = body.map(r => {
    const nome = (r[idxNome]||'').trim();
    const cognome = (r[idxCognome]||'').trim();
    const rankRaw = (r[idxRank]||'').trim();
    const rk = normalizeRank(rankRaw);
    return { nome, cognome, rank: rk.label, sort: rk.val };
  }).filter(p => p.nome || p.cognome);

  iscritti.sort((a,b) => a.sort - b.sort || a.cognome.localeCompare(b.cognome));

  mount.innerHTML = iscritti.map(p => `
    <div class="iscritto">
      <h4>${p.nome} ${p.cognome}</h4>
      <span class="badge-rank">${p.rank}</span>
    </div>
  `).join('');
}

async function loadIscritti(sheetCsvUrl, mountSelector){
  try{
    const res = await fetch(sheetCsvUrl + '&_=' + Date.now());
    if (!res.ok) throw new Error('CSV non disponibile');
    const text = await res.text();
    const rows = parseCSV(text);
    renderIscritti(rows, mountSelector);
  }catch(e){
    console.error(e);
    const mount = document.querySelector(mountSelector);
    if (mount) mount.innerHTML = '<p class="muted small">Lista iscritti non disponibile al momento.</p>';
  }
}
