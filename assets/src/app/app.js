const DB=window.OCRE_RETRO_DB;
const ARCHIS=DB.archimonsters.map(a=>({name:a.name,step:a.questStage}));
const QUEST=DB.quest.stages;
const CREATURES=[...DB.monsters,...DB.bosses,...DB.archimonsters];
const KEY="ocre_companion_v3_retro";
let encyFilter="all",pendingApplyStep=null;
let app=loadApp();
let selectedStep=current().currentStep||1;
let stageFilter="all";

function blankDone(){const d={};QUEST.forEach(q=>d[q.step]=Array(q.objectives.length).fill(false));return d}
function makeAdventure(name){return{id:Date.now()+Math.random(),name:name||"Mon aventure",game:"Dofus Rétro",currentStep:1,done:blankDone(),inventory:{},journal:[],team:["Personnage 1"],favorites:{},notes:{},huntLists:[],archived:false,createdAt:Date.now()}}
function loadApp(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.adventures&&x.adventures.length)return normalizeApp(x)}catch(e){}const a=makeAdventure("Thomas — Rétro");return{activeId:a.id,adventures:[a]}}
function normalizeApp(x){x.adventures=x.adventures.map(a=>{a.done=a.done||blankDone();QUEST.forEach(q=>{const old=Array.isArray(a.done[q.step])?a.done[q.step]:[];a.done[q.step]=q.objectives.map((_,i)=>!!old[i])});a.inventory=a.inventory||{};a.journal=a.journal||[];a.team=(a.team||["Personnage 1"]).slice(0,8);a.favorites=a.favorites||{};a.notes=a.notes||{};a.huntLists=a.huntLists||[];a.currentStep=Math.max(1,Math.min(35,+a.currentStep||1));a.archived=!!a.archived;a.createdAt=a.createdAt||Date.now();return a});if(!x.adventures.some(a=>a.id===x.activeId))x.activeId=x.adventures[0].id;return x}
function current(){return app.adventures.find(a=>a.id===app.activeId)}
function save(){localStorage.setItem(KEY,JSON.stringify(app));document.getElementById("saveState").textContent="Sauvegardé à "+new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});updateAll()}
function stageDone(n){return current().done[n].filter(Boolean).length}
function stageComplete(n){return stageDone(n)===QUEST[n-1].objectives.length}
function total(){
 let d=0,t=0;QUEST.forEach(q=>{d+=stageDone(q.step);t+=q.objectives.length});return [d,t];
}
function firstIncomplete(){
 const q=QUEST.find(x=>!stageComplete(x.step));return q?q.step:35;
}
function updateAll(){
 const cur=QUEST[current().currentStep-1]||QUEST[0];document.getElementById("advLabel").textContent=current().name+" · "+current().team.length+" personnage"+(current().team.length>1?"s":"");
 document.getElementById("heroStep").textContent="Étape "+current().currentStep;
 document.getElementById("heroKind").textContent=cur.kind;
 const [d,t]=total(),pct=t?Math.round(d/t*100):0;
 document.getElementById("globalBar").style.width=pct+"%";
 document.getElementById("globalText").textContent=pct+" %";
 document.getElementById("globalCount").textContent=d+" / "+t;
 document.getElementById("nextProgress").textContent=stageDone(cur.step)+"/"+cur.objectives.length;
 document.getElementById("nextPreview").textContent=cur.objectives.filter((_,i)=>!current().done[cur.step][i]).slice(0,3).join(" · ")||"Étape terminée";
 renderSteps();renderInventory();renderJournal();renderAdventures();renderTeam();renderHunter();renderCustomLists();renderStats();renderEncyclopedia();renderAssistant();
 if(document.getElementById("stage").classList.contains("active"))renderStage();
}
function go(id,btn){
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x.dataset.page===id));
 if(id==="quest")renderSteps();
 if(id==="searchPage")renderSearch();if(id==="inventory"){renderInventory();renderJournal()}if(id==="adventures"){renderAdventures();renderTeam()}
 scrollTo(0,0);
}
function openCurrent(){selectedStep=current().currentStep;renderStage();go("stage")}
function openStage(n){selectedStep=n;renderStage();go("stage")}
function renderSteps(){
 const box=document.getElementById("steps");if(!box)return;
 box.innerHTML=QUEST.map(q=>{
  const d=stageDone(q.step),done=d===q.objectives.length;
  return `<button class="step ${q.step===current().currentStep?'active':''} ${done?'done':''}" onclick="openStage(${q.step})">
   <span><strong>Étape ${q.step}</strong><small>${q.kind} · ${d}/${q.objectives.length}</small></span>
   <span class="pill">${done?'✓':'›'}</span></button>`;
 }).join("");
}
function renderStage(){
 const q=QUEST[selectedStep-1];if(!q)return;
 document.getElementById("stageType").textContent=q.kind;
 document.getElementById("stageTitle").textContent="Étape "+q.step;
 document.getElementById("stageCount").textContent=stageDone(q.step)+" / "+q.objectives.length+" validés";
 
 const visible=q.objectives.map((name,i)=>({name,i,done:current().done[q.step][i]}))
   .filter(x=>stageFilter==="all"||!x.done);
 document.getElementById("objectives").innerHTML=visible.length?visible.map(x=>
   `<div class="objective ${x.done?'done':''}" onclick="toggleObjective(${q.step},${x.i})">
    <span class="check">${x.done?'✓':''}</span><span class="name">${esc(x.name)}</span></div>`
 ).join(""):`<p class="muted">Tous les objectifs de cette étape sont validés.</p>`;
 const a=document.getElementById("showAllBtn"),b=document.getElementById("showMissingBtn");
 if(a&&b){a.style.borderColor=stageFilter==="all"?"var(--gold)":"var(--line)";b.style.borderColor=stageFilter==="missing"?"var(--gold)":"var(--line)";}
}
function setStageFilter(value){stageFilter=value;renderStage()}
function toggleObjective(step,i){
 current().done[step][i]=!current().done[step][i];
 if(stageComplete(step)&&current().currentStep===step&&step<35)current().currentStep=step+1;
 save();
}
function toggleWholeStage(){
 const q=QUEST[selectedStep-1],target=!stageComplete(q.step);
 current().done[q.step]=current().done[q.step].map(()=>target);
 if(target&&current().currentStep<=q.step&&q.step<35)current().currentStep=q.step+1;
 save();
}
function openSync(){
 const sel=document.getElementById("syncStep");
 sel.innerHTML=QUEST.map(q=>`<option value="${q.step}" ${q.step===current().currentStep?'selected':''}>Étape ${q.step} — ${q.kind}</option>`).join("");
 sel.onchange=syncText;syncText();document.getElementById("syncModal").classList.add("show");
}
function syncText(){
 const n=+document.getElementById("syncStep").value;
 document.getElementById("syncExplain").textContent=n===1?"Aucune étape antérieure ne sera validée.":`Les étapes 1 à ${n-1} seront intégralement validées. L’étape ${n} restera en cours.`;
}
function closeSync(){document.getElementById("syncModal").classList.remove("show")}
function applySync(){
 const n=+document.getElementById("syncStep").value;
 QUEST.forEach(q=>{if(q.step<n)current().done[q.step]=q.objectives.map(()=>true)});
 current().currentStep=n;closeSync();save();go("home");
}

