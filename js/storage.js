const KEY='guess-the-number-v1';
const fresh=()=>({unlocked:1,bonusHints:0,daily:'',muted:false,ach:{},
 st:{played:0,wins:0,streak:0,longest:0,bestScore:0,fastest:null,highLevel:0}});
function load(){try{const r=JSON.parse(localStorage.getItem(KEY));if(r&&typeof r==='object'){const f=fresh();return{...f,...r,st:{...f.st,...r.st},ach:{...r.ach}}}}catch(e){}return fresh()}
const data=load();
export const get=()=>data;
export function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}}
export function reset(){Object.assign(data,fresh());save()}
