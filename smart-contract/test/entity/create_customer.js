const uuid = require("uuid/v4");

module.exports = async function (ceblocks) {

    const txnId = uuid();
    
    const result = await ceblocks.createCustomer(
        txnId,     
        {
          "customer": {
            "email": "johndoe@example.com",
            "hashedPassword": "1234asdf1234asdf1234asdf",
            "firstName": "John",
            "middleName": "A.",
            "lastName": "Doe",
            "lastNameSuffix": "Esq."
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
            "type": "createCustomer",
            "entity": {
              "id": txnId,
              "type": "customer",
              "email": "johndoe@example.com",
              "hashedPassword": "1234asdf1234asdf1234asdf",
              "firstName": "John",
              "middleName": "A.",
              "lastName": "Doe",
              "lastNameSuffix": "Esq.",
              "participantIds": [],
              "points": 0.0
            }
          },
          [entityKey]: {
            "id": txnId,
              "type": "customer",
              "email": "johndoe@example.com",
              "hashedPassword": "1234asdf1234asdf1234asdf",
              "firstName": "John",
              "middleName": "A.",
              "lastName": "Doe",
              "lastNameSuffix": "Esq.",
              "participantIds": [],
              "points": 0.0
          }
        }
    };    
}