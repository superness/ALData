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

function TrimEmptyServerSections() {
    // If any active or engaged server sections are empty then remove them
    let serverOrder = ["EUI", "EUII", "EUPVP", "USI", "USII", "USIII", "USPVP", "ASIAI"]

    for (serverId of serverOrder) {
        if ($('#' + serverId + "engaged").find('#eventInfoContainer').children().length == 0) {
            $('#' + serverId + "engaged").remove()
        }
        if ($('#' + serverId + "active").find('#eventInfoContainer').children().length == 0) {
            $('#' + serverId + "active").remove()
        }
    }
}

function DisplayEngagedStatus(status) {

    // Create the server container if it does not exist yet
    let uniqueId = status.server_region + status.server_identifier + "engaged"
    let serversContainer = $('#engagedEventsContainer')
    if (!($('#' + uniqueId).length)) {
        let contents = $('#eventServerTemplate').html();
        let copy = $('<div id="copy"></div>');
        copy.attr("id", uniqueId)
        serversContainer.append(copy.append(contents));
    }

    let serverElement = $('#' + uniqueId)
    serverElement.find("#serverName").text(status.server_region + " " + status.server_identifier)

    // Create the event element if it doesn't exist yet
    let uniqueEventId = status.server_region + status.server_identifier + status.eventname + "engaged"
    if (!($('#' + uniqueEventId).length)) {
        let contents = $('#engagedEventTemplate').html();
        let copy = $('<div id="copy"></div>');
        copy.attr("id", uniqueEventId)
        serverElement.find('#eventInfoContainer').append(copy.append(contents));
    }

    let eventElement = $('#' + uniqueEventId)

    let spawnTime = new Date(status.spawn + "Z") // The service seems to be dropping the "Z" (UTC) marker
    let timeToSpawn = timeBetween(spawnTime, new Date(Date.now()))
    let spawnTimerStr = timeToSpawn.seconds + "s"

    if (timeToSpawn.minutes > 0) {
        spawnTimerStr = timeToSpawn.minutes + "m " + spawnTimerStr
    }
    if (timeToSpawn.hours > 0) {
        spawnTimerStr = timeToSpawn.hours + "h " + spawnTimerStr
    }

    eventElement.find("#eventName").text(status.eventname + " vs " + status.target)
    eventElement.find("#bossInfo").text(status.hp.toLocaleString() + "/" + status.max_hp.toLocaleString())
    eventElement.find("#bossLocation").text(status.map + " " + Math.trunc(status.x) + "," + Math.trunc(status.y))

    // If this element exists in another section then remove it
    let uniqueEventIdActive = status.server_region + status.server_identifier + status.eventname + "active"
    let uniqueEventIdUpcoming = status.server_region + status.server_identifier + status.eventname + "upcoming"
    $('#' + uniqueEventIdActive).remove()
    $('#' + uniqueEventIdUpcoming).remove()

    TrimEmptyServerSections()
}

function DisplayActiveStatus(status) {

    // Create the server container if it does not exist yet
    let uniqueId = status.server_region + status.server_identifier + "active"
    let serversContainer = $('#activeEventsContainer')
    if (!($('#' + uniqueId).length)) {
        let contents = $('#eventServerTemplate').html();
        let copy = $('<div id="copy"></div>');
        copy.attr("id", uniqueId)
        serversContainer.append(copy.append(contents));
    }

    let serverElement = $('#' + uniqueId)
    serverElement.find("#serverName").text(status.server_region + " " + status.server_identifier)

    // Create the event element if it doesn't exist yet
    let uniqueEventId = status.server_region + status.server_identifier + status.eventname + "active"
    if (!($('#' + uniqueEventId).length)) {
        let contents = $('#activeEventTemplate').html();
        let copy = $('<div id="copy"></div>');
        copy.attr("id", uniqueEventId)
        serverElement.find('#eventInfoContainer').append(copy.append(contents));
    }

    let eventElement = $('#' + uniqueEventId)

    eventElement.find("#eventName").text(status.eventname)
    eventElement.find("#bossInfo").text(status.hp.toLocaleString())
    eventElement.find("#bossLocation").text(status.map + " " + Math.trunc(status.x) + "," + Math.trunc(status.y))

    // If this element exists in another section then remove it
    let uniqueEventIdUpcoming = status.server_region + status.server_identifier + status.eventname + "upcoming"
    let uniqueEventIdEngaged = status.server_region + status.server_identifier + status.eventname + "engaged"
    $('#' + uniqueEventIdUpcoming).remove()
    $('#' + uniqueEventIdEngaged).remove()

    TrimEmptyServerSections()
}

function DisplayUpcomingStatus(status) {

    // Create the server container if it does not exist yet
    //let uniqueId = status.server_region + status.server_identifier + "upcoming"
    let serversContainer = $('#upcomingEventsContainer')
    //if (!($('#' + uniqueId).length)) {
    //    let contents = $('#eventServerTemplate').html();
    //    let copy = $('<div id="copy"></div>');
    //    copy.attr("id", uniqueId)
    //    serversContainer.append(copy.append(contents));
    //}

    //let serverElement = $('#' + uniqueId)
    //serverElement.find("#serverName").text(status.server_region + " " + status.server_identifier)

    // Create the event element if it doesn't exist yet
    let uniqueEventId = status.server_region + status.server_identifier + status.eventname + "upcoming"
    if (!($('#' + uniqueEventId).length)) {
        let contents = $('#upcomingEventTemplate').html();
        let copy = $('<div id="copy"></div>');
        copy.attr("id", uniqueEventId)
        serversContainer.append(copy.append(contents));
    }

    let eventElement = $('#' + uniqueEventId)

    let spawnTime = new Date(status.spawn + "Z") // The service seems to be dropping the "Z" (UTC) marker
    let timeToSpawn = timeBetween(spawnTime, new Date(Date.now()))
    let spawnTimerStr = timeToSpawn.seconds + "s"

    if (timeToSpawn.minutes > 0) {
        spawnTimerStr = timeToSpawn.minutes + "m " + spawnTimerStr
    }
    if (timeToSpawn.hours > 0) {
        spawnTimerStr = timeToSpawn.hours + "h " + spawnTimerStr
    }

    eventElement.find("#eventName").text(status.server_region + status.server_identifier + " " + status.eventname)
    eventElement.find("#bossInfo").text(spawnTimerStr)

    // If this element exists in another section then remove it
    let uniqueEventIdActive = status.server_region + status.server_identifier + status.eventname + "active"
    let uniqueEventIdEngaged = status.server_region + status.server_identifier + status.eventname + "engaged"
    $('#' + uniqueEventIdActive).remove()
    $('#' + uniqueEventIdEngaged).remove()

    TrimEmptyServerSections()
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

    for (let status of orderedStatuses.filter(s => s.live && null == s.target)) {
        DisplayActiveStatus(status)
    }

    for (let status of orderedStatuses.filter(s => s.live && null != s.target)) {
        DisplayEngagedStatus(status)
    }

    let timeOrderedStatuses = statuses.filter(s => !s.live).sort((a, b) => new Date(a.spawn) - new Date(b.spawn))
    for (let status of timeOrderedStatuses) {
        DisplayUpcomingStatus(status)
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