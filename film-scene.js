// Authored Normandy scenes. All visible objects use the unmodified LemoLab
// watercolor mk/drawS brush engine cited by Cinecode styles/watercolor.md.
const canvas=document.getElementById('art'),ctx=canvas.getContext('2d');
const CW=540,CH=960,navy='#334e61',sea='#668f9e',sand='#b89a64',olive='#737b59';
const FPS=30, DURATION=15;
const bounds=[0,4,8,12,15];
function brush(c,x,y,X,Y,w,col,a=.7,bend=0){drawS(c,mk(qcurve(x,y,X,Y,bend,16),w,col,{a,nb:w>4?7:0,prof:'even',rough:.22}));}
function wash(c,pts,col,a=.3){
  // Official recipe: three translucent, jittered passes create pooled edges.
  for(let k=0;k<3;k++){c.beginPath();pts.forEach(([x,y],i)=>{x+=rnd(-2.5,2.5);y+=rnd(-2.5,2.5);i?c.lineTo(x,y):c.moveTo(x,y)});c.closePath();c.fillStyle=rgba(col,a/3*1.6);c.fill();}
}
const paper=document.createElement('canvas');paper.width=CW;paper.height=CH;
withSeed(66944,()=>{const p=paper.getContext('2d'),im=p.createImageData(CW,CH);
 for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const i=(y*CW+x)*4,n=(rnd()-.5)*12+(vnoise(x*.03+y*.012)-.5)*8+(vnoise(x*.08)-.5)*3;im.data[i]=244+n;im.data[i+1]=237+n;im.data[i+2]=221+n;im.data[i+3]=255;}p.putImageData(im,0,0);
 for(let i=0;i<6500;i++){const x=rnd(0,CW),y=rnd(0,CH);p.strokeStyle=rgba('#968975',rnd(.025,.07));p.lineWidth=.4;p.beginPath();p.moveTo(x,y);p.quadraticCurveTo(x+2,y-1,x+rnd(1,6),y+rnd(-1,1));p.stroke();}
});
function man(c,x,y,s,t=0){c.save();c.translate(x,y);c.scale(s,s);
 const stride=Math.sin(t*10)*12;
 // Human proportions: helmet/head ~15 px, standing height ~102 px.
 brush(c,-5,28,-11-stride,57,10,olive,.85,-2);brush(c,-11-stride,57,-19-stride,80,8,navy,.8,1);
 brush(c,5,28,14+stride,53,10,olive,.8,2);brush(c,14+stride,53,13+stride,80,8,navy,.8,-2);
 brush(c,-20-stride,81,-9-stride,82,6,'#555244',.85);brush(c,11+stride,81,24+stride,80,6,'#555244',.85);
 brush(c,1,-15,1,1,7,'#bca27d',.85);brush(c,0,-5,0,34,28,olive,.7,-1);brush(c,7,-2,7,32,10,navy,.4);
 brush(c,-14,-2,-15,26,14,'#656c50',.8,-3);brush(c,-20,-1,-21,26,9,'#8c8d69',.9);
 brush(c,-7,-4,-6,27,2.8,'#d2c098',.9);brush(c,6,-4,4,28,2.4,'#c5b78c',.9);
 brush(c,-12,26,11,27,4,'#a69269',.9);brush(c,-10,25,-9,33,5,'#b5a078',.8);
 brush(c,-11,-3,-17,16,9,olive,.9,2);brush(c,-17,16,-3,26,7,olive,.9);
 brush(c,11,-2,22,11,9,olive,.9);brush(c,22,11,10,24,7,olive,.9);
 brush(c,-5,26,26,-12,3.3,'#424840',.92);brush(c,-4,25,8,11,4.2,'#92734f',.9);
 brush(c,1,-20,3,-9,12,'#c3a783',.6);brush(c,7,-16,10,-13,3,'#b0926e',.9);
 brush(c,-9,-23,12,-23,15,'#64755b',.9,-8);brush(c,-13,-19,16,-19,3,olive,.95,1);
 brush(c,-6,-28,7,-29,2,'#b1b394',.65,-3);c.restore();}
