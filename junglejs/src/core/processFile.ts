import fs from "fs-extra";
import path from "path";
import rollup from "rollup";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import * as fetch from "node-fetch";

import isSvelteFile from "../utils/isSvelteFile";
import isFileParameters from "../utils/isFileParameters";
import colorLog from "../utils/colorLog";

export async function processFile(file, jungleConfig, dirname, src, extension) {
	const fileParts = file.split('.');

	if (/\s|_|-/.test(fileParts[0])) {
		colorLog('red', `File "${extension}/${file}" doesn't follow UpperCamelCase`)
	} else {
		if (isSvelteFile(file) && !isFileParameters(file)) {
			//If Index, set to be root of the built folder, else join a multiword into hyphen seperated lowercase words
			const filename = fileParts[0] != 'Index' ? fileParts[0].match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g).join('-').toLowerCase() : '.';

			await fs.ensureDir(`jungle/build${extension}/${filename}/`);

			const mainJs = `import SFile from ${JSON.stringify(path.join(dirname, `${src}${extension}/${file}`))}; export default new SFile({target: document.body, hydrate: true});`;

			if (await fs.pathExists(`${src}${extension}/${file}`)) {
				await fs.writeFile(`jungle/build${extension}/${filename}/main.js`, mainJs);

				const clientBundle = await rollup.rollup(jungleConfig.clientInputOptions(filename, extension));
				await clientBundle.write(jungleConfig.clientOutputOptions(filename, extension));

				const ssrBundle = await rollup.rollup(jungleConfig.ssrInputOptions(filename, extension, src));
				await ssrBundle.write(jungleConfig.ssrOutputOptions(filename, extension));

				await fs.remove(`jungle/build${extension}/${filename}/main.js`);
				await fs.remove(`jungle/build${extension}/${filename}/ssr.js`);

				console.log(`Preprocessed route "${extension}/${file}"`);
			}
		}
	}
}

export async function processFileForParameters(port, file, dirname, src, extension) {
	const fileParts = file.split('.');
	const fileParameters = isFileParameters(file) ? fileParts[0].substring(1, fileParts[0].length - 1).split(',') : [];

	if (isSvelteFile(file) && isFileParameters(file)) {
		const rawSvelteFile = fs.readFileSync(path.join(dirname, `${src}${extension}/${file}`), "utf8");
		const queryParamOpts = RegExp(/const QUERYPARAMOPTS = `([^]*?)`;/gm).exec(rawSvelteFile)[1];

    const client = new ApolloClient({ uri: `http://localhost:${port}/graphql`, fetch: fetch });
    // todo
		const data: any = Object.values((await client.query({ query: gql`${queryParamOpts}` })).data)[0];

    // todo
		const parameterOptions: any = {};
		parameterOptions[Object.keys(data[0])[0]] = data.map(m => Object.values(m)[0]);

		fileParameters.forEach(fileParameter => {
			parameterOptions[fileParameter].forEach(paramOption => {
				const pFilename = paramOption.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
				const processedFile = rawSvelteFile.replace('${' + `QUERYPARAMS['${fileParameter}']` + '}', paramOption).replace('${' + `QUERYPARAMS["${fileParameter}"]` + '}', paramOption);

				fs.ensureDirSync(path.join(dirname, `jungle/.cache/routes${extension}`));
				fs.writeFileSync(path.join(dirname, `jungle/.cache/routes${extension}/${pFilename}.svelte`), processedFile);
			});
		});
	}
}
