import {Player} from './lib/index.js';

const player = new Player({player: 'ffplay'});
const {promise, process} = player.play('./assets/test.mp3', {
	ffplay: ['-nodisp', '-autoexit'],
});

promise
	.then(() => {
		console.log('audio ended successfully!');
	})
	.catch(() => {
		console.log('stopped');
	});

// process.kill('SIGTERM');
