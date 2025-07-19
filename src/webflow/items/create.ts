import { Webflow, WebflowClient } from "webflow-api";

export async function createItems(
  accessToken: string,
  collectionId: string,
  items: Array<Webflow.CollectionItem>
): Promise<Webflow.CollectionItem[]> {
  const webflow = new WebflowClient({ accessToken });

  const results: Webflow.CollectionItem[] = [];

  for (let i = 0; i < items.length; i += 100) {
    const batch = items.slice(i, i + 100);

    try {
      // this returns the correct object with items prop/array inside
      const response = (await webflow.collections.items.createItem(
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
