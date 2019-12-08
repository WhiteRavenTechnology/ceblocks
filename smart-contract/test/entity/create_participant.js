const uuid = require("uuid/v4");

module.exports = async function (ceblocks, options) {

    const txnId = uuid();
    
    const result = await ceblocks.createParticipant(
        txnId,     
        {
          "participant": {
            "providerId": options.providerId,
            "encryptedCustomerIdentifier": options.encryptedCustomerIdentifier            
          }
        }
    );

    ceblocks.client.updateSmartContractHeap(result);

    const entityKey = `entity-${txnId}`;
    
    return {
        "requestTxnId": txnId,        
        "actual": result,        
        "expected": {
            "response": {
              "type": "createParticipant",
              "entity": {
                "id": txnId,
                "type": "participant",
                "providerId": options.providerId,
                "encryptedCustomerIdentifier": options.encryptedCustomerIdentifier,
                "creditRecordIds": [],
                "points": 0
              }
            },
            [entityKey]: {
              "id": txnId,
              "type": "participant",
              "providerId": options.providerId,
              "encryptedCustomerIdentifier": options.encryptedCustomerIdentifier,
              "creditRecordIds": [],
              "points": 0
            }
        }
    };    
}