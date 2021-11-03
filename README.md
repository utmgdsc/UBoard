# UofTBoard

The official University of Toronto bulletin board.

## Building and Running with Docker

```
docker build -t uoftboard .
docker run -p 80:80 -e PORT=80 -e JWT_SECRET=test uoftboard
```
