const state = JSON.parse(localStorage.getItem("studyMate")) || {
  subjects:[
    {id:1,name:"الذكاء الاصطناعي",description:"Machine Learning و AI",target:30,done:18},
    {id:2,name:"قواعد البيانات",description:"SQL و Entity Framework",target:20,done:12}
  ],
  tasks:[
    {id:1,title:"مراجعة محاضرة AI",subject:"الذكاء الاصطناعي",due:"2026-09-02",priority:"High",done:false},
    {id:2,title:"حل تمارين SQL",subject:"قواعد البيانات",due:"2026-09-04",priority:"Medium",done:true}
  ],
  exams:[
    {id:1,title:"امتحان AI",subject:"الذكاء الاصطناعي",date:"2026-09-10",time:"10:00",notes:"الفصول 1 - 4"}
  ]
};
const save=()=>localStorage.setItem("studyMate",JSON.stringify(state));
const content=document.getElementById("content"), title=document.getElementById("pageTitle");
const pages={home:"AI StudyMate",dashboard:"لوحة التحكم",subjects:"المواد الدراسية",tasks:"المهام",exams:"الامتحانات",ai:"مولد الأسئلة بالذكاء الاصطناعي",progress:"متابعة التقدم"};
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
document.getElementById("menuBtn").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
document.getElementById("themeBtn").onclick=()=>{document.body.classList.toggle("dark");document.getElementById("themeBtn").textContent=document.body.classList.contains("dark")?"☀️ الوضع الفاتح":"🌙 الوضع الداكن"};

