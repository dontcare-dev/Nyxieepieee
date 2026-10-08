import React, { useState, useEffect, useRef } from 'react';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

html,body{height:100%}

body{
background:#07070a;
color:#e8e8e8;
font-family:'Chewy',cursive;
-webkit-font-smoothing:antialiased;
-moz-osx-font-smoothing:grayscale;
overflow-x:hidden;
}

.app{
min-height:100vh;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:16px;
padding:96px 20px 32px;
position:relative;
overflow:hidden;
}

.bg-gif{
position:fixed;
top:50%;
left:50%;
min-width:100%;
min-height:100%;
width:auto;
height:auto;
transform:translate(-50%,-50%);
object-fit:cover;
z-index:0;
pointer-events:none;
opacity:1;
}

.bg-overlay{
position:fixed;
inset:0;
background:
radial-gradient(circle at 50% 50%, rgba(0,0,0,.15), rgba(0,0,0,.55) 100%),
linear-gradient(180deg, rgba(7,7,10,.2), rgba(7,7,10,.5));
z-index:1;
pointer-events:none;
}

.flash-gif{
position:fixed;
top:50%;
left:50%;
min-width:100%;
min-height:100%;
width:auto;
height:auto;
transform:translate(-50%,-50%);
object-fit:cover;
z-index:25;
pointer-events:none;
opacity:0;
transition:opacity .35s ease;
}

.flash-gif.active{opacity:.55}

.gate{
position:fixed;
inset:0;
z-index:50;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
background:#07070a;
transition:opacity .8s cubic-bezier(.25,.1,.25,1),visibility .8s;
}

.gate.hidden{opacity:0;visibility:hidden;pointer-events:none}

.gate-title{
font-size:clamp(2.4rem,9vw,4rem);
color:#fff;
letter-spacing:.02em;
margin-bottom:8px;
opacity:0;
filter:blur(14px);
animation:gateTitle 1.6s cubic-bezier(.25,.1,.25,1) .3s forwards;
}

@keyframes gateTitle{to{opacity:1;filter:blur(0)}}

.gate-sub{
font-size:1rem;
color:rgba(255,255,255,.4);
letter-spacing:.08em;
margin-bottom:36px;
opacity:0;
animation:gateSub 1.4s cubic-bezier(.25,.1,.25,1) 1.2s forwards;
}

@keyframes gateSub{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

.gate-audio{
display:flex;
align-items:center;
gap:10px;
margin-bottom:22px;
padding:9px 16px;
background:rgba(255,255,255,.04);
border:1px solid rgba(255,255,255,.08);
border-radius:999px;
font-family:'Chewy',cursive;
font-size:.85rem;
letter-spacing:.06em;
color:rgba(255,255,255,.6);
cursor:pointer;
backdrop-filter:blur(12px);
-webkit-backdrop-filter:blur(12px);
opacity:0;
animation:gateBtn 1.4s cubic-bezier(.25,.1,.25,1) 1.55s forwards;
transition:background .3s ease,border-color .3s ease,color .3s ease;
}

.gate-audio:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.16);color:#fff}
.gate-audio svg{width:14px;height:14px;fill:currentColor;flex-shrink:0}

.enter-btn{
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.12);
color:#fff;
font-family:'Chewy',cursive;
font-size:1.1rem;
letter-spacing:.06em;
padding:14px 42px;
border-radius:999px;
cursor:pointer;
backdrop-filter:blur(12px);
-webkit-backdrop-filter:blur(12px);
opacity:0;
animation:gateBtn 1.4s cubic-bezier(.25,.1,.25,1) 1.8s forwards;
transition:background .3s ease,border-color .3s ease,transform .3s ease;
}

@keyframes gateBtn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.enter-btn:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);transform:translateY(-2px)}
.enter-btn:active{transform:translateY(0)}

.topbar{
position:fixed;
top:14px;
left:50%;
transform:translateX(-50%);
width:calc(100% - 32px);
max-width:420px;
z-index:30;
background:rgba(14,14,18,.82);
border:1px solid rgba(255,255,255,.08);
border-radius:999px;
padding:8px 12px 8px 8px;
display:flex;
align-items:center;
gap:10px;
backdrop-filter:blur(20px) saturate(140%);
-webkit-backdrop-filter:blur(20px) saturate(140%);
box-shadow:0 8px 32px rgba(0,0,0,.5);
}

.topbar-avatar-wrap{position:relative;flex-shrink:0;width:36px;height:36px}

.topbar-avatar{
width:36px;
height:36px;
border-radius:50%;
object-fit:cover;
display:block;
border:1px solid rgba(255,255,255,.1);
background:rgba(255,255,255,.05);
}

