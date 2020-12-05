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
    //console.log(status.eventname + " " + status.server_region + status.server_identifier)

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
        //element.find("#live").text("Live!")
        //element.find("#hp").text(status.hp + " HP")
    }
    else {
        element.find("#live").text("")
        element.find("#hp").text("")
    }

    if (null != status.target) {
        element.find("#target").text(status.target)
    }
    else {
        element.find("#target").text("")
    }


    if (status.spawn) {
        let spawnTime = new Date(status.spawn + "Z") // The service seems to be dropping the "Z" (UTC) marker
        let timeToSpawn = timeBetween(spawnTime, new Date(Date.now()))
        let spawnTimerStr = timeToSpawn.seconds + "s"

        if (timeToSpawn.minutes > 0) {
            spawnTimerStr = timeToSpawn.minutes + "m " + spawnTimerStr
        }
        if (timeToSpawn.hours > 0) {
            spawnTimerStr = timeToSpawn.hours + "h " + spawnTimerStr
        }

        element.find("#spawn").text(spawnTimerStr)
    }
    else {
        //element.find("#spawn").text("")
        element.find("#spawn").text(status.hp + " HP")
    }
}

function OnServerStatusResponse(statuses) {
    // Group statuses by server
    let serverOrder = ["EUI", "EUII", "EUPVP", "USI", "USII", "USIII", "USPVP", "ASIAI"]
    let orderedStatuses = []

    for (let serverName of serverOrder) {
        for (let status of statuses) {
            if (status.server_region + status.server_identifier == serverName) {
                orderedStatuses.push(status)
            }
        }
    }

    // Arrange them in order they appear in game
    for (let status of orderedStatuses) {
        DisplayStatus(status)
    }
}

$(document).ready(function () {
    setInterval(function () {
        GetServerStatuses(OnServerStatusResponse)
    }, 1000)
});

function time_format(d) {
    hours = format_two_digits(d.getHours());
    minutes = format_two_digits(d.getMinutes());
    seconds = format_two_digits(d.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
}

function timeBetween(start, end) { // this ignores months
    var obj = {};
    obj._milliseconds = (start).valueOf() - end.valueOf();
    obj.milliseconds = obj._milliseconds % 1000;
    obj._seconds = (obj._milliseconds - obj.milliseconds) / 1000;
    obj.seconds = obj._seconds % 60;
    obj._minutes = (obj._seconds - obj.seconds) / 60;
    obj.minutes = obj._minutes % 60;
    obj._hours = (obj._minutes - obj.minutes) / 60;
    obj.hours = obj._hours % 24;
    obj._days = (obj._hours - obj.hours) / 24;
    obj.days = obj._days % 365;
    // finally
    obj.years = (obj._days - obj.days) / 365;
    return obj;
}

function format_two_digits(n) {
    return n < 10 ? '0' + n : n;
}