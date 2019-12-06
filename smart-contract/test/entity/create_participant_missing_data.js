const uuid = require("uuid/v4");

module.exports = async function (ceblocks, options) {

    const txnId = uuid();
    
    const result = await ceblocks.createParticipant(
        txnId,     
        {
          "participant": {
            "providerId": options.providerId            
          }
        }
    );

    // Should fail, so no return //
}