export const LEVELS=[
 {id:'beginner',name:'Beginner',max:20,guesses:10,time:60,pts:1},
 {id:'easy',name:'Easy',max:50,guesses:8,time:50,pts:2},
 {id:'normal',name:'Normal',max:100,guesses:7,time:40,pts:3},
 {id:'hard',name:'Hard',max:500,guesses:6,time:35,pts:4},
 {id:'expert',name:'Expert',max:1000,guesses:4,time:25,pts:5}];
export const MODES=[
 {id:'classic',name:'Classic',desc:'One round, limited guesses & timer'},
 {id:'attack',name:'Time Attack',desc:'Shared clock, bonus time per win'},
 {id:'endless',name:'Endless',desc:'Rounds get harder until you fail'}];
export const ATTACK={start:60,bonus:10};
export function endlessLevel(n){const max=Math.round(20*1.7**n);
 return{id:'endless',name:`Round ${n+1}`,max,guesses:Math.ceil(Math.log2(max))+2,time:Math.min(60,30+n*3),pts:1+n}}
