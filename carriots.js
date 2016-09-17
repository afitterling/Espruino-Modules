/* 

this is a module to call the carriots iot api 

$http.defaultHeaders['carriots.apiKey'] = 'xxxxxxxxxxxxx';

sample post:

var samplePostReq={
  host: 'api.carriots.com',
  path: '/streams/',
  port: '80',
  protocol: "v1",
  checksum: "",
  device: "defaultDevice@afitterling.afitterling",
  at: "now",
  method:'POST',
  params: {a: 3}, // werden zu url params umgewandelt
  data: {a: 1}
};

$http(samplePostReq).then(function(data){
  // success
  console.log('success', data);
});


var sampleGetReq={
  host: 'api.carriots.com',
  path: '/streams/',
  port: '80',
  method: 'GET',
  params: {_t: 'str', device: 'Commander@afitterling.afitterling'}
};

$http(sampleGetReq).then(function(data){
  // success
  console.log('success', data);
});


$http(sampleGetReq).then(function(data){
  // success
  console.log('success', data);
  $http(samplePostReq).then(function(data){
    // success
    console.log('success', data);
  });
});

*/

var defaultHeaders = {'Content-Type': 'application/json'};
var debug   = false;

function _parseParams(params){
  if (!params) return '';
  var _paramsString=''; var separator;
  Object.keys(params).forEach(function(key,index) {
      if (index===0){separator='?'} else {separator='&'} 
      _paramsString = _paramsString + separator + key + '=' + params[key];
  });
  return _paramsString; 
}

function $http(config) {

  var content = null;
  var data    = null;
  
  var _safeJSONParse = function(data){
    return new Promise(function(resolve, reject){
        try { resolve(JSON.parse(data)) } catch(e){ reject(e) }
      });      
  };

  var httpOptions = {
    host: config.host,
    path: config.path + _parseParams(config.params),
    port: config.port,
    method: config.method,
    headers: $http.defaultHeaders
  };

  if (config.method==='GET' || config.method==='DELETE'){
    httpOptions.headers['Content-Length'] = 0;
  }

  if (config.method==='UPDATE' || config.method==='POST'){
    data = {};
    data.device = config.device;
    data.protocol = config.protocol;
    data.checksum = config.checksum || null;
    data.at = config.at;
    // the actual cariots request api data
    data.data = config.data;
    content = JSON.stringify(data);
    httpOptions.headers['Content-Length'] = content.length;
  }

  if (debug){
    console.log('httpOptions=', httpOptions, 'data=', data);  
  }
  
  return new Promise(function(resolve, reject){
    var req = require('http').request(httpOptions, function(res)  {
      var d = '';
      res.on('data', function(data) { d+= data; });
      res.on('error', function(e) {
        return reject(e)  
      });
      res.on('close', function() {
        _safeJSONParse(d).then(function(data){
          if (debug) console.log('resolve=', data);
          return resolve(data);    
        }, function(e){
          if (debug) console.log('reject=', e);
          return reject(e)  
        });        
      });
    }).end(content)
  });

}

$http.defaultHeaders = defaultHeaders;

$http.debug = function(val){
  debug = val;
};

exports = {
  defaultHeaders: defaultHeaders,
  http: $http
};
