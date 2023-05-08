const { Server } = require("socket.io");

const io = new Server(3000, { cors: { origin: "*" }  /* options */ });

io.on("connection", (socket) => {
  console.log('connection');
  socket.emit("persons", persons);
});



// GRPC
var PROTO_PATH = __dirname + '/protos/heartcontrol.proto';
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
var heart_proto = grpc.loadPackageDefinition(packageDefinition).heartbeat;


const persons = [];

function heartbeat(call, callback) {
  let person = persons.find(p => p.id == call.request.id);
  if (!person) {
    person = {
      id: call.request.id,
      name: call.request.name,
    }
    persons.push(person);
  }
  person.lastHeartbeat = new Date();
  callback(null, { message: `${person.name}, vc tem um bom coração :)` });

  console.log(persons);
  io.emit("person", person);
}

function heartattack(call, callback) {
  let person = persons.find(p => p.id == call.request.id);
  person.heartattack = true;
  callback(null, { message: `${person.name}, CHAMANDO A AMBULÂNCIA!! :O` });

  console.log(persons);
  io.emit("person", person);
}

function main() {
  var server = new grpc.Server();
  server.addService(heart_proto.PersonHeart.service, {
    heartbeat: heartbeat,
    heartattack: heartattack
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
