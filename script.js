const API_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
let currentLeader = "";

function dangNhap() {
  const id = leaderId.value.trim(), pass = leaderPass.value.trim();
  fetch(API_URL, {
    method:"POST",
    body:JSON.stringify({action:"login", id, password:pass}),
    headers:{"Content-Type":"application/json"}
  }).then(r=>r.json()).then(d=>{
    if(d.status==="success") {
      currentLeader = id;
      app.hidden = false;
      taiLichSu();
    } else alert(d.message || "Đăng nhập thất bại");
  });
}

function diemDanh() {
  const id = employeeId.value.trim();
  if (!id) return alert("Nhập ID nhân viên");
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({action:"diem_danh", leader:currentLeader, nhanVienId:id}),
    headers:{"Content-Type":"application/json"}
  }).then(r=>r.json()).then(d=>{
    diemDanhResult.innerText = d.status==="success" ? "Điểm danh thành công" : "Thất bại";
    taiLichSu();
    if(new Date().getHours()>=9) alert("⚠️ Điểm danh sau 9h!");
  });
}

function locLichSu(){
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({action:"lich_su", leader:currentLeader, date:filterDate.value}),
    headers:{"Content-Type":"application/json"}
  }).then(r=>r.json()).then(hienThiLichSu);
}

function taiLichSu(){
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({action:"lich_su", leader:currentLeader}),
    headers:{"Content-Type":"application/json"}
  }).then(r=>r.json()).then(hienThiLichSu);
}

function hienThiLichSu(data){
  const tb = lichSuTable.tBodies[0];
  tb.innerHTML = "";
  data.forEach(r=>{
    tb.insertRow().innerHTML = `<td>${r.time}</td><td>${r.id}</td>`;
  });
  veBieuDo(data);
}

function veBieuDo(data){
  const tk = {};
  data.forEach(r=>tk[r.id]= (tk[r.id]||0)+1 );
  const ctx=chartCanvas.getContext("2d");
  if(window.chart) window.chart.destroy();
  window.chart = new Chart(ctx,{
    type:"bar",
    data:{labels:Object.keys(tk), datasets:[{label:"Số lần điểm danh",data:Object.values(tk),backgroundColor:"#007BFF"}]}
  });
}

function doiMatKhau(){
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({action:"doi_mat_khau", id:currentLeader, oldPassword:oldPass.value.trim(), newPassword:newPass.value.trim()}),
    headers:{"Content-Type":"application/json"}
  }).then(r=>r.json()).then(d=>alert(d.status==="success"?"Đổi mật khẩu thành công":d.message));
}

function xuatCSV(){
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({action:"export_csv", leader:currentLeader}),
    headers:{"Content-Type":"application/json"}
  }).then(r=>r.json()).then(d=>{
    if(d.url) window.open(d.url);
    else alert("Không xuất được CSV");
  });
}
