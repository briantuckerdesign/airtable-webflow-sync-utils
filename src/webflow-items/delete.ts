import { Webflow, WebflowClient } from "webflow-api";

export async function deleteItems(
  client: WebflowClient,
  collectionId: string,
  items: Array<Webflow.collections.ItemsDeleteItemsRequestItemsItem>
): Promise<void> {
  const BATCH_SIZE = 100;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    
    try {
      await client.collections.items.deleteItems(collectionId, {
        items: batch,
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
