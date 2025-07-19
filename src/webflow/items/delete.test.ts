import { afterAll, beforeAll, expect, test } from "bun:test";
import { Webflow } from "webflow-api";
import { webflowItems } from ".";
import { deleteAllItems } from "./delete";
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

test("Delete Webflow items", async () => {
  const initialItems = await webflowItems.list(accessToken, collectionId);

  expect(initialItems.length).toEqual(0);

  const items = await webflowItems.create(
    accessToken,
    collectionId,
    sampleItems
  );

  expect(items.length).toEqual(2);

  await aSecond();

  await webflowItems.delete(accessToken, collectionId, items);

  await aSecond();

  const remainingItems = await webflowItems.list(accessToken, collectionId);

  expect(remainingItems.length).toEqual(0);
});

afterAll(async () => {
  await aSecond();
  await deleteAllItems(accessToken, collectionId);
});
