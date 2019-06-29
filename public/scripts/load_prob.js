  	$(document).ready(function(){
      $("#submit_modal").hide();
  		var prob = <%-JSON.stringify(problems)%>;
			var is_login = "<%= is_login %>";
  		var tr;
  		var sz = prob.length;
  		//alert(sz);
  		for(var i = 1; i <= sz; i++){
  			tr = $("<tr/>");
        tr.addClass("item");
  			var id = prob[i].id_Prob;
  			var name = prob[i].name;
				var sname = prob[i].sname;
  			var time = prob[i].time;
  			var mem = prob[i].memory;
  			//var rating = prob[i].rating;
  			var pass = prob[i].pass;
        //if(pass_state[id] == 1) tr.addClass("item table-success");
        //else if(pass_state[id] == 2) tr.addClass("item table-danger");
  			var path = "problems/docs/" + sname;
        var param = '"' + "show_submit(" + i + ")" + '"';
  			tr.append("<td>" + id + "</td>");
  			tr.append("<td>" + "<a class = 'otogtxt' href =" + path + ">" + name + "<br>"
  			+ "(" + time + " วินาที, " + mem + " MB" + ")" + "</a>" + "</td>");
  			tr.append("<td>" + "1500" + "</td>");
  			tr.append("<td>" + pass + "</td>");
  			if(is_login == "1") tr.append("<td>" +  "<button class='btn otogbtn' onclick=" + param +
        "data-toggle = 'modal' data-target='#submit_modal'>Submit</button>" + "</td>");
  			$("#body").append(tr);
  		}
  	});