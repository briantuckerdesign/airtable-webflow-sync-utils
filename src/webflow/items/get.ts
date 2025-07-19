import { Webflow, WebflowClient } from "webflow-api";

/**
 * Takes an array of item IDs or collection items and retrieves the full items from Webflow.
 */
export async function getItems(
  accessToken: string,
  collectionId: string,
  items: string[] | Webflow.CollectionItem[]
): Promise<Webflow.CollectionItem[]> {
  let itemIds: string[] = [];

  if (typeof items[0] === "string") {
    itemIds = items as string[];
  } else {
    itemIds = (items as Webflow.CollectionItem[])
      .map((item) => item.id)
      .filter((id): id is string => typeof id === "string");
  }

  const webflow = new WebflowClient({ accessToken });

  const results: Webflow.CollectionItem[] = [];

  for (const itemId of itemIds) {
    try {
      const response = await webflow.collections.items.getItem(
        collectionId,
        itemId
      );
      if (response) {
        results.push(response);
      }
    } catch (error) {
      if (error instanceof Webflow.ForbiddenError) {
        console.error((error.body as any)?.message);
      } else if (error instanceof Webflow.BadRequestError) {
        console.error((error.body as any)?.message);
      } else {
        throw error;
      }
    }
  }

  return results;
}
