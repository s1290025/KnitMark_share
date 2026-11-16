(() => {
  const demo = document.querySelector('.usage-counter-demo');
  if (!demo) return;
  const buttons = [...demo.querySelectorAll('[data-demo-action]')];
  const values = {row: demo.querySelector('[data-demo-value="row"]'), stitch: demo.querySelector('[data-demo-value="stitch"]')};
  let state = {row:0, stitch:0}, history = [], timer, touched = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function render() {
    for (const key of Object.keys(values)) {
      const el = values[key];
      if (el.textContent === String(state[key])) continue;
      el.textContent = state[key];
      el.classList.remove('is-changing');
      void el.offsetWidth;
      el.classList.add('is-changing');
    }
  }
  function act(action) {
    if (action === 'undo') { if (history.length) state = history.pop(); }
    else {
      history.push({...state});
      state = action === 'row' ? {row:state.row+1,stitch:0} : {...state,stitch:state.stitch+1};
    }
    const button = buttons.find(b => b.dataset.demoAction === action);
    button.classList.add('is-pressed');
    setTimeout(() => button.classList.remove('is-pressed'), 220);
    render();
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    if (!touched) { touched = true; clearTimeout(timer); }
    act(button.dataset.demoAction);
  }));
  const sequence = ['stitch','stitch','stitch','row','stitch','undo','undo'];
  let i = 0, visible = false;
  function tick() {
    if (touched || !visible || reduced.matches) return;
    if (i === sequence.length) { state = {row:0,stitch:0}; history = []; render(); i = 0; }
    else act(sequence[i++]);
    timer = setTimeout(tick, i === sequence.length ? 1900 : 1100);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      clearTimeout(timer);
      if (visible && !touched && !reduced.matches) timer = setTimeout(tick, 900);
    }, {threshold:.45}).observe(demo);
  }
})();