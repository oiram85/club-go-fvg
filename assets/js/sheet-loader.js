function normalizeRank(rankRaw) {
  if (!rankRaw) return { type: "", val: 999, label: "" };
  const r = String(rankRaw).toLowerCase().replace(/\s+/g, "");
  const m = r.match(/^(\d+)(dan|kyu)$/); // es: 3dan, 10kyu
  if (!m) return { type: "", val: 999, label: rankRaw };
  const num = parseInt(m[1], 10);
  const type = m[2];
  let sortVal = 0;
  if (type === "dan") sortVal = 100 - num; // 5dan → 95, 1dan → 99
  if (type === "kyu") sortVal = 200 + num; // 1kyu → 201, 10kyu → 210
  return { type, val: sortVal, label: num + " " + type };
}

function parseCSV(text) {
  const rows = [];
  let row = [],
    i = 0,
    field = "",
    inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c !== "\r") {
        field += c;
      }
    }
    i++;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function renderIscritti(data, mountSelector) {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  const header = data[0].map((h) => h.trim().toLowerCase());
  const idxNome = header.indexOf("nome (name)");
  const idxCognome = header.indexOf("cognome (surname)");
  const idxRank = header.indexOf("rank");
  const idxClub = header.indexOf("go club");
  const idxPin = header.indexOf(
    "egd pin (vuoto se non si è su egd/empty if you are not on egd)"
  );
  const idxTurni = header.indexOf(
    "sarò presente ai seguenti turni (i will be present to the following rounds)"
  );

  const body = data
    .slice(1)
    .filter((r) => r.some((c) => (c || "").trim().length));

  const iscritti = body
    .map((r) => {
      const nome = (r[idxNome] || "").trim();
      const cognome = (r[idxCognome] || "").trim();
      const rankRaw = (r[idxRank] || "").trim();
      const turni = (r[idxTurni] || "").trim();
      const club = (r[idxClub] || "").trim();
      const egdpin = (r[idxPin] || "").trim();
      const rk = normalizeRank(rankRaw);
      return {
        nome,
        cognome,
        turni,
        club,
        egdpin,
        rank: rk.label,
        sort: rk.val,
      };
    })
    .filter((p) => p.nome || p.cognome);

  iscritti.sort(
    (a, b) => a.sort - b.sort || a.cognome.localeCompare(b.cognome)
  );

  // tabella desktop
  let tableHTML = `
    <table class="iscritti-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Cognome</th>
          <th>Rank</th>
          <th>EGD Pin</th>
          <!--<th>Turni</th>-->
          <th>Club</th>
        </tr>
      </thead>
      <tbody>
        ${iscritti
          .map(
            (p) => `
          <tr>
            <td>${p.nome}</td>
            <td>${p.cognome}</td>
            <td><span class="badge-rank">${p.rank}</span></td>
            <td>${p.egdpin}</td>
            <!--<td>${p.turni}</td>-->
            <td>${p.club}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  // cards mobile
  let cardsHTML = `
    <div class="iscritti-cards">
      ${iscritti
        .map(
          (p) => `
        <div class="iscritto-card">
          <h4>${p.nome} ${p.cognome}</h4>
          <span class="badge-rank">${p.rank}</span> 
          <h4>${p.club}</h4>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  mount.innerHTML = tableHTML + cardsHTML;
}

async function loadIscritti(sheetCsvUrl, mountSelector) {
  try {
    const res = await fetch(sheetCsvUrl + "&_=" + Date.now());
    if (!res.ok) throw new Error("CSV non disponibile");
    const text = await res.text();
    const rows = parseCSV(text);
    renderIscritti(rows, mountSelector);
  } catch (e) {
    console.error(e);
    const mount = document.querySelector(mountSelector);
    if (mount) {
      mount.innerHTML =
        '<p class="muted small">Lista iscritti non disponibile al momento.</p>';
    }
  }
}
