import { listItems } from "./list";
import { createItems } from "./create";
import { updateItems } from "./update";
import { publishItems } from "./publish";
import { deleteItems } from "./delete";

/**
 * This is a wrapper for the Webflow API that allows you to interact with items in a collection.
 * It provides methods for listing, creating, updating, publishing, and deleting items.
 *
 * It exists to allow for easier calling with a consistent interface with pagination support.
 */
export const webflowItems = {
  list: listItems,
  create: createItems,
  update: updateItems,
  publish: publishItems,
  delete: deleteItems,
};
