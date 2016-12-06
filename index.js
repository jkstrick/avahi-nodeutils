"use strict";
var Promise = require("bluebird");
var child_process_1 = require("child_process");
function setHostname(hostname) {
    return new Promise(function (resolve, reject) {
        child_process_1.exec('avahi-set-host-name ' + hostname, function (err, stdout, stderr) {
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
        child_process_1.exec('avahi-browse -a -r -t', function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                var result = stdout.split('\n');
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    if (row.includes("=") && (row.includes("IPv4") || row.includes("IPv6"))) {
                        var words = row.split(' ');
                        var device = words[1];
                        if (row.includes("IPv4")) {
                            results.push({ interface: device, ipv4: true, ipv6: false });
                        }
                        else if (row.includes("IPv6")) {
                            results.push({ interface: device, ipv6: true, ipv4: false });
                        }
                    }
                    else if (row.includes("=")) {
                        results[results.length - 1][row.split('=')[0].replace(/ /g, '')] = row.split('[')[1].split(']')[0];
                    }
                }
                var newones = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].ipv6) {
                        results[i].ipv6 = results[i].address;
                        for (var r = 0; r < results.length; r++) {
                            if (results[r].ipv4 && results[r].hostname === results[i].hostname) {
                                results[i].ipv4 = results[r].address;
                                results[r].delete = true;
                            }
                        }
                    }
                }
                for (var i = 0; i < results.length; i++) {
                    var newobj = Object.assign({}, results[i]);
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

//# sourceMappingURL=data:application/json;base64,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QUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUcxQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUE7d0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBRXhCLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDcEIsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7QUFFTixDQUFDO0FBM0RlLGdCQUFRLFdBMkR2QixDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUHJvbWlzZSBmcm9tIFwiYmx1ZWJpcmRcIjtcblxuaW1wb3J0IHsgZXhlYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEhvc3RuYW1lKGhvc3RuYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBleGVjKCdhdmFoaS1zZXQtaG9zdC1uYW1lICcgKyBob3N0bmFtZSwgKGVyciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdXG4gICAgICAgIGV4ZWMoJ2F2YWhpLWJyb3dzZSAtYSAtciAtdCcsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc3Rkb3V0LnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdzogYW55ID0gcmVzdWx0W2ldXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cuaW5jbHVkZXMoXCI9XCIpICYmIChyb3cuaW5jbHVkZXMoXCJJUHY0XCIpIHx8IHJvdy5pbmNsdWRlcyhcIklQdjZcIikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3b3JkcyA9IHJvdy5zcGxpdCgnICcpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGV2aWNlID0gd29yZHNbMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cuaW5jbHVkZXMoXCJJUHY0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHsgaW50ZXJmYWNlOiBkZXZpY2UsIGlwdjQ6IHRydWUsIGlwdjY6IGZhbHNlIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5pbmNsdWRlcyhcIklQdjZcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goeyBpbnRlcmZhY2U6IGRldmljZSwgaXB2NjogdHJ1ZSwgaXB2NDogZmFsc2UgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuaW5jbHVkZXMoXCI9XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoIC0gMV1bcm93LnNwbGl0KCc9JylbMF0ucmVwbGFjZSgvIC9nLCAnJyldID0gcm93LnNwbGl0KCdbJylbMV0uc3BsaXQoJ10nKVswXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld29uZXMgPSBbXVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1tpXS5pcHY2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2ldLmlwdjY9cmVzdWx0c1tpXS5hZGRyZXNzXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcmVzdWx0cy5sZW5ndGg7IHIrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbcl0uaXB2NCAmJiByZXN1bHRzW3JdLmhvc3RuYW1lID09PSByZXN1bHRzW2ldLmhvc3RuYW1lKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tpXS5pcHY0ID0gcmVzdWx0c1tyXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tyXS5kZWxldGUgPSB0cnVlXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgIFxuICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld29iaiA9IE9iamVjdC5hc3NpZ24oe30sIHJlc3VsdHNbaV0pXG5cblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3b2JqLmRlbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5ld29iai5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdvbmVzLnB1c2gobmV3b2JqKVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXdvbmVzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
