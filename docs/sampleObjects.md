# Sample JSON Objects from Object Heap Post-Test Run

## Provider

```
"entity-ebee93cc-9a01-4bc4-b6ce-ffd88e23e1f5": {
    "id": "ebee93cc-9a01-4bc4-b6ce-ffd88e23e1f5",
    "type": "provider",
    "maxPointsPerRedemption": null,
    "creditToPointsMultiplier": 1,
    "addCreditRecordCallbackURL": "https://www.example.com/api/creditRecord/",
    "name": "Test Provider",
    "description": "A provider of continuing education",
    "websiteURL": "https://www.example.com",
    "logoURL": "https://www.example.com/image.jpg",
    "phone": "1-800-555-5555",
    "email": "contact@example.com",
    "industries": "legal,accounting,banking",
    "points": 24
}
  ```

## Partner

```
"entity-bda2e9c1-56cb-4edc-bb1a-2875f3a9f17d": {
    "id": "bda2e9c1-56cb-4edc-bb1a-2875f3a9f17d",
    "type": "partner",
    "maxPointsPerRedemption": null,
    "name": "Test Partner",
    "description": "A seller of professional goods and services",
    "websiteURL": "https://www.example.com",
    "logoURL": "https://www.example.com/image.jpg",
    "phone": "1-800-555-5555",
    "email": "contact@example.com",
    "industries": "legal,accounting,banking",
    "points": 0
}
```

## Participant
```
"entity-959c198f-c5ad-4911-8a8a-c5789887b094": {
    "id": "959c198f-c5ad-4911-8a8a-c5789887b094",
    "type": "participant",
    "providerId": "ebee93cc-9a01-4bc4-b6ce-ffd88e23e1f5",
    "encryptedCustomerIdentifier": "asdfasdf",
    "creditRecordIds": [
      "3bfcac4b-e3f9-456c-b194-997f4e3c2e63"
    ],
    "points": 12
}
```

## Customer

```
"entity-2880b79a-8bdc-4c2e-8703-fbcb61bde01f": {
    "id": "2880b79a-8bdc-4c2e-8703-fbcb61bde01f",
    "type": "customer",
    "participantIds": [
      "959c198f-c5ad-4911-8a8a-c5789887b094"
    ],
    "email": "johndoe@example.com",
    "hashedPassword": "{\"salt\":\"0dd724b5195eae1ab90d90e8c20b7685\",\"hash\":\"0e6fefc7fdc113095cb605c9657208257452aa939067ee944b41bbfd0f8a60d2d31bc46897800e91026fbe8061c2594ba2a1f52a1cead3865ad87ec8d960d141\"}",
    "firstName": "John",
    "middleName": "A.",
    "lastName": "Doe",
    "lastNameSuffix": "Esq.",
    "points": 0
}
```

## Credit Record

```
"creditRecord-3bfcac4b-e3f9-456c-b194-997f4e3c2e63": {
    "providerId": "ebee93cc-9a01-4bc4-b6ce-ffd88e23e1f5",
    "participantId": "959c198f-c5ad-4911-8a8a-c5789887b094",
    "eventName": "Recent Developments in Alabama Law",
    "eventDescription": "Our annual year-in-review update on Alabama legal developments",
    "eventType": "Live Online Webcast",
    "eventCredits": 6,
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
    "timestampCreditEarned": 1575836641,
    "creditJurisdictions": [
      {
        "jurisdictionName": "Alabama Bar",
        "jurisdictionEventIdentifier": "os1234",
        "jurisdictionCustomerIdentifier": "AB7890",
        "creditsEarned": [
          {
            "type": "general",
            "credits": 5
          },
          {
            "type": "ethics",
            "credits": 1
          }
        ],
        "id": "a66da451-20a2-43bb-bcea-bab2790027e4",
        "jurisdictionCertificateFileKey": "creditRecordCertificateFile-a66da451-20a2-43bb-bcea-bab2790027e4"
      }
    ],
    "id": "3bfcac4b-e3f9-456c-b194-997f4e3c2e63",
    "status": "valid"
}
```

## Credit Record Certificate File

```
"creditRecordCertificateFile-a66da451-20a2-43bb-bcea-bab2790027e4": "base64encodedfile......"
```

## Point Transfers

Mint:
```
"pointTransfer": {
    "id": "<UUID>",
    "fromEntityId": null,
    "toEntityId": "ebee93cc-9a01-4bc4-b6ce-ffd88e23e1f5",
    "points": 500,
    "memo": "Provider-purchased CEB Token pack"
}
```

Transfer:
```
"pointTransfer": {
    "id": "<UUID>",
    "fromEntityId": "ebee93cc-9a01-4bc4-b6ce-ffd88e23e1f5",
    "toEntityId": "959c198f-c5ad-4911-8a8a-c5789887b094",
    "points": 2,
    "memo": "Rewards earned from provider Test Provider"
}
```

Burn:
```
"pointTransfer": {
    "id": "<UUID>",
    "fromEntityId": "959c198f-c5ad-4911-8a8a-c5789887b094",
    "toEntityId": null,
    "points": 10,
    "memo": "Redemption at marketplace partner Test Partner"
}
```

## API Key Map 

```
"apiKeyMap": {
  "master": "{\"salt\":\"e240cf2cf97cacec570dffdde658d602\",\"hash\":\"19b42bdb0cc69c941b57a908c56df3887880392019cefa031074028dc674d9136bbab59c34c9c755f1647d200f1168138359ce61929024ecdc6f3175529117d4\"}"
}
```