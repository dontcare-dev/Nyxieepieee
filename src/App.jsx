import React, { useState, useEffect, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden;background:#07070a;}
body{color:#e8e8e8;font-family:'Chewy',cursive;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}

.app{height:100vh;width:100vw;display:flex;flex-direction:column;align-items:center;padding:80px 20px 20px;position:relative;overflow:hidden;}
.bg-gif{position:fixed;top:50%;left:50%;min-width:100%;min-height:100%;width:auto;height:auto;transform:translate(-50%,-50%);object-fit:cover;z-index:0;pointer-events:none;opacity:1;}
.bg-overlay{position:fixed;inset:0;background:radial-gradient(circle at 50% 50%, rgba(0,0,0,.15), rgba(0,0,0,.55) 100%),linear-gradient(180deg, rgba(7,7,10,.2), rgba(7,7,10,.5));z-index:1;pointer-events:none;}
.heart-canvas{position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:5;}

.flash-gif{position:fixed;top:50%;left:50%;min-width:100%;min-height:100%;width:auto;height:auto;transform:translate(-50%,-50%);object-fit:cover;z-index:25;pointer-events:none;opacity:0;transition:opacity .35s ease;}
.flash-gif.active{opacity:.55}

.gate{
position:fixed;
inset:0;
z-index:50;
display:flex;
align-items:center;
justify-content:center;
background:#07070a;
cursor:pointer;
transition:opacity .8s cubic-bezier(.25,.1,.25,1),visibility .8s;
}
.gate.hidden{opacity:0;visibility:hidden;pointer-events:none}

.gate-img{
position:absolute;
top:0;
left:0;
width:100vw;
height:100vh;
object-fit:cover;
display:block;
}

.navbar{position:fixed;top:14px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:440px;z-index:30;background:rgba(14,14,18,.82);border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:6px 8px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);box-shadow:0 8px 32px rgba(0,0,0,.5);}
.nav-item{display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:999px;color:rgba(255,255,255,.5);text-decoration:none;font-size:.9rem;letter-spacing:.04em;cursor:pointer;transition:background .3s ease,color .3s ease;border:none;background:transparent;font-family:'Chewy',cursive;}
.nav-item.active{background:rgba(255,255,255,.1);color:#fff;}
.nav-item svg{width:18px;height:18px;fill:currentColor;}
.nav-item:hover:not(.active){color:rgba(255,255,255,.8);}

.page-content{position:relative;z-index:10;width:100%;max-width:440px;height:100%;display:flex;flex-direction:column;gap:16px;animation:pageFade 0.5s ease forwards;overflow-y:auto;padding-bottom:20px;scrollbar-width:none;}
.page-content::-webkit-scrollbar{display:none;}
@keyframes pageFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.profile-section{display:flex;align-items:center;gap:20px;padding:10px;}
.avatar-wrap{position:relative;flex-shrink:0;width:90px;height:90px;}
.avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;background:rgba(255,255,255,.05);}
.status-dot{position:absolute;bottom:2px;right:2px;width:20px;height:20px;border-radius:50%;border:4px solid #07070a;}
.profile-info{display:flex;flex-direction:column;gap:2px;}
.profile-name{font-size:2rem;color:#fff;letter-spacing:.02em;line-height:1.1;}
.profile-handle{font-size:1rem;color:rgba(255,255,255,.45);letter-spacing:.02em;}
.profile-bio{font-size:.9rem;color:rgba(255,255,255,.7);margin-top:8px;line-height:1.4;}

.weather-card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:20px;padding:20px;display:flex;justify-content:space-between;align-items:center;}
.weather-left{display:flex;flex-direction:column;gap:4px;}
.weather-time{font-size:2rem;color:#fff;line-height:1;letter-spacing:.02em;}
.weather-time .ampm{font-size:1.1rem;margin-left:4px;color:rgba(255,255,255,.8);}
.weather-date{font-size:.75rem;color:rgba(255,255,255,.4);letter-spacing:.14em;text-transform:uppercase;margin-top:4px;}
.weather-mid{display:flex;flex-direction:column;align-items:center;gap:8px;}
.weather-city{font-size:.7rem;color:rgba(255,255,255,.5);letter-spacing:.18em;text-transform:uppercase;}
.weather-toggle{display:flex;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:3px;}
.weather-toggle button{background:transparent;border:none;font-family:'Chewy',cursive;font-size:.8rem;color:rgba(255,255,255,.5);width:32px;height:28px;border-radius:999px;cursor:pointer;transition:background .3s ease,color .3s ease;}
.weather-toggle button.active{background:rgba(255,255,255,.12);color:#fff;}
.weather-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px;}
.weather-icon{width:44px;height:44px;color:rgba(255,255,255,.9);margin-bottom:4px;}
.weather-temp{font-size:2rem;color:#fff;line-height:1;}
.weather-cond{font-size:.85rem;color:#fff;margin-top:2px;text-align:right;}
.weather-feels{font-size:.75rem;color:rgba(255,255,255,.4);margin-top:2px;}

.activity-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:12px 14px;display:flex;align-items:center;gap:12px;}
.activity-icon{width:40px;height:40px;border-radius:10px;object-fit:cover;flex-shrink:0;background:rgba(255,255,255,.05)}
.activity-text{flex:1;min-width:0}
.activity-name{font-size:.95rem;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.activity-sub{font-size:.8rem;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.activity-source{font-size:.7rem;color:rgba(255,255,255,.4);letter-spacing:.06em;text-transform:uppercase;margin-top:2px;display:flex;align-items:center;gap:4px}
.activity-source svg{width:10px;height:10px;fill:#d51007;flex-shrink:0}
.progress-container{display:flex;flex-direction:column;gap:4px;margin-top:6px}
.progress-bar{width:100%;height:3px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden}
.progress-fill{height:100%;background:rgba(255,255,255,.6);transition:width 1s linear}
.progress-time{display:flex;justify-content:space-between;font-size:.65rem;color:rgba(255,255,255,.35)}

.socials{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:10px;}
.social{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.6);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;transition:background .3s ease,color .3s ease,transform .3s ease,border-color .3s ease;flex-shrink:0;}
.social:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#fff;transform:translateY(-2px)}
.social svg{width:20px !important;height:20px !important;max-width:20px;max-height:20px;fill:currentColor}

.page-title{font-size:1.8rem;color:#fff;margin-bottom:4px;}
.page-subtitle{font-size:.9rem;color:rgba(255,255,255,.5);margin-bottom:10px;}

.project-wide-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;color:inherit;transition:transform .3s ease,border-color .3s ease;cursor:pointer;}
.project-wide-card:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.15)}
.project-preview{width:100%;height:160px;object-fit:cover;border-bottom:1px solid rgba(255,255,255,.08);}
.project-content{padding:16px;display:flex;flex-direction:column;gap:6px;}
.project-card-title{font-size:1.2rem;color:#fff;}
.project-card-desc{font-size:.85rem;color:rgba(255,255,255,.6);line-height:1.4;}

.contact-form{display:flex;flex-direction:column;gap:14px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:20px;padding:20px;}
.form-group{display:flex;flex-direction:column;gap:4px;}
.form-group label{font-size:.85rem;color:rgba(255,255,255,.6);margin-left:4px;}
.form-input{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;color:#fff;font-family:'Chewy',cursive;font-size:.95rem;outline:none;transition:border-color .3s ease,background .3s ease;}
.form-input:focus{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.06)}
textarea.form-input{resize:vertical;min-height:90px;}
.error-text{color:#ff4a4a;font-size:.75rem;margin-left:4px;margin-top:2px;}
.submit-btn{background:#fff;color:#000;border:none;border-radius:12px;padding:14px;font-family:'Chewy',cursive;font-size:1rem;cursor:pointer;transition:opacity .3s ease,transform .2s ease;margin-top:4px;}
.submit-btn:hover:not(:disabled){opacity:.9;transform:translateY(-2px)}
.submit-btn:active:not(:disabled){transform:translateY(0)}
.submit-btn:disabled{opacity:.5;cursor:not-allowed;}
.success-message{background:rgba(67, 181, 129, 0.15);border:1px solid rgba(67, 181, 129, 0.3);color:#43b581;padding:16px;border-radius:14px;text-align:center;font-size:1rem;}

.music-toggle{position:fixed;bottom:20px;right:20px;z-index:26;width:44px;height:44px;border-radius:50%;background:rgba(20,20,24,.7);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:background .3s ease,color .3s ease;}
.music-toggle:hover{background:rgba(255,255,255,.1);color:#fff}
.yt-hidden{position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none}

@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms !important;animation-duration:.01ms !important}.flash-gif{display:none}.heart-canvas{display:none}}
@media (max-width:420px){.navbar{width:calc(100% - 20px);top:10px;padding:6px 4px;}.nav-item{padding:8px 12px;font-size:.8rem;gap:4px;}.nav-item svg{width:16px;height:16px;}.profile-section{gap:16px;padding:10px 0;}.avatar-wrap{width:80px;height:80px;}.profile-name{font-size:1.7rem;}.profile-handle{font-size:.9rem;}.weather-time{font-size:1.6rem;}.weather-time .ampm{font-size:.9rem;}.weather-temp{font-size:1.6rem;}.weather-icon{width:38px;height:38px;}.music-toggle{bottom:14px;right:14px;width:40px;height:40px;}}
`;

const YT_VIDEO_ID = 'Qy9LTRu89FA';
const YT_VOLUME = 55;
const DISCORD_ID = '1429093326505640016';
const LASTFM_USER = 'Nyxieepie';
const LASTFM_KEY = '93b1e25b8d9f0ff55175904af9b336b7';
const BG_GIF = 'https://i.ibb.co/VWgztGwR/d895c222e5fe92cb334de04e6d8f6828.gif';
const FLASH_GIF = 'https://i.ibb.co/fV5RJRSH/328c881f1929b778adcc7d9c1c75adcd.gif';
const LOADING_IMG = 'https://i.ibb.co/8L02zTZH/11579.gif';
const BLURRY_PREVIEW = 'https://i.ibb.co/N6NNnnDv/nyx-blurry-1.webp';
const WEATHER_LAT = 28.6139;
const WEATHER_LON = 77.2090;
const WEATHER_CITY = 'Delhi';
const SITE_URL = 'https://dontcare-dev.github.io/Nyxieepieee/';

const SOCIALS = {
  instagram: 'https://instagram.com/Deathyyyyyyyyyy',
  server: 'https://discord.gg/Y7mKtX9Bd',
  sds: 'https://silver-dev-studios.github.io/SDS/'
};

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

const LastfmIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.68 13.02c-.6-1.37-1.2-2.78-2.62-2.78-1.66 0-2.79 1.18-2.79 2.79 0 1.61 1.13 2.79 2.79 2.79 1.42 0 2.02-1.41 2.62-2.78zm5.71-1.55c-2.15-.43-3.43-1.28-3.43-2.79 0-1.51 1.25-2.42 3.05-2.42 1.94 0 3.02.85 3.58 2.26l1.9-.55C20.68 6.13 18.72 4.9 16 4.9c-2.87 0-5.02 1.5-5.02 3.83 0 2.05 1.51 3.32 4.34 3.87 2.25.44 3.13 1.03 3.13 2.17 0 1.24-1.21 2.03-3.19 2.03-2.16 0-3.06-.85-3.63-2.32l-1.89.55c.69 2.21 2.42 3.47 5.42 3.47 3.13 0 5.29-1.42 5.29-3.78 0-2.28-1.79-3.44-4.06-3.85zM24 12c0 6.63-5.37 12-12 12S0 18.63 0 12 5.37 0 12 0s12 5.37 12 12z" />
  </svg>
);

const SunIcon = () => (
  <g {...STROKE}>
    <circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="4.93" y1="4.93" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.07" y2="19.07" /><line x1="4.93" y1="19.07" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
  </g>
);
const MoonIcon = () => <path {...STROKE} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />;
const CloudIcon = () => <path {...STROKE} d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />;
const PartlyCloudyDay = () => (
  <g {...STROKE}>
    <circle cx="7" cy="7" r="2.6" /><line x1="7" y1="1.8" x2="7" y2="3" /><line x1="1.8" y1="7" x2="3" y2="7" /><line x1="3.3" y1="3.3" x2="4.2" y2="4.2" /><line x1="9.8" y1="4.2" x2="10.7" y2="3.3" /><line x1="3.3" y1="10.7" x2="4.2" y2="9.8" /><path d="M18 11.5h-1.1A6.5 6.5 0 1 0 10.5 20h7.5a4.25 4.25 0 0 0 0-8.5z" />
  </g>
);
const PartlyCloudyNight = () => (
  <g {...STROKE}>
    <path d="M9 7.5A4 4 0 0 1 4.5 3a4 4 0 0 0 5 5.2A4 4 0 0 1 9 7.5z" /><path d="M18 11.5h-1.1A6.5 6.5 0 1 0 10.5 20h7.5a4.25 4.25 0 0 0 0-8.5z" />
  </g>
);
const FogIcon = () => <g {...STROKE}><path d="M17 9h-1.26A7 7 0 1 0 9 17h8a4 4 0 0 0 0-8z" /><line x1="4" y1="21" x2="20" y2="21" /></g>;
const RainIcon = () => <g {...STROKE}><path d="M17 9h-1.26A7 7 0 1 0 9 17h8a4 4 0 0 0 0-8z" /><line x1="9" y1="19" x2="8" y2="22" /><line x1="13" y1="19" x2="12" y2="22" /><line x1="17" y1="19" x2="16" y2="22" /></g>;
const SnowIcon = () => <g {...STROKE}><path d="M17 9h-1.26A7 7 0 1 0 9 17h8a4 4 0 0 0 0-8z" /><circle cx="9" cy="20" r="0.9" fill="currentColor" stroke="none" /><circle cx="13" cy="21.5" r="0.9" fill="currentColor" stroke="none" /><circle cx="17" cy="20" r="0.9" fill="currentColor" stroke="none" /></g>;
const ThunderIcon = () => <g {...STROKE}><path d="M17 9h-1.26A7 7 0 1 0 9 17h8a4 4 0 0 0 0-8z" /><path d="M13 16l-2.5 4.5h2.5L12 24l4-5.5h-2.3l1.3-2.5z" fill="currentColor" stroke="none" /></g>;

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

function weatherLabel(code) {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 75) return 'Snow';
  if (code >= 95) return 'Thunderstorm';
  return 'Clear';
}

function useWeather() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current=temperature_2m,apparent_temperature,weather_code,is_day&timezone=Asia%2FKolkata`;
    const fetchWeather = () => {
      fetch(url).then(r => r.json()).then(d => { if (alive) setData(d); }).catch(() => {});
    };
    fetchWeather();
    const i = setInterval(fetchWeather, 600000);
    return () => { alive = false; clearInterval(i); };
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
          hbRef.current = setInterval(() => { if (ws.readyState === 1) ws.send(JSON.stringify({ op: 3 })); }, msg.d.heartbeat_interval);
        }
        if (msg.op === 0) setData(msg.d);
      };
      ws.onclose = () => { clearInterval(hbRef.current); if (alive) reconnectTimer = setTimeout(connect, 3000); };
      ws.onerror = () => ws.close();
    };
    connect();
    return () => { alive = false; clearTimeout(reconnectTimer); clearInterval(hbRef.current); if (wsRef.current) wsRef.current.close(); };
  }, [userId]);
  return data;
}

function useLastfm() {
  const [track, setTrack] = useState(null);
  useEffect(() => {
    let alive = true;
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&limit=5&user=${LASTFM_USER}&api_key=${LASTFM_KEY}`;
    const fetchTrack = () => {
      fetch(url).then(r => r.json()).then(d => {
        if (!alive) return;
        const tracks = d?.recenttracks?.track;
        if (!tracks || tracks.length === 0) return;
        const first = Array.isArray(tracks) ? tracks[0] : tracks;
        const nowPlaying = first['@attr']?.nowplaying === 'true';
        setTrack({ name: first.name, artist: first.artist?.['#text'] || first.artist, image: first.image?.[2]?.['#text'] || first.image?.[3]?.['#text'], nowPlaying });
      }).catch(() => {});
    };
    fetchTrack();
    const i = setInterval(fetchTrack, 30000);
    return () => { alive = false; clearInterval(i); };
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
        height: '1', width: '1', videoId: YT_VIDEO_ID,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, playsinline: 1, iv_load_policy: 3, loop: 1, playlist: YT_VIDEO_ID },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (shouldPlay && !startedRef.current) {
              startedRef.current = true;
              const p = playerRef.current;
              p.mute(); p.playVideo();
              setTimeout(() => { try { p.unMute(); p.setVolume(YT_VOLUME); } catch {} }, 300);
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
    } else init();
  }, []);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current || !p.playVideo) return;
    if (shouldPlay) {
      try {
        if (!startedRef.current) {
          startedRef.current = true;
          p.mute(); p.playVideo();
          setTimeout(() => { try { p.unMute(); p.setVolume(YT_VOLUME); } catch {} }, 300);
        } else { p.setVolume(YT_VOLUME); p.playVideo(); }
      } catch {}
    } else { try { p.pauseVideo(); } catch {} }
  }, [shouldPlay]);
}

function useHearts(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const hearts = [];
    let mouseX = -100;
    let mouseY = -100;

    class HeartParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 10;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = -(Math.random() * 2 + 1);
        this.opacity = 1;
        this.fadeRate = Math.random() * 0.015 + 0.01;
        this.hue = Math.random() * 30 + 340;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.fadeRate;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.opacity})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size / 4);
        ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + this.size / 2);
        ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size * 0.8), this.x, this.y + (this.size * 1.1), this.x, this.y + this.size * 1.3);
        ctx.bezierCurveTo(this.x, this.y + (this.size * 1.1), this.x + this.size / 2, this.y + (this.size * 0.8), this.x + this.size / 2, this.y + this.size / 2);
        ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + this.size / 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    const handleMove = (x, y) => {
      mouseX = x;
      mouseY = y;
      for (let i = 0; i < 2; i++) hearts.push(new HeartParticle(mouseX, mouseY));
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        if (hearts[i].opacity <= 0) hearts.splice(i, 1);
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [canvasRef]);
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
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className="progress-time"><span>{fmt(Math.max(now - start, 0))}</span><span>{fmt(end - start)}</span></div>
    </div>
  );
}

function MainPage({ presence, lastfm }) {
  const [img, setImg] = useState(null);
  const [status, setStatus] = useState('offline');
  
  useEffect(() => {
    if (!presence) return;
    const u = presence.discord_user;
    if (!u) return;
    setImg(u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=256` : `https://cdn.discordapp.com/embed/avatars/0.png`);
    setStatus(presence.discord_status);
  }, [presence]);

  const statusColor = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' }[status] || '#747f8d';
  const liveName = presence?.discord_user?.username || 'nyx';

  const activities = presence?.activities || [];
  const spotify = presence?.spotify;
  const listening = presence?.listening_to_spotify;
  const custom = activities.find((a) => a.type === 4);
  const game = activities.find((a) => a.type !== 4 && a.name !== 'Spotify');

  const now = useClock();
  const weather = useWeather();
  const [unit, setUnit] = useState('C');
  
  const hours12 = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  
  const cur = weather?.current;
  const toUnit = (c) => (c === null || c === undefined) ? '--' : Math.round(unit === 'C' ? c : (c * 9) / 5 + 32);

  return (
    <div className="page-content">
      <div className="profile-section">
        <div className="avatar-wrap">
          {img ? <img src={img} alt="" className="avatar" /> : <div className="avatar" />}
          <span className="status-dot" style={{ background: statusColor }} />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{liveName}</h1>
          <p className="profile-handle">@nyx</p>
          <p className="profile-bio">Web development and bot developer i am nyx.<br/>I am 15 years old. I love life.</p>
        </div>
      </div>

      {listening && spotify ? (
        <div className="activity-card">
          <img src={spotify.album_art_url} alt="" className="activity-icon" />
          <div className="activity-text">
            <p className="activity-name">{spotify.song}</p>
            <p className="activity-sub">{spotify.artist}</p>
            <p className="activity-source">Spotify</p>
            {spotify.timestamps && <ProgressBar start={spotify.timestamps.start} end={spotify.timestamps.end} />}
          </div>
        </div>
      ) : game ? (
        <div className="activity-card">
          {game.assets?.large_image ? (
            <img src={game.assets.large_image.startsWith('mp:') ? `https://media.discordapp.net/${game.assets.large_image.slice(3)}` : `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png`} alt="" className="activity-icon" />
          ) : <div className="activity-icon" />}
          <div className="activity-text">
            <p className="activity-name">{game.name}</p>
            <p className="activity-sub">{game.details || game.state || 'Playing'}</p>
          </div>
        </div>
      ) : lastfm ? (
        <div className="activity-card">
          {lastfm.image ? <img src={lastfm.image} alt="" className="activity-icon" /> : <div className="activity-icon" />}
          <div className="activity-text">
            <p className="activity-name">{lastfm.name}</p>
            <p className="activity-sub">{lastfm.artist}</p>
            <p className="activity-source"><LastfmIcon />{lastfm.nowPlaying ? 'Now Playing' : 'Last Played'}</p>
          </div>
        </div>
      ) : custom ? (
        <div className="activity-card">
          <div className="activity-icon" />
          <div className="activity-text">
            <p className="activity-name">{custom.emoji?.name} {custom.state}</p>
            <p className="activity-sub">Custom Status</p>
          </div>
        </div>
      ) : null}

      <div className="weather-card">
        <div className="weather-left">
          <div className="weather-time">{hours12}:{minutes}<span className="ampm">{ampm}</span></div>
          <div className="weather-date">{dateStr}</div>
        </div>
        <div className="weather-mid">
          <div className="weather-city">{WEATHER_CITY}</div>
          <div className="weather-toggle">
            <button className={unit === 'C' ? 'active' : ''} onClick={() => setUnit('C')}>C</button>
            <button className={unit === 'F' ? 'active' : ''} onClick={() => setUnit('F')}>F</button>
          </div>
        </div>
        <div className="weather-right">
          {cur && (
            <>
              <svg className="weather-icon" viewBox="0 0 24 24"><WeatherIcon code={cur.weather_code} isDay={cur.is_day === 1} /></svg>
              <div className="weather-temp">{toUnit(cur.temperature_2m)}°</div>
              <div className="weather-cond">{weatherLabel(cur.weather_code)}</div>
              <div className="weather-feels">feels like {toUnit(cur.apparent_temperature)}°</div>
            </>
          )}
        </div>
      </div>

      <div className="socials">
        <a className="social" href={`https://discord.com/users/${DISCORD_ID}`} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24"><path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
        </a>
        <a className="social" href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
        </a>
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="page-content">
      <h1 className="page-title">Projects</h1>
      <p className="page-subtitle">Things I've built.</p>
      
      <a className="project-wide-card" href={SITE_URL} target="_blank" rel="noopener noreferrer">
        <img src={BLURRY_PREVIEW} alt="Nyxieepieee Preview" className="project-preview" />
        <div className="project-content">
          <h3 className="project-card-title">Nyxieepieee</h3>
          <p className="project-card-desc">My personal portfolio and bio site. Built with React, featuring live Discord presence, Last.fm integration, and custom animations.</p>
        </div>
      </a>
    </div>
  );
}

