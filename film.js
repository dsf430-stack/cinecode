import * as WC from './engine/index.js';
import {mulberry,ss,clamp} from '/core/lib.js';
const W=540,H=960,FPS=30;
const [mask,m]=WC.canvas(W,H),[plate,colour]=WC.canvas(W,H);
const printer=WC.makePrinter(W,H),canvas=document.querySelector('canvas'),out=canvas.getContext('2d');
const cuts=window.TIMING, seconds=cuts.frames/FPS;
const artT=160,artB=809;
const p=(g,d,ink='#000')=>{g.fillStyle=ink;g.fill(new Path2D(d));};
function stroke(g,d,w=2,ink='#fff'){
 g.strokeStyle=ink;g.lineWidth=w;g.lineJoin='round';g.lineCap='round';g.stroke(new Path2D(d));
}
function ellipse(g,x,y,rx,ry,ink='#000'){
 g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=ink;g.fill();
}
function carved(g,d,{gap=7,angle=.3,width=1.5,light=1,seed=19}={}){
 p(g,d);
 g.save();g.clip(new Path2D(d));g.translate(270,475);g.rotate(angle);g.translate(-270,-475);
 const random=mulberry(seed);
 for(let y=-250;y<1250;y+=gap){
  const x=-450+random()*8, wave=random()*14;
  stroke(g,`M${x} ${y} Q100 ${y+wave} 550 ${y-7} T1000 ${y+3}`,width*(.4+random()*.9)*light);
 }
 g.restore();
}
function move(g,x,y,s,fn){g.save();g.translate(x,y);g.scale(s,s);fn();g.restore();}
function sky(g,variant){
 const rnd=mulberry(301+variant);
 for(let j=0;j<95;j++){
  const y=168+rnd()*590,x=25+rnd()*480,l=4+rnd()*96;
  stroke(g,`M${x} ${y} q${l*.6} ${-5+rnd()*8} ${l} -3`,.4+rnd()*.9,'#bababa');
 }
}
const hills='M15 569 Q60 539 112 551 Q158 487 211 550 Q270 509 303 540 Q348 509 379 567 Q471 517 525 575 L525 818 L15 818Z';
function terrain(g){
 carved(g,hills,{gap:8,angle:-.13,width:1.8});
 for(let i=0;i<18;i++){
  const y=590+i*13;
  stroke(g,`M20 ${y} Q212 ${y-64} 520 ${y-17}`,1.7);
 }
}
function human(g,x,y,s,t,bag=false){
 move(g,x,y,s,()=>{
  const a=Math.sin(t*10)*22,b=-a;
  stroke(g,`M-8 58 Q${a-8} 77 ${a-15} 99 M9 58 Q${b+8} 79 ${b+15} 99`,12,'#000');
  stroke(g,`M${a-19} 99 h13 M${b+11} 99 h14`,6,'#000');
  carved(g,'M-15 18 Q-21 35 -17 61 Q0 68 17 61 L19 31 Q17 18 5 18Z',{gap:7,angle:-.3,width:1,seed:7});
  p(g,'M-12 3 Q-12-14 4-13 Q16-11 14 1 L20 5 L14 8 Q12 19 2 18 Q-10 16-12 3Z');
  stroke(g,'M6 1 l5 1 M7 11 l4 -1',1.1);
  p(g,'M-18-9 Q-13-22 7-18 Q17-16 20-7 L22-4 L-20-4Z');
  stroke(g,'M-13-9 Q0-13 14-9',1.2);
  stroke(g,`M-14 27 Q-24 41 ${-30+a*.4} 51 M15 26 Q28 40 ${32+b*.3} 34`,8,'#000');
  if(bag){p(g,'M-26 22 Q-41 23-39 48 L-26 54Z');stroke(g,'M-35 30 l9 -3 M-35 39 l8 -3',1);}
 });
}
function temple(g,t){
 const open=ss(t*.8),cx=271;
 terrain(g);
 carved(g,'M54 361 Q110 340 145 291 Q266 311 393 291 Q421 342 487 361 Q397 379 309 365 L217 365 Q131 379 54 361Z',{gap:5,angle:-.12,width:1.25});
 carved(g,'M96 394 Q150 377 183 345 L364 346 Q404 378 449 394 L437 407 L109 407Z',{gap:6,angle:.15,width:1.6});
 p(g,'M118 407 H425 V629 H118Z');
 p(g,'M147 424 H395 V615 H147Z','#fff');
 carved(g,'M148 428 H396 V622 H148Z',{gap:12,angle:1.52,width:1.4});
 p(g,`M${cx-open*9} 423 h${open*18} v200 h${-open*18}Z`,'#fff');
 for(let i=0;i<6;i++){
  const y=632+i*9;
  p(g,`M${108-i*7} ${y} H${435+i*8} v6 H${108-i*7}Z`,'#fff');
 }
 for(let i=0;i<8;i++){
  const z=i/7;
  human(g,264+Math.sin(i*1.2)*17+z*144-open*10,565+z*133,.45+.56*z,t+i*.4);
 }
 const line=WC.cutAlong([[77,369],[178,372],[263,362],[367,373],[470,368]],{w:3,seg:[18,35],gap:[3,8],kind:'v',reveal:{t0:0,t1:1.1,speed:550}});
 WC.drawStrokes(g,line,{t});
}
const donkeyBody='M-71-34 Q-91-47-77-66 Q-58-85-19-76 Q18-84 47-70 L67-51 Q57-19 26-14 Q-11-3-54-13Z';
function donkey(g,x,y,s,t,look){
 move(g,x,y,s,()=>{
  const a=Math.sin(t*9)*25;
  stroke(g,`M-60-33 L${-52+a*.5} 6 L${-67+a} 42 M-34-24 L${-35-a*.5} 12 L${-36-a} 42 M34-39 L${31+a*.5} 8 L${24+a} 42 M50-31 L${56-a*.5} 11 L${62-a} 42`,12,'#000');
  for(const z of [-67+a,-36-a,24+a,62-a])stroke(g,`M${z-6} 43 h13`,7,'#000');
  stroke(g,`M-74-59 Q-101-56 -112 ${-29+Math.sin(t*8)*12}`,5,'#000');
  carved(g,donkeyBody,{gap:6.8,angle:-.33,width:1.45});
  stroke(g,'M-58-59 Q-19-73 26-61 M-67-38 Q-53-21-21-23 M11-28 Q38-32 48-51',1.55);
  g.save();g.translate(53,-60);g.rotate(look*.55);
  carved(g,'M-18 22 Q-13-9 4-48 Q14-59 25-53 L34-25 Q44-21 55-12 Q67 5 52 14 Q32 18 14 5 L10 33Z',{gap:6,angle:.65,width:1.5});
  p(g,'M8-46 Q-1-74 2-88 Q11-90 20-52 M22-50 Q25-84 37-89 Q43-84 33-47Z');
  stroke(g,'M7-80 l8 28 M34-81 l-6 28',1.35);
  ellipse(g,27,-26,5.4,3.8,'#fff');ellipse(g,28,-26,2,2);
  stroke(g,'M45 4 q9 3 12-3 M50-4 l3-1',1.5);
  g.restore();
  stroke(g,'M45-63 L14-19 M47-58 L20-16',3);
  stroke(g,'M41-56 L18-23',1.15);
 });
}
function wheel(g,x,y,r,t){
 ellipse(g,x,y,r,r);ellipse(g,x,y,r-5,r-5,'#fff');
 ellipse(g,x,y,r-9,r-9);
 for(let j=0;j<9;j++){
  const a=t*3+j*Math.PI*2/9;
  stroke(g,`M${x} ${y} L${x+(r-10)*Math.cos(a)} ${y+(r-10)*Math.sin(a)}`,2.2);
 }
 ellipse(g,x,y,6,6,'#fff');ellipse(g,x,y,3,3);
}
function coins(g,c,x,y,t){
 const random=mulberry(12);
 for(let i=0;i<27;i++){
  const cx=x+random()*122,cy=y-random()*22+(Math.sin(t*8+i)*2);
  const rx=5+random()*8;
  ellipse(g,cx,cy,rx,3.4,'#fff');
  ellipse(c,cx,cy,rx-1,2.8,'#000');
  stroke(g,`M${cx-rx+3} ${cy} q4 -2 8 -1`,.9,'#777');
 }
}
function bowl(g,x,y){
 p(g,`M${x-34} ${y} Q${x-27} ${y+30} ${x} ${y+32} Q${x+28} ${y+30} ${x+34} ${y}Z`);
 ellipse(g,x,y,34,9);ellipse(g,x,y,29,6,'#fff');ellipse(g,x,y+1,23,3);
 stroke(g,`M${x-25} ${y+11} Q${x} ${y+26} ${x+25} ${y+11}`,2);
}
function cartScene(g,c,t,mode){
 const slow=ss((t-1.1)*.7),x=289+Math.sin(t*.8)*14;
 for(let i=0;i<22;i++){
  const y=574+i*10;
  stroke(g,`M25 ${y} Q230 ${y-37} 521 ${y+15}`,.7+(i%4)*.4,'#777');
 }
 const base=605+Math.sin(t*9)*2;
 carved(g,`M${x-245} ${base-84} h154 l-22 69 h-106Z`,{gap:7,angle:.08,width:2});
 stroke(g,`M${x-212} ${base-29} L${x+27} ${base-38}`,5,'#000');
 coins(g,c,x-230,base-89,t);
 wheel(g,x-191,base-9,38,t);
 wheel(g,x-119,base-8,33,t);
 donkey(g,x,base,.98,mode? t*(1-slow*.78):t,mode?slow:0);
 if(mode)bowl(g,423,655);
}
function rice(g,x,y,t,seed){
 const r=mulberry(seed),bend=Math.sin(t*2+seed)*7,h=25+r()*42;
 stroke(g,`M${x} ${y} q${bend} ${-h*.58} ${bend-12} ${-h}`,1.7,'#fff');
 for(let j=0;j<5;j++){
  const y2=y-h+j*4,x2=x+bend-12+j*2;
  stroke(g,`M${x2} ${y2} l-6 -4 m6 4 l5 -6`,1.25);
 }
}
function field(g,t,sign){
 terrain(g);
 for(let j=0;j<5;j++)for(let i=0;i<18;i++)rice(g,35+i*27+(j%2)*9,620+j*43,t,98+i*7+j*100);
 human(g,104,522,1.38,t*.75,true);
 if(sign){
  for(let i=0;i<5;i++){
   const k=ss((t-i*.28)*3),x=176+i*69,y=626+Math.sin(i*3)*54;
   if(k<=0)continue;
   move(g,x,y+(1-k)*-92,.85,()=>{
    stroke(g,'M0-35 V69',6,'#fff');stroke(g,'M0-35 V69',3,'#000');
    p(g,'M-32-38 L33-42 L35 2 L-31 5Z');
    stroke(g,'M-30-35 L30-38 L31-1 L-28 2Z',1);
    g.fillStyle='#fff';g.font='19px "Noto Serif CJK TC"';g.textAlign='center';g.fillText('已售',0,-10);
   });
  }
 }
}
function scaleScene(g,c,t){
 const a=Math.sin(t*2.8)*.16;
 carved(g,'M168 686 H370 L393 718 H147Z',{gap:6,width:1.4});
 stroke(g,'M270 354 V687',12,'#000');
 ellipse(g,270,371,13,13);
 g.save();g.translate(270,431);g.rotate(a);
 stroke(g,'M-174 0 Q0-20 174 0',6,'#000');
 for(const x of [-151,151]){
  stroke(g,`M${x} -4 l-59 132 h118 Z`,1.7,'#000');
  p(g,`M${x-63} 123 Q${x} 174 ${x+63} 123Z`);
  stroke(g,`M${x-52} 128 q52 29 104 0`,1.2);
 }
 c.save();c.translate(270,431);c.rotate(a);coins(g,c,-215,118,t);c.restore();
 for(let i=0;i<14;i++)stroke(g,`M${104+i*6} 125 l${i%5-10} -${28+i%4*7}`,1.4,'#000');
 g.restore();
}
function horseScene(g,t){
 terrain(g);
 move(g,300,580,1.48,()=>{
  carved(g,'M-85-47 Q-89-80-30-78 Q-1-69 36-76 L58-101 L77-95 L86-60 L65-32 Q30-13-20-16 Q-61-15-85-47Z',{gap:6.2,angle:-.38,width:1.4});
  p(g,'M55-88 Q63-103 82-105 L98-84 L109-69 Q112-61 100-55 L76-64 L56-43Z');
  p(g,'M66-97 L65-119 L78-107 L85-116 L90-100Z');
  stroke(g,'M63-98 Q52-82 48-61 M80-94 l7 2',1.5);
  const u=Math.sin(t*8)*24;
  stroke(g,`M-58-23 L${-52+u} 11 L${-63+u} 42 M-34-23 L${-26-u} 15 L${-39-u} 42 M36-33 L${44+u} 15 L${37+u} 40 M53-38 L${57-u} 12 L${60-u} 40`,10,'#000');
  stroke(g,'M-81-59 Q-110-37-123-17',7,'#000');
 });
 for(let i=0;i<19;i++)rice(g,25+i*26,743+(i%3)*16,t,40+i);
}
function paths(g,t){
 const u=ss(t*.5);
 carved(g,'M14 676 Q118 596 204 602 Q277 542 370 610 Q440 588 526 657 V810 H14Z',{gap:7,angle:-.15,width:2.2});
 const roads=[
  'M239 811 Q262 672 231 616 Q158 544 60 518 L42 534 Q157 572 199 635 Q209 688 172 813Z',
  'M216 811 Q258 660 273 607 Q301 543 358 485 L372 498 Q319 554 300 614 Q279 686 282 811Z',
  'M245 811 Q322 673 393 625 Q455 591 522 555 L526 574 Q466 604 418 654 Q363 708 347 814Z'
 ];
 g.save();g.beginPath();g.rect(15,819-353*u,510,354*u);g.clip();
 for(const road of roads)p(g,road,'#fff');
 g.restore();
 const wall=1-ss(t*.75);
 if(wall>.02){
  g.save();g.translate(0,92*(1-wall));
  carved(g,'M35 553 L504 521 V656 L35 685Z',{gap:10,angle:.06,width:1.6});
  for(let i=0;i<5;i++)stroke(g,`M36 ${571+i*23} L505 ${542+i*23}`,1.1);
  g.restore();
 }
 human(g,247+u*31,692-u*145,1.08-u*.37,t,true);
}
const scenes=[temple,(g,t)=>cartScene(g,colour,t,false),(g,t)=>cartScene(g,colour,t,true),
 (g,t)=>field(g,t,false),(g,t)=>field(g,t,true),(g,t)=>scaleScene(g,colour,t),horseScene,paths];
