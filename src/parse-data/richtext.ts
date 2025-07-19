import { Marked, Renderer } from "@ts-stack/markdown";
import { checkValidations } from "./validations";

Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

/**
 * Parses rich text field and assigns the corresponding value to the recordData object.
 * If the field is undefined in the record, the value will be set to an empty string.
 */
export function parseRichText(value: string, validations: any): string {
  // Check before parsing because richtext to html adds a bunch of characters that count towards the length
  if (validations) value = checkValidations(value, validations);

  const preppedMarkdown = prepMarkdown(value);
  return Marked.parse(preppedMarkdown);
}

/**
 * Converts Airtables parculiar flavor of markdown to something that can be parsed.
 */
export function prepMarkdown(markdown: string) {
  let updatedMarkdown = handleCheckboxes(markdown);
  updatedMarkdown = handleLineBreaks(updatedMarkdown);
  updatedMarkdown = handleIds(updatedMarkdown);
  return updatedMarkdown;
}

/**
 * Markdown parser requires line breaks to be double line breaks.
 * Replaces /n with /n/n
 */
function handleLineBreaks(markdown: string) {
  return markdown.replace(/\n/g, "\n\n");
}

/**
 * Webflow does not support checkboxes, so we convert to bullets.
 * Replaces [ ] or [x] with a dash (-)
 */
function handleCheckboxes(markdown: string) {
  return markdown.replace(/\[\s*\]|\[\s*x\s*\]/gi, "-");
}

/**
 * Remove ids from all elements to avoid conflicts in Webflow.
 * Replaces id="*" with id=""
 */
function handleIds(html: string) {
  return html.replace(/ id=".*?"/g, "");
}
