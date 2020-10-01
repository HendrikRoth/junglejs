"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Plugin_1 = __importDefault(require("./Plugin"));
const graphql_compose_json_1 = require("graphql-compose-json");
class DataSource extends Plugin_1.default {
    constructor(params, schemaComposer) {
        super();
        this.composeWithJson = graphql_compose_json_1.composeWithJson;
        this.schemaComposer = schemaComposer;
        this.name = params.name;
        this.typeName = this.name.charAt(0).toUpperCase() + this.name.slice(1);
        this.format = params.format;
        this.items = params.items;
        this.queryArgs = params.queryArgs;
        this.createArgs = params.createArgs || {};
        this.updateArgs = params.updateArgs || {};
    }
}
exports.default = DataSource;
