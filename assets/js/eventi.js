async function loadEventi() {
  const res = await fetch("content/events.json");
  const data = await res.json();
  const now = new Date();
  const prossimi = [],
    passati = [];

  for (const e of data.eventi) {
    const d = new Date(e.data + "T00:00:00");
    const mdRes = await fetch(e.md);
    const mdText = await mdRes.text();
    const htmlText = marked.parse(mdText);

    const cardHTML = `
        <article class="event-card">
          <img src="${e.img}" alt="${e.titolo}">
          <div class="event-body">
            <h3>${e.titolo}</h3>
            <p class="event-meta">📅 ${d.toLocaleDateString("it-IT")} — 📍 ${
      e.luogo
    }</p>
            <div class="event-content">${htmlText}</div>
          </div>
        </article>
      `;

    if (d >= now) prossimi.push({ date: d, html: cardHTML });
    else passati.push({ date: d, html: cardHTML });
  }

  prossimi.sort((a, b) => a.date - b.date);
  passati.sort((a, b) => b.date - a.date);

  document.getElementById("eventi-prossimi").innerHTML = prossimi
    .map((e) => e.html)
    .join("");
  document.getElementById("eventi-passati").innerHTML = passati
    .map((e) => e.html)
    .join("");
}

document.addEventListener("DOMContentLoaded", loadEventi);
