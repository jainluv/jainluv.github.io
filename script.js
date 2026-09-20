const menu = document.querySelector('.menu-button');
const nav = document.querySelector('.nav-links');

function closeMenu(){
  nav?.classList.remove('is-open');
  menu?.setAttribute('aria-expanded','false');
}

menu?.addEventListener('click',()=>{
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded',String(!open));
  nav?.classList.toggle('is-open',!open);
});

document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',event=>{
    const id=link.getAttribute('href');
    const target=id ? document.querySelector(id) : null;
    if(!target)return;
    event.preventDefault();
    closeMenu();
    if(id==='#about'){
      target.classList.remove('about-focus');
      void target.offsetWidth;
      target.classList.add('about-focus');
    }
    target.scrollIntoView({behavior:'smooth',block:'start'});
    history.replaceState(null,'',id);
  });
});

document.addEventListener('click',event=>{
  if(nav?.classList.contains('is-open') && !event.target.closest('.site-nav'))closeMenu();
});






// Lightweight original canvas space-fighter easter egg: no external assets.
(() => {
  const canvas = document.querySelector('#spaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const keys = new Set();
  const stars = Array.from({length: 55}, (_, i) => ({x:(i*47)%W,y:(i*71)%H,s:1+(i%3)*.45,v:.25+(i%4)*.12}));
  const shots = [], enemies = [];
  let shipX = W/2, frame = 0, score = 0;
  addEventListener('keydown', e => { keys.add(e.key.toLowerCase()); if(e.code==='Space') e.preventDefault(); });
  addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
  function spawnEnemy(){ enemies.push({x:18+Math.random()*(W-36),y:-12,r:5+Math.random()*4,v:.45+Math.random()*.8}); }
  function drawShip(){
    ctx.save(); ctx.translate(shipX,H-25); ctx.fillStyle='#e8e4db'; ctx.strokeStyle='#767b83'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,-13); ctx.lineTo(10,10); ctx.lineTo(3,7); ctx.lineTo(0,12); ctx.lineTo(-3,7); ctx.lineTo(-10,10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#d05b42'; ctx.fillRect(-2,10,4,7); ctx.restore();
  }
  function loop(){
    frame++; ctx.fillStyle='#151619'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(180,180,180,.07)'; ctx.lineWidth=1;
    for(let x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.fillStyle='#b8b5ad'; stars.forEach(st=>{st.y=(st.y+st.v)%H;ctx.globalAlpha=.25+(st.s/5);ctx.fillRect(st.x,st.y,st.s,st.s);}); ctx.globalAlpha=1;
    if(keys.has('arrowleft')||keys.has('a')) shipX-=2.8;
    if(keys.has('arrowright')||keys.has('d')) shipX+=2.8;
    if(shipX < -12) shipX = W + 12;
    if(shipX > W + 12) shipX = -12;
    if((keys.has(' ')||keys.has('space')) && frame%7===0) shots.push({x:shipX,y:H-40});
    if(frame%55===0) spawnEnemy();
    ctx.fillStyle='#d05b42'; shots.forEach(s=>{s.y-=4;ctx.fillRect(s.x-1,s.y,2,8);});
    enemies.forEach(e=>{e.y+=e.v;ctx.strokeStyle='#aaa49a';ctx.beginPath();ctx.moveTo(e.x,e.y-6);ctx.lineTo(e.x+7,e.y+5);ctx.lineTo(e.x,e.y+2);ctx.lineTo(e.x-7,e.y+5);ctx.closePath();ctx.stroke();});
    for(let i=enemies.length-1;i>=0;i--) for(let j=shots.length-1;j>=0;j--) if(Math.hypot(enemies[i].x-shots[j].x,enemies[i].y-shots[j].y)<10){enemies.splice(i,1);shots.splice(j,1);score++;break;}
    for(let i=enemies.length-1;i>=0;i--) if(enemies[i].y>H+15) enemies.splice(i,1);
    for(let i=shots.length-1;i>=0;i--) if(shots[i].y<-10) shots.splice(i,1);
    drawShip(); ctx.fillStyle='#c8c4bb';ctx.font='10px monospace';ctx.fillText(`${String(score).padStart(2,'0')} HITS`,8,13);
    requestAnimationFrame(loop);
  }
  loop();
})();

// V34: a small self-contained pixel arcade loop inside the CRT; no external assets.
(() => {
  const canvas = document.querySelector('#arcadeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  const W = canvas.width, H = canvas.height;
  const palette = {bg:'#090d17',grid:'#162033',cyan:'#62e6ff',pink:'#ff5ca8',yellow:'#ffd166',green:'#9bf6a5',white:'#f4f7f8',blue:'#6c8cff'};
  const stars = Array.from({length:34},(_,i)=>({x:(i*43)%W,y:(i*29)%H,s:i%3===0?2:1,v:.18+(i%4)*.08}));
  const enemies = Array.from({length:8},(_,i)=>({x:24+i*27,y:29+(i%2)*15,phase:i*.7,alive:true}));
  const shots=[];
  let frame=0,score=0,shipX=W/2,shipTarget=W/2,last=0;
  const pointer=(e)=>{const r=canvas.getBoundingClientRect();shipTarget=((e.clientX-r.left)/r.width)*W};
  canvas.addEventListener('pointermove',pointer,{passive:true});
  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
  function drawShip(){const y=H-22;rect(shipX-7,y,14,3,palette.white);rect(shipX-4,y-4,8,4,palette.cyan);rect(shipX-2,y-8,4,4,palette.yellow);rect(shipX-11,y+3,5,2,palette.pink);rect(shipX+6,y+3,5,2,palette.pink)}
  function drawEnemy(e,i){if(!e.alive)return;const x=e.x+Math.sin(frame*.025+e.phase)*4,y=e.y+Math.sin(frame*.04+e.phase)*2,c=[palette.pink,palette.green,palette.yellow,palette.blue][i%4];rect(x-7,y-4,14,3,c);rect(x-4,y-7,3,3,c);rect(x+2,y-7,3,3,c);rect(x-10,y,4,3,c);rect(x+6,y,4,3,c);rect(x-5,y+3,3,3,c);rect(x+2,y+3,3,3,c)}
  function loop(t){
    const dt=Math.min(32,t-(last||t));last=t;frame++;
    ctx.fillStyle=palette.bg;ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=.7;stars.forEach(s=>{s.y=(s.y+s.v*dt*.06)%H;rect(s.x,s.y,s.s,s.s,palette.white)});ctx.globalAlpha=1;
    for(let y=8;y<H;y+=12){ctx.fillStyle='rgba(255,255,255,.035)';ctx.fillRect(0,y,W,1)}
    for(let x=0;x<W;x+=16){ctx.fillStyle=palette.grid;ctx.fillRect(x,18,1,H-28)}
    shipX+=(Math.max(0,Math.min(W,shipTarget))-shipX)*.08;
    if(frame%24===0)shots.push({x:shipX,y:H-31});
    shots.forEach(s=>{s.y-=2.2;rect(s.x-1,s.y,2,6,palette.cyan)});
    enemies.forEach(drawEnemy);
    shots.forEach(s=>enemies.forEach(e=>{if(e.alive&&Math.abs(s.x-e.x)<10&&Math.abs(s.y-e.y)<9){e.alive=false;score++;s.y=-30}}));
    if(frame%150===0)enemies.forEach((e,i)=>{e.alive=true;e.x=24+i*27;e.y=29+(i%2)*15});
    if(frame%9===0)rect((frame*3)%W,H-9,2,2,palette.pink);
    drawShip();
    ctx.font='8px monospace';ctx.fillStyle=palette.white;ctx.fillText(`SCORE ${String(score%10000).padStart(4,'0')}`,8,10);
    ctx.fillStyle=palette.yellow;ctx.fillText('● LIVE',W-39,10);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// V36: compact arcade shooter — enemies advance, collisions cost lives, and the player can lose.
(() => {
  const launcher = document.querySelector('.crt-art');
  const modal = document.querySelector('#arcadeModal');
  const close = document.querySelector('#arcadeClose');
  const canvas = document.querySelector('#arcadeModalCanvas');
  const scoreEl = document.querySelector('#arcadeScore');
  if (!launcher || !modal || !close || !canvas || !scoreEl) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  const W = canvas.width, H = canvas.height;
  const keys = new Set();
  const stars = Array.from({length:110},(_,i)=>({x:(i*83)%W,y:(i*47)%H,s:i%5===0?3:1+ i%2,v:.35+(i%5)*.13}));
  const palette = {bg:'#080b11',line:'#222a34',white:'#eef2f2',cyan:'#6ee7f9',lime:'#b6ef75',orange:'#ffad5a',red:'#ff647c',violet:'#a99bff'};
  let running=false, raf=0, last=0, frame=0, score=0, lives=3, wave=1, gameOver=false;
  let player, bullets, enemyBullets, enemies, particles, spawnClock, fireClock, shake=0;
  let pointerX=W/2, pointerY=H-65, pointerActive=false;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const resetGame=()=>{
    score=0;lives=3;wave=1;gameOver=false;frame=0;last=0;shake=0;
    player={x:W/2,y:H-58,w:17,h:20,speed:4.5,invuln:0};
    bullets=[];enemyBullets=[];enemies=[];particles=[];spawnClock=0;fireClock=0;
    for(let i=0;i<4;i++) spawnEnemy(i, true);
    updateHud();
  };
  const updateHud=()=>{scoreEl.textContent=gameOver?`GAME OVER · ${score} PTS · CLICK TO RESTART`:`SCORE ${String(score).padStart(4,'0')} · LIVES ${'♥'.repeat(lives)} · WAVE ${wave}`;};
  const spawnEnemy=(index=0,formation=false)=>{
    const type=index%4;
    enemies.push({x:34+Math.random()*(W-68),y:formation?42+Math.floor(index/4)*38:-24,r:11+type%3*2,
      speed:formation?0.15:0.45+wave*.055+Math.random()*.35,phase:Math.random()*6.28,type,life:type===3?2:1,shoot:70+Math.random()*120,drift:Math.random()>.5?1:-1});
  };
  const burst=(x,y,color,count=10)=>{for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,v=.6+Math.random()*2.8;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:18+Math.random()*22,color});}};
  const fire=()=>{if(gameOver){resetGame();return;} if(fireClock<=0){bullets.push({x:player.x,y:player.y-18,vy:8});fireClock=8;}};
  const hitPlayer=()=>{
    if(player.invuln>0||gameOver)return;
    lives--;player.invuln=85;shake=9;burst(player.x,player.y,palette.red,24);updateHud();
    if(lives<=0){gameOver=true;burst(player.x,player.y,palette.orange,40);}
  };
  const movePlayer=()=>{
    let dx=0,dy=0;
    if(keys.has('arrowleft')||keys.has('a'))dx-=1;
    if(keys.has('arrowright')||keys.has('d'))dx+=1;
    if(keys.has('arrowup')||keys.has('w'))dy-=1;
    if(keys.has('arrowdown')||keys.has('s'))dy+=1;
    if(pointerActive){player.x+=(pointerX-player.x)*.12;player.y+=(pointerY-player.y)*.12;}
    player.x=clamp(player.x+dx*player.speed,18,W-18);player.y=clamp(player.y+dy*player.speed,45,H-25);
  };
  const drawShip=()=>{
    if(player.invuln>0 && Math.floor(frame/5)%2===0)return;
    ctx.save();ctx.translate(player.x,player.y);
    ctx.fillStyle=palette.white;ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(13,12);ctx.lineTo(4,8);ctx.lineTo(0,15);ctx.lineTo(-4,8);ctx.lineTo(-13,12);ctx.closePath();ctx.fill();
    ctx.fillStyle=palette.cyan;ctx.fillRect(-4,-6,8,10);ctx.fillStyle=palette.orange;ctx.fillRect(-3,12,6,7);ctx.fillStyle=palette.violet;ctx.fillRect(-15,7,5,4);ctx.fillRect(10,7,5,4);ctx.restore();
  };
  const drawEnemy=(e)=>{
    const c=[palette.red,palette.lime,palette.orange,palette.violet][e.type];
    ctx.save();ctx.translate(e.x,e.y);ctx.rotate(Math.sin(frame*.02+e.phase)*.15);ctx.fillStyle=c;
    ctx.fillRect(-e.r,-4,e.r*2,8);ctx.fillRect(-e.r+4,-9,5,5);ctx.fillRect(e.r-9,-9,5,5);ctx.fillRect(-e.r-5,2,5,5);ctx.fillRect(e.r,2,5,5);ctx.fillStyle=palette.bg;ctx.fillRect(-5,-2,3,3);ctx.fillRect(2,-2,3,3);ctx.restore();
  };
  const loop=(time)=>{
    if(!running)return; const dt=Math.min(32,time-(last||time));last=time;frame++;spawnClock-=dt;fireClock-=dt/16.67;
    ctx.save(); if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.88;}
    ctx.fillStyle=palette.bg;ctx.fillRect(0,0,W,H);
    stars.forEach(s=>{s.y=(s.y+s.v*dt*.06)%H;ctx.fillStyle='rgba(220,232,239,.5)';ctx.fillRect(s.x,s.y,s.s,s.s);});
    for(let y=0;y<H;y+=18){ctx.fillStyle='rgba(255,255,255,.035)';ctx.fillRect(0,y,W,1);}
    if(!gameOver){
      movePlayer();
      if(keys.has(' ')||keys.has('space'))fire();
      if(fireClock<=0 && frame%18===0)fire();
      if(spawnClock<=0){spawnEnemy();spawnClock=Math.max(260-wave*12,440);}
      enemies.forEach(e=>{
        e.y+=e.speed*dt*.06;e.x+=Math.sin(frame*.018+e.phase)*.25*e.drift;
        e.shoot-=dt/16.67;
        if(e.shoot<=0){enemyBullets.push({x:e.x,y:e.y+10,vy:1.5+wave*.08});e.shoot=120+Math.random()*180;}
      });
      bullets.forEach(b=>b.y-=b.vy*dt*.06);
      enemyBullets.forEach(b=>b.y+=b.vy*dt*.06);
      for(let i=bullets.length-1;i>=0;i--){const b=bullets[i];if(b.y<-20){bullets.splice(i,1);continue;}for(let j=enemies.length-1;j>=0;j--){const e=enemies[j];if(Math.hypot(b.x-e.x,b.y-e.y)<e.r+5){bullets.splice(i,1);e.life--;burst(e.x,e.y,[palette.red,palette.lime,palette.orange,palette.violet][e.type],7);if(e.life<=0){score+=10+wave;enemies.splice(j,1);if(score>0&&score%100<12)wave++;updateHud();}break;}}}
      for(let i=enemyBullets.length-1;i>=0;i--){const b=enemyBullets[i];if(b.y>H+20){enemyBullets.splice(i,1);continue;}if(Math.hypot(b.x-player.x,b.y-player.y)<13){enemyBullets.splice(i,1);hitPlayer();}}
      for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(e.y>H+20||Math.hypot(e.x-player.x,e.y-player.y)<e.r+10){enemies.splice(i,1);hitPlayer();}}
      if(player.invuln>0)player.invuln-=1;
    }
    bullets.forEach(b=>{ctx.fillStyle=palette.cyan;ctx.fillRect(b.x-2,b.y-10,4,13);ctx.fillStyle=palette.white;ctx.fillRect(b.x-1,b.y-13,2,4);});
    enemyBullets.forEach(b=>{ctx.fillStyle=palette.orange;ctx.fillRect(b.x-2,b.y-5,4,9);});
    enemies.forEach(drawEnemy);
    particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life--;ctx.globalAlpha=Math.max(0,p.life/35);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,3,3);});ctx.globalAlpha=1;
    particles=particles.filter(p=>p.life>0);
    drawShip();
    ctx.fillStyle=palette.white;ctx.font='12px monospace';ctx.fillText(gameOver?'SYSTEM DOWN — PRESS SPACE OR CLICK':`WAVE ${wave}`,12,20);
    ctx.restore();
    raf=requestAnimationFrame(loop);
  };
  const openGame=()=>{running=true;modal.hidden=false;modal.setAttribute('aria-hidden','false');resetGame();close.focus();if(!raf)raf=requestAnimationFrame(loop);};
  const closeGame=()=>{running=false;modal.hidden=true;modal.setAttribute('aria-hidden','true');if(raf)cancelAnimationFrame(raf);raf=0;};
  const point=(e)=>{const r=canvas.getBoundingClientRect();pointerX=((e.clientX-r.left)/r.width)*W;pointerY=((e.clientY-r.top)/r.height)*H;pointerActive=true;};
  launcher.addEventListener('click',openGame);
  close.addEventListener('click',closeGame);
  modal.addEventListener('click',e=>{if(e.target===modal)closeGame();});
  canvas.addEventListener('pointermove',point,{passive:true});
  canvas.addEventListener('pointerdown',e=>{e.preventDefault();point(e);fire();});
  window.addEventListener('keydown',e=>{
    if(!running)return;
    if(e.key==='Escape'){closeGame();return;}
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s',' '].includes(e.key)){e.preventDefault();keys.add(e.key.toLowerCase());}
    if(gameOver&&e.code==='Space'){e.preventDefault();resetGame();}
  });
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
})();
