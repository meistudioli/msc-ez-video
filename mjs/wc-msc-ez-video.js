import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

const defaults = {
  width: 16,
  height: 9,
  src: '',
  poster: '',
  muted: false,
  autoplay: false,
  controls: false,
  loop: false,
  crossorigin: 'anonymous',
  title: 'unknown title',
  artist: 'unknown artist'
};

const booleanAttrs = ['muted', 'autoplay', 'controls', 'loop'];
const custumEvents = {
  play: 'ez-video-play',
  pause: 'ez-video-pause',
  seek: 'ez-video-seek',
  mute: 'ez-video-mutechange',
  fullscreen: 'ez-video-fullscreenchange',
  PiP: 'ez-video-PiPchange',
  rate: 'ez-video-ratechange',
  error: 'ez-video-error'
};
const legalKey = [
  'Escape',
  'k',
  'm',
  'i',
  'f',
  ' ',
  'j',
  'l',
  '<',
  '>',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'ArrowLeft',
  'ArrowRight'
];
const maxPlaybackRate = 2;
const minPlaybackRate = .25;
const fullscreen = _wcl.isFullscreenSupport();
const PiP = _wcl.isPiPSupport();
const mediaSession = _wcl.isAPISupport('mediaSession', navigator);
const getAllEzVideo = () => {
  return Array.from(document.querySelectorAll(_wcl.classToTagName('MscEzVideo')));
}
const mediaTrackAction = (ezVideo, action = 'previous', ezVideos = getAllEzVideo()) => {
  const idx = (ezVideos.indexOf(ezVideo) + (action === 'previous' ? -1 : 1) + ezVideos.length) % ezVideos.length;
  const actEzVideo = ezVideos[idx];
  const tagName = _wcl.classToTagName('MscEzVideo');

  // pause all
  Array.from(document.querySelectorAll(`${tagName},video,audio`)).forEach((mediaObj) => mediaObj.pause());

  actEzVideo.scrollIntoView({behavior: 'smooth', block: 'center'});
  actEzVideo.play();
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{position:relative;width:100%;display:block;overflow:hidden;background-color:#000;}
:host {
  --slider-thumb-with: 14px;
  --slider-thumb-color: rgba(255,0,0,1);
  --indicator-background: rgba(255,255,255,.2);
  --indicator-buffer-start: rgba(255,255,255,.4);
  --indicator-buffer-end: rgba(255,255,255,.4);
  --indicator-duration-start: rgba(255,0,0,1);
  --indicator-duration-end: rgba(255,0,0,1);

  --action-height: 36px;
  --action-icon-size: auto 65%;

  --time-text-size: 16px;
  --time-text-color: #fff;

  --warning-font-size: 16px;
  --warning-color: #fff;
  --warning-text: 'Some errors occured. Please try later.';

  --reaction-width: 52px;
  --reaction-bgc-start: rgba(0,0,0,.4);
  --reaction-bgc-end: rgba(0,0,0,.4);

  --ico-play: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTggNXYxNGwxMS03eicvPjxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9J25vbmUnLz48L3N2Zz4=);
  --ico-pause: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTYgMTloNFY1SDZ2MTR6bTgtMTR2MTRoNFY1aC00eicvPjxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9J25vbmUnLz48L3N2Zz4=);
  --ico-mute: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTE2LjUgMTJjMC0xLjc3LTEuMDItMy4yOS0yLjUtNC4wM3YyLjIxbDIuNDUgMi40NWMuMDMtLjIuMDUtLjQxLjA1LS42M3ptMi41IDBjMCAuOTQtLjIgMS44Mi0uNTQgMi42NGwxLjUxIDEuNTFDMjAuNjMgMTQuOTEgMjEgMTMuNSAyMSAxMmMwLTQuMjgtMi45OS03Ljg2LTctOC43N3YyLjA2YzIuODkuODYgNSAzLjU0IDUgNi43MXpNNC4yNyAzTDMgNC4yNyA3LjczIDlIM3Y2aDRsNSA1di02LjczbDQuMjUgNC4yNWMtLjY3LjUyLTEuNDIuOTMtMi4yNSAxLjE4djIuMDZjMS4zOC0uMzEgMi42My0uOTUgMy42OS0xLjgxTDE5LjczIDIxIDIxIDE5LjczbC05LTlMNC4yNyAzek0xMiA0TDkuOTEgNi4wOSAxMiA4LjE4VjR6Jy8+PHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD0nbm9uZScvPjwvc3ZnPg==);
  --ico-unmute: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTMgOXY2aDRsNSA1VjRMNyA5SDN6bTEzLjUgM2MwLTEuNzctMS4wMi0zLjI5LTIuNS00LjAzdjguMDVjMS40OC0uNzMgMi41LTIuMjUgMi41LTQuMDJ6TTE0IDMuMjN2Mi4wNmMyLjg5Ljg2IDUgMy41NCA1IDYuNzFzLTIuMTEgNS44NS01IDYuNzF2Mi4wNmM0LjAxLS45MSA3LTQuNDkgNy04Ljc3cy0yLjk5LTcuODYtNy04Ljc3eicvPjxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9J25vbmUnLz48L3N2Zz4=);
  --ico-fullscreen: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD0nbm9uZScvPjxwYXRoIGZpbGw9JyNmZmYnIGQ9J003IDE0SDV2NWg1di0ySDd2LTN6bS0yLTRoMlY3aDNWNUg1djV6bTEyIDdoLTN2Mmg1di01aC0ydjN6TTE0IDV2MmgzdjNoMlY1aC01eicvPjwvc3ZnPg==);
  --ico-fullscreen-exit: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD0nbm9uZScvPjxwYXRoIGZpbGw9JyNmZmYnIGQ9J001IDE2aDN2M2gydi01SDV2MnptMy04SDV2Mmg1VjVIOHYzem02IDExaDJ2LTNoM3YtMmgtNXY1em0yLTExVjVoLTJ2NWg1VjhoLTN6Jy8+PC9zdmc+);
  --ico-pip: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTE5IDExaC04djZoOHYtNnptNCA4VjQuOThDMjMgMy44OCAyMi4xIDMgMjEgM0gzYy0xLjEgMC0yIC44OC0yIDEuOThWMTljMCAxLjEuOSAyIDIgMmgxOGMxLjEgMCAyLS45IDItMnptLTIgLjAySDNWNC45N2gxOHYxNC4wNXonLz48cGF0aCBmaWxsPSdub25lJyBkPSdNMCAwaDI0djI0SDBWMHonLz48L3N2Zz4=);
  --ico-replay: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD0nbm9uZScvPjxwYXRoIGZpbGw9JyNmZmYnIGQ9J00xMiA1VjFMNyA2bDUgNVY3YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTZINGMwIDQuNDIgMy41OCA4IDggOHM4LTMuNTggOC04LTMuNTgtOC04LTh6Jy8+PC9zdmc+);
  --ico-warning: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD0nbm9uZScvPjxwYXRoIGZpbGw9JyNmZmYnIGQ9J00xIDIxaDIyTDEyIDIgMSAyMXptMTItM2gtMnYtMmgydjJ6bTAtNGgtMnYtNGgydjR6Jy8+PC9zdmc+);
  --ico-forward-5: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nMjQnIGhlaWdodD0nMjQnPjxkZWZzPjxwYXRoIGlkPSdhJyBkPSdNMjQgMjRIMFYwaDI0djI0eicvPjwvZGVmcz48Y2xpcFBhdGggaWQ9J2InPjx1c2UgeGxpbms6aHJlZj0nI2EnIG92ZXJmbG93PSd2aXNpYmxlJy8+PC9jbGlwUGF0aD48cGF0aCBmaWxsPScjZmZmJyBkPSdNNCAxM2MwIDQuNCAzLjYgOCA4IDhzOC0zLjYgOC04aC0yYzAgMy4zLTIuNyA2LTYgNnMtNi0yLjctNi02IDIuNy02IDYtNnY0bDUtNS01LTV2NGMtNC40IDAtOCAzLjYtOCA4em02LjcuOWwuMi0yLjJoMi40di43aC0xLjdsLS4xLjlzLjEgMCAuMS0uMS4xIDAgLjEtLjEuMSAwIC4yIDBoLjJjLjIgMCAuNCAwIC41LjFzLjMuMi40LjMuMi4zLjMuNS4xLjQuMS42YzAgLjIgMCAuNC0uMS41cy0uMS4zLS4zLjUtLjMuMi0uNS4zLS40LjEtLjYuMWMtLjIgMC0uNCAwLS41LS4xcy0uMy0uMS0uNS0uMi0uMi0uMi0uMy0uNC0uMS0uMy0uMS0uNWguOGMwIC4yLjEuMy4yLjRzLjIuMS40LjFjLjEgMCAuMiAwIC4zLS4xbC4yLS4ycy4xLS4yLjEtLjN2LS42bC0uMS0uMi0uMi0uMnMtLjItLjEtLjMtLjFoLS4ycy0uMSAwLS4yLjEtLjEgMC0uMS4xLS4xLjEtLjEuMWgtLjZ6JyBjbGlwLXBhdGg9J3VybCgjYiknLz48L3N2Zz4=);
  --ico-forward-10: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgyNHYyNEgweicvPjxnIGZpbGw9JyNmZmYnPjxwYXRoIGQ9J00xOCAxM2MwIDMuMzEtMi42OSA2LTYgNnMtNi0yLjY5LTYtNiAyLjY5LTYgNi02djRsNS01LTUtNXY0Yy00LjQyIDAtOCAzLjU4LTggOHMzLjU4IDggOCA4IDgtMy41OCA4LThoLTJ6Jy8+PHBhdGggZD0nTTEwLjg2IDE1Ljk0di00LjI3aC0uMDlMOSAxMi4zdi42OWwxLjAxLS4zMXYzLjI2ek0xMi4yNSAxMy40NHYuNzRjMCAxLjkgMS4zMSAxLjgyIDEuNDQgMS44Mi4xNCAwIDEuNDQuMDkgMS40NC0xLjgydi0uNzRjMC0xLjktMS4zMS0xLjgyLTEuNDQtMS44Mi0uMTQgMC0xLjQ0LS4wOS0xLjQ0IDEuODJ6bTIuMDQtLjEydi45N2MwIC43Ny0uMjEgMS4wMy0uNTkgMS4wM3MtLjYtLjI2LS42LTEuMDN2LS45N2MwLS43NS4yMi0xLjAxLjU5LTEuMDEuMzgtLjAxLjYuMjYuNiAxLjAxeicvPjwvZz48L3N2Zz4=);
  --ico-backward-5: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nMjQnIGhlaWdodD0nMjQnPjxkZWZzPjxwYXRoIGlkPSdhJyBmaWxsPScjZmZmJyBkPSdNMCAwaDI0djI0SDBWMHonLz48L2RlZnM+PGNsaXBQYXRoIGlkPSdiJz48dXNlIHhsaW5rOmhyZWY9JyNhJyBvdmVyZmxvdz0ndmlzaWJsZScvPjwvY2xpcFBhdGg+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTEyIDVWMUw3IDZsNSA1VjdjMy4zIDAgNiAyLjcgNiA2cy0yLjcgNi02IDYtNi0yLjctNi02SDRjMCA0LjQgMy42IDggOCA4czgtMy42IDgtOC0zLjYtOC04LTh6bS0xLjMgOC45bC4yLTIuMmgyLjR2LjdoLTEuN2wtLjEuOXMuMSAwIC4xLS4xLjEgMCAuMS0uMS4xIDAgLjIgMGguMmMuMiAwIC40IDAgLjUuMXMuMy4yLjQuMy4yLjMuMy41LjEuNC4xLjZjMCAuMiAwIC40LS4xLjVzLS4xLjMtLjMuNS0uMy4yLS40LjMtLjQuMS0uNi4xYy0uMiAwLS40IDAtLjUtLjFzLS4zLS4xLS41LS4yLS4yLS4yLS4zLS40LS4xLS4zLS4xLS41aC44YzAgLjIuMS4zLjIuNHMuMi4xLjQuMWMuMSAwIC4yIDAgLjMtLjFsLjItLjJzLjEtLjIuMS0uM3YtLjZsLS4xLS4yLS4yLS4ycy0uMi0uMS0uMy0uMWgtLjJzLS4xIDAtLjIuMS0uMSAwLS4xLjEtLjEuMS0uMS4xaC0uN3onIGNsaXAtcGF0aD0ndXJsKCNiKScvPjwvc3ZnPg==);
  --ico-backward-10: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nMjQnIGhlaWdodD0nMjQnPjxkZWZzPjxwYXRoIGZpbGw9JyNmZmYnIGlkPSdhJyBkPSdNMCAwaDI0djI0SDBWMHonLz48L2RlZnM+PGNsaXBQYXRoIGlkPSdiJz48dXNlIHhsaW5rOmhyZWY9JyNhJyBvdmVyZmxvdz0ndmlzaWJsZScvPjwvY2xpcFBhdGg+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTEyIDVWMUw3IDZsNSA1VjdjMy4zIDAgNiAyLjcgNiA2cy0yLjcgNi02IDYtNi0yLjctNi02SDRjMCA0LjQgMy42IDggOCA4czgtMy42IDgtOC0zLjYtOC04LTh6bS0xLjEgMTFIMTB2LTMuM0w5IDEzdi0uN2wxLjgtLjZoLjFWMTZ6bTQuMy0xLjhjMCAuMyAwIC42LS4xLjhsLS4zLjZzLS4zLjMtLjUuMy0uNC4xLS42LjEtLjQgMC0uNi0uMS0uMy0uMi0uNS0uMy0uMi0uMy0uMy0uNi0uMS0uNS0uMS0uOHYtLjdjMC0uMyAwLS42LjEtLjhsLjMtLjZzLjMtLjMuNS0uMy40LS4xLjYtLjEuNCAwIC42LjFjLjIuMS4zLjIuNS4zcy4yLjMuMy42LjEuNS4xLjh2Ljd6bS0uOS0uOHYtLjVzLS4xLS4yLS4xLS4zLS4xLS4xLS4yLS4yLS4yLS4xLS4zLS4xLS4yIDAtLjMuMWwtLjIuMnMtLjEuMi0uMS4zdjJzLjEuMi4xLjMuMS4xLjIuMi4yLjEuMy4xLjIgMCAuMy0uMWwuMi0uMnMuMS0uMi4xLS4zdi0xLjV6JyBjbGlwLXBhdGg9J3VybCgjYiknLz48L3N2Zz4=);
  --ico-speed-up-rate: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTQgMThsOC41LTZMNCA2djEyem05LTEydjEybDguNS02TDEzIDZ6Jy8+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgyNHYyNEgweicvPjwvc3ZnPg==);
  --ico-speed-down-rate: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTExIDE4VjZsLTguNSA2IDguNSA2em0uNS02bDguNSA2VjZsLTguNSA2eicvPjxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9J25vbmUnLz48L3N2Zz4=);

  --tip-font-size: 12px;
  --tip-line-height: 1.8;
  --tip-color: #fff;
  --tip-background: rgba(0,0,0,.6);
  --tip-play: 'Play';
  --tip-pause: 'Pause';
  --tip-unmute: 'Unmute';
  --tip-mute: 'Mute';
  --tip-fullscreen: 'Full screen';
  --tip-fullscreen-exit: 'Exit full screen';
  --tip-PiP: 'Picture in Picture';

  --playbackrate-font-size: 18px;
  --playbackrate-line-height: 2;
  --playbackrate-color: #fff;
  --playbackrate-background: rgba(0,0,0,.6);
  --playbackrate-margin-top: calc((var(--reaction-width) * 1.5 / 2 + 3em) * -1);

  --show-always: block;
  --show-on-normal: block;
  --show-on-fullscreen: none;

  --action-play-width: calc(var(--action-height) * 1.27);
  --indicator-height: calc(var(--slider-thumb-with) * .35);
  --action-height-fullscreen: calc(var(--action-height) * 1.33);
  --reaction-width-fullscreen: calc(var(--reaction-width) * 1.33);
  --tip-font-size-fullscreen: calc(var(--tip-font-size) * 1.33);
  --playbackrate-font-size-fullscreen: calc(var(--playbackrate-font-size) * 1.33);

  --tip-y-no-progress: calc(var(--tip-font-size) * var(--tip-line-height) * -1);
  --tip-y-progress: calc((var(--slider-thumb-with) + var(--tip-font-size) * var(--tip-line-height)) * -1);
  --tip-y-fullscreen: calc((var(--slider-thumb-with) + var(--tip-font-size-fullscreen) * var(--tip-line-height)) * -1);
  --tip-y: var(--tip-y-no-progress);
}

