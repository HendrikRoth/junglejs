import DataSource from "./DataSource";
export default class JsonDataSource<DEFAULT_VALUE_TYPE> extends DataSource<any[], DEFAULT_VALUE_TYPE> {
    records: any;
    constructor(params: JsonDataSource<DEFAULT_VALUE_TYPE>, schemaComposer: any);
    query(): {};
    mutation(): {};
}
