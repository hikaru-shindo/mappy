'use strict';

var googleapis = require('googleapis'),
    GoogleCalendarScheduler = require('./google_calendar_scheduler'),
    commands = require('mappy-commands'),
    config = require('app/config/calendar.json');

function run() {
    var jwt = new googleapis.auth.JWT(
        config.account.email,
        config.account.keyFile,
        null,
        ['https://www.googleapis.com/auth/calendar.readonly']
    );

    var calendar = googleapis.calendar({
        version: 'v3',
        auth: jwt
    });

    var googleCalendarScheduler = new GoogleCalendarScheduler(calendar, config.options);

    googleCalendarScheduler.on('event', function(ev) {
        commands.play(config.eventAudioFile);
        commands.say('Achtung, achtung, es findet nun statt');
        commands.say(ev.summary);
    });

    jwt.authorize(function() {
        googleCalendarScheduler.start();
    });
}

module.exports = {
    run: run
};
