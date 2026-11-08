/* Page-local media viewer. Never selects or changes the protected iPhone/demo. */
(() => {
  const language = () => document.documentElement.lang.startsWith('en') ? 'en' : 'ru';
  const labels = {
    ru: {close:'Закрыть просмотр',plus:'Увеличить',minus:'Уменьшить',fit:'Вписать',view:'Просмотр медиафайла',prev:'Предыдущий медиафайл',next:'Следующий медиафайл',error:'Не удалось загрузить медиафайл'},
    en: {close:'Close viewer',plus:'Zoom in',minus:'Zoom out',fit:'Fit',view:'Media viewer',prev:'Previous media',next:'Next media',error:'The media could not be loaded'}
  };
  const icon = path => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
  const dialog = document.createElement('dialog');
  dialog.id = 'dd-media-viewer';
  dialog.setAttribute('aria-labelledby','dd-viewer-caption');
  dialog.innerHTML = `<p class="dd-viewer-caption" id="dd-viewer-caption" tabindex="0"><span class="dd-viewer-caption-text"></span></p>
    <button type="button" class="dd-viewer-close">${icon('M6 6l12 12M18 6 6 18')}</button>
    <div class="dd-viewer-stage"><img class="dd-viewer-image" alt="" draggable="false"><video class="dd-viewer-video" controls playsinline preload="metadata" hidden></video></div>
    <button type="button" class="dd-viewer-prev dd-viewer-step">${icon('m14 6-6 6 6 6')}</button>
    <button type="button" class="dd-viewer-next dd-viewer-step">${icon('m10 6 6 6-6 6')}</button>
    <output class="dd-viewer-count" aria-live="polite"></output>
    <div class="dd-viewer-bar"><button type="button" data-viewer-action="minus">${icon('M5 12h14')}</button><output class="dd-viewer-percent">100%</output><button type="button" data-viewer-action="plus">${icon('M5 12h14M12 5v14')}</button><button type="button" class="dd-viewer-fit" data-viewer-action="fit"></button></div>`;
  document.body.append(dialog);
  const stage = dialog.querySelector('.dd-viewer-stage');
  const image = dialog.querySelector('.dd-viewer-image');
  const video = dialog.querySelector('.dd-viewer-video');
  const prev = dialog.querySelector('.dd-viewer-prev');
  const next = dialog.querySelector('.dd-viewer-next');
  const count = dialog.querySelector('.dd-viewer-count');
  const captionLine = dialog.querySelector('.dd-viewer-caption');
  const caption = dialog.querySelector('.dd-viewer-caption-text');
  const closeButton = dialog.querySelector('.dd-viewer-close');
  const plus = dialog.querySelector('[data-viewer-action="plus"]');
  const minus = dialog.querySelector('[data-viewer-action="minus"]');
  const fitButton = dialog.querySelector('[data-viewer-action="fit"]');
  const percent = dialog.querySelector('.dd-viewer-percent');
  captionLine.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();
    if(event.key==='Home')captionLine.scrollLeft=0;
    else if(event.key==='End')captionLine.scrollLeft=captionLine.scrollWidth;
    else captionLine.scrollLeft+=event.key==='ArrowRight'?80:-80;
  });
  const pointers = new Map();
  let zoom=1, x=0, y=0, fitWidth=0, fitHeight=0;
  let trigger=null, originTrigger=null, previousOverflow='', gesture=null, moved=false, multi=false, beganOnImage=false;
  let items=[], index=0, kind='image';
  const isMedia = link => /\.(png|jpe?g|webp|mov|mp4|m4v|webm)(?:$|[?#])/i.test(link?.getAttribute('href') || '');
  const isVideo = link => /\.(mov|mp4|m4v|webm)(?:$|[?#])/i.test(link.getAttribute('href'));
  const onVideo = target => target === video || video.contains(target);
  let safariStart=null;
  const clamp = (value,min,max) => Math.min(max,Math.max(min,value));
  const point = event => {
    const rect=stage.getBoundingClientRect();
    return {x:event.clientX-rect.left-rect.width/2,y:event.clientY-rect.top-rect.height/2};
  };
  function positionCaption(){
    if(!dialog.open)return;
    const media=kind==='video'?video:image;
    const bottom=Math.min(media.getBoundingClientRect().bottom,stage.getBoundingClientRect().bottom);
    captionLine.style.top=(bottom+12)+'px';
  }
  function render() {
    const limitX=Math.max(0,(fitWidth*zoom-stage.clientWidth)/2);
    const limitY=Math.max(0,(fitHeight*zoom-stage.clientHeight)/2);
    x=clamp(x,-limitX,limitX); y=clamp(y,-limitY,limitY);
    if(zoom===1){x=0;y=0;}
    image.style.transform=`translate3d(${x}px,${y}px,0) scale(${zoom})`;
    dialog.dataset.zoomed=String(zoom>1.001);
    percent.textContent=Math.round(zoom*100)+'%';
    plus.disabled=zoom>=8;
    minus.disabled=zoom<=1;
    positionCaption();
  }
  function zoomAt(next,px=0,py=0) {
    next=clamp(next,1,8);
    const factor=next/zoom;
    x=px-(px-x)*factor; y=py-(py-y)*factor; zoom=next;
    render();
  }
  function fitImage(reset=false) {
    if(kind==='video'){
      if(!dialog.open || !video.videoWidth || !stage.clientWidth)return;
      const ratio=Math.min((stage.clientWidth-24)/video.videoWidth,(stage.clientHeight-24)/video.videoHeight);
      video.style.width=video.videoWidth*ratio+'px';video.style.height=video.videoHeight*ratio+'px';
      dialog.dataset.loading='false';positionCaption();return;
    }
    if(!dialog.open || !image.naturalWidth || !stage.clientWidth) return;
    const ratio=Math.min(Math.max(1,stage.clientWidth-24)/image.naturalWidth,Math.max(1,stage.clientHeight-24)/image.naturalHeight);
    fitWidth=image.naturalWidth*ratio; fitHeight=image.naturalHeight*ratio;
    image.style.width=fitWidth+'px'; image.style.height=fitHeight+'px';
    image.style.marginLeft=-fitWidth/2+'px'; image.style.marginTop=-fitHeight/2+'px';
    if(reset){zoom=1;x=0;y=0;}
    dialog.dataset.loading='false'; render();
  }
  function captionFor(link) {
    const figure=link?.closest('figure');
    return (figure?.querySelector('figcaption>span')?.textContent || figure?.querySelector('figcaption')?.textContent || link?.querySelector('img')?.alt || link?.textContent || labels[language()].view).replace(/\s*(Открыть|Open)\s*↗\s*$/,'').trim();
  }
  function localize() {
    const t=labels[language()];
    closeButton.setAttribute('aria-label',t.close);
    plus.setAttribute('aria-label',t.plus); minus.setAttribute('aria-label',t.minus);
    fitButton.textContent=t.fit; fitButton.setAttribute('aria-label',t.fit);
    prev.setAttribute('aria-label',t.prev);next.setAttribute('aria-label',t.next);
    stage.setAttribute('aria-label',t.view);
    if(dialog.open && trigger){
      caption.textContent=captionFor(trigger);
      video.setAttribute('aria-label',caption.textContent);
      if(kind==='image' && trigger.hasAttribute('data-dd-cjm') && image.hasAttribute('src') && image.src!==trigger.href){
        image.alt=trigger.querySelector('img').alt;
        dialog.dataset.loading='true';
        image.src=trigger.href;
      }
    }
    caption.setAttribute('title',caption.textContent);
    const board=document.querySelector('.dd-system-board');
    if(board) setTheme(board.dataset.systemTheme || 'light');
  }
  function stopVideo(){video.pause();video.removeAttribute('src');video.load();}
  function showMedia(position){
    stopVideo();image.removeAttribute('src');
    index=position;trigger=items[index];kind=isVideo(trigger)?'video':'image';
    zoom=1;x=0;y=0;pointers.clear();gesture=null;safariStart=null;
    dialog.dataset.kind=kind;dialog.dataset.dragging='false';
    image.hidden=kind!=='image';video.hidden=kind!=='video';
    dialog.dataset.loading='true';
    prev.hidden=next.hidden=count.hidden=items.length<2;
    prev.disabled=index===0;next.disabled=index===items.length-1;
    count.textContent=`${index+1} / ${items.length}`;
    caption.textContent=captionFor(trigger);
    captionLine.scrollLeft=0;
    image.alt=trigger.querySelector('img')?.alt || caption.textContent;
    localize();
    if(kind==='video'){
      video.loop=trigger.hasAttribute('data-dd-loop');
      video.src=trigger.href;video.defaultPlaybackRate=1;video.playbackRate=1;
      video.play().catch(()=>{});
    }else{
      image.src=trigger.href;
      if(image.complete && image.naturalWidth)fitImage(true);
    }
  }
  function open(link) {
    originTrigger=link;
    const group=link.closest('[data-dd-gallery]');
    const seen=new Set();
    items=(group?[...group.querySelectorAll('a[href]')]:[link]).filter(candidate=>{
      if(!isMedia(candidate)||seen.has(candidate.href))return false;
      seen.add(candidate.href);return true;
    });
    const position=items.findIndex(candidate=>candidate.href===link.href);
    if(!dialog.open){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();}
    showMedia(Math.max(0,position));
    closeButton.focus({preventScroll:true});
  }
  function navigate(delta){const target=index+delta;if(target>=0&&target<items.length)showMedia(target);}
  prev.addEventListener('click',()=>navigate(-1));next.addEventListener('click',()=>navigate(1));
  function close(){if(dialog.open){video.pause();dialog.close();}}
  dialog.addEventListener('close',()=>{
    document.body.style.overflow=previousOverflow;
    pointers.clear();gesture=null;safariStart=null;
    dialog.dataset.dragging='false';
    image.removeAttribute('src');
    stopVideo();originTrigger?.focus({preventScroll:true});
  });
  image.addEventListener('load',()=>{if(kind==='image')fitImage(true);});
  video.addEventListener('loadedmetadata',()=>fitImage(true));
  const mediaError=()=>{if(dialog.open)caption.textContent=labels[language()].error;};
  image.addEventListener('error',()=>{if(kind==='image'&&image.hasAttribute('src'))mediaError();});
  video.addEventListener('error',()=>{if(kind==='video'&&video.hasAttribute('src'))mediaError();});
  closeButton.addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  plus.addEventListener('click',()=>zoomAt(zoom*1.35));
  minus.addEventListener('click',()=>zoomAt(zoom/1.35));
  fitButton.addEventListener('click',()=>{zoom=1;x=0;y=0;render();});

  function beginGesture() {
    const points=[...pointers.values()];
    if(points.length>=2){
      multi=true;
      const a=points[0],b=points[1];
      gesture={kind:'pinch',distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,zoom,x,y};
    }else if(points.length===1){gesture={kind:'pan',point:points[0],x,y};}
    else gesture=null;
  }
  stage.addEventListener('pointerdown',event=>{
    if(onVideo(event.target))return;
    if(event.pointerType==='mouse' && event.button!==0)return;
    if(pointers.size===0){moved=false;multi=false;beganOnImage=event.target===image;}
    pointers.set(event.pointerId,point(event));
    stage.setPointerCapture(event.pointerId);
    beginGesture(); event.preventDefault();
  });
  stage.addEventListener('pointermove',event=>{
    if(!pointers.has(event.pointerId))return;
    const p=point(event);pointers.set(event.pointerId,p);
    const points=[...pointers.values()];
    if(gesture?.kind==='pinch' && points.length>=2){
      const a=points[0],b=points[1],cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
      const next=clamp(gesture.zoom*Math.hypot(a.x-b.x,a.y-b.y)/gesture.distance,1,8);
      const factor=next/gesture.zoom;
      x=cx-(gesture.cx-gesture.x)*factor;y=cy-(gesture.cy-gesture.y)*factor;zoom=next;
      moved=true;render();
    }else if(gesture?.kind==='pan'){
      const dx=p.x-gesture.point.x,dy=p.y-gesture.point.y;
      if(Math.hypot(dx,dy)>5)moved=true;
      if(zoom>1){x=gesture.x+dx;y=gesture.y+dy;dialog.dataset.dragging=String(moved);render();}
    }
    event.preventDefault();
  });
  function endPointer(event,cancel=false) {
    if(!pointers.has(event.pointerId))return;
    const p=point(event);
    const tap=!cancel && !moved && !multi && pointers.size===1;
    const swipe=!cancel && !multi && moved && kind==='image' && zoom===1 && beganOnImage && event.pointerType==='touch' && gesture?.kind==='pan' && Math.abs(p.x-gesture.point.x)>55 && Math.abs(p.y-gesture.point.y)<Math.abs(p.x-gesture.point.x)*.6;
    const swipeDirection=swipe && p.x<gesture.point.x?1:-1;
    pointers.delete(event.pointerId);
    if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
    dialog.dataset.dragging='false';
    if(tap){
      if(beganOnImage)zoomAt(zoom>1?1:2.5,p.x,p.y);
      else close();
    }
    if(swipe)navigate(swipeDirection);
    beginGesture();
  }
  stage.addEventListener('pointerup',event=>endPointer(event));
  stage.addEventListener('pointercancel',event=>endPointer(event,true));
  stage.addEventListener('lostpointercapture',event=>endPointer(event,true));
  stage.addEventListener('wheel',event=>{
    if(kind==='video')return;
    event.preventDefault();
    const p=point(event);
    if(event.ctrlKey || event.metaKey)zoomAt(zoom*Math.exp(-event.deltaY*.012),p.x,p.y);
    else if(zoom>1){x-=event.deltaX;y-=event.deltaY;render();}
  },{passive:false});
  // Safari trackpad fallback; two touch pointers are handled above.
  stage.addEventListener('gesturestart',event=>{if(kind==='video')return;event.preventDefault();if(pointers.size<2)safariStart={zoom,x,y};});
  stage.addEventListener('gesturechange',event=>{
    event.preventDefault();if(!safariStart || pointers.size>=2)return;
    zoomAt(safariStart.zoom*event.scale);
  });
  stage.addEventListener('gestureend',event=>{event.preventDefault();safariStart=null;});
  dialog.addEventListener('keydown',event=>{
    if(captionLine.contains(event.target))return;
    if(onVideo(event.target))return;
    if(zoom===1 && items.length>1 && ['ArrowLeft','ArrowRight'].includes(event.key)){
      event.preventDefault();navigate(event.key==='ArrowRight'?1:-1);return;
    }
    if(kind==='video')return;
    if(['+','=','Add'].includes(event.key)){event.preventDefault();zoomAt(zoom*1.35);}
    else if(['-','_','Subtract'].includes(event.key)){event.preventDefault();zoomAt(zoom/1.35);}
    else if(event.key==='0'){event.preventDefault();zoom=1;x=0;y=0;render();}
    else if(zoom>1 && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      event.preventDefault();x+=event.key==='ArrowLeft'?60:event.key==='ArrowRight'?-60:0;y+=event.key==='ArrowUp'?60:event.key==='ArrowDown'?-60:0;render();
    }
  });
  new ResizeObserver(()=>fitImage(false)).observe(stage);
  function setTheme(theme) {
    const board=document.querySelector('.dd-system-board');if(!board)return;
    board.dataset.systemTheme=theme;
    board.querySelectorAll('[data-dd-theme]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ddTheme===theme)));
  }
  document.addEventListener('click',event=>{
    const theme=event.target.closest('[data-dd-theme]');
    if(theme){setTheme(theme.dataset.ddTheme);return;}
    const sample=event.target.closest('[data-dd-sample]');
    if(sample){sample.setAttribute('aria-pressed',String(sample.getAttribute('aria-pressed')!=='true'));return;}
    const link=event.target.closest('.dd-case-section a[href]');
    if(!isMedia(link) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
    event.preventDefault();open(link);
  });
  new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  localize();
})();
