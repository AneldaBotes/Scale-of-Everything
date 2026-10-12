(function(){
const TAU=Math.PI*2, K=7;
const cv=document.getElementById('zoom'), mainC=cv.getContext('2d');
let c=mainC;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mod=(a,n)=>((a%n)+n)%n;
const col=(h,l,a)=>`hsla(${h},85%,${l}%,${a})`;
const ink=(h,a=1)=>`hsla(${h},85%,74%,${a})`;
function rngOf(seed){let a=seed*9301+49297;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function disk(r,n,R,minR=0){const o=[];while(o.length<n){const a=r()*TAU,d=Math.sqrt(r())*R;if(d<minR)continue;o.push([Math.cos(a)*d,Math.sin(a)*d,r()])}return o}
function spaced(r,n,R,gap,first){const o=first?[first]:[];let t=0;while(o.length<n&&t++<8000){const p=disk(r,1,R)[0];if(o.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<gap))continue;o.push(p)}return o}
function blob(r,n,R,j,cx=0,cy=0){const p=[r()*TAU,r()*TAU,r()*TAU],o=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+j*(.5*Math.sin(a*3+p[0])+.3*Math.sin(a*5+p[1])+.2*Math.sin(a*9+p[2]));o.push([cx+Math.cos(a)*R*k,cy+Math.sin(a)*R*k])}return o}
function poly(pts,close=true){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));if(close)c.closePath()}
function circ(x,y,r){c.beginPath();c.arc(x,y,r,0,TAU)}
function ball(x,y,r,h,s=70,l=55){const g=c.createRadialGradient(x-r*.35,y-r*.4,r*.05,x,y,r);g.addColorStop(0,`hsl(${h},${s}%,${Math.min(97,l+36)}%)`);g.addColorStop(.42,`hsl(${h},${s}%,${l}%)`);g.addColorStop(1,`hsl(${h},${s}%,${Math.round(l*.3)}%)`);c.fillStyle=g;circ(x,y,r);c.fill()}
function neon(w,px,h,l,a){c.lineWidth=w*5*px;c.strokeStyle=col(h,l,a*.1);c.stroke();c.lineWidth=w*2.4*px;c.strokeStyle=col(h,l,a*.25);c.stroke();c.lineWidth=w*px;c.strokeStyle=col(h,Math.min(95,l+18),a);c.stroke()}
function sq(x,y,s,st){c.fillStyle=st;c.fillRect(x-s/2,y-s/2,s,s)}
function pen(w,px,st){c.lineWidth=w*px;c.strokeStyle=st}
function glow(x,y,r,h,l=70,a=.6){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col(h,l,a));g.addColorStop(1,col(h,l,0));c.fillStyle=g;circ(x,y,r);c.fill()}
function label(x,y,txt,px,st,size=15,align='left'){c.save();c.scale(px,px);c.font=`${size}px "Patrick Hand", cursive`;c.fillStyle=st;c.textAlign=align;c.textBaseline='middle';c.fillText(txt,x/px,y/px);c.restore()}
function spiral(x,y,R,rot,turns=1.6){c.beginPath();for(let k=0;k<=30;k++){const a=rot+k/30*turns*TAU,rr=R*k/30;k?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x,y)}}
function capsule(x,y,l,w,rot){c.save();c.translate(x,y);c.rotate(rot);c.beginPath();c.roundRect(-l/2,-w/2,l,w,w/2);c.restore()}
function house(x,y,s){c.beginPath();c.rect(x-s/2,y-s*.1,s,s*.6);c.moveTo(x-s*.62,y-s*.08);c.lineTo(x,y-s*.62);c.lineTo(x+s*.62,y-s*.08)}
function person(x,foot,h){const top=foot-h;circ(x,top+h*.12,h*.12);c.stroke();c.beginPath();c.roundRect(x-h*.14,top+h*.27,h*.28,h*.38,h*.08);c.moveTo(x-h*.14,top+h*.32);c.lineTo(x-h*.26,top+h*.6);c.moveTo(x+h*.14,top+h*.32);c.lineTo(x+h*.26,top+h*.6);c.moveTo(x-h*.07,top+h*.65);c.lineTo(x-h*.09,foot);c.moveTo(x+h*.07,top+h*.65);c.lineTo(x+h*.09,foot);c.stroke()}
function body(){circ(0,-.7,.15);c.stroke();c.beginPath();c.roundRect(-.24,-.5,.48,.82,.12);c.moveTo(-.24,-.42);c.lineTo(-.48,.22);c.moveTo(.24,-.42);c.lineTo(.48,.22);c.moveTo(-.11,.32);c.lineTo(-.16,.95);c.moveTo(.11,.32);c.lineTo(.16,.95);c.stroke()}
function tree(r,roots,depth=6){const S=[...Array(depth+1)].map(()=>[]);function br(x,y,a,l,d){const x2=x+Math.cos(a)*l,y2=y+Math.sin(a)*l;S[d].push([x,y,x2,y2]);if(d<depth){const n=r()<.2?3:2;for(let i=0;i<n;i++)br(x2,y2,a+(i-(n-1)/2)*(.5+r()*.3),l*(.66+r()*.1),d+1)}}roots.forEach(q=>br(...q,0));return S}
function drawTree(S,t,px,h){S.forEach((seg,dp)=>{pen(Math.max(1,3-dp*.42),px,col(h+dp*4,68,.4+.45*Math.max(0,Math.sin(t*3-dp))));c.beginPath();for(const s of seg){c.moveTo(s[0],s[1]);c.lineTo(s[2],s[3])}c.stroke()})}

/* ---------- the levels ----------
   m = log10 of size in metres (null = unknown). img = optional photo (square, the next level at its centre). */
