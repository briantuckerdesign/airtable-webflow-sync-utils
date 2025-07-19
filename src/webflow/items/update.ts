import { Webflow, WebflowClient } from "webflow-api";

/**
 * Takes an array of collection items with IDs and updates them in Webflow.
 * Processes items in batches of 100 to comply with Webflow API limits.
 */
export async function updateItems(
  accessToken: string,
  collectionId: string,
  items: Webflow.CollectionItem[]
): Promise<Webflow.CollectionItem[]> {
  const webflow = new WebflowClient({ accessToken });

  let safeItems;
  const idCheck = items.every((item) => item.id);
  if (idCheck) {
    safeItems = items as Webflow.CollectionItemWithIdInput[];
  } else {
    throw new Error("All items must have an id to be updated.");
  }

  const BATCH_SIZE = 100;
  const results: Webflow.CollectionItem[] = [];

  for (let i = 0; i < safeItems.length; i += BATCH_SIZE) {
    const batch = safeItems.slice(i, i + BATCH_SIZE);

    try {
      const response = (await webflow.collections.items.updateItems(
        collectionId,
        {
          items: batch,
        }
      )) as { items?: Webflow.CollectionItem[] };

      if (response?.items) {
        results.push(...response.items);
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
