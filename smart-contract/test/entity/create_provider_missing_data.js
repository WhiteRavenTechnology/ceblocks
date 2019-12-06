const uuid = require("uuid/v4");

module.exports = async function (ceblocks) {

    const txnId = uuid();
    
    const result = await ceblocks.createProvider(
        txnId,     
        {
          "provider": {            
            "websiteURL": "https://www.example.com",            
          }
        }
    );

    // Should fail, so no return //
}