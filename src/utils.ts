import {execSync} from 'child_process';
import {platform} from 'os';
import {quote} from 'shell-quote';

function isExec(command: string): boolean {
	try {
		execSync(quote(command.split(' ')), {stdio: 'ignore'});
		return true;
	} catch {
		return false;
	}
}

function findCommand(): string {
	if (/^win/.test(platform())) {
		return 'where';
	} else {
		return 'command -v';
	}
}

export function findExec(...commands: string[]): string | null {
	const find = findCommand();
	for (const command of commands) {
		if (isExec(`${find} ${command}`)) {
			return command;
		}
	}
	return null;
}
