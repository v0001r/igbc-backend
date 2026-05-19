for (let i = 1; i <= 10; i++) {
    $('.carpet_area_non_ac' + i).on('keyup', function () {
        let carpet_area = parseFloat($('.carpet_area_non_ac' + i).val());
        let open_area =  $('.total_openable_area' + i).val();
        let percent = (open_area/carpet_area)*100;

        if(!percent || parseFloat(percent) === 0 || !isFinite(percent)){
            $('#percent_openable_area' + i).val(0);
        }else{
             $('#percent_openable_area' + i).val(Math.round(percent));
        }

        var mandatory = 0;
        var point1 = 0;
        var point2 = 0;

        if(carpet_area > 100){
            mandatory = 12;
        }else{
            mandatory = 8;
        }

        if(carpet_area > 100){
            point1 = 12;
        }else{
            point1 = 10;
        }

        if(carpet_area > 100){
            point2 = 14;
        }else{
            point2 = 12;
        }

        if(percent >= mandatory && percent > 0){
            $('.meets_mandatory' + i).val('TRUE');
        }else{
            $('.meets_mandatory' + i).val('FALSE');
        }

        

        if(percent >= point1 && percent > 0){
            $('.meets_point_one' + i).val('TRUE');
        }else{
            $('.meets_point_one' + i).val('FALSE');
        }

        if(percent >= point2 && percent > 0){
            $('.meets_point_two' + i).val('TRUE');
        }else{
            $('.meets_point_two' + i).val('FALSE');
        }

        if (!carpet_area || parseFloat(carpet_area) === 0) {
            $('.meets_point_two' + i).val('');
            $('.meets_point_one' + i).val('');
            $('.meets_mandatory' + i).val('');
        }

        calculate_non_ac();
    });

    

    $('.openable_window_area'+ i).on('keyup', function () {
        let door = parseFloat($('.openable_door_area' + i).val());
        let window = parseFloat($('.openable_window_area' + i).val());
        let total_area = door + window;

        $('.total_openable_area' + i).val(total_area.toFixed(2));
        
        let carpet_area = parseFloat($('.carpet_area_non_ac' + i).val());
        let percent = (total_area/carpet_area)*100;

        if(!percent || parseFloat(percent) === 0 || !isFinite(percent)){
            $('#percent_openable_area' + i).val(0);
        }else{
             $('#percent_openable_area' + i).val(Math.round(percent));
        }

        var mandatory = 0;
        var point1 = 0;
        var point2 = 0;

        if(carpet_area > 100){
            mandatory = 12;
        }else{
            mandatory = 8;
        }

        if(carpet_area > 100){
            point1 = 12;
        }else{
            point1 = 10;
        }

        if(carpet_area > 100){
            point2 = 14;
        }else{
            point2 = 12;
        }

        if(percent >= mandatory && percent > 0){
            $('.meets_mandatory' + i).val('TRUE');
        }else{
            $('.meets_mandatory' + i).val('FALSE');
        }

        if(percent >= point1 && percent > 0){
            $('.meets_point_one' + i).val('TRUE');
        }else{
            $('.meets_point_one' + i).val('FALSE');
        }

        if(percent >= point2 && percent > 0){
            $('.meets_point_two' + i).val('TRUE');
        }else{
            $('.meets_point_two' + i).val('FALSE');
        }

        if (!carpet_area || parseFloat(carpet_area) === 0) {
            $('.meets_point_two' + i).val('');
            $('.meets_point_one' + i).val('');
            $('.meets_mandatory' + i).val('');
        }

        calculate_non_ac();
    });

    $('.openable_door_area' + i).on('keyup', function () {
        let door = parseFloat($('.openable_door_area' + i).val());
        let window = parseFloat($('.openable_window_area' + i).val());
        let total_area = door + window;

        $('.total_openable_area' + i).val(total_area.toFixed(2));
        
        let carpet_area = parseFloat($('.carpet_area_non_ac' + i).val());
        let percent = (total_area/carpet_area)*100;

        if(!percent || parseFloat(percent) === 0 || !isFinite(percent)){
            $('#percent_openable_area' + i).val(0);
        }else{
             $('#percent_openable_area' + i).val(Math.round(percent));
        }

        var mandatory = 0;
        var point1 = 0;
        var point2 = 0;

        if(carpet_area > 100){
            mandatory = 12;
        }else{
            mandatory = 8;
        }

        if(carpet_area > 100){
            point1 = 12;
        }else{
            point1 = 10;
        }

        if(carpet_area > 100){
            point2 = 14;
        }else{
            point2 = 12;
        }

        if(percent >= mandatory && percent > 0){
            $('.meets_mandatory' + i).val('TRUE');
        }else{
            $('.meets_mandatory' + i).val('FALSE');
        }

        if(percent >= point1 && percent > 0){
            $('.meets_point_one' + i).val('TRUE');
        }else{
            $('.meets_point_one' + i).val('FALSE');
        }
        
        if(percent >= point2 && percent > 0){
            $('.meets_point_two' + i).val('TRUE');
        }else{
            $('.meets_point_two' + i).val('FALSE');
        }

        if (!carpet_area || parseFloat(carpet_area) === 0) {
            $('.meets_point_two' + i).val('');
            $('.meets_point_one' + i).val('');
            $('.meets_mandatory' + i).val('');
        }

        calculate_non_ac();
    });
}

function calculate_non_ac(){
    let mandatoryChecked = true;
    let point1Checked = true;
    let point2Checked = true;

    $('.mandatory').each(function () {
        const val = $(this).val().toString().trim().toLowerCase();
        if (val !== 'true' && val != '') {
            mandatoryChecked = false;
            return false; // exit loop early
        }
    });

    $('.point_one').each(function () {
        const val = $(this).val().toString().trim().toLowerCase();
        if (val !== 'true' && val != '') {
            point1Checked = false;
            return false; // exit loop early
        }
    });

    $('.point_two').each(function () {
        const val = $(this).val().toString().trim().toLowerCase();
        if (val !== 'true' && val != '') {
            point2Checked = false;
            return false; // exit loop early
        }
    });

    if(mandatoryChecked){
        $('#meets_mandatory_all').val('TRUE');
    }else{
        $('#meets_mandatory_all').val('FALSE');
    }
    if(point1Checked){
        $('#meets_enhanced_one').val('TRUE');
    }else{
        $('#meets_enhanced_one').val('FALSE');
    }
    if(point2Checked){
        $('#meets_enhanced_two').val('TRUE');
    }else{
        $('#meets_enhanced_two').val('FALSE');
    }
}