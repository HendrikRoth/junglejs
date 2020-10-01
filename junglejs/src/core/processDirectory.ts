import fs from "fs-extra";

import asyncForEach from "../utils/asyncForEach";
import {processFile, processFileForParameters} from './processFile';

export async function processDirectory(config, dirname, src, extension: string = '') {
	await asyncForEach(fs.readdirSync(src + extension), async (file) => {
		if (fs.statSync(src + extension + '/' + file).isDirectory()) {
			await processDirectory(config, dirname, src, `${extension}/${file}`);
		} else {
			await processFile(file, config, dirname, src, extension);
		}
	});
}

export async function processDirectoryForParameters(port, config, dirname, src, extension = '', paramGeneratedFiles = []) {
	await asyncForEach(fs.readdirSync(src + extension), async (file) => {
		if (fs.statSync(src + extension + '/' + file).isDirectory()) {
			await processDirectoryForParameters(port, config, dirname, src, `${extension}/${file}`, paramGeneratedFiles);
		} else {
			await processFileForParameters(port, file, dirname, src, extension);
		}
	});

	return paramGeneratedFiles;
}
