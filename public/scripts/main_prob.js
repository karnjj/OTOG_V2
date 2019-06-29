$(document).ready(function(){
  var prob = <%-JSON.stringify(problems)%>;
 	var tr;
  var sz = prob.length;
 	for(var i = 1; i <= sz; i++){
    tr = $("<tr/>");
  	var id = prob[i].id_Prob;
  	var name = prob[i].name;
		var sname = prob[i].sname;
  	 var time = prob[i].time;
  	 var mem = prob[i].memory;
  	 var rating = prob[i].rating;
  	 var pass = prob[i].pass;
  	 var path = "problems/docs/" + sname;
  	 tr.append("<td>" + id + "</td>");
  	 tr.append("<td>" + "<a class = 'otogtxt' href =" + path + ">" + name + "<br>"
  	 + "(" + time + " วินาที, " + mem + " MB" + ")" + "</a>" + "</td>");
  	 tr.append("<td>" + rating + "</td>");
  	 tr.append("<td>" + pass + "</td>");
  	 $("#body").append(tr);
  }
});