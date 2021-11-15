# UofTBoard

The official University of Toronto bulletin board.

## Building and Running with Docker

```
docker build -t uoftboard .
docker run -p 80:80 -e PORT=80 -e JWT_SECRET=test uoftboard
```

## Setting up types for client

Setup needs to be done in order to use the type definitions from the server in our client files.

Make sure that "declaration": true is set in server tsconfig and perform yarn build in server

Then in the root directory of the project run this:

`ln -s "$PWD/server/build/models" "$PWD/client/node_modules/models"`
`ln -s "$PWD/server/build/types/models" "$PWD/client/node_modules/@types/models"`

The types should then be picked up with the import path server/... For example import {
UserAttributes } from "server/models/user"
