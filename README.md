# Getting started

    npm install
    npm start

# Purpose

To demonstrate using sagas for optimistic updates where the requests are throttled. To force an error notification make the blue count 5 and wait for the sync.

# Remote syncing rules

Syncs occur under the following conditions...

- no change has occurred in 10 seconds
- window is closed
- force sync button is clicked
