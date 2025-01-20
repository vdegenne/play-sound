import {spawn} from 'child_process';
import {findExec} from './utils.js';

const availablePlayers = [
	'mplayer',
	'afplay',
	'mpg123',
	'mpg321',
	'play',
	'omxplayer',
	'aplay',
	'cmdmp3',
	'cvlc',
	'powershell',
	'ffplay',
] as const;

type AvailablePlayer = (typeof availablePlayers)[number];

interface PlayOpts {
	players: AvailablePlayer[];
	player: AvailablePlayer;
}

const defaultOptions: PlayOpts = {
	players: [...availablePlayers],
	player: findExec(...availablePlayers) as AvailablePlayer,
};

type PlayMethodOptions = Partial<
	{
		[value in AvailablePlayer]: Array<string | number>;
	} & {
		timeout: number;
	}
>;

export class Player {
	#opts: PlayOpts;
	/**
	 * Regex by @stephenhay from https://mathiasbynens.be/demo/url-regex
	 */
	// #urlRegex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i;

	constructor(opts: Partial<PlayOpts>) {
		this.#opts = Object.assign({}, defaultOptions, opts);
	}

	play(what: string, options: PlayMethodOptions = {}) {
		const {promise, resolve, reject} = Promise.withResolvers<void>();

		// const isURL =
		// 	this.#opts.player === 'mplayer' && this.#urlRegex.test(what);
		//
		const args = Array.isArray(options[this.#opts.player])
			? options[this.#opts.player]!.concat(what).map(String)
			: [what];

		if (!this.#opts.player) {
			return reject("Couldn't find a suitable audio player");
		}

		const process = spawn(this.#opts.player, args, {stdio: 'ignore'});

		if (!process) {
			return reject('Unable to spawn process with ' + this.#opts.player);
		}

		process.on('close', (code, signal) => {
			if (code === 0) {
				// The audio played successfully and the process exited normally
				resolve();
			} else {
				// If the process ended with an error or was killed
				if (signal) {
					// Process was killed by a signal (like 'SIGTERM' or 'SIGKILL')
					reject(new Error('Audio playback was interrupted'));
				} else {
					// Some error occurred with the command
					reject(new Error(`Audio playback failed with exit code ${code}`));
				}
			}
		});
		process.on('error', (err) => {
			reject(new Error(`Failed to start audio playback: ${err.message}`));
		});

		return {promise, process};
	}

	test() {
		return this.play('./assets/test.mp3');
	}
}
