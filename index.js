"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMacAddressFromLabel = exports.unescapeLabel = exports.whereHostNameIsLike = exports.getHostsUnresolved = exports.extractMacAddressFromScanLineArray = exports.getHosts = exports.setHostname = void 0;
var Promise = require("bluebird");
var child_process_1 = require("child_process");
function setHostname(hostname) {
    return new Promise(function (resolve, reject) {
        (0, child_process_1.exec)('avahi-set-host-name ' + hostname, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.setHostname = setHostname;
function getHosts() {
    return new Promise(function (resolve, reject) {
        var results = [];
        (0, child_process_1.exec)('avahi-browse -a -r -t -p', function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                var result = stdout.split('\n');
                for (var i = 0; i < result.length; i++) {
                    var row = result[i].trim();
                    if (row.includes("+") && (row.includes("IPv4") || row.includes("IPv6"))) {
                        var words = row.split(';');
                        var hostnameLabel = unescapeLabel(words[3]);
                        var hostname = hostnameLabel.split(' ')[0];
                        var mac = extractMacAddressFromLabel(hostnameLabel);
                        if (row.includes("IPv4")) {
                            results.push({ interface: words[1], ipv4: true, ipv6: false, hostname: hostname, mac: mac });
                        }
                        else if (row.includes("IPv6")) {
                            results.push({ interface: words[1], ipv6: true, ipv4: false, hostname: hostname, mac: mac });
                        }
                    }
                    else if (row.includes("+")) {
                        results[results.length - 1][row.split('+')[0].replace(/ /g, '')] = row.split('[')[1].split(']')[0];
                    }
                }
                var newones = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].ipv6) {
                        results[i].ipv6 = results[i].address;
                        results[i].port = parseInt(results[i].port);
                        for (var r = 0; r < results.length; r++) {
                            if (results[r].ipv4 && results[r].hostname === results[i].hostname) {
                                results[i].ipv4 = results[r].address;
                                results[r].delete = true;
                            }
                        }
                    }
                }
                for (var i = 0; i < results.length; i++) {
                    var newobj = Object['assign']({}, results[i]);
                    if (newobj.delete) {
                    }
                    else {
                        delete newobj.address;
                        newones.push(newobj);
                    }
                }
                resolve(newones);
            }
        });
    });
}
exports.getHosts = getHosts;
function extractMacAddressFromScanLineArray(scanLineArray) {
    if (!scanLineArray || scanLineArray.length < 5 || !scanLineArray[4] || scanLineArray[4].length === 0) {
        return '';
    }
    var cleanedRawMacAddressCandidate = unescapeLabel(scanLineArray[4]).replace('[', '').replace(']', '').trim();
    var regex = /^[0-9a-f]{1,2}([.:-])[0-9a-f]{1,2}(?:\1[0-9a-f]{1,2}){4}$/g;
    var regexMatch = cleanedRawMacAddressCandidate.match(regex);
    if (regexMatch) {
        return regexMatch[0];
    }
    return '';
}
exports.extractMacAddressFromScanLineArray = extractMacAddressFromScanLineArray;
function getHostsUnresolved() {
    return new Promise(function (resolve, reject) {
        var results = [];
        (0, child_process_1.exec)('avahi-browse -a -t -p', function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                var result = stdout.split('\n');
                for (var i = 0; i < result.length; i++) {
                    var row = result[i].trim();
                    if (row.includes("+") && (row.includes("IPv4") || row.includes("IPv6"))) {
                        var words = row.split(';');
                        var hostnameLabel = unescapeLabel(words[3]);
                        var hostname = hostnameLabel.split(' ')[0];
                        var mac = extractMacAddressFromLabel(hostnameLabel);
                        if (row.includes("IPv4")) {
                            results.push({ interface: unescapeLabel(words[1]), ipv4: true, ipv6: false, hostname: hostname, mac: mac });
                        }
                        else if (row.includes("IPv6")) {
                            results.push({ interface: unescapeLabel(words[1]), ipv6: true, ipv4: false, hostname: hostname, mac: mac });
                        }
                    }
                    else if (row.includes("+")) {
                        results[results.length - 1][row.split('+')[0].replace(/ /g, '')] = row.split('[')[1].split(']')[0];
                    }
                }
                var newones = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].ipv6) {
                        results[i].ipv6 = results[i].address;
                        results[i].port = parseInt(results[i].port);
                        for (var r = 0; r < results.length; r++) {
                            if (results[r].ipv4 && results[r].hostname === results[i].hostname) {
                                results[i].ipv4 = results[r].address;
                                results[r].delete = true;
                            }
                        }
                    }
                }
                for (var i = 0; i < results.length; i++) {
                    var newobj = Object['assign']({}, results[i]);
                    if (newobj.delete) {
                    }
                    else {
                        delete newobj.address;
                        newones.push(newobj);
                    }
                }
                resolve(newones);
            }
        });
    });
}
exports.getHostsUnresolved = getHostsUnresolved;
function whereHostNameIsLike(name) {
    return new Promise(function (resolve, reject) {
        getHosts().then(function (hosts) {
            var hostlikes = [];
            for (var i = 0; i < hosts.length; i++) {
                if (hosts[i].hostname['includes'](name)) {
                    hostlikes.push(hosts[i]);
                }
            }
            resolve(hostlikes);
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.whereHostNameIsLike = whereHostNameIsLike;
function unescapeLabel(label) {
    return label.replace(/\\(\d{3})/g, function (match, decimal) {
        return String.fromCharCode(parseInt(decimal, 10));
    }).replace(/\\\\/g, '\'').replace(/\\./g, '.');
}
exports.unescapeLabel = unescapeLabel;
function extractMacAddressFromLabel(label) {
    var regex = /\[(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})\]/;
    var regexMatch = label.match(regex);
    if (regexMatch && regexMatch.length > 1) {
        return regexMatch[1].toLowerCase();
    }
    return '';
}
exports.extractMacAddressFromLabel = extractMacAddressFromLabel;
