import{Timer}from'./timer.js';import{score}from'./scoring.js';import{getHint}from'./hints.js';import{endlessLevel,ATTACK}from'./levels.js';
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
// Single source of truth for one play session. UI only reacts to emitted events.
export class Game{
 constructor(mode,base,emit,streak=0,extra=0){
  Object.assign(this,{mode,base,emit,streak,extra,total:0,wins:0,round:0,phase:'idle',freeLeft:1,used:new Set(),guesses:[],hintCount:0,lo:1,hi:1});
  this.timer=new Timer(left=>this.emit('tick',{left,total:this.timer.total}),()=>this.timeout())}
 newRound(){
  this.lvl=this.mode==='endless'?endlessLevel(this.round):this.base;
  Object.assign(this,{secret:rnd(1,this.lvl.max),lo:1,hi:this.lvl.max,guesses:[],left:this.lvl.guesses,freeLeft:1,used:new Set(),hintCount:0,phase:'playing'});
  if(this.mode!=='attack')this.timer.set(this.lvl.time*1000);else if(!this.timer.total)this.timer.set(ATTACK.start*1000);
  this.emit('round');this.emit('update')}
 err(msg){this.emit('error',{msg});return false}
 guess(raw){
  if(this.phase!=='playing')return false;
  const s=String(raw).trim();
  if(!/^-?\d+$/.test(s))return this.err('Enter a whole number.');
  const v=Number(s);
  if(v<1||v>this.lvl.max)return this.err(`Pick a number from 1 to ${this.lvl.max}.`);
  if(this.guesses.some(g=>g.v===v))return this.err(`You already tried ${v}.`);
  this.timer.start();this.left--;
  if(v===this.secret){this.guesses.push({v,dir:'ok'});this.win();return true}
  const dir=v<this.secret?'up':'down';this.guesses.push({v,dir});
  if(dir==='up')this.lo=Math.max(this.lo,v+1);else this.hi=Math.min(this.hi,v-1);
  this.emit('feedback',{dir,v});
  if(this.left===0)this.lose('attempts');else this.emit('update');
  return true}
 info(win,extra){return{win,secret:this.secret,guesses:this.guesses,attempts:this.guesses.length,timeLeft:this.timer.left,timeTotal:this.timer.total,hints:this.hintCount,levelId:this.lvl.id,...extra}}
 win(){
  const pts=score({pts:this.lvl.pts,left:this.left,timeLeft:this.timer.left,hints:this.hintCount,streak:this.streak});
  const i=this.info(true,{pts});this.streak++;this.wins++;this.total+=pts;i.streak=this.streak;
  this.emit('roundEnd',i);
  if(this.mode==='classic')return this.finish(i);
  this.emit('feedback',{dir:'ok',msg:`CORRECT! 🎉 It was ${this.secret}. +${pts} points`});
  if(this.mode==='attack')this.timer.add(ATTACK.bonus*1000);
  this.round++;this.newRound()}
 lose(reason){
  this.streak=0;const i=this.info(false,{reason});this.emit('roundEnd',i);
  if(this.mode==='attack'&&reason==='attempts'){
   this.emit('feedback',{dir:'miss',msg:`Out of guesses! It was ${this.secret}. New number…`});this.round++;return this.newRound()}
  this.finish(i)}
 finish(i){this.phase='over';this.timer.stop();this.emit('update');this.emit('end',{...i,mode:this.mode,total:this.total,wins:this.wins})}
 timeout(){if(this.phase==='playing')this.lose('time')}
 hint(type){
  if(this.phase!=='playing')return;
  if(this.freeLeft+this.extra<=0)return this.err('No hints left. Earn more via daily rewards and achievements!');
  const h=getHint(type,this);if(!h.ok)return this.err(h.text);
  if(this.freeLeft>0)this.freeLeft--;else{this.extra--;this.emit('bonus')}
  this.hintCount++;this.used.add(type);this.emit('hint',{text:h.text});this.emit('update')}
 pause(){if(this.phase!=='playing')return;this.wasRunning=this.timer.running;this.timer.pause();this.phase='paused';this.emit('pause',{on:true});this.emit('update')}
 resume(){if(this.phase!=='paused')return;this.phase='playing';if(this.wasRunning)this.timer.start();this.emit('pause',{on:false});this.emit('update')}
 destroy(){this.timer.stop();this.phase='over'}}
