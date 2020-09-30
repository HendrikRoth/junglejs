import { GraphQLArgs } from "graphql";
import Plugin from "./Plugin";
import {composeWithJson} from "graphql-compose-json";
import { SchemaComposer } from "graphql-compose";

export interface DataSourceParams<ITEM_TYPE, DEFAULT_VALUE_TYPE> {
  name: string;
  format: string;
  items: ITEM_TYPE[];
  queryArgs: GraphQLArgs;
  createArgs?: GraphQLArgs;
  updateArgs?: GraphQLArgs;
  defaultValues: DEFAULT_VALUE_TYPE;
}

export default class DataSource<ITEM_TYPE, DEFAULT_VALUE_TYPE> extends Plugin {
  name: string;
  typeName: string;
  format: string;
  items: ITEM_TYPE[];
  defaultValues: DEFAULT_VALUE_TYPE;
  queryArgs: GraphQLArgs;
  createArgs: GraphQLArgs;
  updateArgs: GraphQLArgs;
  composeWithJson: Function = composeWithJson;
  schemaComposer: SchemaComposer<ITEM_TYPE>;

  constructor(params: DataSourceParams<ITEM_TYPE, DEFAULT_VALUE_TYPE>, schemaComposer: any) {
    super();

    this.schemaComposer = schemaComposer;
    this.name = params.name;
    this.typeName = name.charAt(0).toUpperCase() + name.slice(1);
    this.format = params.format;
    this.items = params.items;
    this.queryArgs = params.queryArgs;
    this.createArgs = params.createArgs || {};
    this.updateArgs = params.updateArgs || {};
  }
}
