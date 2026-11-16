document.querySelectorAll('.usage-counter-demo').forEach(demo => {
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