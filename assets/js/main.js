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
      { name: 'Trieste', coords: [45.65552397691258, 13.772499655034979] },
      { name: 'Ronchi dei Legionari', coords: [45.8267993654288, 13.505501393483577] },
      { name: 'Udine', coords: [46.07177052331674, 13.233339079653026] },
      { name: 'Porcia', coords: [45.97014439503301, 12.603125549696271] }
    ];
    sedi.forEach(s => L.marker(s.coords).addTo(map).bindPopup(s.name));
  }
});
