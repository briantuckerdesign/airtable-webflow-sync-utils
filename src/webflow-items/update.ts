import { Webflow, WebflowClient } from "webflow-api";

export async function updateItems(
  client: WebflowClient,
  collectionId: string,
  items: Array<Webflow.CollectionItemWithIdInput>
): Promise<Webflow.CollectionItem[]> {
  const BATCH_SIZE = 100;
  const results: Webflow.CollectionItem[] = [];

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);

    try {
      const response = await client.collections.items.updateItemsLive(
        collectionId,
        {
          items: batch,
        }
      );

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
