# @vdegenne/play-sound

Fork of [play-sound](https://github.com/shime/play-sound) with the following modern improvements:

- ESM compliant (see usage).
- Types are directly included in the package.
- Added `ffplay` player.
- Promisified (see usage).
- Removed unnecessary dependencies.
- Code cleaned.

## Installation

    npm i @vdegenne/play-sound

## Examples

### Basic

```javascript
import {Player} from '@vdegenne/play-sound';
const player = new Player();

player.play('./assets/test.mp3');
```

### Promise

```javascript
import {Player} from '@vdegenne/play-sound';
const player = new Player();

const {promise} = player.play('./assets/test.mp3');
promise.then(() => console.log('audio ended'));
```

### How to stop audio (Promise advanced)

```javascript
import {Player} from '@vdegenne/play-sound';
const player = new Player();

const {promise, process} = player.play('./assets/test.mp3');

setTimeout(() => {
	// send signal after 1s
	process.kill('SIGTERM');
}, 1000);

try {
	await promise;
	// Audio was not stopped, continue...
} catch {
	// Audio was stopped prematurely
}
```

### Choose base command + options

```javascript
import {Player} from '@vdegenne/play-sound';
const player = new Player({player: 'ffplay'});
player.play('./assets/test.mp3', {
	ffplay: ['-nodisp', '-autoexit'],
});
```

## Options

- `players` – List of available audio players to check. Default:
  - [`mplayer`](https://www.mplayerhq.hu/)
  - [`afplay`](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/afplay.1.html)
  - [`mpg123`](http://www.mpg123.de/)
  - [`mpg321`](http://mpg321.sourceforge.net/)
  - [`play`](http://sox.sourceforge.net/)
  - [`omxplayer`](https://github.com/popcornmix/omxplayer)
  - [`aplay`](https://linux.die.net/man/1/aplay)
  - [`cmdmp3`](https://github.com/jimlawless/cmdmp3)
  - [`cvlc`](https://www.commandlinux.com/man-page/man1/cvlc.1.html)
  - [`powershell`](https://docs.microsoft.com/en-us/powershell/)
- `player` – Audio player to use (skips availability checks)

## License

MIT