function archiQuestDone(name){
 const a=ARCHIS.find(x=>x.name===name);if(!a)return false;
 const q=QUEST[a.step-1],i=q.objectives.indexOf(name);
 return i>=0&&current().done[a.step][i];
}
function setHuntFilter(v){huntFilter=v;renderHunter()}
function initHuntSelectors(){
 const st=document.getElementById("huntStage"),ls=document.getElementById("huntList");
 if(st&&!st.dataset.ready){
  st.innerHTML='<option value="">Toutes les étapes archis</option>'+[...new Set(ARCHIS.map(a=>a.step))].map(n=>`<option value="${n}">Étape ${n}</option>`).join("");
  st.dataset.ready="1";
 }
 if(ls){
  const old=ls.value;
  ls.innerHTML='<option value="">Toutes mes listes</option>'+current().huntLists.map(l=>`<option value="${l.id}">${esc(l.name)}</option>`).join("");
  if([...ls.options].some(o=>o.value===old))ls.value=old;
 }
}
function renderHunter(){
 const box=document.getElementById("hunterList");if(!box)return;
 initHuntSelectors();
 const q=(document.getElementById("huntSearch")?.value||"").trim().toLowerCase();
 const stage=+(document.getElementById("huntStage")?.value||0);
 const listId=document.getElementById("huntList")?.value||"";
 const list=listId?current().huntLists.find(l=>String(l.id)===String(listId)):null;
 let arr=ARCHIS.filter(a=>{
  const stock=current().inventory[a.name]||0,done=archiQuestDone(a.name),fav=!!current().favorites[a.name],note=(current().notes[a.name]||"").toLowerCase();
  const inList=!list||list.items.includes(a.name);
  const text=(a.name+" étape "+a.step+" "+note+" "+(list?list.name:"")).toLowerCase();
  const filterOk=huntFilter==="all"||(huntFilter==="missing"&&!done)||(huntFilter==="favorites"&&fav)||(huntFilter==="stock"&&stock>0);
  return filterOk&&(!stage||a.step===stage)&&inList&&(!q||text.includes(q));
 });
 const missing=ARCHIS.filter(a=>!archiQuestDone(a.name)).length;
 document.getElementById("huntSummary").textContent=missing+" restants";
 box.innerHTML=arr.length?arr.map(a=>{
  const stock=current().inventory[a.name]||0,done=archiQuestDone(a.name),fav=!!current().favorites[a.name],note=current().notes[a.name]||"";
  const lists=current().huntLists.filter(l=>l.items.includes(a.name));
  return `<div class="hunt-card ${fav?'favorite':''}">
   <div class="hunt-top"><div><strong>${esc(a.name)}</strong><div class="meta">Étape ${a.step} · ${done?'Validé dans la quête':'À capturer'} · Stock x${stock}</div></div>
   <button class="star ${fav?'on':''}" onclick="toggleFavorite('${js(a.name)}')">${fav?'★':'☆'}</button></div>
   ${lists.length?`<div style="margin-top:8px">${lists.map(l=>`<span class="tag">${esc(l.name)}</span>`).join(" ")}</div>`:""}
   ${note?`<div class="note">${esc(note)}</div>`:""}
   <div class="hunt-actions">
    <button class="secondary" onclick="quickCapture('${js(a.name)}')">+1 capturé</button>
    <button class="secondary" onclick="openTarget('${js(a.name)}')">Note / liste</button>
    ${stock>0?`<button class="secondary" onclick="openConsumeModal('${js(a.name)}')">Utiliser une pierre</button>`:""}
   </div>
  </div>`;
 }).join(""):'<p class="muted">Aucun archimonstre ne correspond à ces filtres.</p>';
}
function toggleFavorite(name){current().favorites[name]=!current().favorites[name];save()}
function openTarget(name){
 activeTarget=name;
 const a=ARCHIS.find(x=>x.name===name);
 document.getElementById("targetTitle").textContent=name;
 document.getElementById("targetMeta").textContent=`Étape ${a.step} · Stock x${current().inventory[name]||0}`;
 document.getElementById("targetNote").value=current().notes[name]||"";
 const sel=document.getElementById("targetList");
 sel.innerHTML='<option value="">Ne pas ajouter</option>'+current().huntLists.map(l=>`<option value="${l.id}">${esc(l.name)}</option>`).join("");
 showModal("targetModal");
}
function saveTargetDetails(){
 if(!activeTarget)return;
 current().notes[activeTarget]=document.getElementById("targetNote").value.trim();
 const id=document.getElementById("targetList").value;
 if(id){
  const list=current().huntLists.find(l=>String(l.id)===String(id));
  if(list&&!list.items.includes(activeTarget))list.items.push(activeTarget);
 }
 closeModal("targetModal");save();
}
function openListModal(){document.getElementById("listName").value="";showModal("listModal")}
function createHuntList(){
 const name=document.getElementById("listName").value.trim();if(!name)return;
 current().huntLists.push({id:Date.now()+Math.random(),name,items:[]});
 closeModal("listModal");save();
}
function renderCustomLists(){
 const box=document.getElementById("customLists");if(!box)return;
 box.innerHTML=current().huntLists.length?current().huntLists.map(l=>`<div class="adventure"><div class="row between"><div><strong>${esc(l.name)}</strong><div class="muted" style="font-size:12px;margin-top:4px">${l.items.length} archimonstre${l.items.length>1?'s':''}</div></div><button class="secondary danger" onclick="deleteHuntList('${l.id}')">Supprimer</button></div></div>`).join(""):'<p class="muted">Aucune liste personnelle.</p>';
}
function deleteHuntList(id){
 const l=current().huntLists.find(x=>String(x.id)===String(id));if(!l)return;
 if(confirm(`Supprimer la liste « ${l.name} » ?`)){current().huntLists=current().huntLists.filter(x=>String(x.id)!==String(id));save()}
}
function exportBackup(){downloadJson(app,'ocre-companion-v6-sauvegarde-complete.json')}
function importBackup(event){
 const file=event.target.files?.[0];if(!file)return;
 const reader=new FileReader();reader.onload=()=>{
  try{
   const parsed=JSON.parse(reader.result);
   if(!parsed.adventures?.length)throw new Error("Format invalide");
   if(confirm("Remplacer toutes les données actuelles par cette sauvegarde ?")){app=normalizeApp(parsed);save();go("home")}
  }catch(e){alert("Sauvegarde invalide.")}
  event.target.value="";
 };reader.readAsText(file);
}


