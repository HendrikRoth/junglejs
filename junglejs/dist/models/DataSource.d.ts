import { GraphQLArgs } from "graphql";
import Plugin from "./Plugin";
import { SchemaComposer } from "graphql-compose";
export interface DataSourceParams<ITEM_TYPE, DEFAULT_VALUE_TYPE> {
    name: string;
    format: string;
    items: ITEM_TYPE;
    queryArgs: GraphQLArgs;
    createArgs?: GraphQLArgs;
    updateArgs?: GraphQLArgs;
    defaultValues: DEFAULT_VALUE_TYPE;
}
export default class DataSource<ITEM_TYPE, DEFAULT_VALUE_TYPE> extends Plugin {
    name: string;
    typeName: string;
    format: string;
    items: ITEM_TYPE;
    defaultValues: DEFAULT_VALUE_TYPE;
    queryArgs: any;
    createArgs: any;
    updateArgs: any;
    composeWithJson: Function;
    schemaComposer: SchemaComposer<ITEM_TYPE>;
    constructor(params: DataSourceParams<ITEM_TYPE, DEFAULT_VALUE_TYPE>, schemaComposer: any);
}
