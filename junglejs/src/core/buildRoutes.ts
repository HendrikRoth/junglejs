import fs from "fs-extra";

export default async function buildRoutes(jungleConfig, dirname, callback?: Function) {
		await fs.remove(`jungle`);
		await fs.ensureDir(`jungle/build`);
		await fs.ensureDir(`jungle/.cache`);

		await fs.copy('src/components', 'jungle/.cache/components');
		await fs.copy('static', 'jungle/build');

		await processDirectory(jungleConfig, dirname, 'src/routes');
		await processDirectoryForParameters(jungleConfig, dirname, 'src/routes');
		await processDirectory(jungleConfig, dirname, 'jungle/.cache/routes');

    if (callback) callback();
}
