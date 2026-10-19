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
max-width:100vw;
max-height:100vh;
width:100%;
height:auto;
object-fit:contain;
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
const LOADING_IMG = 'https://i.ibb.co/ycm6v2Rd/file-000000000dc882088cbcf71248a48999.png';
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
      animationId = requestAnimationFrame(animate