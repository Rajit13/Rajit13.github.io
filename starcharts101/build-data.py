"""Rebuild auditable book documents and binary concept incidences (Python stdlib only)."""
import re,json,hashlib,pathlib,math
P=pathlib.Path(__file__).parent
# Inputs are pinned; no silent mixture of book versions.
PIN='9abc854146accfbed5027a488569e1eb1b6254e4'
EXPECTED={'StarMaps101.tex':'221f65200453cdbbc3488f3a8a0ef54ff4862d66','StarMaps101.toc':'f4ce6855f145e9e634277a35bb7ff20853fd4656'}
for filename,expected in EXPECTED.items():
 path=P/filename
 if not path.exists():
  import urllib.request
  path.write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/Rajit13/Star-Maps-101-and-Practices/'+PIN+'/'+filename,timeout=60).read())
 content=path.read_bytes()
 actual=hashlib.sha1(b'blob '+str(len(content)).encode()+b'\0'+content).hexdigest()
 if actual!=expected:raise ValueError(filename+' differs from the pinned source; update provenance deliberately before rebuilding')
tex=(P/'StarMaps101.tex').read_text(); toc=(P/'StarMaps101.toc').read_text()
# Preserve offsets for source line links, while removing material absent from the PDF.
def blank(m): return re.sub(r'[^\n]',' ',m.group())
src=re.sub(r'\\begin\{comment\}.*?\\end\{comment\}',blank,tex,flags=re.S)
src=re.sub(r'(?<!\\)%[^\n]*',blank,src)
def plain(t):
 t=re.sub(r'\\includegraphics(?:\[[^\]]*\])?\{[^}]*\}',' ',t)
 t=re.sub(r'\\(?:label|ref|pageref|cite)\{[^}]*\}',' ',t)
 t=re.sub(r'\\(?:begin|end)\{[^}]*\}(?:\[[^\]]*\])?',' ',t)
 t=re.sub(r'\\(?:alpha|beta|gamma|delta|phi|theta|lambda|epsilon|pi)\b',lambda m:' '+m.group()[1:]+' ',t)
 t=re.sub(r'\\[a-zA-Z]+\*?(?:\[[^\]]*\])?',' ',t)
 t=re.sub(r'[{}$^_&~]|\\\\',' ',t)
 return re.sub(r'\s+',' ',t).strip()
def norm(t):return re.sub(r'[^a-z0-9]+',' ',plain(t).lower()).strip()
def slug(t):return re.sub(r'[^a-z0-9]+','-',norm(t)).strip('-')
# TOC numbers and PDF starting pages; unnumbered units inherit a clearly marked nearby page.
tocrows=[]
for m in re.finditer(r'\\contentsline \{(section|subsection|subsubsection)\}\{(?:\\numberline \{([^}]*)\})?(.+?)\}\{([^{}]*)\}',toc):
 tocrows.append(dict(type=m[1],number=m[2] or '',title=plain(m[3]),page=m[4]))
