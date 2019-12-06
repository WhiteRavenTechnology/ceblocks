const util = require('util');
const dcsdk = require('dragonchain-sdk');
const config = require('./config');

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const initialize = async () => {
    const client = await dcsdk.createClient();

    
    console.log("Creating master API key...");

    // Create an authority //
    const requestTxn = await client.createTransaction({
        transactionType: config.contractTxnType,
        payload: {
            "method": "addMasterAPIKey",
            "parameters": {}
        }        
    })

    // Wait for response to be written to a block //
    await sleep(6000);

    const apiKeyMap = client.getSmartContractObject({key:`apiKeyMap`, smartContractId: config.contractId});
    
    // Display the authority custodian object //
    console.log(util.inspect(apiKeyMap, false, null, true));
}

initialize().then(() => {console.log("Done.")}).catch(err) {console.error(err)};