function ContactPage() {
  const [state, handleSubmit] = useForm('mvkznwzw');

  if (state.succeeded) {
    return (
      <div className="page-content">
        <h1 className="page-title">Contact</h1>
        <div className="success-message">
          Thanks for reaching out! I'll get back to you soon.
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Contact</h1>
      <p className="page-subtitle">Get in touch with me.</p>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" required className="form-input" placeholder="Your name" />
          <ValidationError prefix="Name" field="name" errors={state.errors} className="error-text" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required className="form-input" placeholder="your@email.com" />
          <ValidationError prefix="Email" field="email" errors={state.errors} className="error-text" />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required className="form-input" placeholder="What's on your mind?" />
          <ValidationError prefix="Message" field="message" errors={state.errors} className="error-text" />
        </div>

        <button type="submit" disabled={state.submitting} className="submit-btn">
          {state.submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const canvasRef = useRef(null);

  const presence = useLanyard(DISCORD_ID);
  const lastfm = useLastfm();
  
  useHearts(canvasRef);
  useYouTubeAudio(entered && musicOn);

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

  return (
    <>
      <style>{styles}</style>

      <img className="bg-gif" src={BG_GIF} alt="" aria-hidden="true" />
      <div className="bg-overlay" />
      
      <canvas ref={canvasRef} className="heart-canvas" />

      <img className={`flash-gif ${flashOn ? 'active' : ''}`} src={FLASH_GIF} alt="" aria-hidden="true" />
      <div id="ytAudio" className="yt-hidden" />

      <div className={`gate ${entered ? 'hidden' : ''}`} onClick={() => setEntered(true)}>
        <img src={LOADING_IMG} alt="Enter" className="gate-img" />
      </div>

      {entered && (
        <>
          <nav className="navbar">
            <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              home
            </button>
            <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              projects
            </button>
            <button className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              contact
            </button>
          </nav>

          <div className="app">
            {activeTab === 'home' && <MainPage presence={presence} lastfm={lastfm} />}
            {activeTab === 'projects' && <ProjectsPage />}
            {activeTab === 'contact' && <ContactPage />}
          </div>

          <button className="music-toggle" onClick={() => setMusicOn((v) => !v)} aria-label={musicOn ? 'Mute music' : 'Unmute music'}>
            {musicOn ? '♪' : '✕'}
          </button>
        </>
      )}
    </>
  );
}