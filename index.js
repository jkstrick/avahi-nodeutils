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
                        if (row.includes("IPv4")) {
                            results.push({ interface: words[1], ipv4: true, ipv6: false, mac: words[4].replace('[', '').replace(']', '') });
                        }
                        else if (row.includes("IPv6")) {
                            results.push({ interface: words[1], ipv6: true, ipv4: false, mac: words[4].replace('[', '').replace(']', '') });
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

    const cleanedRawMacAddressCandidate = scanLineArray[4].replace('[', '').replace(']', '').trim();    
    const regex = /^[0-9a-f]{1,2}([.:-])[0-9a-f]{1,2}(?:\1[0-9a-f]{1,2}){4}$/g;
    const regexMatch = cleanedRawMacAddressCandidate.match(regex);

    if (regexMatch) {
        return regexMatch[0];
    }

    return '';
}
exports.extractMacAddressFromScanLineArray = extractMacAddressFromScanLineArray;

function getHostsUnresolved() {
    return new Promise(function (resolve, reject) {
        var results = [];
        child_process_1.exec('avahi-browse -a -t', function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                var result = stdout.split('\n');
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    if (row.includes("+") && (row.includes("IPv4") || row.includes("IPv6"))) {
                        var words = row.split(' ');
                        if (row.includes("IPv4")) {
                            results.push({ interface: words[1], ipv4: true, ipv6: false, hostname: words[3], mac: extractMacAddressFromScanLineArray(words) });
                        }
                        else if (row.includes("IPv6")) {
                            results.push({ interface: words[1], ipv6: true, ipv4: false, hostname: words[3], mac: extractMacAddressFromScanLineArray(words) });
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

//# sourceMappingURL=data:application/json;base64,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Q0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNCLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUN0RyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFBO2dCQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDdEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTt3QkFDcEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUUzQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFFdEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dDQUdqRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7Z0NBQ3BDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBOzRCQUc1QixDQUFDO3dCQUNMLENBQUM7b0JBR0wsQ0FBQztnQkFDTCxDQUFDO2dCQUVELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN0QyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUc3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUE7d0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBRXhCLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDcEIsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7QUFFTixDQUFDO0FBN0RlLGdCQUFRLFdBNkR2QixDQUFBO0FBQ0QsNkJBQW9DLElBQVk7SUFDNUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFlLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFFN0MsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSztZQUNsQixJQUFNLFNBQVMsR0FBaUIsRUFBRSxDQUFBO1lBRWxDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDNUIsQ0FBQztZQUNMLENBQUM7WUFDRCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDdEIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRztZQUNULE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNmLENBQUMsQ0FBQyxDQUFBO0lBRU4sQ0FBQyxDQUFDLENBQUE7QUFFTixDQUFDO0FBbEJlLDJCQUFtQixzQkFrQmxDLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBQcm9taXNlIGZyb20gXCJibHVlYmlyZFwiO1xuXG5pbXBvcnQgeyBleGVjIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIlxuXG5cblxuaW50ZXJmYWNlIElBdmFoaUhvc3Qge1xuICAgIGludGVyZmFjZTogc3RyaW5nO1xuICAgIGlwdjY/OiBzdHJpbmc7XG4gICAgaXB2ND86IHN0cmluZztcbiAgICBob3N0bmFtZTogc3RyaW5nO1xuICAgIHBvcnQ6IG51bWJlcjtcbiAgICB0eHQ6IHN0cmluZztcbiAgICBtYWM6IHN0cmluZztcblxufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEhvc3RuYW1lKGhvc3RuYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBleGVjKCdhdmFoaS1zZXQtaG9zdC1uYW1lICcgKyBob3N0bmFtZSwgKGVyciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdHMoKTogUHJvbWlzZTxJQXZhaGlIb3N0W10+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8SUF2YWhpSG9zdFtdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXVxuICAgICAgICBleGVjKCdhdmFoaS1icm93c2UgLWEgLXIgLXQnLCAoZXJyLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0ZG91dC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3c6IGFueSA9IHJlc3VsdFtpXVxuICAgICAgICAgICAgICAgICAgICBpZiAocm93LmluY2x1ZGVzKFwiPVwiKSAmJiAocm93LmluY2x1ZGVzKFwiSVB2NFwiKSB8fCByb3cuaW5jbHVkZXMoXCJJUHY2XCIpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29yZHMgPSByb3cuc3BsaXQoJyAnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93LmluY2x1ZGVzKFwiSVB2NFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7IGludGVyZmFjZTogd29yZHNbMV0sIGlwdjQ6IHRydWUsIGlwdjY6IGZhbHNlLCBtYWM6d29yZHNbNF0ucmVwbGFjZSgnWycsJycpLnJlcGxhY2UoJ10nLCcnKSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuaW5jbHVkZXMoXCJJUHY2XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHsgaW50ZXJmYWNlOiB3b3Jkc1sxXSwgaXB2NjogdHJ1ZSwgaXB2NDogZmFsc2UsIG1hYzp3b3Jkc1s0XS5yZXBsYWNlKCdbJywnJykucmVwbGFjZSgnXScsJycpIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm93LmluY2x1ZGVzKFwiPVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aCAtIDFdW3Jvdy5zcGxpdCgnPScpWzBdLnJlcGxhY2UoLyAvZywgJycpXSA9IHJvdy5zcGxpdCgnWycpWzFdLnNwbGl0KCddJylbMF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdvbmVzID0gW11cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbaV0uaXB2Nikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tpXS5pcHY2ID0gcmVzdWx0c1tpXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2ldLnBvcnQgPSBwYXJzZUludChyZXN1bHRzW2ldLnBvcnQpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcmVzdWx0cy5sZW5ndGg7IHIrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbcl0uaXB2NCAmJiByZXN1bHRzW3JdLmhvc3RuYW1lID09PSByZXN1bHRzW2ldLmhvc3RuYW1lKSB7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2ldLmlwdjQgPSByZXN1bHRzW3JdLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tyXS5kZWxldGUgPSB0cnVlXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld29iaiA9IE9iamVjdFsnYXNzaWduJ10oe30sIHJlc3VsdHNbaV0pXG5cblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3b2JqLmRlbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5ld29iai5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdvbmVzLnB1c2gobmV3b2JqKVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXdvbmVzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxufVxuZXhwb3J0IGZ1bmN0aW9uIHdoZXJlSG9zdE5hbWVJc0xpa2UobmFtZTogc3RyaW5nKTogUHJvbWlzZTxJQXZhaGlIb3N0W10+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8SUF2YWhpSG9zdFtdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgZ2V0SG9zdHMoKS50aGVuKChob3N0cykgPT4geyBcbiAgICAgICAgICAgIGNvbnN0IGhvc3RsaWtlczogSUF2YWhpSG9zdFtdID0gW11cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBob3N0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChob3N0c1tpXS5ob3N0bmFtZVsnaW5jbHVkZXMnXShuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBob3N0bGlrZXMucHVzaChob3N0c1tpXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKGhvc3RsaWtlcylcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfSlcblxuICAgIH0pXG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
