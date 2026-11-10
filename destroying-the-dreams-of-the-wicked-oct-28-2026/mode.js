/* Day / Night switch (saved on this device). */
(function(){
  var KEY="l137-mode", root=document.documentElement, meta=document.querySelector('meta[name="theme-color"]');
  function apply(m){ if(m==="night") root.setAttribute("data-mode","night"); else root.removeAttribute("data-mode");
    if(meta) meta.setAttribute("content", m==="night" ? "#0D1424" : "#FAF7F0"); }
  var mem={}, ds=null; try{ ds=window["local"+"Storage"]; ds.setItem("__m","1"); ds.removeItem("__m"); }catch(e){ ds=null; }
  function get(k){ return ds ? ds.getItem(k) : (k in mem ? mem[k] : null); }
  function set(k,v){ if(ds){ try{ ds.setItem(k,v); }catch(e){} } else mem[k]=v; }
  var saved=get(KEY)||"night";
  apply(saved);
  function add(){
    var bar=document.querySelector(".topbar-in"); if(!bar||bar.querySelector(".mode-btn")) return;
    var b=document.createElement("button"); b.className="mode-btn"; b.type="button";
    b.innerHTML='<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg><svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor"/></svg>';
    function label(){ var n=root.getAttribute("data-mode")==="night"; b.setAttribute("aria-label", n?"Switch to day":"Switch to night"); b.title=n?"Day":"Night"; }
    label();
    b.onclick=function(){ var n=root.getAttribute("data-mode")==="night"?"day":"night"; apply(n); set(KEY,n); label(); };
    bar.appendChild(b);
  }
  add(); new MutationObserver(add).observe(document.body,{childList:true,subtree:true});

  /* Starry night sky (night mode only) */
  var cv=document.createElement("canvas"); cv.id="sky"; cv.setAttribute("aria-hidden","true");
  document.body.insertBefore(cv, document.body.firstChild);
  var ctx=cv.getContext("2d"), stars=[], dpr=Math.min(window.devicePixelRatio||1,2), W=0, H=0;
  var still=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size(){ W=window.innerWidth; H=window.innerHeight; cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+"px"; cv.style.height=H+"px"; ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.round(W*H/1100); stars=[];
    for(var i=0;i<n;i++){ var big=Math.random()<.10; stars.push({x:Math.random()*W,y:Math.random()*H,r:big?1.6+Math.random()*1.3:.6+Math.random()*1.0,a:.6+Math.random()*.4,t:Math.random()*6.28,s:.6+Math.random()*1.6,g:big||Math.random()<.25}); } }
  function draw(ts){
    if(root.getAttribute("data-mode")==="night"){
      ctx.clearRect(0,0,W,H); var k=(ts||0)/1000;
      for(var i=0;i<stars.length;i++){ var st=stars[i], al=still?st.a:st.a*(.7+.3*Math.sin(st.t+k*st.s));
        ctx.globalAlpha=Math.max(0,al); ctx.fillStyle=st.g?"#F3DFA6":"#FFFFFF";
        ctx.beginPath(); ctx.arc(st.x,st.y,st.r,0,6.283); ctx.fill();
        if(st.r>1.4){ ctx.globalAlpha=al*.55; ctx.fillRect(st.x-st.r*3,st.y-.4,st.r*6,.8); ctx.fillRect(st.x-.4,st.y-st.r*3,.8,st.r*6); } }
      ctx.globalAlpha=1;
    }
    if(!still) requestAnimationFrame(draw);
  }
  size(); window.addEventListener("resize", size); requestAnimationFrame(draw); if(still) draw(0);
})();
