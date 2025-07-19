import { expect, test, beforeAll, afterAll } from "bun:test";
import { webflowItems } from ".";
import { deleteAllItems } from "./delete";
import { aSecond } from "../../test-utils/pause";

const accessToken = process.env.TOKEN as string;
const collectionId = process.env.COLLECTION_ID as string;

beforeAll(async () => {
  await deleteAllItems(accessToken, collectionId);
  await aSecond();
});

test("List Webflow items", async () => {
  const items = await webflowItems.list(accessToken, collectionId);
  expect(items).toBeInstanceOf(Array);
  expect(items.length).toEqual(0);
});

afterAll(async () => {
  await aSecond();
  await deleteAllItems(accessToken, collectionId);
});
