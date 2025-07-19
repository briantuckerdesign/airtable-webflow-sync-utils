import { afterAll, beforeAll, expect, test } from "bun:test";
import { Webflow, WebflowError } from "webflow-api";
import { webflowItems } from ".";
import { aSecond } from "../../test-utils/pause";
import { deleteAllItems } from "./delete";

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
  {
    isDraft: false,
    isArchived: false,
    fieldData: {
      name: "Third Item",
      slug: "third-item",
      "plain-text": "This is a third item.",
      "rich-text": "<p>This is a third item.</p>",
      number: 200,
    },
  },
];
const accessToken = process.env.TOKEN as string;
const collectionId = process.env.COLLECTION_ID as string;

beforeAll(async () => {
  await deleteAllItems(accessToken, collectionId);
  await aSecond();
});

test("Create Webflow items", async () => {
  let items: Webflow.CollectionItem[];
  try {
    items = await webflowItems.create(accessToken, collectionId, sampleItems);
  } catch (error) {
    const webflowError = error as WebflowError;
    console.error(
      "Error creating item:",
      webflowError.statusCode,
      webflowError.message,
      webflowError.body
    );
    throw error;
  }

  expect(items).toBeArrayOfSize(sampleItems.length);
});

afterAll(async () => {
  await aSecond();
  await deleteAllItems(accessToken, collectionId);
});
