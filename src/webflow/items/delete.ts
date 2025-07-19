import { Webflow, WebflowClient } from "webflow-api";
import { webflowItems } from ".";

export async function deleteItems(
  accessToken: string,
  collectionId: string,
  items: Webflow.CollectionItem[]
): Promise<void> {
  const parsedItems = transformRecordsForDeletion(items);
  const webflow = new WebflowClient({ accessToken });
  const BATCH_SIZE = 100;

  for (let i = 0; i < parsedItems.length; i += BATCH_SIZE) {
    const batch = parsedItems.slice(i, i + BATCH_SIZE);

    try {
      await webflow.collections.items.deleteItems(collectionId, {
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

export function transformRecordForDeletion(
  record: Webflow.CollectionItem
): Webflow.collections.ItemsDeleteItemsRequestItemsItem {
  return {
    id: record.id as string,
  };
}

export function transformRecordsForDeletion(
  records: Webflow.CollectionItem[]
): Webflow.collections.ItemsDeleteItemsRequestItemsItem[] {
  return records.map(transformRecordForDeletion);
}

export async function deleteAllItems(
  accessToken: string,
  collectionId: string
): Promise<number> {
  const items = await webflowItems.list(accessToken, collectionId);
  if (items.length === 0) {
    return 0;
  }
  const batchSize = 100;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await webflowItems.delete(accessToken, collectionId, batch);
    // Wait a second between batches to avoid rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }
  return items.length;
}
