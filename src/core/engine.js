(function(global){
  "use strict";

  function create(options){
    const quest=options.quest||[];
    const archimonsters=options.archimonsters||[];
    const adventure=options.adventure||{};
    const done=adventure.done||{};
    const inventory=adventure.inventory||{};

    const stageByNumber=new Map(quest.map(stage=>[stage.step,stage]));
    const archiByName=new Map(archimonsters.map(archi=>[archi.name,archi]));

    function stage(number){return stageByNumber.get(Number(number))||null}
    function stageDone(number){const values=done[number]||[];return values.filter(Boolean).length}
    function stageComplete(number){const q=stage(number);return !!q&&stageDone(number)===q.objectives.length}
    function stageMissing(number){const q=stage(number);if(!q)return[];return q.objectives.map((name,index)=>({name,index,done:!!(done[number]||[])[index],stock:Number(inventory[name]||0)})).filter(x=>!x.done)}
    function totals(){let completed=0,total=0;quest.forEach(q=>{completed+=stageDone(q.step);total+=q.objectives.length});return{completed,total,percent:total?Math.round(completed/total*100):0}}
    function stagesComplete(){return quest.filter(q=>stageComplete(q.step)).length}
    function firstIncomplete(){const q=quest.find(x=>!stageComplete(x.step));return q?q.step:(quest.at(-1)?.step||1)}
    function progressByKind(kind){let completed=0,total=0;quest.filter(q=>q.kind===kind).forEach(q=>{completed+=stageDone(q.step);total+=q.objectives.length});return{completed,total,remaining:Math.max(0,total-completed),percent:total?Math.round(completed/total*100):0}}
    function stockStats(){const values=Object.values(inventory).map(v=>Number(v||0));return{total:values.reduce((a,b)=>a+b,0),unique:values.filter(v=>v>0).length,duplicates:values.reduce((a,b)=>a+Math.max(0,b-1),0)}}
    function stageInventoryStatus(number){const q=stage(number);if(!q||q.kind!=="Archimonstres")return null;const rows=q.objectives.map((name,index)=>({name,index,done:!!(done[number]||[])[index],stock:Number(inventory[name]||0)}));const missing=rows.filter(x=>!x.done);const available=missing.filter(x=>x.stock>0);return{step:number,rows,missing,available,ready:missing.length>0&&missing.every(x=>x.stock>0),alreadyComplete:missing.length===0,needHunt:Math.max(0,missing.length-available.length)}}
    function readyStages(){return quest.filter(q=>q.kind==="Archimonstres").map(q=>stageInventoryStatus(q.step)).filter(x=>x&&x.ready)}
    function closestArchiStages(){return quest.filter(q=>q.kind==="Archimonstres").map(q=>stageInventoryStatus(q.step)).filter(x=>x&&x.missing.length>0).sort((a,b)=>a.needHunt-b.needHunt||a.missing.length-b.missing.length||a.step-b.step)}
    function inventoryAnalysis(){let usable=0,future=0,duplicates=0,total=0;archimonsters.forEach(archi=>{const stock=Number(inventory[archi.name]||0);total+=stock;duplicates+=Math.max(0,stock-1);const q=stage(archi.questStage);const index=q?q.objectives.indexOf(archi.name):-1;const validated=index>=0?!!(done[archi.questStage]||[])[index]:false;if(!validated&&stock>0)usable++;if(validated)future+=stock});return{usable,future,duplicates,total}}
    function questStatus(name){const archi=archiByName.get(name);if(!archi)return{done:false,step:null,index:-1};const q=stage(archi.questStage),index=q?q.objectives.indexOf(name):-1;return{done:index>=0?!!(done[archi.questStage]||[])[index]:false,step:archi.questStage,index}}
    function recommendation(minutes){const currentStage=stage(adventure.currentStep)||quest[0],ready=readyStages();if(ready.length){const x=ready[0];return{type:"ready",step:x.step,title:`Rendre l’étape ${x.step}`,text:`Les ${x.missing.length} pierres manquantes sont déjà dans ton inventaire.`,button:"Préparer le rendu"}}
      if(currentStage.kind!=="Archimonstres"){const missing=stageMissing(currentStage.step);return{type:"current",step:currentStage.step,title:`Continuer l’étape ${currentStage.step}`,text:`Il reste ${missing.length} objectif${missing.length>1?'s':''} de type ${currentStage.kind.toLowerCase()}.`,button:"Voir l’étape"}}
      const pages=closestArchiStages(),best=pages[0];if(!best)return{type:"done",step:null,title:"Éternelle Moisson terminée",text:"Toutes les étapes d’archimonstres sont validées.",button:"Voir la quête"};const budget=minutes<=30?2:minutes<=60?4:minutes<=120?7:12,target=pages.find(x=>x.needHunt<=budget)||best;return{type:"hunt",step:target.step,title:`Cibler l’étape ${target.step}`,text:`${target.available.length} cible${target.available.length>1?'s':''} déjà en stock, ${target.needHunt} encore à chasser.`,button:"Voir les cibles"}}

    function auditedGroups(field){const map=new Map();archimonsters.forEach(a=>{const vals=field==="family"?(a.family?[a.family]:[]):Array.isArray(a.zones)?a.zones:[];vals.forEach(value=>{if(!map.has(value))map.set(value,{name:value,total:0,done:0,missing:0,inStock:0});const row=map.get(value),status=questStatus(a.name);row.total++;if(status.done)row.done++;else row.missing++;if(Number(inventory[a.name]||0)>0)row.inStock++;});});return[...map.values()].sort((a,b)=>b.missing-a.missing||b.inStock-a.inStock||a.name.localeCompare(b.name))}
    function dataCoverage(){const total=archimonsters.length,families=archimonsters.filter(a=>a.family).length,zones=archimonsters.filter(a=>Array.isArray(a.zones)&&a.zones.length).length,levels=archimonsters.filter(a=>a.levelMin).length;return{total,families,zones,levels,familyPercent:total?Math.round(families/total*100):0,zonePercent:total?Math.round(zones/total*100):0,levelPercent:total?Math.round(levels/total*100):0}}
    function auditIssues(archi){
      const issues=[];
      if(!archi.family)issues.push("family");
      if(!Array.isArray(archi.zones)||!archi.zones.length)issues.push("zones");
      if(!Number(archi.levelMin))issues.push("levels");
      const source=archi.audit?.source||archi.source?.candidate||archi.source?.relationship;
      if(!source)issues.push("source");
      if(Number(archi.levelMin)&&Number(archi.levelMax)&&Number(archi.levelMin)>Number(archi.levelMax))issues.push("range");
      if(archi.recommendedZone&&Array.isArray(archi.zones)&&archi.zones.length&&!archi.zones.includes(archi.recommendedZone))issues.push("recommended");
      if(!archi.originalMonster||!stage(archi.questStage)?.objectives.includes(archi.name))issues.push("relation");
      return issues
    }
    function dataQuality(){
      const idCounts=new Map(),nameCounts=new Map(),originals=new Set(archimonsters.map(a=>a.originalMonster).filter(Boolean));
      archimonsters.forEach(a=>{idCounts.set(a.id,(idCounts.get(a.id)||0)+1);nameCounts.set(a.name,(nameCounts.get(a.name)||0)+1)});
      const records=archimonsters.map(a=>({id:a.id,name:a.name,step:a.questStage,issues:auditIssues(a)}));
      const duplicateIds=[...idCounts].filter(([,n])=>n>1).map(([value,count])=>({value,count}));
      const duplicateNames=[...nameCounts].filter(([,n])=>n>1).map(([value,count])=>({value,count}));
      const brokenRelations=records.filter(r=>r.issues.includes("relation"));
      const complete=records.filter(r=>r.issues.length===0).length;
      return{total:records.length,complete,incomplete:records.length-complete,issueCount:records.reduce((n,r)=>n+r.issues.length,0),records,duplicateIds,duplicateNames,brokenRelations,uniqueOriginals:originals.size}
    }
    function priorityGroups(field){
      return auditedGroups(field).map(row=>{
        const completion=row.total?row.done/row.total:0;
        const score=Math.round(row.missing*10+row.inStock*4+completion*8);
        return{...row,score,percent:row.total?Math.round(row.done/row.total*100):0}
      }).sort((a,b)=>b.score-a.score||b.missing-a.missing||a.name.localeCompare(b.name))
    }
    function compareYears(sessions,yearA,yearB){
      const a=calendarYear(sessions,yearA),b=calendarYear(sessions,yearB);
      const rateA=a.duration?a.captures/(a.duration/3600000):0,rateB=b.duration?b.captures/(b.duration/3600000):0;
      return{a:{...a,rate:rateA},b:{...b,rate:rateB},winner:a.captures===b.captures?"tie":a.captures>b.captures?"a":"b"}
    }
    function annualRecords(sessions){
      const years=[...new Set((sessions||[]).map(s=>new Date(s.startedAt).getFullYear()))],yearRows=years.map(y=>calendarYear(sessions,y));
      const bestYear=[...yearRows].sort((a,b)=>b.captures-a.captures)[0]||null;
      return{bestYear}
    }
    function questUniqueArchisCount(){return archimonsters.filter(a=>questStatus(a.name).done).length}
    function calendarYear(sessions,year){
      const months=[];
      for(let month=0;month<12;month++){
        const rows=(sessions||[]).filter(s=>{const d=new Date(s.startedAt);return d.getFullYear()===year&&d.getMonth()===month});
        const captures=rows.flatMap(s=>s.captures||[]),duration=rows.reduce((n,s)=>n+(sessionSummary(s)?.duration||0),0);
        months.push({month,sessions:rows.length,captures:captures.length,unique:new Set(captures.map(x=>x.name)).size,duration})
      }
      return{year,months,sessions:months.reduce((n,x)=>n+x.sessions,0),captures:months.reduce((n,x)=>n+x.captures,0),duration:months.reduce((n,x)=>n+x.duration,0)}
    }
    function completedStagesCount(){return quest.filter(q=>stageComplete(q.step)).length}
    function calendarMonth(sessions,year,month){
      const rows=(sessions||[]).filter(s=>{const d=new Date(s.startedAt);return d.getFullYear()===year&&d.getMonth()===month});
      const byDay={};rows.forEach(s=>{const day=new Date(s.startedAt).getDate();(byDay[day]||(byDay[day]=[])).push(s)});
      return{year,month,sessions:rows,byDay}
    }
    function stageGoalProgress(goal){
      const step=Number(goal.stage||goal.target||0),q=stage(step);
      if(!q)return 0;
      return stageComplete(step)?1:stageDone(step)/Math.max(q.objectives.length,1)
    }
    function scopedCaptures(goal,sessions){
      const rows=goal.period==="all"?(sessions||[]):(sessions||[]).filter(s=>(s.endedAt||s.startedAt)>=Date.now()-(Number(goal.period)||7)*86400000);
      let captures=rows.flatMap(s=>s.captures||[]);
      if(goal.scopeType==="zone"&&goal.scopeValue)captures=captures.filter(c=>(archimonsters.find(a=>a.name===c.name)?.zones||[]).includes(goal.scopeValue));
      if(goal.scopeType==="family"&&goal.scopeValue)captures=captures.filter(c=>archimonsters.find(a=>a.name===c.name)?.family===goal.scopeValue);
      return captures
    }
    function monthlySummary(sessions,date=new Date()){
      const start=new Date(date.getFullYear(),date.getMonth(),1).getTime(),rows=(sessions||[]).filter(s=>(s.endedAt||s.startedAt)>=start);
      const captures=rows.flatMap(s=>s.captures||[]),duration=rows.reduce((n,s)=>n+(sessionSummary(s)?.duration||0),0);
      return{sessions:rows.length,captures:captures.length,unique:new Set(captures.map(x=>x.name)).size,duration}
    }
    function periodSummary(sessions,days){
      const cutoff=Date.now()-days*86400000,rows=(sessions||[]).filter(s=>(s.endedAt||s.startedAt)>=cutoff);
      const captures=rows.flatMap(s=>s.captures||[]),duration=rows.reduce((n,s)=>n+(sessionSummary(s)?.duration||0),0);
      return{days,sessions:rows.length,captures:captures.length,unique:new Set(captures.map(x=>x.name)).size,duration,rate:duration?captures.length/(duration/3600000):0}
    }
    function goalProgress(goal,sessions){
      if(goal.type==="stage")return stageGoalProgress(goal);
      if(goal.type==="stages_count")return completedStagesCount();
      if(goal.type==="quest_unique")return questUniqueArchisCount();
      const rows=goal.period==="all"?(sessions||[]):(sessions||[]).filter(s=>(s.endedAt||s.startedAt)>=Date.now()-(Number(goal.period)||7)*86400000);
      const captures=scopedCaptures(goal,sessions);
      if(goal.type==="captures")return captures.length;
      if(goal.type==="unique")return new Set(captures.map(x=>x.name)).size;
      if(goal.type==="sessions")return rows.length;
      if(goal.type==="minutes")return Math.round(rows.reduce((n,s)=>n+(sessionSummary(s)?.duration||0),0)/60000);
      return 0
    }
    function sessionTrend(sessions,limit=10){
      const rows=[...(sessions||[])].slice(0,limit).reverse().map(session=>{const summary=sessionSummary(session),rate=summary.duration?summary.captures/(summary.duration/3600000):0;return{session,summary,rate}});
      const first=rows[0]?.rate||0,last=rows[rows.length-1]?.rate||0;
      return{rows,delta:last-first,direction:last>first?"up":last<first?"down":"flat"}
    }
    function compareSessions(a,b){
      const sa=sessionSummary(a),sb=sessionSummary(b);
      const rateA=sa?.duration?sa.captures/(sa.duration/3600000):0,rateB=sb?.duration?sb.captures/(sb.duration/3600000):0;
      return{a:{summary:sa,rate:rateA},b:{summary:sb,rate:rateB},winner:rateA===rateB?"tie":rateA>rateB?"a":"b"}
    }
    function personalRecords(sessions){
      const completed=(sessions||[]).filter(s=>s.endedAt);
      const summaries=completed.map(s=>({session:s,summary:sessionSummary(s)}));
      const bestSession=summaries.sort((a,b)=>(b.summary.captures/Math.max(b.summary.duration,60000))-(a.summary.captures/Math.max(a.summary.duration,60000)))[0]||null;
      const totalCaptures=summaries.reduce((n,x)=>n+x.summary.captures,0),totalDuration=summaries.reduce((n,x)=>n+x.summary.duration,0);
      return{sessions:completed.length,totalCaptures,totalDuration,averageRate:totalDuration?totalCaptures/(totalDuration/3600000):0,bestSession}
    }
    function routePerformance(sessions){
      const map=new Map();
      (sessions||[]).forEach(session=>(session.rows||[]).forEach(route=>{
        const key=route.key||route.name,entry=map.get(key)||{key,name:route.name,sessions:0,duration:0,captures:0,unique:new Set()};
        entry.sessions++;entry.duration+=sessionSummary(session)?.duration||0;
        (session.captures||[]).filter(c=>(route.items||[]).includes(c.name)).forEach(c=>{entry.captures++;entry.unique.add(c.name)});
        map.set(key,entry)
      }));
      return[...map.values()].map(x=>({...x,unique:x.unique.size,rate:x.duration?x.captures/(x.duration/3600000):0})).sort((a,b)=>b.rate-a.rate)
    }
    function sessionSummary(session){
      if(!session)return null;
      const captures=Array.isArray(session.captures)?session.captures:[];
      return{duration:Math.max(0,(session.endedAt||Date.now())-session.startedAt),captures:captures.length,unique:new Set(captures.map(x=>x.name)).size,targetCount:Array.isArray(session.targets)?session.targets.length:0,routeCount:Array.isArray(session.rows)?session.rows.length:0}
    }
    function routePlan(field,duration){
      const capacity=duration<=30?1:duration<=60?2:duration<=120?3:4;
      return priorityGroups(field).slice(0,capacity).map((row,index)=>({...row,order:index+1,minutes:Math.max(10,Math.round(duration/capacity))}))
    }
    function auditWorkflowSummary(workflow){
      workflow=workflow||{};
      const statuses={pending:0,review:0,validated:0};
      archimonsters.forEach(a=>{const s=workflow[a.id]?.status||"pending";statuses[s]=(statuses[s]||0)+1});
      return{...statuses,total:archimonsters.length,percent:archimonsters.length?Math.round(statuses.validated/archimonsters.length*100):0}
    }
    function snapshot(){return{totals:totals(),stagesComplete:stagesComplete(),archimonsters:progressByKind("Archimonstres"),stock:stockStats(),inventory:inventoryAnalysis(),readyStages:readyStages(),firstIncomplete:firstIncomplete()}}

    return{stage,stageDone,stageComplete,stageMissing,totals,stagesComplete,firstIncomplete,progressByKind,stockStats,stageInventoryStatus,readyStages,closestArchiStages,inventoryAnalysis,questStatus,recommendation,auditedGroups,dataCoverage,auditIssues,dataQuality,priorityGroups,compareYears,annualRecords,questUniqueArchisCount,calendarYear,completedStagesCount,calendarMonth,stageGoalProgress,scopedCaptures,monthlySummary,periodSummary,goalProgress,sessionTrend,compareSessions,personalRecords,routePerformance,sessionSummary,routePlan,auditWorkflowSummary,snapshot};
  }

  global.OcreEngine={version:"13.0.0",create};
})(window);
