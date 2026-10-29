export function score({pts,left,timeLeft,hints,streak}){
 const base=pts*100,att=left*25,tm=Math.round(timeLeft/1000)*5,st=Math.min(streak,10)*20,pen=hints*40;
 return Math.max(0,base+att+tm+st-pen)}
