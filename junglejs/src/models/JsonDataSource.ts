// later exported to own repo
import { v1 } from "uuid";
import find from "lodash.find";

import DataSource from "./DataSource";

export default class JsonDataSource<DEFAULT_VALUE_TYPE> extends DataSource<
  any[],
  DEFAULT_VALUE_TYPE
> {
  records;

  constructor(params: JsonDataSource<DEFAULT_VALUE_TYPE>, schemaComposer: any) {
    const options = {
      format: "json",
    };

    super({ ...params, ...options }, schemaComposer);

    const { query, mutation, format, items } = this;

    this.records = items.map((item) => {
      item._id = v1();
      item._data_source = format;
      return item;
    });

    schemaComposer.addFields(query());
    schemaComposer.addFields(mutation());
  }

  query() {
    const {
      composeWithJson,
      queryArgs,
      items,
      name,
      typeName,
      records,
      schemaComposer,
    } = this;
    const queryFields = {};
    composeWithJson(typeName, records[0], { schemaComposer });

    queryFields[name] = {
      type: typeName,
      args: queryArgs,
      resolve: (_, args) => find(items, args),
    };

    queryFields[name + "s"] = {
      type: `[${typeName}]`,
      resolve: (_) => items,
    };

    return queryFields;
  }

  mutation() {
    const { typeName, createArgs, updateArgs, items } = this;
    const mutationFields = {};

    mutationFields["create" + typeName] = {
      type: typeName,
      args: createArgs,
      resolve: (_, args) => {
        const newRecord = args;
        // TODO
        return newRecord;
      },
    };

    mutationFields["update" + typeName] = {
      type: "Boolean!",
      args: { updateArgs, ...{ _id: "String!" } },
      resolve: (_, args) => {
        const origin = items.find((x) => x._id === args._id);
        const updatedRecord = { ...origin, ...args };
        console.log(updatedRecord);
        // TODO
        return true;
      },
    };

    mutationFields["remove" + typeName] = {
      type: "Boolean!",
      args: { _id: "String!" },
      resolve: (_, args) => {
        console.log(args);
        return true;
      },
    };

    return mutationFields;
  }
}
