const util = require('util');

const config = require('./config');



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

    getParticipants: async (client) => {
        try {
            const transactions = await client.queryTransactions({
                transactionType: config.contractTxnType,
                redisearchQuery: `@response_type:{createParticipant}`,
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

    findParticipantByIdentifier: async (client, options) => {
        try {
            const transactions = await client.queryTransactions({
                transactionType: config.contractTxnType,
                redisearchQuery: `@response_type:{createParticipant} @participant_provider_id:{${redisearchEncode(options.providerId)}} @participant_encrypted_customer_identifier:{${redisearchEncode(options.encryptedCustomerIdentifier)}}`
            });

            if (transactions.response.total > 0)
            {
                return transactions.response.results[0].payload.response.entity;
            } else 
                throw `Participant not found with specified provider Id and encrypted customer identifier.`;


        } catch (exception)
        {
            // Pass back to caller to handle gracefully //
            throw exception;
        }
    },

    createParticipant: async (client, options) => {
        try {
            let payload = {
                "method":"createParticipant", 
                "parameters":{
                    "participant": options.participant
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


    getCreditRecords: async (client) => {
        try {
            const transactions = await client.queryTransactions({
                transactionType: config.contractTxnType,
                redisearchQuery: `@response_type:{createCreditRecord}`,
                limit: 999999
            });

            if (transactions.response.results)
            {
                return transactions.response.results.map(result => {return result.payload.response.creditRecord});
            } else 
                return [];
        } catch (exception)
        {
            // Pass back to caller to handle gracefully //
            throw exception;
        }
    },

    createCreditRecord: async (client, options) => {
        try {
            let payload = {
                "method":"createCreditRecord", 
                "parameters":{
                    "creditRecord": options.creditRecord
                }
            };

            let request = {
                transactionType: config.contractTxnType,
                payload: payload
            };

            if (typeof options.callbackURL !== "undefine" && options.callbackURL != "")
                request.callbackURL = options.callbackURL;

            const requestTxn = await client.createTransaction(request);

            return requestTxn;

        } catch (exception)
        {
            // Pass back to caller to handle gracefully //
            throw exception;
        }
    },

    transferPoints: async (client, options) => {
        try {
            let payload = {
                "method":"transferPoints", 
                "parameters":{
                    "pointTransfer": options.pointTransfer
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


    // +++ Dragon Net Verifications +++ //    
    getBlockVerificationsForTxnId: async(client, options) => {
        try {
            // Get the RESPONSE transaction for the transaction ID/object ID //
            const txnResponse = await client.queryTransactions({
                transactionType: config.contractTxnType,
                redisearchQuery: `@invoker:{${redisearchEncode(options.objectId)}}`,
                limit: 999999
            });

            if (txnResponse.response.results && txnResponse.response.results.length > 0)
            {                
                const verificationsResponse = await client.getVerifications({blockId:txnResponse.response.results[0].header.block_id});
            
                return verificationsResponse.response;
            } else {
                throw "Object not found.";
            }
        } catch (exception)
        {            
            throw exception
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
    },

    getCreditRecordObject: async function (client, options) {
        try {
            const objResponse = await client.getSmartContractObject({key:`creditRecord-${options.creditRecordId}`, smartContractId: config.contractId})

            const obj = JSON.parse(objResponse.response);
            
            if (obj.error)
                throw "Credit Record Not Found: " + obj.error.details;

            return obj;
        } catch (exception)
        {            
            throw exception
        }
    },

    // +++ Utility +++ //
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
}

module.exports = helper;