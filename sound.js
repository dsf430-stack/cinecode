// Quick-mode soundtrack. All sound is generated from timed original cues.
window.renderAudio=async()=>{
 const sr=48000,ctx=new OfflineAudioContext(2,15*sr,sr);
 const output=ctx.createGain();
 output.gain.value=.75;
 output.connect(ctx.destination);
 function note(f,start,length,level,type='sine',end=f){
  const osc=ctx.createOscillator(),g=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(f,start);
  osc.frequency.exponentialRampToValueAtTime(end,start+length);
  g.gain.setValueAtTime(.00001,start);
  g.gain.exponentialRampToValueAtTime(level,start+.035);
  g.gain.exponentialRampToValueAtTime(.00001,start+length);
  osc.connect(g).connect(output);osc.start(start);osc.stop(start+length);
 }
 const noise=ctx.createBuffer(1,sr*15,sr), data=noise.getChannelData(0);
 let rng=1944;
 for(let i=0;i<data.length;i++){rng=(Math.imul(1664525,rng)+1013904223)>>>0;data[i]=rng/2147483648-1;}
 function wash(start,length,f,level){
  const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();
  src.buffer=noise;filter.type='lowpass';filter.frequency.value=f;
  g.gain.setValueAtTime(.00001,start);
  g.gain.exponentialRampToValueAtTime(level,start+Math.min(.18,length*.4));
  g.gain.exponentialRampToValueAtTime(.00001,start+length);
  src.connect(filter).connect(g).connect(output);src.start(start,start,length);
 }
 for(let t=0;t<14;t+=1.13)wash(t,Math.min(1.7,15-t),420,.056);
 [0.05,3.8,7.6,11.4].forEach((t,i)=>{
  const chord=[[73.42,110,146.83],[65.41,98,130.81],[58.27,87.31,116.54],[73.42,110,146.83]][i];
  chord.forEach((f,j)=>note(f,t+j*.09,Math.min(3.4,15-t-j*.09),.012,'triangle'));
 });
 for(let t=.5;t<14;t+=.95)note(62,t,.39,.017,'sine',35);
 note(48,.05,3.8,.022,'triangle',53);
 [4.75,4.79,4.83].forEach((t,i)=>note(180+i*130,t,.25,.037,'triangle',95+i*70));
 [5.23,5.68,6.15,6.52,7.04,8.38,8.87,9.27,9.78,10.32,11.1,12.4,13.1].forEach(t=>wash(t,.23,1700,.13));
 [8.56,10.15].forEach(t=>{note(71,t,.67,.072,'sine',31);wash(t,.62,180,.075);});
 return ctx.startRendering();
};
