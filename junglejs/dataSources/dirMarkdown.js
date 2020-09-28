const fs = require('fs-extra');
const path = require('path');
const { composeWithJson } = require('graphql-compose-json');
const find = require('lodash.find');
const grayMatter = require('gray-matter');
const marked = require('marked');

module.exports = function dirMarkdown({generateId, dataSource, typeName, dirname, source, schemaComposer}) {
    let newQueryFields = {};
    let newMutationFields = {};
    let records = [];

    fs.readdirSync(path.join(dirname, source.items)).map((fileName) => {
        const post = fs.readFileSync(
            path.resolve(path.join(dirname, source.items), fileName),
            'utf-8'
        );

        const renderer = new marked.Renderer();

        const { data, content } = grayMatter(post);
        const html = marked(content, { renderer });

        data['_content'] = content;
        data['_path'] = fileName.substring(0, fileName.length - 3);
        data['_id'] = generateId();
        data['_data_source'] = dataSource;
        records.push({ html, ...data });
    });
    
    const findIndex = _id => Object.keys(records).findIndex(x => records[x]._id === _id);

    return {
        query() {
            composeWithJson(typeName, records[0], { schemaComposer });

            newQueryFields[source.name] = {
                type: typeName,
                args: source.queryArgs,
                resolve: (_, args) => find(records, args),
            };

            newQueryFields[source.name + 's'] = {
                type: `[${typeName}]`,
                resolve: () => records,
            };

            return newQueryFields;
        },

        mutation() {
            const writeData = (record, args) => {
                const index = findIndex(args._id);
                const origin = records[index];
                const data = {...source.defaultValues, origin, ...record};

                if (index > -1) {
                    records[index] = {...data};
                } else {
                    records.push({...data});
                }

                delete data.html;
                delete data._id;
                delete data._content;
                delete data._data_source;
                delete data._path;

                // TODO: using a tested js frontmatter to markdown converter.
                const fileStr = ['---'];
                Object.keys(args).forEach(key => {
                    let value;

                    if (args[key] === '[JSON]') {
                        value = data[key] && data[key].length > 0 ? `"${data[key]}"` : "[]";
                        record[key] = data[key] || [];
                    }
                    else {
                        value = data[key] || '""';
                        record[key] = data[key] || "";
                    }

                    fileStr.push([key, value].join(': '));
                });
                fileStr.push('---')
                fileStr.push(record._content);

                fs.writeFileSync(
                    path.resolve(path.join(dirname, source.items, record._path + '.md')),
                    fileStr.join('\n'),
                    'utf-8'
                );
            };

            newMutationFields['create' + typeName] = {
                type: typeName,
                args: source.createArgs,
                resolve: (_, args) => {
                    const newRecord = args;
                    newRecord._id = generateId();
                    newRecord._data_source = dataSource;
                    newRecord._path = newRecord._id; // TODO

                    writeData(newRecord, source.createArgs);
                    return newRecord;
                }
            };

            newMutationFields['update' + typeName] = {
                type: 'Boolean!',
                args: {...source.updateArgs, ...{ _id: 'String!' } },
                resolve: (_, args) => {
                    const origin = find(records, {_id: args._id});
                    const updatedRecord = {...origin, ...args};
                    writeData(updatedRecord, source.updateArgs);
                    return true;
                }
            };

            newMutationFields['remove' + typeName] = {
                type: 'Boolean!',
                args: {
                    _id: 'String!'
                },
                resolve: (_, args) => {
                    const index = findIndex(args._id);
                    if (index < 0) return false;
                    const filePath = path.resolve(path.join(dirname, source.items, records[index]._path + '.md'));
                    fs.unlinkSync(filePath);
                    records.splice(index, 1);
                    return true;
                }
            };

            return newMutationFields;
        }
    };
}