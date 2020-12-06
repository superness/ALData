function PostServerStatus()
{
	let statuses = Object.keys(parent.S).filter(k => is_object(parent.S[k])).map(e => 
	{
		parent.S[e].eventname = e
		parent.S[e].server_region = parent.server_region
		parent.S[e].server_identifier = parent.server_identifier

		return parent.S[e]
    })

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://aldata.info/api/serverstatuses", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(statuses));
}

// GetServerStatuses(s => { show_json(s) });
// GetServerStatuses(s => { 
// 	let liveEvents = s.filter(e => true == e.live)

// 	for(let event of liveEvents)
// 	{
// 		let eventMsg = event.eventname + " live @ " + event.server_region + " " + event.server_identifier
// 		if(null != event.target)
// 		{
// 			eventMsg += " fighting " + event.target
// 		}
// 		game_log(eventMsg)
// 	}
// });
function GetServerStatuses(callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", "https://www.aldata.info/api/ServerStatus", true); // true for asynchronous 
    xmlHttp.send(null);
}

PostServerStatus()
setInterval(PostServerStatus, 1000 * 5) // post updates
