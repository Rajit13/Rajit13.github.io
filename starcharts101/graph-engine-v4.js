(()=>{'use strict';
const BASE='graph-engine-v3.js?v=20260916c';
async function boot(){
  try{
    let src=await (await fetch(BASE,{cache:'no-store'})).text();
    const oldTail="t*=.986}return p}\nfunction over()";
    const newTail="t*=.986}const vals=[...p.values()].filter(q=>Number.isFinite(q.x)&&Number.isFinite(q.y));if(vals.length){const xs=vals.map(q=>q.x),ys=vals.map(q=>q.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),padX=80,padY=65,spanX=Math.max(1,maxX-minX),spanY=Math.max(1,maxY-minY);for(const q of vals){q.x=padX+(q.x-minX)/spanX*(1000-2*padX);q.y=padY+(q.y-minY)/spanY*(720-2*padY)}}return p}\nfunction over()";
    if(!src.includes(oldTail))throw new Error('layout patch target not found');
    src=src.replace(oldTail,newTail);
    src=src.replace("for(const e of E){let a=p.get(e.source),b=p.get(e.target),dx=", "for(const e of E){let a=p.get(e.source),b=p.get(e.target);if(!a||!b)continue;let dx=");
    src=src.replace("for(const e of edges){let a=L.get(e.source),b=L.get(e.target),kh=", "for(const e of edges){let a=L.get(e.source),b=L.get(e.target);if(!a||!b)continue;let kh=");
    (0,eval)(src);
    let checks=0;
    const timer=setInterval(()=>{
      checks++;
      const c=document.getElementById('net');
      if(!c||!c.width||!c.height){if(checks>20)clearInterval(timer);return}
      try{
        const g=c.getContext('2d'),w=c.width,h=c.height,step=Math.max(4,Math.floor(Math.min(w,h)/90));
        const data=g.getImageData(0,0,w,h).data;let visible=false;
        for(let y=0;y<h&&!visible;y+=step)for(let x=0;x<w;x+=step){if(data[(y*w+x)*4+3]>0){visible=true;break}}
        if(visible){clearInterval(timer);return}
        if(checks===10){document.getElementById('reset')?.click()}
        if(checks>20){const s=document.getElementById('status');if(s)s.textContent='Graph data loaded, but the canvas renderer produced no visible pixels. Reload this page.';clearInterval(timer)}
      }catch(_){clearInterval(timer)}
    },500);
  }catch(error){
    console.error('Star Charts graph engine failed:',error);
    const s=document.getElementById('status');if(s)s.textContent='Graph renderer failed to initialize.';
  }
}
boot();
})();