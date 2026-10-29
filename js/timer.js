// Deadline-based timer: remaining time is computed from performance.now(), never from tick counts.
export class Timer{
 constructor(tick,end){this.tick=tick;this.end=end;this.total=0;this.left=0;this.id=null;this.dl=0}
 set(ms){this.stop();this.total=this.left=ms;this.tick(ms)}
 start(){if(this.id||this.left<=0)return;this.dl=performance.now()+this.left;
  this.id=setInterval(()=>{this.left=Math.max(0,this.dl-performance.now());this.tick(this.left);
   if(this.left<=0){this.stop();this.end()}},100)}
 pause(){if(!this.id)return;this.left=Math.max(0,this.dl-performance.now());this.stop()}
 stop(){clearInterval(this.id);this.id=null}
 add(ms){this.left+=ms;this.total+=ms;if(this.id)this.dl+=ms;this.tick(this.left)}
 get running(){return this.id!==null}}
