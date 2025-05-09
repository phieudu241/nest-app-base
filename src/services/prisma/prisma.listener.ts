import { SOFT_DELETE_MODEL_NAMES } from "services/prisma/prisma.config";

export class PrismaListener {
  static async onFind(params, next) {
    if (!SOFT_DELETE_MODEL_NAMES.includes(params.model)) {
      return next(params);
    }

    const isFindUniqueOrFirst = ["findUnique", "findFirst"].includes(params.action);
    const isFindMany = params.action === "findMany";

    if (!isFindUniqueOrFirst && !isFindMany) {
      return next(params);
    }

    // Convert findUnique to findFirst since we need to filter
    if (params.action === "findUnique") {
      params.action = "findFirst";
    }

    // Add soft delete filter if not explicitly specified
    params.args.where = this.addSoftDeleteFilter(params.args.where);

    return next(params);
  }

  static async onDeleted(params, next) {
    if (!SOFT_DELETE_MODEL_NAMES.includes(params.model)) {
      return next(params);
    }

    const isDelete = params.action === "delete";
    const isDeleteMany = params.action === "deleteMany";

    if (!isDelete && !isDeleteMany) {
      return next(params);
    }

    // Convert delete operations to updates
    params.action = isDelete ? "update" : "updateMany";
    params.args.data = this.addSoftDeleteData(params.args.data);

    return next(params);
  }

  private static addSoftDeleteFilter(where: Record<string, unknown> = {}) {
    return {
      ...where,
      deleted: where?.deleted ?? false
    };
  }

  private static addSoftDeleteData(existingData: Record<string, unknown> = {}) {
    return {
      ...existingData,
      deleted: true
    };
  }
}
