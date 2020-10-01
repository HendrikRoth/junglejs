import { GraphQLArgs } from "graphql";
import DataSource from "./DataSource";
interface MarkdownDataSourceParams<DEFAULT_VALUE_TYPE> {
    name: string;
    items: string;
    queryArgs: GraphQLArgs;
    createArgs?: GraphQLArgs;
    updateArgs?: GraphQLArgs;
    defaultValues: DEFAULT_VALUE_TYPE;
    dirname: string;
}
export default class MarkdownDataSource<DEFAULT_VALUE_TYPE> extends DataSource<string, DEFAULT_VALUE_TYPE> {
    records: any;
    dirname: any;
    constructor(params: MarkdownDataSourceParams<DEFAULT_VALUE_TYPE>, schemaComposer: any);
    findIndex(_id: string): number;
    write(record: any, args: any): void;
    query(): {};
    mutation(): {};
}
export {};