const LV=[
{n:'Multiverse',m:null,h:275,img:'img/multiverse.webp',focus:[.086,-.047],credit:'Image: multiverse illustration',cap:'A hypothesis: our universe may be one of many.',size:'unknown, maybe infinite',
 info:'Some theories, such as eternal inflation and the many-worlds view of quantum physics, suggest our universe may be one of many, each perhaps with its own laws of physics. No other universe has ever been observed, so this level is an idea rather than a measurement.',
 init(r){const b=[];let t=0;while(b.length<46&&t++<4000){const a=r()*TAU,d=Math.sqrt(r())*.93,x=Math.cos(a)*d,y=Math.sin(a)*d,s=.03+r()*r()*.11;if(d<.24+s||d+s>.97)continue;if(b.some(o=>Math.hypot(o.x-x,o.y-y)<o.s+s+.015))continue;b.push({x,y,s,hh:r()*80-40,sp:r()-.5})}return{b,dust:disk(r,160,.98)}},
 draw(d,t,px,h){for(const p of d.dust)sq(p[0],p[1],1.5*px,col(h,80,.2+p[2]*.4));
  for(const o of d.b){glow(o.x,o.y,o.s*1.3,h+o.hh,60,.18);pen(1.2,px,col(h+o.hh,72,.85));circ(o.x,o.y,o.s);c.stroke();pen(1,px,col(h+o.hh,72,.45));spiral(o.x,o.y,o.s*.75,t*o.sp);c.stroke()}
  pen(1.5,px,col(h,82,.9));circ(0,0,.15);c.stroke();spiral(0,0,.11,t*.3);c.stroke()}},
{n:'Universe',m:26.9,h:268,img:'img/universe.webp',focus:[0,0],credit:'Image: 2MASS all-sky map of 1.6 million galaxies, T. H. Jarrett (IPAC/Caltech)',cap:'The observable universe: everything whose light has had time to reach us.',size:'93 billion light-years',
 info:'The universe is about 13.8 billion years old. Space has kept expanding while light travelled to us, so the edge of what we can see is now about 46 billion light-years away in every direction. It holds hundreds of billions of galaxies, perhaps up to two trillion. This map shows about 1.6 million of the nearest ones across the whole sky, with our Milky Way as the bright band across the middle. Because light reaches us from every direction, each observer sits at the centre of their own observable universe.',
 init(r){const p=disk(r,170,.96),e=[];p.forEach((a,i)=>{const s=p.map((b,j)=>[Math.hypot(a[0]-b[0],a[1]-b[1]),j]).sort((x,y)=>x[0]-y[0]);e.push([i,s[1][1]],[i,s[2][1]])});return{p,e}},
 draw(d,t,px,h){pen(1,px,col(h,72,.28));c.beginPath();for(const[i,j]of d.e){c.moveTo(d.p[i][0],d.p[i][1]);c.lineTo(d.p[j][0],d.p[j][1])}c.stroke();
  d.p.forEach((p,i)=>{if(p[2]>.88)glow(p[0],p[1],.03,h+40,70,.35);sq(p[0],p[1],(p[2]>.88?3.5:1.8)*px,col(h+(p[2]>.88?40:0),82,.55+.45*Math.sin(t*2+i)))});
  c.setLineDash([4*px,6*px]);pen(1,px,col(h,72,.35));circ(0,0,.985);c.stroke();c.setLineDash([])}},
{n:'Supercluster Complex',m:25,h:258,cap:'Pisces–Cetus: a filament of galaxies in the cosmic web.',size:'about 1 billion light-years long',
 info:'Galaxies are not spread evenly. They gather along vast filaments and walls around huge empty voids, a pattern called the cosmic web. The Pisces–Cetus Supercluster Complex is one of these filaments, and our own supercluster is part of it.',
 init(r){const cv=[],dots=[];for(let f=0;f<7;f++){const a=r()*TAU,a2=a+(r()-.5)*2,p0=[Math.cos(a)*.98,Math.sin(a)*.98],p2=[Math.cos(a2)*.1,Math.sin(a2)*.1],cp=[(r()-.5)*1.1,(r()-.5)*1.1];cv.push([p0,cp,p2]);
  for(let i=0;i<70;i++){const u=r(),x=(1-u)*(1-u)*p0[0]+2*(1-u)*u*cp[0]+u*u*p2[0],y=(1-u)*(1-u)*p0[1]+2*(1-u)*u*cp[1]+u*u*p2[1],g=(r()+r()+r()-1.5)*.05;dots.push([x+g,y+(r()-.5)*.06,r()])}}return{cv,dots,bg:disk(r,80,.98)}},
 draw(d,t,px,h){pen(8,px,col(h,60,.1));for(const[a,b,e]of d.cv){c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(b[0],b[1],e[0],e[1]);c.stroke()}
  for(const p of d.bg)sq(p[0],p[1],1.5*px,col(h,72,.25));for(const p of d.dots)sq(p[0],p[1],(p[2]>.9?3:1.8)*px,col(h+(p[2]>.9?30:0),80,.5+p[2]*.5))}},
{n:'Galactic Supercluster',m:24.7,h:250,img:'img/supercluster.webp',focus:[.676,.019],credit:'Image: Laniakea flow map, Nature Video (Tully et al., 2014)',cap:'Laniakea, our home supercluster, holds about 100,000 galaxies.',size:'520 million light-years',
 info:'Laniakea, Hawaiian for "immeasurable heaven", was mapped in 2014 by tracking how galaxies move rather than where they sit. Its galaxies all drift toward a region called the Great Attractor, like rivers flowing to one valley. The Milky Way lies near its outer edge.',
 init(r){const L=[];for(let i=0;i<44;i++){let a=i/44*TAU+r()*.1,d=.98;const cu=.6+r()*.6,p=[];while(d>.03){p.push([Math.cos(a)*d,Math.sin(a)*d]);d*=.93;a+=.06*cu+(r()-.5)*.05}L.push(p)}return{L}},
 draw(d,t,px,h){pen(1,px,col(h,72,.35));d.L.forEach((p,i)=>{poly(p,false);c.stroke();const q=p[Math.floor((t*6+i*7)%p.length)];sq(q[0],q[1],3*px,col(h+30,86,.95))})}},
{n:'Galactic Cluster',m:22.9,h:242,img:'img/cluster.webp',focus:[-.515,-.274],credit:'Image: Andromeda and a spiral galaxy',cap:'The Local Group: the Milky Way, Andromeda and many smaller galaxies.',size:'about 10 million light-years',
 info:'Gravity binds galaxies into groups and clusters. Our Local Group holds more than 80 galaxies, dominated by the Milky Way and Andromeda, which will merge in a few billion years. The nearby Virgo Cluster is far bigger, with more than 1,300 galaxies.',
 init(r){const g=[];let tr=0;while(g.length<100&&tr++<3000){const a=r()*TAU,d=.95*Math.pow(r(),.75);if(d<.19)continue;g.push({x:Math.cos(a)*d,y:Math.sin(a)*d,s:.008+r()*r()*r()*.05,e:.3+r()*.6,rot:r()*TAU,sp:r()<.35})}return{g}},
 draw(d,t,px,h){for(const o of d.g){if(o.s>.025)glow(o.x,o.y,o.s*1.6,h+20,70,.25);pen(1.2,px,col(h+(o.sp?20:-10),76,.8));c.beginPath();c.ellipse(o.x,o.y,o.s,o.s*o.e,o.rot,0,TAU);c.stroke();if(o.sp&&o.s>.02){pen(1,px,col(h+20,80,.5));spiral(o.x,o.y,o.s*.8,o.rot+t*.1);c.stroke()}}}},
{n:'Galaxy',m:21,h:232,img:'img/galaxy.webp',focus:[.45,-.35],credit:'Photo: the Milky Way from Earth',cap:'The Milky Way, seen from inside: 100 to 400 billion stars.',size:'100,000 light-years',
 info:'The Milky Way is a barred spiral galaxy. A supermassive black hole, Sagittarius A*, sits at its centre. The Sun lies about 26,000 light-years out, in a small arm called the Orion Spur, and takes about 230 million years to circle the galaxy once.',
 init(r){const s=[];for(let i=0;i<1500;i++){const k=r()<.5?0:Math.PI,u=r(),rr=.04+u*.82;s.push([rr+(r()-.5)*.05,k+2.4*Math.log(rr/.04)+(r()-.5)*.55,r()])}for(let i=0;i<260;i++){const rr=Math.abs(r()+r()-1)*.12;s.push([rr,r()*TAU,r()])}return{s}},
 draw(d,t,px,h){const gx=-.42,gy=.18,rot=t*.015;glow(gx,gy,.3,h+40,75,.5);glow(gx,gy,.09,50,85,.6);
  for(const p of d.s){const a=p[1]+rot;sq(gx+Math.cos(a)*p[0],gy+Math.sin(a)*p[0]*.82,(p[2]>.95?2.6:1.5)*px,col(h+(p[2]>.8?-40:0),75+p[2]*15,.35+p[2]*.6))}}},
{n:'Stellar Neighbourhood',m:17.3,h:222,img:'img/stars.webp',focus:[0,0],credit:'Image: star chart of the northern sky',cap:'Our sky\'s stars. The nearest, Proxima Centauri, is 4.2 light-years away.',size:'about 20 light-years',
 info:'Within about 12 light-years of the Sun there are only around 20 star systems. The closest, Proxima Centauri, is part of the Alpha Centauri system; its light takes 4.2 years to reach us. The fastest spacecraft we have launched would need thousands of years to get there. The stars in a constellation only look close together from Earth: most are not neighbours at all, but lie at very different distances behind one another.',
 init(r){const S=[["Alpha Centauri",4.37,.4],["Barnard's Star",5.96,2.1],["Wolf 359",7.86,3.05],["Lalande 21185",8.31,3.7],["Sirius",8.6,5.15],["Luyten 726-8",8.73,4.35],["Ross 154",9.69,1.35],["Epsilon Eridani",10.5,5.75],["Procyon",11.4,.95],["Tau Ceti",11.9,4.85]];return{S,dust:disk(r,220,1)}},
 draw(d,t,px,h){for(const p of d.dust)sq(p[0],p[1],1.4*px,col(h,85,.12+p[2]*.3));
  c.setLineDash([3*px,6*px]);pen(1,px,col(h,72,.3));for(const ly of[4,8,12]){circ(0,0,ly/12.6);c.stroke();label(ly/12.6*Math.cos(-.9)+.01,ly/12.6*Math.sin(-.9),ly+' ly',px,col(h,80,.5),13)}c.setLineDash([]);
  for(const[nm,ly,a]of d.S){const x=Math.cos(a)*ly/12.6,y=Math.sin(a)*ly/12.6,big=nm==='Sirius'||nm==='Procyon';glow(x,y,big?.06:.035,big?200:30,80,.6);c.fillStyle='rgba(255,250,235,.95)';circ(x,y,(big?3:2)*px);c.fill();label(x+.025,y,nm,px,col(h,85,.85),14)}
  glow(0,0,.05,50,80,.8)}},
{n:'Star System',m:13,h:215,img:'img/solar-system.webp',focus:[.077,-.221],credit:'Image: illustration of the Sun and planets (not to scale)',cap:'The Sun and its planets. Neptune orbits 4.5 billion km out.',size:'about 9 billion km',
 info:'Eight planets orbit the Sun, which holds 99.8% of all the mass in the solar system. Sunlight takes about 8 minutes to reach Earth and over 4 hours to reach Neptune. Beyond the planets, the icy Oort Cloud may stretch a light-year or more.',
 init(r){return{ph:[...Array(8)].map(()=>r()*TAU)}},
 draw(d,t,px,h){const sx=-.6,O=[.2,.38,.6,.82,1.12,1.4,1.68,1.95],S=[.018,.028,.034,.024,.07,.058,.042,.042];
  c.setLineDash([3*px,5*px]);pen(1,px,col(h,72,.35));for(const o of O){circ(sx,0,o);c.stroke()}c.setLineDash([]);
  glow(sx,0,.3,40,60,.45);glow(sx,0,.12,50,85,1);
  O.forEach((o,i)=>{const a=i==2?0:d.ph[i]+t*.35/Math.pow(o,1.5),x=sx+Math.cos(a)*o,y=Math.sin(a)*o;c.fillStyle=col(h+i*25,i==2?72:62,1);circ(x,y,S[i]);c.fill();if(i==5){pen(1.3,px,col(45,75,.8));c.beginPath();c.ellipse(x,y,S[i]*1.9,S[i]*.55,-.3,0,TAU);c.stroke()}})}},
{n:'Earth & Moon',m:8.9,h:210,cap:'The Moon orbits 384,400 km away, about 30 Earths.',size:'770,000 km',
 info:'Light crosses the gap between Earth and the Moon in about 1.3 seconds. The Moon always shows us the same face, and it is slowly drifting away, by about 3.8 cm a year. Its gravity drives most of Earth\'s ocean tides.',
 init(r){return{dust:disk(r,120,1)}},
 draw(d,t,px,h){for(const p of d.dust)sq(p[0],p[1],1.3*px,col(h,85,.1+p[2]*.25));
  const g=c.createLinearGradient(0,0,1,0);g.addColorStop(0,col(h,60,.12));g.addColorStop(1,col(h,60,0));c.fillStyle=g;c.beginPath();c.moveTo(0,-.035);c.lineTo(1,-.01);c.lineTo(1,.01);c.lineTo(0,.035);c.fill();
  c.setLineDash([3*px,6*px]);pen(1,px,col(h,72,.4));circ(0,0,.8);c.stroke();c.setLineDash([]);
  const a=t*.08-1,mx=Math.cos(a)*.8,my=Math.sin(a)*.8;pen(1,px,col(h,80,.35));c.beginPath();c.moveTo(0,0);c.lineTo(mx,my);c.stroke();label(mx*.5+.02,my*.5-.03,'384,400 km',px,col(h,85,.75),14);
  glow(mx,my,.05,60,85,.4);c.fillStyle='#d9d4c8';circ(mx,my,.022);c.fill();c.fillStyle='rgba(7,6,15,.55)';c.beginPath();c.arc(mx,my,.022,-Math.PI/2,Math.PI/2);c.fill();
  glow(0,0,.08,h,70,.6);c.fillStyle=col(h,60,1);circ(0,0,.035);c.fill();label(-.95,-.88,'← sunlight',px,col(50,85,.7),15)}},
{n:'Planet',m:7.1,h:205,img:'img/earth.webp',focus:[-.12,-.32],credit:'Photo: NASA, Apollo 17 (AS17-148-22727), 1972',
 over(t,px,h){pen(7,px,col(h,72,.22));circ(0,0,.795);c.stroke();pen(1.5,px,col(h,85,.7));circ(0,0,.782);c.stroke();c.fillStyle='#cfc9bd';circ(.9,-.6,.045);c.fill();c.fillStyle='rgba(7,6,15,.6)';c.beginPath();c.arc(.9,-.6,.045,Math.PI/2,Math.PI*1.5);c.fill()},cap:'Earth, 12,742 km wide, the only place known to hold life.',size:'12,742 km',
 info:'About 71% of Earth\'s surface is ocean. Its atmosphere is thinner, compared to the planet\'s size, than the skin on an apple. Earth spins at about 1,670 km/h at the equator and travels around the Sun at about 107,000 km/h.',
 init(r){const L=[blob(r,60,.17,.35)];for(let i=0;i<5;i++){const a=r()*TAU,dd=.42+r()*.3;L.push(blob(r,50,.1+r()*.12,.4,Math.cos(a)*dd,Math.sin(a)*dd))}return{L}},
 draw(d,t,px,h){const R=.78,g=c.createRadialGradient(-.25,-.25,.1,0,0,R);g.addColorStop(0,col(h,48,.85));g.addColorStop(1,col(h,22,.9));c.fillStyle=g;circ(0,0,R);c.fill();
  c.save();circ(0,0,R);c.clip();for(const b of d.L){poly(b);c.fillStyle=col(140,38,.75);c.fill();pen(1.2,px,col(140,70,.9));c.stroke()}
  pen(1,px,col(h,85,.15));for(const k of[.35,.7]){c.beginPath();c.ellipse(0,0,R,R*k,0,0,TAU);c.stroke();c.beginPath();c.ellipse(0,0,R*k,R,0,0,TAU);c.stroke()}
  const sh=c.createRadialGradient(-.35,-.35,R*.5,-.1,-.1,R*1.25);sh.addColorStop(0,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,10,.65)');c.fillStyle=sh;c.fillRect(-1,-1,2,2);c.restore();
  pen(6,px,col(h,75,.25));circ(0,0,R+.015);c.stroke();pen(1.5,px,col(h,85,.9));circ(0,0,R);c.stroke();
  c.fillStyle='#cfc9bd';circ(.9,-.6,.06);c.fill()}},
{n:'Continent',m:6.9,h:165,img:'img/continent.webp',focus:[.154,.74],credit:'Image: NASA Blue Marble: Next Generation, via Wikimedia Commons',cap:'Africa stretches about 8,000 km from north to south.',size:'thousands of km',
 info:'By common convention Earth\'s land is split into seven continents. They ride on tectonic plates that move a few centimetres a year, about as fast as fingernails grow. Around 300 million years ago they were joined in one supercontinent, Pangaea.',
 init(r){const M=blob(r,120,.8,.22),B=[];for(let i=0;i<8;i++){let a=r()*TAU,x=Math.cos(a)*.17,y=Math.sin(a)*.17;const p=[[x,y]];for(let k=0;k<22;k++){a+=(r()-.5)*.8;x+=Math.cos(a)*.045;y+=Math.sin(a)*.045;p.push([x,y])}B.push(p)}return{M,B,mt:disk(r,16,.7,.25),C:blob(r,50,.15,.3),lk:disk(r,4,.6,.3)}},
 draw(d,t,px,h){poly(d.M);c.fillStyle=col(h,35,.25);c.fill();pen(1.8,px,col(h,70,.95));c.stroke();
  c.save();poly(d.M);c.clip();c.setLineDash([3*px,4*px]);pen(1,px,col(h,75,.5));for(const b of d.B){poly(b,false);c.stroke()}c.setLineDash([]);c.restore();
  pen(1.2,px,col(h+20,80,.6));for(const m of d.mt){c.beginPath();c.moveTo(m[0]-.025,m[1]+.02);c.lineTo(m[0],m[1]-.02);c.lineTo(m[0]+.025,m[1]+.02);c.stroke()}
  c.fillStyle=col(200,60,.6);for(const l of d.lk){circ(l[0],l[1],.025);c.fill()}
  poly(d.C);c.fillStyle=col(h,45,.45);c.fill();pen(1.5,px,col(h,85,1));c.stroke()}},
{n:'Country',m:6,h:150,img:'img/country.webp',focus:[-.065,.303],credit:'Map: southern Africa political map, cropped and recoloured',cap:'South Africa is about 1,600 km from east to west.',size:'hundreds to thousands of km',
 info:'There are 195 countries by the most common count. Borders are human decisions: some follow rivers and mountain ridges, others are straight lines drawn on maps. From space, none of them can be seen.',
 init(r){const M=blob(r,110,.86,.18),R=[];for(let i=0;i<7;i++){const a=i/7*TAU+r()*.4,dd=.45+r()*.12;R.push(blob(r,40,.15+r()*.07,.25,Math.cos(a)*dd,Math.sin(a)*dd))}const rv=[];let x=-.9,y=-.3+r()*.2;while(x<.9){rv.push([x,y]);x+=.04;y+=(r()-.5)*.05+Math.sin(x*4)*.02}return{M,R,rv,C:blob(r,50,.16,.25)}},
 draw(d,t,px,h){poly(d.M);c.fillStyle=col(h,33,.25);c.fill();pen(1.8,px,col(h,70,.95));c.stroke();
  c.save();poly(d.M);c.clip();c.setLineDash([3*px,4*px]);pen(1,px,col(h,75,.55));for(const b of d.R){poly(b);c.stroke()}c.setLineDash([]);pen(1.6,px,col(200,75,.7));poly(d.rv,false);c.stroke();c.restore();
  poly(d.C);c.fillStyle=col(h,45,.45);c.fill();pen(1.5,px,col(h,85,1));c.stroke()}},
{n:'State / Province',m:5.5,h:138,img:'img/state.webp',focus:[-.537,.41],credit:'Map: Htonl, Wikimedia Commons (CC BY-SA), recoloured',cap:'South Africa has nine provinces. Cape Town lies in the Western Cape.',size:'a few hundred km',
 info:'Most countries divide into states, provinces or regions with their own local governments. At this scale you can see how rivers, roads and railways tie towns together, and how towns gather where water and flat land meet.',
 init(r){const M=blob(r,110,.86,.15),tw=disk(r,11,.75,.3),rv=[];for(let k=0;k<2;k++){const p=[];let a=r()*TAU,x=Math.cos(a)*.95,y=Math.sin(a)*.95;for(let i=0;i<45;i++){p.push([x,y]);const to=Math.atan2(-y,-x)+(r()-.5)*1.4;x+=Math.cos(to)*.04;y+=Math.sin(to)*.04}rv.push(p)}return{M,tw,rv,ct:disk(r,14,.11)}},
 draw(d,t,px,h){poly(d.M);c.fillStyle=col(h,30,.22);c.fill();pen(1.8,px,col(h,70,.95));c.stroke();
  c.save();poly(d.M);c.clip();pen(1.6,px,col(200,75,.65));for(const p of d.rv){poly(p,false);c.stroke()}
  pen(1,px,col(45,80,.5));c.beginPath();d.tw.forEach((p,i)=>{c.moveTo(0,0);c.lineTo(p[0],p[1]);const q=d.tw[(i+1)%d.tw.length];c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1])});c.stroke();c.restore();
  for(const p of d.tw)sq(p[0],p[1],.03,col(h,80,.9));for(const p of d.ct)sq(p[0],p[1],.025,col(45,85,.95))}},
{n:'City, Town or Village',m:4.3,h:128,img:'img/city.webp',focus:[-.12,-.4],credit:'Photo: aerial view of Cape Town',cap:'Cape Town, between Table Mountain and the Atlantic Ocean.',size:'a few to tens of km',
 info:'More than half of all people now live in cities, and the UN expects that share to reach about two-thirds by 2050. From above, cities form patterns of grids, rings and rivers, and at night their lights trace the shape of where people live.',
 init(r){const B=[],g=.13;for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){const x=i*g,y=j*g;if(Math.hypot(x,y)>.98||(!i&&!j))continue;const n=1+Math.floor(r()*3),w=(g-.035);for(let k=0;k<n;k++){const bw=w*(.3+r()*.6),bh=w*(.3+r()*.6);B.push([x-w/2+r()*(w-bw),y-w/2+r()*(w-bh),bw,bh,r()])}}return{B}},
 draw(d,t,px,h){c.save();c.rotate(.18);for(const b of d.B){c.fillStyle=col(b[4]>.85?45:h,b[4]>.85?70:50,.1+b[4]*.25);c.fillRect(b[0],b[1],b[2],b[3]);pen(1,px,col(h,75,.65));c.strokeRect(b[0],b[1],b[2],b[3])}
  pen(2.5,px,col(45,80,.5));c.beginPath();c.moveTo(-1,-.065);c.lineTo(1,-.065);c.moveTo(-.065,-1);c.lineTo(-.065,1);c.stroke();c.restore();
  pen(5,px,col(200,65,.4));c.beginPath();c.moveTo(-1,.5);c.bezierCurveTo(-.4,.2,.2,.9,1,.55);c.stroke();
  pen(1.5,px,col(45,80,.4));circ(0,0,.72);c.stroke()}},
{n:'Local Community',m:3,h:110,img:'img/neighbourhood.webp',focus:[-.477,-.393],credit:'Photo: Bo-Kaap, Cape Town',cap:'Bo-Kaap, the colourful neighbourhood on the slopes of Signal Hill.',size:'about a kilometre',
 info:'Bo-Kaap was settled from the 1760s and is the historic home of Cape Town\'s Cape Malay community. Its brightly painted houses line steep cobbled streets a short walk from the city centre. A neighbourhood is the scale of everyday walking: one kilometre takes about 12 minutes on foot.',
 init(r){const H=[],T=[];for(const ry of[-.62,-.22,.22,.62])for(let x=-.95;x<=.95;x+=.19)for(const sd of[-1,1]){const y=ry+Math.sin(x*3)*.04+sd*.1;if(Math.hypot(x,y)<.2||Math.hypot(x,y)>.92||r()<.15)continue;H.push([x+(r()-.5)*.03,y,.07+r()*.02,r()])}for(const p of disk(r,40,.95))if(Math.hypot(p[0],p[1])>.2)T.push(p);return{H,T}},
 draw(d,t,px,h){pen(5,px,col(45,55,.22));for(const ry of[-.62,-.22,.22,.62]){c.beginPath();for(let x=-1;x<=1;x+=.05)x==-1?c.moveTo(x,ry+Math.sin(x*3)*.04):c.lineTo(x,ry+Math.sin(x*3)*.04);c.stroke()}
  c.fillStyle=col(h-10,40,.4);for(const p of d.T){circ(p[0],p[1],.015+p[2]*.02);c.fill()}
  for(const o of d.H){if(o[3]>.6){c.fillStyle=col(45,70,.35);c.fillRect(o[0]-.012,o[1]+.005,.024,.02)}pen(1.3,px,col(h,78,.85));house(o[0],o[1],o[2]);c.stroke()}
  glow(0,.03,.14,45,70,.25);pen(2,px,col(h+30,85,1));house(0,.03,.17);c.stroke()}},
{n:'Home',m:1.2,h:90,img:'img/home.webp',focus:[.125,.25],credit:'Image: kitchen with a view of Table Mountain',cap:'A home: a few rooms, a table, a view of the mountain.',size:'about 15 metres',
 info:'At this scale distances are measured in rooms and steps instead of kilometres. A typical home holds a handful of people and a lifetime of small, ordinary moments.',
 init(){return{}},
 draw(d,t,px,h){glow(0,-.1,.8,45,50,.12);pen(1.5,px,col(h,72,.55));poly([[-.78,.62],[.78,.62],[.78,-.18],[0,-.86],[-.78,-.18]]);c.stroke();
  pen(1,px,col(h,72,.4));c.beginPath();c.moveTo(-.78,.2);c.lineTo(.78,.2);c.stroke();
  pen(1.8,px,col(h,82,.95));[[-.52,.6],[-.26,.32],[.28,.56],[.52,.27]].forEach(p=>person(p[0],.2,p[1]));
  const s=1+.08*Math.sin(t*3);c.save();c.translate(0,-.48);c.scale(s,s);c.beginPath();c.moveTo(0,.05);c.bezierCurveTo(-.09,-.03,-.06,-.1,0,-.05);c.bezierCurveTo(.06,-.1,.09,-.03,0,.05);c.fillStyle=col(335,70,.9);c.fill();c.restore()}},
{n:'Family',m:.45,h:82,img:'img/family.webp',focus:[.019,-.016],credit:'Photo: a family meal',cap:'A family around the table: a few people, a few metres.',size:'about 3 metres',
 info:'Sharing a meal is one of the oldest human habits. At Wonderwerk Cave in South Africa\'s Northern Cape, archaeologists found traces of controlled fire about a million years old, among the earliest evidence anywhere of people gathering around a fire.',
 init(){return{}},
 draw(d,t,px,h){glow(0,0,.8,45,50,.14);pen(1.5,px,col(h,72,.55));c.beginPath();c.ellipse(0,.35,.75,.16,0,0,TAU);c.stroke();
  pen(1.8,px,col(h,82,.95));[[-.55,.62],[-.2,.42],[.2,.66],[.55,.4]].forEach(p=>person(p[0],.3,p[1]));
  const s=1+.08*Math.sin(t*3);c.save();c.translate(0,-.62);c.scale(s,s);c.beginPath();c.moveTo(0,.05);c.bezierCurveTo(-.09,-.03,-.06,-.1,0,-.05);c.bezierCurveTo(.06,-.1,.09,-.03,0,.05);c.fillStyle=col(335,70,.9);c.fill();c.restore()}},
{n:'Person',m:.2,h:42,img:'img/person.webp',focus:[0,-.15],credit:'Drawing: Leonardo da Vinci, Vitruvian Man, c. 1490 (public domain), recoloured',cap:'Leonardo\'s Vitruvian Man: the human body as a measure of the world.',size:'about 1.7 metres',
 info:'Around 1490 Leonardo da Vinci drew a man inside a circle and a square, following the Roman architect Vitruvius, who wrote that a well-built body fits both shapes, with the navel at the centre of the circle. An adult body is made of roughly 37 trillion cells, and every atom in it apart from hydrogen was forged inside stars.',
 init(){return{}},
 draw(d,t,px,h){for(let k=0;k<3;k++){pen(1,px,col(h,75,.14+.08*Math.sin(t*2-k)));c.beginPath();c.ellipse(0,0,.55+k*.12,.95+k*.04,0,0,TAU);c.stroke()}
  glow(0,-.1,.5,h,60,.15);pen(2,px,col(h,82,.95));body()}},
{n:'Organ System',m:-.2,h:32,img:'img/organ-system.webp',focus:[0,-.27],credit:'Image: human anatomy illustration',cap:'Eleven organ systems work together to keep a body alive.',size:'a whole body',
 info:'The circulatory, respiratory, digestive and nervous systems are four of the eleven. Your heart pumps about 7,500 litres of blood a day, and your nerves carry signals at up to about 120 metres per second.',
 init(r){const roots=[];for(let y=-.45;y<=.25;y+=.1){roots.push([0,y,Math.PI+(r()-.5)*.6,.14],[0,y,(r()-.5)*.6,.14])}roots.push([0,-.7,-Math.PI/2,.08],[-.2,-.42,1.95,.2],[.2,-.42,1.19,.2],[-.08,.32,1.68,.25],[.08,.32,1.46,.25]);return{S:tree(r,roots,5)}},
 draw(d,t,px,h){pen(1.5,px,col(h,70,.3));body();pen(2.5,px,col(h,72,.6));c.beginPath();c.moveTo(0,-.55);c.lineTo(0,.3);c.stroke();glow(0,-.7,.12,h,70,.4);drawTree(d.S,t,px,h)}},
{n:'Organ',m:-.6,h:22,img:'img/organ.webp',focus:[-.41,.09],credit:'Image: anatomical model of the lungs',cap:'The lungs: two spongy organs about 25 cm tall.',size:'about 25 cm',
 info:'Inside your lungs, the airways branch about 23 times and end in some 480 million tiny air sacs called alveoli. Spread flat, their surface would cover roughly 70 square metres, about a third of a tennis court. You breathe around 20,000 times a day.',
 init(){const o=[],i2=[];for(let i=0;i<120;i++){const a=i/120*TAU,da=Math.abs(a-Math.PI),rr=.62-.3*Math.exp(-da*da/.18);o.push([.12+Math.cos(a)*rr*.95,Math.sin(a)*rr*1.38]);i2.push([.12+Math.cos(a)*rr*.75,Math.sin(a)*rr*1.12])}return{o,i2}},
 draw(d,t,px,h){poly(d.o);c.fillStyle=col(h,35,.3);c.fill();pen(2,px,col(h,72,.95));c.stroke();pen(1,px,col(h,75,.55));poly(d.i2);c.stroke();
  pen(1.2,px,col(h+10,80,.6));for(let k=0;k<9;k++){const p=d.i2[Math.floor(k*120/9+8)%120];if(p[0]<-.1)continue;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(-.2+.06*Math.sin(k),p[1]*.25);c.stroke()}
  pen(3,px,col(h+20,75,.8));c.beginPath();c.moveTo(-.22,0);c.bezierCurveTo(-.5,.1,-.45,.6,-.62,1.05);c.stroke();
  pen(2,px,col(0,65,.75));c.beginPath();c.moveTo(-.22,-.06);c.lineTo(-1,-.12);c.stroke();pen(2,px,col(230,70,.75));c.beginPath();c.moveTo(-.22,.06);c.lineTo(-1,.12);c.stroke()}},
{n:'Tissue',m:-3,h:15,img:'img/tissue.webp',focus:[.087,.033],credit:'Image: loose connective tissue under a light microscope',cap:'Tissue: cells and fibres woven together, here seen under a microscope.',size:'under a millimetre',
 info:'The body has four main kinds of tissue: epithelial tissue that lines surfaces, connective tissue that supports, muscle that moves, and nervous tissue that signals. Organs are built by layering them.',
 init(r){const C=[];for(let gy=-8;gy<=8;gy++)for(let gx=-8;gx<=8;gx++){const j=gx||gy,x=gx*.15+(mod(gy,2))*.075+(j?(r()-.5)*.02:0),y=gy*.13+(j?(r()-.5)*.02:0);if(Math.hypot(x,y)>1)continue;C.push({p:blob(r,10,.066,.12,x,y),n:[x+(r()-.5)*.03,y+(r()-.5)*.03],z:r()})}return{C}},
 draw(d,t,px,h){for(const o of d.C){poly(o.p);c.fillStyle=col(h,45,.1+o.z*.12);c.fill();pen(1.2,px,col(h,75,.8));c.stroke();c.fillStyle=col(h+300,70,.6);circ(o.n[0],o.n[1],.022);c.fill()}}},
{n:'Cell',m:-4.7,h:340,img:'img/cell.webp',focus:[.559,-.013],credit:'Image: illustrated cell',cap:'A typical human cell is 10 to 100 micrometres wide.',size:'about the width of a hair',
 info:'Every cell is wrapped in a thin membrane and runs on instructions stored as DNA in its nucleus. Your body replaces roughly 330 billion cells every day, most of them blood and gut cells.',
 init(r){const mi=[];let tr=0;while(mi.length<8&&tr++<500){const a=r()*TAU,dd=.25+r()*.5,x=Math.cos(a)*dd,y=Math.sin(a)*dd;if(Math.hypot(x-.36,y+.32)<.36)continue;mi.push([x,y,r()*TAU])}return{M:blob(r,90,.86,.05),N:blob(r,40,.24,.08,.36,-.32),mi,rb:disk(r,150,.8)}},
 draw(d,t,px,h){poly(d.M);c.fillStyle=col(h,35,.16);c.fill();pen(2.5,px,col(h,72,.95));c.stroke();pen(1,px,col(h,80,.4));c.save();c.scale(.97,.97);poly(d.M);c.stroke();c.restore();
  for(const p of d.rb)sq(p[0],p[1],1.6*px,col(h+40,80,.5));
  pen(1,px,col(h+20,75,.5));for(let k=0;k<4;k++){c.beginPath();for(let a=-2.4;a<1.2;a+=.08){const rr=.3+k*.045+.012*Math.sin(a*12+k),x=.36+Math.cos(a)*rr,y=-.32+Math.sin(a)*rr;a==-2.4?c.moveTo(x,y):c.lineTo(x,y)}c.stroke()}
  poly(d.N);c.fillStyle=col(270,40,.4);c.fill();pen(1.8,px,col(270,75,.9));c.stroke();glow(.4,-.3,.09,270,75,.8);
  pen(1.3,px,col(45,75,.75));for(let k=0;k<4;k++){c.beginPath();c.arc(-.45,.55,.12+k*.035,-2.4,-.9);c.stroke()}
  pen(1.3,px,col(30,75,.9));for(const m of d.mi){capsule(m[0],m[1],.12,.05,m[2]);c.stroke()}capsule(0,0,.15,.07,.4);c.stroke()}},
{n:'Organelle',m:-6,h:300,img:'img/mitochondrion.webp',focus:[-.385,.275],credit:'Electron micrograph: Louisa Howard, Dartmouth Electron Microscope Facility (public domain), tinted',cap:'A mitochondrion, the cell\'s power plant, is about a micrometre long.',size:'about 1 micrometre',
 info:'Mitochondria turn food and oxygen into ATP, the energy currency of the cell. They carry their own small loop of DNA, a strong clue that they were once free-living bacteria that moved into another cell long ago.',
 init(r){const md=[];for(const p of disk(r,90,.9))if(Math.abs(p[1])<.36&&Math.hypot(p[0],p[1])>.17)md.push(p);return{md}},
 draw(d,t,px,h){c.beginPath();c.roundRect(-.9,-.46,1.8,.92,.46);c.fillStyle=col(h,30,.22);c.fill();pen(2.2,px,col(h,72,.95));c.stroke();c.beginPath();c.roundRect(-.85,-.41,1.7,.82,.41);pen(1.2,px,col(h,75,.6));c.stroke();
  pen(1.4,px,col(h+20,78,.85));let s=1;for(let x=-.68;x<=.7;x+=.13){if(Math.abs(x)<.16)continue;c.beginPath();const y0=s*-.41,y1=s*-.06;for(let k=0;k<=12;k++){const y=y0+(y1-y0)*k/12;k?c.lineTo(x-.025+.012*Math.sin(k+t),y):c.moveTo(x-.025,y)}for(let k=12;k>=0;k--){const y=y0+(y1-y0)*k/12;c.lineTo(x+.025+.012*Math.sin(k+t),y)}c.stroke();s=-s}
  for(const p of d.md)sq(p[0],p[1],2*px,col(h+50,80,.6))}},
{n:'DNA & Proteins',m:-8.3,h:292,img:'img/dna.webp',focus:[-.05,-.13],credit:'Image: DNA structure by Zephyris (Richard Wheeler), Wikimedia Commons, CC BY-SA 3.0',cap:'DNA is a double helix just 2 nanometres wide.',size:'2 to 10 nanometres',
 info:'Unwound, the DNA in a single human cell would stretch about 2 metres. Proteins, chains of amino acids folded into precise shapes, read it, copy it, repair it and do most of the cell\'s work.',
 init(r){const P=[];for(const[cx,cy]of[[-.45,-.55],[.5,.5],[.55,-.45],[-.55,.5]]){let x=cx,y=cy,a=r()*TAU;const p=[];for(let i=0;i<46;i++){p.push([x,y]);a+=(r()-.5)*1.6;x+=Math.cos(a)*.03;y+=Math.sin(a)*.03;const dx=x-cx,dy=y-cy;if(Math.hypot(dx,dy)>.2){a=Math.atan2(-dy,-dx)}}P.push(p)}return{P}},
 draw(d,t,px,h){const ang=-.55,ax=Math.cos(ang),ay=Math.sin(ang),nx=-ay,ny=ax,per=.42,amp=.12;
  for(const p of d.P){pen(2,px,col(h+60,70,.55));poly(p,false);c.stroke();for(let i=0;i<p.length;i+=3)sq(p[i][0],p[i][1],3*px,col(h+60,82,.8))}
  const pt=(s,ph)=>{const w=TAU*s/per+t*1.1+ph;return[ax*s+nx*amp*Math.sin(w),ay*s+ny*amp*Math.sin(w),Math.cos(w)]};
  const BP=[0,50,200,130];for(let s=-1.3;s<=1.3;s+=.045){const A=pt(s,0),B=pt(s,2.3),k=Math.floor((s+2)*22.2)%4;pen(1.6,px,col(BP[k],70,.35+.25*(A[2]+B[2]+2)/4));c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke()}
  for(const ph of[0,2.3])for(let s=-1.3;s<1.3;s+=.02){const A=pt(s,ph),B=pt(s+.02,ph);pen(3,px,col(h,72+A[2]*10,.45+.45*(A[2]+1)/2));c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke()}}},
{n:'Molecule',m:-9.5,h:200,cap:'Water: one oxygen and two hydrogen atoms, about 0.3 nanometres across.',size:'0.3 nanometres',
 info:'A water molecule is one oxygen atom bonded to two hydrogen atoms at an angle of about 104.5°. The dashed lines are hydrogen bonds: weak pulls between neighbouring molecules that make water stick together, climb up plant stems and freeze into ice that floats.',
 init(r){const M=[{p:[0,0,0],o:[.3,.2],w:[.12,.09]}];let t=0;while(M.length<28&&t++<6000){const q=disk(r,1,.86)[0],zz=Math.sqrt(Math.max(0,.74-q[0]*q[0]-q[1]*q[1])),p=[q[0],q[1],(r()*2-1)*zz];if(M.some(m=>Math.hypot(m.p[0]-p[0],m.p[1]-p[1],m.p[2]-p[2])<.23))continue;M.push({p,o:[r()*TAU,r()*TAU],w:[(r()-.5)*.9,(r()-.5)*.9]})}return{M}},
 draw(d,t,px,h){const ay=t*.09,ca=Math.cos(ay),sa=Math.sin(ay),half=104.5/2*Math.PI/180,bl=.09;
  const proj=v=>{const x=v[0]*ca-v[2]*sa,z=v[0]*sa+v[2]*ca,k=2.4/(2.4+z);return[x*k,v[1]*k,z,k]};
  const A=[],H=[];
  d.M.forEach((m,i)=>{const a1=m.o[0]+t*m.w[0],a2=m.o[1]+t*m.w[1],c1=Math.cos(a1),s1=Math.sin(a1),c2=Math.cos(a2),s2=Math.sin(a2);
   const hv=[[Math.sin(half),Math.cos(half)],[-Math.sin(half),Math.cos(half)]].map(([x,y])=>{const y2=y*c1,z2=y*s1,x3=x*c2-z2*s2,z3=x*s2+z2*c2;return[m.p[0]+x3*bl,m.p[1]+y2*bl,m.p[2]+z3*bl]});
   const O=proj(m.p);A.push({P:O,o:1,hs:hv.map(proj)});hv.forEach(v=>H.push({w:v,i}))});
  c.setLineDash([2.5*px,4*px]);pen(1.3,px,col(190,80,.5));c.beginPath();
  for(const hh of H)d.M.forEach((m,j)=>{if(j===hh.i)return;if(Math.hypot(hh.w[0]-m.p[0],hh.w[1]-m.p[1],hh.w[2]-m.p[2])<.21){const P=proj(hh.w),Q=proj(m.p);c.moveTo(P[0],P[1]);c.lineTo(Q[0],Q[1])}});
  c.stroke();c.setLineDash([]);
  A.sort((a,b)=>b.P[2]-a.P[2]);
  for(const a of A){const fog=clamp(1-(a.P[2]+.86)/1.72*.55,.4,1);c.globalAlpha=fog;
   const parts=[{P:a.P,r:.046,o:1},...a.hs.map(P=>({P,r:.029,o:0}))].sort((x,y)=>y.P[2]-x.P[2]);
   c.lineWidth=.016*a.P[3];c.strokeStyle='rgba(205,205,220,.75)';c.beginPath();for(const q of a.hs){c.moveTo(a.P[0],a.P[1]);c.lineTo(q[0],q[1])}c.stroke();
   for(const q of parts)q.o?ball(q.P[0],q.P[1],q.r*1.2*q.P[3],6,72,56):ball(q.P[0],q.P[1],q.r*1.2*q.P[3],230,8,86)}
  c.globalAlpha=1}},
{n:'Atom',m:-10,h:280,cap:'A carbon atom: six electrons spread out in clouds called orbitals.',size:'about 0.15 nanometres',
 info:'Electrons are not little planets circling a sun. Quantum physics says each one is spread out as a cloud of probability, shaped into spheres and dumbbells called orbitals, as drawn here for carbon. The nucleus is the speck at the centre: if it were a marble, the whole atom would be the size of a football stadium.',
 init(r){const g=()=>(r()+r()+r()-1.5)*1.15,P=[],dir=()=>{const v=[g(),g(),g()],n=Math.hypot(...v)||1;return v.map(x=>x/n)};
  for(let i=0;i<450;i++){const v=dir(),rr=.03+Math.abs(g())*.06;P.push([v[0]*rr,v[1]*rr,v[2]*rr,265])}
  for(let i=0;i<900;i++){const v=dir(),rr=.58+g()*.13;P.push([v[0]*rr,v[1]*rr,v[2]*rr,250])}
  for(const[ax,hu]of[[0,190],[1,300],[2,330]])for(let i=0;i<950;i++){const al=(r()<.5?-1:1)*(.37+g()*.11),q=[g()*.13,g()*.13];const v=ax===0?[al,q[0],q[1]]:ax===1?[q[0],al,q[1]]:[q[0],q[1],al];P.push([...v,hu])}
  return{P,st:{}}},
 draw(d,t,px,h){const ay=t*.17,ax=.55+.25*Math.sin(t*.11),cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax),s2=3.2*px;
  glow(0,0,.95,h,40,.22);c.save();c.globalCompositeOperation='lighter';
  for(const p of d.P){const x=p[0]*cy-p[2]*sy,z0=p[0]*sy+p[2]*cy,y=p[1]*cx-z0*sx,z=p[1]*sx+z0*cx,k=2.6/(2.6+z),al=Math.round(clamp(.5*k,0,.8)*20)*5;
   const key=p[3]+'_'+al;c.fillStyle=d.st[key]||(d.st[key]=col(p[3],64,al/100));c.fillRect(x*k-s2/2,y*k-s2/2,s2,s2)}
  c.restore();glow(0,0,.07,40,85,.9);c.fillStyle='#fff8ee';circ(0,0,1.8*px);c.fill()}},
{n:'Nucleus',m:-14.6,h:350,cap:'A carbon-12 nucleus: six protons and six neutrons, packed tight.',size:'about 5 femtometres',
 info:'The nucleus is about 100,000 times smaller than the atom around it, yet holds 99.9% of its mass. Protons push each other apart with their electric charge, but at this tiny range the strong nuclear force, the strongest of nature\'s four forces, holds them together.',
 init(){const ph=(1+Math.sqrt(5))/2,V=[[0,1,ph],[0,-1,ph],[0,1,-ph],[0,-1,-ph],[1,ph,0],[-1,ph,0],[1,-ph,0],[-1,-ph,0],[ph,0,1],[-ph,0,1],[ph,0,-1],[-ph,0,-1]],th=Math.atan2(1,ph)+Math.PI,ct=Math.cos(th),st=Math.sin(th),b=.19;
  return{N:V.map((v,i)=>{const y=v[1]*ct-v[2]*st,z=v[1]*st+v[2]*ct;return{p:[v[0]*b,y*b,z*b],pr:[0,3,4,7,9,10].includes(i),ph:i*1.7}})}},
 draw(d,t,px,h){glow(0,0,.8,h,45,.35);const a=t*.12,ca=Math.cos(a),sa=Math.sin(a);
  const L=d.N.map(n=>{const j=.008*Math.sin(t*4+n.ph),x=n.p[0]*ca-n.p[1]*sa+j,y=n.p[0]*sa+n.p[1]*ca-j,z=n.p[2],k=3/(3+z);return{x:x*k,y:y*k,z,k,pr:n.pr}}).sort((p,q)=>q.z-p.z);
  for(const n of L){const fog=clamp(.75-n.z*1.2,.45,1);c.globalAlpha=fog;n.pr?ball(n.x,n.y,.185*n.k,352,72,56):ball(n.x,n.y,.185*n.k,212,30,62);
   label(n.x,n.y+.005,n.pr?'p⁺':'n',px,'rgba(255,255,255,.7)',Math.max(4,.09*n.k/px),'center')}
  c.globalAlpha=1}},
{n:'Proton & Neutron',m:-15.1,h:265,cap:'A proton is about 0.84 femtometres across.',size:'0.84 femtometres',
 info:'Protons and neutrons are each made of three quarks held together by gluons, which act like springs that get stronger the more you stretch them. A proton is two up quarks and one down; a neutron is one up and two down. The colours are not real colours: physicists use them to name the three kinds of charge of the strong force.',
 init(r){return{sea:disk(r,30,.78,.2).map(p=>[...p,r()*TAU])}},
 draw(d,t,px,h){const g=c.createRadialGradient(0,0,.1,0,0,.95);g.addColorStop(0,col(h,50,.28));g.addColorStop(.8,col(h,45,.12));g.addColorStop(1,col(h,60,0));c.fillStyle=g;circ(0,0,.95);c.fill();
  const Q=[[0,0,0,'u'],[-.5,.4,120,'u'],[.5,.4,225,'d']].map((q,i)=>[q[0]+.02*Math.sin(t*1.3+i*2),q[1]+.02*Math.cos(t*1.1+i),q[2],q[3]]);
  c.save();c.globalCompositeOperation='lighter';
  for(const[a,b]of[[0,1],[1,2],[2,0]]){const A=Q[a],B=Q[b],dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;c.beginPath();for(let k=0;k<=80;k++){const s=k/80,w=Math.sin(s*L*55-t*7)*.032*Math.sin(Math.PI*s);k?c.lineTo(A[0]+dx*s+nx*w,A[1]+dy*s+ny*w):c.moveTo(A[0],A[1])}neon(1.6,px,50,70,.9)}
  for(const p of d.sea){const al=Math.max(0,Math.sin(t*1.2+p[3]));if(al<.05)continue;glow(p[0]-.022,p[1],.03,h+60,70,al*.8);glow(p[0]+.022,p[1],.03,h-50,70,al*.8)}
  for(const q of Q)glow(q[0],q[1],.24,q[2],60,.55);c.restore();
  for(const q of Q){ball(q[0],q[1],.085,q[2],80,52);label(q[0],q[1]+.003,q[3],px,'rgba(255,255,255,.9)',Math.max(5,.1/px),'center')}}},
{n:'Quarks & Gluons',glow:1,m:-18,h:256,cap:'Quarks have no measured size: smaller than 10⁻¹⁸ m.',size:'no measured size',
 info:'Every experiment so far finds quarks to be point-like, with no inner parts. They are never seen alone: pull two apart and the energy in the gluon field creates new quarks instead. Most of a proton\'s mass comes from this energy, not from the quarks themselves.',
 init(r){return{sea:disk(r,46,.92,.18).map(p=>[...p,r()])}},
 draw(d,t,px,h){const k=Math.floor(t*.6)%3,hu=[0,120,225][k];glow(0,0,.5,hu,55,.3);
  pen(2,px,col(50,78,.75));for(const a of[Math.PI/2,Math.PI*7/6,Math.PI*11/6]){const ca=Math.cos(a),sa=Math.sin(a);c.beginPath();for(let i=0;i<=80;i++){const s=i/80*1.1,w=Math.sin(s*50-t*8)*.035*(1-s*.3);i?c.lineTo(ca*s-sa*w,sa*s+ca*w):c.moveTo(0,0)}c.stroke()}
  for(const p of d.sea){const f=(t*.35+p[2])%1,sep=.06*Math.sin(Math.PI*f),al=Math.sin(Math.PI*f),ang=p[2]*TAU;c.fillStyle=col(h+70,80,al*.9);circ(p[0]+Math.cos(ang)*sep,p[1]+Math.sin(ang)*sep,.012);c.fill();c.fillStyle=col(h-40,80,al*.9);circ(p[0]-Math.cos(ang)*sep,p[1]-Math.sin(ang)*sep,.012);c.fill()}
  glow(0,0,.2,hu,65,.8);c.fillStyle=col(hu,70,1);circ(0,0,.05);c.fill()}},
{n:'Preons (?)',glow:1,m:-19,h:270,cap:'A speculative idea: quarks might be made of even smaller parts.',size:'hypothetical',
 info:'Preon models suggest that quarks and electrons are built from a few deeper building blocks, the way atoms are built from protons, neutrons and electrons. Particle colliders have found no sign of them so far, so they remain a question mark.',
 init(){return{}},
 draw(d,t,px,h){const tri=(x,y,r,dp,rot)=>{c.setLineDash([2*px,4*px]);pen(1.3,px,col(h+dp*15,78,.75-dp*.12));circ(x,y,r);c.stroke();c.setLineDash([]);if(dp===2)label(x,y,'?',px,col(h,85,.6),Math.max(6,Math.min(40,r*.9/px)),'center');if(dp<3)for(let k=0;k<3;k++){const a=rot+k*TAU/3-Math.PI/2;tri(x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.5,r*.42,dp+1,-rot*1.3)}};tri(0,0,.9,0,t*.05);glow(0,0,.12,h,70,.5)}},
{n:'The Desert (?)',glow:1,m:-27,h:278,cap:'A vast range of scales where we may find nothing new at all.',size:'10⁻¹⁹ to 10⁻³⁴ m',
 info:'Between the smallest scales colliders can probe and the Planck length lies a range of about 15 powers of ten. Physicists nicknamed it "the desert" because some theories predict no new particles anywhere in it. Others predict it is full of surprises. Nobody knows yet.',
 init(r){const D=[];for(let i=0;i<9;i++){const y=-.85+i*.21,ph=r()*TAU;for(let x=-1;x<=1;x+=.035)if(r()<.35)D.push([x,y+Math.sin(x*3+ph)*.07,r()])}return{D:D.filter(p=>Math.hypot(p[0],p[1])>.18)}},
 draw(d,t,px,h){d.D.forEach((p,i)=>sq(p[0]+Math.sin(t*.2+i)*.004,p[1],2*px,col(h,82,.2+.4*Math.max(0,Math.sin(t*.8+i*.7)))))}},
{n:'Strings (?)',glow:1,m:-34.8,h:285,cap:'String theory: every particle may be a tiny vibrating string.',size:'about the Planck length',
 info:'String theory proposes that each particle is a vibrating loop or strand of energy, and that different vibrations show up as different particles. It is mathematically rich and may unite gravity with quantum physics, but no experiment has tested it.',
 init(r){const L=[];let tr=0;while(L.length<12&&tr++<2000){const p=disk(r,1,.82,.25)[0],R=.05+r()*.11;if(L.some(o=>Math.hypot(o.x-p[0],o.y-p[1])<o.R+R+.05))continue;L.push({x:p[0],y:p[1],R,n:2+Math.floor(r()*5),w:1+r()*3})}const O=[];for(let i=0;i<7;i++){const p=disk(r,1,.8,.3)[0];O.push({x:p[0],y:p[1],a:r()*Math.PI,l:.12+r()*.15,n:1+Math.floor(r()*3),w:2+r()*3})}return{L,O}},
 draw(d,t,px,h){pen(1.5,px,col(h,80,.9));const loop=(x,y,R,n,w)=>{c.beginPath();for(let k=0;k<=80;k++){const a=k/80*TAU,rr=R*(1+.18*Math.sin(n*a+t*w));k?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+rr,y)}c.stroke()};
  for(const o of d.L){glow(o.x,o.y,o.R*1.5,h,65,.15);loop(o.x,o.y,o.R,o.n,o.w)}loop(0,0,.1,3,2);
  pen(1.4,px,col(h+40,80,.85));for(const o of d.O){const ca=Math.cos(o.a),sa=Math.sin(o.a);c.beginPath();for(let k=0;k<=30;k++){const s=k/30,w=Math.sin(o.n*Math.PI*s)*Math.sin(t*o.w)*.035,x=(s-.5)*o.l;k?c.lineTo(o.x+x*ca-w*sa,o.y+x*sa+w*ca):c.moveTo(o.x+x*ca-w*sa,o.y+x*sa+w*ca)}c.stroke()}}},
{n:'Quantum Foam (?)',glow:1,m:-35.2,h:292,cap:'At the Planck length, space itself may froth and bubble.',size:'1.6 × 10⁻³⁵ m',
 info:'Physicist John Wheeler suggested that at the Planck length, space and time stop being smooth and fluctuate wildly, like foam on a wave. This is where our two best theories, gravity and quantum physics, stop working together, and below it "length" may stop meaning anything.',
 init(r){return{B:disk(r,150,.97).map(p=>[p[0],p[1],p[2],.02+r()*r()*.08])}},
 draw(d,t,px,h){for(const b of d.B){const f=(t*.35+b[2]*7)%1,rr=b[3]*f;if(Math.hypot(b[0],b[1])<.16)continue;pen(1.2,px,col(h+b[2]*50-25,80,(1-f)*.85));circ(b[0],b[1],rr);c.stroke()}}},
{n:'Spin Network (?)',glow:1,m:-35.5,h:300,cap:'Loop quantum gravity: space may be woven from tiny chunks.',size:'smaller than size itself',
 info:'Loop quantum gravity, a rival to string theory, proposes that space is not continuous. It is built from discrete "atoms of space" linked in a network, and the smallest possible area would be about the Planck length squared. The numbers on the links are quantum spins.',
 init(r){const P=spaced(r,38,.95,.17,[0,0,0]),E=[],seen=new Set();P.forEach((a,i)=>{P.map((b,j)=>[Math.hypot(a[0]-b[0],a[1]-b[1]),j]).sort((x,y)=>x[0]-y[0]).slice(1,4).forEach(([,j])=>{const k=i<j?i+'-'+j:j+'-'+i;if(!seen.has(k)){seen.add(k);E.push([i,j,['½','1','3/2','2'][Math.floor(r()*4)],r()])}})});return{P,E}},
 draw(d,t,px,h){for(const[i,j,s,q]of d.E){const A=d.P[i],B=d.P[j];pen(1.3,px,col(h,75,.55));c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke();const f=(t*.3+q)%1;sq(A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f,3*px,col(h+40,85,.9));if(q<.45)label((A[0]+B[0])/2,(A[1]+B[1])/2-.02,s,px,col(h,85,.6),13,'center')}
  for(const p of d.P){glow(p[0],p[1],.04,h,70,.5);c.fillStyle=col(h,85,1);circ(p[0],p[1],3*px);c.fill()}}},
{n:'It from Bit (?)',glow:1,m:null,h:310,cap:'Maybe, at the bottom, reality is information.',size:'?',
 info:'John Wheeler summed up this idea as "it from bit": every particle and field might arise from yes-or-no answers. The holographic principle adds that everything inside a region could be described by bits on its boundary. If so, the smallest bits may encode the largest whole, and the zoom begins again.',
 init(r){const R=[];for(let k=0;k<7;k++){const rad=.24+k*.11,n=Math.floor(TAU*rad/.06);for(let i=0;i<n;i++)R.push([Math.cos(i/n*TAU)*rad,Math.sin(i/n*TAU)*rad,r(),k])}return{R}},
 draw(d,t,px,h){const fs=.045/px;for(const b of d.R){const bit=Math.floor(Math.sin(Math.floor(t*1.5+b[2]*9)*12.9898+b[2]*78.233)*43758.5453)&1,al=.35+.5*b[2];
  if(fs<5)sq(b[0],b[1],2*px,col(h+b[3]*8,80,al));else label(b[0],b[1],bit?'1':'0',px,col(h+b[3]*8,80,al),fs,'center')}glow(0,0,.2,275,65,.5)}}
];
const N=LV.length;
LV.forEach((l,i)=>{l.d=l.init(rngOf(i+11));if(l.img){const im=new Image();im.onload=()=>{l.photo=im;shown=-1};im.src=l.img}});
const MM=LV.map((l,i)=>l.m!=null?l.m:(i===0?28:-36));

