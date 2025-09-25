
let DATA = {};
let EDIT = false;

function requestDataFromApp(){
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.requestData) {
    window.webkit.messageHandlers.requestData.postMessage(null);
  } else {
    console.warn("Bridge không có sẵn, dùng dữ liệu mặc định trong JS.");
    DATA = DEFAULT();
    render();
  }
}

window.appProvideData = function(jsonStr){
  try {
    DATA = JSON.parse(jsonStr);
  } catch(e){
    console.error("JSON lỗi, dùng DEFAULT", e);
    DATA = DEFAULT();
  }
  render();
}

function saveToApp(){
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveData) {
    const json = JSON.stringify(DATA, null, 2);
    window.webkit.messageHandlers.saveData.postMessage(json);
    alert("Đã lưu vào file JSON trong ứng dụng.");
  } else {
    alert("Không có bridge iOS. (Chạy trong Safari?)");
  }
}

function resetInApp(){
  if (confirm("Xoá dữ liệu đã lưu và về mặc định?")){
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resetData) {
      window.webkit.messageHandlers.resetData.postMessage(null);
    }
    DATA = DEFAULT();
    render();
  }
}

function DEFAULT(){
  return {
    "Thứ 2": {"type":"train","items":["Ngày 1 – Sức mạnh chân","Squat 4×20","Jump Squat 4×10–12","Lunge 3×12 mỗi chân","Glute Bridge 3×15–20","Calf Raise 4×25–30"]},
    "Thứ 3": {"type":"rest","items":["Nghỉ / giãn cơ nhẹ","Đi bộ 15–30′","Bóng chuyền thoải mái"]},
    "Thứ 4": {"type":"train","items":["Ngày 2 – Plyometric + Core","Box Jump 4×6–8","Broad Jump 3×6","Tuck Jump 3×10","Burpee Jump 3×12","Plank 3×45–60s","Russian Twist 3×20"]},
    "Thứ 5": {"type":"rest","items":["Nghỉ / tập nhẹ nhàng","Đi bộ / giãn cơ 10–15′"]},
    "Thứ 6": {"type":"train","items":["Ngày 3 – Sức mạnh bổ trợ + Thân trên","Pistol Squat 3×6–8 mỗi chân","Bulgarian Split Squat 3×10 mỗi chân","Wall Sit 3×45–60s","Push-up 4×15–20","Pull-up / Inverted Row 3× tối đa"]},
    "Thứ 7": {"type":"rest","items":["Nghỉ / vận động nhẹ","Đi bộ / đạp xe 15–20′"]},
    "Chủ Nhật": {"type":"train","items":["Ngày 4 – Plyometric nâng cao","Depth Jump 4×6","Single-leg Hop 3×8–10 mỗi chân","Skater Jump 3×12 mỗi bên","Sprint 20m ×6–8","Side Plank 3×30–45s mỗi bên","Mountain Climber 3×30s"]},
  };
}

function idFor(day, i){ return day.replaceAll(" ","_").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"") + "_" + i; }

function render(){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  Object.entries(DATA).forEach(([day, cfg]) => {
    const card = document.createElement("section");
    card.className = "card";
    const head = document.createElement("div");
    head.className = "head";
    head.innerHTML = `<div class="title">${day}</div><span class="badge ${cfg.type==='train'?'':'rest'}">${cfg.type==='train'?'Tập':'Nghỉ'}</span>`;
    card.appendChild(head);
    const ul = document.createElement("ul");
    cfg.items.forEach((text, idx) => {
      const li = document.createElement("li");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = localStorage.getItem(idFor(day, idx)) === "1";
      cb.addEventListener("change", ()=>{
        localStorage.setItem(idFor(day, idx), cb.checked ? "1":"0");
        updateCounter(card, day, cfg.items.length);
      });
      const span = document.createElement("div");
      span.className = "txt";
      span.textContent = text;
      span.contentEditable = EDIT ? "true" : "false";
      span.addEventListener("blur", ()=>{
        if (!span.textContent.trim()) { span.textContent = text; return; }
        DATA[day].items[idx] = span.textContent.trim();
      });
      const rm = document.createElement("button");
      rm.textContent = "✕";
      rm.className = "mini";
      rm.style.display = EDIT ? "inline-block" : "none";
      rm.addEventListener("click", ()=>{
        DATA[day].items.splice(idx,1);
        render();
      });
      li.appendChild(cb); li.appendChild(span); li.appendChild(rm);
      ul.appendChild(li);
    });
    card.appendChild(ul);
    const counter = document.createElement("div");
    counter.className = "counter";
    card.appendChild(counter);
    updateCounter(card, day, cfg.items.length);
    grid.appendChild(card);
  });
}

function updateCounter(card, day, total){
  let done = 0;
  for (let i=0;i<total;i++){
    if (localStorage.getItem(idFor(day,i)) === "1") done++;
  }
  card.querySelector(".counter").textContent = `Đã ✓ ${done}/${total}`;
}

window.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("btn-edit").addEventListener("click", (e)=>{
    EDIT = !EDIT;
    e.target.textContent = EDIT ? "Tắt Sửa" : "Bật Sửa";
    render();
  });
  document.getElementById("btn-save").addEventListener("click", saveToApp);
  document.getElementById("btn-reset").addEventListener("click", resetInApp);
  requestDataFromApp();
});
