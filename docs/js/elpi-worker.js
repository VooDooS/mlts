/**
 * Code for the Elpi Worker
 * - works in separate thread
 * - load mlts.js to work with elpi
 */

console.log('[Elpi-worker] ' + "Starting Elpi...");
importScripts('mlts.js');
console.log('[Elpi-worker] ' + "Elpi started");

var rep = { "type": "ready" };
postMessage(rep);


function sendLog(str) {
    var rep = { "type": "log", "text": str };
    postMessage(rep);
}

function sendLpl(code, defs) {
    var rep = { "type": "lplcode", "code": code, "defs": defs };
    postMessage(rep);
}

function sendVersion(str) {
    var rep = { "type": "version", "n": str };
    postMessage(rep);
}

onmessage = function (event) {
    var code = event.data;
    console.log('[Elpi-worker] ' + "Compiling code");
    var lplcode = compile(code);

    console.log(lplcode[2]);

    sendLpl(lplcode[1], lplcode[2]);

    if (lplcode[5] == 1) {
        console.log('[Elpi-worker] ' + "Querying run_all L.");
        var raw = run();
        console.log('[Elpi-worker] ' + "Returning answer.");
        var json = JSON.parse(raw);
        console.log(json);
        json.type = 'values';
        postMessage(json);

    }

    else {
        var res = JSON.parse("{}");
        res.type = 'error';
        res.line = lplcode[3];
        res.col = lplcode[4];
        postMessage(res);
    }

}
