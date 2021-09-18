"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var port = 8080;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/api/hello', function (req, res) {
    res.send({ express: 'Hello From Express' });
});
app.post('/api/world', function (req, res) {
    console.log(req.body);
    res.send("I received your POST request. This is what you sent me: " + req.body.post);
});
app.listen(port, function () { return console.log("Listening on port " + port); });
