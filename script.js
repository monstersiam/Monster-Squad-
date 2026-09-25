let lang = localStorage.getItem("monsterLang") || "bn";

let members = JSON.parse(localStorage.getItem("monsterMembers") || "null") || [
  {bn:"মেম্বার ০১", en:"Member 01", roleBn:"প্লেয়ার", roleEn:"Player"},
  {bn:"মেম্বার ০২", en:"Member 02", roleBn:"প্লেয়ার", roleEn:"Player"},
  {bn:"মেম্বার ০৩", en:"Member 03", roleBn:"প্লেয়ার", roleEn:"Player"}
];

function save(){ localStorage.setItem("monsterMembers", JSON.stringify(members)); }

function renderMembers(){
  const box=document.getElementById("members");
  box.innerHTML="";
  members.forEach((m,i)=>{
    box.innerHTML += `<div class="card">
      <button class="remove" onclick="removeMember(${i})">${lang==="bn"?"মুছুন":"Remove"}</button>
      <div class="avatar">👤</div>
      <h3>${escapeHtml(lang==="bn"?m.bn:m.en)}</h3>
      <p>${escapeHtml(lang==="bn"?m.roleBn:m.roleEn)}</p>
    </div>`;
  });
}

function addMember(){
  const bn=document.getElementById("memberNameBn").value.trim();
  const en=document.getElementById("memberNameEn").value.trim();
  const roleBn=document.getElementById("memberRoleBn").value.trim() || "প্লেয়ার";
  const roleEn=document.getElementById("memberRoleEn").value.trim() || "Player";
  if(!bn || !en){ alert(lang==="bn"?"বাংলা ও ইংরেজি নাম দিন।":"Enter both Bangla and English names."); return; }
  members.push({bn,en,roleBn,roleEn}); save(); renderMembers();
  document.querySelectorAll(".add-form input").forEach(x=>x.value="");
}

function removeMember(i){
  if(confirm(lang==="bn"?"এই মেম্বারকে মুছে ফেলবেন?":"Remove this member?")){
    members.splice(i,1); save(); renderMembers();
  }
}

function setLanguage(){
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-bn][data-en]").forEach(el=>{
    el.textContent=lang==="bn"?el.dataset.bn:el.dataset.en;
  });
  document.querySelectorAll("[data-bn-placeholder][data-en-placeholder]").forEach(el=>{
    el.placeholder=lang==="bn"?el.dataset.bnPlaceholder:el.dataset.enPlaceholder;
  });
  document.getElementById("langBtn").textContent=lang==="bn"?"English":"বাংলা";
  renderMembers();
  localStorage.setItem("monsterLang",lang);
}

document.getElementById("langBtn").addEventListener("click",()=>{
  lang=lang==="bn"?"en":"bn"; setLanguage();
});

function escapeHtml(s){
  return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function sendMessage(e){
  e.preventDefault();
  const name=document.getElementById("name").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const message=document.getElementById("message").value.trim();
  const whatsappNumber="8801XXXXXXXXX"; // Replace with your team's WhatsApp number
  if(whatsappNumber.includes("X")){
    document.getElementById("status").textContent=lang==="bn"?"WhatsApp নম্বর এখনো সেট করা হয়নি।":"WhatsApp number has not been set yet.";
    return;
  }
  const text=encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nMessage: ${message}`);
  window.open(`https://wa.me/${whatsappNumber}?text=${text}`,"_blank");
}

setLanguage();

// ===== PRIVATE OWNER CUSTOMIZATION =====
// Change this password before putting the site online.
// For real security, use server-side authentication/database.
const OWNER_PASSWORD = "Monster@2026";

function openAdminLogin(){
  const pass = prompt(lang==="bn" ? "অ্যাডমিন পাসওয়ার্ড দিন:" : "Enter admin password:");
  if(pass === OWNER_PASSWORD){
    document.getElementById("adminPanel").hidden = false;
    loadCustomization();
  } else if(pass !== null){
    alert(lang==="bn" ? "পাসওয়ার্ড ভুল।" : "Incorrect password.");
  }
}

function closeAdmin(){
  document.getElementById("adminPanel").hidden = true;
}

function loadCustomization(){
  const c=JSON.parse(localStorage.getItem("monsterCustomization")||"{}");
  document.getElementById("customSiteName").value=c.siteName||"MONSTER SQUAD";
  document.getElementById("customTagline").value=c.tagline||"";
  document.getElementById("customBg").value=c.bg||"#050505";
  document.getElementById("customAccent").value=c.accent||"#e50920";
}

function saveCustomization(){
  const c={
    siteName:document.getElementById("customSiteName").value.trim()||"MONSTER SQUAD",
    tagline:document.getElementById("customTagline").value.trim(),
    bg:document.getElementById("customBg").value,
    accent:document.getElementById("customAccent").value
  };
  localStorage.setItem("monsterCustomization",JSON.stringify(c));
  applyCustomization();
  document.getElementById("adminStatus").textContent=lang==="bn"?"পরিবর্তন সংরক্ষণ হয়েছে।":"Changes saved.";
}

function applyCustomization(){
  const c=JSON.parse(localStorage.getItem("monsterCustomization")||"{}");
  if(c.bg) document.body.style.background=c.bg;
  if(c.accent){
    document.documentElement.style.setProperty("--ms-accent",c.accent);
    document.querySelectorAll(".btn").forEach(x=>x.style.background=c.accent);
  }
  if(c.siteName){
    const title=document.querySelector(".hero h1");
    if(title) title.textContent=c.siteName;
    document.title=c.siteName;
  }
  if(c.tagline){
    const p=document.querySelector(".hero p");
    if(p) p.textContent=c.tagline;
  }
}

applyCustomization();
