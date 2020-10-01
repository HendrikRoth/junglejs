"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// later exported to own repo
const uuid_1 = require("uuid");
const lodash_find_1 = __importDefault(require("lodash.find"));
const DataSource_1 = __importDefault(require("./DataSource"));
class JsonDataSource extends DataSource_1.default {
    constructor(params, schemaComposer) {
        const options = {
            format: "json",
        };
        super(Object.assign(Object.assign({}, params), options), schemaComposer);
        const { query, mutation, format, items } = this;
        this.records = items.map((item) => {
            item._id = uuid_1.v1();
            item._data_source = format;
            return item;
        });
        schemaComposer.addFields(query());
        schemaComposer.addFields(mutation());
    }
    query() {
        const { composeWithJson, queryArgs, items, name, typeName, records, schemaComposer, } = this;
        const queryFields = {};
        composeWithJson(typeName, records[0], { schemaComposer });
        queryFields[name] = {
            type: typeName,
            args: queryArgs,
            resolve: (_, args) => lodash_find_1.default(items, args),
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
            args: Object.assign({ updateArgs }, { _id: "String!" }),
            resolve: (_, args) => {
                const origin = items.find((x) => x._id === args._id);
                const updatedRecord = Object.assign(Object.assign({}, origin), args);
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
exports.default = JsonDataSource;
