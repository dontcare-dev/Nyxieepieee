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
align-items:center;
justify-content:center;
padding:32px 20px;
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
opacity:.75;
}

.bg-overlay{
position:fixed;
inset:0;
background:
radial-gradient(circle at 50% 50%, rgba(0,0,0,.25), rgba(0,0,0,.75) 100%),
linear-gradient(180deg, rgba(7,7,10,.35), rgba(7,7,10,.7));
z-index:1;
pointer-events:none;
}

.gate{
position:fixed;
inset:0;
z-index:10;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
background:#07070a;
transition:opacity .8s cubic-bezier(.25,.1,.25,1),visibility .8s;
}

.gate.hidden{
opacity:0;
visibility:hidden;
pointer-events:none;
}

.gate-title{
font-size:clamp(2.4rem,9vw,4rem);
color:#fff;
letter-spacing:.02em;
margin-bottom:8px;
opacity:0;
filter:blur(14px);
animation:gateTitle 1.6s cubic-bezier(.25,.1,.25,1) .3s forwards;
}

@keyframes gateTitle{
to{opacity:1;filter:blur(0)}
}

.gate-sub{
font-size:1rem;
color:rgba(255,255,255,.4);
letter-spacing:.08em;
margin-bottom:36px;
opacity:0;
animation:gateSub 1.4s cubic-bezier(.25,.1,.25,1) 1.2s forwards;
}

@keyframes gateSub{
from{opacity:0;transform:translateY(8px)}
to{opacity:1;transform:translateY(0)}
}

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

@keyframes gateBtn{
from{opacity:0;transform:translateY(10px)}
to{opacity:1;transform:translateY(0)}
}

.enter-btn:hover{
background:rgba(255,255,255,.12);
border-color:rgba(255,255,255,.25);
transform:translateY(-2px);
}

.enter-btn:active{transform:translateY(0)}

.card{
position:relative;
z-index:2;
width:100%;
max-width:380px;
background:rgba(20,20,24,.68);
backdrop-filter:blur(20px) saturate(140%);
-webkit-backdrop-filter:blur(20px) saturate(140%);
border:1px solid rgba(255,255,255,.08);
border-radius:24px;
padding:28px 24px 22px;
display:flex;
flex-direction:column;
align-items:center;
text-align:center;
box-shadow:0 20px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.04);
opacity:0;
transform:translateY(20px);
transition:opacity 1.2s cubic-bezier(.25,.1,.25,1),transform 1.2s cubic-bezier(.25,.1,.25,1);
}

.card.mounted{opacity:1;transform:translateY(0)}

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

.status-dot{
position:absolute;
bottom:6px;
right:6px;
width:18px;
height:18px;
border-radius:50%;
border:3px solid #141418;
}

.name{
font-size:1.6rem;
color:#fff;
letter-spacing:.02em;
margin-bottom:2px;
}

.handle{
font-size:.9rem;
color:rgba(255,255,255,.45);
letter-spacing:.05em;
margin-bottom:14px;
}

.bio{
font-size:.95rem;
color:rgba(255,255,255,.7);
line-height:1.65;
margin-bottom:18px;
white-space:pre-line;
}

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

@keyframes slideUp{
from{opacity:0;transform:translateY(8px)}
to{opacity:1;transform:translateY(0)}
}

.activity-icon{
width:40px;
height:40px;
border-radius:10px;
object-fit:cover;
flex-shrink:0;
background:rgba(255,255,255,.05);
}

.activity-text{flex:1;min-width:0}

.activity-name{
font-size:.85rem;
color:#fff;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
}

.activity-sub{
font-size:.75rem;
color:rgba(255,255,255,.5);
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
}

.progress-container{display:flex;flex-direction:column;gap:4px;margin-top:5px}

.progress-bar{
width:100%;
height:3px;
background:rgba(255,255,255,.1);
border-radius:2px;
overflow:hidden;
}

.progress-fill{
height:100%;
background:rgba(255,255,255,.6);
transition:width 1s linear;
}

.progress-time{
display:flex;
justify-content:space-between;
font-size:.65rem;
color:rgba(255,255,255,.35);
}

.socials{
display:flex;
align-items:center;
justify-content:center;
gap:14px;
margin-top:14px;
}

