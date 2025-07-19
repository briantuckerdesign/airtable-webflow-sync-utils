import { Webflow, WebflowClient } from "webflow-api";

export async function listItems(
  accessToken: string,
  collectionId: string
): Promise<Webflow.CollectionItem[]> {
  const webflow = new WebflowClient({ accessToken });

  const results: Webflow.CollectionItem[] = [];

  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await webflow.collections.items.listItems(collectionId, {
        limit: 100,
        offset: offset,
      });

      if (response?.items) {
        results.push(...response.items);
      }

      const pagination = response?.pagination;
      if (
        pagination &&
        pagination.offset !== undefined &&
        pagination.limit !== undefined &&
        pagination.total !== undefined
      ) {
        hasMore = pagination.offset + pagination.limit < pagination.total;
        offset += 100;
      } else {
        hasMore = false;
      }
    } catch (error) {
      if (error instanceof Webflow.ForbiddenError) {
        console.error((error.body as any)?.message);
      } else if (error instanceof Webflow.BadRequestError) {
        console.error((error.body as any)?.message);
      } else {
        throw error;
      }
      hasMore = false;
    }
  }

  return results;
}
