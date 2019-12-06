'use strict'
const uuid = require("uuid/v4");

module.exports = {
    // Dragonchain SDK client instance //
    client: null,

    // +++ Main contract methods +++ //
    createProvider: async function (requestTxnId, parameters)
    {
        const inProvider = parameters.provider;

        if (typeof inProvider.name === "undefined" || inProvider.name.trim() == "")
            throw "Provider name must be specified.";

        let entity = {
            "id": requestTxnId,
            "type": "provider",
            "maxPointsPerRedemption": null, // default
            "creditToPointsMultiplier": 1.0 // default
        };

        entity = {...entity, ...inProvider};

        // Force points to 0 (even if passed in parameters) //
        entity.points = 0;

        const entityKey = `entity-${requestTxnId}`;

        let output = {
            "response": {
                "type": "createProvider",
                "entity": entity
            },
            [entityKey]: entity
        }

        return output;
    },

    createParticipant: async function (requestTxnId, parameters)
    {
        const inParticipant = parameters.participant;

        if (typeof inParticipant.providerId === "undefined" || inParticipant.providerId.trim() == "")
            throw "Provider ID is required.";

        if (typeof inParticipant.encryptedCustomerIdentifier === "undefined" || inParticipant.encryptedCustomerIdentifier.trim() == "")
            throw "Customer Identifier is required.";

        let entity = {
            "id": requestTxnId,
            "type": "participant"            
        };

        entity = {...entity, ...inParticipant};

        entity.points = 0;

        const entityKey = `entity-${requestTxnId}`;

        let output = {
            "response": {
                "type": "createParticipant",
                "entity": entity
            },
            [entityKey]: entity
        }

        return output;
    },

    
    transferPoints: async function (requestTxnId, parameters)
    {
        const inPointTransfer = parameters.pointTransfer;

        const fromEntity = inPointTransfer.fromEntityId == null ? null : await this.getEntityObject({entityId: inPointTransfer.fromEntityId});

        const toEntity = inPointTransfer.toEntityId == null ? null : await this.getEntityObject({entityId: inPointTransfer.toEntityId});

        // If not minting (null fromEntity), and if entity is a participant, ensure sufficient balance //
        // Note: providers can transfer more points than they have, going negative, to be addressed in billing outside of contract //        
        if (fromEntity != null && fromEntity.type == "participant")
        {
            if (fromEntity.points < inPointTransfer.points)
                throw "Participant has insufficient balance for transfer.";
        }

        inPointTransfer.id = requestTxnId;

        let output = {
            "response": {
                "type": "transferPoints",
                "pointTransfer": inPointTransfer
            }
        };

        if (fromEntity != null)
        {
            fromEntity.points = fromEntity.points - inPointTransfer.points;

            const fromKey = `entity-${fromEntity.id}`;

            output[fromKey] = fromEntity;
        }

        if (toEntity != null)
        {
            toEntity.points = toEntity.points + inPointTransfer.points;

            const toKey = `entity-${toEntity.id}`;

            output[toKey] = toEntity;
        }

        return output;
    },

    // +++ API Key Management Methods +++ //
    addMasterAPIKey: async function (requestTxnId, parameters) {

        let apiKeyMap = null;

        try {
            apiKeyMap = await this.getAPIKeyObject();
        } catch (exception) {

        }

        if (apiKeyMap != null)
            throw "Master API Key already exists.";

        let output = {
            "apiKeyMap": {
                "master": requestTxnId
            }
        }

        return output;
    },

    // +++ Helper Methods +++ //
    getAPIKeyObject: async function () {
        try {
            const objResponse = await this.client.getSmartContractObject({key:`apiKeyMap`})

            const obj = JSON.parse(objResponse.response);
            
            if (obj.error)
                throw "API Keys Not Found: " + obj.error.details;

            return obj;
        } catch (exception)
        {            
            throw exception
        }
    },

    getEntityObject: async function (options) {
        try {
            const objResponse = await this.client.getSmartContractObject({key:`entity-${options.entityId}`})

            const obj = JSON.parse(objResponse.response);
            
            if (obj.error)
                throw "Entity Not Found: " + obj.error.details;

            return obj;
        } catch (exception)
        {            
            throw exception
        }
    }
}