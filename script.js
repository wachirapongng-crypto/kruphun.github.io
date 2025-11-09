<script>
let refreshInterval = null;

// โหลดข้อมูลจากชีต
function loadData() {
  document.getElementById("statusMsg").textContent = "กำลังโหลดข้อมูล...";
  google.script.run
    .withSuccessHandler(displayData)
    .withFailureHandler(showError)
    .readData();
}

// แสดงข้อมูลในตาราง
function displayData(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  data.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.รหัส}</td>
      <td>${r.ชื่อ}</td>
      <td>${r.ที่อยู่}</td>
      <td>${r.สถานะ}</td>
      <td>${r.วันที่}</td>
      <td>${r.เวลา}</td>
    `;
    row.addEventListener("click", () => fillInput(r));
    tbody.appendChild(row);
  });
  document.getElementById("statusMsg").textContent = "อัปเดตข้อมูลล่าสุดเมื่อ: " + new Date().toLocaleTimeString();
}

// แสดงข้อผิดพลาด
function showError(err) {
  document.getElementById("statusMsg").textContent = "เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message;
}

// เติมข้อมูลลง input เมื่อคลิกตาราง
function fillInput(r) {
  document.getElementById("id").value = r.รหัส;
  document.getElementById("name").value = r.ชื่อ;
  document.getElementById("address").value = r.ที่อยู่;
  document.getElementById("status").value = r.สถานะ;
  document.getElementById("date").value = r.วันที่;
  document.getElementById("time").value = r.เวลา;
}

// ดึงค่าจาก input
function getInput() {
  return {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    status: document.getElementById("status").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value
  };
}

// เพิ่มข้อมูล
function addData() {
  const record = getInput();
  google.script.run.withSuccessHandler(msg => {
    alert(msg);
    loadData();
  }).createData(record);
  clearInput();
}

// อัปเดตข้อมูล
function updateData() {
  const record = getInput();
  google.script.run.withSuccessHandler(msg => {
    alert(msg);
    loadData();
  }).updateData(record);
  clearInput();
}

// ลบข้อมูล
function deleteData() {
  const id = document.getElementById("id").value;
  google.script.run.withSuccessHandler(msg => {
    alert(msg);
    loadData();
  }).deleteData(id);
  clearInput();
}

// ล้างช่อง input
function clearInput() {
  document.querySelectorAll("input").forEach(i => i.value = "");
}

// ปุ่มรีเฟรช (ผู้ใช้กดเอง)
function manualRefresh() {
  loadData();
}

// เริ่มรีเฟรชอัตโนมัติทุก 10 วินาที
function startAutoRefresh() {
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(loadData, 10000);
  loadData(); // โหลดครั้งแรกทันที
}

window.onload = startAutoRefresh;
</script>