/* ---------- state ---------- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let z=Math.max(0,LV.findIndex(l=>l.n==='Planet')),vel=0,auto=false,jump=null,time=0,last=performance.now(),shown=-1,fontOK=false,lastInput=-9,touching=false;
let mx=0,my=0,tmx=0,tmy=0;
const BASE=.22;
let cw,ch,dpr=1,grain;
const oc=document.createElement('canvas'),octx=oc.getContext('2d');
function size(){dpr=Math.min(2,devicePixelRatio||1);cw=innerWidth;ch=innerHeight;cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr)}
addEventListener('resize',size);size();
(function(){const g=document.createElement('canvas');g.width=g.height=200;const gx=g.getContext('2d'),im=gx.createImageData(200,200),r=rngOf(3);for(let i=0;i<im.data.length;i+=4){const v=r()*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}gx.putImageData(im,0,0);grain=mainC.createPattern(g,'repeat')})();
document.fonts&&document.fonts.load('18px "Patrick Hand"').then(()=>fontOK=true);
function paper(h,x,y,r){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`hsl(${h},38%,8%)`);g.addColorStop(.86,`hsl(${h},42%,11%)`);g.addColorStop(1,`hsl(${h},48%,16%)`);return g}
function wob(x,y,r,t){c.beginPath();for(let k=0;k<=180;k++){const a=k/180*TAU,rr=r*(1+.007*Math.sin(a*5+1.3)+.005*Math.sin(a*11+t*.2));k?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+rr,y)}}

/* ---------- sound (Web Audio, made in code; starts only on click) ---------- */
const S={on:false};
function soundStart(){const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;
  if(!S.ac){const ac=new A(),master=ac.createGain();master.gain.value=0;master.connect(ac.destination);
   const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;lp.Q.value=.8;lp.connect(master);
   S.osc=[[1,'sine',.32],[1.5,'sine',.14],[2,'triangle',.05],[1.004,'sine',.28]].map(([m,ty,gv])=>{const o=ac.createOscillator(),g=ac.createGain();o.type=ty;g.gain.value=gv;o.connect(g);g.connect(lp);o.start();return{o,m}});
   const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.06;lg.gain.value=300;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
   const bell=ac.createGain();bell.gain.value=.5;bell.connect(ac.destination);Object.assign(S,{ac,master,lp,bell})}
  S.ac.resume();S.master.gain.setTargetAtTime(.16,S.ac.currentTime,.6);S.on=true;return true}
