// Fetch the data
function GetServerStatuses(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", "https://www.aldata.info/api/ServerStatus", true); // true for asynchronous 
    xmlHttp.send(null);
}

function DisplayStatus(status) {
    console.log(status.eventname + " " + status.server_region + status.server_identifier)

    // Create this element if it doesn't exist yet
    let uniqueId = status.server_region + status.server_identifier + status.eventname
    let elementContainer = $('#statusEntryContainer')
    if (!($('#' + uniqueId).length)) {
        let contents = $('#template').html();
        let copy = $('<div id="copy"></div>');
        copy.attr("id", uniqueId)
        elementContainer.append(copy.append(contents));

    }

    let element = $('#' + uniqueId)
    element.find("#serverRegion").text(status.server_region)
    element.find("#serverIdentifier").text(status.server_identifier)
    element.find("#eventName").text(status.eventname)

    if (status.live) {
        element.find("#live").text("Live!")
    }
    else {
        element.find("#live").text("")
    }

    element.find("#hp").text(status.hp)

    //if (status.spawn) {
    //    let spawnTime = new Date(status.spawn)
    //    element.find("#spawn").text(spawnTime.toTimeString().split(' ')[0])
    //}
}

function OnServerStatusResponse(statuses) {
    for (let status of statuses) {
        DisplayStatus(status)
    }
}

$(document).ready(function () {
    setInterval(function () {
        GetServerStatuses(OnServerStatusResponse)
    }, 500)
});

function time_format(d) {
    hours = format_two_digits(d.getHours());
    minutes = format_two_digits(d.getMinutes());
    seconds = format_two_digits(d.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
}

function format_two_digits(n) {
    return n < 10 ? '0' + n : n;
}