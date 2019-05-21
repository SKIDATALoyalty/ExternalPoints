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
const contentIdentifier = location.pathname;
const region = 'us';
const alwaysDebug = false;
const instance = 'stage';
const apiKey = '';

var baseUrl = '';

if (instance === 'stage') {
    baseUrl = 'https://apistage.skidata' + region + '.com';
} else {
    baseUrl = 'https://api.skidata' + region + '.com';
}

var isDebug = isInDebug(alwaysDebug);

if (isDebug) {
    console.log("SKIDATA Loyalty external points script loaded.");
}

var request = new XMLHttpRequest();
var url = baseUrl + '/point/' + portalId + '/v1/externalpointactivity/getmatchingcontent?contentIdentifier=' + contentIdentifier;
request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE) {
        matchingContentRequestReturned(this.responseText);
    }
};
request.open('GET', url, true);
request.withCredentials = true;
request.setRequestHeader('x-api-key', apiKey);
request.send();

function matchingContentRequestReturned(txtExternalPointActivities) {
    var externalPointActivities = JSON.parse(txtExternalPointActivities);
    var externalPointActivity = externalPointActivities[0];

    if (isDebug) {
        console.log("Made request to getmatchingcontent resulting matching External Point Activity:", externalPointActivity);
    }

    if (externalPointActivity) {
        setTimeout(award, (externalPointActivity.delaySeconds * 1000));
    }
}

function award() {
    console.log('award!');
    var request = new XMLHttpRequest();
    var url = baseUrl + '/point/' + portalId + '/v1/externalpointactivity/award?contentIdentifier=' + contentIdentifier;
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            awardRequestReturned(this.responseText);
        }
    };
    request.open('POST', url, true);
    request.withCredentials = true;
    request.setRequestHeader('x-api-key', apiKey);
    request.send();
}

function awardRequestReturned(statusCode, text) {
    if (isDebug) {
        if (statusCode === 200) {
            console.log('Made request to award endpoint resulting in success');
        } else {
            console.log('Made request to award endpoint resulting in failure:', text);
        }
    }
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
