document.querySelectorAll('.usage-counter-demo[data-demo-mode="forward"],.usage-counter-demo[data-demo-mode="undo"]').forEach(demo => {
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
 function render(){row.textContent=r;stitch.textContent=s;marks.forEach((m,i)=>{m.setAttribute('class','pattern-mark '+(r>0&&s>0&&i===done-1?'is-current':i<done?'is-done':''));});groups.forEach(g=>g.join.setAttribute('stroke',r>0&&s>0&&done-1>=g.first&&done-1<=g.last?'#c83f3f':done>g.last?'#bcb6af':'#302c29'));const en=document.documentElement.lang==='en';history.replaceChildren(...entries.slice(-2).map(e=>{const d=document.createElement('div');d.className='usage-demo-history-line';d.textContent=en?e[0]+' rows · '+e[1]+' stitches':e[0]+'段 '+e[1]+'目';return d;}));}
 function act(a){if(a==='undo'){if(stack.length){[r,s,done,entries]=stack.pop();}}else{if(a==='row'&&(r>=3||(r>0&&s!==sizes[r-1])))return;if(a==='stitch'&&(!r||s>=sizes[r-1]))return;stack.push([r,s,done,entries]);if(a==='row'){if(r)entries=[...entries,[r,s]];r++;s=0;}else{s++;done++;}}const b=buttons.find(x=>x.dataset.demoAction===a);b.classList.add('is-pressed');setTimeout(()=>b.classList.remove('is-pressed'),220);render();}
 function tick(){if(!visible||touched||reduced.matches)return;if(r===3&&s===18){r=0;s=0;done=0;entries=[];stack=[];render();}else if(!r||s===sizes[r-1])act('row');else act('stitch');timer=setTimeout(tick,r===3&&s===18?2200:s===0?1100:s===sizes[r-1]?1400:700);}
 buttons.forEach(b=>b.addEventListener('click',()=>{touched=true;clearTimeout(timer);act(b.dataset.demoAction);}));
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;clearTimeout(timer);if(visible&&!touched&&!reduced.matches)timer=setTimeout(tick,700);},{threshold:.3}).observe(demo);
 render();
})();
(() => {
 const demo=document.querySelector('[data-demo-mode="flat-pattern"]'),svg=document.querySelector('[data-flat-chart]');if(!demo||!svg)return;
 const ns='http://www.w3.org/2000/svg', rounds=[];
 function mark(x,y,shape,angle=0){const a=document.createElementNS(ns,'g');a.setAttribute('transform','translate('+x+' '+y+') rotate('+angle+')');svg.append(a);const g=document.createElementNS(ns,'g');g.setAttribute('class','pattern-mark');a.append(g);const p=document.createElementNS(ns,'path');p.setAttribute('d',shape);p.setAttribute('fill','none');p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');g.append(p);return g;}
 const chain='M-12 0 A12 5.5 0 1 0 12 0 A12 5.5 0 1 0 -12 0',cross='M-10 0H10 M0 -12V12',dc='M0 0V-47 M-10 -47H10 M-9 -30H9',slip='M-5 0H5';
 rounds.push(Array.from({length:5},(_,i)=>mark(258-i*44,207,chain)));
 const turns=[];
 for(let r=0;r<3;r++){const y=174-r*44, left=r%2===0;turns.push(mark(left?49:283,y,chain,left?65:115));rounds.push(Array.from({length:5},(_,i)=>mark(left?82+i*44:258-i*44,y,cross)));}
 turns.push(mark(283,64,chain,65));
 const top=[];for(const x of [258,170,82]){for(const a of [32,0,-32])top.push(mark(x,70,dc,a));top.push(mark(x===82?49:x-44,68,slip));}rounds.push(top);
 const row=demo.querySelector('[data-demo-value="row"]'),stitch=demo.querySelector('[data-demo-value="stitch"]'),history=demo.querySelector('[data-demo-history]'),buttons=[...demo.querySelectorAll('[data-demo-action]')];
 const steps=[];
 const add=(action,mark=null)=>steps.push({action,mark});
 rounds[0].forEach(m=>add('stitch',m));add('mark-stitch');
 for(let i=1;i<=3;i++){add('highlight',turns[i-1]);rounds[i].forEach(m=>add('highlight',m));add('row');}
 // The next turning chain starts the decorative edge.
 add('highlight',turns[3]);add('mark-row');
 for(let i=0;i<12;i+=4){for(let k=0;k<3;k++)add('stitch',rounds[4][i+k]);add('mark-stitch');add('highlight',rounds[4][i+3]);}
 const all=[...rounds.flat(),...turns];
 let r=0,s=0,entries=[],completed=[],active=null,index=0,stack=[],timer,visible=false,touched=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function render(){row.textContent=r;stitch.textContent=s;all.forEach(m=>m.setAttribute('class','pattern-mark '+(m===active?'is-current':completed.includes(m)?'is-done':'')));const en=document.documentElement.lang==='en';history.replaceChildren(...entries.slice(-2).map(e=>{const d=document.createElement('div');d.className='usage-demo-history-line';d.textContent=(en?e.r+' rows · '+e.s+' stitches':e.r+'段 '+e.s+'目');return d;}));}
 function act(a){if(a==='undo'){if(stack.length){({r,s,entries,completed,active,index}=stack.pop());}}else{const step=steps[index];if(!step||step.action!==a)return;stack.push({r,s,entries,completed,active,index});index++;active=step.mark;if(active)completed=[...completed,active];if(a==='stitch')s++;if(a==='row'||a==='mark-row'||a==='mark-stitch'){if(s||a==='mark-row')entries=[...entries,{r,s,mark:a!=='row'}];s=0;if(a==='row')r++;if(a==='mark-row')r=0;}}
 const b=buttons.find(b=>b.dataset.demoAction===a);if(b){b.classList.add('is-pressed');setTimeout(()=>b.classList.remove('is-pressed'),220);}render();}
 function tick(){if(!visible||touched||reduced.matches)return;if(index===steps.length){r=0;s=0;entries=[];completed=[];active=null;index=0;stack=[];render();}else act(steps[index].action);timer=setTimeout(tick,index===steps.length?2200:steps[index-1]?.action?.startsWith('mark')?1100:700);}
 buttons.forEach(b=>b.addEventListener('click',()=>{touched=true;clearTimeout(timer);while(b.dataset.demoAction!=='undo'&&steps[index]?.action==='highlight')act('highlight');act(b.dataset.demoAction);}));
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;clearTimeout(timer);if(visible&&!touched&&!reduced.matches)timer=setTimeout(tick,700);},{threshold:.3}).observe(demo);render();
})();

