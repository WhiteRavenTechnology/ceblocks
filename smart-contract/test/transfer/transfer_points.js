const uuid = require("uuid/v4");

module.exports = async function (ceblocks, options) {

    const txnId = uuid();
    
    const toEntity = {...await ceblocks.getEntityObject({entityId: options.toEntityId})};
    const fromEntity = {...await ceblocks.getEntityObject({entityId: options.fromEntityId})};

    const toPointsBefore = toEntity.points;
    const toExpectedTotalPoints = parseFloat(toPointsBefore) + parseFloat(options.points);

    const fromPointsBefore = fromEntity.points;
    const fromExpectedTotalPoints = parseFloat(fromPointsBefore) - parseFloat(options.points);

    toEntity.points = toExpectedTotalPoints;
    fromEntity.points = fromExpectedTotalPoints;

    const result = await ceblocks.transferPoints(
        txnId,     
        {
          "pointTransfer": {
            "fromEntityId": options.fromEntityId,
            "toEntityId": options.toEntityId,
            "points": options.points
          }
        }
    );

    ceblocks.client.updateSmartContractHeap(result);

    const toEntityKey = `entity-${toEntity.id}`;
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
                "toEntityId": options.toEntityId,
                "points": options.points
              }
            },
            [toEntityKey]: toEntity,
            [fromEntityKey]: fromEntity
        }
    };    
}