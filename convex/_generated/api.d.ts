/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _documents_read from "../_documents/read.js";
import type * as _documents_revisions from "../_documents/revisions.js";
import type * as _documents_share from "../_documents/share.js";
import type * as _documents_tabs from "../_documents/tabs.js";
import type * as _documents_write from "../_documents/write.js";
import type * as _folders_mutations from "../_folders/mutations.js";
import type * as _folders_queries from "../_folders/queries.js";
import type * as documents from "../documents.js";
import type * as folders from "../folders.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_documents/read": typeof _documents_read;
  "_documents/revisions": typeof _documents_revisions;
  "_documents/share": typeof _documents_share;
  "_documents/tabs": typeof _documents_tabs;
  "_documents/write": typeof _documents_write;
  "_folders/mutations": typeof _folders_mutations;
  "_folders/queries": typeof _folders_queries;
  documents: typeof documents;
  folders: typeof folders;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
