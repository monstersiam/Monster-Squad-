const $=s=>document.querySelector(s);
let lang=localStorage.getItem("ms_lang")||"en";
let members=JSON.parse(localStorage.getItem("ms_members")||"[]");
let notices=JSON.parse(localStorage.getItem("ms_notices")||"[]");
let adminId=localStorage.getItem("ms_admin")||"MS-ADMIN";
let currentProfile=localStorage.getItem("ms_profile")||"";

function showPage(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active"); if(id==="member")renderMembers(); if(id==="notice")renderNotices(); if(id==="profile")renderProfile(); window.scrollTo(0,0)}
document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
function applyLang(){document.documentElement.lang=lang;$("#langBtn").textContent=lang==="en"?"বাংলা":"English";document.querySelectorAll("[data-en]").forEach(e=>e.textContent=e.dataset[lang]);renderMembers();renderNotices();renderProfile()}
$("#langBtn").onclick=()=>{lang=lang==="en"?"bn":"en";localStorage.setItem("ms_lang",lang);applyLang()};
function renderMembers(){
 $("#totalMembers").textContent=members.length;
 const box=$("#memberList");box.innerHTML="";
 members.forEach((m,i)=>{let d=document.createElement("div");d.className="member-card";d.innerHTML=`<div class="serial">${String(i+1).padStart(2,"0")}</div><img src="${m.photo||"logo.png"}" alt=""><div><strong>${esc(m.name||"")}</strong></div><div class="join">${lang==="en"?"Join Date: ":"জয়েন ডেট: "}${esc(m.join||"")}</div>`;box.appendChild(d)});
}
function renderNotices(){
 const box=$("#noticeList");box.innerHTML="";$("#noNotice").style.display=notices.length?"none":"block";
 notices.forEach((n,i)=>{let d=document.createElement("div");d.className="notice-card";d.innerHTML=`<h3>${esc(lang==="en"?n.title:n.titleBn||n.title)}</h3><div class="date">${esc(n.date)}</div><div>${esc(lang==="en"?n.details:n.detailsBn||n.details)}</div><div class="notice-actions"><button onclick="editNotice(${i})">Edit</button><button class="danger" onclick="deleteNotice(${i})">Delete</button></div>`;box.appendChild(d)});
}
function renderProfile(){
 let m=members.find(x=>x.id===currentProfile)||members[0];
 if(!m){$("#profileSerial").textContent="—";$("#profileName").textContent="—";$("#profileJoin").textContent="—";$("#profilePhoto").src="logo.png";return}
 currentProfile=m.id;localStorage.setItem("ms_profile",m.id);
 let i=members.findIndex(x=>x.id===m.id);
 $("#profileSerial").textContent=String(i+1).padStart(2,"0");$("#profileName").textContent=m.name||"—";$("#profileJoin").textContent=m.join||"—";$("#profilePhoto").src=m.photo||"logo.png";
}
function openAdmin(){
 let pass=prompt(lang==="en"?"Admin password:":"এডমিন পাসওয়ার্ড:");
 if(pass!=="Monster@2026"){if(pass!==null)alert(lang==="en"?"Wrong password.":"ভুল পাসওয়ার্ড।");return}
 modal(`<h2>Admin Panel</h2><div class="row"><button onclick="addMember()">Add Member</button><button onclick="addNotice()">Add Notice</button></div><hr><h3>Members</h3>${members.map((m,i)=>`<div class="row" style="justify-content:space-between;margin:7px 0"><span>${i+1}. ${esc(m.name)}</span><span><button onclick="editMember(${i})">Edit</button> <button class="danger" onclick="deleteMember(${i})">Delete</button></span></div>`).join("")}<hr><label>Admin ID</label><div class="form"><input id="newAdmin" value="${esc(adminId)}"><button onclick="saveAdmin()">Save Admin ID</button></div><p class="small">This demo panel stores data in this browser. It is not server-side secure.</p>`);
}
function addMember(){modal(`<h2>Add Member</h2><div class="form"><input id="mName" placeholder="Name"><input id="mJoin" type="date"><input id="mPhoto" type="file" accept="image/*"><button onclick="saveMember()">Save</button></div>`)}
function saveMember(){let f=$("#mPhoto").files[0];if(!$("#mName").value||!$("#mJoin").value||!f)return alert("Name, Join Date and Photo are required.");let r=new FileReader();r.onload=()=>{let m={id:crypto.randomUUID(),name:$("#mName").value.trim(),join:$("#mJoin").value,photo:r.result};members.push(m);localStorage.setItem("ms_members",JSON.stringify(members));currentProfile=m.id;localStorage.setItem("ms_profile",m.id);closeModal();renderMembers();renderProfile()};r.readAsDataURL(f)}
function editMember(i){let m=members[i];modal(`<h2>Edit Member</h2><div class="form"><input id="mName" value="${esc(m.name)}"><input id="mJoin" type="date" value="${esc(m.join)}"><input id="mPhoto" type="file" accept="image/*"><button onclick="updateMember(${i})">Save</button></div>`)}
function updateMember(i){let m=members[i];m.name=$("#mName").value.trim()||m.name;m.join=$("#mJoin").value||m.join;let f=$("#mPhoto").files[0];if(f){let r=new FileReader();r.onload=()=>{m.photo=r.result;finishMember(i)};r.readAsDataURL(f)}else finishMember(i)}
function finishMember(i){localStorage.setItem("ms_members",JSON.stringify(members));closeModal();renderMembers();renderProfile()}
function deleteMember(i){if(confirm("Delete this member?")){members.splice(i,1);localStorage.setItem("ms_members",JSON.stringify(members));renderMembers();renderProfile();openAdmin()}}
function addNotice(){modal(`<h2>Add Notice</h2><div class="form"><input id="nt" placeholder="Notice title (English)"><input id="ntb" placeholder="নোটিশ শিরোনাম (বাংলা)"><input id="nd" type="date"><textarea id="nx" placeholder="Notice details (English)"></textarea><textarea id="nxb" placeholder="নোটিশের বিস্তারিত (বাংলা)"></textarea><button onclick="saveNotice()">Save Notice</button></div>`)}
function saveNotice(){if(!$("#nt").value||!$("#nd").value)return alert("Title and Date are required.");notices.unshift({title:$("#nt").value,titleBn:$("#ntb").value,date:$("#nd").value,details:$("#nx").value,detailsBn:$("#nxb").value});localStorage.setItem("ms_notices",JSON.stringify(notices));closeModal();renderNotices()}
function editNotice(i){let n=notices[i];modal(`<h2>Edit Notice</h2><div class="form"><input id="nt" value="${esc(n.title)}"><input id="ntb" value="${esc(n.titleBn||"")}"><input id="nd" type="date" value="${esc(n.date)}"><textarea id="nx">${esc(n.details)}</textarea><textarea id="nxb">${esc(n.detailsBn||"")}</textarea><button onclick="updateNotice(${i})">Save</button></div>`)}
function updateNotice(i){notices[i]={title:$("#nt").value,titleBn:$("#ntb").value,date:$("#nd").value,details:$("#nx").value,detailsBn:$("#nxb").value};localStorage.setItem("ms_notices",JSON.stringify(notices));closeModal();renderNotices()}
function deleteNotice(i){if(confirm("Delete this notice?")){notices.splice(i,1);localStorage.setItem("ms_notices",JSON.stringify(notices));renderNotices()}}
function editOwnProfile(){let m=members.find(x=>x.id===currentProfile)||members[0];if(!m)return alert(lang==="en"?"No member profile found.":"কোনো মেম্বার প্রোফাইল পাওয়া যায়নি।");modal(`<h2>${lang==="en"?"Edit Profile":"প্রোফাইল পরিবর্তন"}</h2><div class="form"><input id="pName" value="${esc(m.name)}"><input id="pPhoto" type="file" accept="image/*"><button onclick="saveOwnProfile('${m.id}')">${lang==="en"?"Save":"সংরক্ষণ"}</button></div>`)}
function saveOwnProfile(id){let m=members.find(x=>x.id===id);m.name=$("#pName").value.trim()||m.name;let f=$("#pPhoto").files[0];if(f){let r=new FileReader();r.onload=()=>{m.photo=r.result;finishProfile()};r.readAsDataURL(f)}else finishProfile();function finishProfile(){localStorage.setItem("ms_members",JSON.stringify(members));closeModal();renderMembers();renderProfile()}}
function saveAdmin(){adminId=$("#newAdmin").value.trim()||"MS-ADMIN";localStorage.setItem("ms_admin",adminId);$("#adminIdText").textContent=adminId;closeModal()}
function modal(html){$("#modalContent").innerHTML=html;$("#modal").classList.remove("hidden")}
function closeModal(){$("#modal").classList.add("hidden")}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
$("#adminIdText").textContent=adminId;applyLang();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
