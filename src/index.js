import program from 'commander'
import { parseFundingFile } from './utils/parse';
import { printDonationMessage } from './utils/print';

program
  .version('1.0.0')
  .option('-t, --thanks-message', 'Add a thank you message')
  .option('-d, --donate-message', 'Add a donate message')
  .option('-h, --hide', 'Hide the message')
  .parse(process.argv);

async function init() {
  try {
    const fundingConfig = await parseFundingFile();
    printDonationMessage(fundingConfig, program.thanksMessage, program.donateMessage)
  } catch (e) {
    console.error(e)
  }
}

init().then().catch(console.err)