:host(:focus){outline:0 none;}
:host(:focus-visible){animation:host-focus 5.7s;}

.main {
  --w: ${defaults.width};
  --h: ${defaults.height};
  --el: 0;
  --eb: 0;
  --control-pannel-lr-padding: calc(var(--slider-thumb-with) + var(--el));
}
.main{position:relative;inline-size:100%;overflow:hidden;aspect-ratio:var(--w)/var(--h);}
.main:focus{outline:0 none;}

video{width:100%;height:100%;display:block;}

.time-information{font-size:var(--time-text-size);color:var(--time-text-color);line-height:var(--action-height);display:var(--show-on-fullscreen);padding:0 6px;}
.control-pannel{position:absolute;left:0;bottom:0;width:100%;padding:0 var(--control-pannel-lr-padding);box-sizing:border-box;background:linear-gradient(0deg,rgba(0,0,0,.7),transparent 90%);pointer-events:none;user-select:none;-ms-user-select:none;-webkit-user-select:none;}
.vanquish{position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;pointer-events:none;}
.progress-bar-wrap{position:relative;display:var(--show-on-fullscreen);}

.progress-bar-input{position:relative;width:calc(100% + var(--slider-thumb-with));margin-left:calc(var(--slider-thumb-with) / 2 * -1);outline:0 none;border:0 none;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;display:block;background:transparent;z-index:1;pointer-events:auto;}
.progress-bar-input::-webkit-slider-thumb{-webkit-appearance:none;width:var(--slider-thumb-with);height:var(--slider-thumb-with);border-radius:var(--slider-thumb-with);background:var(--slider-thumb-color);border:0 none;cursor:pointer;transition:transform 100ms ease;transform-origin:50% 50%;}
.progress-bar-input:active::-webkit-slider-thumb{transform:scale(1.5);}

