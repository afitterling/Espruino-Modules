var cyclesIO = [A7, B1];
var cyclesStates = [0, 0];

var Pump = function(val){ digitalWrite(B10, !val); };

function _PumpOnOrOffIfNoCycleActive(){
  var anyCycleActive = cyclesStates.some(function(state){
    return state === 1;
  });
  if (anyCycleActive) {
    console.log('pump on');
    Pump(1);
    return;
  }

  console.log('pump off');
  Pump(0);
}

var Cycle = function(cnum, val){
  if (cnum===0) {
    console.error('no cycle 0');
    return;
  }
  digitalWrite(cyclesIO[cnum-1], !val);
  cyclesStates[cnum-1]=val;
  _PumpOnOrOffIfNoCycleActive();
};


exports = {
	Cycle: Cycle
};
