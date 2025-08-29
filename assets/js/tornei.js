async function loadTornei(){
  try{
    const res = await fetch('content/tornei.json?_=' + Date.now());
    const data = await res.json();
    const now = new Date();
    const futuri = [];
    const passati = [];
    (data.tornei || []).forEach(t => {
      const dt = new Date(t.data + 'T00:00:00');
      (dt >= now ? futuri : passati).push(t);
    });
    futuri.sort((a,b) => new Date(a.data) - new Date(b.data));
    passati.sort((a,b) => new Date(b.data) - new Date(a.data));

    function card(t){
      return `<article class="t-card">
        <span class="tag">${new Date(t.data).toLocaleDateString('it-IT')}</span>
        <h3>${t.titolo}</h3>
        <div class="t-meta"><span>📍 ${t.luogo}</span></div>
        <a class="btn btn-primary small" href="${t.url}">Dettagli</a>
      </article>`;
    }

    document.getElementById('tornei-futuri').innerHTML = futuri.map(card).join('') || '<p class="muted">Nessun torneo futuro al momento.</p>';
    document.getElementById('tornei-passati').innerHTML = passati.map(card).join('') || '<p class="muted">Nessun torneo archiviato.</p>';
  }catch(e){
    console.error(e);
    document.getElementById('tornei-futuri').innerHTML = '<p class="muted">Impossibile caricare i tornei.</p>';
  }
}
document.addEventListener('DOMContentLoaded', loadTornei);
