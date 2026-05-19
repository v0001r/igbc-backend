  var total_carpet_area1 = 0;
  var total_carpet_area2 = 0;

for (let i = 1; i <= 3; i++) {
    $('.carpet_area' + i).on('keyup', function () {
        total_carpet_area1 = 0; // reset total each time

        for (let j = 1; j <= 3; j++) {
            let val = parseFloat($('.carpet_area' + j).val());
            if (!isNaN(val)) {
                total_carpet_area1 += val;
            }
        }

        $('#total_carpet_area1').val(total_carpet_area1);
    });
}

for (let i = 4; i <= 6; i++) {
    $('.carpet_area' + i).on('keyup', function () {
        total_carpet_area2 = 0; // reset total each time

        for (let j = 4; j <= 6; j++) {
            let val = parseFloat($('.carpet_area' + j).val());
            if (!isNaN(val)) {
                total_carpet_area2 += val;
            }
        }
        $('#total_carpet_area4').val(total_carpet_area2);
    });
}




    
    