// Minimal markdown renderer (no dependency)
function mdToHtml(md){
  // basic escaping
  md = md.replace(/\r\n/g, '\n');

  // headings
  md = md.replace(/^###### (.*)$/gm, '<h6>$1</h6>')
         .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
         .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
         .replace(/^### (.*)$/gm, '<h3>$1</h3>')
         .replace(/^## (.*)$/gm, '<h2>$1</h2>')
         .replace(/^# (.*)$/gm, '<h1>$1</h1>');

  // bold/italic
  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
         .replace(/\*(.+?)\*/g, '<em>$1</em>');

  // links [text](url)
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // unordered lists
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  for (let line of lines){
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li){
      if (!inList){ html += '<ul>'; inList = true; }
      html += `<li>${li[1]}</li>`;
    } else {
      if (inList){ html += '</ul>'; inList = false; }
      if (line.trim().length){
        // treat as paragraph if not already HTML tag
        if (!/^<h\d>/.test(line)){
          html += `<p>${line}</p>`;
        } else {
          html += line;
        }
      }
    }
  }
  if (inList) html += '</ul>';
  return html;
}

async function loadMarkdown(containerId, fileName){
  const el = document.getElementById(containerId);
  if (!el) return;
  try{
    const res = await fetch('content/' + fileName + '?v=' + Date.now());
    if (!res.ok) throw new Error('Impossibile caricare ' + fileName);
    const text = await res.text();
    el.innerHTML = mdToHtml(text);
  }catch(err){
    el.innerHTML = '<p class="muted small">Contenuto non disponibile al momento.</p>';
    console.error(err);
  }finally{
    el.classList.remove('skeleton');
  }
}
