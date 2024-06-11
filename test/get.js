"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
(0, index_1.getHosts)().then(function (a) {
    console.log(a);
}).catch(function (err) {
    console.log(err);
});
