const API = "https://script.google.com/macros/s/AKfycbzkdNMyk-ecH-usgYPwkU9qtOTOwN8lmD2sD-292jKN5LVqzShtKcUET_sT6SQXMdfg/exec";

// -------------------- CREATE -------------------- //
function createData() {
  const data = collectForm();

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

// -------------------- READ -------------------- //
function loadData() {
  fetch(`${API}?sheet=WAIT`)
    .then(r => r.json())
    .then(json => {
      const table = document.getElementById("customerTable");
      table.innerHTML = "";

      const headers = ["รหัส", "ชื่อ", "ที่อยู่", "สถานะ", "วันที่", "เวลา", "จัดการ"];

      // สร้างหัวตาราง
      table.innerHTML +=
        "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";

      // สร้างแถวข้อมูล
      json.data.forEach(row => {
        table.innerHTML += `
          <tr>
            <td>${row["รหัส"]}</td>
            <td>${row["ชื่อ"]}</td>
            <td>${row["ที่อยู่"]}</td>
            <td>${row["สถานะ"]}</td>
            <td>${row["วันที่"]}</td>
            <td>${row["เวลา"]}</td>
            <td>
              <button onclick='selectRow(${JSON.stringify(row)})'>แก้ไข</button>
            </td>
          </tr>
        `;
      });
    });
}

// -------------------- SELECT ROW -------------------- //
function selectRow(row) {
  document.getElementById("id").value = row["รหัส"];
  document.getElementById("name").value = row["ชื่อ"];
  document.getElementById("address").value = row["ที่อยู่"];
  document.getElementById("status").value = row["สถานะ"];
}

// -------------------- UPDATE -------------------- //
function updateData() {
  const data = collectForm();
  const id = document.getElementById("id").value;

  fetch(API, {
    method: "PUT",
    body: JSON.stringify({
      sheet: "WAIT",
      id: id,
      data: data
    })
  })
    .then(r => r.json())
    .then(() => loadData());
}

// -------------------- FORM -------------------- //
function collectForm() {
  return {
    รหัส: document.getElementById("id").value,
    ชื่อ: document.getElementById("name").value,
    ที่อยู่: document.getElementById("address").value,
    สถานะ: document.getElementById("status").value,
    วันที่: new Date().toLocaleDateString("th-TH"),
    เวลา: new Date().toLocaleTimeString("th-TH"),
  };
}

loadData();
