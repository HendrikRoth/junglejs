import * as fs from "fs-extra";
import { processDirectory, processDirectoryForParameters } from "./processDirectory";

export default async function buildRoutes(port, jungleConfig, dirname, callback?: Function) {
		await fs.remove(`jungle`);
		await fs.ensureDir(`jungle/build`);
		await fs.ensureDir(`jungle/.cache`);

		await fs.copy('src/components', 'jungle/.cache/components');
		await fs.copy('static', 'jungle/build');

		await processDirectory(jungleConfig, dirname, 'src/routes');
		await processDirectoryForParameters(port, jungleConfig, dirname, 'src/routes');
		await processDirectory(jungleConfig, dirname, 'jungle/.cache/routes');

    if (callback) callback();
}
