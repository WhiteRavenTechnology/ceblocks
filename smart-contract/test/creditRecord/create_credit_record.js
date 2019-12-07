const uuid = require("uuid/v4");

module.exports = async function (ceblocks, options) {

    const txnId = uuid();
    
    const result = await ceblocks.createCreditRecord(
      txnId,     
      {
        "creditRecord": {
          "providerId": options.providerId,
          "participantId": options.participantId,
          "eventName": "Recent Developments in Alabama Law",
          "eventDescription": "Our annual year-in-review update on Alabama legal developments",
          "eventType": "Live Online Webcast",
          "eventCredits": 6.0,
          "eventFaculty": [
            {
              "firstName": "William",
              "middleName": "R.",
              "lastName": "Newman",
              "lastNameSuffix": "Esq.",
              "professionalTitle": "Professor, University of Southern Mississippi"
            }
          ],
          "participantDetails": {
              "firstName": "John",
              "middleName": "A.",
              "lastName": "Doe",
              "lastNameSuffix": "Esq."
          },
          "creditJurisdictions": [
            {
              "jurisdictionName": "Alabama Bar",
              "jurisdictionEventIdentifier": "os1234",
              "jurisdictionCustomerIdentifier": "AB7890",
              "jurisdictionCertificateFile": "d8f8usdg09we89ds908ds09g8...",              
              "creditsEarned": [
                {"type": "general", "credits": 5.0},
                {"type": "ethics", "credits": 1.0}
              ]
            }  
          ]
        }
      }
    );

    ceblocks.client.updateSmartContractHeap(result);

    const creditRecordKey = `creditRecord-${txnId}`;

    const creditRecordCertificateFileKey = `creditRecordCertificateFile-${result.response.creditRecord.creditJurisdictions[0].id}`;
    
    return {
        "requestTxnId": txnId,        
        "actual": result,        
        "expected": {
            "response": {
              "type": "createCreditRecord",
              "creditRecord": {
                "id": txnId,
                "providerId": options.providerId,
                "participantId": options.participantId,
                "eventName": "Recent Developments in Alabama Law",
                "eventDescription": "Our annual year-in-review update on Alabama legal developments",
                "eventType": "Live Online Webcast",
                "eventCredits": 6.0,
                "eventFaculty": [
                  {
                    "firstName": "William",
                    "middleName": "R.",
                    "lastName": "Newman",
                    "lastNameSuffix": "Esq.",
                    "professionalTitle": "Professor, University of Southern Mississippi"
                  }
                ],
                "participantDetails": {
                    "firstName": "John",
                    "middleName": "A.",
                    "lastName": "Doe",
                    "lastNameSuffix": "Esq."
                },
                "creditJurisdictions": [
                  {
                    "id": result.response.creditRecord.creditJurisdictions[0].id,
                    "jurisdictionName": "Alabama Bar",
                    "jurisdictionEventIdentifier": "os1234",
                    "jurisdictionCustomerIdentifier": "AB7890",
                    "jurisdictionCertificateFileKey": creditRecordCertificateFileKey,                    
                    "creditsEarned": [
                      {"type": "general", "credits": 5.0},
                      {"type": "ethics", "credits": 1.0}
                    ]
                  }  
                ]
              }
            },
            [creditRecordKey]: {
              "id": txnId,
              "providerId": options.providerId,
              "participantId": options.participantId,
              "eventName": "Recent Developments in Alabama Law",
              "eventDescription": "Our annual year-in-review update on Alabama legal developments",
              "eventType": "Live Online Webcast",
              "eventCredits": 6.0,
              "eventFaculty": [
                {
                  "firstName": "William",
                  "middleName": "R.",
                  "lastName": "Newman",
                  "lastNameSuffix": "Esq.",
                  "professionalTitle": "Professor, University of Southern Mississippi"
                }
              ],
              "participantDetails": {
                  "firstName": "John",
                  "middleName": "A.",
                  "lastName": "Doe",
                  "lastNameSuffix": "Esq."
              },
              "creditJurisdictions": [
                {
                  "id": result.response.creditRecord.creditJurisdictions[0].id, // Can't anticipate the UUID assigned //
                  "jurisdictionName": "Alabama Bar",
                  "jurisdictionEventIdentifier": "os1234",
                  "jurisdictionCustomerIdentifier": "AB7890",
                  "jurisdictionCertificateFileKey": creditRecordCertificateFileKey,
                  "creditsEarned": [
                    {"type": "general", "credits": 5.0},
                    {"type": "ethics", "credits": 1.0}
                  ]
                }  
              ],
              "status": "valid"
            },
            [creditRecordCertificateFileKey]: "d8f8usdg09we89ds908ds09g8..."
        }
    };    
}