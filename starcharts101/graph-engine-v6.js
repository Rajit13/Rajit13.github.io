(()=>{'use strict';
async function boot(){
  try{
    const response=await fetch('graph-engine-v5.js?v=20260916e',{cache:'no-store'});
    if(!response.ok)throw new Error('Could not load base graph engine');
    let src=await response.text();
    src=src.replace("$('#paper').disabled=view!=='ioaa';", "$('#paper').disabled=false;");
    src=src.replace("$('#paper').addEventListener('change',updateView);", "$('#paper').addEventListener('change',()=>{if($('#view').value!=='ioaa')$('#view').value='ioaa';updateView()});");
    (0,eval)(src);

    let attempts=0;
    const timer=setInterval(()=>{
      attempts++;
      const paper=document.querySelector('#paper');
      const view=document.querySelector('#view');
      const method=document.querySelector('#method');
      if(paper){
        paper.disabled=false;
        paper.title='Selecting a paper automatically opens the IOAA 2025 example overlay.';
        const label=paper.closest('label');
        if(label&&!label.dataset.paperLabelFixed){
          const textNode=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
          if(textNode)textNode.nodeValue='IOAA 2025 paper ';
          label.dataset.paperLabelFixed='true';
        }
        if(!paper.dataset.selectorFixed){
          paper.addEventListener('change',()=>{
            if(view&&view.value!=='ioaa'){
              view.value='ioaa';
              view.dispatchEvent(new Event('change',{bubbles:true}));
            }
            paper.disabled=false;
          });
          paper.dataset.selectorFixed='true';
        }
      }
      if(view&&!view.dataset.paperSyncFixed){
        view.addEventListener('change',()=>{setTimeout(()=>{if(paper)paper.disabled=false},0)});
        view.dataset.paperSyncFixed='true';
      }
      if(method&&!method.querySelector('.method-credit')){
        const h2=method.querySelector('h2');
        if(h2){
          const p=document.createElement('p');
          p.className='method-credit';
          p.innerHTML='Methodological inspiration and reference: this Star Charts 101 implementation adapts the document–concept and concept-co-occurrence approach developed by <strong>Dr. Yuan-Sen Ting and collaborators</strong> in <a href="https://tingyuansen.github.io/astro-ph_knowledge_graph_dashboard/" target="_blank" rel="noopener">the Astro-ph Knowledge Graph Dashboard</a> and <a href="https://aclanthology.org/2025.wasp-main.19/" target="_blank" rel="noopener"><em>AstroMLab 5: Structured Summaries and Concept Extraction for 400,000 Astrophysics Papers</em></a> (Ting et al., 2025, Proceedings of the Third Workshop for Artificial Intelligence for Scientific Publications, pp. 170–185; DOI: <a href="https://doi.org/10.18653/v1/2025.wasp-main.19" target="_blank" rel="noopener">10.18653/v1/2025.wasp-main.19</a>). The Star Charts implementation uses its own book-specific concept vocabulary, practice-problem mapping, and optional IOAA 2025 overlay.';
          h2.insertAdjacentElement('afterend',p);
        }
      }
      if(attempts>80)clearInterval(timer);
    },125);
  }catch(error){
    console.error('Star Charts graph v6 failed:',error);
    const status=document.querySelector('#status');
    if(status)status.textContent='Graph controls could not initialize.';
  }
}
boot();
})();