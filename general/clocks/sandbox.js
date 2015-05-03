/**
 * File used for sandbox JavaScript stuff.
 */
window.onload = function() {
    var clockDiv = document.querySelector("#clock-test"),
        clock = new Clock(clockDiv, 200);

    var future = new Date();
    future.setTime(future.getTime() + 50000);

    clock.setAlarm(future);
    clock.start();
};