function showPage(p){title.textContent=pages[p];document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===p));render(p);document.querySelector(".sidebar").classList.remove("open")}
function render(p){
  if(p==="home") return content.innerHTML=home();
  if(p==="dashboard") return content.innerHTML=dashboard();
  if(p==="subjects") return content.innerHTML=subjects();
  if(p==="tasks") return content.innerHTML=tasks();
  if(p==="exams") return content.innerHTML=exams();
  if(p==="ai") return content.innerHTML=aiPage();
  if(p==="progress") return content.innerHTML=progress();
}
function home(){return `<div class="hero"><div><h1>ذاكر بذكاء، مش أكتر 🤖</h1><p>AI StudyMate يساعدك على تنظيم المواد والمهام والامتحانات، ومتابعة تقدمك، وتوليد أسئلة للمراجعة باستخدام الذكاء الاصطناعي.</p><button class="btn" onclick="showPage('dashboard')">ابدأ الآن ←</button></div><div class="hero-art">🎓</div></div><div class="stats">${stat("📚","المواد",state.subjects.length)}${stat("✅","المهام المكتملة",state.tasks.filter(x=>x.done).length)}${stat("📝","الامتحانات",state.exams.length)}${stat("🤖","ميزة AI","جاهزة")}</div><div class="section-head"><h3>لماذا AI StudyMate؟</h3></div><div class="grid"><div class="card"><h3>تنظيم كامل</h3><p class="muted">اجمع المواد والمهام والامتحانات في مكان واحد.</p></div><div class="card"><h3>مساعد AI</h3><p class="muted">حوّل ملاحظاتك إلى أسئلة مراجعة بشكل سريع.</p></div><div class="card"><h3>تحليل التقدم</h3><p class="muted">اعرف مستوى إنجازك وساعات مذاكرتك بسهولة.</p></div></div>`}
function stat(icon,label,value){return `<div class="card stat"><div class="label">${icon} ${label}</div><div class="value">${value}</div></div>`}
function dashboard(){let pending=state.tasks.filter(x=>!x.done);return `<div class="stats">${stat("📚","المواد",state.subjects.length)}${stat("⏳","المهام المتبقية",pending.length)}${stat("✅","المهام المكتملة",state.tasks.length-pending.length)}${stat("📝","الامتحانات القادمة",state.exams.length)}</div><div class="grid"><div class="card"><h3>المهام القادمة</h3>${pending.slice(0,5).map(taskHTML).join("")||empty("لا توجد مهام")}</div><div class="card"><h3>الامتحانات القادمة</h3>${state.exams.slice(0,5).map(examHTML).join("")||empty("لا توجد امتحانات")}</div><div class="card"><h3>تقدم المواد</h3>${state.subjects.map(s=>`<p><b>${s.name}</b> <span class="muted">${Math.round(s.done/s.target*100)}%</span></p><div class="progress"><span style="width:${Math.min(100,s.done/s.target*100)}%"></span></div>`).join("")}</div></div>`}
function subjects(){return `<div class="section-head"><h3>كل المواد</h3><button class="btn" onclick="openSubject()">+ إضافة مادة</button></div><div class="grid">${state.subjects.map(s=>`<div class="card"><h3>${s.name}</h3><p class="muted">${s.description}</p><b>${s.done} / ${s.target} ساعة</b><div class="progress"><span style="width:${Math.min(100,s.done/s.target*100)}%"></span></div><div class="actions" style="margin-top:15px"><button class="btn danger" onclick="removeSubject(${s.id})">حذف</button></div></div>`).join("")||empty("لم تضف أي مادة بعد")}</div>`}
function tasks(){return `<div class="section-head"><h3>إدارة المهام</h3><button class="btn" onclick="openTask()">+ إضافة مهمة</button></div><div class="card"><div class="list">${state.tasks.map(taskHTML).join("")||empty("لا توجد مهام")}</div></div>`}
function taskHTML(t){return `<div class="item"><div class="item-info"><strong>${t.done?"☑️":"⬜"} ${t.title}</strong><span class="muted">${t.subject||"بدون مادة"} • ${t.due}</span></div><div class="actions"><span class="badge ${t.priority.toLowerCase()}">${t.priority}</span><button class="btn secondary" onclick="toggleTask(${t.id})">${t.done?"إرجاع":"تم"}</button><button class="btn danger" onclick="removeTask(${t.id})">حذف</button></div></div>`}
function exams(){return `<div class="section-head"><h3>الامتحانات</h3><button class="btn" onclick="openExam()">+ إضافة امتحان</button></div><div class="grid">${state.exams.map(examHTML).join("")||empty("لا توجد امتحانات")}</div>`}
function examHTML(e){return `<div class="card"><h3>📝 ${e.title}</h3><p>${e.subject}</p><b>📅 ${e.date} — ${e.time}</b><p class="muted">${e.notes||""}</p><button class="btn danger" onclick="removeExam(${e.id})">حذف</button></div>`}
function progress(){let total=state.subjects.reduce((a,s)=>a+s.target,0),done=state.subjects.reduce((a,s)=>a+s.done,0),pct=total?Math.round(done/total*100):0;return `<div class="card"><h2>التقدم العام: ${pct}%</h2><div class="progress"><span style="width:${pct}%"></span></div><div class="stats">${stat("⏱️","ساعات مستهدفة",total)}${stat("🔥","ساعات مكتملة",done)}${stat("✅","مهام مكتملة",state.tasks.filter(t=>t.done).length)}${stat("📚","المواد",state.subjects.length)}</div></div><div class="section-head"><h3>تقدم كل مادة</h3></div><div class="grid">${state.subjects.map(s=>`<div class="card"><h3>${s.name}</h3><p>${s.done} من ${s.target} ساعة</p><div class="progress"><span style="width:${Math.min(100,s.done/s.target*100)}%"></span></div></div>`).join("")}</div>`}
function aiPage(){return `<div class="card"><h3>🤖 مولد أسئلة AI</h3><p class="muted">أدخل موضوع المذاكرة أو ملاحظاتك، وسيتم إنشاء مجموعة أسئلة للمراجعة.</p><div class="form-grid"><div class="field full"><label>الموضوع</label><input id="aiTopic" placeholder="مثال: أساسيات Machine Learning"></div><div class="field full"><label>ملاحظات الدراسة</label><textarea id="aiNotes" placeholder="اكتب أو الصق ملاحظاتك هنا..."></textarea></div><div class="field"><label>عدد الأسئلة</label><select id="aiCount"><option>3</option><option>5</option><option>10</option></select></div><div class="field"><label>الصعوبة</label><select id="aiLevel"><option>Easy</option><option>Medium</option><option>Hard</option></select></div></div><button class="btn" style="margin-top:15px" onclick="generateQuestions()">✨ Generate Questions</button></div><div id="questions" style="margin-top:18px"></div>`}
function generateQuestions(){let topic=document.getElementById("aiTopic").value||"الموضوع الدراسي";let count=+document.getElementById("aiCount").value;let qs=[];for(let i=1;i<=count;i++)qs.push(`<div class="question"><b>${i}. ما الفكرة الأساسية التي يجب فهمها في ${topic}؟</b><div class="answer">إجابة نموذجية: راجع التعريف والمفاهيم الأساسية والتطبيقات العملية للموضوع.</div></div>`);document.getElementById("questions").innerHTML=`<div class="card"><h3>الأسئلة المولدة</h3>${qs.join("")}</div>`}
function empty(x){return `<div class="empty">${x}</div>`}
function openModal(t,html){document.getElementById("modalTitle").textContent=t;document.getElementById("modalForm").innerHTML=html;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function openSubject(){openModal("إضافة مادة",`<div class="form-grid"><div class="field full"><label>اسم المادة</label><input id="fName" required></div><div class="field full"><label>الوصف</label><input id="fDesc"></div><div class="field"><label>الساعات المستهدفة</label><input id="fTarget" type="number" value="20"></div><div class="field"><label>الساعات المكتملة</label><input id="fDone" type="number" value="0"></div></div><button class="btn" style="margin-top:15px" type="button" onclick="addSubject()">حفظ</button>`)}
function addSubject(){state.subjects.push({id:Date.now(),name:fName.value,description:fDesc.value,target:+fTarget.value,done:+fDone.value});save();closeModal();render("subjects")}
function openTask(){openModal("إضافة مهمة",`<div class="form-grid"><div class="field full"><label>اسم المهمة</label><input id="tTitle"></div><div class="field"><label>المادة</label><input id="tSubject"></div><div class="field"><label>التاريخ</label><input id="tDue" type="date"></div><div class="field"><label>الأولوية</label><select id="tPriority"><option>Low</option><option selected>Medium</option><option>High</option></select></div></div><button class="btn" style="margin-top:15px" onclick="addTask()">حفظ</button>`)}
function addTask(){state.tasks.push({id:Date.now(),title:tTitle.value,subject:tSubject.value,due:tDue.value,priority:tPriority.value,done:false});save();closeModal();render("tasks")}
function openExam(){openModal("إضافة امتحان",`<div class="form-grid"><div class="field full"><label>اسم الامتحان</label><input id="eTitle"></div><div class="field"><label>المادة</label><input id="eSubject"></div><div class="field"><label>التاريخ</label><input id="eDate" type="date"></div><div class="field"><label>الوقت</label><input id="eTime" type="time"></div><div class="field full"><label>ملاحظات</label><input id="eNotes"></div></div><button class="btn" style="margin-top:15px" onclick="addExam()">حفظ</button>`)}
function addExam(){state.exams.push({id:Date.now(),title:eTitle.value,subject:eSubject.value,date:eDate.value,time:eTime.value,notes:eNotes.value});save();closeModal();render("exams")}
function toggleTask(id){let t=state.tasks.find(x=>x.id===id);t.done=!t.done;save();render("tasks")}
function removeTask(id){state.tasks=state.tasks.filter(x=>x.id!==id);save();render("tasks")}
function removeSubject(id){state.subjects=state.subjects.filter(x=>x.id!==id);save();render("subjects")}
function removeExam(id){state.exams=state.exams.filter(x=>x.id!==id);save();render("exams")}
showPage("home");