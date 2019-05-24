/* eslint-disable no-console */

import { parseFundingFile } from "./utils/parse";
import { printDonationMessage } from "./utils/print";
import { shouldHideMessage } from "./utils/misc";

export async function init(
  path = process.cwd(),
  hideMessage = shouldHideMessage()
) {
  if (hideMessage) return;
  try {
    const fundingConfig = await parseFundingFile(path);
    printDonationMessage(fundingConfig, path);
  } catch (e) {
    console.error(e);
  }
}
