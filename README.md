# CEBlocks

Submission for the December 2019 [Dragonchain](https://www.dragonchain.com) Hack-a-Thon

***Note: the code contained in this repository should NOT be considered production-ready***

# Submission Video

[CEBlocks Demonstration Video](https://www.youtube.com/watch?v=q7B9LkVgH8s&feature=youtu.be)

## Project Overview

**CEBlocks** is an accredited continuing education certificate authority, loyalty program, and marketplace solution in one.

Continuing education providers ledger records of credit earned on behalf of customers.

Their customers earn **CEB Tokens** that can be redeemed with the original provider OR in a marketplace of relevant product and service sellers.

Providers benefit from increased customer loyalty (*note that CEB Tokens issued by **provider A** can never be spent on **provider B**, but CAN be spent in the marketplace*).

Marketplace partners gain access to a highly tailored audience of customers.

All parties can rely on the solution because it is both **third-party managed** and **verified and secured** by Dragonchain blockchain technology.

## Components

The project is comprised of **three primary components**, all written in Node.js

- A **smart contract** to be run on a Dragonchain business node
- A **RESTful API server** that handles communication between client applications and the blockchain utilizing the Dragonchain SDK
- A **web server** that handles admininistrative and customer-facing needs

Documentation for each component is included in the README files in their respective directories.

## Entities and Objects

The following are the primary entities used in the system:

- **Providers** represent continuing education providers
- **Participants** represent provider-customer relationships (identified by "encrypted customer identifier" created by provider)
- **Customers** represent learners who create a CEBlocks account and "claim" **participant** records
- **Partners** represent marketplace goods and services sellers

The following objects are also utilized:
- **Credit Records** are created by a **provider** and identify the **participant** who earned continuing education credit
- **Point Transfers** represent the minting, transfer, and burning of CEB Tokens
- The **API Key Map** heap object maintains encrypted API keys

## Dragonchain Technology

The following features and tools in the Dragonchain ecosystem were utilized to implement this project:

- Dragonchain Level 1 business node
- Docker-ized smart contracts
- DCTL command-line interface tool
- Post-block callback functionality after creating certain transactions
- Smart contract object heap to maintain stateful data

No other database solution was necessary or implemented to complete this project.


## Documentation

- [Smart Contract Notes](/smart-contract/README.md)
- [API Server Notes](/api/README.md)
- [Web Server Notes](/web/README.md)
- [Sample JSON Objects](/docs/sampleObjects.md)

Additionally, I've included a discussion of [next steps](/docs/nextSteps.md) for CEBlocks and a [journal](/docs/journal.md) of my time working on this project over the 4.5 days of the hack-a-thon.

## Thanks

Thank you to my wife for your patience. :D

Thank you to Dragonchain for the amazing platform, the amazing developers (Dean, Regan, Adam, Alex, Roby), and the chance to build something and remind myself why I love code.

