import fs from "fs-extra";

import asyncForEach from "../utils/asyncForEach";
import {processFile, processFileForParameters} from './processFile';

export async function processDirectory(jungleConfig, dirname, src, extension: string = '') {
	await asyncForEach(fs.readdirSync(src + extension), async (file) => {
		if (fs.statSync(src + extension + '/' + file).isDirectory()) {
			await processDirectory(jungleConfig, dirname, src, `${extension}/${file}`);
		} else {
			await processFile(file, jungleConfig, dirname, src, extension);
		}
	});
}

export async function processDirectoryForParameters(jungleConfig, dirname, src, extension = '', paramGeneratedFiles = []) {
	await asyncForEach(fs.readdirSync(src + extension), async (file) => {
		if (fs.statSync(src + extension + '/' + file).isDirectory()) {
			await processDirectoryForParameters(jungleConfig, dirname, src, `${extension}/${file}`, paramGeneratedFiles);
		} else {
			await processFileForParameters(file, dirname, src, extension, port);
		}
	});

	return paramGeneratedFiles;
}