.progress-bar-input::-moz-focus-outer{border:0 none;}
.progress-bar-input::-moz-range-thumb{-webkit-appearance:none;width:var(--slider-thumb-with);height:var(--slider-thumb-with);border-radius:var(--slider-thumb-with);background:var(--slider-thumb-color);border:0 none;cursor:pointer;transition:transform 100ms ease;transform-origin:50% 50%;}
.progress-bar-input:active::-moz-range-thumb{transform:scale(1.5);}

.indicators{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;width:100%;height:var(--indicator-height);border-radius:var(--indicator-height);background:var(--indicator-background);pointer-events:none;overflow:hidden;}
.indicators progress{position:absolute;width:100%;height:100%;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:transparent;border:0 none;display:block;border-radius:var(--indicator-height);}
.indicators progress::-webkit-progress-bar{background:transparent;}
.indicators progress::-webkit-progress-value{border-radius:var(--indicator-height);}
.progress-bar-buffer::-webkit-progress-value{background:linear-gradient(to right,var(--indicator-buffer-start),var(--indicator-buffer-end)) no-repeat 0 / 100%;}
.progress-bar-duration::-webkit-progress-value{background:linear-gradient(to right,var(--indicator-duration-start),var(--indicator-duration-end)) no-repeat 0 / 100%;}
.progress-bar-buffer::-moz-progress-bar{background:linear-gradient(to right,var(--indicator-buffer-start),var(--indicator-buffer-end)) no-repeat 0 / 100%;}
.progress-bar-duration::-moz-progress-bar{background:linear-gradient(to right,var(--indicator-duration-start),var(--indicator-duration-end)) no-repeat 0 / 100%;}

.actions{height:var(--action-height);display:flex;justify-content:space-between;}
.actions-left,.actions-right{height:inherit;display:flex;}
.actions-right{flex-direction:row-reverse;}
.actions a{position:relative;width:var(--action-height);opacity:.9;transition:opacity 100ms ease;pointer-events:auto;}
.actions a .before,.actions a .after{position:absolute;width:100%;height:100%;left:0;top:0;content:'';background-position:50% 50%;background-size:var(--action-icon-size);background-repeat:no-repeat;display:none;}
.tap .before,.tap .after{animation:tap-act 400ms ease forwards;will-change:transform;}

.tip{position:absolute;top:var(--tip-y);font-size:var(--tip-font-size);color:var(--tip-color);line-height:var(--tip-line-height);background:var(--tip-background);padding:0 8px;border-radius:4px;pointer-events:none;opacity:0;transition:opacity 200ms ease;left:50%;transform:translateX(-50%);}
.tip::after{content:var(--tip-text, '');white-space:nowrap;}