function kindStats(kind){
 let done=0,total=0;
 QUEST.filter(q=>q.kind===kind).forEach(q=>{done+=current().done[q.step].filter(Boolean).length;total+=q.objectives.length});
 return {done,total,pct:total?Math.round(done/total*100):0};
}
function renderStats(){
 const ring=document.getElementById("ring");if(!ring)return;
 const [d,t]=totals(),pct=t?Math.round(d/t*100):0,s=stockStats();
 ring.style.background=`conic-gradient(var(--gold) ${pct*3.6}deg,#2a2118 0deg)`;
 document.getElementById("ringText").textContent=pct+"%";
 document.getElementById("statDone").textContent=d+" / "+t;
 document.getElementById("statStages").textContent=QUEST.filter(q=>stageComplete(q.step)).length+" / 35";
 document.getElementById("statUnique").textContent=s.unique+" / "+ARCHIS.length;
 document.getElementById("statDup").textContent=s.duplicates;

 const now=Date.now(),day=86400000,cut=now-30*day;
 const recent=current().journal.filter(x=>x.time>=cut);
 const captures30=recent.filter(x=>x.delta>0).reduce((a,b)=>a+b.delta,0);
 const activeDays=new Set(recent.map(x=>new Date(x.time).toISOString().slice(0,10))).size;
 document.getElementById("statCaptures30").textContent=captures30;
 document.getElementById("statActiveDays").textContent=activeDays;

 const days=[];
 for(let i=29;i>=0;i--){
  const d0=new Date(now-i*day);d0.setHours(0,0,0,0);
  const d1=d0.getTime()+day;
  const count=current().journal.filter(x=>x.time>=d0.getTime()&&x.time<d1&&x.delta>0).reduce((a,b)=>a+b.delta,0);
  days.push({date:d0,count});
 }
 document.getElementById("activityGrid").innerHTML=days.map(x=>{
  const lv=x.count===0?"":x.count===1?"lv1":x.count<=3?"lv2":x.count<=6?"lv3":"lv4";
  return `<div class="activity-day ${lv}" title="${x.date.toLocaleDateString('fr-FR')} · ${x.count} capture${x.count>1?'s':''}">${x.date.getDate()}</div>`;
 }).join("");

 const kinds=["Monstres","Boss","Archimonstres","Finale"];
 document.getElementById("categoryChart").innerHTML=kinds.map(k=>{
  const x=kindStats(k);
  return `<div class="chart-row"><span>${k}</span><div class="track"><div class="fill" style="width:${x.pct}%"></div></div><strong>${x.pct}%</strong></div>`;
 }).join("");

 const archiSteps=QUEST.filter(q=>q.kind==="Archimonstres");
 const remaining=ARCHIS.filter(a=>!archiQuestDone(a.name)).length;
 document.getElementById("archiRemaining").textContent=remaining+" restants";
 document.getElementById("archiChart").innerHTML=archiSteps.map(q=>{
  const done=stageDone(q.step),pct=Math.round(done/q.objectives.length*100);
  return `<div class="chart-row"><span>Étape ${q.step}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><strong>${done}/${q.objectives.length}</strong></div>`;
 }).join("");

 const dup=ARCHIS.map(a=>({name:a.name,count:current().inventory[a.name]||0})).filter(x=>x.count>1).sort((a,b)=>b.count-a.count).slice(0,10);
 document.getElementById("duplicateRanking").innerHTML=dup.length?dup.map((x,i)=>`<div class="rank-row"><div class="rank">${i+1}</div><div><strong>${esc(x.name)}</strong><div class="muted" style="font-size:12px">${x.count-1} doublon${x.count>2?'s':''}</div></div><span class="pill">x${x.count}</span></div>`).join(""):'<p class="muted">Aucun doublon pour le moment.</p>';

 const recentCaptures=current().journal.filter(x=>x.delta>0).slice(0,10);
 document.getElementById("recentCaptureRanking").innerHTML=recentCaptures.length?recentCaptures.map((x,i)=>`<div class="rank-row"><div class="rank">${i+1}</div><div><strong>${esc(x.name)}</strong><div class="muted" style="font-size:12px">${new Date(x.time).toLocaleString('fr-FR')}${x.comment?' · '+esc(x.comment):''}</div></div><span class="pill">+${x.delta}</span></div>`).join(""):'<p class="muted">Aucune capture enregistrée.</p>';

 const rec=[];
 const currentQ=QUEST[current().currentStep-1];
 const missingCurrent=currentQ.objectives.filter((_,i)=>!current().done[currentQ.step][i]).length;
 if(missingCurrent)rec.push({title:`Finir l’étape ${currentQ.step}`,text:`Il reste ${missingCurrent} objectif${missingCurrent>1?"s":""} dans l’étape active.`,tag:"Priorité"});
 const nearly=archiSteps.map(q=>({q,left:q.objectives.length-stageDone(q.step)})).filter(x=>x.left>0).sort((a,b)=>a.left-b.left).slice(0,3);
 nearly.forEach(x=>rec.push({title:`Étape ${x.q.step} presque terminée`,text:`Plus que ${x.left} archimonstre${x.left>1?"s":""} à capturer.`,tag:"Rapide"}));
 if(dup.length)rec.push({title:"Doublons disponibles",text:dup.slice(0,3).map(x=>`${x.name} x${x.count}`).join(" · "),tag:"Stock"});
 document.getElementById("recommendations").innerHTML=rec.length?rec.map(r=>`<div class="reco"><div class="row between"><strong>${esc(r.title)}</strong><span class="badge warn">${r.tag}</span></div><div class="muted" style="margin-top:7px">${esc(r.text)}</div></div>`).join(""):'<p class="muted">Aucune recommandation pour le moment.</p>';
}


