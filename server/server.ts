import express from 'express';
import path from 'path';
import pg from 'pg';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/hello', (req: express.Request, res: express.Response) => {
    res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req: express.Request, res: express.Response) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));