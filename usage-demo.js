document.querySelectorAll('.usage-counter-demo:not([data-demo-mode="pattern"])').forEach(demo => {
 const reverse=demo.dataset.demoMode==='undo';
 const buttons=[...demo.querySelectorAll('[data-demo-action]')];
 const values={row:demo.querySelector('[data-demo-value="row"]'),stitch:demo.querySelector('[data-demo-value="stitch"]')};
 const box=demo.querySelector('[data-demo-history]');
 const forward=['row','stitch','stitch','stitch','row','stitch','stitch','stitch'];
 let state, stack, timer, i=0, visible=false,touched=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function apply(action){if(action==='undo'){if(stack.length)state=stack.pop();return;}stack.push(state);state=action==='row'?{row:state.row+1,stitch:0,entries:state.stitch?[...state.entries,{row:state.row,stitch:state.stitch}]:state.entries}:{...state,stitch:state.stitch+1};}
 function reset(){state={row:0,stitch:0,entries:[]};stack=[];if(reverse)forward.forEach(apply);i=0;}
 function render(){const en=document.documentElement.lang==='en';box.replaceChildren(...state.entries.slice(-2).map(e=>{const line=document.createElement('div');line.className='usage-demo-history-line';line.textContent=en?e.row+' rows · '+e.stitch+' stitches':e.row+'段 '+e.stitch+'目';return line;}));for(const k of Object.keys(values)){const el=values[k];if(el.textContent===String(state[k]))continue;el.textContent=state[k];el.classList.remove('is-changing');void el.offsetWidth;el.classList.add('is-changing');}}
 function act(a){apply(a);const b=buttons.find(x=>x.dataset.demoAction===a);b.classList.add('is-pressed');setTimeout(()=>b.classList.remove('is-pressed'),220);render();}
 reset();render();
 buttons.forEach(b=>b.addEventListener('click',()=>{touched=true;clearTimeout(timer);act(b.dataset.demoAction);}));
 function tick(){if(touched||!visible||reduced.matches)return;if(i===forward.length){reset();render();}else{act(reverse?'undo':forward[i]);i++;}timer=setTimeout(tick,i===forward.length?1900:1000);}
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;clearTimeout(timer);if(visible&&!touched&&!reduced.matches)timer=setTimeout(tick,900);},{threshold:.35}).observe(demo);
});
(() => {
 const demo=document.querySelector('[data-demo-mode="pattern"]'), svg=document.querySelector('[data-pattern-chart]');if(!demo||!svg)return;
 const ns='http://www.w3.org/2000/svg', marks=[], groups=[];
 function el(tag,attrs,parent){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));parent.append(e);return e;}
 el('circle',{cx:160,cy:160,r:14,fill:'none',stroke:'#51453c','stroke-width':2},svg);
 const sizes=[6,12,18], radii=[40,83,128];
 // Each group is anchored to the stitch in the previous round.
 // Work counterclockwise, beginning at the top of each round.
 const parents=[[],Array.from({length:6},(_,i)=>i),Array.from({length:12},(_,i)=>i)];
 const positions=[];
 function cross(x,y,angle){const anchor=el('g',{transform:'translate('+x+' '+y+') rotate('+angle+')'},svg);const m=el('g',{class:'pattern-mark'},anchor);el('path',{d:'M-6 0 H6 M0 -8 V8',fill:'none','stroke-linecap':'round'},m);marks.push(m);return m;}
 function point(a,r){return [160-Math.sin(a)*r,160-Math.cos(a)*r];}
 for(let r=0;r<3;r++){
 const n=sizes[r], prev=r?positions[r-1]:[], angles=[];
 if(!r){for(let j=0;j<n;j++){const a=j*2*Math.PI/n;const [x,y]=point(a,radii[r]);cross(x,y,-a*180/Math.PI);angles.push(a);}}
 else{for(let j=0;j<prev.length;j++){
 const a=prev[j], inc=r===1||j%2===1, spread=r===1?Math.PI/12:Math.PI/18;
 if(inc){const [bx,by]=point(a,radii[r-1]+11),[lx,ly]=point(a-spread,radii[r]-9),[rx,ry]=point(a+spread,radii[r]-9);
 const join=el('path',{d:'M'+lx+' '+ly+' L'+bx+' '+by+' L'+rx+' '+ry,fill:'none',stroke:'#302c29','stroke-width':1.5,'stroke-linecap':'round',class:'pattern-join'},svg);
 const first=marks.length;groups.push({join,first,last:first+1});
 for(const b of [a-spread,a+spread]){const [x,y]=point(b,radii[r]);cross(x,y,-b*180/Math.PI);angles.push(b);}
 }else{const [x,y]=point(a,radii[r]);cross(x,y,-a*180/Math.PI);angles.push(a);}
 }}
 positions.push(angles);
 }
 const buttons=[...demo.querySelectorAll('[data-demo-action]')], row=demo.querySelector('[data-demo-value="row"]'), stitch=demo.querySelector('[data-demo-value="stitch"]'), history=demo.querySelector('[data-demo-history]');
 let r=0,s=0,done=0,entries=[],stack=[],timer,visible=false,touched=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function render(){row.textContent=r;stitch.textContent=s;marks.forEach((m,i)=>{m.setAttribute('class','pattern-mark '+(i<done?'is-done':i===done&&r>0&&s<sizes[r-1]?'is-current':''));});groups.forEach(g=>g.join.setAttribute('stroke',done>g.last?'#bcb6af':done>=g.first&&done<=g.last&&r>0&&s<sizes[r-1]?'#c83f3f':'#302c29'));const en=document.documentElement.lang==='en';history.replaceChildren(...entries.slice(-2).map(e=>{const d=document.createElement('div');d.className='usage-demo-history-line';d.textContent=en?e[0]+' rows · '+e[1]+' stitches':e[0]+'段 '+e[1]+'目';return d;}));}
 function act(a){if(a==='undo'){if(stack.length){[r,s,done,entries]=stack.pop();}}else{if(a==='row'&&(r>=3||(r>0&&s!==sizes[r-1])))return;if(a==='stitch'&&(!r||s>=sizes[r-1]))return;stack.push([r,s,done,entries]);if(a==='row'){if(r)entries=[...entries,[r,s]];r++;s=0;}else{s++;done++;}}const b=buttons.find(x=>x.dataset.demoAction===a);b.classList.add('is-pressed');setTimeout(()=>b.classList.remove('is-pressed'),220);render();}
 function tick(){if(!visible||touched||reduced.matches)return;if(r===3&&s===18){r=0;s=0;done=0;entries=[];stack=[];render();}else if(!r||s===sizes[r-1])act('row');else act('stitch');timer=setTimeout(tick,r===3&&s===18?2200:700);}
 buttons.forEach(b=>b.addEventListener('click',()=>{touched=true;clearTimeout(timer);act(b.dataset.demoAction);}));
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;clearTimeout(timer);if(visible&&!touched&&!reduced.matches)timer=setTimeout(tick,700);},{threshold:.3}).observe(demo);
 render();
})();