.topbar-status{position:absolute;bottom:0;right:0;width:11px;height:11px;border-radius:50%;border:2px solid #0e0e12}

.topbar-title{font-size:1.15rem;color:#fff;letter-spacing:.02em;flex-shrink:0}

.topbar-gif{
flex:1;
height:32px;
display:flex;
align-items:center;
justify-content:center;
overflow:hidden;
border-radius:8px;
margin:0 4px;
}

.topbar-gif img{height:100%;width:auto;max-width:100%;object-fit:contain;display:block;border-radius:8px}

.topbar-menu{
width:36px;
height:36px;
border-radius:50%;
background:transparent;
border:none;
cursor:pointer;
display:flex;
align-items:center;
justify-content:center;
color:rgba(255,255,255,.7);
transition:background .3s ease,color .3s ease;
flex-shrink:0;
}

.topbar-menu:hover{background:rgba(255,255,255,.06);color:#fff}
.topbar-menu svg{width:20px;height:20px;fill:currentColor}

.sidebar-backdrop{
position:fixed;
inset:0;
z-index:39;
background:rgba(0,0,0,.15);
backdrop-filter:blur(1px);
-webkit-backdrop-filter:blur(1px);
opacity:0;
visibility:hidden;
transition:opacity .4s ease,visibility .4s;
}

.sidebar-backdrop.open{opacity:1;visibility:visible}

.sidebar{
position:fixed;
top:0;
left:0;
bottom:0;
width:280px;
max-width:80vw;
z-index:40;
background:rgba(10,10,14,.18);
backdrop-filter:blur(32px) saturate(170%);
-webkit-backdrop-filter:blur(32px) saturate(170%);
border-right:1px solid rgba(255,255,255,.04);
padding:24px 16px;
display:flex;
flex-direction:column;
gap:8px;
transform:translateX(-100%);
transition:transform .45s cubic-bezier(.25,.1,.25,1);
overflow-y:auto;
box-shadow:8px 0 40px rgba(0,0,0,.3);
}

.sidebar.open{transform:translateX(0)}

.sidebar-header{padding:8px 12px 20px;display:flex;align-items:center;gap:10px}

.sidebar-header-avatar{
width:40px;
height:40px;
border-radius:50%;
object-fit:cover;
border:1px solid rgba(255,255,255,.15);
background:rgba(255,255,255,.05);
flex-shrink:0;
box-shadow:0 0 20px rgba(0,0,0,.5);
}

.sidebar-header-text{display:flex;flex-direction:column;gap:2px;min-width:0}

.sidebar-header-name{font-size:1.05rem;color:#fff;letter-spacing:.02em;text-shadow:0 1px 8px rgba(0,0,0,.7)}
.sidebar-header-sub{font-size:.75rem;color:rgba(255,255,255,.55);text-shadow:0 1px 6px rgba(0,0,0,.6)}

.sidebar-divider{height:1px;background:rgba(255,255,255,.08);margin:8px 4px}

.sidebar-item{
display:flex;
align-items:center;
gap:12px;
padding:12px 14px;
background:rgba(255,255,255,.015);
border:1px solid rgba(255,255,255,.03);
border-radius:12px;
color:rgba(255,255,255,.85);
text-decoration:none;
font-family:'Chewy',cursive;
font-size:.95rem;
letter-spacing:.02em;
cursor:pointer;
transition:background .3s ease,color .3s ease,border-color .3s ease;
width:100%;
text-align:left;
text-shadow:0 1px 6px rgba(0,0,0,.7);
}

.sidebar-item:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1);color:#fff}
.sidebar-item svg{width:20px;height:20px;fill:currentColor;flex-shrink:0}
.sidebar-item-text{flex:1;min-width:0}
.sidebar-item-sub{font-size:.7rem;color:rgba(255,255,255,.5);display:block;margin-top:2px}

.card{
position:relative;
z-index:2;
width:100%;
max-width:380px;
background:rgba(20,20,24,.55);
backdrop-filter:blur(20px) saturate(140%);
-webkit-backdrop-filter:blur(20px) saturate(140%);
border:1px solid rgba(255,255,255,.08);
border-radius:24px;
padding:0 24px 22px;
display:flex;
flex-direction:column;
align-items:center;
text-align:center;
box-shadow:0 20px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.04);
opacity:0;
transform:translateY(20px);
transition:opacity 1.2s cubic-bezier(.25,.1,.25,1),transform 1.2s cubic-bezier(.25,.1,.25,1);
overflow:hidden;
}

.card.mounted{opacity:1;transform:translateY(0)}

.profile-header{
position:relative;
width:calc(100% + 48px);
margin-left:-24px;
height:120px;
margin-bottom:56px;
flex-shrink:0;
}

.profile-banner{
width:100%;
height:100%;
background-size:cover;
background-position:center;
background-color:rgba(0,0,0,.2);
background-blend-mode:overlay;
}

.profile-header .avatar-wrap{
position:absolute;
bottom:-48px;
left:50%;
transform:translateX(-50%);
margin-bottom:0;
width:96px;
height:96px;
border-radius:50%;
border:4px solid rgba(20,20,24,.95);
background:#141418;
}

.profile-header .avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;border:none}
.profile-header .status-dot{position:absolute;bottom:4px;right:4px;width:18px;height:18px;border-radius:50%;border:3px solid #141418}

.avatar-wrap{position:relative;margin-bottom:14px}

.avatar{
width:96px;
height:96px;
border-radius:50%;
object-fit:cover;
display:block;
border:2px solid rgba(255,255,255,.1);
background:rgba(255,255,255,.05);
}

.status-dot{position:absolute;bottom:6px;right:6px;width:18px;height:18px;border-radius:50%;border:3px solid #141418}

.name{font-size:1.6rem;color:#fff;letter-spacing:.02em;margin-bottom:2px;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.handle{font-size:.9rem;color:rgba(255,255,255,.55);letter-spacing:.05em;margin-bottom:14px;text-shadow:0 1px 8px rgba(0,0,0,.6)}
.bio{font-size:.95rem;color:rgba(255,255,255,.8);line-height:1.65;margin-bottom:18px;white-space:pre-line;text-shadow:0 1px 8px rgba(0,0,0,.6)}

.activity{
width:100%;
background:rgba(255,255,255,.04);
border:1px solid rgba(255,255,255,.06);
border-radius:14px;
padding:10px 12px;
display:flex;
align-items:center;
gap:10px;
margin-bottom:10px;
text-align:left;
animation:slideUp .6s cubic-bezier(.25,.1,.25,1);
}

@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

.activity-icon{width:40px;height:40px;border-radius:10px;object-fit:cover;flex-shrink:0;background:rgba(255,255,255,.05)}
.activity-text{flex:1;min-width:0}
.activity-name{font-size:.85rem;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.activity-sub{font-size:.75rem;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.activity-source{
font-size:.65rem;
color:rgba(255,255,255,.4);
letter-spacing:.06em;
text-transform:uppercase;
margin-top:3px;
display:flex;
align-items:center;
gap:5px;
}

.activity-source svg{width:11px;height:11px;fill:#d51007;flex-shrink:0}

.progress-container{display:flex;flex-direction:column;gap:4px;margin-top:5px}

.progress-bar{width:100%;height:3px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden}
.progress-fill{height:100%;background:rgba(255,255,255,.6);transition:width 1s linear}
.progress-time{display:flex;justify-content:space-between;font-size:.65rem;color:rgba(255,255,255,.35)}

.socials{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:14px}

.social{
width:38px;
height:38px;
border-radius:50%;
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.1);
color:rgba(255,255,255,.8);
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
text-decoration:none;
transition:background .3s ease,color .3s ease,transform .3s ease,border-color .3s ease;
}

.social:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.25);color:#fff;transform:translateY(-2px)}
.social svg{width:18px;height:18px;fill:currentColor}

.strip{
position:relative;
z-index:2;
width:100%;
max-width:380px;
display:flex;
align-items:center;
justify-content:space-between;
gap:14px;
padding:14px 22px;
background:rgba(20,20,24,.55);
backdrop-filter:blur(20px) saturate(140%);
-webkit-backdrop-filter:blur(20px) saturate(140%);
border:1px solid rgba(255,255,255,.08);
border-radius:999px;
box-shadow:0 20px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.04);
opacity:0;
transform:translateY(20px);
transition:opacity 1.2s cubic-bezier(.25,.1,.25,1) .3s,transform 1.2s cubic-bezier(.25,.1,.25,1) .3s;
}

.strip.mounted{opacity:1;transform:translateY(0)}

.strip-clock{
font-size:1.15rem;
color:#fff;
letter-spacing:.04em;
display:flex;
align-items:center;
gap:6px;
flex-shrink:0;
text-shadow:0 2px 10px rgba(0,0,0,.5);
}

.strip-clock .ampm{
font-size:.85rem;
color:rgba(255,255,255,.7);
}

.strip-battery{
display:flex;
align-items:center;
gap:5px;
font-size:.8rem;
color:rgba(255,255,255,.55);
letter-spacing:.03em;
flex-shrink:0;
}

.strip-battery.charging{color:#43b581}

.strip-battery svg{width:20px;height:11px;flex-shrink:0}

.strip-divider{
width:1px;
height:20px;
background:rgba(255,255,255,.1);
flex-shrink:0;
}

.strip-weather{
display:flex;
align-items:center;
gap:8px;
flex-shrink:0;
}

.strip-weather svg{
width:26px;
height:26px;
color:rgba(255,255,255,.85);
flex-shrink:0;
}

.strip-temp{
font-size:1.15rem;
color:#fff;
letter-spacing:.04em;
text-shadow:0 2px 10px rgba(0,0,0,.5);
}

.music-toggle{
position:fixed;
bottom:20px;
right:20px;
z-index:26;
width:44px;
height:44px;
border-radius:50%;
background:rgba(20,20,24,.7);
border:1px solid rgba(255,255,255,.1);
color:rgba(255,255,255,.6);
font-size:1rem;
cursor:pointer;
display:flex;
align-items:center;
justify-content:center;
backdrop-filter:blur(12px);
-webkit-backdrop-filter:blur(12px);
transition:background .3s ease,color .3s ease;
}

.music-toggle:hover{background:rgba(255,255,255,.1);color:#fff}

.yt-hidden{
position:fixed;
top:-9999px;
left:-9999px;
width:1px;
height:1px;
opacity:0;
pointer-events:none;
}

@media (prefers-reduced-motion:reduce){
*,*::before,*::after{
transition-duration:.01ms !important;
animation-duration:.01ms !important;
}
.card{opacity:1;transform:translateY(0)}
.strip{opacity:1;transform:translateY(0)}
.gate-title,.gate-sub,.enter-btn,.gate-audio{opacity:1;filter:blur(0);animation:none}
.flash-gif{display:none}
}

@media (max-width:420px){
.card{padding:0 18px 18px;border-radius:20px}
.profile-header{height:104px;margin-bottom:48px}
.profile-header .avatar-wrap{width:84px;height:84px;bottom:-42px}
.name{font-size:1.45rem}
.music-toggle{bottom:14px;right:14px;width:40px;height:40px}
.topbar{width:calc(100% - 24px);top:10px}
.sidebar{width:260px}
.topbar-gif{height:28px}
.strip{padding:12px 16px;gap:10px}
.strip-clock{font-size:1rem}
.strip-clock .ampm{font-size:.75rem}
.strip-temp{font-size:1rem}
.strip-weather svg{width:22px;height:22px}
.strip-battery{font-size:.72rem}
.strip-battery svg{width:18px;height:10px}
}
`;

const YT_VIDEO_ID = 'Sv-hdv89Sv8';
const YT_VOLUME = 55;
const DISCORD_ID = '1429093326505640016';
const LASTFM_USER = 'Nyxieepie';
const LASTFM_KEY = '93b1e25b8d9f0ff55175904af9b336b7';
const TOPBAR_GIF = 'https://i.ibb.co/Xx6DndSg/1edbf144909f2bbfcff412393422984c-1.gif';
const BANNER_IMG = 'https://i.ibb.co/pvjjSdYR/4a512a8a2ff8250963067e665a0aded9.jpg';
const BG_GIF = 'https://i.ibb.co/VWgztGwR/d895c222e5fe92cb334de04e6d8f6828.gif';
const FLASH_GIF = 'https://i.ibb.co/fV5RJRSH/328c881f1929b778adcc7d9c1c75adcd.gif';
const WEATHER_LAT = 28.6139;
const WEATHER_LON = 77.2090;

const SOCIALS = {
  instagram: 'https://instagram.com/Deathyyyyyyyyyy',
  server: 'https://discord.gg/Y7mKtX9Bd',
  sds: 'https://silver-dev-studios.github.io/SDS/',
};

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

const LastfmIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.68 13.02c-.6-1.37-1.2-2.78-2.62-2.78-1.66 0-2.79 1.18-2.79 2.79 0 1.61 1.13 2.79 2.79 2.79 1.42 0 2.02-1.41 2.62-2.78zm5.71-1.55c-2.15-.43-3.43-1.28-3.43-2.79 0-1.51 1.25-2.42 3.05-2.42 1.94 0 3.02.85 3.58 2.26l1.9-.55C20.68 6.13 18.72 4.9 16 4.9c-2.87 0-5.02 1.5-5.02 3.83 0 2.05 1.51 3.32 4.34 3.87 2.25.44 3.13 1.03 3.13 2.17 0 1.24-1.21 2.03-3.19 2.03-2.16 0-3.06-.85-3.63-2.32l-1.89.55c.69 2.21 2.42 3.47 5.42 3.47 3.13 0 5.29-1.42 5.29-3.78 0-2.28-1.79-3.44-4.06-3.85zM24 12c0 6.63-5.37 12-12 12S0 18.63 0 12 5.37 0 12 0s12 5.37 12 12z" />
  </svg>
);

const SunIcon = () => (
  <g {...STROKE}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
  </g>
);

const MoonIcon = () => (
  <path {...STROKE} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
);

const CloudIcon = () => (
  <path {...STROKE} d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
);

const PartlyCloudyDay = () => (
  <g {...STROKE}>
    <circle cx="7" cy="7" r="2.6" />
    <line x1="7" y1="1.8" x2="7" y2="3" />
    <line x1="1.8" y1="7" x2="3" y2="7" />
    <line x1="3.3" y1="3.3" x2="4.2" y2="4.2" />
    <line x1="9.8" y1="4.2" x2="10.7" y2="3.3" />
    <line x1="3.3" y1="10.7" x2="4.2" y2="9.8" />
    <path d="M18 11.5h-1.1A6.5 6.5 0 1 0 10.5 20h7.5a4.25 4.25 0 0 0 0-8.5z" />
  </g>
);

const PartlyCloudyNight = () => (
  <g {...STROKE}>
    <path d="M9 7.5A4 4 0 0 1 4.5 3a4 4 0 0 0 5 5.2A4 4 0 0 1 9 7.5z" />
    <path d="M18 11.5h-1.1A6.5 6.5 0 1 0 10.5 20h7.5a4.25 4.25 0 0 0 0-8.5z" />
  </g>
);

const FogIcon = () => (
  <g {...STROKE}>
    <path d="M17 9h-1.26A7 7 0 1 0 9 17h8a4 4 0 0 0 0-8z" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </g>
);

const RainIcon = () => (
  <g {...STROKE}>
    <path d="M17 9h-1.26A7 7 0 1 0 9 17h8a4 4 0 0 0 0-8z" />
    <line x1="9" y1="19" x2="8" y2="22" />
    <line x1="13" y1="19" x2="12" y2="22" />
    <line x1="17" y1="19" x2="16" y2="22" />
  </g>
);

const SnowIcon = () => (
  <g {...STROKE}>
    <path d="M17 9h-1.26A7 7 0 1 0 9 17h8a4 4 0 0 0 0-8z" />
    <circle cx="9" cy="20" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="13" cy="21.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="17" cy="20" r="0.9" fill="currentColor" stroke="none" />
  </g>
);

const ThunderIcon = () => (
  <g {...STROKE}>
    <path d="M17 9h-1.26A7 7 0 1 0 9 17h8a4 4 0 0 0 0-8z" />
    <path d="M13 16l-2.5 4.5h2.5L12 24l4-5.5h-2.3l1.3-2.5z" fill="currentColor" stroke="none" />
  </g>
);

function WeatherIcon({ code, isDay }) {
  if (code === 0) return isDay ? <SunIcon /> : <MoonIcon />;
  if (code === 1 || code === 2) return isDay ? <PartlyCloudyDay /> : <PartlyCloudyNight />;
  if (code === 3) return <CloudIcon />;
  if (code === 45 || code === 48) return <FogIcon />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <RainIcon />;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <SnowIcon />;
  if (code >= 95) return <ThunderIcon />;
  return <CloudIcon />;
}

function useBattery() {
  const [battery, setBattery] = useState(null);
  useEffect(() => {
    if (!navigator.getBattery) return;
    let b;
    const update = () => setBattery({ level: Math.round(b.level * 100), charging: b.charging });
    navigator.getBattery().then((bat) => {
      b = bat;
      update();
      b.addEventListener('levelchange', update);
      b.addEventListener('chargingchange', update);
    });
    return () => {
      if (b) {
        b.removeEventListener('levelchange', update);
        b.removeEventListener('chargingchange', update);
      }
    };
  }, []);
  return battery;
}

function useWeather() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current=temperature_2m,weather_code,is_day&timezone=Asia%2FKolkata`;

    const fetchWeather = () => {
      fetch(url)
        .then((r) => r.json())
        .then((d) => {
          if (!alive) return;
          setData(d);
        })
        .catch(() => {});
    };

    fetchWeather();
    const i = setInterval(fetchWeather, 600000);

    return () => {
      alive = false;
      clearInterval(i);
    };
  }, []);

  return data;
}

function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return now;
}

function useLanyard(userId) {
  const [data, setData] = useState(null);
  const wsRef = useRef(null);
  const hbRef = useRef(null);

  useEffect(() => {
    let alive = true;
    let reconnectTimer = null;

    const connect = () => {
      const ws = new WebSocket('wss://api.lanyard.rest/socket');
      wsRef.current = ws;

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.op === 1) {
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
          clearInterval(hbRef.current);
          hbRef.current = setInterval(() => {
            if (ws.readyState === 1) ws.send(JSON.stringify({ op: 3 }));
          }, msg.d.heartbeat_interval);
        }
        if (msg.op === 0) setData(msg.d);
      };

      ws.onclose = () => {
        clearInterval(hbRef.current);
        if (alive) reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      alive = false;
      clearTimeout(reconnectTimer);
      clearInterval(hbRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [userId]);

  return data;
}

function useLastfm() {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    let alive = true;
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&limit=5&user=${LASTFM_USER}&api_key=${LASTFM_KEY}`;

    const fetchTrack = () => {
      fetch(url)
        .then((r) => r.json())
        .then((d) => {
          if (!alive) return;
          const tracks = d?.recenttracks?.track;
          if (!tracks || tracks.length === 0) return;
          const first = Array.isArray(tracks) ? tracks[0] : tracks;
          const nowPlaying = first['@attr']?.nowplaying === 'true';
          setTrack({
            name: first.name,
            artist: first.artist?.['#text'] || first.artist,
            image: first.image?.[2]?.['#text'] || first.image?.[3]?.['#text'],
            nowPlaying,
          });
        })
        .catch(() => {});
    };

    fetchTrack();
    const i = setInterval(fetchTrack, 30000);

    return () => {
      alive = false;
      clearInterval(i);
    };
  }, []);

  return track;
}

function useYouTubeAudio(shouldPlay) {
  const playerRef = useRef(null);
  const readyRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const init = () => {
      if (!window.YT || !window.YT.Player || playerRef.current) return;

      playerRef.current = new window.YT.Player('ytAudio', {
        height: '1',
        width: '1',
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          loop: 1,
          playlist: YT_VIDEO_ID,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (shouldPlay && !startedRef.current) {
              startedRef.current = true;
              const p = playerRef.current;
              p.mute();
              p.playVideo();
              setTimeout(() => {
                try {
                  p.unMute();
                  p.setVolume(YT_VOLUME);
                } catch {}
              }, 300);
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = init;
      document.head.appendChild(tag);
    } else {
      init();
    }
  }, []);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current || !p.playVideo) return;

    if (shouldPlay) {
      try {
        if (!startedRef.current) {
          startedRef.current = true;
          p.mute();
          p.playVideo();
          setTimeout(() => {
            try {
              p.unMute();
              p.setVolume(YT_VOLUME);
            } catch {}
          }, 300);
        } else {
          p.setVolume(YT_VOLUME);
          p.playVideo();
        }
      } catch {}
    } else {
      try {
        p.pauseVideo();
      } catch {}
    }
  }, [shouldPlay]);
}

function ProgressBar({ start, end }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const total = end - start;
      const elapsed = now - start;
      setProgress(Math.min(Math.max((elapsed / total) * 100, 0), 100));
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [start, end]);

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const now = Date.now();

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-time">
        <span>{fmt(Math.max(now - start, 0))}</span>
        <span>{fmt(end - start)}</span>
      </div>
    </div>
  );
}

function ProfileHeader({ presence }) {
  const [img, setImg] = useState(null);
  const [status, setStatus] = useState('offline');

  useEffect(() => {
    if (!presence) return;
    const u = presence.discord_user;
    if (!u) return;
    setImg(
      u.avatar
        ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=256`
        : `https://cdn.discordapp.com/embed/avatars/0.png`
    );
    setStatus(presence.discord_status);
  }, [presence]);

  const color =
    {
      online: '#43b581',
      idle: '#faa61a',
      dnd: '#f04747',
      offline: '#747f8d',
    }[status] || '#747f8d';

  return (
    <div className="profile-header">
      <div
        className="profile-banner"
        style={{ backgroundImage: `url(${BANNER_IMG})` }}
      />
      <div className="avatar-wrap">
        {img ? <img src={img} alt="" className="avatar" /> : <div className="avatar" />}
        <span className="status-dot" style={{ background: color }} />
      </div>
    </div>
  );
}

function TopbarAvatar({ presence }) {
  const [img, setImg] = useState(null);
  const [status, setStatus] = useState('offline');

  useEffect(() => {
    if (!presence) return;
    const u = presence.discord_user;
    if (!u) return;
    setImg(
      u.avatar
        ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/0.png`
    );
    setStatus(presence.discord_status);
  }, [presence]);

  const color =
    {
      online: '#43b581',
      idle: '#faa61a',
      dnd: '#f04747',
      offline: '#747f8d',
    }[status] || '#747f8d';

  return (
    <div className="topbar-avatar-wrap">
      {img ? <img src={img} alt="" className="topbar-avatar" /> : <div className="topbar-avatar" />}
      <span className="topbar-status" style={{ background: color }} />
    </div>
  );
}

function SidebarHeaderAvatar({ presence }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (!presence) return;
    const u = presence.discord_user;
    if (!u) return;
    setImg(
      u.avatar
        ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/0.png`
    );
  }, [presence]);

  return img ? (
    <img src={img} alt="" className="sidebar-header-avatar" />
  ) : (
    <div className="sidebar-header-avatar" />
  );
}

function Activity({ presence, lastfm }) {
  const activities = presence?.activities || [];
  const spotify = presence?.spotify;
  const listening = presence?.listening_to_spotify;
  const custom = activities.find((a) => a.type === 4);
  const game = activities.find((a) => a.type !== 4 && a.name !== 'Spotify');

  if (listening && spotify) {
    return (
      <div className="activity">
        <img src={spotify.album_art_url} alt="" className="activity-icon" />
        <div className="activity-text">
          <p className="activity-name">{spotify.song}</p>
          <p className="activity-sub">{spotify.artist}</p>
          <p className="activity-source">Spotify</p>
          {spotify.timestamps && (
            <ProgressBar start={spotify.timestamps.start} end={spotify.timestamps.end} />
          )}
        </div>
      </div>
    );
  }

  if (game) {
    const im = game.assets && game.assets.large_image;
    const src = im
      ? im.startsWith('mp:')
        ? `https://media.discordapp.net/${im.slice(3)}`
        : `https://cdn.discordapp.com/app-assets/${game.application_id}/${im}.png`
      : null;

    return (
      <div className="activity">
        {src ? <img src={src} alt="" className="activity-icon" /> : <div className="activity-icon" />}
        <div className="activity-text">
          <p className="activity-name">{game.name}</p>
          <p className="activity-sub">{game.details || game.state || 'Playing'}</p>
        </div>
      </div>
    );
  }

  if (lastfm) {
    return (
      <div className="activity">
        {lastfm.image ? (
          <img src={lastfm.image} alt="" className="activity-icon" />
        ) : (
          <div className="activity-icon" />
        )}
        <div className="activity-text">
          <p className="activity-name">{lastfm.name}</p>
          <p className="activity-sub">{lastfm.artist}</p>
          <p className="activity-source">
            <LastfmIcon />
            {lastfm.nowPlaying ? 'Now Playing' : 'Last Played'}
          </p>
        </div>
      </div>
    );
  }

  if (custom) {
    return (
      <div className="activity">
        <div className="activity-icon" />
        <div className="activity-text">
          <p className="activity-name">
            {(custom.emoji && custom.emoji.name) || ''} {custom.state}
          </p>
          <p className="activity-sub">Custom Status</p>
        </div>
      </div>
    );
  }

  return null;
}

function Socials() {
  return (
    <div className="socials">
      <a
        className="social"
        href={`https://discord.com/users/${DISCORD_ID}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Discord Profile"
        aria-label="Discord Profile"
      >
        <svg viewBox="0 0 24 24">
          <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </a>

      <a
        className="social"
        href={SOCIALS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        title="Instagram: @Deathyyyyyyyyyy"
        aria-label="Instagram"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      </a>
    </div>
  );
}

function BottomStrip({ mounted }) {
  const now = useClock();
  const weather = useWeather();
  const battery = useBattery();

  const hours12 = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  const cur = weather?.current;
  const temp = cur ? Math.round(cur.temperature_2m) : null;
  const fillW = battery ? Math.max(1, (battery.level / 100) * 13) : 0;

  return (
    <div className={`strip ${mounted ? 'mounted' : ''}`}>
      <div className="strip-clock">
        {hours12}:{minutes}
        <span className="ampm">{ampm}</span>
      </div>

      {battery && (
        <div className={`strip-battery ${battery.charging ? 'charging' : ''}`}>
          <svg viewBox="0 0 22 11" aria-hidden="true">
            <rect x="0.6" y="1.6" width="18.8" height="7.8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.1" />
            <rect x="2" y="3" width={fillW} height="5" rx="0.7" fill="currentColor" />
            <rect x="20.2" y="4" width="1.5" height="3" rx="0.5" fill="currentColor" />
          </svg>
          <span>
            {battery.level}%{battery.charging ? ' ⚡' : ''}
          </span>
        </div>
      )}

      <div className="strip-divider" />

      {cur && (
        <div className="strip-weather">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <WeatherIcon code={cur.weather_code} isDay={cur.is_day === 1} />
          </svg>
          <span className="strip-temp">{temp}°</span>
        </div>
      )}
    </div>
  );
}

function Sidebar({ open, onClose, presence }) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <SidebarHeaderAvatar presence={presence} />
          <div className="sidebar-header-text">
            <span className="sidebar-header-name">Nyxieepieee</span>
            <span className="sidebar-header-sub">@nyx</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <a
          className="sidebar-item"
          href={`https://discord.com/users/${DISCORD_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          <span className="sidebar-item-text">
            Discord Profile
            <span className="sidebar-item-sub">@nyx</span>
          </span>
        </a>

        <a
          className="sidebar-item"
          href={SOCIALS.server}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          <span className="sidebar-item-text">
            Discord Server
            <span className="sidebar-item-sub">Join the server</span>
          </span>
        </a>

        <a
          className="sidebar-item"
          href={SOCIALS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
          <span className="sidebar-item-text">
            Instagram
            <span className="sidebar-item-sub">@Deathyyyyyyyyyy</span>
          </span>
        </a>

        <div className="sidebar-divider" />

        <a
          className="sidebar-item"
          href={SOCIALS.sds}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 2 4 6v6c0 5 3.4 9.7 8 10 4.6-.3 8-5 8-10V6l-8-4zm0 2.2 6 3v4.8c0 4.1-2.7 7.9-6 8.2-3.3-.3-6-4.1-6-8.2V7.2l6-3z" />
          </svg>
          <span className="sidebar-item-text">
            Silver Dev Studios
            <span className="sidebar-item-sub">silver-dev-studios.github.io</span>
          </span>
        </a>
      </aside>
    </>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const presence = useLanyard(DISCORD_ID);
  const lastfm = useLastfm();

  useYouTubeAudio(entered && musicOn);

  useEffect(() => {
    if (entered) {
      requestAnimationFrame(() => setMounted(true));
    }
  }, [entered]);

  useEffect(() => {
    if (!entered) return;
    let timeoutId;
    const interval = setInterval(() => {
      setFlashOn(true);
      timeoutId = setTimeout(() => setFlashOn(false), 2000);
    }, 18000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [entered]);

  const liveName = presence?.discord_user?.username || 'nyx';

  return (
    <>
      <style>{styles}</style>

      <img className="bg-gif" src={BG_GIF} alt="" aria-hidden="true" />
      <div className="bg-overlay" />

      <img
        className={`flash-gif ${flashOn ? 'active' : ''}`}
        src={FLASH_GIF}
        alt=""
        aria-hidden="true"
      />

      <div id="ytAudio" className="yt-hidden" />

      <div className={`gate ${entered ? 'hidden' : ''}`}>
        <h1 className="gate-title">Nyxieepieee</h1>
        <p className="gate-sub">Meowmeow</p>
        <button
          className="gate-audio"
          onClick={() => setMusicOn((v) => !v)}
          aria-label={musicOn ? 'Disable music' : 'Enable music'}
        >
          <svg viewBox="0 0 24 24">
            {musicOn ? (
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
            ) : (
              <path d="M12 3v10.55a4 4 0 1 0 2 3.45V7h4V3h-6zM3.27 2 2 3.27l18.73 18.73L22 20.73 3.27 2z" />
            )}
          </svg>
          {musicOn ? 'Music On' : 'Music Off'}
        </button>
        <button className="enter-btn" onClick={() => setEntered(true)}>
          Enter
        </button>
      </div>

      {entered && (
        <>
          <div className="topbar">
            <TopbarAvatar presence={presence} />
            <span className="topbar-title">{liveName}</span>
            <div className="topbar-gif">
              <img src={TOPBAR_GIF} alt="" aria-hidden="true" />
            </div>
            <button
              className="topbar-menu"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24">
                  <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71l-1.42-1.42L9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
                </svg>
              )}
            </button>
          </div>

          <Sidebar
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            presence={presence}
          />

          <div className="app">
            <div className={`card ${mounted ? 'mounted' : ''}`}>
              <ProfileHeader presence={presence} />
              <h1 className="name">{liveName}</h1>
              <p className="handle">@nyx · Meowmeow</p>
              <p className="bio">
                {'Web development and bot developer i am nyx. I am 15 years old\nI love life'}
              </p>
              <Activity presence={presence} lastfm={lastfm} />
              <Socials />
            </div>

            <BottomStrip mounted={mounted} />
          </div>

          <button
            className="music-toggle"
            onClick={() => setMusicOn((v) => !v)}
            aria-label={musicOn ? 'Mute music' : 'Unmute music'}
          >
            {musicOn ? '♪' : '✕'}
          </button>
        </>
      )}
    </>
  );
      }