function soundStop(){if(!S.ac)return;S.master.gain.setTargetAtTime(0,S.ac.currentTime,.3);S.on=false}
function soundTune(meters){if(!S.on)return;const f=36*Math.pow(2,(meters+36)/64*2.6),now=S.ac.currentTime;for(const x of S.osc)x.o.frequency.setTargetAtTime(f*x.m,now,.25)}
const PENTA=[0,2,4,7,9];
function chime(i){if(!S.on)return;const ac=S.ac,now=ac.currentTime,semi=PENTA[i%5]+12*(2-Math.floor(i/5)%3),f=392*Math.pow(2,semi/12);
  for(const[m,v]of[[1,.07],[2.01,.02]]){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f*m;g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(v,now+.02);g.gain.exponentialRampToValueAtTime(.0001,now+3);o.connect(g);g.connect(S.bell);o.start(now);o.stop(now+3.1)}}

/* ---------- HUD ---------- */
const $=id=>document.getElementById(id);
const ladder=$('ladder'),strip=$('strip');
LV.forEach((l,i)=>{const b=document.createElement('button');b.type='button';b.style.setProperty('--c',ink(l.h));b.innerHTML=`<i>→</i><span>${l.n}</span>`;b.onclick=()=>goTo(i);ladder.appendChild(b);
  const s=document.createElement('button');s.type='button';s.style.setProperty('--c',ink(l.h));s.setAttribute('aria-label',l.n);s.innerHTML='<b></b>';s.onclick=()=>goTo(i);strip.appendChild(s)});
