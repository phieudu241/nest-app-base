import { BasePaginationRequestDTO } from "shared/dtos/base-pagination-request.dto";

const removeBlacklistFields = (object: unknown, blacklistFields: string[]) => {
  blacklistFields.forEach((field) => delete object[field]);
};

const formatMessageString = (str: string, ...args: unknown[]): string => {
  return `${str}`.replace(/\{(\d+)}/g, (match, index) => (args[index] || match) as string);
};

const transformPaginationQuery = (query: BasePaginationRequestDTO, scalarFieldEnum?: object) => {
  const sortByField =
    query.sortBy && Object.keys(scalarFieldEnum).includes(query.sortBy) ? { [query.sortBy]: query.direction || "asc" } : undefined;

  return { take: query.limit || undefined, skip: query.page ? (query.page - 1) * query.limit : undefined, sortByField };
};

export const CommonHelpers = {
  removeBlacklistFields,
  formatMessageString,
  transformPaginationQuery,
};
