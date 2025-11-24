const API = "https://script.google.com/macros/s/AKfycbzkdNMyk-ecH-usgYPwkU9qtOTOwN8lmD2sD-292jKN5LVqzShtKcUET_sT6SQXMdfg/exec";

let editingRow = null;  // แถวที่กำลังแก้ไข

function createData() {
  const data = collectFormData();

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      sheet: "WAIT",
      action: "create",
      data: data
    })
  })
    .then(r => r.json())
    .then(() => loadData());
}

function updateData() {
  if (editingRow === null) return alert("ยังไม่ได้เลือกแถว");

  const data = collectFormData();
  data.row = editingRow;   // ส่ง row index ให้ GAS

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      sheet: "WAIT",
      action: "update",
      data: data
    })
  })
    .then(r => r.json())
    .then(() => {
      editingRow = null;
      loadData();
    });
}

function collectFormData() {
  return {
    รหัส: document.getElementById("id").value,
    ชื่อ: document.getElementById("name").value,
    ที่อยู่: document.getElementById("address").value,
    สถานะ: document.getElementById("status").value,
    วันที่: new Date().toLocaleDateString("th-TH"),
    เวลา: new Date().toLocaleTimeString("th-TH")
  };
}

function loadData() {
  fetch(`${API}?sheet=WAIT`)
    .then(r => r.json())
    .then(json => {
      const table = document.getElementById("customerTable");
      table.innerHTML = "";

      const headers = ["รหัส", "ชื่อ", "ที่อยู่", "สถานะ", "วันที่", "เวลา"];
      table.innerHTML += "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "<th>แก้ไข</th></tr>";

      json.data.forEach((row, index) => {
        let tr = "<tr>";

        headers.forEach(h => {
          tr += `<td>${row[h] || ""}</td>`;
        });

        tr += `<td><button onclick="selectRow(${index + 2})">เลือก</button></td>`;
        tr += "</tr>";

        table.innerHTML += tr;
      });
    });
}

// เลือกข้อมูลจากแถวมาแสดงบนฟอร์มเพื่อแก้ไข
function selectRow(rowIndex) {
  editingRow = rowIndex;

  fetch(`${API}?sheet=WAIT`)
    .then(r => r.json())
    .then(json => {
      const row = json.data[rowIndex - 2];

      document.getElementById("id").value = row["รหัส"];
      document.getElementById("name").value = row["ชื่อ"];
      document.getElementById("address").value = row["ที่อยู่"];
      document.getElementById("status").value = row["สถานะ"];
    });
}

loadData();