heads=list(re.finditer(r'\\(section|subsection|subsubsection)(\*)?\{([^}]*)\}',src))
units=[]; sec='';sub=''; major=0;prevpage='';counter={};lasttoc=-1
for i,h in enumerate(heads):
 typ,star,title=h[1],bool(h[2]),plain(h[3]);start=h.end();end=heads[i+1].start() if i+1<len(heads) else len(src)
 if typ=='section':
  sec=title;sub=''
  if not star:major+=1
 elif typ=='subsection':sub=title
 if not 1<=major<=6:continue
 raw=src[start:end]
 match=None
 for j,z in enumerate(tocrows):
  if j>lasttoc and z['type']==typ and norm(z['title'])==norm(title):match=z;lasttoc=j;break
 if match:prevpage=match['page']
 base=dict(title=title,section=sec,subsection=sub,number=match['number'] if match else '',page=prevpage,pageApprox=not bool(match),headingLine=src.count('\n',0,h.start())+1)
 if major==6 and (typ=='section' or 'Instructions' in sub or 'Marking Works' in sub):continue
 if not plain(raw):continue
 if major<6:
  parts=[(start,end,'')];kind='worked' if re.search(r'example|problem|practice',title,re.I) else 'teaching'
 else:
  kind='practice'; parts=[]
  # Explicit non-enumerated question labels take precedence.
  markers=list(re.finditer(r'\\textbf\{(OP\d+|O\d+)\s*:?\}',raw))
  if markers:
   for j,m in enumerate(markers):parts.append((start+m.start(),start+(markers[j+1].start() if j+1<len(markers) else len(raw)),m[1]))
  else:
   depth=0;itemdepth=0;items=[];enumstart=None;enumend=None
   for m in re.finditer(r'\\begin\{(?:enumerate|itemize)\}(?:\[[^\]]*\])?|\\end\{(?:enumerate|itemize)\}|\\item\b(?:\[[^\]]*\])?',raw):
    if '{itemize}' in m.group():
     itemdepth+=1 if m.group().startswith('\\begin') else -1
     continue
    if m.group().startswith('\\begin'):
     if depth==0 and enumstart is None:enumstart=m.start()
     depth+=1
    elif m.group().startswith('\\end'):
     depth=max(0,depth-1)
     if depth==0:enumend=m.start()
    elif depth==1 and itemdepth==0:items.append(m)
   if items:
    prefix=raw[:enumstart] if enumstart is not None else ''
    for j,m in enumerate(items):parts.append((start+m.end(),start+(items[j+1].start() if j+1<len(items) else (enumend or len(raw))),str(j+1)))
   else:prefix='';parts=[(start,end,'')]
 for a,b,part in parts:
  body=src[a:b];text=plain(body)
  if re.search(r'For more questions from BDOAA|Now drink Coconut water',text):continue
  if len(text)<20 and not re.search(r'\\ref\{',body):continue
  titlefull=' · '.join(dict.fromkeys(x for x in [sub if major==6 else '',title,('Question '+part) if part else ''] if x))
  key=' / '.join([sec,sub,title,part]);uid=('p-' if kind=='practice' else 'd-')+slug(key)
  if any(d['id']==uid for d in units):uid+='-'+hashlib.sha1(body.encode()).hexdigest()[:6]
  context=plain(prefix) if major==6 and not markers and items else ''
  units.append(dict(base,id=uid,label=titlefull,kind=kind,text=text,context=context,sourceLine=src.count('\n',0,a)+1,endLine=src.count('\n',0,b)+1,labels=re.findall(r'\\label\{([^}]+)\}',body),refs=re.findall(r'\\(?:ref|pageref)\{([^}]+)\}',body),images=re.findall(r'\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}',body),start=a,end=b))
# Headings may own labels just before an item; assign labels to containing unit or nearest unit under the heading.
labelmap={};labeltexts={}
figure_ranges=[(m.start(),m.end()) for m in re.finditer(r'\\begin\{(?:figure|table)\}.*?\\end\{(?:figure|table)\}',src,re.S)]
for m in re.finditer(r'\\label\{([^}]+)\}',src):
 if any(a<=m.start()<b for a,b in figure_ranges):continue
 owners=[d for d in units if d['start']<=m.start()<d['end']]
 if owners:
  owner=owners[0];labelmap[m[1]]=owner['id']
  segment=src[owner['start']:owner['end']]; offset=m.start()-owner['start']; depth=0;itemdepth=0;beg=None;level=0
  for token in re.finditer(r'\\begin\{(enumerate|itemize)\}|\\end\{(enumerate|itemize)\}|\\item\b',segment):
   if token[1]=='enumerate':depth+=1
   elif token[2]=='enumerate':
    if beg is not None and token.start()>offset and depth==level:
     labeltexts[m[1]]=plain(segment[beg:token.start()]);break
    depth-=1
   elif token[1]=='itemize':itemdepth+=1
   elif token[2]=='itemize':itemdepth-=1
   elif depth and itemdepth==0:
    if beg is not None and token.start()>offset and depth==level:
     labeltexts[m[1]]=plain(segment[beg:token.start()]);break
    if token.start()<offset:beg=token.end();level=depth

byid={d['id']:d for d in units}
for d in units:
 d['references']=sorted(set(labelmap[r] for r in d['refs'] if r in labelmap and labelmap[r]!=d['id']))
 d['unresolvedReferences']=[r for r in d['refs'] if r not in labelmap]
 # Reference-only exercises explicitly reuse the referenced content, never arbitrary surrounding text.
 if len(d['text'])<35 and d['references']:
  d['text']='Referenced exercise: '+ ' '.join(labeltexts.get(r,byid[labelmap[r]]['text']) for r in d['refs'] if r in labelmap)
 for k in ['start','end','labels','refs']:d.pop(k)
