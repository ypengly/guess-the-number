export const ACH=[
 {id:'first',name:'First Victory',desc:'Win a round',test:c=>c.win},
 {id:'perfect',name:'Perfect Guess',desc:'Win on the first attempt',test:c=>c.win&&c.attempts===1},
 {id:'sharp',name:'Sharpshooter',desc:'Win without hints',test:c=>c.win&&c.hints===0},
 {id:'speed',name:'Speed Demon',desc:'Win with 60%+ of the time left',test:c=>c.win&&c.timeTotal>0&&c.timeLeft/c.timeTotal>=.6},
 {id:'unstop',name:'Unstoppable',desc:'Win 5 rounds in a row',test:c=>c.streak>=5,prog:s=>[s.longest,5]},
 {id:'expert',name:'Expert Champion',desc:'Win on Expert',test:c=>c.win&&c.levelId==='expert'},
 {id:'persist',name:'Persistent Player',desc:'Play 25 rounds',test:c=>c.played>=25,prog:s=>[s.played,25]}];
// Unlocks new achievements (each grants +1 bonus hint) and returns their names.
export function check(d,c){const n=[];for(const a of ACH)if(!d.ach[a.id]&&a.test(c)){d.ach[a.id]=Date.now();d.bonusHints++;n.push(a.name)}return n}