function setEncyFilter(v){encyFilter=v;renderEncyclopedia()}
function renderEncyclopedia(){
 const box=document.getElementById("encyResults");if(!box)return;
 const q=(document.getElementById("encySearch")?.value||"").trim().toLowerCase();
 let rows=CREATURES.filter(c=>encyFilter==="all"||c.type===encyFilter);
 if(q)rows=rows.filter(c=>(c.name+" "+(c.originalMonster||"")+" "+(c.archimonster||"")+" étape "+c.questStage).toLowerCase().includes(q));
 rows=rows.slice(0,180);
 document.getElementById("dbCount").textContent=DB.monsters.length+" monstres · "+DB.archimonsters.length+" archis";
 document.getElementById("familyAudit").textContent=DB.archimonsters.filter(a=>a.family).length+" / "+DB.archimonsters.length;
 document.getElementById("zoneAudit").textContent=DB.archimonsters.filter(a=>a.zones?.length).length+" / "+DB.archimonsters.length;
 box.innerHTML=rows.length?rows.map(c=>`<div class="creature-card" onclick="openCreature('${c.id}')"><div class="row between"><div><strong>${esc(c.name)}</strong><div class="muted" style="font-size:12px;margin-top:4px">${c.type} · Étape ${c.questStage||"—"}</div></div><span class="pill">Fiche</span></div>${c.originalMonster?`<div class="note">Monstre d’origine : ${esc(c.originalMonster)}</div>`:c.archimonster?`<div class="note">Archimonstre : ${esc(c.archimonster)}</div>`:""}</div>`).join(""):'<p class="muted">Aucun résultat.</p>';
}
function openCreature(id){
 const c=CREATURES.find(x=>x.id===id);if(!c)return;
 let m=document.getElementById("creatureModal");if(!m){m=document.createElement("div");m.id="creatureModal";m.className="modal";m.onclick=e=>{if(e.target===m)m.classList.remove("show")};document.body.appendChild(m)}
 m.innerHTML=`<div class="sheet"><h3>${esc(c.name)}</h3><p class="muted">${c.type} · Étape ${c.questStage||"—"}</p><div class="creature-grid">
 ${c.originalMonster?`<div class="field"><span>Monstre d’origine</span><strong>${esc(c.originalMonster)}</strong></div>`:""}
 ${c.archimonster?`<div class="field"><span>Archimonstre associé</span><strong>${esc(c.archimonster)}</strong></div>`:""}
 ${c.type==="archimonstre"?`<div class="field"><span>Stock</span><strong>x${current().inventory[c.name]||0}</strong></div>`:""}
 <div class="field"><span>Famille</span><strong class="audit-pending">${esc(c.family||"À auditer")}</strong></div>
 <div class="field"><span>Zones</span><strong class="audit-pending">${esc(c.zones?.join(", ")||"À auditer")}</strong></div>
 <div class="field"><span>Niveau</span><strong class="audit-pending">${c.levelMin||"À auditer"}</strong></div></div>
 <button class="primary" onclick="document.getElementById('creatureModal').classList.remove('show')">Fermer</button></div>`;m.classList.add("show")
}


