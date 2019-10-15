/*
    SKIDATA Loyalty - External points awarding script
*/

const scriptElement = document.getElementById('skidata-loyalty-external-points-script-tag');

const portalId = scriptElement.getAttribute('portalid');
const contentIdentifier = scriptElement.getAttribute('content-identifier');
const region = scriptElement.getAttribute('region');
var alwaysDebug = false;
var instance = 'live';

var alwaysDebugAttr = scriptElement.getAttribute('always-debug');
if (alwaysDebugAttr) {
    alwaysDebug = alwaysDebugAttr;
}

var instanceAttr = scriptElement.getAttribute('instance');
if (instanceAttr) {
    instance = instanceAttr;
}

var apiKey = '';

switch (region) {
    case 'us':
        apiKey = 'CQfmTJZWD0mVmtElXR4euKEgdv8jAI675OqN8/kt/TA=';
        break;
}

var baseUrl = '';

if (instance === 'stage') {
    baseUrl = 'https://apistage.skidata' + region + '.com';
} else {
    baseUrl = 'https://api.skidata' + region + '.com';
}

var isDebug = isInDebug(alwaysDebug);

if (isDebug) {
    console.log('SKIDATA Loyalty: External points script loaded. PortalId: ' + portalId + ' content-identifier: ' + contentIdentifier + ' region: ' + region);
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
        if (externalPointActivity) {
            console.log('SKIDATA Loyalty: Made successful request to getmatchingcontent resulting matching External Point Activity:', externalPointActivity);
        } else {
            console.log('SKIDATA Loyalty: Unable to find matching External Point Activity');
        }
    }

    if (externalPointActivity) {
        setTimeout(award, (externalPointActivity.delaySeconds * 1000));
    }
}

function award() {
    var request = new XMLHttpRequest();
    var url = baseUrl + '/point/' + portalId + '/v1/externalpointactivity/award?contentIdentifier=' + contentIdentifier;
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            awardRequestReturned(this.status, this.responseText);
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
            console.log('SKIDATA Loyalty: Made request to award endpoint resulting in success', JSON.parse(text));
        } else {
            console.log('SKIDATA Loyalty: Made request to award endpoint resulting in failure:', JSON.parse(text));
        }
    }
}

function isInDebug(alwaysDebug) {
    if (alwaysDebug) {
        return true;
    }

    if (window.location.search.indexOf('lrsdebug=true') !== -1) {
        return true;
    }

    return false;
}
