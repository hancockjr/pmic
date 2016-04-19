///////////////////////////////////
// SegmentDisplay factory
///////////////////////////////////
function SegmentDisplayFactory(type) {
  var display = new SegmentDisplay('display-'+type);
  // common settings
  display.displayAngle    = 6;
  display.digitHeight     = 20;
  display.digitWidth      = 14;
  display.digitDistance   = 2.5;
  display.segmentWidth    = 2;
  display.segmentDistance = 0.3;
  display.colorOff        = '#000000';

  switch (type) {
    case 'clock':
      display.pattern         = ' #:##';
      display.segmentCount    = 7;
      display.cornerType      = 0;
      display.colorOn         = '#e95d0f';
      break;
    case 'out':
      display.pattern         = '###';
      display.segmentCount    = 14;
      display.cornerType      = 3;
      display.colorOn         = '#ff2c0f';
      display.setValue('OUT');
      break;
    case 'in':
      display.pattern         = '###';
      display.segmentCount    = 14;
      display.cornerType      = 3;
      display.colorOn         = '#24dd22';
      display.setValue('IN ');
      break;
    default:
      break;
  }
  display.draw();
  return display;
}

///////////////////////////////////
// clock
///////////////////////////////////
function Clock(minutes, seconds) {
  this.display = SegmentDisplayFactory('clock');
  this.initialMinutes = minutes;
  this.initialSeconds = seconds;
  this.minutes = this.initialMinutes;
  this.seconds = this.initialSeconds;
  this.paused = true;
  this.started = false;
}

Clock.prototype.Animate = function() {
  var value =
    ((this.minutes < 10) ? '0' : '') + this.minutes + ':' +
    ((this.seconds < 10) ? '0' : '') + this.seconds;
  this.display.setValue(value);
  window.setTimeout('clock.Animate()', 100);
}

Clock.prototype.SetMinutes = function(minutes) { this.minutes = minutes; }
Clock.prototype.SetSeconds = function(seconds) { this.seconds = seconds; }
Clock.prototype.SoundAlarm = function() {
  var audio = new Audio('sounds/airhorn.mp3');
  audio.play();
}

Clock.prototype.Rewind = function() {
  this.Pause();
  this.minutes = this.initialMinutes;
  this.seconds = this.initialSeconds;
}

Clock.prototype.Start = function() {
alert('clock.Start');
  this.Rewind();
  this.Animate();
}

Clock.prototype.Decrement = function(granularity) {
  if (this.seconds == 0) {
    if (this.minutes == 0) {
      this.paused = true;
    } else {
      this.minutes--;
      this.seconds = 60 - granularity;
    }
  } else if (this.seconds < granularity) {
    if (this.minutes == 0) {
      this.seconds = 0;
      this.paused = true;
    } else { // minutes != 0
      this.minutes--;
      this.seconds = 60 - (granularity - this.seconds);
    }
  } else { // seconds >= granularity
    this.seconds = this.seconds - granularity;
  }
}

Clock.prototype.Resume = function() {
  if (!this.paused) {
    this.Decrement(1);
    for (i=0; i<Players().length; i++) {
      Players()[i].time.Increment(1);
    }
  }

  if (!this.paused) {
    if (this.minutes == 0 && this.seconds == 0)
      this.SoundAlarm();
  }

  if (!this.paused) {
    window.setTimeout('clock.Resume()', 1000);
  }
}

Clock.prototype.Pause = function() {
  if (!this.paused) {
    document.getElementById('game-pause-play').setAttribute('src','img/icons8/Play-64.png');
    document.getElementById('game-pause-play').setAttribute('onclick','clock.Play()');
    this.paused = true;
  }
}

Clock.prototype.Play = function() {
  if (this.paused) {
    document.getElementById('game-pause-play').setAttribute('src','img/icons8/Pause-64.png');
    document.getElementById('game-pause-play').setAttribute('onclick','clock.Pause()');
    this.paused = false;
    this.Resume();
  }
}

Clock.prototype.FastFwd = function() {
  this.Decrement(10);
}

var clock = new Clock(5,0);
clock.Animate();

///////////////////////////////////
// player time log
///////////////////////////////////
