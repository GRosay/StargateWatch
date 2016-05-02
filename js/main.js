/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadius, isAmbientMode;

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        'use strict';
        window.setTimeout(callback, 1000 / 60);
    };

function renderDots() {
    'use strict';

    var dx = 0,
        dy = 0,
        i = 1,
        angle = null;

    context.save();

    // Assigns the clock creation location in the middle of the canvas
    context.translate(canvas.width / 2, canvas.height / 2);

    // Assign the style of the number which will be applied to the clock plate
    context.beginPath();

    context.fillStyle = '#999999';

    
    context.closePath();

    // Render center dot
    context.beginPath();

    context.fillStyle = '#ff9000';
    context.strokeStyle = '#fff';
    context.lineWidth = 4;

    context.arc(0, 0, 7, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
    context.closePath();
}

function renderAmbientDots() {
    'use strict';

    var dx = 0,
        dy = 0,
        i = 1,
        angle = null;

    context.save();

    // Assigns the clock creation location in the middle of the canvas
    context.translate(canvas.width / 2, canvas.height / 2);

    // Render center dot
    context.beginPath();

    context.fillStyle = '#000000';
    context.strokeStyle = '#fff';
    context.lineWidth = 4;

    context.arc(0, 0, 7, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
    context.closePath();
}

function renderNeedle(angle, radius) {
    'use strict';
    context.save();
    context.rotate(angle);
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = '#fff';
    context.moveTo(6, 0);
    context.lineTo(radius, 0);
    context.closePath();
    context.stroke();
    context.closePath();
    context.restore();

}

function renderHourNeedle(hour) {
    'use strict';

    var angle = null,
        radius = null;

    angle = (hour - 3) * (Math.PI * 2) / 12;
    radius = clockRadius * 0.55;
    renderNeedle(angle, radius);
}

function renderMinuteNeedle(minute) {
    'use strict';

    var angle = null,
        radius = null;

    angle = (minute - 15) * (Math.PI * 2) / 60;
    radius = clockRadius * 0.75;
    renderNeedle(angle, radius);
}

function getDate() {
    'use strict';

    var date;
    try {
        date = tizen.time.getCurrentDateTime();
    } catch (err) {
        console.error('Error: ', err.message);
        date = new Date();
    }

    return date;
}

function watch() {
    'use strict';

    if (isAmbientMode === true) {
        return;
    }

    // Import the current time
    // noinspection JSUnusedAssignment
    var date = getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        hour = hours + minutes / 60,
        minute = minutes + seconds / 60,
        nextMove = 1000 - date.getMilliseconds();

    // Erase the previous time
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    renderDots();
    renderHourNeedle(hour);
    renderMinuteNeedle(minute);

    context.restore();
    
  
    setTimeout(function() {
        window.requestAnimationFrame(watch);
    }, nextMove);
}

function ambientWatch() {
    'use strict';

    // Import the current time
    // noinspection JSUnusedAssignment
    var date = getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        hour = hours + minutes / 60,
        minute = minutes + seconds / 60;

    // Erase the previous time
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    renderAmbientDots();
    renderHourNeedle(hour);
    renderMinuteNeedle(minute);

    context.restore();
}

window.onload = function onLoad() {
    'use strict';

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    clockRadius = document.body.clientWidth / 2;

    // Assigns the area that will use Canvas
    canvas.width = document.body.clientWidth;
    canvas.height = canvas.width;

    // add eventListener for tizenhwkey
    window.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === 'back') {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (err) {
                console.error('Error: ', err.message);
            }
        }
    });

    // add eventListener for timetick
    window.addEventListener('timetick', function() {
        console.log("timetick is called");
        ambientWatch();
    });

    // add eventListener for ambientmodechanged
    window.addEventListener('ambientmodechanged', function(e) {
        console.log("ambientmodechanged : " + e.detail.ambientMode);
        if (e.detail.ambientMode === true) {
            // rendering ambient mode case
            isAmbientMode = true;
            ambientWatch();

        } else {
            // rendering normal case
            isAmbientMode = false;
            window.requestAnimationFrame(watch);
        }
    });

    // normal case
    isAmbientMode = false;
    window.requestAnimationFrame(watch);
};

$(document).ready(function(){
	  var count = 1;
	  var interval = 1000;

		function transition() {

		    if(count == 1) {
		        $('body').css('background-image', 'url(/img/stargate.jpg)');
		         count = 2;
		         interval = 1000;

		    } else if(count == 2) {
		        $('body').css('background-image', 'url(/img/stargate2.jpg)');
		         count = 1;
		         interval = 500;

		    } 

		}
		setInterval(transition, interval);

});