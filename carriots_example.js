
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

var sampleGetReq={
  host: 'api.carriots.com',
  path: '/streams/',
  port: '80',
  protocol: "v1",
  checksum: "",
  device: "defaultDevice@afitterling.afitterling",
  at: "now",
  method: 'GET',
  params: {device: 'Commander@afitterling.afitterling'}
};

$http(sampleGetReq).then(function(data){
  // success
  $http(samplePostReq).then(function(data){
    // success
    console.log('success', data);
  });  
  
});

