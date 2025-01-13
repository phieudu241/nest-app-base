import { Prisma } from "@prisma/client";

export const convertToRawQueryRecordToPrismaModel = <T>(object: unknown, modelName: string): T => {
  const fields = Prisma.dmmf.datamodel.models.find(model => model.name === modelName).fields;
  const fieldsMap = fields.reduce((acc, field) => {
    acc[field.dbName || field.name] = field.name;
    return acc;
  }, {});

  const entity: T = {} as T;
  Object.keys(object).forEach((key) => {
    const field = fieldsMap[key] || key;
    entity[field] = object[key];
  });
  return entity;
};
