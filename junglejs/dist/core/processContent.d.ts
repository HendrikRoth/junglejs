export default function processContent(content: string, options: {
    queryName: string;
    resVarName: string;
    graphqlPort: number;
}): Promise<{
    code: string;
}>;
