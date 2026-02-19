let trades = JSON.parse(localStorage.getItem('trades')) || [];
let startingCapital = 1000;
updateTable();
updateChart();

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  if(tabId === 'chart') updateChart();
}

function buttonClickAnimation(btn) {
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
}

function addTrade() {
  const date = document.getElementById('date').value;
  const capital = parseFloat(document.getElementById('capital').value);
  const result = parseFloat(document.getElementById('result').value) / 100;
  const notes = document.getElementById('notes').value;
  trades.push({ date, capital, result, notes });
  localStorage.setItem('trades', JSON.stringify(trades));
  updateTable();
  updateChart();
}

function updateTable() {
  let tbody = document.querySelector('#tradesTable tbody');
  tbody.innerHTML = '';
  let capital = startingCapital;
  trades.forEach((trade, index) => {
    let effectiveCapital = index === 0 ? trade.capital : capital;
    let pl = effectiveCapital * trade.result;
    capital = effectiveCapital + pl;
    let cumulative = (capital / startingCapital - 1) * 100;
    tbody.innerHTML += `<tr><td>${index+1}</td><td>${trade.date}</td><td>${effectiveCapital.toFixed(2)}</td><td>${(trade.result*100).toFixed(2)}</td><td>${pl.toFixed(2)}</td><td>${capital.toFixed(2)}</td><td>${cumulative.toFixed(2)}</td><td>${trade.notes}</td></tr>`;
  });
}

function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trades, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "trades.json");
  dlAnchorElem.click();
}

function importJSON(event) {
  const files = event.target.files;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      trades = trades.concat(JSON.parse(e.target.result));
      localStorage.setItem('trades', JSON.stringify(trades));
      updateTable();
      updateChart();
    };
    reader.readAsText(file);
  });
}

function clearLocalStorage() {
  localStorage.removeItem('trades');
  trades = [];
  updateTable();
  updateChart();
}

function updateChart() {
  const ctx = document.getElementById('performanceChart').getContext('2d');
  let labels = [];
  let cumulativeData = [];
  let resultData = [];
  let capital = startingCapital;
  trades.forEach((trade, index) => {
    let effectiveCapital = index === 0 ? trade.capital : capital;
    let pl = effectiveCapital * trade.result;
    capital = effectiveCapital + pl;
    labels.push(trade.date || `Trade ${index+1}`);
    cumulativeData.push(((capital / startingCapital -1)*100).toFixed(2));
    resultData.push((trade.result*100).toFixed(2));
  });
  if(window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Cumulative %', data: cumulativeData, borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.2)', tension: 0.3, fill: true },
        { label: 'Result %', data: resultData, borderColor: '#00ff99', backgroundColor: 'rgba(0, 255, 153, 0.2)', tension: 0.3, fill: true }
      ]
    },
    options: { responsive: true, plugins: { legend: { labels: { color: '#f0f0f0' } } }, scales: { y: { ticks: { color: '#f0f0f0' } }, x: { ticks: { color: '#f0f0f0' } } } }
  });
}