const uuid = require("uuid/v4");

module.exports = async function (ceblocks, options) {

    const txnId = uuid();
    
    const customer = {...await ceblocks.getEntityObject({entityId: options.customerId})};

    const result = await ceblocks.createCustomerParticipantRelationship(
        txnId,     
        {
          "customerParticipantRelationship": {
            "customerId": options.customerId,
            "participantId": options.participantId
          }
        }
    );

    ceblocks.client.updateSmartContractHeap(result);

    customer.participantIds.push(options.participantId);

    const customerKey = `entity-${customer.id}`;
    
    return {
      "requestTxnId": txnId,        
      "actual": result,        
      "expected": {
        "response": {
          "type": "createCustomerParticipantRelationship",
          "customerParticipantRelationship": {
            "id": txnId,
            "customerId": options.customerId,
            "participantId": options.participantId
          }            
        },
        [customerKey]: customer
      }
    };    
}