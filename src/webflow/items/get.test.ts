import { expect, test, beforeAll, afterAll } from "bun:test";
import { webflowItems } from ".";
import { deleteAllItems } from "./delete";
import type { Webflow } from "webflow-api";
import { aSecond } from "../../test-utils/pause";

const accessToken = process.env.TOKEN as string;
const collectionId = process.env.COLLECTION_ID as string;

const sampleItems: Webflow.CollectionItem[] = [
  {
    isDraft: false,
    isArchived: false,
    fieldData: {
      name: "Sample Item",
      slug: "sample-item",
      "plain-text": "This is a sample item.",
      "rich-text": "<p>This is a sample item.</p>",
      number: 42,
    },
  },
  {
    isDraft: false,
    isArchived: false,
    fieldData: {
      name: "Another Item",
      slug: "another-item",
      "plain-text": "This is another item.",
      "rich-text": "<p>This is another item.</p>",
      number: 100,
    },
  },
];

beforeAll(async () => {
  await deleteAllItems(accessToken, collectionId);
  await aSecond();
});

test("Get Webflow items", async () => {
  const items = await webflowItems.create(
    accessToken,
    collectionId,
    sampleItems
  );

  expect(items).toBeArrayOfSize(sampleItems.length);

  await aSecond();

  const fetchedItems = await webflowItems.get(accessToken, collectionId, items);

  expect(fetchedItems).toBeArrayOfSize(sampleItems.length);
  expect(fetchedItems[0].fieldData.name).toBe("Sample Item");
  expect(fetchedItems[1].fieldData.name).toBe("Another Item");
});

afterAll(async () => {
  await aSecond();
  await deleteAllItems(accessToken, collectionId);
});
