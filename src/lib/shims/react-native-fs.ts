type StatResult = { size: number };

function notSupported(functionName: string): never {
	throw new Error(
		`react-native-fs shim: ${functionName}() was called in a web build. ` +
			`This project should not use React Native file APIs in the browser.`
	);
}

export function stat(_path: string): Promise<StatResult> {
	notSupported('stat');
}

export function read(
	_path: string,
	_length: number,
	_position: number,
	_options?: { encoding?: string }
): Promise<string> {
	notSupported('read');
}

export default {
	stat,
	read
};