.social{
width:38px;
height:38px;
border-radius:50%;
background:rgba(255,255,255,.04);
border:1px solid rgba(255,255,255,.08);
color:rgba(255,255,255,.7);
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
text-decoration:none;
transition:background .3s ease,color .3s ease,transform .3s ease,border-color .3s ease;
}

.social:hover{
background:rgba(255,255,255,.1);
border-color:rgba(255,255,255,.2);
color:#fff;
transform:translateY(-2px);
}

.social svg{width:18px;height:18px;fill:currentColor}

.music-toggle{
position:fixed;
bottom:20px;
right:20px;
z-index:20;
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
.gate-title,.gate-sub,.enter-btn{opacity:1;filter:blur(0);animation:none}
}

@media (max-width:420px){
.card{padding:24px 18px 18px;border-radius:20px}
.avatar{width:84px;height:84px}
.name{font-size:1.45rem}
.music-toggle{bottom:14px;right:14px;width:40px;height:40px}
}
`;

const YT_VIDEO_ID = 'l_7bd_FQ7IQ';
const YT_VOLUME = 55;

const SOCIALS = {
  discord: '1429093326505640016',
  instagram: 'https://instagram.com/Deathyyyyyyyyyy',
  server: 'https://discord.gg/Y7mKtX9Bd',
};

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

function Avatar({ presence }) {
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
    <div className="avatar-wrap">
      {img ? <img src={img} alt="" className="avatar" /> : <div className="avatar" />}
      <span className="status-dot" style={{ background: color }} />
    </div>
  );
}

function Activity({ presence }) {
  if (!presence) return null;

  const activities = presence.activities || [];
  const spotify = presence.spotify;
  const listening = presence.listening_to_spotify;
  const custom = activities.find((a) => a.type === 4);
  const game = activities.find((a) => a.type !== 4 && a.name !== 'Spotify');

  if (listening && spotify) {
    return (
      <div className="activity">
        <img src={spotify.album_art_url} alt="" className="activity-icon" />
        <div className="activity-text">
          <p className="activity-name">{spotify.song}</p>
          <p className="activity-sub">{spotify.artist}</p>
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
  const [copied, setCopied] = useState(false);

  const copyDiscord = () => {
    const id = SOCIALS.discord;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = id;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="socials">
      <button
        className="social"
        onClick={copyDiscord}
        title={copied ? 'Copied!' : `Discord: ${SOCIALS.discord}`}
        aria-label="Copy Discord ID"
      >
        {copied ? (
          <svg viewBox="0 0 24 24">
            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        )}
      </button>

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

      <a
        className="social"
        href={SOCIALS.server}
        target="_blank"
        rel="noopener noreferrer"
        title="Discord Server"
        aria-label="Discord Server"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zm4.5-8.5a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm-7 0a2 2 0 1 1-2-2 2 2 0 0 1 2 2z" />
        </svg>
      </a>
    </div>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const presence = useLanyard('1429093326505640016');

  useYouTubeAudio(entered && musicOn);

  useEffect(() => {
    if (entered) {
      requestAnimationFrame(() => setMounted(true));
    }
  }, [entered]);

  return (
    <>
      <style>{styles}</style>

      <img
        className="bg-gif"
        src="https://i.ibb.co/TBNJGXG8/ezgif-83bbce0c070fca6e.gif"
        alt=""
        aria-hidden="true"
      />
      <div className="bg-overlay" />

      <div id="ytAudio" className="yt-hidden" />

      <div className={`gate ${entered ? 'hidden' : ''}`}>
        <h1 className="gate-title">Nyxieepieee</h1>
        <p className="gate-sub">Meowmeow</p>
        <button className="enter-btn" onClick={() => setEntered(true)}>
          Enter
        </button>
      </div>

      <div className="app">
        <div className={`card ${mounted ? 'mounted' : ''}`}>
          <Avatar presence={presence} />
          <h1 className="name">Nyxieepieee</h1>
          <p className="handle">@nyx · Meowmeow</p>
          <p className="bio">
            {'Web development and bot developer i am nyx. I am 15 years old\nI love life'}
          </p>
          <Activity presence={presence} />
          <Socials />
        </div>
      </div>

      {entered && (
        <button
          className="music-toggle"
          onClick={() => setMusicOn((v) => !v)}
          aria-label={musicOn ? 'Mute music' : 'Unmute music'}
        >
          {musicOn ? '♪' : '✕'}
        </button>
      )}
    </>
  );
      }