function page(frame){
 m.reset();colour.reset();out.reset();
 const time=frame/FPS;
 const cue=cuts.cues.findLast(c=>time>=c.start)??cuts.cues[0];
 const elapsed=time-cue.sceneStart;
 m.fillStyle='#fff';m.fillRect(0,0,W,H);colour.clearRect(0,0,W,H);
 m.save();
 m.beginPath();m.moveTo(17,artT);
 for(let x=20;x<=524;x+=7)m.lineTo(x,artT+Math.sin(x*3.8)*2.4);
 m.lineTo(523,artB-5);m.lineTo(16,artB);m.closePath();m.clip();
 sky(m,cue.scene);
 const timed=Math.floor(elapsed*15)/15;
 scenes[cue.scene](m,Math.max(0,timed));
 m.restore();
 const sheet=printer.render(mask,plate,{mode:'print',seed:63,inkSeed:12,plate:'#af782c',ink:'#211d18',paper:'#f2e8d5',edge:.9,reg:[1.3,-.5]});
 out.save();out.scale(2,2);out.drawImage(sheet,0,0);
 out.textAlign='left';out.fillStyle='#241f18';out.font='14px "Noto Serif CJK TC"';out.fillText('木刻寓言',31,47);
 out.font='39px "Noto Serif CJK TC"';out.fillText('驢拉金車',29,112);
 stroke(out,'M29 129 H511',1,'#51483b');
 out.font='22px "Noto Serif CJK TC"';out.textAlign='center';
 if(time>=cue.start&&time<cue.end+.12)out.fillText(cue.text,270,872,478);
 out.font='12px "Noto Serif CJK TC"';out.fillText(`第 ${String(cue.scene+1).padStart(2,'0')} 幕`,270,928);
 out.restore();
}
window.READY=document.fonts.load('24px "Noto Serif CJK TC"','驢拉金車').then(()=>({
 width:1080,height:1920,fps:FPS,frames:cuts.frames,bounds:cuts.cues.filter((c,i,a)=>i===0||c.scene!==a[i-1].scene).map(c=>c.start).concat(seconds),
 renderer:'LemoLab woodcut mask and WebGL2 print compositor',title:'驢拉金車'
}));
window.captureFrame=(i,mime='image/jpeg',quality=.93)=>{page(i);return canvas.toDataURL(mime,quality);};
window.renderAudio=async()=>{
 const sampleRate=48000;
 const ctx=new OfflineAudioContext(2,Math.round(seconds*sampleRate),sampleRate);
 function tone(f,t,d,g,type='sine'){
  if(t+d>seconds)return;
  const o=ctx.createOscillator(),v=ctx.createGain();o.type=type;o.frequency.value=f;
  v.gain.setValueAtTime(.00001,t);v.gain.exponentialRampToValueAtTime(g,t+.055);
  v.gain.exponentialRampToValueAtTime(.00001,t+d);o.connect(v).connect(ctx.destination);o.start(t);o.stop(t+d);
 }
 const notes=[55,65.406,49,58.27];
 for(let t=.04,j=0;t<seconds-.5;t+=1.42,j++){
  const f=notes[j%notes.length];tone(f,t,1.3,.038,'triangle');tone(f*1.5,t+.13,1.19,.023);
  tone(92,t+.03,.28,.039);
 }
 for(const c of cuts.cues.filter((c,i,a)=>i===0||c.scene!==a[i-1].scene)){
  tone(155,c.start,.22,.075,'triangle');
  if(c.scene===1||c.scene===2)for(let i=0;i<3;i++)tone(720+i*160,c.start+.29+i*.13,.22,.025);
 }
 return ctx.startRendering();
};
