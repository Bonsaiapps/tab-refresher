var idleTime = 0;
var waitSeconds = 300;
var minSeconds = 1;
var maxSeconds = 21600;
var cur_url = window.location.href;

$(document).ready(function () {
    var seconds = Math.floor((Math.random() * (maxSeconds - minSeconds)) + minSeconds);
    if(seconds == ''){
        seconds = 300;
    }

    chrome.storage.sync.get(cur_url, function(items) {
        if(Object.keys(items).length > 0) {
            var cur_seconds = items[cur_url]['seconds'];
            if (cur_seconds != '') {
                waitSeconds = cur_seconds;
            }
        }
        else{
            var obj= {};
            obj[cur_url] = JSON.stringify({'seconds': seconds, 'minSeconds': minSeconds, 'maxSeconds': maxSeconds});
            chrome.storage.sync.set(obj, function(){});
            waitSeconds = seconds;
        }

    	//Increment the idle time counter every 1 second.
    	var idleInterval = setInterval(timerIncrement, 1000); // 1 second
    });

});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > waitSeconds) {
        idleTime = 0;
        window.location.reload();
    }
}