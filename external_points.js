/*
    SKIDATA Loyalty - external points awarding script

    parameters in {} will be replaced for the caller

    parameters are:
    1. portalid
    2. contentidentifier
    3. region
    4. alwaysdebug
    5. instance
*/

var isDebug = isInDebug();

if (isDebug) {
    console.log("SKIDATA Loyalty external points script loaded.");
}

var http = new XMLHttpRequest();
var url = 'https://apistage.skidataus.com/point/83/v1/externalpoints/getmatchingcontent?contentkey=' + location.pathname;

console.log(url);

http.open('GET', url, true);
http.withCredentials = true;
http.setRequestHeader('x-api-key', ''); // TODO: what to do about APIKey? global? Need one for reach region
var pa = http.send();
var asd = pa.first()
setTimeout(award, asd.timeToAward);

function award() {
    var http = new XMLHttpRequest();
    var url = 'api.skidataus.com/56/v1/externalpoints';
    var params = 'contentkey=' + document.title;
    http.open('POST', url, true);
    http.withCredentials = true;
    http.setRequestHeader('x-api-key', '');
    http.send(params);
}

function isInDebug() {
    if (alwaysDebug) {
        return true;
    }
}