function archiStock(name){return current().inventory[name]||0}
function stageInventoryStatus(step){
 const q=QUEST[step-1];
 if(!q||q.kind!=="Archimonstres")return null;
 const rows=q.objectives.map((name,i)=>({name,i,done:current().done[step][i],stock:archiStock(name)}));
 const missing=rows.filter(x=>!x.done);
 const available=missing.filter(x=>x.stock>0);
 return {
  step,
  rows,
  missing,
  available,
  ready:missing.length>0&&missing.every(x=>x.stock>0),
  alreadyComplete:missing.length===0
 };
}
function renderAssistant(){
 const box=document.getElementById("readyStages");if(!box)return;
 const statuses=QUEST.filter(q=>q.kind==="Archimonstres").map(q=>stageInventoryStatus(q.step));
 const ready=statuses.filter(x=>x.ready);
 const stones=ready.reduce((sum,x)=>sum+x.missing.length,0);
 document.getElementById("readyCount").textContent=ready.length+" étape"+(ready.length>1?"s":"");
 document.getElementById("readyNow").textContent=ready.length;
 document.getElementById("readyStones").textContent=stones;
 box.innerHTML=ready.length?ready.map(x=>`<div class="ready-card">
  <div class="row between"><div><h3>Étape ${x.step}</h3><div class="muted">${x.missing.length} pierre${x.missing.length>1?"s":""} disponible${x.missing.length>1?"s":""}</div></div><span class="pill">Prête</span></div>
  <div class="ready-list">${x.missing.slice(0,5).map(r=>`<div class="ready-item"><span>${esc(r.name)}</span><span class="pill">x${r.stock}</span></div>`).join("")}${x.missing.length>5?`<div class="muted">+ ${x.missing.length-5} autre${x.missing.length-5>1?"s":""}</div>`:""}</div>
  <button class="primary" onclick="openApplyStage(${x.step})">Préparer le rendu</button>
 </div>`).join(""):'<p class="muted">Aucune étape d’archimonstres n’est entièrement terminable avec le stock actuel.</p>';

 const currentStep=current().currentStep;
 document.getElementById("assistantCurrentStep").textContent="Étape "+currentStep;
 const q=QUEST[currentStep-1];
 const currentBox=document.getElementById("currentStepAssistant");
 if(q.kind!=="Archimonstres"){
  currentBox.innerHTML=`<div class="notice">L’étape actuelle concerne les ${q.kind.toLowerCase()}. L’assistant d’inventaire s’activera automatiquement pour les étapes d’archimonstres.</div>`;
 }else{
  const st=stageInventoryStatus(currentStep);
  currentBox.innerHTML=`<div class="ready-card">
   <div class="row between"><strong>${st.missing.length} archimonstre${st.missing.length>1?"s":""} restant${st.missing.length>1?"s":""}</strong><span class="pill">${st.available.length} en stock</span></div>
   <div class="ready-list">${st.missing.map(r=>`<div class="ready-item ${r.stock>0?"":"missing"}"><span>${esc(r.name)}</span><span class="pill">${r.stock>0?"Stock x"+r.stock:"Absent"}</span></div>`).join("")}</div>
   ${st.ready?`<button class="primary" onclick="openApplyStage(${currentStep})">Préparer le rendu complet</button>`:""}
  </div>`;
 }
}
function openApplyStage(step){
 const st=stageInventoryStatus(step);if(!st||!st.ready)return;
 pendingApplyStep=step;
 document.getElementById("applyStageTitle").textContent="Rendre l’étape "+step;
 document.getElementById("applyStageText").textContent=`${st.missing.length} archimonstre${st.missing.length>1?"s":""} seront validés et consommés de l’inventaire.`;
 document.getElementById("applyStageItems").innerHTML=st.missing.map(r=>`<div class="ready-item"><span>${esc(r.name)}</span><span class="pill">x${r.stock} → x${r.stock-1}</span></div>`).join("");
 showModal("applyStageModal");
}
function confirmApplyStage(){
 const step=pendingApplyStep,st=stageInventoryStatus(step);if(!st||!st.ready)return;
 const a=current();
 st.missing.forEach(r=>{
  a.inventory[r.name]=Math.max(0,(a.inventory[r.name]||0)-1);
  a.done[step][r.i]=true;
  a.journal.unshift({id:Date.now()+Math.random(),time:Date.now(),name:r.name,delta:-1,comment:`Rendu étape ${step}`});
 });
 a.journal=a.journal.slice(0,300);
 if(stageComplete(step)&&a.currentStep<=step&&step<35)a.currentStep=step+1;
 pendingApplyStep=null;closeModal("applyStageModal");save();go("assistantPage");
}

