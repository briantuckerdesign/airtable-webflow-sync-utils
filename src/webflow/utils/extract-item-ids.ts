import type { Webflow } from "webflow-api";

/**
 * Extracts item IDs from an array of Webflow collection items.
 */
export function extractItemIds(
  items: Webflow.CollectionItem[] | Webflow.CollectionItemWithIdInput[]
): string[] {
  const idCheck = items.every((item) => item.id);
  if (!idCheck) throw new Error("All items must have an id to extract IDs.");

  const ids = items
    .map((item) => item.id)
    .filter((id): id is string => typeof id === "string");

  return ids;
}
