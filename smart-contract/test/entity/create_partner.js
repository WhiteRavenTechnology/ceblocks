const uuid = require("uuid/v4");

module.exports = async function (ceblocks) {

    const txnId = uuid();
    
    const result = await ceblocks.createPartner(
        txnId,     
        {
          "partner": {
            "name": "Test Partner",
            "description": "A seller of professional goods and services",
            "websiteURL": "https://www.example.com",
            "logoURL": "https://www.example.com/image.jpg",            
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
              "type": "createPartner",
              "entity": {
                "id": txnId,
                "type": "partner",
                "name": "Test Partner",
                "description": "A seller of professional goods and services",
                "websiteURL": "https://www.example.com",
                "logoURL": "https://www.example.com/image.jpg",            
                "phone": "1-800-555-5555",
                "email": "contact@example.com",
                "industries": "legal,accounting,banking",
                "maxPointsPerRedemption": null,                
                "points": 0.0
              }
            },
            [entityKey]: {
              "id": txnId,
              "type": "partner",
              "name": "Test Partner",
              "description": "A seller of professional goods and services",
              "websiteURL": "https://www.example.com",
              "logoURL": "https://www.example.com/image.jpg",            
              "phone": "1-800-555-5555",
              "email": "contact@example.com",
              "industries": "legal,accounting,banking",
              "maxPointsPerRedemption": null,                
              "points": 0.0
            }
        }
    };    
}