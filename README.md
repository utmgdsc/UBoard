# UofTBoard

The official University of Toronto bulletin board.

## Building and Running with Docker

```
docker build -t uoftboard .
docker run -p 80:80 -e PORT=80 -e JWT_SECRET=test uoftboard
```

## Setting up types for client

Setup needs to be done in order to use the type definitions from the server in our client files.

Before continuing, make sure you `git pull` and then run `yarn build` in server directory.

Then in the root directory of the project run this:

Windows:

`rmdir "%cd%/client/node_modules/models"`

`rmdir "%cd%/client/node_modules/@types/models"`

`mklink /D "%cd%/client/node_modules/models" "%cd%/server/build/models"`

`mklink /D "%cd%/client/node_modules/@types/models" "%cd%/server/build/types/models"`

Linux/Mac:

`ln -s "$PWD/server/build/models" "$PWD/client/node_modules/models"`

`ln -s "$PWD/server/build/types/models" "$PWD/client/node_modules/@types/models"`

Then, types should be picked up from the import path models/..., which allows us to import like so:

`import { UserAttributes } from "models/user"`
