const { composeWithJson } = require('graphql-compose-json');
const find = require('lodash.find');

module.exports = function json({generateId, dataSource, typeName, source, schemaComposer}) {
    let newQueryFields = {};
    let newMutationFields = {};
    let records = source.items.map(x => {
        x._id = generateId();
        x._data_source = dataSource;
        return x;
    });

    return {
        query() {
            composeWithJson(typeName, records[0], { schemaComposer });

            newQueryFields[source.name] = {
                type: typeName,
                args: source.queryArgs,
                resolve: (_, args) => find(source.items, args),
            };

            newQueryFields[source.name + 's'] = {
                type: `[${typeName}]`,
                resolve: () => source.items,
            };

            return newQueryFields;
        },

        mutation() {
            newMutationFields['create' + typeName] = {
                type: typeName,
                args: source.createArgs,
                resolve: (_, args) => {
                    const newRecord = args;
                    // TODO
                    return newRecord;
                }
            };

            newMutationFields['update' + typeName] = {
                type: 'Boolean!',
                args: {...source.updateArgs, ...{ _id: 'String!' } },
                resolve: (_, args) => {
                    const origin = source.items.find(x => x._id === args._id);
                    const updatedRecord = {...origin, ...args};
                    // TODO
                    return true;
                }
            };

            newMutationFields['remove' + typeName] = {
                type: 'Boolean!',
                args: {
                    _id: 'String!'
                },
                resolve: (_, args) => {
                    // TODO
                    return true;
                }
            };

            return newMutationFields;
        }
    }
}