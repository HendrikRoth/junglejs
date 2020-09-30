import acorn from "acorn";
import walk from "acorn-walk";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

export default async function processContent(content: string, options: {queryName: string, resVarName: string, graphqlPort: number}) {
  let queryVarStart, queryVarEnd, resVarStart, resVarEnd;
  const { queryName, resVarName, graphqlPort } = options;
  const tree = acorn.parse(content, { sourceType: "module" });

  walk.simple(tree, {
    VariableDeclaration(node) {
      // todo
      node.declarations.forEach((declaration) => {
        if (declaration.id.name === queryName) {
          queryVarStart = declaration.init.start + 1;
          queryVarEnd = declaration.init.end + 1;
        } else if (declaration.id.name === resVarName) {
          resVarStart = declaration.start;
          resVarEnd = declaration.end;
        }
      });
    },
  });

  if (!resVarStart || !queryVarStart) return { code: content };

  const query = content.slice(queryVarStart, queryVarEnd);

  const client = new ApolloClient({
    uri: `http://localhost:${graphqlPort}/graphql`,
    fetch: fetch,
  });

  const result = (
    await client.query({
      query: gql`
        ${query}
      `,
    })
  ).data;
  const data = JSON.stringify(result);

  const finalCode =
    content.slice(0, resVarStart) +
    resVarName +
    " = " +
    data +
    content.slice(resVarEnd, content.length);

  return { code: finalCode };
}
