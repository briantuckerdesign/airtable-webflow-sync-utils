import { Webflow, WebflowClient } from "webflow-api";
import { extractItemIds } from "../utils/extract-item-ids";
import { webflowItems } from ".";

export async function publishItems(
  accessToken: string,
  collectionId: string,
  items:
    | Webflow.CollectionItem[]
    | Webflow.CollectionItemWithIdInput[]
    | string[]
): Promise<string[]> {
  let itemIds = [] as string[];

  if (typeof items[0] === "string") {
    itemIds = items as string[];
  } else {
    itemIds = extractItemIds(items as Webflow.CollectionItem[]);
  }
  console.log("🚀 ~ itemIds:", itemIds);
  console.log(await webflowItems.list(accessToken, collectionId));

  const webflow = new WebflowClient({ accessToken });

  const BATCH_SIZE = 100;

  const publishedIds = [] as string[];

  for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
    const batch = itemIds.slice(i, i + BATCH_SIZE);

    try {
      console.log("batch:", batch);
      const response = await webflow.collections.items.publishItem(
        collectionId,
        {
          itemIds: batch,
        }
      );
      if (response?.publishedItemIds) {
        publishedIds.push(...response.publishedItemIds);
      }
    } catch (error) {
      console.error("publishItems error:");
      if (error instanceof Webflow.ForbiddenError) {
        console.error((error.body as any)?.message);
      } else if (error instanceof Webflow.BadRequestError) {
        console.error((error.body as any)?.message);
      } else {
        throw error;
      }
    }
  }

  return publishedIds;
}
