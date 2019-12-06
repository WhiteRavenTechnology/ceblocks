const uuid = require("uuid/v4");

module.exports = async function (ceblocks, options) {

    const txnId = uuid();
    
    const fromEntity = {...await ceblocks.getEntityObject({entityId: options.fromEntityId})};

    const pointsBefore = fromEntity.points;
    const expectedTotalPoints = parseFloat(pointsBefore) - parseFloat(options.points);

    fromEntity.points = expectedTotalPoints;

    const result = await ceblocks.transferPoints(
        txnId,     
        {
          "pointTransfer": {
            "fromEntityId": options.fromEntityId,
            "toEntityId": null,
            "points": options.points
          }
        }
    );

    ceblocks.client.updateSmartContractHeap(result);

    const fromEntityKey = `entity-${fromEntity.id}`;
    
    return {
        "requestTxnId": txnId,        
        "actual": result,        
        "expected": {
            "response": {
              "type": "transferPoints",
              "pointTransfer": {
                "id": txnId,
                "fromEntityId": options.fromEntityId,
                "toEntityId": null,
                "points": options.points
              }
            },
            [fromEntityKey]: fromEntity
        }
    };    
}