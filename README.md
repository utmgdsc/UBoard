# UofTBoard

The official University of Toronto bulletin board.

## Building and Running with Docker

```
docker build -t uoftboard .
docker run -p 80:80 -e PORT=80 -e JWT_SECRET=test uoftboard
```

## Setting up types for client

Setup needs to be done in order to use the type definitions from the server in our client files.

Make sure that `"declaration": true` is set in server tsconfig and perform `yarn build` in server dir

Then in the root directory of the project run this:

Windows:

`mklink /D "%cd%/client/node_modules/models" "%cd%/server/build/models"`

`mklink /D "%cd%/client/node_modules/@types/models" "%cd%/server/build/types/models"`

Unix:

`ln -s "$PWD/server/build/models" "$PWD/client/node_modules/models"`

`ln -s "$PWD/server/build/types/models" "$PWD/client/node_modules/@types/models"`

Then, types should be picked up from the import path server/..., which allows us to import like so:

`import { UserAttributes } from "models/user"`
