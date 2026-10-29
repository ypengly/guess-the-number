import{MODES}from'./levels.js';
const $=s=>document.querySelector(s),CIRC=282.7,ICON={up:'⬆️ low',down:'⬇️ high',ok:'✅'};
export function show(id){document.querySelectorAll('.screen').forEach(s=>s.hidden=s.id!==id);window.scrollTo(0,0)}
export function ask(text){return new Promise(r=>{$('#mText').textContent=text;const m=$('#modal');m.hidden=false;$('#mYes').focus();
 const done=v=>{m.hidden=true;r(v)};$('#mYes').onclick=()=>done(true);$('#mNo').onclick=()=>done(false)})}
export function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2800)}
export function confetti(){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 for(let i=0;i<70;i++){const p=document.createElement('i');
  p.style.cssText=`left:${Math.random()*100}%;background:hsl(${Math.random()*360} 90% 60%);animation-delay:${Math.random()*.6}s;animation-duration:${1.8+Math.random()*1.6}s`;
  $('#confetti').append(p);setTimeout(()=>p.remove(),4500)}}
export function setTime(left,total){$('#time').textContent=Math.ceil(left/1000);
 $('#arc').style.strokeDashoffset=CIRC*(1-(total?left/total:0));$('.ring').classList.toggle('low',left>0&&left<=5000)}
export function say(msg,cls){const f=$('#fb');f.className='fb '+cls;f.textContent=msg;void f.offsetWidth;f.classList.add('anim')}
export function render(g){
 $('#gMode').textContent=MODES.find(m=>m.id===g.mode).name;
 $('#gLevel').textContent=g.mode==='classic'?g.lvl.name:`${g.lvl.name}${g.mode==='attack'?' · Round '+(g.round+1):''}`;
 $('#gRange').textContent=`Secret number: 1 – ${g.lvl.max}`;
 $('#gScore').textContent=g.total;$('#gStreak').textContent=g.streak;
 $('#pips').innerHTML=Array.from({length:g.lvl.guesses},(_,i)=>`<i class="${i<g.left?'on':''}"></i>`).join('');
 $('#pips').setAttribute('aria-label',`${g.left} of ${g.lvl.guesses} attempts remaining`);
 $('#hist').innerHTML=g.guesses.map(x=>`<li><b>${x.v}</b><span>${ICON[x.dir]}</span></li>`).join('');
 const n=g.freeLeft+g.extra;$('#hcount').textContent=`Hints left: ${n}`;
 document.querySelectorAll('[data-hint]').forEach(b=>b.disabled=g.phase!=='playing'||n<=0||(g.used.has(b.dataset.hint)&&b.dataset.hint!=='hot'));
 $('#guess').disabled=$('#go').disabled=g.phase!=='playing';$('#pause').disabled=g.phase==='over'}
export function result(p,canNext){
 const L=(a,b)=>`<li><span>${a}</span><b>${b}</b></li>`;let t,rows;
 if(p.mode==='classic'){
  t=p.win?'🎉 VICTORY!':p.reason==='time'?"⏰ TIME'S UP":'💥 OUT OF GUESSES';
  rows=L('Secret number',p.secret)+(p.win?L('Attempts used',p.attempts)+L('Time remaining',(p.timeLeft/1000).toFixed(1)+'s')+L('Points earned','+'+p.pts)+L('Win streak',p.streak)
   :L('You ran out of',p.reason==='time'?'time':'guesses')+L('Your guesses',p.guesses.map(g=>g.v+({up:'⬆️',down:'⬇️',ok:'✅'}[g.dir])).join(' ')||'none'))}
 else{t='GAME OVER';rows=L('Ended because',p.reason==='time'?'Time ran out':'Out of guesses')+L('Last secret number',p.secret)+L('Rounds won',p.wins)+L('Total score',p.total)}
 $('#rTitle').textContent=t;$('#rList').innerHTML=rows;$('#next').hidden=!canNext}
