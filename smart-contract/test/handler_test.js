const handler = require('../src/contract/handler');

async function main() {
    const val = JSON.stringify({
        "version": "2",
        "dcrn": "Transaction::L1::FullTransaction",
        "header": {
          "txn_type": "ceblocks",
          "dc_id": "uDVMagYWemvWH281ry7zdX6kap7e3dBZhJjuCbDyh4qU",
          "txn_id": "cf46dba2-c50b-4e7b-968a-52c46775eae0",
          "block_id": "28673189",
          "timestamp": "1575604161",
          "tag": "",
          "invoker": ""
        },
        "payload": {
          "method": "addMasterAPIKey",
          "parameters": {}
        },
        "proof": {
          "full": "Zz+5E5p5SJDUg82HBqDiq9PX2b6bSF0cJS3AQSjvYEA=",
          "stripped": "MEUCIQCejzAaYbjqG5CIQc3BRMhOVtSXZFApnlMebkbcJki6nQIgQ6zNM5USBLwDz2Nur9hW1X18iNeDWPfMn8pnV1YrBDM="
        }
      })
    try {
      const res = await handler(val);
      process.stdout.write(JSON.stringify(res));
    } catch (err) {
      return console.error(err);
    }
  }
  
  main().catch(console.error);