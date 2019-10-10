'use strict';

console.log('main load');

var inputNumWorkers = document.getElementById('input-nworkers');
var inputMessage    = document.getElementById('input-message');

var workers       = {};
var workerUrl     = './js/worker.js';

var msgTable  = document.getElementById('message-container').getElementsByTagName('tbody')[0];
var resultDiv = document.getElementById('button-container');

function spawn() {
  console.time('forLoop');
  
  resetEverything();

  var numWorkers = inputNumWorkers.value || 2;

  for (var i = 0; i < numWorkers; i++) {
    var workerOptions = {'name': 'worker_' + i};

    // Worker constructor with name
    var worker = new Worker(workerUrl, workerOptions);

    // Initialize worker with an ID
    worker.postMessage({'id': i, 'msg': 'INIT'});

    // Event listener for worker messages
    worker.addEventListener(
      'message',
      function(event){
        appendMessageToTable(event.data.msg);
      },
      false
    );

    // Add worker to list
    workers['worker_' + i] = worker;

    // Append worker interaction button
    addButton(i);

    //Terminating the worker
    //worker.terminate();
  }
  
  resultDiv.style.display = 'block';

  console.timeEnd('forLoop');
}


function addButton(i) {
  var button = document.createElement("input");

  button.type   = 'button';
  button.value  = 'Send to worker_' + i;
  button.classList = ['btn'];
  button.onclick = function() {
    workers['worker_' + i].postMessage({'msg': inputMessage.value});
  };

  resultDiv.appendChild(button);
}

function appendMessageToTable(data) {
  var row = msgTable.insertRow(0);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);

  col1.innerHTML = new Date().toLocaleString();
  col2.innerHTML = data;
}

function resetEverything() {
  Object.keys(workers).forEach(function(key,index) {
    workers[key].terminate();
  });
  msgTable.innerHTML = "";
  resultDiv.innerHTML = "";
}
