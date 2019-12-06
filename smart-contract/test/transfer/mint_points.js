const uuid = require("uuid/v4");

module.exports = async function (ceblocks, options) {

    const txnId = uuid();
    
    const toEntity = {...await ceblocks.getEntityObject({entityId: options.toEntityId})};

    const pointsBefore = toEntity.points;
    const expectedTotalPoints = parseFloat(pointsBefore) + parseFloat(options.points);

    toEntity.points = expectedTotalPoints;

    const result = await ceblocks.transferPoints(
        txnId,     
        {
          "pointTransfer": {
            "fromEntityId": null,
            "toEntityId": options.toEntityId,
            "points": options.points
          }
        }
    );

    ceblocks.client.updateSmartContractHeap(result);

    const toEntityKey = `entity-${toEntity.id}`;
    
    return {
        "requestTxnId": txnId,        
        "actual": result,        
        "expected": {
            "response": {
              "type": "transferPoints",
              "pointTransfer": {
                "id": txnId,
                "fromEntityId": null,
                "toEntityId": options.toEntityId,
                "points": options.points
              }
            },
            [toEntityKey]: toEntity
        }
    };    
}