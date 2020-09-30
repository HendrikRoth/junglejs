export default function isSvelteFile(file: string) {
	const fileParts = file.split('.');
	return fileParts[fileParts.length - 1] === 'svelte' && fileParts.length == 2;
}
