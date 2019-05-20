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
const portalId = 83; //{portalid};
const contentIdentifier = 'external-points'; //location.pathname;
const region = 'us';
const alwaysDebug = false;
const instance = 'stage';
const apiKey = ''; 

var baseUrl = '';

if (instance === 'stage') {
    baseUrl = 'https://apistage.skidata' + region + '.com'
} else {
    baseUrl = 'https://api.skidata' + region + '.com'
}

var isDebug = isInDebug(alwaysDebug);

if (isDebug) {
    console.log("SKIDATA Loyalty external points script loaded.");
}

var http = new XMLHttpRequest();
var url = baseUrl + '/point/' + portalId + '/v1/externalpointactivity/getmatchingcontent?contentkey=' + contentIdentifier;

http.open('GET', url, true);
http.withCredentials = true;
http.setRequestHeader('x-api-key', apiKey);
var externalPointActivities = http.send();
var externalPointActivity = externalPointActivities[0];

if (isDebug) {
    console.log("Made request to getmatchingcontent resulting matching External Point Activity:", externalPointActivity);
}

if (externalPointActivity) {
    setTimeout(award, externalPointActivity.timeToAward);
}

function award() {
    var http = new XMLHttpRequest();
    var url = 'api.skidataus.com/56/v1/externalpointactivity';
    var params = 'contentkey=' + document.title;
    http.open('POST', url, true);
    http.withCredentials = true;
    http.setRequestHeader('x-api-key', apikey);
    http.send(params);
}

function isInDebug(alwaysDebug) {
    if (alwaysDebug) {
        return true;
    }

    if (window.location.search.includes('lrsdebug=true')) {
        return true;
    }

    return false;
}
