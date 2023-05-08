const { faker } = require('@faker-js/faker');

var PROTO_PATH = __dirname + '/protos/heartcontrol.proto';

var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

var hello_proto = grpc.loadPackageDefinition(packageDefinition).heartbeat;

function main() {
  var target = 'localhost:50051';
  var client = new hello_proto.PersonHeart(target, grpc.credentials.createInsecure());

  const id = Math.round(Math.random() * 1000);
  const name = faker.name.fullName();

  let heartloop = setInterval(() => {
    client.heartbeat({ id, name }, function (err, response) {
      console.log('->', response.message);
    });
  }, 1000);


  let timeout = 5000 + Math.round(Math.random() * 20000);
  console.log('infarto em', timeout / 1000, 'segundos');

  setTimeout(() => {
    clearInterval(heartloop);
    client.heartattack({ id }, function (err, response) {
      console.log('->', response.message);
    });
  }, timeout);
}

main();
