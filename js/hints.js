export const HINTS=[{id:'parity',label:'Odd / Even'},{id:'half',label:'Higher / Lower Half'},{id:'range',label:'Range'},{id:'hot',label:'Hot / Cold'}];
// None of these ever returns the exact secret number.
export function getHint(id,g){const{secret:s,lo,hi,guesses:gs}=g;
 if(id==='parity')return{ok:true,text:`The secret number is ${s%2?'ODD':'EVEN'}.`};
 if(id==='half'){const mid=Math.floor((lo+hi)/2);
  return{ok:true,text:s<=mid?`It's in the lower half: ${lo}–${mid}.`:`It's in the upper half: ${mid+1}–${hi}.`}}
 if(id==='range'){const w=Math.max(2,Math.ceil((hi-lo+1)/4));let a=Math.max(lo,s-Math.floor(Math.random()*w)),b=Math.min(hi,a+w);
  if(a===b){a=Math.max(lo,a-1);b=Math.min(hi,b+1)}
  return{ok:true,text:`It's between ${a} and ${b}.`}}
 if(gs.length<2)return{ok:false,text:'Hot/Cold needs at least two guesses first (no hint used).'};
 const n=Math.abs(gs.at(-1).v-s),p=Math.abs(gs.at(-2).v-s);
 return{ok:true,text:n<p?'🔥 Warmer — your last guess is closer than the one before.':n>p?'🧊 Colder — your last guess is farther away.':'😐 Same distance as your previous guess.'}}