.play-and-pause{width:var(--action-play-width);display:var(--show-on-fullscreen);}
.play-and-pause .before{background-image:var(--ico-play);}
.play-and-pause .after{background-image:var(--ico-pause);}
.play-and-pause[data-mode='play'] .after{display:block;}
.play-and-pause[data-mode='pause'] .before{display:block;}
.play-and-pause[data-mode='play']{--tip-text:var(--tip-pause);}
.play-and-pause[data-mode='pause']{--tip-text:var(--tip-play);}
.play-and-pause .tip{left:0;transform:none;}

.mute-on-and-off{display:var(--show-always);}
.mute-on-and-off .before{background-image:var(--ico-unmute);}
.mute-on-and-off .after{background-image:var(--ico-mute);}
.mute-on-and-off[data-mode='on'] .after{display:block;}
.mute-on-and-off[data-mode='off'] .before{display:block;}
.mute-on-and-off[data-mode='on']{--tip-text:var(--tip-unmute);}
.mute-on-and-off[data-mode='off']{--tip-text:var(--tip-mute);}
.mute-on-and-off .tip{left:0;transform:none;}

.fullscreen-on-and-off{display:var(--show-on-fullscreen);}
.fullscreen-on-and-off .before{background-image:var(--ico-fullscreen);}
.fullscreen-on-and-off .after{background-image:var(--ico-fullscreen-exit);}
.fullscreen-on-and-off[data-mode='on'] .after{display:block;}
.fullscreen-on-and-off[data-mode='off'] .before{display:block;}
.fullscreen-on-and-off[data-mode='on']{--tip-text:var(--tip-fullscreen-exit);}
.fullscreen-on-and-off[data-mode='off']{--tip-text:var(--tip-fullscreen);}
.fullscreen-on-and-off .tip{left:auto;right:0;transform:none;}

.pip-on-and-off{display:var(--show-always);--tip-text:var(--tip-PiP);}
.pip-on-and-off .before{background-image:var(--ico-pip);}
.pip-on-and-off[data-mode='off'] .before{display:block;}
.pip-on-and-off[hidden]{display:none;pointer-events:none;}
.pip-on-and-off .tip{left:auto;right:0;transform:none;}

.reactions{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:1;}
[class|=reaction]{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;width:var(--reaction-width);height:var(--reaction-width);border-radius:var(--reaction-width);background:var(--ico-reaction) no-repeat 50% 50% / 60% auto,linear-gradient(45deg, var(--reaction-bgc-start), var(--reaction-bgc-end)) no-repeat 50% 50% / 100% 100%;animation:reaction-act 700ms ease forwards;will-change:transform,opacity;text-indent:100%;white-space:nowrap;overflow:hidden;}
.reaction-play{--ico-reaction:var(--ico-play);}
.reaction-pause{--ico-reaction:var(--ico-pause);}
.reaction-mute{--ico-reaction:var(--ico-mute);}
.reaction-unmute{--ico-reaction:var(--ico-unmute);}
.reaction-pip{--ico-reaction:var(--ico-pip);}
.reaction-forward5{--ico-reaction:var(--ico-forward-5);}
.reaction-forward10{--ico-reaction:var(--ico-forward-10);}
.reaction-backward5{--ico-reaction:var(--ico-backward-5);}
.reaction-backward10{--ico-reaction:var(--ico-backward-10);}
.reaction-speed-up-rate{--ico-reaction:var(--ico-speed-up-rate);}
.reaction-speed-down-rate{--ico-reaction:var(--ico-speed-down-rate);}

.playbackrate-info{position:absolute;left:50%;top:50%;font-size:var(--playbackrate-font-size);color:var(--playbackrate-color);content:attr(data-playbackrate);background:var(--playbackrate-background);line-height:var(--playbackrate-line-height);padding:0 .75em;border-radius:4px;pointer-events:none;transform:translate(-50%,-50%);margin-top:var(--playbackrate-margin-top);opacity:0;transition:opacity 300ms ease;will-change:opacity;}
.reaction-speed-up-rate~.playbackrate-info,
.reaction-speed-down-rate~.playbackrate-info{opacity:1;transition-delay:100ms;transition-duration:100ms;}

:host([controls]){--show-on-fullscreen:block;--tip-y:var(--tip-y-progress);}
:host([controls]) .pip-on-and-off .tip{left:50%;right:auto;transform:translateX(-50%);}
:host([controls]) .mute-on-and-off .tip{left:50%;transform:translateX(-50%);}
:host([controls]) .vanquish{display:none;}

.main[data-idle]:not([data-idle=''])::after{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;content:'';width:var(--reaction-width);height:var(--reaction-width);border-radius:var(--reaction-width);pointer-events:none;background:var(--ico-idle) no-repeat 50% 50% / 60% auto,linear-gradient(45deg, var(--reaction-bgc-start), var(--reaction-bgc-end)) no-repeat 50% 50% / 100% 100%;}
.main[data-idle='play']{--ico-idle:var(--ico-play);}
.main[data-idle='replay']{--ico-idle:var(--ico-replay);--ico-play:var(--ico-replay);}

.error .content{visibility:hidden;pointer-events:none;}
.error::after{position:absolute;top:0;left:0;bottom:0;right:0;margin:auto;font-size:var(--warning-font-size);color:var(--warning-color);width:100%;height:20px;content:var(--warning-text);background:var(--ico-warning) no-repeat 50% 0% / auto 2em;box-sizing:border-box;padding:2.5em 2em 0;text-align:center;}

@keyframes reaction-act{
  0% {transform:scale(.5);opacity:0;}
  30% {opacity:1;}
  100% {transform:scale(1.5);opacity:0;}
}

@keyframes fullscreen-icon-expand{
  0% {transform:scale(1);}
  50% {transform:scale(1.2);}
  100% {transform:scale(1);}
}

@keyframes fullscreen-icon-shrink{
  0% {transform:scale(1);}
  50% {transform:scale(0.8);}
  100% {transform:scale(1);}
}

@keyframes tap-act{
  0% {transform:scale(1);}
  50% {transform:scale(1.3);}
  100% {transform:scale(1);}
}