function renderSearch(){
 const q=(document.getElementById("search").value||"").trim().toLowerCase();
 const out=document.getElementById("searchResults");if(!q){out.innerHTML='<p class="muted">Recherche dans les boss et archimonstres déjà audités.</p>';return}
 const rows=[];QUEST.forEach(s=>s.objectives.forEach((n,i)=>{if(n.toLowerCase().includes(q))rows.push({s,n,i})}));
 out.innerHTML=rows.length?rows.map(r=>{const inv=ARCHIS.some(a=>a.name===r.n)?(current().inventory[r.n]||0):null;return `<div class="step"><span onclick="openStage(${r.s.step})" style="flex:1"><strong>${esc(r.n)}</strong><small>Étape ${r.s.step} · ${r.s.kind}${inv!==null?' · Stock x'+inv:''}</small></span>${inv!==null?`<div class="counter"><button onclick="openConsumeModal('${js(r.n)}')" ${inv<=0?'disabled style="opacity:.35"':''}>−</button><span class="count">${inv}</span><button onclick="quickCapture('${js(r.n)}')">+</button></div>`:`<span class="pill">${current().done[r.s.step][r.i]?'✓':'›'}</span>`}</div>`}).join(""):'<p class="muted">Aucun résultat.</p>';
}
function resetAll(){if(confirm("Réinitialiser toute la progression V2 ?")){Object.assign(current(),makeAdventure(current().name));save();go("home")}}

function renderInventory(){const b=document.getElementById('inventoryList');if(!b)return;const q=(document.getElementById('invSearch')?.value||'').toLowerCase();let total=0;Object.values(current().inventory).forEach(v=>total+=v);document.getElementById('invPill').textContent=total+' pierre'+(total>1?'s':'');b.innerHTML=ARCHIS.filter(a=>a.name.toLowerCase().includes(q)).map(a=>{const n=current().inventory[a.name]||0;return `<div class="inv-row"><div><strong>${esc(a.name)}</strong><div class="muted" style="font-size:12px;margin-top:3px">Étape ${a.step}${n>1?' · '+(n-1)+' doublon'+(n>2?'s':''):''}</div></div><div class="counter"><button onclick="openConsumeModal('${js(a.name)}')" ${n<=0?'disabled style="opacity:.35"':''}>−</button><span class="count">${n}</span><button onclick="quickCapture('${js(a.name)}')">+</button></div></div>`}).join('')}

