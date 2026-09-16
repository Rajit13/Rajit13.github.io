// Pure book calculation: exam mappings are deliberately not accepted as input.
export function relationEvidence(documents,from,to){
 const map=new Map(documents.map(d=>[d.id,d])),rows=[];
 for(const id of from.documents){const d=map.get(id),ids=[...new Set([id,...d.references])],hits=ids.filter(x=>map.get(x)?.concepts.includes(to.id));if(hits.length)rows.push({document:id,hits,numerator:hits.length,denominator:ids.length})}
 return {probability:rows.reduce((s,r)=>s+r.numerator/r.denominator,0)/(from.frequency||1),rows};
}
export function calculateRelations(documents,concepts){
 const active=concepts.filter(c=>c.frequency),edges=[];
 for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
 const a=active[i],b=active[j],ab=relationEvidence(documents,a,b),ba=relationEvidence(documents,b,a),score=Math.sqrt(ab.probability*ba.probability);
 if(score>0)edges.push({source:a.id,target:b.id,kind:'concept',score,ab:ab.probability,ba:ba.probability,shared:a.documents.filter(id=>b.documents.includes(id)),evidenceAB:ab.rows,evidenceBA:ba.rows});
 }return edges;
}