const rungs=[...ladder.children],chips=[...strip.children];
function sup(v){return `≈ 10<sup>${v<0?'−':''}${Math.abs(Math.round(v))}</sup> m`}
function hud(){const cur=mod(Math.round(z),N);
  if(cur!==shown){const first=shown<0;shown=cur;const l=LV[cur],nm=$('name');nm.textContent=l.n;document.documentElement.style.setProperty('--lv',ink(l.h));nm.classList.remove('swap');void nm.offsetWidth;nm.classList.add('swap');
   $('cap').textContent=l.cap;$('friendly').textContent=l.size;$('infoText').textContent=l.info;$('credit').textContent=l.photo&&l.credit?l.credit:'';
   rungs.forEach((r,i)=>r.classList.toggle('on',i===cur));chips.forEach((r,i)=>r.classList.toggle('on',i===cur));if(!first)chime(cur)}
  const L=Math.floor(z),f=z-L,a=LV[mod(L,N)].m,b=LV[mod(L+1,N)].m;
  $('scale').innerHTML=(a==null||b==null)?(LV[shown].m==null?'≈ ? m':sup(LV[shown].m)):sup(a+(b-a)*f);
  const ma=MM[mod(L,N)],mb=MM[mod(L+1,N)];soundTune(ma+(mb-ma)*f)}
