  	$(document).ready(function(){
  		var all_user = <%-JSON.stringify(users)%>;
  		var tr;
  		var sz = all_user.length;
  		//alert(sz);
  		for(var i = 0; i < sz; i++){
  			tr = $("<tr/>");
        tr.addClass("item");
  			var name = all_user[i].sname;
  			var rating = all_user[i].rating;
  			var passed = all_user[i].passed;
  			tr.append("<td>" + (i+1) + "</td>");
  			if(rating >= 2000) 
  				tr.append("<td class='grandmaster'>" + name + "</td>");
  			else if(rating >= 1800)
  				tr.append("<td class='master'>" + name + "</td>");
  			else
  				tr.append("<td class='regular'>" + name + "</td>");
  			//$("tr").append("<td>" + name + "</td>");
  			tr.append("<td>" + rating + "</td>");
  			tr.append("<td>" + passed + "</td>");
  			$("#body").append(tr);
  		}
  	});