function craft(c,x,y,s,t,ramp=0){c.save();c.translate(x,y+Math.sin(t*1.8+x)*3);c.scale(s,s);
 wash(c,[[-84,0],[-46,-91],[42,-91],[88,0],[67,68],[-65,68]],'#576d73',.8);
 wash(c,[[-62,-10],[-34,-70],[32,-70],[64,-10],[47,36],[-43,36]],'#293e4b',.8);
 for(const [xx,yy,sc] of [[-17,-40,.31],[12,-39,.32],[-27,-20,.35],[0,-15,.37],[27,-16,.35]])man(c,xx,yy,sc,0);
 wash(c,[[-84,0],[-62,-10],[-43,36],[-65,68]],'#8f9d91',.8);
 wash(c,[[64,-10],[88,0],[67,68],[47,36]],'#8d9a90',.7);
 const gateTop=23+44*ramp, gateBottom=68+36*ramp;
 wash(c,[[-70,gateTop],[73,gateTop],[67,gateBottom],[0,gateBottom+17*(1-ramp)],[-65,gateBottom]],'#6f8585',.9);
 for(let i=0;i<9;i++)brush(c,-56+i*14,gateTop+8,-54+i*13,gateBottom-3,1.2,'#b3baa3',.6);
 brush(c,-69,gateTop,73,gateTop,2.5,'#b8bfae',.8);brush(c,-66,69,0,84,2.5,navy,.6,4);brush(c,0,84,68,67,2,navy,.6,2);
 for(let i=0;i<7;i++){brush(c,-70-i*4,67+i*3,-101-i*6,81+i*4,2,'#d9dece',.65,5);brush(c,69+i*3,67+i*3,102+i*6,82+i*4,2,'#d9dece',.65,-5);}
 c.restore();}
function sky(c){
 for(let i=0;i<25;i++){const y=150+i*7;brush(c,35+rnd(-5,5),y,507+rnd(-7,7),y-25,18,'#b9c7c5',.07,8);}
 brush(c,44,337,502,316,32,'#bdc4b7',.25,-9);
 for(let i=0;i<12;i++)brush(c,38+i*43,351+rnd(-6,6),93+i*41,345+rnd(-5,5),11,'#87958b',.25,-4);
 for(const x of [133,359,435]){
  for(let j=0;j<6;j++)brush(c,x+j*2,352-j*8,x+9+j*2,329-j*10,15-j,'#596c6e',.08,-8);
 }
}
function water(c,t){
 for(let i=0;i<69;i++){const y=354+i*6.6;brush(c,24+rnd(-14,8),y,521+rnd(-8,8),y+rnd(-6,3),12,sea,.14,5);}
 for(let i=0;i<180;i++){const x=rnd(25,520),y=rnd(367,812),l=rnd(5,45)*(y/700);brush(c,x+Math.sin(t+i)*2,y,x+l,y-2,1.2,navy,.22,-2);}
 for(let i=0;i<26;i++){const x=rnd(40,450),y=rnd(430,800);brush(c,x,y,x+rnd(20,60),y-5,2,'#e9e5d5',.7,-3);}
}

