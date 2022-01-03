# UBoard

The official University of Toronto bulletin board.

UBoard is a platform where students can keep up to date with their community. Students can post about, and search for, community related events, academics, club announcements, and more.

## Development

The project uses yarn. Install node (npm) and do `npm install --global yarn`.

The frontend of our project is in the `client/` folder, and the backend is in `server/`.

## Type Definitions for Client

Additional setup needs to be done in order to use the type definitions from the server in our client files.

Before continuing, make sure you `git pull` and then run `yarn build` in server directory.

Then in the root directory of the project run this:

Windows:

`mklink /D "%cd%/client/node_modules/models" "%cd%/server/build/models"`

`mklink /D "%cd%/client/node_modules/@types/models" "%cd%/server/build/types/models"`

Linux/Mac:

`ln -s "$PWD/server/build/models" "$PWD/client/node_modules/models"`

`ln -s "$PWD/server/build/types/models" "$PWD/client/node_modules/@types/models"`

Then, types should be picked up from the import path models/..., which allows us to import like so:

`import { UserAttributes } from "models/user"`

## Building and Running with Docker

The site can be run inside of a docker container.

```
docker build -t uoftboard .
docker run -p 80:80 -e PORT=80 -e JWT_SECRET=secret -e PAGE_URL=localhost uoftboard
```

Note that additional environment variables are needed for additional features to function. These can be added with the `-e` flag.

Google Cloud API key with Maps, Pages, and Geolocation enabled.
`REACT_APP_MAPS_API`

Backblaze used for blob storage for thumbnails.
`BACKBLAZE_APP_KEY`
`BACKBLAZE_APP_KEY_ID`
`BACKBLAZE_BUCKET_ID`
`BACKBLAZE_BUCKET_NAME`

Required for database to function
`DATABASE_URL`

SendGrid API keys for email functionality
`FROM_EMAIL`
`SENDGRID_API`
