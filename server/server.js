const express = require('express');
const path = require('path');
const pg = require('pg');

const app = express();
const port = process.env.PORT || 8080;
const nginx_port = "/tmp/nginx.socket";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API calls
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// app.listen(port, () => console.log(`Listening on port ${port}`));
app.listen(nginx_port, () => console.log(`Listening on port ${nginx_port}`));