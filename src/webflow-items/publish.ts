import { Webflow, WebflowClient } from "webflow-api";

export async function publishItems(
  client: WebflowClient,
  collectionId: string,
  itemIds: Array<string>
): Promise<void> {
  const BATCH_SIZE = 100;

  for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
    const batch = itemIds.slice(i, i + BATCH_SIZE);

    try {
      await client.collections.items.publishItem(collectionId, {
        itemIds: batch,
      });
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
}
