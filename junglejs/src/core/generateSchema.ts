import { Source } from "graphql";
import { SchemaComposer } from "graphql-compose";

export default function generateSchema(dataSources: any[]) {
  const schemaComposer = new SchemaComposer();

  dataSources.forEach(async source => {
    try {
      const ImportedDataSource = await import(source.name);
      new ImportedDataSource(source, schemaComposer);
    }
    catch(err) {
      console.error(err);
    }
  });

  return schemaComposer.buildSchema();
}
