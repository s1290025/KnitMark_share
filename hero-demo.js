(() => {
 const demo=document.querySelector('[data-demo-mode="pattern"]'), svg=document.querySelector('[data-pattern-chart]');if(!demo||!svg)return;
 const ns='http://www.w3.org/2000/svg', marks=[], groups=[];
 function el(tag,attrs,parent){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));parent.append(e);return e;}
 el('circle',{cx:160,cy:160,r:15,fill:'none',stroke:'#51453c','stroke-width':1.8},svg);
 const sizes=[6,12,18], radii=[39,79,121];
 function point(a,r){return [160-Math.sin(a)*r,160-Math.cos(a)*r];}
 function cross(x,y,a){const anchor=el('g',{transform:'translate('+x+' '+y+') rotate('+(-a*180/Math.PI)+')'},svg);const m=el('g',{class:'pattern-mark'},anchor);el('path',{d:'M-6 0 H6 M0 -7 V7',fill:'none','stroke-linecap':'round'},m);marks.push(m);}
 // Regular concentric rounds; paired crosses share a single V-shaped base.
 for(let r=0;r<3;r++){
 const n=sizes[r], step=2*Math.PI/n;
 const offset=0;
 for(let i=0;i<n;){
 const inc=r===1||(r===2&&i%3===1);
 if(inc){
 const a=offset+(i+.5)*step, [bx,by]=point(a,radii[r]-25);
 const [lx,ly]=point(offset+i*step,radii[r]-7),[rx,ry]=point(offset+(i+1)*step,radii[r]-7);
 const join=el('path',{d:'M'+lx+' '+ly+' L'+bx+' '+by+' L'+rx+' '+ry,fill:'none',stroke:'#302c29','stroke-width':1.7,'stroke-linecap':'round','stroke-linejoin':'round',class:'pattern-join'},svg);
 groups.push({join,first:marks.length,last:marks.length+1});
 for(let k=0;k<2;k++){const b=offset+(i+k)*step,[x,y]=point(b,radii[r]);cross(x,y,b);}
 i+=2;
 }else{const a=offset+i*step,[x,y]=point(a,radii[r]);cross(x,y,a);i++;}
 }
 }
 const buttons=[...demo.querySelectorAll('[data-demo-action]')], row=demo.querySelector('[data-demo-value="row"]'), stitch=demo.querySelector('[data-demo-value="stitch"]'), history=demo.querySelector('[data-demo-history]');
 let r=0,s=0,done=0,entries=[],stack=[],timer,visible=false,touched=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function render(){row.textContent=r;stitch.textContent=s;marks.forEach((m,i)=>{m.setAttribute('class','pattern-mark '+(r>0&&s>0&&i===done-1?'is-current':i<done?'is-done':''));});groups.forEach(g=>g.join.setAttribute('stroke',r>0&&s>0&&done-1>=g.first&&done-1<=g.last?'#c83f3f':done>g.last?'#bcb6af':'#302c29'));const en=document.documentElement.lang==='en';history.replaceChildren(...(entries.length?entries.slice(-2).map((e,i,arr)=>{const d=document.createElement('div');d.className='usage-demo-history-line';d.textContent=en?e[0]+' rows · '+e[1]+' stitches':e[0]+'段 '+e[1]+'目';if(i===arr.length-1){const n=document.createElement('small');n.className='hero-app-new';n.textContent='NEW';d.append(n);}return d;}):[Object.assign(document.createElement('small'),{textContent:en?'No history yet':'履歴はまだありません'})]));}
 function act(a){if(a==='undo'){if(stack.length){[r,s,done,entries]=stack.pop();}}else{if(a==='row'&&(r>=3||(r>0&&s!==sizes[r-1])))return;if(a==='stitch'&&(!r||s>=sizes[r-1]))return;stack.push([r,s,done,entries]);if(a==='row'){if(r)entries=[...entries,[r,s]];r++;s=0;}else{s++;done++;}}const b=buttons.find(x=>x.dataset.demoAction===a);b.classList.add('is-pressed');setTimeout(()=>b.classList.remove('is-pressed'),220);render();}
 function tick(){if(!visible||touched||reduced.matches)return;if(r===3&&s===18){r=0;s=0;done=0;entries=[];stack=[];render();}else if(!r||s===sizes[r-1])act('row');else act('stitch');timer=setTimeout(tick,r===3&&s===18?2200:s===0?1100:s===sizes[r-1]?1400:700);}
 buttons.forEach(b=>b.addEventListener('click',()=>{touched=true;clearTimeout(timer);act(b.dataset.demoAction);}));
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;clearTimeout(timer);if(visible&&!touched&&!reduced.matches)timer=setTimeout(tick,700);},{threshold:.3}).observe(demo);
 render();
})();
