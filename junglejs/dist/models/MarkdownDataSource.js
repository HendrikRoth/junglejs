"use strict";
// later exported to own repo
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const marked_1 = __importDefault(require("marked"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const lodash_find_1 = __importDefault(require("lodash.find"));
const uuid_1 = require("uuid");
const DataSource_1 = __importDefault(require("./DataSource"));
const renderer = new marked_1.default.Renderer();
const FILE_EXTENSION = ".md";
class MarkdownDataSource extends DataSource_1.default {
    constructor(params, schemaComposer) {
        const options = {
            format: "dir/markdown",
        };
        super(Object.assign(Object.assign({}, params), options), schemaComposer);
        this.records = [];
        const { dirname, items, records, query, mutation, format } = this;
        fs_extra_1.default.readdirSync(path_1.default.join(dirname, items)).map((fileName) => {
            const item = fs_extra_1.default.readFileSync(path_1.default.resolve(path_1.default.join(dirname, items), fileName), "utf-8");
            const { data, content } = gray_matter_1.default(item);
            const html = marked_1.default(content, { renderer });
            data._content = content;
            data._path = fileName.substring(0, fileName.length - FILE_EXTENSION.length);
            data._id = uuid_1.v1();
            data._data_source = format;
            records.push(Object.assign({ html }, data));
        });
        schemaComposer.addFields(query());
        schemaComposer.addFields(mutation());
    }
    findIndex(_id) {
        return Object.keys(this.records).findIndex((x) => this.records[x]._id === _id);
    }
    write(record, args) {
        const { records, dirname, items } = this;
        const index = this.findIndex(args._id);
        const origin = records[index];
        const data = Object.assign(Object.assign(Object.assign({}, this.defaultValues), origin), record);
        if (index > -1) {
            records[index] = Object.assign({}, data);
        }
        else {
            records.push(Object.assign({}, data));
        }
        delete data.html;
        delete data._id;
        delete data._content;
        delete data._data_source;
        delete data._path;
        const fileStr = ["---"];
        Object.keys(args).forEach((key) => {
            let value;
            if (args[key] === "[JSON]") {
                value = data[key] && data[key].length > 0 ? `"${data[key]}"` : "[]";
                record[key] = data[key] || [];
            }
            else {
                value = data[key] || '""';
                record[key] = data[key] || "";
            }
            fileStr.push([key, value].join(": "));
        });
        fileStr.push("---");
        fileStr.push(record._content);
        fs_extra_1.default.writeFileSync(path_1.default.resolve(path_1.default.join(dirname, items, record._path + FILE_EXTENSION)), fileStr.join("\n"), "utf-8");
    }
    query() {
        const { name, typeName, queryArgs, records, schemaComposer, composeWithJson, } = this;
        const queryFields = {};
        composeWithJson(typeName, records[0], { schemaComposer });
        queryFields[name] = {
            type: typeName,
            args: queryArgs,
            resolve: (_, args) => lodash_find_1.default(records, args),
        };
        queryFields[name + "s"] = {
            type: `[${typeName}]`,
            resolve: (_) => records,
        };
        return queryFields;
    }
    mutation() {
        const { typeName, createArgs, updateArgs, records, dirname, items, format, findIndex, write, } = this;
        const mutationFields = {};
        mutationFields["create" + typeName] = {
            type: typeName,
            args: createArgs,
            resolve: (_, args) => {
                const newRecord = args;
                newRecord._id = uuid_1.v1();
                newRecord._data_source = format;
                newRecord._path = newRecord._id; // TODO
                write(newRecord, createArgs);
                return newRecord;
            },
        };
        mutationFields["update" + typeName] = {
            type: "Boolean",
            args: Object.assign(Object.assign({}, updateArgs), { _id: "String!" }),
            resolve: (_, args) => {
                const origin = lodash_find_1.default(records, { _id: args._id });
                const updatedRecord = Object.assign(Object.assign({}, origin), args);
                write(updatedRecord, updateArgs);
                return true;
            },
        };
        mutationFields["remove" + typeName] = {
            type: "Boolean!",
            args: { _id: "String!" },
            resolve: (_, args) => {
                const index = findIndex(args._id);
                if (index < 0)
                    return false;
                const filePath = path_1.default.resolve(path_1.default.join(dirname, items, records[index]._path + FILE_EXTENSION));
                fs_extra_1.default.unlinkSync(filePath);
                records.splice(index, 1);
                return true;
            },
        };
        return mutationFields;
    }
}
exports.default = MarkdownDataSource;
