var maxSeconds = 21600;
var minSeconds = 1;
var cur_url = '';
var queryInfo = {
  active: true,
  currentWindow: true
 };

chrome.tabs.query(queryInfo, function(tabs) {
   var tab = tabs[0];
   cur_url = tab.url;
});

function save_options() {
    if (document.getElementById('range_start').value != '') {
        minSeconds = document.getElementById('range_start').value;
    }
    if (document.getElementById('range_end').value != '') {
        maxSeconds = document.getElementById('range_end').value;
    }

    var seconds = Math.floor((Math.random() * (maxSeconds - minSeconds)) + minSeconds);


    if(seconds == ''){
        seconds = 300;
    }

    var obj= {};

    obj[cur_url] = {"seconds": seconds, "minSeconds": minSeconds, "maxSeconds": maxSeconds};

    chrome.storage.sync.set(
        obj, function() {
                // Update status to let user know options were saved.
                var status = document.getElementById('form_status');
                status.textContent = 'Options saved.';
                var cur_seconds = document.getElementById('cur_refresh_value');
                cur_seconds.textContent = seconds;
                setTimeout(function() {
                    status.textContent = '';
                }, 750);
        }
    );
}

document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', save_options);
    }

    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        cur_url = tab.url;
    });

    if(cur_url == ''){
        var cur_min_value = document.getElementById('range_start');
        cur_min_value.value = minSeconds;

        var cur_max_value = document.getElementById('range_end');
        cur_max_value.value = maxSeconds;
    }
    else {
        chrome.storage.sync.get(cur_url, function (items) {
            if (Object.keys(items).length > 0) {
                var cur_seconds = items[cur_url]['seconds'];
                var cur_min = items[cur_url]['minSeconds'];
                var cur_max = items[cur_url]['maxSeconds'];

                if (cur_seconds != '') {
                    var cur_seconds_text = document.getElementById('cur_refresh_value');
                    cur_seconds_text.textContent = cur_seconds;
                }

                if (cur_min != '') {
                    var cur_min_value = document.getElementById('range_start');
                    cur_min_value.value = cur_min;
                }

                if (cur_max != '') {
                    var cur_max_value = document.getElementById('range_end');
                    cur_max_value.value = cur_max;
                }
            }
            else {
                var cur_min_value = document.getElementById('range_start');
                cur_min_value.value = minSeconds;

                var cur_max_value = document.getElementById('range_end');
                cur_max_value.value = maxSeconds;

            }
        });
    }
});