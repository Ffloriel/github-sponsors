import program from "commander";
import { parseFundingFile } from "./utils/parse";
import { printDonationMessage } from "./utils/print";
import { shouldHideMessage } from "./utils/misc";

export async function init(path = ".", hideMessage = shouldHideMessage()) {
  if (hideMessage) return;
  try {
    const fundingConfig = await parseFundingFile(path);
    printDonationMessage(
      fundingConfig,
      path
    );
  } catch (e) {
    console.error(e);
  }
}