document.querySelectorAll('[data-demo-mode="marks"],[data-demo-mode="progress"]').forEach(demo=>{
 const marks=demo.dataset.demoMode==='marks', sequence=marks?['stitch','stitch','stitch','mark-stitch','stitch','stitch','mark-stitch','row','row','row','mark-row']:['row','stitch','stitch','progress','stitch','stitch','row'];
 const buttons=[...demo.querySelectorAll('[data-demo-action]')],row=demo.querySelector('[data-demo-value="row"]'),stitch=demo.querySelector('[data-demo-value="stitch"]'),history=demo.querySelector('[data-demo-history]');
 let r=0,s=0,entries=[],stack=[],i=0,timer,visible=false,touched=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let lastKey='';
 function render(){row.textContent=r;stitch.textContent=s;const en=document.documentElement.lang==='en', key=JSON.stringify(entries)+en;if(key===lastKey)return;const previous=lastKey;lastKey=key;const items=entries.slice(-2);history.replaceChildren(...items.map((e,i)=>{const d=document.createElement('div');d.className='usage-demo-history-line';const count=document.createElement('span');count.textContent=en?e.r+' '+(e.r===1?'Row':'Rows')+' '+e.s+' '+(e.s===1?'Stitch':'Stitches'):e.r+'段 '+e.s+'目';d.append(count);if(e.paused){const badge=document.createElement('span');badge.className='usage-paused-badge';badge.textContent=en?'Paused':'途中';d.append(badge);}if(i===items.length-1){const n=document.createElement('span');n.className='usage-new-label';n.textContent='NEW';d.append(n);}return d;}));if(previous&&items.length){history.classList.remove('usage-history-moving');void history.offsetWidth;history.classList.add('usage-history-moving');}}
 function act(a){if(a==='undo'){if(stack.length)[r,s,entries]=stack.pop();}else{stack.push([r,s,entries]);if(a==='stitch')s++;else if(a==='progress'){entries=[...entries.filter(e=>!e.paused),{r,s,paused:true}];}else{entries=entries.filter(e=>!e.paused);if(s||a==='mark-row'&&r)entries=[...entries,{r,s}];s=0;if(a==='row')r++;if(a==='mark-row')r=0;}}const b=buttons.find(b=>b.dataset.demoAction===a);if(b){b.classList.add('is-pressed');setTimeout(()=>b.classList.remove('is-pressed'),220);}render();}
 function tick(){if(!visible||touched||reduced.matches)return;if(i===sequence.length){r=0;s=0;entries=[];stack=[];i=0;render();}else act(sequence[i++]);timer=setTimeout(tick,i===sequence.length?1900:sequence[i-1]==='progress'?1800:850);}
 buttons.forEach(b=>b.addEventListener('click',()=>{touched=true;clearTimeout(timer);act(b.dataset.demoAction);}));
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;clearTimeout(timer);if(visible&&!touched&&!reduced.matches)timer=setTimeout(tick,850);},{threshold:.3}).observe(demo);render();
});