function lettering(c,n,t){
 c.fillStyle=navy;
 c.textAlign='left';
 c.font='13px "Noto Serif CJK TC",serif';
 c.fillText('NORMANDY  ·  06 / 06 / 1944',34,52);
 c.font='31px "Noto Serif CJK TC",serif';
 c.fillText('諾曼第登陸',32,99);
 c.font='15px "Noto Serif CJK TC",serif';
 c.fillStyle='#6a6657';
 c.fillText(['海上接近','艙門落下','涉水搶灘','後續部隊登岸'][n],35,129);
 const cue=window.CUES.find(line=>line.start<=t && t<line.end);
 if(cue){
  c.textAlign='center';
  c.font='25px "Noto Serif CJK TC",serif';
  c.fillStyle=navy;
  c.fillText(cue.text,270,875);
 }
}
function shore(c){
 wash(c,[[24,469],[89,471],[176,518],[302,628],[520,704],[520,815],[24,815]],sand,.45);
 for(let i=0;i<35;i++){
  const y=520+i*8;
  brush(c,27,y,Math.min(520,105+(y-520)*2.2),y-3,15,sand,.12,8);
 }
 for(let i=0;i<3;i++)brush(c,30,478+i*8,503,714+i*8,8,'#e9e6d4',.6,-58);
}
function obstacle(c,x,y,s){
 brush(c,x-19*s,y-23*s,x+23*s,y+24*s,6*s,navy,.8);
 brush(c,x+20*s,y-22*s,x-22*s,y+22*s,6*s,navy,.8);
 brush(c,x-29*s,y,x+30*s,y-3*s,5*s,navy,.8);
}
function splash(c,x,y,t){
 for(let i=0;i<5;i++){
  const a=(t*2+i/5)%1;
  brush(c,x-5-21*a,y+a*6,x+6+23*a,y-3+a*6,2,'#f1e9da',.85*(1-a),-5);
 }
}
function scene(c,n,t){
 c.drawImage(paper,0,0);
 c.save();
 c.beginPath();c.rect(15,151,510,674);c.clip();
 if(n===3){
  c.save();c.translate(0,-280);c.scale(1,1.27);water(c,t);c.restore();
 }else if(n===2){
  wash(c,[[15,385],[138,363],[264,420],[525,401],[525,825],[15,825]],sand,.41);
  for(let i=0;i<57;i++){
   const y=398+i*7.9;
   brush(c,15+rnd(0,13),y,510+rnd(0,15),y-24,12,sand,.14,-9);
  }
  for(let i=0;i<9;i++)brush(c,20+i*53,407,73+i*54,387,24,olive,.22,-12);
 }else{
  sky(c);
  water(c,t);
 }
 const progress=(t-bounds[n])/(bounds[n+1]-bounds[n]);
 if(n===0){
  craft(c,93-progress*11,432+progress*25,.26,t);
  craft(c,394+progress*13,399+progress*18,.2,t);
  craft(c,320+progress*12,487+progress*47,.4,t);
  craft(c,134-progress*25,560+progress*43,.53,t);
  const close=1-Math.exp(-t*.65);
  craft(c,281+Math.sin(t*2.2)*22,530+close*238,1.03+close*.55,t);
  for(let j=0;j<16;j++){
   const x=24+j*31, y=771+Math.sin(t*4+j*.4)*32;
   brush(c,x,y,x+38,y-14,8,'#e9e5d5',.72,Math.sin(t*4+j)*8);
  }
  for(let i=0;i<9;i++){
   const phase=(t*1.2+i*.18)%1;
   brush(c,37+i*50-phase*14,785+phase*38,69+i*50,779+phase*38,3,'#e4ddc9',.56,-4);
  }
 }else if(n===1){
  shore(c);
  obstacle(c,429,648,.98);
  c.save();c.translate(27,447);c.rotate(-.20);
  craft(c,84,46,1.38,t,ss(progress*3));
  c.restore();
  for(let i=0;i<3;i++){
   const p=clamp(progress*1.32-i*.15);
   if(p<=0)continue;
   const x=146+260*p,y=548+149*p+Math.sin(t*10+i)*5;
   man(c,x,y,1.12+i*.12,t+i*.6);
   splash(c,x,y+82*(1.12+i*.12),t+i*.2);
  }
 }else if(n===2){
  for(let i=0;i<3;i++){
   const p=clamp(progress*1.14-i*.09);
   const x=-45+i*96+274*p,y=578+i*60+Math.sin(t*10+i)*8;
   c.save();c.translate(x,y);c.rotate(-.13);
   man(c,0,0,1.33+i*.2,t+i*.7);c.restore();
   splash(c,x,y+105+i*14,t+i*.3);
  }
  obstacle(c,430,608,1.7);
  const burst=clamp((progress-.16)*1.7);
  for(let j=0;j<16;j++){
   brush(c,388+j*3,577,371+j*6,577-burst*(43+j*5),19,'#7e8780',.13*(1-burst),-13);
  }
 }else{
  c.save();c.translate(0,142);c.scale(1,.74);shore(c);c.restore();
  for(let i=0;i<5;i++){
   const x=45+i*108+progress*19,y=298+i*42+progress*110;
   craft(c,x,y,.46,t,1);
   splash(c,x,y+42,t+i*.17);
  }
  for(let i=0;i<12;i++){
   const x=15+i*44+progress*41,y=504+i*16+progress*118+Math.sin(t*10+i)*4;
   man(c,x,y,.55,t+i*.52);
   splash(c,x,y+46,t+i*.17);
  }
 }
 c.restore();
 for(let i=0;i<20;i++)brush(c,10,825+i*1.4,530,825+i*1.4,7,PAPER,.3,Math.sin(i)*5);
 lettering(c,n,t);
}
const w=Number(new URLSearchParams(location.search).get('w'))||1080;
const h=Number(new URLSearchParams(location.search).get('h'))||1920;
canvas.width=w;canvas.height=h;
ctx.scale(w/CW,h/CH);
window.READY=document.fonts.load('25px "Noto Serif CJK TC"','諾曼第登陸').then(
 ()=>({width:w,height:h,frames:DURATION*FPS,fps:FPS,bounds,renderer:'canvas2d watercolor mk/drawS',title:'諾曼第登陸'}));
window.captureFrame=(i,mime="image/png",quality=.95)=>{
 const t=i/FPS;
 const shot=Math.min(3,Math.max(0,bounds.findIndex(end=>t<end)-1));
 withSeed(19440606,()=>scene(ctx,shot,t));
 return canvas.toDataURL(mime,quality);
};
window.READY.then(()=>window.captureFrame(0));