function goTo(i){const b=Math.floor(z/N)*N+i,cands=[b-N,b,b+N];jump=cands.reduce((p,q)=>Math.abs(q-z)<Math.abs(p-z)?q:p);vel=0;lastInput=time}
function step(d){jump=Math.round(jump??z)+d;vel=0;lastInput=time}
const bAuto=$('auto'),bAbout=$('about'),bSound=$('sound'),bFull=$('full');
$('inBtn').onclick=()=>step(1);$('outBtn').onclick=()=>step(-1);
bAuto.onclick=()=>{auto=!auto;bAuto.setAttribute('aria-pressed',auto);jump=null};
bAbout.onclick=()=>{const on=$('info').hidden;$('info').hidden=!on;bAbout.setAttribute('aria-pressed',on)};
bSound.onclick=()=>{if(S.on){soundStop();bSound.setAttribute('aria-pressed','false')}else if(soundStart()){bSound.setAttribute('aria-pressed','true');hud()}};
const fsEl=document.documentElement,canFs=!!(fsEl.requestFullscreen||fsEl.webkitRequestFullscreen);
if(!canFs)bFull.hidden=true;
bFull.onclick=()=>{try{const isFs=document.fullscreenElement||document.webkitFullscreenElement;
  const p=isFs?(document.exitFullscreen||document.webkitExitFullscreen).call(document):(fsEl.requestFullscreen||fsEl.webkitRequestFullscreen).call(fsEl);if(p&&p.catch)p.catch(()=>{})}catch(e){}};
