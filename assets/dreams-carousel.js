(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const modal=document.querySelector('.lato-viewer'),viewImg=modal.querySelector('.lato-viewer-image'),area=modal.querySelector('.lato-viewer-image-area'),caption=modal.querySelector('.lato-viewer-caption');
 let active=null,open=false,zoom=1,panX=0,panY=0,lastFocus=null,closeTimer=null;
 const instances=[];
 function resetZoom(){zoom=1;panX=panY=0;modal.classList.remove('is-zoomed');viewImg.style.transform='';modal.querySelector('.lato-viewer-zoom').textContent='＋'}
 function applyZoom(){modal.classList.toggle('is-zoomed',zoom>1);viewImg.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;modal.querySelector('.lato-viewer-zoom').textContent=zoom>1?'−':'＋'}
 function showModal(){if(!active)return;const slide=active.slides[active.modalIndex],img=slide.querySelector('img');resetZoom();viewImg.src=img.src;viewImg.alt=img.alt;const title=slide.querySelector('figcaption')?.textContent.replace(/\s+/g,' ').trim()||img.alt;caption.textContent=`${active.modalIndex+1}/${active.slides.length} · ${title}`}
 function openModal(inst){lastFocus=document.activeElement;active=inst;inst.modalIndex=inst.index;open=true;clearTimeout(closeTimer);instances.forEach(x=>x.pause());showModal();modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';modal.querySelector('.lato-viewer-close').focus({preventScroll:true})}
 function closeModal(){if(!open)return;open=false;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';resetZoom();closeTimer=setTimeout(()=>{if(!open)viewImg.removeAttribute('src')},400);lastFocus?.focus?.({preventScroll:true});instances.forEach(x=>x.play())}
 function shift(n){if(!active)return;active.modalIndex=(active.modalIndex+n+active.slides.length)%active.slides.length;showModal()}
 for(const root of document.querySelectorAll('.lato-carousel')){
  const track=root.querySelector('.lato-track'),allSlides=[...root.querySelectorAll('.lato-slide')],allDots=[...root.querySelectorAll('.lato-dot')],viewport=root.querySelector('.lato-viewport'),tabs=root.previousElementSibling;
  let slides=[],dots=[],index=0,timer,dragStart=null,dragX=0,group='admin',generation=0;
  const pause=()=>clearInterval(timer);
  function go(n){
   if(!slides.length)return;
   const next=(n+slides.length)%slides.length;
   const wraps=Math.abs(n-index)===1&&(n<0||n>=slides.length);
   if(wraps){viewport.classList.add('is-looping');track.style.transition='none';track.style.transform=`translate3d(${-next*100}%,0,0)`;void track.offsetWidth;requestAnimationFrame(()=>{track.style.transition='';viewport.classList.remove('is-looping');});}
   else track.style.transform=`translate3d(${-next*100}%,0,0)`;
   index=next;
   slides.forEach((slide,i)=>slide.classList.toggle('is-current',i===index));
   dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===index)));
  }
  const play=()=>{pause();if(!reduce&&!document.hidden&&!open&&true)timer=setInterval(()=>go(index+1),3000)};
  const inst={get slides(){return slides},get index(){return index},modalIndex:0,go,pause,play};instances.push(inst);
  function selectGroup(value){group=value;pause();track.style.transition='none';allSlides.forEach(x=>x.hidden=x.dataset.group!==group);allDots.forEach(x=>x.hidden=x.dataset.group!==group);slides=allSlides.filter(x=>!x.hidden);dots=allDots.filter(x=>!x.hidden);index=0;slides.forEach((slide,i)=>slide.classList.toggle('is-current',i===0));dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===0)));track.style.transform='translate3d(0,0,0)';void track.offsetWidth;requestAnimationFrame(()=>{track.style.transition='';play()});tabs?.querySelectorAll('.lato-tab').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.group===group)));}
  tabs?.querySelectorAll('.lato-tab').forEach(b=>b.addEventListener('click',()=>selectGroup(b.dataset.group)));
  root.querySelector('.lato-prev').addEventListener('click',()=>{go(index-1);play()});root.querySelector('.lato-next').addEventListener('click',()=>{go(index+1);play()});
  allDots.forEach(d=>d.addEventListener('click',()=>{go(dots.indexOf(d));play()}));
  allSlides.forEach(s=>s.querySelector('button').addEventListener('click',()=>openModal(inst)));
  viewport.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;dragStart=e.clientX;dragX=0});
  viewport.addEventListener('pointermove',e=>{if(dragStart!==null)dragX=e.clientX-dragStart});
  viewport.addEventListener('pointerup',()=>{if(Math.abs(dragX)>45){go(index+(dragX<0?1:-1));play()}dragStart=null;dragX=0});
  viewport.addEventListener('pointercancel',()=>{dragStart=null});
  // Intentionally no horizontal wheel listener: Safari/macOS back gesture remains native.
  /* Hover and focus do not interrupt autoplay; only the image viewer and hidden tab pause it. */
  document.addEventListener('visibilitychange',()=>document.hidden?pause():play());
  selectGroup('admin');
 }
 modal.querySelector('.lato-viewer-close').addEventListener('click',closeModal);
 modal.querySelector('.lato-viewer-prev').addEventListener('click',()=>shift(-1));modal.querySelector('.lato-viewer-next').addEventListener('click',()=>shift(1));
 modal.querySelector('.lato-viewer-zoom').addEventListener('click',()=>{zoom=zoom>1?1:2.3;panX=panY=0;applyZoom()});
 modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
 document.addEventListener('keydown',e=>{if(!open)return;if(e.key==='Escape'){closeModal();e.preventDefault()}if(e.key==='ArrowLeft'){shift(-1);e.preventDefault()}if(e.key==='ArrowRight'){shift(1);e.preventDefault()}if(e.key==='Tab'){const buttons=[...modal.querySelectorAll('button')];if(e.shiftKey&&document.activeElement===buttons[0]){buttons.at(-1).focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){buttons[0].focus();e.preventDefault()}}});
 let pointers=new Map(),touchStart=null,lastTap=0;
 area.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});area.setPointerCapture(e.pointerId);if(pointers.size===1)touchStart={x:e.clientX,y:e.clientY,panX,panY};if(pointers.size===2){const p=[...pointers.values()];area._pinch={distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),zoom}}});
 area.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2&&area._pinch){const p=[...pointers.values()];zoom=Math.max(1,Math.min(5,area._pinch.zoom*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/Math.max(1,area._pinch.distance)));if(zoom===1)panX=panY=0;applyZoom()}else if(zoom>1&&touchStart){panX=touchStart.panX+e.clientX-touchStart.x;panY=touchStart.panY+e.clientY-touchStart.y;applyZoom()}});
 area.addEventListener('pointerup',e=>{const start=touchStart,moved=start?e.clientX-start.x:0;pointers.delete(e.pointerId);area._pinch=null;if(pointers.size===0){if(zoom===1&&Math.abs(moved)>55)shift(moved<0?1:-1);else if(Math.abs(moved)<18){const now=Date.now();if(now-lastTap<330){zoom=zoom>1?1:2.3;panX=panY=0;applyZoom();lastTap=0}else lastTap=now}}touchStart=null});
 area.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);touchStart=null;area._pinch=null});
 // Pinch/ctrl-wheel zoom only; no horizontal wheel interception on Mac.
 area.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();zoom=Math.max(1,Math.min(5,zoom*(e.deltaY<0?1.12:.89)));if(zoom===1)panX=panY=0;applyZoom()}},{passive:false});
})();
