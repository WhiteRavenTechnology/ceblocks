const uuid = require("uuid/v4");

module.exports = async function (ceblocks) {

    const txnId = uuid();
    
    const result = await ceblocks.createProvider(
        txnId,     
        {
          "provider": {
            "name": "Test Provider",
            "description": "A provider of continuing education",
            "websiteURL": "https://www.example.com",
            "logoURL": "https://www.example.com/image.jpg",
            "addCreditRecordCallbackURL": "https://www.example.com/api/creditRecord/",
            "phone": "1-800-555-5555",
            "email": "contact@example.com",
            "industries": "legal,accounting,banking"
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
              "type": "createProvider",
              "entity": {
                "id": txnId,
                "type": "provider",
                "name": "Test Provider",
                "description": "A provider of continuing education",
                "websiteURL": "https://www.example.com",
                "logoURL": "https://www.example.com/image.jpg",
                "addCreditRecordCallbackURL": "https://www.example.com/api/creditRecord/",
                "phone": "1-800-555-5555",
                "email": "contact@example.com",
                "industries": "legal,accounting,banking",
                "maxPointsPerRedemption": null,
                "creditToPointsMultiplier": 1.0,
                "points": 0.0
              }
            },
            [entityKey]: {
              "id": txnId,
              "type": "provider",
              "name": "Test Provider",
              "description": "A provider of continuing education",
              "websiteURL": "https://www.example.com",
              "logoURL": "https://www.example.com/image.jpg",
              "addCreditRecordCallbackURL": "https://www.example.com/api/creditRecord/",
              "phone": "1-800-555-5555",
              "email": "contact@example.com",
              "industries": "legal,accounting,banking",
              "maxPointsPerRedemption": null,
              "creditToPointsMultiplier": 1.0,
              "points": 0.0
            }
        }
    };    
}