// Notion API Client from https://developers.notion.com/docs
import { Client } from "@notionhq/client"
// Import from from https://github.com/branchard/fast-speedtest-api
import fastDotComAPI from 'fast-speedtest-api';

// Initialize constants.
const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID
const { UNITS } = fastDotComAPI;

async function addItem(speed) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Title": {
          "type": "title",
          "title": [{ "type": "text", "text": { "content": "Speed Mbps" } }]
        },
        "Speed": {
          "type": "number",
          "number": speed
        },
      },
    })
    // Remove for a quieter console.
    // console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}
// Initialize speedtest with API Key
let speedtest = new fastDotComAPI({
    token: process.env.FAST_DOT_COM_API_KEY, // required
    verbose: false, // default: false
    timeout: 100000, // default: 5000
    https: true, // default: true
    urlCount: 5, // default: 5
    bufferSize: 8, // default: 8
    unit: UNITS.Mbps // default: Bps
});

// Perform speed test, log result + push to Notion database.
function performTest() {
  speedtest.getSpeed().then(s => {
      console.log(`Speed: ${s} Mbps`);
      addItem(s)
  }).catch(e => {
      console.error(e.message);
  });
}
// Run!
performTest();

// Run in 30 minute intervals.
// 1000ms * 60 * 30
setInterval(performTest, 1800000); 
