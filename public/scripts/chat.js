var socket = io();
var messages = document.getElementById("messages");
var showname = "";
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
  //submit
  $("form").submit(function(e) {
    if(showname == undefined) showname = "Guest";
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading
    var data = {
      msg : $("#message").val(),
      user : showname
    }
    if(data.msg.length == 0) /*data.msg = "<br>"*/ return;
    socket.emit("chat message", data);

    let span = document.createElement("span");
    messages.appendChild(span).append(showname);
    li.setAttribute("title","Just now");
    messages.appendChild(li).append($("#message").val());

    $("#message").val("");
    var xH = messages.scrollHeight;
    messages.scrollTo(0, xH);
    return false;
  });
  //recieve messages
  socket.on("received", data => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    li.setAttribute("title", timeConverter(data.time));
    messages.appendChild(span).append(data.user);
    messages.appendChild(li).append(data.message);
    var xH = messages.scrollHeight; 
    messages.scrollTo(0, xH);
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
      showname = json.showname;
      json.chat.map(data => {
        if(data.msg.length) {//no display for empty string
          let li = document.createElement("li");
          let span = document.createElement("span");
          li.setAttribute("title", timeConverter(data.time));
          messages.appendChild(span).append(data.user);
          messages.appendChild(li).append(data.msg);
        }
      });
    });
})();

//onclick event -> scroll to bottom 
function scrollDown() {
  setTimeout(function() {
    var xH = messages.scrollHeight;
    messages.scrollTo(0, xH);
  }, 150);
}