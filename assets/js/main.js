// Mobile nav toggle & map init
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.hamburger');
  if (burger){
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Map
  const mapEl = document.getElementById('map');
  if (mapEl && window.L){
    const map = L.map('map').setView([45.98, 13.2], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const sedi = [
      { name: 'Trieste', coords: [45.65, 13.77] },
      { name: 'Gorizia', coords: [45.94, 13.62] },
      { name: 'Udine', coords: [46.07, 13.24] },
      { name: 'Pordenone', coords: [45.96, 12.66] }
    ];
    sedi.forEach(s => L.marker(s.coords).addTo(map).bindPopup(s.name));
  }
});
