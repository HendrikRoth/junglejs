// later exported to own repo

import fs from "fs-extra";
import path from "path";
import { GraphQLArgs } from "graphql";
import marked from "marked";
import grayMatter from "gray-matter";
import find from "lodash.find";
import { v1 } from "uuid";

import DataSource from "./DataSource";

const renderer = new marked.Renderer();
const FILE_EXTENSION = ".md";

interface MarkdownDataSourceParams<DEFAULT_VALUE_TYPE> {
  name: string;
  items: string;
  queryArgs: GraphQLArgs;
  createArgs?: GraphQLArgs;
  updateArgs?: GraphQLArgs;
  defaultValues: DEFAULT_VALUE_TYPE;
  dirname: string;
}

export default class MarkdownDataSource<DEFAULT_VALUE_TYPE> extends DataSource<
  string,
  DEFAULT_VALUE_TYPE
> {
  records;
  dirname;

  constructor(
    params: MarkdownDataSourceParams<DEFAULT_VALUE_TYPE>,
    schemaComposer: any
  ) {
    const options = {
      format: "dir/markdown",
    };

    super({ ...params, ...options }, schemaComposer);

    this.records = [];

    const { dirname, items, records, query, mutation, format } = this;

    fs.readdirSync(path.join(dirname, items)).map((fileName) => {
      const item = fs.readFileSync(
        path.resolve(path.join(dirname, items), fileName),
        "utf-8"
      );
      const { data, content } = grayMatter(item);
      const html = marked(content, { renderer });

      data._content = content;
      data._path = fileName.substring(
        0,
        fileName.length - FILE_EXTENSION.length
      );
      data._id = v1();
      data._data_source = format;

      records.push({ html, ...data });
    });

    schemaComposer.addFields(query());
    schemaComposer.addFields(mutation());
  }

  findIndex(_id: string) {
    return Object.keys(this.records).findIndex(
      (x) => this.records[x]._id === _id
    );
  }

  write(record, args) {
    const { records, dirname, items } = this;
    const index = this.findIndex(args._id);
    const origin = records[index];
    const data = { ...this.defaultValues, ...origin, ...record };

    if (index > -1) {
      records[index] = { ...data };
    } else {
      records.push({ ...data });
    }

    delete data.html;
    delete data._id;
    delete data._content;
    delete data._data_source;
    delete data._path;

    const fileStr = ["---"];
    Object.keys(args).forEach((key) => {
      let value: string;

      if (args[key] === "[JSON]") {
        value = data[key] && data[key].length > 0 ? `"${data[key]}"` : "[]";
        record[key] = data[key] || [];
      } else {
        value = data[key] || '""';
        record[key] = data[key] || "";
      }

      fileStr.push([key, value].join(": "));
    });
    fileStr.push("---");
    fileStr.push(record._content);

    fs.writeFileSync(
      path.resolve(path.join(dirname, items, record._path + FILE_EXTENSION)),
      fileStr.join("\n"),
      "utf-8"
    );
  }

  query() {
    const {
      name,
      typeName,
      queryArgs,
      records,
      schemaComposer,
      composeWithJson,
    } = this;
    const queryFields = {};

    composeWithJson(typeName, records[0], { schemaComposer });

    queryFields[name] = {
      type: typeName,
      args: queryArgs,
      resolve: (_, args) => find(records, args),
    };

    queryFields[name + "s"] = {
      type: `[${typeName}]`,
      resolve: (_) => records,
    };

    return queryFields;
  }

  mutation() {
    const {
      typeName,
      createArgs,
      updateArgs,
      records,
      dirname,
      items,
      format,
      findIndex,
      write,
    } = this;
    const mutationFields = {};

    mutationFields["create" + typeName] = {
      type: typeName,
      args: createArgs,
      resolve: (_, args) => {
        const newRecord = args;
        newRecord._id = v1();
        newRecord._data_source = format;
        newRecord._path = newRecord._id; // TODO
        write(newRecord, createArgs);
        return newRecord;
      },
    };

    mutationFields["update" + typeName] = {
      type: "Boolean",
      args: { ...updateArgs, ...{ _id: "String!" } },
      resolve: (_, args) => {
        const origin = find(records, { _id: args._id });
        const updatedRecord = { ...origin, ...args };
        write(updatedRecord, updateArgs);
        return true;
      },
    };

    mutationFields["remove" + typeName] = {
      type: "Boolean!",
      args: { _id: "String!" },
      resolve: (_, args) => {
        const index = findIndex(args._id);
        if (index < 0) return false;
        const filePath = path.resolve(
          path.join(dirname, items, records[index]._path + FILE_EXTENSION)
        );
        fs.unlinkSync(filePath);
        records.splice(index, 1);
        return true;
      },
    };

    return mutationFields;
  }
}
