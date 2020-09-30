async function processFileForParameters(file, dirname, src, extension) {
  const fileParts = file.split(".");
  const fileParameters = isFileParameters(file)
    ? fileParts[0].substring(1, fileParts[0].length - 1).split(",")
    : [];

  if (isSvelteFile(file) && isFileParameters(file)) {
    const rawSvelteFile = fs.readFileSync(
      path.join(dirname, `${src}${extension}/${file}`),
      "utf8"
    );
    const queryParamOpts = RegExp(/const QUERYPARAMOPTS = `([^]*?)`;/gm).exec(
      rawSvelteFile
    )[1];

    const client = new ApolloClient({
      uri: `http://localhost:${port}/graphql`,
      fetch: fetch,
    });
    const data = Object.values(
      (
        await client.query({
          query: gql`
            ${queryParamOpts}
          `,
        })
      ).data
    )[0];

    const parameterOptions = {};
    parameterOptions[Object.keys(data[0])[0]] = data.map(
      (m) => Object.values(m)[0]
    );

    fileParameters.forEach((fileParameter) => {
      parameterOptions[fileParameter].forEach((paramOption) => {
        const pFilename = paramOption
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join("");
        const processedFile = rawSvelteFile
          .replace("${" + `QUERYPARAMS['${fileParameter}']` + "}", paramOption)
          .replace("${" + `QUERYPARAMS["${fileParameter}"]` + "}", paramOption);

        fs.ensureDirSync(
          path.join(dirname, `jungle/.cache/routes${extension}`)
        );
        fs.writeFileSync(
          path.join(
            dirname,
            `jungle/.cache/routes${extension}/${pFilename}.svelte`
          ),
          processedFile
        );
      });
    });
  }
}