v=json.loads((P/'vocabulary.json').read_text())
extra=[('galactic','Galactic coordinates','coords',['galactic equator','galactic latitude','galactic longitude','galactic coordinate']),('orbital-period','Orbital period and Kepler relation','motion',['kepler third law','kepler s third law','orbital period','semi major axis','semimajor axis']),('inclination','Orbital inclination','motion',['inclination','orbital plane']),('lensing','Lensing time-delay measurement','observe',['lensing','time delay','light curve']),('ring-geometry','Ring geometry and shadow reconstruction','proj',['ring boundary','ring boundaries','ring width','ringed planet','ring shadow'])]
for key,label,domain,aliases in extra:v['concepts'].append(dict(id='c-'+key,key=key,label=label,domain=domain,aliases=aliases,kind='concept'))
# Transparent lexical evidence. These are candidate annotations, not semantic understanding claims.
augment={'constellation':['constellations'],'coordinates':['coordinates'],'equatorial':['equatorial'],'horizontal':['altitude','azimuth'],'sky-map':['skymap','sky maps','star charts'],'plotting':['mark the position','mark positions','draw the','plot'],'position':['positions','locate','identify the'],'coordinate-measurement':['interpolate','interpolation','grid lines'],'moon-motion':['motion of the moon','moon s motion'],'moon-phase':['moon s phase','new moon','phase of the moon'],'planet-motion':['planets','planetary','planet'],'seasonal-sky':['monthly','seasonal'],'constellation-names':['iau codes','iau abbreviations'],'centering':['centre','center','finderscope','finder scope'],'angular-scale':['angular diameter','angular size','separation'],'orbital-period':['orbital periods'],'projection':['projections']}
for c in v['concepts']:
 c['aliases']+=augment.get(c['key'],[]);c['documents']=[]
 for d in units:
  body=' '+norm(d['label']+' '+d['context']+' '+d['text'])+' '
  matches=sorted(set(a for a in c['aliases'] if ' '+norm(a)+' ' in body))
  if matches:
   c['documents'].append(d['id']);d.setdefault('concepts',[]).append(c['id']);d.setdefault('evidence',{})[c['id']]=matches
 c['frequency']=len(c['documents'])
for d in units:d.setdefault('concepts',[]);d.setdefault('evidence',{})
active=[c for c in v['concepts'] if c['frequency']]
# Directed transition: average neighbourhood prevalence over all A documents. Include self once.
edges=[]
for i,a in enumerate(active):
 for b in active[i+1:]:
  def probability(c,target):
   rows=[]
   for uid in c['documents']:
    ids=[uid]+byid[uid]['references'];hits=[x for x in ids if target['id'] in byid[x]['concepts']]
    if hits:rows.append(dict(document=uid,hits=hits,numerator=len(hits),denominator=len(ids)))
   return sum(r['numerator']/r['denominator'] for r in rows)/c['frequency'],rows
  ab,evab=probability(a,b);ba,evba=probability(b,a);w=math.sqrt(ab*ba)
  if w>0:edges.append(dict(source=a['id'],target=b['id'],score=w,ab=ab,ba=ba,shared=sorted(set(a['documents'])&set(b['documents'])),evidenceAB=evab,evidenceBA=evba,kind='concept'))
prereqs=[('equatorial','coordinate-transform','Equatorial coordinates supply right ascension and declination for transformations.'),('horizontal','coordinate-transform','Altitude and azimuth define the destination or source horizontal system.'),('hour-angle','coordinate-transform','Hour angle connects observing time to the transformation geometry.'),('latitude','coordinate-transform','Observer latitude is required in equatorial–horizontal relations.'),('ecliptic','equinox','Equinoxes are intersections of the ecliptic and celestial equator.'),('celestial-equator','equinox','The celestial equator is the second defining great circle.'),('focal','fov','Eyepiece choice connects magnification with field of view.'),('fov','centering','Knowing the field of view helps acquire and centre a target.')]
result=dict(schema=1,generated='2026-09-16',source=dict(repository='Rajit13/Star-Maps-101-and-Practices',commit='9abc854146accfbed5027a488569e1eb1b6254e4',texBlob='221f65200453cdbbc3488f3a8a0ef54ff4862d66',tocBlob='f4ce6855f145e9e634277a35bb7ff20853fd4656',texSHA256=hashlib.sha256(tex.encode()).hexdigest()),domains=v['domains'],documents=units,concepts=v['concepts'],prerequisites=[dict(source='c-'+a,target='c-'+b,reason=r,kind='prerequisite') for a,b,r in prereqs],annotationStatus='Lexical candidates with visible phrase evidence; mathematical and image-only skills require human review.')
(P/'graph-data.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')))
print(json.dumps(dict(documents=len(units),practice=sum(d['kind']=='practice' for d in units),activeConcepts=len(active),crossReferences=sum(len(d['references']) for d in units),candidateEdges=len(edges),unmatched=sum(not d['concepts'] for d in units)),indent=2))
