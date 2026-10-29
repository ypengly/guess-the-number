let ctx=null,muted=false;
export const setMuted=m=>{muted=m};
function tone(f,d=.12,type='sine',t0=0,v=.12){if(muted)return;
 try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();
  const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+t0;o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+d)}catch(e){}}
export const sfx={
 click:()=>tone(520,.06,'square',0,.05),low:()=>tone(300,.2,'triangle'),high:()=>tone(720,.2,'triangle'),
 tick:()=>tone(900,.07,'square',0,.07),
 win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.25,'sine',i*.12)),
 lose:()=>[400,330,260,200].forEach((f,i)=>tone(f,.28,'sawtooth',i*.15,.08))};
