# CEBlocks

Submission for the December 2019 [Dragonchain](https://www.dragonchain.com) Hack-a-Thon

## Project Overview

**CEBlocks** is an accredited continuing education certificate authority, loyalty program, and marketplace solution in one.

Continuing education providers ledger records of credit earned on behalf of customers.

Their customers earn **CEB Tokens** that can be redeemed with the original provider OR in a marketplace of relevant product and service sellers.

Providers benefit from increased customer loyalty (*note that CEB Tokens issued by **provider A** can never be spent on **provider B**, but CAN be spent in the marketplace*).

Marketplace partners gain access to a highly tailored audience of cusomters.

All parties can rely on the solution because it is both **third-party managed** and **verified and secured** by Dragonchain blockchain technology.

## Components

The project is comprised of **three primary components**, all written in Node.js

- A **smart contract** to be run on a Dragonchain business node
- A **RESTful API server** that handles communication between client applications and the blockchain utilizing the Dragonchain SDK
- A **web server** that handles admininistrative and customer-facing needs

Documentation for each component is included in the README files in their respective directories.

## Dragonchain Technology

The following features and tools in the Dragonchain ecosystem were utilized to implement this project:

- Dragonchain Level 1 business node
- Docker-ized smart contracts
- DCTL command-line interface tool
- Post-block callback functionality after creating certain transactions
- Smart contract object heap to maintain stateful data

No other database solution was necessary or implemented to complete this project.
