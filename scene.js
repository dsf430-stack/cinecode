// Authored Normandy scenes. All visible objects use the unmodified LemoLab
// watercolor mk/drawS brush engine cited by Cinecode styles/watercolor.md.
const canvas=document.getElementById('art'),ctx=canvas.getContext('2d');
const CW=540,CH=960,navy='#334e61',sea='#668f9e',sand='#b89a64',olive='#737b59';
const strokes=[];
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
 const stride=Math.sin(t*5)*7;
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
function craft(c,x,y,s,t){c.save();c.translate(x,y+Math.sin(t*1.8+x)*3);c.scale(s,s);
 wash(c,[[-84,0],[-46,-91],[42,-91],[88,0],[67,68],[-65,68]],'#576d73',.8);
 wash(c,[[-62,-10],[-34,-70],[32,-70],[64,-10],[47,36],[-43,36]],'#293e4b',.8);
 for(const [xx,yy,sc] of [[-17,-40,.31],[12,-39,.32],[-27,-20,.35],[0,-15,.37],[27,-16,.35]])man(c,xx,yy,sc,t);
 wash(c,[[-84,0],[-62,-10],[-43,36],[-65,68]],'#8f9d91',.8);
 wash(c,[[64,-10],[88,0],[67,68],[47,36]],'#8d9a90',.7);
 wash(c,[[-70,23],[73,23],[67,68],[0,85],[-65,68]],'#6f8585',.9);
 for(let i=0;i<9;i++)brush(c,-56+i*14,31,-54+i*13,65,1.2,'#b3baa3',.6);
 brush(c,-69,24,73,24,2.5,'#b8bfae',.8);brush(c,-66,69,0,84,2.5,navy,.6,4);brush(c,0,84,68,67,2,navy,.6,2);
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
function lettering(c,scene){
 c.fillStyle=navy;c.textAlign='left';c.font='13px "Noto Serif CJK TC",serif';c.fillText('NORMANDY  ·  06 / 06 / 1944',34,52);
 c.font='31px "Noto Serif CJK TC",serif';c.fillText('諾曼第登陸',32,99);
 c.font='13px "Noto Serif CJK TC",serif';c.fillStyle='#7a7664';c.fillText('海上接近' ,36,127);
 if(scene===2){c.fillStyle=PAPER;c.fillRect(30,110,150,23);c.fillStyle='#7a7664';c.fillText('涉水搶灘',36,127);}
 c.textAlign='center';c.font='23px "Noto Serif CJK TC",serif';c.fillStyle=navy;
 c.fillText(scene===1?'一九四四年六月六日':'士兵冒著炮火搶灘',270,884);
 c.font='12px "Noto Serif CJK TC",serif';c.fillStyle='#8b846f';c.fillText('WATERCOLOR BRUSH  ·  CINECODE',270,923);
}
function scene(c,n,t){
 c.drawImage(paper,0,0);sky(c);water(c,t);
 if(n===1){
  craft(c,93,432,.26,t);craft(c,394,399,.2,t);craft(c,320,487,.4,t);craft(c,134,570,.53,t);
  craft(c,301,701,1.5,t);
  // Negative paper remains visible inside translucent wave bands.
  for(let i=0;i<14;i++)brush(c,40+i*26,807+Math.sin(i)*9,65+i*28,800+Math.sin(i)*8,3,'#e4ddc9',.65,-3);
 }else{
  wash(c,[[24,469],[89,471],[176,518],[302,628],[520,704],[520,825],[24,825]],sand,.45);
  for(let i=0;i<36;i++){const y=520+i*8;brush(c,27,y,Math.min(520,105+(y-520)*2.2),y-3,15,sand,.12,8);}
  for(let i=0;i<3;i++)brush(c,30,478+i*8,503,714+i*8,8,'#e9e6d4',.6,-58);
  craft(c,49,500,.7,t);
  // Open ramp occupies its own local geometry, no substitute vector outlines.
  wash(c,[[55,537],[99,525],[137,585],[89,608]],'#81938d',.8);
  for(let i=0;i<6;i++)brush(c,65+i*5,543+i*10,103+i*5,535+i*9,2,'#d0cfb4',.7);
  for(const [x,y,s] of [[321,557,.7],[460,711,.9],[109,700,.55]]){
   brush(c,x-19*s,y-23*s,x+23*s,y+24*s,6*s,navy,.8);brush(c,x+20*s,y-22*s,x-22*s,y+22*s,6*s,navy,.8);brush(c,x-29*s,y,x+30*s,y-3*s,5*s,navy,.8);
  }
  man(c,142,586,.62,t);man(c,235,653,.9,t+.8);man(c,349,740,1.17,t+1.5);
  for(const [x,y,s] of [[143,638,.6],[235,727,.9]])for(let i=0;i<4;i++)brush(c,x-18*s-i*3,y+i*3,x+23*s+i*3,y-3+i*3,1.5,'#eee7d4',.7,-4);
 }
 // Paper wash softly erases the lower picture into the caption margin.
 for(let i=0;i<20;i++)brush(c,10,826+i*1.4,530,826+i*1.4,7,PAPER,.3,Math.sin(i)*5);
 lettering(c,n);
}
window.READY=document.fonts.ready.then(()=>({width:CW,height:CH,frames:450,fps:30,renderer:'canvas2d / official watercolor mk + drawS',title:'諾曼第登陸・水彩筆觸'}));
window.captureFrame=i=>{withSeed(19440606,()=>scene(ctx,i<150?1:2,i/30));return canvas.toDataURL('image/png')};
window.READY.then(()=>window.captureFrame(75));
