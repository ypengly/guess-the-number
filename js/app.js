import{LEVELS,MODES}from'./levels.js';import{Game}from'./game.js';import{HINTS}from'./hints.js';
import{ACH,check}from'./achievements.js';import{sfx,setMuted}from'./audio.js';import*as store from'./storage.js';import*as ui from'./ui.js';
const $=s=>document.querySelector(s),D=store.get();
let mode='classic',lvl=0,quick=false,game=null,lastS=-1;
const MSG={up:'TOO LOW! ⬆️ Try a higher number.',down:'TOO HIGH! ⬇️ Try a lower number.',ok:'CORRECT! 🎉'};

function onEvent(t,p){
 if(t==='tick'){ui.setTime(p.left,p.total);const s=Math.ceil(p.left/1000);if(p.left>0&&s<=5&&s!==lastS){lastS=s;sfx.tick()}}
 else if(t==='round'){lastS=-1;ui.render(game)}
 else if(t==='update')ui.render(game);
 else if(t==='feedback'){
  if(p.dir==='up'||p.dir==='down'){ui.say(MSG[p.dir],p.dir);sfx[p.dir==='up'?'low':'high']()}
  else if(p.dir==='ok'){ui.say(p.msg,'ok');sfx.win()}else ui.say(p.msg,'err')}
 else if(t==='error')ui.say(p.msg,'err');
 else if(t==='hint'){ui.say('💡 '+p.text,'up');sfx.click()}
 else if(t==='pause'){$('#pauseOv').hidden=!p.on;if(!p.on)$('#guess').focus()}
 else if(t==='bonus'){D.bonusHints=Math.max(0,D.bonusHints-1);store.save()}
 else if(t==='roundEnd')record(p);
 else if(t==='end'){
  const canNext=p.mode==='classic'&&p.win&&lvl+1<LEVELS.length;
  ui.result(p,canNext);ui.show('result');if(p.win){sfx.win();ui.confetti()}else sfx.lose()}}

function record(i){
 const s=D.st;s.played++;
 if(i.win){s.wins++;s.streak=i.streak;s.longest=Math.max(s.longest,s.streak);
  if(game.mode!=='attack'){const e=i.timeTotal-i.timeLeft;s.fastest=s.fastest==null?e:Math.min(s.fastest,e)}
  const idx=LEVELS.findIndex(l=>l.id===i.levelId);
  if(idx>=0){s.highLevel=Math.max(s.highLevel,idx+1);D.unlocked=Math.max(D.unlocked,Math.min(idx+2,LEVELS.length))}}
 else s.streak=0;
 s.bestScore=Math.max(s.bestScore,game.total);
 const n=check(D,{...i,played:s.played,streak:s.streak});
 if(n.length)ui.toast('🏆 Achievement: '+n.join(', ')+' (+hint)');
 store.save()}

function buildSetup(){
 lvl=Math.min(lvl,quick?LEVELS.length-1:D.unlocked-1);
 $('#modes').innerHTML=MODES.map(m=>`<button class="btn sel" data-mode="${m.id}"><b>${m.name}</b><small>${m.desc}</small></button>`).join('');
 $('#levels').innerHTML=LEVELS.map((l,i)=>{const lock=!quick&&i>=D.unlocked;
  return`<button class="btn sel" data-lvl="${i}" ${lock?'disabled':''}><b>${lock?'🔒 ':''}${l.name}</b><small>1–${l.max} · ${l.guesses} guesses · ${l.time}s</small></button>`}).join('');
 mark()}
function mark(){
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));
 document.querySelectorAll('[data-lvl]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.lvl===lvl));
 $('#levels').style.opacity=mode==='endless'?.45:1}

function renderStats(){const s=D.st,L=(a,b)=>`<li><span>${a}</span><b>${b}</b></li>`;
 $('#statList').innerHTML=L('Games played',s.played)+L('Victories',s.wins)+L('Win percentage',(s.played?Math.round(s.wins/s.played*100):0)+'%')
  +L('Current win streak',s.streak)+L('Longest win streak',s.longest)+L('Best score (one game)',s.bestScore)
  +L('Fastest successful round',s.fastest==null?'—':(s.fastest/1000).toFixed(1)+'s')+L('Highest difficulty completed',s.highLevel?LEVELS[s.highLevel-1].name:'—')
  +L('Bonus hints available',D.bonusHints)}
function renderAch(){$('#achList').innerHTML=ACH.map(a=>{const got=D.ach[a.id],[v,m]=a.prog?a.prog(D.st):[got?1:0,1];
 return`<li><span>${got?'🏆':'🔒'} <b>${a.name}</b><br><small>${a.desc}</small></span><b>${got?m:Math.min(v,m)}/${m}</b></li>`}).join('')}

function nav(id){if(game){game.destroy();game=null}
 if(id==='setup')buildSetup();if(id==='stats')renderStats();if(id==='ach')renderAch();if(id==='settings')$('#mute').checked=D.muted;ui.show(id)}
function start(){
 if(game)game.destroy();
 const base=mode==='endless'?LEVELS[0]:LEVELS[lvl];
 game=new Game(mode,base,onEvent,D.st.streak,D.bonusHints);
 ui.show('game');$('#pauseOv').hidden=true;ui.say('Make your first guess!','');
 game.newRound();$('#guess').value='';$('#guess').focus()}
function submit(){if(!game)return;const el=$('#guess');if(game.guess(el.value))el.value='';el.focus()}
async function confirmLeave(text){
 if(!game||game.phase==='over')return true;
 const was=game.phase==='playing';if(was)game.pause();
 const ok=await ui.ask(text);if(!ok&&was&&game)game.resume();return ok}

document.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;sfx.click();const d=b.dataset;
 if(d.go)nav(d.go);
 else if(d.mode){mode=d.mode;mark()}
 else if(d.lvl){lvl=+d.lvl;mark()}
 else if(d.hint&&game)game.hint(d.hint);
 else if(b.id==='start')start();
 else if(b.id==='go')submit();
 else if(b.id==='pause')game&&game.pause();
 else if(b.id==='resume')game&&game.resume();
 else if(b.id==='restart'){if(await confirmLeave('Restart? Your current round will be lost.'))start()}
 else if(b.id==='quit'){if(await confirmLeave('Abandon this round and return to the menu?'))nav('menu')}
 else if(b.id==='again')start();
 else if(b.id==='next'){lvl++;start()}
 else if(b.id==='reset'){if(await ui.ask('Delete ALL saved progress, stats and achievements? This cannot be undone.')){store.reset();quick=false;$('#quick').checked=false;lvl=0;ui.toast('Progress reset.')}}});
$('#guess').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit()}});
$('#quick').addEventListener('change',e=>{quick=e.target.checked;buildSetup()});
$('#mute').addEventListener('change',e=>{D.muted=e.target.checked;setMuted(D.muted);store.save()});

$('#hints').innerHTML=HINTS.map(h=>`<button class="btn" data-hint="${h.id}">💡 ${h.label}</button>`).join('');
setMuted(D.muted);
const today=new Date().toISOString().slice(0,10);
if(D.daily!==today){D.daily=today;D.bonusHints++;store.save();ui.toast('🎁 Daily reward: +1 bonus hint!')}
ui.show('menu');
