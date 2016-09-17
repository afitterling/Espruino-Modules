var _pin, _timeout, _noFlow, _enablePin;

var _series=[];

function _sample(){
  var _val = analogRead(_pin);
  //console.log(_val);
  _series.push(_val);
}

function setup(pin, enablePin){
  _pin = pin;
  _enablePin = enablePin;
}

function enable(mode){
  if (mode){
    digitalWrite(_enablePin, 0);
  } else {
    digitalWrite(_enablePin, 1);
  }
}

function run(){
  _timeout = setInterval(function(){
    _sample();
    if (_series.length>20){
      _series.shift();
    };
  }, 2000);
}

function stop(){
  clearInterval(_timeout)
}

function getAvg(){
  var avg=0;
  _series.map(function(val){
    if (val > 0) return val;
  }).reduce(function(pre, cur, idx){
    avg = (avg + cur) / 2;
  });
  return avg;
}

function calibrate(){
  _noFlow = getAvg();
  console.log('calibration:', _noFlow);
  return _noFlow;
}

function muchBigger(val){ return val *2;}

function getMax(){
  var max=0;
  _series.map(function(val){
    if (val > 0) return val;
  }).reduce(function(pre, cur){
    max = Math.max(max, cur);
  });
  return max;
}

function hasFlow(){
  return getAvg()>_noFlow * 2;
}

function getSeries(){
  return _series;
}

exports = {
	setup: setup,
  run: run,
  getMax: getMax,
  getAvg: getAvg,
  hasFlow: hasFlow,
  getSeries: getSeries,
  stop: stop,
  enable: enable,
  calibrate: calibrate
};

