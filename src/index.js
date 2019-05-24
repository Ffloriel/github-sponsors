import program from "commander";
import { parseFundingFile } from "./utils/parse";
import { printDonationMessage } from "./utils/print";
import { shouldHideMessage } from "./utils/misc";

program
  .version("1.0.0")
  .option("-t, --thanks-message", "Add a thank you message")
  .option("-d, --donate-message", "Add a donate message")
  .option("-h, --hide", "Hide the message")
  .parse(process.argv);

export async function init(path = ".") {
  if (program.hide || shouldHideMessage(process.env)) return;
  try {
    const fundingConfig = await parseFundingFile(path);
    printDonationMessage(
      fundingConfig,
      program.thanksMessage,
      program.donateMessage
    );
  } catch (e) {
    console.error(e);
  }
}