function openCaptureModal(){
 captureName=null;captureQty=1;
 document.getElementById("captureSearch").value="";
 document.getElementById("captureChoices").innerHTML="";
 document.getElementById("captureSelected").style.display="none";
 document.getElementById("captureConfirm").disabled=true;
 document.getElementById("captureComment").value="";
 showModal("captureModal");
 setTimeout(()=>document.getElementById("captureSearch").focus(),150);
}
function renderCaptureChoices(){
 const q=(document.getElementById("captureSearch").value||"").trim().toLowerCase(),box=document.getElementById("captureChoices");
 if(!q){box.innerHTML='<p class="muted">Commence à taper le nom.</p>';return}
 const rows=ARCHIS.filter(a=>a.name.toLowerCase().includes(q)).slice(0,30);
 box.innerHTML=rows.length?rows.map(a=>`<button class="result" onclick="selectCapture('${js(a.name)}')"><span><strong>${esc(a.name)}</strong><small>Étape ${a.step} · Stock x${current().inventory[a.name]||0}</small></span><span class="pill">Choisir</span></button>`).join(""):'<p class="muted">Aucun archimonstre trouvé.</p>';
}
function selectCapture(name){
 captureName=name;captureQty=1;
 const a=ARCHIS.find(x=>x.name===name);
 document.getElementById("captureSelected").style.display="block";
 document.getElementById("captureSelectedText").textContent=`${name} · Étape ${a.step} · Stock actuel x${current().inventory[name]||0}`;
 document.getElementById("captureChoices").innerHTML="";
 document.getElementById("captureSearch").value=name;
 document.getElementById("captureConfirm").disabled=false;
 paintQty(".qty-grid button",0);
}
function setCaptureQty(q){captureQty=q;paintQty("#captureModal .qty-grid button",q-1)}
function paintQty(selector,index){document.querySelectorAll(selector).forEach((b,i)=>b.classList.toggle("active",i===index))}
function confirmCapture(){
 if(!captureName)return;
 const a=current(),before=a.inventory[captureName]||0;
 a.inventory[captureName]=before+captureQty;
 a.journal.unshift({id:Date.now()+Math.random(),time:Date.now(),name:captureName,delta:captureQty,comment:document.getElementById("captureComment").value.trim()});
 a.journal=a.journal.slice(0,300);
 closeModal("captureModal");save();
}
function quickCapture(name){
 const a=current(),before=a.inventory[name]||0;
 a.inventory[name]=before+1;
 a.journal.unshift({id:Date.now()+Math.random(),time:Date.now(),name,delta:1,comment:"Capture rapide"});
 a.journal=a.journal.slice(0,300);save();
}
function openConsumeModal(name){
 const stock=current().inventory[name]||0;if(stock<=0)return;
 consumeName=name;consumeQty=1;
 document.getElementById("consumeText").textContent=`${name} · Stock actuel x${stock}`;
 document.getElementById("consumeConfirm").disabled=false;
 document.querySelectorAll("#consumeModal .qty-grid button").forEach((b,i)=>{b.disabled=i+1>stock;b.style.opacity=b.disabled?".35":"1"});
 paintQty("#consumeModal .qty-grid button",0);showModal("consumeModal");
}
function setConsumeQty(q){
 if((current().inventory[consumeName]||0)<q)return;
 consumeQty=q;paintQty("#consumeModal .qty-grid button",q-1);
}
function confirmConsume(){
 if(!consumeName)return;
 const a=current(),before=a.inventory[consumeName]||0,real=Math.min(consumeQty,before);
 if(real<=0)return;
 a.inventory[consumeName]=before-real;
 a.journal.unshift({id:Date.now()+Math.random(),time:Date.now(),name:consumeName,delta:-real,comment:"Pierre utilisée"});
 a.journal=a.journal.slice(0,300);
 closeModal("consumeModal");save();
}
function undoJournal(id){
 const a=current(),idx=a.journal.findIndex(x=>String(x.id)===String(id));if(idx<0)return;
 const item=a.journal[idx],stock=a.inventory[item.name]||0,target=stock-item.delta;
 if(target<0){alert("Impossible d’annuler : le stock serait négatif.");return}
 a.inventory[item.name]=target;a.journal.splice(idx,1);save();
}

