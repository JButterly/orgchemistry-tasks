function ToFixed(number, digit) {
  if (number % 1 == 0) {
    return number;
  } else {
    return number.toFixed(digit);
  }
}

function focusOut(inputCell) {
  return inputCell.focusout(function() {
    inputCell.find(".count-M2").empty().append(function() {
      if (inputCell.find(".cell-M1 input").val() !== "") {
        return ToFixed((100 - inputCell.find(".cell-M1 input").val()), 2);
      }
    });
    inputCell.find(".count-m2").empty().append(function() {
      if (inputCell.find(".cell-m1 input").val() !== "") {
        return ToFixed((100 - inputCell.find(".cell-m1 input").val()), 2);
      }
    });
  });
}

$( document ).ready(function() {
  focusOut($(".data-row"));

  $("button.build-table").click(function() {
    if ($(".params-table .data-row").length < $(".input-n").val()) {
      while ($(".params-table .data-row").length < $(".input-n").val()) {
        var tr = $(".params-table .data-row:last-child").clone();
        tr.find("input").val('');
        tr.find(".count-M2").html('');
        tr.find(".count-m2").html('');
        $(".params-table tbody").append(focusOut(tr));
      };
    } else if (parseInt($(".input-n").val()) < 0) {
      return false;
    } else {
      while ($(".params-table .data-row").length > $(".input-n").val()) {
        $(".params-table .data-row:last-child").remove();
      };
    }
  });

  $("button.count-constants").click(function() {
    var x = [];
    var k = [];
    var div_M1M2, div_m1m2, r1, r2, delta_r1, delta_r2;
    var A1 = 0;
    var A2 = 0;
    var C1 = 0;
    var C2 = 0;
    var sum_delta_i = 0;
    $(".data-row").each(function() {
      div_M1M2 = $( this ).find($(".cell-M1 input")).val()/$( this ).find($(".count-M2")).html();
      div_m1m2 = $( this ).find($(".cell-m1 input")).val()/$( this ).find($(".count-m2")).html();
      x.push(div_M1M2);
      k.push(div_m1m2*(1/div_M1M2));
      A1 += div_M1M2/(div_m1m2*(1/div_M1M2));
      A2 += (div_m1m2*(1/div_M1M2))/div_M1M2;
      C1 += div_M1M2 - (1/(div_m1m2*(1/div_M1M2)));
      C2 += (1/div_M1M2) - (div_m1m2*(1/div_M1M2));
    });

    r1 = (A2*C1 + $(".input-n").val()*C2)/(A1*A2 - Math.pow($(".input-n").val(), 2));
    r2 = (A1*C2 + $(".input-n").val()*C1)/(A1*A2 - Math.pow($(".input-n").val(), 2));

    for (var i = 0; i < $(".input-n").val(); i++) {
      var delta_i = (r1*Math.sqrt(x[i]/k[i]) - r2*Math.sqrt(k[i]/x[i]) - Math.sqrt(k[i]*x[i]) + 1/Math.sqrt(k[i]*x[i]));
      sum_delta_i += Math.pow(delta_i, 2);
    };

    delta_r1 = ((sum_delta_i/($(".input-n").val() - 2))*A2)/(A1*A2 - Math.pow($(".input-n").val(), 2));
    delta_r2 = ((sum_delta_i/($(".input-n").val() - 2))*A1)/(A1*A2 - Math.pow($(".input-n").val(), 2));

    $(".result-r1").empty().append(ToFixed(r1, 5) + " &plusmn; " + ToFixed(Math.sqrt(delta_r1), 5));
    $(".result-r2").empty().append(ToFixed(r2, 5) + " &plusmn; " + ToFixed(Math.sqrt(delta_r2), 5));
  });
});
