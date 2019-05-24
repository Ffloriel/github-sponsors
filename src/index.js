import program from "commander";
import { parseFundingFile } from "./utils/parse";
import { printDonationMessage } from "./utils/print";
import { shouldHideMessage } from "./utils/misc";

export async function init(path = process.cwd(), hideMessage = shouldHideMessage()) {
  if (hideMessage) return;
  console.error('yo!')
  try {
    const fundingConfig = await parseFundingFile(path);
    console.error('yo!!')
    console.warn('can you see me?')
    console.log('I hope you do :)')
    printDonationMessage(
      fundingConfig,
      path
    );
  } catch (e) {
    console.error(e);
  }
}
