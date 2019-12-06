const uuid = require("uuid/v4");

module.exports = async function (ceblocks, options) {

    const txnId = uuid();
    
    const result = await ceblocks.addMasterAPIKey(txnId);

    ceblocks.client.updateSmartContractHeap(result);

    return {
        "requestTxnId": txnId,        
        "actual": result,        
        "expected": {
            "apiKeyMap": {
                "master": txnId
            }
        }
    };    
}