import { expect, test, beforeAll, afterAll } from "bun:test";
import { webflowItems } from ".";
import { deleteAllItems } from "./delete";
import { Webflow } from "webflow-api";
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

test("Update Webflow items", async () => {
  try {
    const items = await webflowItems.create(
      accessToken,
      collectionId,
      sampleItems
    );

    expect(items).toBeArrayOfSize(2);
    expect(items[0].fieldData.name).toBe("Sample Item");
    expect(items[1].fieldData.name).toBe("Another Item");

    items[0].fieldData.name = "Updated Sample Item";
    items[1].fieldData.name = "Updated Another Item";

    await aSecond();
    const updatedItems = await webflowItems.update(
      accessToken,
      collectionId,
      items
    );

    expect(updatedItems).toBeArrayOfSize(2);
    expect(updatedItems[0].fieldData.name).toBe("Updated Sample Item");
    expect(updatedItems[1].fieldData.name).toBe("Updated Another Item");
  } catch (error) {
    console.error("Error during test execution:", error);
    throw error;
  }
});

afterAll(async () => {
  await aSecond();
  await deleteAllItems(accessToken, collectionId);
});
