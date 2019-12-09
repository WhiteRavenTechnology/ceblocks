# Day 1 (Thursday)

- Start: 11:30 AM-ish (my time) - Finish: 11:30 PM (12 hours)

    *Note: I didn't stop the clock for bathroom breaks, grabbing coffee, etc.*

- What I got done:
  1. Everything initialized (git, folder structure, etc.)
  2. Smart contract methods for addProvider, addParticipant, transferToken, and addMasterAPIKey created with integration tests
  3. Web demo with express-handlebars and multiple layouts (simple vs admin) up and running, nothing implemented
  4. API server filled in with basic authentication using API keys stored on DC (not sure if this is a good idea)
  5. Create provider flow from API -> contract added, verified working on live L1
  6. Get all/specific provider(s) methods added to API, verified working on live L1
  7. Fleshed out process for adding a credit record with or without a pre-existing participant record
  8. Little bit o' helping a fellow competitor

- General thoughts:
  - Holy hell work work. First problem with a broadcast in 2 years. Of course.
  - Work on project interrupted constantly by work work until 5:00 PM or so.
  - USE THE DAMNED DCTL TEST SUITE: many stupid bugs from oversights that I tried to test on live L1 because I'm dumb



Day 2 (Friday)
-----------------
- Start: 10:45 AM - Finish: 4:45 PM (6 hours)

- Start: 9:00 PM - Finish: 11:00 PM (2 hours)

  --- Coffffeeeee ---

- Start: 11:30 PM - End: 2:45 AM (3.25 hours)

- What I got done:
  1. Add credit record method/integration test added to contract
  2. Participant search function, missing indexes added
  3. Participant creation/retrieval through API added
  4. Add credit record methods (by known participant and by new participant) added to API, tested
  5. Automatic award/transfer of points on new credit record tested
  6. Basic credit record viewing added to web server including Dragon Net verifications (WOOOO)
  7. API Integration in actual continuing ed platform (WOOOOOOOOOO)
  8. Callback implemented to email customer with link to credit record
  9. New provider form added to web

- General thoughts:

  - WHY did I do this?
  - It's fun building shit. (That's why.)
  - Legacy systems are no fun to work in.
  - I ate waaaay too much at our early Christmas dinner.
  - I'm too old to be pushing like this...
  - But I'm on track.



Day 3 (Saturday)
-----------------
- Start: 12:00 PM - Finish: 4:30 PM (4.5 hours)

- Start: 5:30 PM - Finish: 6:00 PM (.5 hours)

- Start: 7:00 PM - Finish: 12:15 AM (5.25 hours)

- What I got done:
  1. Added missing field to add provider web form
  2. Added encrypted identifier to email sent through callback (for claiming records in future)
  3. Added point redemption method to API
  4. Integrated display of points available and redemption of points in CE platform
  5. Added storage of base64-encoded PDF certificate files on-chain, download button on view credit record page

        ### ***Minimum goals for project met here***
  
  6. Added customer and customer/participant relationship to smart contract with tests
  7. Added customer registration with participant record claim, login function, hashed passwords, encrypted cookies

- General thoughts:
  - OH MY GOD SERIOUSLY IT TOOK 2 HOURS TO GET A DAMNED PASSWORD HASHING ALGORITHM WORKING
  - So. Tired.
  - Very pleased.
  


Day 4 (Sunday)
-----------------
- Start: 10:45 AM - Finish: 5:00 PM (6.25 hours)

- Start: 7:00 PM - Finish: 12:15 AM (5.25 hours)

- What I got done:
  1. Added memo to transfers for easier identification of transfer purpose
  2. Added credit record id array on participant object for easier lookup
  3. Added customer dashboard with transaction history, credit record list
        ### ***First MAJOR stretch goal for project now met!***
  4. Added partner creation to contract, api, web
  5. Added view provider/view partner pages to web
  6. Added marketplace page and mocked up functionality to redeem tokens with marketplace partner
        ### ***Second MAJOR stretch goal for project now met: all code complete!***
  7. Shot and uploaded demo video
  8. Started documentation


- General thoughts:
  - Goal for day: done with functional code
  - Stretch goal for day: done with demo video, submission details drafted
  - What. An. Experience.


Day 5 (Monday) - **SUBMISSION DAY**
- Start: 7:30 AM (Stupid webcasts for work work...) 

- What I got done:
  1. Documentatioooonnnnnnnnn
  2. Submitted!

- General thoughts:
  - Thank goodness this was only 5 days... :D
  - Thank you Dragonchain