document.addEventListener('fullscreenchange',()=>bFull.textContent=document.fullscreenElement?'exit fullscreen':'fullscreen');

/* ---------- input: scroll, trackpad pinch, touch swipe + pinch, keys, parallax ---------- */
cv.addEventListener('wheel',e=>{e.preventDefault();jump=null;lastInput=time;const dy=clamp(e.deltaY,-120,120);if(e.ctrlKey)z+=dy*.012;else vel+=dy*.0045},{passive:false});
const T=new Map();let pinch=null,swipeY=null;
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;T.set(e.pointerId,[e.clientX,e.clientY]);touching=true;jump=null;if(T.size===2){const[a,b]=[...T.values()];pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);swipeY=null}else swipeY=e.clientY;askTilt()});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tmx=(e.clientX/cw-.5)*2;tmy=(e.clientY/ch-.5)*2;return}if(!T.has(e.pointerId))return;T.set(e.pointerId,[e.clientX,e.clientY]);lastInput=time;
  if(T.size>=2&&pinch){const[a,b]=[...T.values()],dd=Math.hypot(a[0]-b[0],a[1]-b[1]);z+=Math.log(dd/pinch)/Math.log(K)*1.4;pinch=dd}
  else if(swipeY!=null){const dy=swipeY-e.clientY;vel+=dy*.012;swipeY=e.clientY}});
