const sdk = require("dragonchain-sdk");
const ceblocks = require("./ceblocks");

const log = (string) => console.error(`STDERR: ${string}`);

module.exports = async input => {
  // Parse the request //
  let inputObj = JSON.parse(input);

  try {
    ceblocks.client = await dcsdk.createClient();

    let output = await Reflect.apply(
      ceblocks[inputObj.payload.method],
      inputObj.payload.parameters
    );
    
    return output;
        
  } catch (exception)    
  {
      // Write the exception to STDERR
      log(exception);

      return {"exception": exception};  
  }
}