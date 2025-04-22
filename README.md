# msc-ez-video

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-ez-video) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/19646/branches/513171/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=19646&bid=513171)

Modern browsers already had a vivid player for &lt;video /&gt;. However, web developers and designers still want to custom their own style player for different situations.

Sounds like web component will do a lot favor for this purpose. With &lt;msc-ez-video /&gt; support, customize control panel will become a piece of cake. &lt;msc-ez-video /&gt; adopts CSS custom properties, developers could style them as they want.

That's take a look what can &lt;msc-ez-video /&gt; do in different combination ?

（There will be only sound and picture in picture functions display when controls not set.）

![<msc-ez-video />](https://blog.lalacube.com/mei/img/preview/msc-ez-video.png)

## Features

- Tap &lt;msc-ez-video /&gt; to toggle play / pause.
- Double click &lt;msc-ez-video /&gt; to turn on / off fullscreen.
- Full function control panel will only display in fullscreen mode unless attribute - controls set.
- Picture in picture support once browser enable.
- Developers could customize control panel's appearance with CSS custom properties.

## Basic Usage

&lt;msc-ez-video /&gt; is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-ez-video /&gt;'s html structure and everything will be all set.

- Required Script

```html
<script 
  type="module"
  src="https://unpkg.com/msc-ez-video/mjs/wc-msc-ez-video.js"
</script>
```

- Structure

Put &lt;msc-ez-video /&gt; into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-ez-video
  src="your-video-path.mp4"
  poster="your-video-thumbnail-path.jpg"
  width="16"
  height="9"
  muted
  autoplay
  loop
  controls
  title="your video title"
  artist="your video artist"
></msc-ez-video>
```

Or

```html
<msc-ez-video>
  <script type="application/json">
    {
      "src": "your-video-path.mp4",
      "poster": "your-video-thumbnail-path.jpg",
      "width": 16,
      "height": 9,
      "muted": true,
      "autoplay": true,
      "loop": true,
      "controls": true,
      "title": "your video title",
      "artist": "your video artist"
    }
  </script>
</msc-ez-video>
```

Otherwise, developers could also choose `remoteconfig` to fetch config for &lt;msc-ez-video /&gt;.

```html
<msc-ez-video
  remoteconfig="https://617751a89c328300175f58b7.mockapi.io/api/v1/ezVideo"
  ...
></msc-ez-video>
```

## JavaScript Instantiation

&lt;msc-ez-video /&gt; could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscEzVideo } from 'https://unpkg.com/msc-ez-video/mjs/wc-msc-ez-video.js';

//use DOM api
const nodeA = document.createElement('msc-ez-video');
document.body.appendChild(nodeA);
nodeA.src = 'your-video-path.mp4';
nodeA.poster = 'your-video-thumbnail-path.jpg';

// new instance with Class
const nodeB = new MscEzVideo();
document.body.appendChild(nodeB);
nodeB.src = 'your-video-path.mp4';
nodeB.poster = 'your-video-thumbnail-path.jpg';

// new instance with Class & default config
const config = {
  src: 'your-video-path.mp4',
  poster: 'your-video-thumbnail-path.jpg',
  ...
};
const nodeC = new MscEzVideo(config);
document.body.appendChild(nodeC);
</script>
```

## Style Customization

&lt;msc-ez-video /&gt; uses CSS variables to hook control panel's theme. That means developer could easy change it into the looks you like.

```html
<style>
msc-ez-video {
  --msc-ez-video-object-fit: contain;
  
  /* slider thumb */
  --slider-thumb-with: 14px;
  --slider-thumb-color: rgba(255,0,0,1);

  /* indicator */
  --indicator-background: rgba(255,255,255,.2);
  --indicator-buffer-start: rgba(255,255,255,.4);
  --indicator-buffer-end: rgba(255,255,255,.4);
  --indicator-duration-start: rgba(255,0,0,1);
  --indicator-duration-end: rgba(255,0,0,1);

  /* time information */  
  --time-text-size: 16px;
  --time-text-color: #fff;

  /* warning information */  
  --warning-font-size: 16px;
  --warning-color: #fff;
  --warning-text: 'Some errors occured. Please try later.';

  /* function button */
  --action-height: 36px;
  --action-icon-size: auto 65%;
  --ico-play: url(ico-play.svg);
  --ico-pause: url(ico-pause.svg);
  --ico-mute: url(ico-mute.svg);
  --ico-unmute: url(ico-unmute.svg);
  --ico-fullscreen: url(ico-fullscreen.svg);
  --ico-fullscreen-exit: url(ico-fullscreen-exit.svg);
  --ico-pip: url(ico-pip.svg);
  --ico-replay: url(ico-replay.svg);
  --ico-warning: url(ico-warning.svg);
  --ico-forward-5: url(ico-forward-5.svg);
  --ico-forward-10: url(ico-forward-10.svg);
  --ico-backward-5: url(ico-backward-5.svg);
  --ico-backward-10: url(ico-backward-10.svg);
  --ico-speed-up-rate: url(ico-speed-up-rate.svg);
  --ico-speed-down-rate: url(ico-speed-down-rate.svg);

  /* reaction */
  --reaction-width: 52px;
  --reaction-bgc-start: rgba(0,0,0,.4);
  --reaction-bgc-end: rgba(0,0,0,.4);

  /* tip */
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

  /* playbackRate */
  --playbackrate-font-size: 18px;
  --playbackrate-line-height: 2;
  --playbackrate-color: #fff;
  --playbackrate-background: rgba(0,0,0,.6);
}
</style>
```

Delevelopers could add attribute - `data-clear-mode` to hide &lt;msc-ez-video />'s reaction & control panel.

```html
<msc-ez-video
  data-clear-mode
  ...
></msc-ez-video>
```

## Attributes

&lt;msc-ez-video /&gt; supports some attributes to let it become more convenience & useful.

- **src**

Set &lt;msc-ez-video /&gt;'s video source.

```html
<msc-ez-video
  src="your-video-path.mp4"
  ...
></msc-ez-video>
```

- **poster**

Set &lt;msc-ez-video /&gt;'s poster.

```html
<msc-ez-video
  poster="your-video-thumbnail-path.mp4"
  ...
></msc-ez-video>
```

- **width**

Set &lt;msc-ez-video /&gt;'s width ratio. Default is `16`.

```html
<msc-ez-video
  width="16"
  ...
></msc-ez-video>
```

- **height**

Set &lt;msc-ez-video /&gt;'s height ratio. Default is `9`.

```html
<msc-ez-video
  height="9"
  ...
></msc-ez-video>
```

- **title**

Set &lt;msc-ez-video /&gt;'s title. Default is "`unknown title`".

```html
<msc-ez-video
  tile="your-video-title"
  ...
></msc-ez-video>
```

- **artist**

Set &lt;msc-ez-video /&gt;'s artist information. Default is "`unknown artist`".

```html
<msc-ez-video
  artist="your-video-artist"
  ...
></msc-ez-video>
```

- **crossorigin**

Set &lt;msc-ez-video /&gt;'s crossorigin. Default is "`anonymous`".

```html
<msc-ez-video
  crossorigin="use-credentials"
  ...
></msc-ez-video>
```

- **muted**

Set &lt;msc-ez-video /&gt; mute active or not. Default is `false`.
Note: If developers like to implement autoplay, `muted` must set in mobile.

```html
<msc-ez-video
  muted
  ...
></msc-ez-video>
```

- **autoplay**

Set &lt;msc-ez-video /&gt; autoplay active or not. Default is false.
Note: If developers like to implement autoplay, `muted` must set in mobile.

```html
<msc-ez-video
  autoplay
  muted // must set to active autoplay
  ...
></msc-ez-video>
```

- **loop**

Set &lt;msc-ez-video />&gt; loop active or not. Default is `false`. There will be a replay sign appeared when video fininshed play once loop doesn't set.

```html
<msc-ez-video
  loop
  ...
></msc-ez-video>
```

- **loopendtime**

Set &lt;msc-ez-video /> looptime (in seconds). Video will seek to `0` when reach this value. Default is `NaN`. This will work only when `loop: true`.

```html
<msc-ez-video
  loop
  loopendtime="10"
  ...
></msc-ez-video>
```

- **controls**

Full function contrl panel will only display in fullscreen mode unless controls set. Default is `false`.

```html
<msc-ez-video
  controls
  ...
></msc-ez-video>
```

## Keyboard shortcut

&lt;msc-ez-video /&gt; also comes with keyboard shortcut. I believe this will make &lt;msc-ez-video /&gt; more vivid & more useful.

- **k**

Toggle &lt;msc-ez-video /&gt; play or pause.

- **space**

Toggle &lt;msc-ez-video /&gt; play or pause.

- **m**

Toggle &lt;msc-ez-video /&gt; mute or not.

- **f**

Toggle &lt;msc-ez-video /&gt; fullscreen or not.

- **i**

Toggle &lt;msc-ez-video /&gt; into picture in picture or not.

- **esc**

Turn off fullscreen mode.

- **←**

&lt;msc-ez-video /&gt; backward `5` seconds.

- **→**

&lt;msc-ez-video /&gt; forward `5` seconds.

- **j**

&lt;msc-ez-video /&gt; backward `10` seconds.

- **l**

&lt;msc-ez-video /&gt; forward `10` seconds.

- **<**

Decrease &lt;msc-ez-video /&gt; playback rate. Minimum is `0.25`.

- **>**

Increase &lt;msc-ez-video /&gt; playback rate. Minimum is `2`.

- **0** ~ **9**

&lt;msc-ez-video /&gt; jumps to specific timeline. Ex: `7` means to timeline `70%`.

## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| src | String | Getter / Setter for &lt;msc-ez-video /&gt;'s video source. |
| poster | String | Getter / Setter for &lt;msc-ez-video /&gt;'s poster. |
| title | String | Getter / Setter for &lt;msc-ez-video /&gt;'s title. |
| artist | String | Getter / Setter for &lt;msc-ez-video /&gt;'s artist. |
| width | Number | Getter / Setter for &lt;msc-ez-video /&gt;'s width ratio. |
| height | Number | Getter / Setter for &lt;msc-ez-video /&gt;'s height ratio. |
| crossorigin | String | Getter / Setter for &lt;msc-ez-video /&gt;'s s crossorigin. (It might be "`anonymous`" or "`use-credentials`"). |
| muted | Boolean | Getter / Setter for &lt;msc-ez-video /&gt;'s mute status. |
| autoplay | Boolean | Getter / Setter for &lt;msc-ez-video /&gt;'s autoplay status. |
| loop | Boolean | Getter / Setter for &lt;msc-ez-video /&gt;'s loop status. |
| loopendtime | Number | Getter / Setter for &lt;msc-ez-video />'s loopendtime (in seconds). This will work only when `loop: true`. |
| controls | Boolean | Getter / Setter for &lt;msc-ez-video /&gt;'s control panel status. |
| currentTime | Number | Getter / Setter for &lt;msc-ez-video /&gt;'s currentTime (in seconds). |
| duration | Number | Getter for &lt;msc-ez-video /&gt;'s duration (in seconds). |
| playbackRate | Number | Getter / Setter for &lt;msc-ez-video /&gt;'s playback rate. Rate should between `0.25` ~ `2`. |
| paused | Boolean | Getter for &lt;msc-ez-video /&gt;'s pause status. |
| fullscreened | Boolean | Getter for &lt;msc-ez-video /&gt;'s full screen status. |
| PiPed | Boolean | Getter for &lt;msc-ez-video /&gt;'s picture in picture status. |

## Mathods
| Mathod Signature | Description |
| ----------- | ----------- |
| play | Play video. |
| pause | Pause video. |
| requestFS | Switch into full screen mode. Note: this is `high-trusted` event. |
| exitFS | Switch back to normal mode. Note: this is `high-trusted` event. |
| requestPiP | Switch into picture in picture mode. Note: this is `high-trusted` event. |
| exitPiP | Switch back to normal mode. Note: this is `high-trusted` event. |

## Events
| Event Signature | Description |
| ----------- | ----------- |
| ez-video-loadeddata | Fired when &lt;msc-ez-video /> loaded data. |
| ez-video-play | Fired when &lt;msc-ez-video /&gt; played. |
| ez-video-pause | Fired when &lt;msc-ez-video /&gt; paused. |
| ez-video-seek | Fired when &lt;msc-ez-video /&gt; seeked. |
| ez-video-timeupdate | Fired when &lt;msc-ez-video /&gt; timeupdate. |
| ez-video-mutechange | Fired when &lt;msc-ez-video /&gt;'s mute status changed. |
| ez-video-fullscreenchange | Fired when &lt;msc-ez-video /&gt; full screen changed. |
| ez-video-PiPchange | Fired when &lt;msc-ez-video /&gt; picture in picutre changed. |
| ez-video-ratechange | Fired when &lt;msc-ez-video /&gt; playback rate changed. |
| ez-video-error | Fired when &lt;msc-ez-video /> error occured. |

## Reference
- [&lt;msc-ez-video /> demo](https://blog.lalacube.com/mei/webComponent_msc-ez-video.html)
- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/element/msc-ez-video)