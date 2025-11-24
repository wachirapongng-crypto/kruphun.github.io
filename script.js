const API = "https://script.google.com/macros/s/AKfycbzkdNMyk-ecH-usgYPwkU9qtOTOwN8lmD2sD-292jKN5LVqzShtKcUET_sT6SQXMdfg/exec";   // /exec

function createData() {
  const data = {
    รหัส: document.getElementById("id").value,
    ชื่อ: document.getElementById("name").value,
    ที่อยู่: document.getElementById("address").value,
    สถานะ: document.getElementById("status").value,
    วันที่: new Date().toLocaleDateString("th-TH"),
    เวลา: new Date().toLocaleTimeString("th-TH")
  };

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      sheet: "WAIT",
      data: data
    })
  })
    .then(r => r.json())
    .then(() => loadData());
}

function loadData() {
  fetch(`${API}?sheet=WAIT`)
    .then(r => r.json())
    .then(json => {
      const table = document.getElementById("customerTable");
      table.innerHTML = "";

      const headers = ["รหัส", "ชื่อ", "ที่อยู่", "สถานะ", "วันที่", "เวลา"];

      table.innerHTML +=
        "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";

      json.data.forEach(row => {
        let tr =
          "<tr>" + headers.map(h => `<td>${row[h] || ""}</td>`).join("") + "</tr>";
        table.innerHTML += tr;
      });
    });
}

loadData();
