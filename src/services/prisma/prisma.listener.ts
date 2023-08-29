import { SOFT_DELETE_MODEL_NAMES } from "services/prisma/prisma.config";

export class PrismaListener {
  static async onFind(params, next) {
    if (SOFT_DELETE_MODEL_NAMES.includes(params.model)) {
      if (params.action === "findUnique" || params.action === "findFirst") {
        // Change to findFirst - you cannot filter
        // by anything except ID / unique with findUnique
        params.action = "findFirst";

        // Add 'deleted' filter
        if (params.args.where) {
          if (params.args.where.deleted == undefined) {
            // Exclude deleted records if they have not been explicitly requested
            params.args.where["deleted"] = false;
          }
        } else {
          params.args["where"] = { deleted: false };
        }
      }

      if (params.action === "findMany") {
        // Find many queries
        if (params.args.where) {
          if (params.args.where.deleted == undefined) {
            // Exclude deleted records if they have not been explicitly requested
            params.args.where["deleted"] = false;
          }
        } else {
          params.args["where"] = { deleted: false };
        }
      }
    }

    return next(params);
  }

  static async onDeleted(params, next) {
    // Check incoming query type
    if (SOFT_DELETE_MODEL_NAMES.includes(params.model)) {
      if (params.action == "delete") {
        // Delete queries
        // Change action to an update
        params.action = "update";
        params.args["data"] = { deleted: true };
      }

      if (params.action == "deleteMany") {
        // Delete many queries
        params.action = "updateMany";
        if (params.args.data != undefined) {
          params.args.data["deleted"] = true;
        } else {
          params.args["data"] = { deleted: true };
        }
      }
    }

    return next(params);
  }
}
