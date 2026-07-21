"use server";

import { convex } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const getDocuments = async (ids: Id<"documents">[]) => {
    return await convex.query(api.documents.getByIds, { ids });
};