@keyframes host-focus {
  0% {box-shadow:0 0 0 4px transparent;} 
  3% {box-shadow:0 0 0 4px #8cc4fb;}
  91% {box-shadow:0 0 0 4px #8cc4fb;}
  100% {box-shadow:0 0 0 4px transparent;}
}

@media (hover:hover) {
  .actions a:hover{opacity:1;}
  .actions a:hover .tip{opacity:1;}

  .fullscreen-on-and-off[data-mode='off']:hover .before{animation:fullscreen-icon-expand 400ms ease forwards;}
  .fullscreen-on-and-off[data-mode='on']:hover .after{animation:fullscreen-icon-shrink 400ms ease forwards;}

  .indicators{transition:transform 200ms ease;transform:scaleY(.6);}
  .progress-bar-input::-webkit-slider-thumb{transform:scale(.01);}
  .progress-bar-input::-moz-range-thumb{transform:scale(.01);}

  .progress-bar-wrap:hover .indicators{transform:scaleY(1);}

  .progress-bar-wrap:hover .progress-bar-input::-webkit-slider-thumb{transform:scale(1);}
  .progress-bar-wrap:hover .progress-bar-input:active::-webkit-slider-thumb{transform:scale(1.5);}

  .progress-bar-wrap:hover .progress-bar-input::-moz-range-thumb{transform:scale(1);}
  .progress-bar-wrap:hover .progress-bar-input:active::-moz-range-thumb{transform:scale(1.5);}
}

:host(.fullscreen){position:fixed;left:0;top:0;width:100%;height:100%;z-index:2147483647;border-radius:0 !important;padding:0 !important;margin:0 !important;}
:host(.fullscreen) .main{height:100%;--show-on-normal:none;--show-on-fullscreen:block;--action-height:var(--action-height-fullscreen);--reaction-width:var(--reaction-width-fullscreen);--tip-font-size:var(--tip-font-size-fullscreen);--tip-y:var(--tip-y-fullscreen);--playbackrate-font-size:var(--playbackrate-font-size-fullscreen);}
:host(.fullscreen) .control-pannel{padding-bottom:var(--eb);}
:host(.fullscreen) .pip-on-and-off .tip{left:50%;right:auto;transform:translateX(-50%);}
:host(.fullscreen) .mute-on-and-off .tip{left:50%;transform:translateX(-50%);}

:host(:fullscreen){width:100%;height:100%;}
:host(:fullscreen) .main{height:100%;--show-on-normal:none;--show-on-fullscreen:block;--action-height:var(--action-height-fullscreen);--reaction-width:var(--reaction-width-fullscreen);--tip-font-size:var(--tip-font-size-fullscreen);--tip-y:var(--tip-y-fullscreen);--playbackrate-font-size:var(--playbackrate-font-size-fullscreen);}
:host(:fullscreen) .control-pannel{padding-bottom:var(--eb);}
:host(:fullscreen) .pip-on-and-off .tip{left:50%;right:auto;transform:translateX(-50%);}
:host(:fullscreen) .mute-on-and-off .tip{left:50%;transform:translateX(-50%);}

:host(:-webkit-full-screen){width:100%;height:100%;}
:host(:-webkit-full-screen) .main{height:100%;--show-on-normal:none;--show-on-fullscreen:block;--action-height:var(--action-height-fullscreen);--reaction-width:var(--reaction-width-fullscreen);--tip-font-size:var(--tip-font-size-fullscreen);--tip-y:var(--tip-y-fullscreen);--playbackrate-font-size:var(--playbackrate-font-size-fullscreen);}
:host(:-webkit-full-screen) .control-pannel{padding-bottom:var(--eb);}
:host(:-webkit-full-screen) .pip-on-and-off .tip{left:50%;right:auto;transform:translateX(-50%);}
:host(:-webkit-full-screen) .mute-on-and-off .tip{left:50%;transform:translateX(-50%);}

@supports (bottom:env(safe-area-inset-top)) {
  .main {
    --eb:env(safe-area-inset-bottom);
    --el:env(safe-area-inset-left);
  }
}
</style>

<div class="main" tabindex="0">
  <video
    preload="metadata"
    playsinline
  ></video>
  <div class="control-pannel">
    <div class="progress-bar-wrap">
      <input class="progress-bar-input" type="range" min="0" max="100" step="1" value="0" autocomplete="off" >
      <div class="indicators">
        <progress class="progress-bar-buffer" max="100" value="0"></progress>
        <progress class="progress-bar-duration" max="100" value="0"></progress>
      </div>
    </div>
    <div class="actions">
      <div class="actions-left">
        <a class="play-and-pause" aria-label="play / pause" data-mode="pause">
          <span class="before"></span>
          <span class="after"></span>
          <span class="tip"></span>
        </a>
        <a class="mute-on-and-off" aria-label="on / off" data-mode="on">
          <span class="before"></span>
          <span class="after"></span>
          <span class="tip center"></span>
        </a>
        <p class="time-information">
          <span class="before"></span>
          <span class="after"></span>
          <span class="time-passed">0:00</span> / <span class="time-ended">0:00</span>
        </p>
      </div>
      <div class="actions-right">
        <a class="fullscreen-on-and-off" aria-label="on / off" data-mode="off">
          <span class="before"></span>
          <span class="after"></span>
          <span class="tip right"></span>
        </a>
        <a class="pip-on-and-off" aria-label="on / off" data-mode="off">
          <span class="before"></span>
          <span class="after"></span>
          <span class="tip center"></span>
        </a>
      </div>
    </div>
  </div>
  <div class="reactions">
    <em class="playbackrate-info">1x</em>
  </div>
  <div class="vanquish">
    <input type="range" class="force-focus-factor" />
  </div>
</div>
`;

const templateReactionPlay = document.createElement('template');
templateReactionPlay.innerHTML = `
  <em class="reaction-play">play</em>
`;

const templateReactionPause = document.createElement('template');
templateReactionPause.innerHTML = `
  <em class="reaction-pause">pause</em>
`;

const templateReactionMute = document.createElement('template');
templateReactionMute.innerHTML = `
  <em class="reaction-mute">mute</em>
`;

const templateReactionUnmute = document.createElement('template');
templateReactionUnmute.innerHTML = `
  <em class="reaction-unmute">unmute</em>
`;

const templateReactionPiP = document.createElement('template');
templateReactionPiP.innerHTML = `
  <em class="reaction-pip">picture in picture</em>
`;

const templateReactionForward5 = document.createElement('template');
templateReactionForward5.innerHTML = `
  <em class="reaction-forward5">forward 5</em>
`;

const templateReactionForward10 = document.createElement('template');
templateReactionForward10.innerHTML = `
  <em class="reaction-forward10">forward 10</em>
`;

const templateReactionBackward5 = document.createElement('template');
templateReactionBackward5.innerHTML = `
  <em class="reaction-backward5">backward 5</em>
`;

const templateReactionBackward10 = document.createElement('template');
templateReactionBackward10.innerHTML = `
  <em class="reaction-backward10">backward 10</em>
`;

const templateReactionSpeedUpRate = document.createElement('template');
templateReactionSpeedUpRate.innerHTML = `
  <em class="reaction-speed-up-rate">speed up rate</em>
`;

const templateReactionSpeedDownRate = document.createElement('template');
templateReactionSpeedDownRate.innerHTML = `
  <em class="reaction-speed-down-rate">speed doen rate</em>
`;

export class MscEzVideo extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      ens: this.shadowRoot.querySelector('.main'),
      video: this.shadowRoot.querySelector('video'),
      input: this.shadowRoot.querySelector('.progress-bar-input'),
      barBuffer: this.shadowRoot.querySelector('.progress-bar-buffer'),
      barDuration: this.shadowRoot.querySelector('.progress-bar-duration'),
      btnPlay: this.shadowRoot.querySelector('.play-and-pause'),
      btnMute: this.shadowRoot.querySelector('.mute-on-and-off'),
      btnPiP: this.shadowRoot.querySelector('.pip-on-and-off'),
      btnFullscreen: this.shadowRoot.querySelector('.fullscreen-on-and-off'),
      timePassed: this.shadowRoot.querySelector('.time-passed'),
      timeEnded: this.shadowRoot.querySelector('.time-ended'),
      reactions: this.shadowRoot.querySelector('.reactions'),
      actions: this.shadowRoot.querySelector('.actions'),
      playbackrate: this.shadowRoot.querySelector('.playbackrate-info')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscEzVideo(config)
    };

    // evt
    this._onLoadeddata = this._onLoadeddata.bind(this);
    this._onProgress = this._onProgress.bind(this);
    this._onTimeupdate = this._onTimeupdate.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._onPause = this._onPause.bind(this);
    this._onEnded = this._onEnded.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onFullscreenchange = this._onFullscreenchange.bind(this);
    this._onPiPchange = this._onPiPchange.bind(this);
    this._onError = this._onError.bind(this);
    this._onDblclick = this._onDblclick.bind(this);
    this._onBtnPiPClick = this._onBtnPiPClick.bind(this);
    this._onBtnPlayClick = this._onBtnPlayClick.bind(this);
    this._onBtnMuteClick = this._onBtnMuteClick.bind(this);
    this._onBtnFullscreenClick = this._onBtnFullscreenClick.bind(this);
    this._onAnimationend = this._onAnimationend.bind(this);
    this._onTapAnimationend = this._onTapAnimationend.bind(this);
    this._onRatechange = this._onRatechange.bind(this);
    this._onContextmenu = this._onContextmenu.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  async connectedCallback() {
    const { input, reactions, ens, btnPiP, btnPlay, btnMute, btnFullscreen, actions } = this.#nodes;
    const { event } = fullscreen;

    const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this._upgradeProperty(key));

    // evt
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    const video = this._grabVideoInstance();
    video.addEventListener('progress', this._onProgress, { signal });
    video.addEventListener('timeupdate', this._onTimeupdate, { signal });
    video.addEventListener('play', this._onPlay, { signal });
    video.addEventListener('pause', this._onPause, { signal });
    video.addEventListener('ended', this._onEnded, { signal });
    video.addEventListener('loadeddata', this._onLoadeddata, { signal });
    video.addEventListener('click', this._onClick, { signal });
    video.addEventListener('error', this._onError, { signal });
    video.addEventListener('ratechange', this._onRatechange, { signal });
    ens.addEventListener('keydown', this._onKeyDown, { signal, capture: true });
    input.addEventListener('input', this._onInput, { signal });
    btnPlay.addEventListener('click', this._onBtnPlayClick, { signal });
    btnMute.addEventListener('click', this._onBtnMuteClick, { signal });
    btnFullscreen.addEventListener('click', this._onBtnFullscreenClick, { signal });
    btnPiP.addEventListener('click', this._onBtnPiPClick, { signal });
    reactions.addEventListener('animationend', this._onAnimationend, { signal });
    actions.addEventListener('animationend', this._onTapAnimationend, { signal });
    this.addEventListener('contextmenu', this._onContextmenu, { signal });
    this.addEventListener('dblclick', this._onDblclick, { signal });

    if (event) {
      // fullscreen
      this.addEventListener(event, this._onFullscreenchange, { signal });
    }
    if (_wcl.isEventSupport('enterpictureinpicture', video)) {
      // picture in picture
      video.addEventListener('enterpictureinpicture', this._onPiPchange, { signal });
      video.addEventListener('leavepictureinpicture', this._onPiPchange, { signal });
    }

    // btn status correct
    if (!PiP) {
      btnPiP.hidden = true;
    }
    btnMute.setAttribute('data-mode', (this.muted) ? 'on' : 'off');
    if (!this.autoplay) {
      ens.dataset.idle = 'play';
    }

    // active
    ens.classList.add('active');
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  _format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'width':
        case 'height':
          if (_wcl.isNumeric(newValue)) {
            this.#config[attrName] = parseFloat(newValue);
          }
          break;
        case 'title':
        case 'artist':
        case 'src':
        case 'poster':
        case 'crossorigin':
          this.#config[attrName] = newValue;
          break;
        case 'muted':
        case 'loop':
        case 'autoplay':
        case 'controls':
          this.#config[attrName] = true;
          break;
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    const { btnMute, ens, video } = this.#nodes;

    if (!MscEzVideo.observedAttributes.includes(attrName)) {
      return;
    }

    this._format(attrName, oldValue, newValue);
    switch (attrName) {
      case 'width':
      case 'height':
        this._setVars();
        break;
      case 'title':
      case 'artist':
      case 'poster':
      case 'crossorigin':
        video[attrName] = this[attrName];
        break;
      case 'src':
        ens.classList.remove('error');
        video[attrName] = this[attrName];
        break;
      case 'muted':
        if (!this.muted) {
          btnMute.setAttribute('data-mode', 'off');
          if (ens.classList.contains('active')) {
            this._reaction('unmute');
          }
        } else {
          btnMute.setAttribute('data-mode', 'on');
          if (ens.classList.contains('active')) {
            this._reaction('mute');
          }
        }
      case 'loop':
      case 'autoplay':
        video[attrName] = this[attrName];
        (this[attrName]) ? video.setAttribute(attrName, '') : video.removeAttribute(attrName);
        break;
      case 'controls':
        break;
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults);
  }

  static get supportKeyboardKeys() {
    return legalKey;
  }

  _upgradeProperty(prop) {
    let value;

    if (MscEzVideo.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set width(value) {
    if (value) {
      return this.setAttribute('width', value);
    } else {
      return this.removeAttribute('width');
    }
  }

  get width() {
    return this.#config.width;
  }

  set height(value) {
    if (value) {
      return this.setAttribute('height', value);
    } else {
      return this.removeAttribute('height');
    }
  }

  get height() {
    return this.#config.height;
  }

  set src(value) {
    if (value) {
      return this.setAttribute('src', value);
    } else {
      return this.removeAttribute('src');
    }
  }

  get src() {
    return this.#config.src;
  }

  set poster(value) {
    if (value) {
      return this.setAttribute('poster', value);
    } else {
      return this.removeAttribute('poster');
    }
  }

  get poster() {
    return this.#config.poster;
  }

  set crossorigin(value) {
    if (value) {
      return this.setAttribute('crossorigin', value);
    } else {
      return this.removeAttribute('crossorigin');
    }
  }

  get crossorigin() {
    return this.#config.crossorigin;
  }

  set title(value) {
    if (value) {
      return this.setAttribute('title', value);
    } else {
      return this.removeAttribute('title');
    }
  }

  get title() {
    return this.#config.title;
  }

  set artist(value) {
    if (value) {
      return this.setAttribute('artist', value);
    } else {
      return this.removeAttribute('artist');
    }
  }

  get artist() {
    return this.#config.artist;
  }

  set muted(value) {
    if (value) {
      return this.setAttribute('muted', '');
    } else {
      return this.removeAttribute('muted');
    }
  }

  get muted() {
    return this.#config.muted;
  }

  set loop(value) {
    if (value) {
      return this.setAttribute('loop', '');
    } else {
      return this.removeAttribute('loop');
    }
  }

  get loop() {
    return this.#config.loop;
  }

  get paused() {
    return this.#nodes.video.paused;
  }

  set autoplay(value) {
    if (value) {
      return this.setAttribute('autoplay', '');
    } else {
      return this.removeAttribute('autoplay');
    }
  }

  get autoplay() {
    return this.#config.autoplay;
  }

  set controls(value) {
    if (value) {
      return this.setAttribute('controls', '');
    } else {
      return this.removeAttribute('controls');
    }
  }

  get controls() {
    return this.#config.controls;
  }

  get fullscreened() {
    const { request, element } = fullscreen;
    let flag = false;

    if (request) {
      flag = document[element] === this;
    } else {
      flag = this.classList.contains('fullscreen');
    }

    return flag;
  }

  get PiPed() {
    const { video } = this.#nodes;
    let flag = false
    
    if (PiP) {
      if (video.webkitSetPresentationMode) {
        // webkit
        flag = video.webkitPresentationMode === 'picture-in-picture';
      } else {
        // chrome
        flag = this === document.pictureInPictureElement;
      }
    }

    return flag;
  }

  async requestPiP() {
    const { video } = this.#nodes;

    if (!PiP) {
      return;
    }

    this._reaction('pip');

    try {
      this.exitFS();

      if (video.webkitSetPresentationMode) {
        // webkit
        video.webkitSetPresentationMode('picture-in-picture');
        this._onPiPchange();
      } else {
        // chrome
        await video.requestPictureInPicture();
      }
    } catch(err) {
      console.error(`${_wcl.classToTagName('MscEzVideo')}: ${err.message}`);
    }
  }

  async exitPiP() {
    const { video } = this.#nodes;

    if (!PiP || !this.PiPed) {
      return;
    }

    this._reaction('pip');

    try {
      if (video.webkitSetPresentationMode) {
        // webkit
        video.webkitSetPresentationMode('inline');
        this._onPiPchange();
      } else {
        // chrome
        await document.exitPictureInPicture();
      }
    } catch(err) {
      console.error(`${_wcl.classToTagName('MscEzVideo')}: ${err.message}`);
    }
  }

  requestFS() {
    const { request } = fullscreen;
    const { btnFullscreen } = this.#nodes;

    this.exitPiP();

    if (request) {
      this[request]();
    } else {
      this.classList.add('fullscreen');
      btnFullscreen.setAttribute('data-mode', 'on');

      // custom event
      this.dispatchEvent(new Event(custumEvents.fullscreen, { bubbles: true, composed: true }));
    }
  }

  exitFS() {
    const { request, exit } = fullscreen;
    const { btnFullscreen } = this.#nodes;

    if (!this.fullscreened) {
      return;
    }

    if (request) {
      document[exit]();
    } else {
      this.classList.remove('fullscreen');
      btnFullscreen.setAttribute('data-mode', 'off');

      // custom event
      this.dispatchEvent(new Event(custumEvents.fullscreen, { bubbles: true, composed: true }));
    }
  }

  play() {
    this.#nodes.video.play();
  }

  pause() {
    this.#nodes.video.pause();
  }

  _onKeyDown(evt) {
    const { key } = evt;
    const { video, btnMute, btnFullscreen, btnPiP } = this.#nodes;
    const { request } = fullscreen;
    let rate;

    if (!MscEzVideo.supportKeyboardKeys.includes(key)) {
      return;
    }

    if (evt?.preventDefault) {
      evt.preventDefault();
    }

    switch (key) {
      case ' ':
      case 'k':
        video.click();
        break;
      case 'm':
        btnMute.click();
        break;
      case 'Escape':
        if (this.fullscreened && !request) {
          this.exitFS();
        }
        break;
      case 'f':
        btnFullscreen.click();
        break;
      case 'i':
        btnPiP.click();
        break;
      case 'j':
        this.currentTime -= 10;
        this._reaction('backward10');
        break;
      case 'l':
        this.currentTime += 10;
        this._reaction('forward10');
        break;
      case 'ArrowLeft':
        this.currentTime -= 5;
        this._reaction('backward5');
        break;
      case 'ArrowRight':
        this.currentTime += 5;
        this._reaction('forward5');
        break;
      case '<':
        rate = this.playbackRate - .25;
        if (rate < minPlaybackRate) {
          rate = minPlaybackRate;
        }
        this.playbackRate = rate;
        this._reaction('speeddownrate');
        break;
      case '>':
        rate = this.playbackRate + .25;
        if (rate > maxPlaybackRate) {
          rate = maxPlaybackRate;
        }
        this.playbackRate = rate;
        this._reaction('speeduprate');
        break;
      default:
        this.currentTime = (+key * 10) / 100 * this.duration;
    }
  }

  get currentTime() {
    return this.#nodes.video.currentTime || 0;
  }

  set currentTime(value) {
    try {
      this.#nodes.video.currentTime = value;
    } catch(err) {
      console.error(`${_wcl.classToTagName('MscEzVideo')}: ${err.message}`);
    }
  }

  get duration() {
    return this.#nodes.video.duration || 0;
  }

  get playbackRate() {
    return this.#nodes.video.playbackRate || 1;
  }

  set playbackRate(value) {
    const { playbackRate } = this;

    if (value > maxPlaybackRate) {
      value = maxPlaybackRate;
    } else if (value < minPlaybackRate) {
      value = minPlaybackRate;
    }

    try {
      this.#nodes.video.playbackRate = value;
      this._reaction((value >= playbackRate) ? 'speeduprate' : 'speeddownrate');
    } catch(err) {
      console.error(`${_wcl.classToTagName('MscEzVideo')}: ${err.message}`);
    }
  }

  _timeformat(seconds) {
    const time = [];
    let ct = Math.floor(seconds);
    let tmp = 0;

    //hour
    if (ct >= 3600) {
      tmp = Math.floor(ct / 3600);
      time.push(tmp);
      ct = ct % 3600;
    }

    //minute
    if (ct >= 60) {
      tmp = Math.floor(ct / 60);
      time.push(tmp);
      ct = ct % 60;
    } else {
      time.push('0');
    }

    //second
    if (ct) {
      if (ct < 10) {
        ct = '0' + ct;
      }
      time.push(ct);
    } else {
      time.push('00');
    }

    return time.join(':');
  }

  _reaction(mode) {
    const { reactions, btnPlay, btnMute, btnPiP, playbackrate } = this.#nodes;
    let reaction;

    switch (mode) {
      case 'play':
        reaction = templateReactionPlay.content.cloneNode(true);
        btnPlay.classList.add('tap');
        break;
      case 'pause':
        reaction = templateReactionPause.content.cloneNode(true);
        btnPlay.classList.add('tap');
        break;
      case 'mute':
        reaction = templateReactionMute.content.cloneNode(true);
        btnMute.classList.add('tap');
        break;
      case 'unmute':
        reaction = templateReactionUnmute.content.cloneNode(true);
        btnMute.classList.add('tap');
        break;
      case 'pip':
        reaction = templateReactionPiP.content.cloneNode(true);
        btnPiP.classList.add('tap');
        break;
      case 'forward5':
        reaction = templateReactionForward5.content.cloneNode(true);
        break;
      case 'forward10':
        reaction = templateReactionForward10.content.cloneNode(true);
        break;
      case 'backward5':
        reaction = templateReactionBackward5.content.cloneNode(true);
        break;
      case 'backward10':
        reaction = templateReactionBackward10.content.cloneNode(true);
        break;
      case 'speeduprate':
        playbackrate.textContent = `${this.playbackRate}x`;
        reaction = templateReactionSpeedUpRate.content.cloneNode(true);
        break;
      case 'speeddownrate':
        playbackrate.textContent = `${this.playbackRate}x`;
        reaction = templateReactionSpeedDownRate.content.cloneNode(true);
        break;
    }

    reactions.insertBefore(reaction, playbackrate);
  }

  _onLoadeddata() {
    const { timeEnded } = this.#nodes;

    timeEnded.textContent = this._timeformat(this.duration);
  }

  _onProgress() {
    const { barBuffer, video:{ buffered } } = this.#nodes;

    if (buffered.length) {
      const loaded = buffered.end(buffered.length - 1);
      let value = (loaded / this.duration) * 100;

      if (isNaN(value)) {
        value = 0;
      }

      barBuffer.value =  value;
    }
  }

  _onPlay() {
    const { btnPlay, ens } = this.#nodes;

    ens.dataset.idle = '';
    ens.classList.remove('error');

    btnPlay.setAttribute('data-mode', 'play');
    this._reaction('play');

    // custom event
    this.dispatchEvent(new Event(custumEvents.play, { bubbles: true, composed: true }));

    if (mediaSession) {
      /*
       * media session: https://web.dev/media-session/
       * the following code will active only come with audio & unmute
       *
       * KeyboardEvent: https://developer.mozilla.org/zh-TW/docs/Web/API/KeyboardEvent/KeyboardEvent
       * document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft'}))
       */

      const { poster, title, artist, playbackRate, currentTime, duration } = this;
      const { length: cnt } = getAllEzVideo();
          let actionHandlers

          if (cnt > 1) {
            actionHandlers = [
              ['seekbackward', (details) => this._onKeyDown({ key: 'ArrowLeft' })],
              ['seekforward', (details) => this._onKeyDown({ key: 'ArrowRight' })],
              ['previoustrack', () => mediaTrackAction(this, 'previous')],
              ['nexttrack', () => mediaTrackAction(this, 'next')]
            ]
          } else {
            actionHandlers = [
              ['seekbackward', (details) => this._onKeyDown({ key: 'ArrowLeft' })],
              ['seekforward', (details) => this._onKeyDown({ key: 'ArrowRight' })]
            ]
          }

      navigator.mediaSession.metadata = new window.MediaMetadata({
        title,
        artist,
        artwork: [
          { src: poster, sizes: '512x512', type: 'image/png' }
        ]
      });

      for (const [action, handler] of actionHandlers) {
        try {
          navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
          console.log(`The media session action "${action}" is not supported yet.`);
        }
      }

      // navigator.mediaSession.playbackState = this.paused ? 'paused' : 'playing';
    }
  }

  _onPause() {
    const { btnPlay } = this.#nodes;

    btnPlay.setAttribute('data-mode', 'pause');
    this._reaction('pause');

    // custom event
    this.dispatchEvent(new Event(custumEvents.pause, { bubbles: true, composed: true }));
  }

  _onEnded() {
    const { ens } = this.#nodes;

    if (this.paused && this.duration === this.currentTime) {
      ens.dataset.idle = 'replay';
    }
  }

  _onTimeupdate() {
    const { currentTime, duration } = this;
    const { input } = this.#nodes;
    let value = (currentTime / duration) * 100;

    if (isNaN(value)) {
      value = 0;
    }

    input.value = value;
    this._updatePassedInfo();
  }

  _onInput() {
    const { input:{ value = 0 } } = this.#nodes;
    const time = this.duration * value / 100;

    this.currentTime = time;
    this._updatePassedInfo();

    // custom event
    this.dispatchEvent(new Event(custumEvents.seek, { bubbles: true, composed: true }));
  }

  _updatePassedInfo() {
    const { input:{ value = 0 }, barDuration, timePassed } = this.#nodes;
        const time = (this.duration * value) / 100;

      barDuration.value = value;
      timePassed.textContent = this._timeformat(time);
  }

  _onClick() {
    (this.paused) ? this.play() : this.pause();
  }

  _onFullscreenchange() {
    const { element } = fullscreen;
    const { btnFullscreen } = this.#nodes;

    if (document[element]) {
      btnFullscreen.setAttribute('data-mode', 'on');
    } else {
      btnFullscreen.setAttribute('data-mode', 'off');
    }

    // custom event
    this.dispatchEvent(new Event(custumEvents.fullscreen, { bubbles: true, composed: true }));
  }

  _onPiPchange() {
    // custom event
    this.dispatchEvent(new Event(custumEvents.PiP, { bubbles: true, composed: true }));
  }

  _onDblclick() {
    (this.fullscreened) ? this.exitFS() : this.requestFS();
  }

  _onBtnPiPClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if (!PiP) {
      return;
    }

    (this.PiPed) ? this.exitPiP() : this.requestPiP();
  }

  _onBtnPlayClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    evt.target.classList.add('tap');

    (this.paused) ? this.play() : this.pause();
  }

  _onBtnMuteClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.muted = !this.muted;

    // custom event
    this.dispatchEvent(new Event(custumEvents.mute, { bubbles: true, composed: true }));
  }

  _onBtnFullscreenClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this._onDblclick();
  }

  _onAnimationend(evt) {
    evt.target.remove();
  }

  _onTapAnimationend(evt) {
    const { target } = evt;
    const a = target.closest('a');

    evt.stopPropagation();

    if (a && a.classList.contains('tap')) {
      a.classList.remove('tap');
    }
  }

  _onContextmenu(evt) {
    evt.preventDefault();
  }

  _onError(evt) {
    const { video:{ error }, ens } = this.#nodes;

    /**
     * MediaError.code
     * reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
     */
    ens.classList.add('error');

    // custom event
    this.dispatchEvent(new CustomEvent(custumEvents.error, {
      bubbles: true,
      composed: true,
      detail: {
        error
      }
    }));
  }

  _onRatechange(evt) {
    // custom event
    this.dispatchEvent(new Event(custumEvents.rate, { bubbles: true, composed: true }));
  }

  _grabVideoInstance() {
    let { video, ens } = this.#nodes;

    /**
     * active video[autoplay], video[muted] for iOS
     * -----------------------------------
     * video[autoplay], video[muted] must be visible in HTML document,
     * if developers like to trigger video play without user gesture.
     */

    if (_wcl.isIOS && (this.autoplay || this.muted)) {
      const stand = video.cloneNode(true);

      document.body.appendChild(stand);
      ens.replaceChild(stand, video);

      video = stand;
      this.#nodes.video = video;
    }

    return video;
  }

  _setVars() {
    const { width, height } = this;
    _wcl.addStylesheetRules('.active', {
      '--w': width,
      '--h': height
    }, this.#nodes.styleSheet);
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscEzVideo');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(T, MscEzVideo);
}
