  	$(document).ready(function(){
  		$("#nav").load("submission/head_prob");
  		var res = <%-JSON.stringify(submission)%>;
  		var tr;
  		var sz = res.length;
  		for(var i = 0; i < sz; i++){
  			tr = $("<tr/>");
  			var id = res[i].idResult;
  			var pname = res[i].name;
				var sname = res[i].sname;
				var result = res[i].result;
  			var time = res[i].timeuse;
  			var score = res[i].score;
  			var rating = res[i].rating;
  			//var pass = res[i].pass;
        //if(pass_state[id] == 1) tr.addClass("item table-success");
        //else if(pass_state[id] == 0) tr.addClass("item table-danger");
  			tr.append("<td>" + id + "</td>");
  			if(rating >= 2000)
  				tr.append("<td class='grandmaster'>" + sname + "</td>");
  			else if(rating >= 1800)
  				tr.append("<td class='master'>" + sname + "</td>");
  			else
  				tr.append("<td class='regular'>" + sname + "</td>");
  			tr.append("<td>" + pname + "</td>");
  			tr.append("<td>" + result + "</td>");
  			tr.append("<td>" + time + " วินาที" + "</td>");
  			tr.append("<td>" + score + "</td>");
  			$("#body").append(tr);
  		}
  	});