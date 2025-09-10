const eventiProssimi = document.getElementById("eventi-prossimi");
const eventiPassati = document.getElementById("eventi-passati");

// Funzione per creare la card
function creaCard(titolo, testo, imgSrc) {
  const card = document.createElement("div");
  card.className = "card-evento";
  card.innerHTML = `
    <img src="${imgSrc}" alt="${titolo}">
    <h3>${titolo}</h3>
    <p>${testo}</p>
  `;
  return card;
}

// Funzione per caricare il markdown
async function caricaEventi() {
  const response = await fetch("./content/events.json");
  const eventi = await response.json();

  for (const evento of eventi.prossimi) {
    const mdResp = await fetch(evento.md);
    let testo = await mdResp.text();
    // Trasforma h1 in h3
    testo = testo.replace(/^# (.*)$/gm, "### $1");
    const html = marked.parse(testo);
    eventiProssimi.appendChild(creaCard(evento.titolo, html, evento.img));
  }

  for (const evento of eventi.passati) {
    const mdResp = await fetch(evento.md);
    let testo = await mdResp.text();
    testo = testo.replace(/^# (.*)$/gm, "### $1");
    const html = marked.parse(testo);
    eventiPassati.appendChild(creaCard(evento.titolo, html, evento.img));
  }
}

caricaEventi();
