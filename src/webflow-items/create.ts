import { Webflow, WebflowClient } from "webflow-api";

export async function createItems(
  client: WebflowClient,
  collectionId: string,
  items: Array<Webflow.CollectionItem>,
  live: boolean = true
): Promise<Webflow.CollectionItem[]> {
  const BATCH_SIZE = 100;
  const results: Webflow.CollectionItem[] = [];

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);

    try {
      let response;
      if (live) {
        response = await client.collections.items.createItemLive(collectionId, {
          items: batch,
        });
      } else {
        response = await client.collections.items.createItem(collectionId, {
          items: batch,
        });
      }

      if (Array.isArray(response)) {
        results.push(...response);
      } else if (response) {
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
