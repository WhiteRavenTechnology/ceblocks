# CEBlocks Smart Contract

This is the Node.js smart contract that should be deployed to an operational Level 1 Dragonchain Business Node. 

## Setup Notes

- Note the required indexes for the contract and its API to function correctly. 
- Remember that custom indexes can only be created when the contract is created. You can always delete the contract from your L1 to reinstall, but **previous contract transactions will not be re-indexed** 
    - This can actually be useful for testing with dummy data before launching a "final" copy of the contract
- The smart contract should also be installed in **serial** execution mode, **not** parallel to prevent race conditions between contract operations (double spends, etc.).

## Sample Install Command

```
dctl contract create ceblocks \
yourdockerhubname/ceblocks:latest \
node index.js \
-s \
-r YOURBASE64ENCODEDDOCKERHUBUSERNAME:PASSWORD \
--customIndexes '[{"fieldName":"response_type","path":"$.response.type","type":"tag"},{"fieldName":"entity_type","path":"$.response.entity.type","type":"tag"},{"fieldName":"entity_id","path":"$.response.entity.id","type":"tag"},{"fieldName":"entity_email","path":"$.response.entity.email","type":"tag"},{"fieldName":"entity_name","path":"$.response.entity.name","type":"text"},{"fieldName":"entity_industries","path":"$.response.entity.industries","type":"tag"},
{"fieldName":"participant_provider_id","path":"$.response.entity.providerId","type":"tag"},{"fieldName":"participant_encrypted_customer_identifier","path":"$.response.entity.encryptedCustomerIdentifier","type":"tag"},
{"fieldName":"transfer_points_from","path":"$.response.pointTransfer.fromEntityId","type":"tag"},{"fieldName":"transfer_points_to","path":"$.response.pointTransfer.toEntityId","type":"tag"},{"fieldName":"credit_record_id","path":"$.response.creditRecord.id","type":"tag"},{"fieldName":"credit_record_provider_id","path":"$.response.creditRecord.providerId","type":"tag"},{"fieldName":"credit_record_participant_id","path":"$.response.creditRecord.participantId","type":"tag"},{"fieldName":"credit_record_encrypted_customer_identifier","path":"$.response.creditRecord.encryptedCustomerIdentifier","type":"tag"},{"fieldName":"revoked_credit_record_id","path":"$.response.creditRecordRevocation.creditRecordId","type":"tag"}]'
```