function changeInventory(name,delta){const a=current(),before=a.inventory[name]||0,after=Math.max(0,before+delta);if(after===before)return;a.inventory[name]=after;a.journal.unshift({id:Date.now()+Math.random(),time:Date.now(),name,delta:after-before,comment:""});a.journal=a.journal.slice(0,100);save()}
function renderJournal(){const b=document.getElementById('journal');if(!b)return;b.innerHTML=current().journal.length?current().journal.slice(0,20).map(x=>`<div class="objective"><span class="check">${x.delta>0?'+':'−'}</span><span><strong>${esc(x.name)}</strong><small class="muted">${new Date(x.time).toLocaleString('fr-FR')}</small></span></div>`).join(''):'<p class="muted">Aucune modification récente.</p>'}
function clearJournal(){if(confirm('Effacer le journal ?')){current().journal=[];save()}}
function setAdventureFilter(v){adventureFilter=v;renderAdventures()}
function adventureTotals(a){let d=0,t=0;QUEST.forEach(q=>{d+=a.done[q.step].filter(Boolean).length;t+=q.objectives.length});return[d,t]}
function renderAdventures(){
 const b=document.getElementById('adventureList');if(!b)return;
 const list=app.adventures.filter(a=>adventureFilter==='all'||(adventureFilter==='archived'&&a.archived)||(adventureFilter==='active'&&!a.archived));
 b.innerHTML=list.length?list.map(a=>{
  const d=adventureTotals(a),stock=Object.values(a.inventory||{}).reduce((x,y)=>x+y,0),active=a.id===app.activeId;
  return `<div class="adventure ${active?'active':''} ${a.archived?'archived':''}">
   <div class="row between"><div><strong>${esc(a.name)}</strong><div class="muted" style="font-size:12px;margin-top:4px">${esc(a.game||'Dofus Rétro')} · Étape ${a.currentStep} · ${d[0]}/${d[1]} · ${stock} pierres</div></div>${active?'<span class="pill">Active</span>':`<button class="secondary" onclick="switchAdventure('${a.id}')">Ouvrir</button>`}</div>
   <div class="chars">${a.team.map(c=>`<span class="char">${esc(c)}</span>`).join('')}</div>
   <div class="adventure-actions">
    <button class="secondary" onclick="renameAdventure('${a.id}')">Renommer</button>
    <button class="secondary" onclick="duplicateAdventure('${a.id}')">Dupliquer</button>
    <button class="secondary" onclick="toggleArchive('${a.id}')">${a.archived?'Désarchiver':'Archiver'}</button>
    <button class="secondary" onclick="exportAdventureById('${a.id}')">Exporter</button>
    <button class="secondary danger" onclick="deleteAdventure('${a.id}')">Supprimer</button>
   </div>
  </div>`;
 }).join(''):'<p class="muted">Aucune aventure dans cette catégorie.</p>'
}
function newAdventurePrompt(){
 const name=prompt('Nom de la nouvelle aventure :','Nouvelle aventure');if(!name)return;
 const a=makeAdventure(name.trim());app.adventures.push(a);app.activeId=a.id;selectedStep=1;save();go('home')
}
function renameAdventure(id){
 const a=app.adventures.find(x=>String(x.id)===String(id));if(!a)return;
 const name=prompt('Nouveau nom de l’aventure :',a.name);if(name===null)return;
 const game=prompt('Type de jeu :',a.game||'Dofus Rétro');if(game===null)return;
 a.name=name.trim()||a.name;a.game=game.trim()||'Dofus Rétro';save()
}
function duplicateAdventure(id){
 const src=app.adventures.find(x=>String(x.id)===String(id));if(!src)return;
 const copy=JSON.parse(JSON.stringify(src));copy.id=Date.now()+Math.random();copy.name=src.name+' — copie';copy.archived=false;copy.createdAt=Date.now();
 app.adventures.push(copy);app.activeId=copy.id;selectedStep=copy.currentStep;save();go('home')
}
function toggleArchive(id){
 const a=app.adventures.find(x=>String(x.id)===String(id));if(!a)return;
 if(a.id===app.activeId&&!a.archived){
  const replacement=app.adventures.find(x=>x.id!==a.id&&!x.archived);
  if(!replacement){alert('Crée ou désarchive une autre aventure avant d’archiver celle-ci.');return}
  app.activeId=replacement.id
 }
 a.archived=!a.archived;selectedStep=current().currentStep;save()
}
function deleteAdventure(id){
 const a=app.adventures.find(x=>String(x.id)===String(id));if(!a)return;
 if(app.adventures.length===1){alert('Il faut conserver au moins une aventure.');return}
 if(!confirm(`Supprimer définitivement « ${a.name} » ?`))return;
 app.adventures=app.adventures.filter(x=>String(x.id)!==String(id));
 if(String(app.activeId)===String(id))app.activeId=(app.adventures.find(x=>!x.archived)||app.adventures[0]).id;
 selectedStep=current().currentStep;save()
}
function switchAdventure(id){const a=app.adventures.find(x=>String(x.id)===String(id));if(!a)return;app.activeId=a.id;selectedStep=current().currentStep;save();go('home')}
function downloadJson(data,filename){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function safeFile(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'aventure'}
function exportAdventureById(id){const a=app.adventures.find(x=>String(x.id)===String(id));if(!a)return;downloadJson({type:'ocre-companion-adventure',version:6,adventure:a},`ocre-aventure-${safeFile(a.name)}.json`)}
function exportCurrentAdventure(){exportAdventureById(current().id)}
function importAdventure(event){
 const file=event.target.files?.[0];if(!file)return;
 const reader=new FileReader();reader.onload=()=>{try{
  const parsed=JSON.parse(reader.result),raw=parsed.adventure||parsed;if(!raw.name||!raw.done)throw new Error();
  const normalized=normalizeApp({activeId:raw.id,adventures:[raw]}).adventures[0];
  normalized.id=Date.now()+Math.random();normalized.name+=' — importée';normalized.archived=false;
  app.adventures.push(normalized);app.activeId=normalized.id;selectedStep=normalized.currentStep;save();go('home')
 }catch(e){alert('Fichier d’aventure invalide.')}event.target.value=''};reader.readAsText(file)
}
function renderTeam(){const b=document.getElementById('teamView');if(!b)return;b.innerHTML=current().team.map(c=>`<span class="char">${esc(c)}</span>`).join('')}
function editTeam(){const value=prompt('Noms des personnages, séparés par des virgules (8 maximum) :',current().team.join(', '));if(value===null)return;const names=value.split(',').map(x=>x.trim()).filter(Boolean).slice(0,8);current().team=names.length?names:['Personnage 1'];save()}
function js(s){return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}

function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
updateAll();
if("serviceWorker" in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
