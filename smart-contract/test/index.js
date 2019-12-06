const fs = require('fs');
const assert = require("assert");
const ceblocks = require("../src/contract/ceblocks");

const test = {
    apiKeyMap: {
        add_master_key: require("./apiKeyMap/add_master_key")
    },    
    entity: {
        create_provider_missing_data: require("./entity/create_provider_missing_data"),
        create_provider_default_config: require("./entity/create_provider_default_config"),                    
        create_provider_specified_config: require("./entity/create_provider_specified_config"),                    
        create_participant_missing_data: require("./entity/create_participant_missing_data"),
        create_participant: require("./entity/create_participant")
    },
    transfer: {
        mint_points: require("./transfer/mint_points"),
        burn_points: require("./transfer/burn_points"),        
        transfer_points: require("./transfer/transfer_points")
    }
};

ceblocks.client = {
    heap: {},

    updateSmartContractHeap: function (data) {
        this.heap = {...this.heap, ...data};

        // Write current heap to file //
        fs.writeFileSync(__dirname + '/post-run-heap.json', JSON.stringify(this.heap, null, 2), (err) => {    
            if (err) throw err;
        });
    },

    getSmartContractObject: async function (options) {

        if (this.heap[options.key])
        {
            return {
                "status": 200,
                "response": JSON.stringify(this.heap[options.key]),
                "ok": true
            }
        }

        return {
            "status": 404,
            "response": JSON.stringify({"error":{"type":"NOT_FOUND","details":"The requested resource(s) cannot be found."}}),
            "ok": false
          };          
    }
};

(async () => {

    // +++ API KEY MAP +++ //
    // Assert provider created with minimum specified data //
    let result = await test.apiKeyMap.add_master_key(ceblocks);

    assert.deepStrictEqual(result.actual, result.expected, "Create Master API Key");

    // +++ ENTITY TESTS +++ //

    // Assert creating provider with missing required data fails //
    await assert.rejects(test.entity.create_provider_missing_data(ceblocks), "Create Provider: Missing Data");

    // Assert provider created with minimum specified data //
    result = await test.entity.create_provider_default_config(ceblocks);

    assert.deepStrictEqual(result.actual, result.expected, "Create Provider: Default Config");

    let providerNoMaxPointsPerRedemption = await ceblocks.getEntityObject({"entityId": result.requestTxnId});

    // Assert provider created with specified config data //
    result = await test.entity.create_provider_specified_config(ceblocks);

    assert.deepStrictEqual(result.actual, result.expected, "Create Provider: Specified Config");
    
    let providerHasMaxPointsPerRedemption = await ceblocks.getEntityObject({"entityId": result.requestTxnId});
    

    // Assert creating participant with missing required data fails //
    await assert.rejects(test.entity.create_participant_missing_data(ceblocks, {providerId: providerNoMaxPointsPerRedemption.id}), "Create Participant: Missing Data");

    // Assert participant created (with unlimited points per redemption provider) 
    result = await test.entity.create_participant(ceblocks, {providerId: providerNoMaxPointsPerRedemption.id, encryptedCustomerIdentifier:"asdfasdf"});

    assert.deepStrictEqual(result.actual, result.expected, "Create Participant 1");

    let participantNoMaxPointsPerRedemption = await ceblocks.getEntityObject({"entityId": result.requestTxnId});

    // Assert participant created (with limited points per redemption provider) 
    result = await test.entity.create_participant(ceblocks, {providerId: providerHasMaxPointsPerRedemption.id, encryptedCustomerIdentifier:"qwerqwer"});

    assert.deepStrictEqual(result.actual, result.expected, "Create Participant 2");

    let participantHasMaxPointsPerRedemption = await ceblocks.getEntityObject({"entityId": result.requestTxnId});




    // +++ TRANSFER TESTS +++ //

    // Assert minting points succeeds //
    result = await test.transfer.mint_points(ceblocks, {toEntityId: providerNoMaxPointsPerRedemption.id, points: 48});

    assert.deepStrictEqual(result.actual, result.expected);

    providerNoMaxPointsPerRedemption = await ceblocks.getEntityObject({entityId: providerNoMaxPointsPerRedemption.id});


    // Assert burning points succeeds //
    result = await test.transfer.burn_points(ceblocks, {fromEntityId: providerNoMaxPointsPerRedemption.id, points: 12});

    assert.deepStrictEqual(result.actual, result.expected);

    providerNoMaxPointsPerRedemption = await ceblocks.getEntityObject({entityId: providerNoMaxPointsPerRedemption.id});

    // Assert transfering points to participant succeeds //
    result = await test.transfer.transfer_points(ceblocks, {fromEntityId: providerNoMaxPointsPerRedemption.id, toEntityId: participantNoMaxPointsPerRedemption.id, points: 12});

    assert.deepStrictEqual(result.actual, result.expected);

    providerNoMaxPointsPerRedemption = await ceblocks.getEntityObject({entityId: providerNoMaxPointsPerRedemption.id});


    // Assert transfering (by burning) too many points from a PARTICIPANT fails //
    await assert.rejects(test.transfer.burn_points(ceblocks, {fromEntityId: participantNoMaxPointsPerRedemption.id, points: 1000000}));


    console.log("Tests passed!");

})();