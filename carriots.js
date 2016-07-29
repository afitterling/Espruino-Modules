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

  var content=null;
  var data = null;

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
    console.log('update/post');
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

  console.log(httpOptions, data);

  var p = new Promise(function(resolve, reject){
    var req = require('http').request(httpOptions, function(res)  {
      var d = '';
      res.on('data', function(data) { d+= data; });
      res.on('error', function() {
        reject(JSON.parse(d));
      });
      res.on('close', function() {
        resolve(JSON.parse(d));
      });
    }).end(content)
  });

  return p;
  
}

$http.defaultHeaders = defaultHeaders;

exports = {
  defaultHeaders: defaultHeaders,
  http: $http
};
