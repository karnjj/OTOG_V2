var socket = io();
var messages = document.getElementById("messages");
function timeConverter(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours().toString();
  var min = a.getMinutes().toString();
  if(hour.length == 1) hour = '0' + hour;
  if(min.length == 1) min = '0' + min;
  var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min;
  return time;
}
(function() {
  $("form").submit(function(e) {
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#message").val());

    messages.appendChild(li).append($("#message").val());
    let span = document.createElement("span");
    messages.appendChild(span).append("by " + "Anonymous" + ": " + "just now");

    $("#message").val("");

    return false;
  });

  socket.on("received", data => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append("by " + "otog" + ": " + "just now");
    console.log("Hello bingo!");
  });
})();

// fetching initial chat messages from the database
(function() {
  fetch("/chat/history")
    .then(data => {
      return data.json();
    })
    .then(json => {
      console.log(json);
      json.map(data => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.msg);
        messages
          .appendChild(span)
          .append("by " + data.user + ": " + timeConverter(data.time));
      });
    });
})();


