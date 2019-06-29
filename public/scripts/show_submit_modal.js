    function show_submit(id){
      //alert("It's (may) work !");
      var prob = <%-JSON.stringify(problems)%>;
      var pname = prob[id].name;
      //alert(pname);
      $("#prob_head").text(pname);
      $("#send_id").attr("value", prob[id].id_Prob);
    }