const up=e=>{T.delete(e.pointerId);if(T.size<2)pinch=null;if(T.size===1)swipeY=[...T.values()][0][1];if(!T.size){touching=false;swipeY=null}};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
addEventListener('keydown',e=>{if(e.target.tagName==='BUTTON'&&(e.key===' '||e.key==='Enter'))return;
  if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='+'||e.key==='=')step(1);else if(e.key==='ArrowUp'||e.key==='ArrowLeft'||e.key==='-')step(-1);
  else if(e.key===' '){e.preventDefault();bAuto.click()}else if(e.key==='f')bFull.click();else if(e.key==='i')bAbout.click()});
let tiltAsked=false;
function askTilt(){if(tiltAsked)return;tiltAsked=true;try{const D=window.DeviceOrientationEvent;if(D&&typeof D.requestPermission==='function')D.requestPermission().catch(()=>{})}catch(e){}}
addEventListener('deviceorientation',e=>{if(e.gamma==null)return;tmx=clamp(e.gamma/25,-1,1);tmy=clamp((e.beta-40)/25,-1,1)});

/* ---------- render ---------- */
function drawWorld(l,s){if(l.photo){c.save();circ(0,0,1);c.clip();c.drawImage(l.photo,-1,-1,2,2);c.restore();if(l.over)l.over(time,1/s,l.h)}
  else if(l.glow){const s0=CanvasRenderingContext2D.prototype.stroke;c.save();c.globalCompositeOperation='lighter';
    c.stroke=function(){const lw=this.lineWidth,ga=this.globalAlpha;this.lineWidth=lw*4.5;this.globalAlpha=ga*.12;s0.call(this);this.lineWidth=lw*2.2;this.globalAlpha=ga*.28;s0.call(this);this.lineWidth=lw;this.globalAlpha=ga;s0.call(this)};
    try{l.draw(l.d,time,1/s,l.h)}finally{delete c.stroke;c.restore()}}
  else l.draw(l.d,time,1/s,l.h)}
function glowRing(x,y,s,h){const g=c.createRadialGradient(x,y,s*.9,x,y,s*1.18);g.addColorStop(0,col(h,65,.35));g.addColorStop(1,col(h,65,0));c.fillStyle=g;circ(x,y,s*1.18);c.fill()}
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;
  if(jump!=null){z+=(jump-z)*Math.min(1,dt*2.6);if(Math.abs(jump-z)<.002){z=jump;jump=null}}
  else{const f0=z-Math.floor(z);if(auto&&!touching)z+=BASE*(.18+.82*Math.pow(Math.sin(Math.PI*f0),2))*dt;
    z+=vel*dt;vel*=Math.pow(.03,dt);
    if(!auto&&!touching&&Math.abs(vel)<.05&&time-lastInput>.5)z+=(Math.round(z)-z)*Math.min(1,dt*1.6)}
  if(!reduce){mx+=(tmx-mx)*Math.min(1,dt*3);my+=(tmy-my)*Math.min(1,dt*3)}
  const L=Math.floor(z),f=z-L,cx0=cw/2,cy0=ch/2,hd=Math.hypot(cw,ch)/2,base=Math.min(cw,ch)*.42;
  const sAt=j=>base*Math.pow(K,f-j),fo=j=>LV[mod(L+j,N)].focus||[0,0];
  // each world can say where its next world sits (focus); the camera glides there as you zoom
  const P={0:[cx0-f*fo(0)[0]*sAt(0),cy0-f*fo(0)[1]*sAt(0)]};
  for(let j=1;j<=9;j++){const o=fo(j-1),s=sAt(j-1);P[j]=[P[j-1][0]+o[0]*s,P[j-1][1]+o[1]*s]}
  for(let j=-1;j>=-4;j--){const o=fo(j),s=sAt(j);P[j]=[P[j+1][0]-o[0]*s,P[j+1][1]-o[1]*s]}
  const cAt=j=>{const u=j-f;return[P[j][0]+mx*14*u,P[j][1]+my*10*u]};
  const covers=j=>{const[x,y]=cAt(j);return sAt(j)>hd+Math.hypot(x-cx0,y-cy0)};
  let st=-3;while(covers(st+1))st++;
  // outer world, softened as the next world grows (depth of field)
  const blur=clamp((sAt(st+1)/hd-.28)/.6,0,1),q=1/(1+2.6*blur),l0=LV[mod(L+st,N)];
  if(q<.97){oc.width=Math.max(1,Math.round(cv.width*q));oc.height=Math.max(1,Math.round(cv.height*q));c=octx}
  c.setTransform(dpr*(c===octx?q:1),0,0,dpr*(c===octx?q:1),0,0);
  const[x0,y0]=cAt(st),s0=sAt(st);c.fillStyle=paper(l0.h,x0,y0,s0);c.fillRect(0,0,cw,ch);c.save();c.translate(x0,y0);c.scale(s0,s0);drawWorld(l0,s0);c.restore();
  if(c===octx){c=mainC;c.setTransform(1,0,0,1,0,0);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(oc,0,0,cv.width,cv.height);c.fillStyle=`rgba(7,6,15,${blur*.25})`;c.fillRect(0,0,cv.width,cv.height)}
  c.setTransform(dpr,0,0,dpr,0,0);
  for(let j=st+1;j<Math.min(st+6,10);j++){
    const s=sAt(j);if(s<1.5)break;
    const l=LV[mod(L+j,N)],a=clamp((s-3)/40,0,1);if(a<=0)break;const[x,y]=cAt(j);
    c.save();c.globalAlpha=a;glowRing(x,y,s,l.h);wob(x,y,s,time);c.fillStyle=paper(l.h,x,y,s);c.fill();c.clip();
    c.translate(x,y);c.scale(s,s);drawWorld(l,s);c.restore();
    c.save();c.globalAlpha=a;c.lineWidth=1.6;c.strokeStyle=ink(l.h,.9);wob(x,y,s,time);c.stroke();c.restore()}
  // vignette + grain
  const vg=c.createRadialGradient(cx0,cy0,Math.min(cw,ch)*.35,cx0,cy0,hd);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=vg;c.fillRect(0,0,cw,ch);
  c.save();c.globalCompositeOperation='overlay';c.globalAlpha=.07;c.fillStyle=grain;c.fillRect(0,0,cw,ch);c.restore();
  // arrow label pointing to the next world, like the chart
  const cs=sAt(st+1),nl=LV[mod(L+st+1,N)],[nx,ny]=cAt(st+1);
  if(fontOK&&cs>3&&cs<base*.45){const al=clamp(1-cs/(base*.45),0,1)*clamp((cs-3)/10,0,1);c.save();c.globalAlpha=al;c.font='21px "Patrick Hand", cursive';
    const tw=c.measureText(nl.n).width,right=nx+cs+80+tw<cw-8,sg=right?1:-1,xa=nx+sg*(cs+6),xb=nx+sg*(cs+60);
    c.strokeStyle=c.fillStyle=ink(nl.h);c.lineWidth=1.5;c.shadowColor='rgba(7,6,15,.9)';c.shadowBlur=6;c.beginPath();c.moveTo(xa,ny);c.lineTo(xb,ny);c.moveTo(xb-sg*7,ny-4);c.lineTo(xb,ny);c.lineTo(xb-sg*7,ny+4);c.stroke();
    c.textBaseline='middle';c.textAlign=right?'left':'right';c.fillText(nl.n,xb+sg*9,ny+1);c.restore()}
  hud();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
