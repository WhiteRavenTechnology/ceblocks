const util = require('util');

const config = require('./config');

// Fancy utility function //
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Escape a value for redisearch query purposes //
const redisearchEncode = (value) => {
    return value.replace(/([^A-Za-z\d_]+)/g, '\\$1');
}

// General helper for interacting with our Dragonchain node using the SDK client //
const helper = {          
    
    getProviders: async (client) => {
        try {
            const transactions = await client.queryTransactions({
                transactionType: config.contractTxnType,
                redisearchQuery: `@response_type:{createProvider}`,
                limit: 999999
            });

            if (transactions.response.results)
            {
                return transactions.response.results.map(result => {return result.payload.response.entity});
            } else 
                return [];
        } catch (exception)
        {
            // Pass back to caller to handle gracefully //
            throw exception;
        }
    },

    createProvider: async (client, options) => {
        try {
            let payload = {
                "method":"createProvider", 
                "parameters":{
                    "provider": options.provider
                }
            };

            const requestTxn = await client.createTransaction({
                transactionType: config.contractTxnType,
                payload: payload
            })

            return requestTxn;

        } catch (exception)
        {
            // Pass back to caller to handle gracefully //
            throw exception;
        }
    },

    // +++ Heap Helpers +++ //
    getAPIKeyMapObject: async function (client) {
        try {
            const objResponse = await client.getSmartContractObject({key:`apiKeyMap`, smartContractId: config.contractId})

            const obj = JSON.parse(objResponse.response);
            
            if (obj.error)
                throw "API Keys Not Found: " + obj.error.details;

            return obj;
        } catch (exception)
        {            
            throw exception
        }
    },

    getEntityObject: async function (client, options) {
        try {
            const objResponse = await client.getSmartContractObject({key:`entity-${options.entityId}`, smartContractId: config.contractId})

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

module.exports = helper;