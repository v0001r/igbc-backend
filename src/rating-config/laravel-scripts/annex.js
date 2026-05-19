
$('.rainfall').keyup(function(e){
    var ek = $('.rainfall').map((_,el) => el.value).get()
    console.log(ek);
    let count = 0;
    var sum = ek.reduce((pv,cv)=>{
        if(cv >= 0 && cv != '') count +=1;
        return pv + (parseFloat(cv)||0);
     },0);

     let avg = sum/count;
     let c = $('#case').val();
    $('#average').val(avg.toFixed(2));
    change_case(c, avg);
    related_calculations();


});
   
$('.alternate').keyup(function(e){
    var ek = $('.alternate').map((_,el) => el.value).get()
    var sum = ek.reduce((pv,cv)=>{
        return pv + (parseFloat(cv)||0);
     },0);
     
     $('#total_alternate_water').val(sum.toFixed(2));
     let percent = (sum/consumption_daily_total)*100
    $('#alternative_water_usage').val(percent.toFixed(2));

});

$('.area').keyup(function(e){
    var ek = $('.imprevious_area').map((_,el) => el.value).get()
    console.log(ek);
    let count = 0;
    var sum = ek.reduce((pv,cv)=>{
        return pv + (parseFloat(cv)||0);
     },0);
    $('#total_rain').val(sum.toFixed(2));
    related_calculations();
});

// function related_calculations(){
//     let c = $('#case').val();
//     let total_rain = $('#total_rain').val();
//     let avg = $('#average').val();
//     let cofficent = $('#oneday').val();
//     let harvesting =  $('#harvesting').val();


//     let mandatory_harvesting = (total_rain*cofficent);
//     let avg_rainfall = (harvesting*1000)/(total_rain*avg);
//     $('#requirment').val('No');
//     if(mandatory_harvesting > 0){
//         $('#mandatory_harvesting').val(mandatory_harvesting.toFixed(2));
//     }else{
//         $('#mandatory_harvesting').val(mandatory_harvesting);
//         }
//     $('#avg_rainfall').val(((avg_rainfall?avg_rainfall:0)*100).toFixed(2));
//     if(mandatory_harvesting == 0) $('#requirment').val('No');
//     if(harvesting >=  mandatory_harvesting) $('#requirment').val('Yes');

// }

// function related_calculations() {

//     let rating = parseInt($('#case').val()); // rating type
//     let total_rain = parseFloat($('#total_rain').val()) || 0;
//     let avg = parseFloat($('#average').val()) || 0;
//     let coefficient = parseFloat($('#oneday').val()) || 0;
//     let harvesting = parseFloat($('#harvesting').val()) || 0;

//     // mandatory harvesting
//     let mandatory_harvesting = total_rain * coefficient;

//     // set mandatory harvesting
//     $('#mandatory_harvesting').val(
//         mandatory_harvesting > 0 ? mandatory_harvesting.toFixed(2) : 0
//     );

//     var avg_rainfall = 0;
    
//     // ✅ SPECIAL CASE: rating = 3
//     console.log(mandatory_harvesting, harvesting,total_rain,avg, "new building");
//     console.log(rating, "rating check");
//     if (rating_type == 1 || rating_type == 2  || rating_type == 5) {
//         if (total_rain > 0 && avg > 0) {
//             avg_rainfall = (harvesting * 1000) / (total_rain * avg);
//         }
//     } 
//     // ✅ OTHER RATINGS (existing logic)
//     else {
//          if (mandatory_harvesting > 0) {
//             avg_rainfall = harvesting / mandatory_harvesting;
//             console.log(avg_rainfall,"avg_rainfall new building");
//         }
       
//     }
//     console.log(avg_rainfall,"avg_rainfall")
//     $('#avg_rainfall').val(avg_rainfall.toFixed(2));
//             console.log(rating, "select");

//     // Requirement check
//     let requirement = 'No';
//     if (mandatory_harvesting > 0 && harvesting >= mandatory_harvesting) {
//         requirement = 'Yes';
//     }
//     else if (rating == 2) {
//         console.log(rating, "select");
//         requirement = 'Yes';
//     }
//     $('#requirment').val(requirement);
// }

// related_calculations();
// Function to perform related calculations
function related_calculations() {
    let rating = parseInt($('#case').val()); // rating type
    let total_rain = parseFloat($('#total_rain').val()) || 0;
    let avg = parseFloat($('#average').val()) || 0;
    let coefficient = parseFloat($('#oneday').val()) || 0;
    let harvesting = parseFloat($('#harvesting').val()) || 0;

    console.log('Rating:', rating, 'Total Rain:', total_rain, 'Avg:', avg, 'Coefficient:', coefficient, 'Harvesting:', harvesting);

    // Calculate mandatory harvesting
    let mandatory_harvesting = total_rain * coefficient;

    // Set mandatory harvesting value
    $('#mandatory_harvesting').val(
        mandatory_harvesting > 0 ? mandatory_harvesting.toFixed(2) : 0
    );

    var avg_rainfall = 0;
    
    // Calculate average rainfall based on rating type
    if (rating === 1 || rating === 2 || rating === 5) {
        // For rating types 1, 2, 5 - special calculation
        if (total_rain > 0 && avg > 0) {
            avg_rainfall = ((harvesting * 1000) / (total_rain * avg)*100);
        }
    } else {
        // For other rating types
        if (mandatory_harvesting > 0) {
            avg_rainfall = harvesting / mandatory_harvesting;
        }
    }

    // Set average rainfall value
    $('#avg_rainfall').val(avg_rainfall > 0 ? avg_rainfall.toFixed(2) : 0);

    // Determine requirement
    let requirement = 'No';
    
    // Check if rating is 2 - this should be "Yes" immediately
    if (rating === 2) {
        requirement = 'Yes';
        console.log('Rating is 2, Requirement set to: Yes');
    } 
    // Check if harvesting meets mandatory requirement
    else if (mandatory_harvesting > 0 && harvesting >= mandatory_harvesting) {
        requirement = 'Yes';
        console.log('Harvesting meets mandatory requirement, Requirement set to: Yes');
    }
    else {
        requirement = 'No';
        console.log('Requirement set to: No');
    }

    // Set requirement value
    $('#requirment').val(requirement);
    console.log('Final Requirement:', requirement);
}

// Run calculation when document is ready
$(document).ready(function() {
    // Trigger calculation on page load
    related_calculations();

    
    $('#case').on('change', function() {
        // console.log('Case/Rating changed to:', $(this).val());
        related_calculations();
    });

    $('#total_rain').on('change input', function() {
        // console.log('Total rain changed to:', $(this).val());
        related_calculations();
    });

    $('#average').on('change input', function() {
        // console.log('Average changed to:', $(this).val());
        related_calculations();
    });

    $('#oneday').on('change input', function() {
        // console.log('One day coefficient changed to:', $(this).val());
        related_calculations();
    });

    $('#harvesting').on('change input', function() {
        // console.log('Harvesting changed to:', $(this).val());
        related_calculations();
    });

    // Optional: Also run on blur for input fields
    $('#total_rain, #average, #oneday, #harvesting').on('blur', function() {
        related_calculations();
    });
});

function calculate(e){

    let v =  $(e).attr('data-id');
    let d = $(e).attr('data-daily');
    let darray = d.split("|");
    let a = $(e).attr('data-annual');
    let aarray = a.split("|");
    const current_year = new Date().getFullYear();
    const total_days = new Date(current_year, 1, 29).getMonth() === 1 ? 365 : 365;
   $('#'+v).val(e.value*total_days);

   var ek = $('.'+darray[0]).map((_,el) => el.value).get()
       console.log(ek);
       let count = 0;
       var sum = ek.reduce((pv,cv)=>{
           if(cv > 0) count +=1;
           return pv + (parseFloat(cv)||0);
        },0);
        
       $('#'+darray[1]).val(sum.toFixed(2));

       var ekt = $('.'+aarray[0]).map((_,elt) => elt.value).get()
        var tot_sum = ekt.reduce((pvt,cvt)=>{
            if(cvt > 0) count +=1;
            return pvt + (parseFloat(cvt)||0);
        },0);

        $('#'+aarray[1]).val(tot_sum.toFixed(2));

        b9 = $('#availability_daily_total').val();
        b17 = $('#consumption_daily_total').val();
        b22 = $('#waste_daily_total').val();

        b_tot = parseFloat(b17) + parseFloat(b22);

        if(b9 == b_tot){
            $('#validity').html('Valid');
            $('#validity').addClass('btn-success');
            $('#validity').removeClass('btn-danger');
        }else{
            $('#validity').html('In-Valid');
            $('#validity').addClass('btn-danger');
            $('#validity').removeClass('btn-success');

        }

        calculate_annex_four();
}
annex_three_cal();
function annex_three_cal(){
   let d = 'consumption_water_daily|consumption_daily_total';
   let darray = d.split("|");
   let a = 'consumption_water_annual|consumption_annual_total';
   let aarray = a.split("|");
   var ek = $('.'+darray[0]).map((_,el) => el.value).get()
       console.log(ek);
       let count = 0;
       var sum = ek.reduce((pv,cv)=>{
           if(cv > 0) count +=1;
           return pv + (parseFloat(cv)||0);
        },0);
        
       $('#'+darray[1]).val(sum.toFixed(2)||0);

       var ekt = $('.'+aarray[0]).map((_,elt) => elt.value).get()
        var tot_sum = ekt.reduce((pvt,cvt)=>{
            if(cvt > 0) count +=1;
            return pvt + (parseFloat(cvt)||0);
        },0);

        $('#'+aarray[1]).val(tot_sum.toFixed(2)||0);

        b9 = $('#availability_daily_total').val();
        b17 = $('#consumption_daily_total').val();
        b22 = $('#waste_daily_total').val();

        b_tot = parseFloat(b17) + parseFloat(b22);

        if(b9 == b_tot){
            $('#validity').html('Valid');
            $('#validity').addClass('btn-success');
        }else{
            $('#validity').html('In-Valid');
            $('#validity').addClass('btn-danger');
        }


}



// FULL FLUSH - Status Change Handler
// $(document).on('change', '#full_flush_status', function(){
//     let value = $(this).val();
//     var total = 0;
//     var totalTwo = 0;
    
//     if(value === 'yes'){
//         if(rating == 5){
//             total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_total_fte").val()) * parseFloat($("#full_flush_base").val());
//         }else{
//             total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_occupancy").val()) * parseFloat($("#full_flush_base").val());
//         }
//         $("#full_flush_total_use").val(total.toFixed(2));

//         if($("#full_flush_proposed").val()){
//             if(rating == 5){
//                 totalTwo = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_total_fte").val()) * parseFloat($("#full_flush_proposed").val());
//             }else{
//                 totalTwo = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_occupancy").val()) * parseFloat($("#full_flush_proposed").val());
//             }
//             $("#full_flush_proposed_total").val(totalTwo.toFixed(2));
//         }
//     }else{
//         $("#full_flush_total_use").val(0);
//         $("#full_flush_proposed_total").val(0);
//     }
    
//     calculate_annex();
// });

// Function to calculate full flush values
function calculateFullFlush() {
    let value = $('#full_flush_status').val();
    var total = 0;
    var totalTwo = 0;
    
    if(value === 'yes'){
        if(rating == 5){
            total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_total_fte").val()) * parseFloat($("#full_flush_base").val());
        }else{
            total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_occupancy").val()) * parseFloat($("#full_flush_base").val());
        }
        $("#full_flush_total_use").val(total.toFixed(2));

        if($("#full_flush_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_total_fte").val()) * parseFloat($("#full_flush_proposed").val());
            }else{
                totalTwo = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_occupancy").val()) * parseFloat($("#full_flush_proposed").val());
            }
            $("#full_flush_proposed_total").val(totalTwo.toFixed(2));
        }
    }else{
        $("#full_flush_total_use").val(0);
        $("#full_flush_proposed_total").val(0);
    }
    calculate_annex();
}

// Trigger calculation when status changes
$(document).on('change', '#full_flush_status', function(){
    calculateFullFlush();
});

// Trigger calculation when any input field changes
$(document).on('change input', '#full_flush_duration, #full_flush_daily, #full_flush_occupancy, #full_flush_total_fte, #full_flush_base, #full_flush_proposed', function(){
    calculateFullFlush();
});


function calculateHalf() {
    let value = $('#half_flush_status_female').val();
    var total = 0;
    var totalTwo = 0;
    
    if(value === 'yes'){
        total = parseFloat($("#half_flush_duration_female").val()) * parseFloat($("#half_flush_daily_female").val()) * parseFloat($("#half_flush_occupancy_female").val()) * parseFloat($("#half_flush_base_female").val());
        
        $("#half_flush_total_use_female").val(total.toFixed(2));
        
        if($("#half_flush_proposed_female").val()){
            totalTwo = parseFloat($("#half_flush_duration_female").val()) * parseFloat($("#half_flush_daily_female").val()) * parseFloat($("#half_flush_occupancy_female").val()) * parseFloat($("#half_flush_proposed_female").val());
            console.log(totalTwo, "totalTwa");
            $("#half_flush_proposed_total_female").val(totalTwo.toFixed(2));
        }
    }else{
        $("#half_flush_total_use_female").val(0);
        $("#half_flush_proposed_total_female").val(0);
    }
    calculate_annex();
}

// Trigger calculation when status changes
$(document).on('change', '#half_flush_status_female', function(){
    calculateHalf();
});

// Trigger calculation when ANY shower head input field changes
$(document).on('change input', '#shower_head_duration, #shower_head_daily, #shower_head_occupancy, #half_flush_occupancy_female,#half_flush_proposed_female, #half_flush_total_use_female,#half_flush_proposed_female, #shower_head_total_fte, #shower_head_base, #shower_head_total_proposed', function(){
    calculateHalf();
});




function calculateShowered() {
    let value = $('#shower_head_status').val();
    var total = 0;
    var totalTwo = 0;
    
    if(value === 'yes'){
        if(rating == 5){
            total = parseFloat($("#shower_head_duration").val()) * parseFloat($("#shower_head_daily").val()) * parseFloat($("#shower_head_total_fte").val()) * parseFloat($("#shower_head_base").val());
        }else{
            total = parseFloat($("#shower_head_duration").val()) * parseFloat($("#shower_head_daily").val()) * parseFloat($("#shower_head_occupancy").val()) * parseFloat($("#shower_head_base").val());
        }
        $("#shower_head_total_use").val(total.toFixed(2));

        if($("#shower_head_total_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#shower_head_duration").val()) * parseFloat($("#shower_head_daily").val()) * parseFloat($("#shower_head_total_fte").val()) * parseFloat($("#shower_head_total_proposed").val());
            }else{
                totalTwo = parseFloat($("#shower_head_duration").val()) * parseFloat($("#shower_head_daily").val()) * parseFloat($("#shower_head_occupancy").val()) * parseFloat($("#shower_head_total_proposed").val());
            }
            $("#shower_head_proposed").val(totalTwo.toFixed(2));
        }
    }else{
        $("#shower_head_total_use").val(0);
        $("#shower_head_proposed").val(0);
    }
    calculate_annex();
}

// Trigger calculation when status changes
$(document).on('change', '#shower_head_status', function(){
    calculateShowered();
});

// Trigger calculation when ANY shower head input field changes
$(document).on('change input', '#shower_head_duration, #shower_head_daily, #shower_head_occupancy, #shower_head_total_fte, #shower_head_base, #shower_head_total_proposed', function(){
    calculateShowered();
});




// FULL FLUSH - Proposed Value Change Handler
$(document).on('keyup', '#full_flush_proposed', function(){
    let status = $("#full_flush_status").val();
    var total = 0;
    
    if(status === 'yes'){
        if(rating == 5){
            total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_total_fte").val()) * parseFloat($("#full_flush_proposed").val());
        }else{
            total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_occupancy").val()) * parseFloat($("#full_flush_proposed").val());
        }
        $("#full_flush_proposed_total").val(total.toFixed(2));
    }
    calculate_annex();
});

// FULL FLUSH - FTE Change Handler
$(document).on('keyup', '#full_flush_total_fte', function(){
    let status = $("#full_flush_status").val();
    
    if(status === 'yes'){
        let total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_base").val()) * parseFloat($(this).val());
        $("#full_flush_total_use").val(total.toFixed(2));
    }
    if($("#full_flush_proposed").val()){
        let totalTwo = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_total_fte").val()) * parseFloat($("#full_flush_proposed").val());
        $("#full_flush_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

// ============================================================================
// HALF FLUSH
// ============================================================================

$(document).on('change', '#half_flush_status', function(){
    let value = $(this).val();
    var total = 0;
    var totalTwo = 0;
    
    if(value === 'yes'){
        if(rating == 5){
            total = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_total_fte").val()) * parseFloat($("#half_flush_base").val());
        }else{
            total = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_occupancy").val()) * parseFloat($("#half_flush_base").val());
        }
        $("#half_flush_total_use").val(total.toFixed(2));

        if($("#half_flush_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_total_fte").val()) * parseFloat($("#half_flush_proposed").val());
            }else{
                totalTwo = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_occupancy").val()) * parseFloat($("#half_flush_proposed").val());
            }
            $("#half_flush_proposed_total").val(totalTwo.toFixed(2));
        }
    }else{
        $("#half_flush_total_use").val(0);
        $("#half_flush_proposed_total").val(0);
    }
    calculate_annex();
});

$(document).on('keyup', '#half_flush_proposed', function(){
    let status = $("#half_flush_status").val();
    var totalTwo = 0;

    if(status === 'yes'){
        if(rating == 5){
            totalTwo = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_total_fte").val()) * parseFloat($("#half_flush_proposed").val());
        }else{
            totalTwo = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_occupancy").val()) * parseFloat($("#half_flush_proposed").val());
        }
        $("#half_flush_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

$(document).on('keyup', '#half_flush_total_fte', function(){
    let status = $("#half_flush_status").val();
    
    if(status === 'yes'){
        let total = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_base").val()) * parseFloat($(this).val());
        $("#half_flush_total_use").val(total.toFixed(2));
    }
    if($("#half_flush_proposed").val()){
        let totalTwo = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_total_fte").val()) * parseFloat($("#half_flush_proposed").val());
        $("#half_flush_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

// ============================================================================
// HAND SPRAY
// ============================================================================

$(document).on('change', '#hand_spary_status', function(){
    let value = $(this).val();
    var total = 0;
    var totalTwo = 0;
    
    if(value === 'yes'){
        if(rating == 5){
            total = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_total_fte").val()) * parseFloat($("#hand_spary_base").val());
        }else{
            total = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_occupancy").val()) * parseFloat($("#hand_spary_base").val());
        }
        $("#hand_spary_total_use").val(total.toFixed(2));

        if($("#hand_spary_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_total_fte").val()) * parseFloat($("#hand_spary_proposed").val());
            }else{
                totalTwo = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_occupancy").val()) * parseFloat($("#hand_spary_proposed").val());
            }
            $("#hand_spary_proposed_total").val(totalTwo.toFixed(2));
        }
    }else{
        $("#hand_spary_total_use").val(0);
        $("#hand_spary_proposed_total").val(0);
    }
    calculate_annex();
});

$(document).on('keyup', '#hand_spary_proposed', function(){
    let status = $("#hand_spary_status").val();
    var totalTwo = 0;

    if(status === 'yes'){
        if(rating == 5){
            totalTwo = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_total_fte").val()) * parseFloat($("#hand_spary_proposed").val());
        }else{
            totalTwo = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_occupancy").val()) * parseFloat($("#hand_spary_proposed").val());
        }
        $("#hand_spary_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

$(document).on('keyup', '#hand_spary_total_fte', function(){
    let status = $("#hand_spary_status").val();
    
    if(status === 'yes'){
        let total = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_base").val()) * parseFloat($(this).val());
        $("#hand_spary_total_use").val(total.toFixed(2));
    }
    if($("#hand_spary_proposed").val()){
        let totalTwo = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_total_fte").val()) * parseFloat($("#hand_spary_proposed").val());
        $("#hand_spary_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

// TAPS

$(document).on('change', '#taps_status', function(){
    let value = $(this).val();
    var total = 0;
    var totalTwo = 0;
    
    if(value === 'yes'){
        if(rating == 5){
            total = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_total_fte").val()) * parseFloat($("#taps_base").val());
        }else{
            total = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_occupancy").val()) * parseFloat($("#taps_base").val());
        }
        $("#taps_total_use").val(total.toFixed(2));

        if($("#taps_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_total_fte").val()) * parseFloat($("#taps_proposed").val());
            }else{
                totalTwo = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_occupancy").val()) * parseFloat($("#taps_proposed").val());
            }
            $("#taps_proposed_total").val(totalTwo.toFixed(2));
        }
    }else{
        $("#taps_total_use").val(0);
        $("#taps_proposed_total").val(0);
    }
    calculate_annex();
});

$(document).on('keyup', '#taps_proposed', function(){
    let status = $("#taps_status").val();
    var totalTwo = 0;

    if(status === 'yes'){
        if(rating == 5){
            totalTwo = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_total_fte").val()) * parseFloat($("#taps_proposed").val());
        }else{
            totalTwo = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_occupancy").val()) * parseFloat($("#taps_proposed").val());
        }
        $("#taps_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

$(document).on('keyup', '#taps_total_fte', function(){
    let status = $("#taps_status").val();
    
    if(status === 'yes'){
        let total = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_base").val()) * parseFloat($(this).val());
        $("#taps_total_use").val(total.toFixed(2));
    }
    if($("#taps_proposed").val()){
        let totalTwo = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_total_fte").val()) * parseFloat($("#taps_proposed").val());
        $("#taps_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

// SINK

$(document).on('change', '#sink_status', function(){
    let value = $(this).val();
    var total = 0;
    var totalTwo = 0;
    
    if(value === 'yes'){
        if(rating == 5){
            total = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_total_fte").val()) * parseFloat($("#sink_base").val());
        }else{
            total = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_occupancy").val()) * parseFloat($("#sink_base").val());
        }
        $("#sink_total_use").val(total.toFixed(2));

        if($("#sink_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_total_fte").val()) * parseFloat($("#sink_proposed").val());
            }else{
                totalTwo = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_occupancy").val()) * parseFloat($("#sink_proposed").val());
            }
            $("#sink_proposed_total").val(totalTwo.toFixed(2));
        }
    }else{
        $("#sink_total_use").val(0);
        $("#sink_proposed_total").val(0);
    }
    calculate_annex();
});



$(document).on('keyup', '#sink_proposed', function(){
    let status = $("#sink_status").val();
    var totalTwo = 0;
    
    if(status === 'yes'){
        if(rating == 5){
            totalTwo = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_total_fte").val()) * parseFloat($("#sink_proposed").val());
        }else{
            totalTwo = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_occupancy").val()) * parseFloat($("#sink_proposed").val());
        }
        $("#sink_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

$(document).on('keyup', '#sink_total_fte', function(){
    let status = $("#sink_status").val();
    
    if(status === 'yes'){
        let total = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_base").val()) * parseFloat($(this).val());
        $("#sink_total_use").val(total.toFixed(2));
    }
    if($("#sink_proposed").val()){
        let totalTwo = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_total_fte").val()) * parseFloat($("#sink_proposed").val());
        $("#sink_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

// URINAL

$(document).on('change', '#urinal_status', function(){
    let value = $(this).val();
    var total = 0;
    var totalTwo = 0;
    
    if(value === 'yes'){
        if(rating == 5){
            total = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_total_fte").val()) * parseFloat($("#urinal_base").val());
        }else{
            total = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_occupancy").val()) * parseFloat($("#urinal_base").val());
        }
        $("#urinal_total_use").val(total.toFixed(2));

        if($("#urinal_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_total_fte").val()) * parseFloat($("#urinal_proposed").val());
            }else{
                totalTwo = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_occupancy").val()) * parseFloat($("#urinal_proposed").val());
            }
            $("#urinal_proposed_total").val(totalTwo.toFixed(2));
        }
    }else{
        $("#urinal_total_use").val(0);
        $("#urinal_proposed_total").val(0);
    }
    calculate_annex();
});

$(document).on('keyup', '#urinal_proposed', function(){
    let status = $("#urinal_status").val();
    var totalTwo = 0;

    if(status === 'yes'){
        if(rating == 5){
            totalTwo = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_total_fte").val()) * parseFloat($("#urinal_proposed").val());
        }else{
            totalTwo = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_occupancy").val()) * parseFloat($("#urinal_proposed").val());
        }
        $("#urinal_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});

$(document).on('keyup', '#urinal_total_fte', function(){
    let status = $("#urinal_status").val();
    
    if(status === 'yes'){
        let total = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_base").val()) * parseFloat($(this).val());
        $("#urinal_total_use").val(total.toFixed(2));
    }
    if($("#urinal_proposed").val()){
        let totalTwo = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_total_fte").val()) * parseFloat($("#urinal_proposed").val());
        $("#urinal_proposed_total").val(totalTwo.toFixed(2));
    }
    calculate_annex();
});












// Fixture Configuration
const fixtures = ['full_flush', 'half_flush', 'hand_spary', 'taps', 'sink', 'urinal'];

// Generic calculation function for any fixture
function calculateFixture(fixturePrefix) {
    let statusVal = $(`#${fixturePrefix}_status`).val();
    let total = 0;
    let totalTwo = 0;
    
    if(statusVal === 'yes') {
        // Calculate base total
        if(rating == 5) {
            total = parseFloat($(`#${fixturePrefix}_duration`).val()) * 
                   parseFloat($(`#${fixturePrefix}_daily`).val()) * 
                   parseFloat($(`#${fixturePrefix}_total_fte`).val()) * 
                   parseFloat($(`#${fixturePrefix}_base`).val());
        } else {
            total = parseFloat($(`#${fixturePrefix}_duration`).val()) * 
                   parseFloat($(`#${fixturePrefix}_daily`).val()) * 
                   parseFloat($(`#${fixturePrefix}_occupancy`).val()) * 
                   parseFloat($(`#${fixturePrefix}_base`).val());
        }
        $(`#${fixturePrefix}_total_use`).val(total.toFixed(2));

        // Calculate proposed total if value exists
        let proposedVal = $(`#${fixturePrefix}_proposed`).val();
        if(proposedVal) {
            if(rating == 5) {
                totalTwo = parseFloat($(`#${fixturePrefix}_duration`).val()) * 
                          parseFloat($(`#${fixturePrefix}_daily`).val()) * 
                          parseFloat($(`#${fixturePrefix}_total_fte`).val()) * 
                          parseFloat(proposedVal);
            } else {
                totalTwo = parseFloat($(`#${fixturePrefix}_duration`).val()) * 
                          parseFloat($(`#${fixturePrefix}_daily`).val()) * 
                          parseFloat($(`#${fixturePrefix}_occupancy`).val()) * 
                          parseFloat(proposedVal);
            }
            $(`#${fixturePrefix}_proposed_total`).val(totalTwo.toFixed(2));
        }
    } else {
        $(`#${fixturePrefix}_total_use`).val(0);
        $(`#${fixturePrefix}_proposed_total`).val(0);
    }
    
    calculate_annex();
}







// Initialize event listeners for all fixtures
fixtures.forEach(function(fixture) {
    // Status change - recalculate all
    $(document).on('change', `#${fixture}_status`, function() {
        calculateFixture(fixture);
    });
    
    // Duration change - recalculate all
    $(document).on('change input', `#${fixture}_duration`, function() {
        calculateFixture(fixture);
    });
    
    // Daily change - recalculate all
    $(document).on('change input', `#${fixture}_daily`, function() {
        calculateFixture(fixture);
    });
    
    // Base change - recalculate all
    $(document).on('change input', `#${fixture}_base`, function() {
        calculateFixture(fixture);
    });
    
    // Occupancy change - recalculate all
    $(document).on('change input', `#${fixture}_occupancy`, function() {
        calculateFixture(fixture);
    });
    
    // Total FTE change - recalculate all
    $(document).on('change input', `#${fixture}_total_fte`, function() {
        calculateFixture(fixture);
    });
    
    // Proposed change - recalculate all
    $(document).on('change input', `#${fixture}_proposed`, function() {
        calculateFixture(fixture);
    });
});
// PART 2: EVENT HANDLERS FOR DYNAMIC SHOWER ROWS (Array Fields)

// Shower Status Change - Handles dynamically added rows
$(document).on('change', 'select[name="shower_status[]"]', function(){
    let row = $(this).closest('tr');
    let status = $(this).val();
    
    let duration = parseFloat(row.find('input[name="shower_duration[]"]').val()) || 0;
    let daily = parseFloat(row.find('input[name="shower_daily[]"]').val()) || 0;
    let base = parseFloat(row.find('input[name="shower_base[]"]').val()) || 0;
    let occupancy = parseFloat(row.find('input[name="shower_occupancy[]"]').val()) || 0;
    let fte = parseFloat(row.find('input[name="shower_total_fte[]"]').val()) || occupancy;
    
    if(status === 'yes'){
        if(rating == 5){
            let total = duration * daily * fte * base;
            row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        }else{
            let total = duration * daily * occupancy * base;
            row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        }
        
        // Calculate proposed if value exists
        let proposed = parseFloat(row.find('input[name="shower_proposed[]"]').val()) || 0;
        if(proposed > 0){
            if(rating == 5){
                let totalTwo = duration * daily * fte * proposed;
                row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
            }else{
                let totalTwo = duration * daily * occupancy * proposed;
                row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
            }
        }
    }else{
        row.find('input[name="shower_total_use[]"]').val(0);
        row.find('input[name="shower_proposed_total[]"]').val(0);
    }
    calculate_annex();
});

// Shower Proposed Value Change - Handles dynamically added rows
$(document).on('keyup', 'input[name="shower_proposed[]"]', function(){
    let row = $(this).closest('tr');
    let status = row.find('select[name="shower_status[]"]').val();
    
    if(status === 'yes'){
        let duration = parseFloat(row.find('input[name="shower_duration[]"]').val()) || 0;
        let daily = parseFloat(row.find('input[name="shower_daily[]"]').val()) || 0;
        let occupancy = parseFloat(row.find('input[name="shower_occupancy[]"]').val()) || 0;
        let fte = parseFloat(row.find('input[name="shower_total_fte[]"]').val()) || occupancy;
        let proposed = parseFloat($(this).val()) || 0;
        
        if(rating == 5){
            let totalTwo = duration * daily * fte * proposed;
            row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
        }else{
            let totalTwo = duration * daily * occupancy * proposed;
            row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
        }
    }
    calculate_annex();
});

// Shower Duration Change - Handles dynamically added rows
$(document).on('keyup', 'input[name="shower_duration[]"]', function(){
    let row = $(this).closest('tr');
    let status = row.find('select[name="shower_status[]"]').val();
    
    if(status === 'yes'){
        let duration = parseFloat($(this).val()) || 0;
        let daily = parseFloat(row.find('input[name="shower_daily[]"]').val()) || 0;
        let base = parseFloat(row.find('input[name="shower_base[]"]').val()) || 0;
        let occupancy = parseFloat(row.find('input[name="shower_occupancy[]"]').val()) || 0;
        let fte = parseFloat(row.find('input[name="shower_total_fte[]"]').val()) || occupancy;
        
        if(rating == 5){
            let total = duration * daily * fte * base;
            row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        }else{
            let total = duration * daily * occupancy * base;
            row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        }
        
        let proposed = parseFloat(row.find('input[name="shower_proposed[]"]').val()) || 0;
        if(proposed > 0){
            if(rating == 5){
                let totalTwo = duration * daily * fte * proposed;
                row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
            }else{
                let totalTwo = duration * daily * occupancy * proposed;
                row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
            }
        }
    }
    calculate_annex();
});

// Shower Daily Uses Change - Handles dynamically added rows
$(document).on('keyup', 'input[name="shower_daily[]"]', function(){
    let row = $(this).closest('tr');
    let status = row.find('select[name="shower_status[]"]').val();
    
    if(status === 'yes'){
        let duration = parseFloat(row.find('input[name="shower_duration[]"]').val()) || 0;
        let daily = parseFloat($(this).val()) || 0;
        let base = parseFloat(row.find('input[name="shower_base[]"]').val()) || 0;
        let occupancy = parseFloat(row.find('input[name="shower_occupancy[]"]').val()) || 0;
        let fte = parseFloat(row.find('input[name="shower_total_fte[]"]').val()) || occupancy;
        
        if(rating == 5){
            let total = duration * daily * fte * base;
            row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        }else{
            let total = duration * daily * occupancy * base;
            row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        }
        
        let proposed = parseFloat(row.find('input[name="shower_proposed[]"]').val()) || 0;
        if(proposed > 0){
            if(rating == 5){
                let totalTwo = duration * daily * fte * proposed;
                row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
            }else{
                let totalTwo = duration * daily * occupancy * proposed;
                row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
            }
        }
    }
    calculate_annex();
});

// Shower Base Value Change - Handles dynamically added rows
$(document).on('keyup', 'input[name="shower_base[]"]', function(){
    let row = $(this).closest('tr');
    let status = row.find('select[name="shower_status[]"]').val();
    
    if(status === 'yes'){
        let duration = parseFloat(row.find('input[name="shower_duration[]"]').val()) || 0;
        let daily = parseFloat(row.find('input[name="shower_daily[]"]').val()) || 0;
        let base = parseFloat($(this).val()) || 0;
        let occupancy = parseFloat(row.find('input[name="shower_occupancy[]"]').val()) || 0;
        let fte = parseFloat(row.find('input[name="shower_total_fte[]"]').val()) || occupancy;
        
        if(rating == 5){
            let total = duration * daily * fte * base;
            row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        }else{
            let total = duration * daily * occupancy * base;
            row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        }
    }
    calculate_annex();
});

// Shower FTE/Occupancy Change - Handles dynamically added rows
$(document).on('keyup', 'input[name="shower_total_fte[]"]', function(){
    let row = $(this).closest('tr');
    let status = row.find('select[name="shower_status[]"]').val();
    
    if(status === 'yes'){
        let duration = parseFloat(row.find('input[name="shower_duration[]"]').val()) || 0;
        let daily = parseFloat(row.find('input[name="shower_daily[]"]').val()) || 0;
        let base = parseFloat(row.find('input[name="shower_base[]"]').val()) || 0;
        let fte = parseFloat($(this).val()) || 0;
        
        let total = duration * daily * fte * base;
        row.find('input[name="shower_total_use[]"]').val(total.toFixed(2));
        
        let proposed = parseFloat(row.find('input[name="shower_proposed[]"]').val()) || 0;
        if(proposed > 0){
            let totalTwo = duration * daily * fte * proposed;
            row.find('input[name="shower_proposed_total[]"]').val(totalTwo.toFixed(2));
        }
    }
    calculate_annex();
});



function calculate_annex(){
    // Includes: Full Flush, Half Flush
    
    var flush_base = $('.base_total_flush').map((_, el) => parseFloat(el.value) || 0).get();
    var flushsum2 = flush_base.reduce((sum, val) => sum + val, 0);
    var urinal = parseFloat($('#urinal_total_use').val() || 0);
    console.log(urinal, "urinal value");
    var flushsum = urinal +flushsum2;
    console.log(flushsum, "flushsum vlaue");
    $('#flush_base_total').val(flushsum.toFixed(2));

    var flush_proposed = $('.proposed_total_flush').map((_, el) => parseFloat(el.value) || 0).get();
    var prosum2 = flush_proposed.reduce((sum, val) => sum + val, 0);
    var urinalproposedtotal = parseFloat($('#urinal_proposed_total').val() || 0);

    var prosum = urinalproposedtotal + prosum2;
    $('#flush_proposed_total').val(prosum.toFixed(2));

    
    // $('#fixture_proposed_total').val(flsum.toFixed(2));
    var flowsum = $('.base_total').toArray().reduce((sum, el) => sum + (parseFloat(el.value) || 0), 0);
    $('#fixture_base_total').val(flowsum.toFixed(2));

    var flsum = $('.proposed_total').toArray().reduce((sum, el) => sum + (parseFloat(el.value) || 0), 0);
    $('#fixture_proposed_total').val(flsum.toFixed(2));

    // ========== ANNUAL CALCULATIONS ==========
    // Formula: Annual Volume = Daily Volume × Annual Working Days
    
    let days = parseFloat($('#annual_days').val()) || 365;
    
    if(days > 0){
        // Base Case Annual Calculations
        let annual_flush_base = days * parseFloat($('#flush_base_total').val());
        $('#annual_flush_base').val(annual_flush_base.toFixed(2));
        
        let annual_fixture_base = days * parseFloat($('#fixture_base_total').val());
        $('#annual_fixture_base').val(annual_fixture_base.toFixed(2));
        
        // Proposed Case Annual Calculations
        let annual_flush_proposed = days * parseFloat($('#flush_proposed_total').val());
        $('#annual_flush_proposed').val(annual_flush_proposed.toFixed(2));
        
        let annual_fixture_proposed = days * parseFloat($('#fixture_proposed_total').val());
        $('#annual_fixture_proposed').val(annual_fixture_proposed.toFixed(2));
    }
    
    // ========== TOTAL VOLUME CALCULATIONS ==========
    // Formula: Total Volume = Annual Flush Volume + Annual Flow Volume
    
    let total_volume_base = parseFloat($('#annual_flush_base').val() || 0) + parseFloat($('#annual_fixture_base').val() || 0);
    $('#total_volume_base').val(total_volume_base.toFixed(2));
    
    let total_volume_proposed = parseFloat($('#annual_flush_proposed').val() || 0) + parseFloat($('#annual_fixture_proposed').val() || 0);
    $('#total_volume_proposed').val(total_volume_proposed.toFixed(2));

    // ========== SAVINGS CALCULATIONS ==========
    // Formula: Savings = Base Volume - Proposed Volume
    // Formula: Savings % = (Savings / Base Volume) × 100
    
    let difference = total_volume_base - total_volume_proposed;
    $('#saving_annual').val(difference.toFixed(2));
    
    let percent = 0;
    if(total_volume_base > 0){
        percent = (difference / total_volume_base) * 100;
    }
    $('#saving_percentage').val(percent.toFixed(2));
    
    // ========== MANDATORY REQUIREMENT CHECK ==========
    // If savings percentage is positive, Annex is mandatory
    
    if(parseFloat($('#saving_percentage').val()) >= 0) {
        $('#annex_mandatory').val('Yes');
    }else{
        $('#annex_mandatory').val('No');
    }
}


$(document).on('keyup', '#annual_days', function(){
    calculate_annex();
});

$(document).ready(function () {
    let rowCount = $("#material-body tr").length;

    // Decimal place limiter for all number inputs
    $(document).on("input", "input[type='number']", function () {
        let value = $(this).val();

        if (value === "" || value === ".") return;

        if (value.includes(".")) {
            let parts = value.split(".");
            if (parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                $(this).val(parts.join("."));
            }
        }
    });

    // $(document).on("click", ".delete-row", function () {
    //     $(this).closest("tr").remove();
    //     calculate_annex();
    // });
    calculate_annex();
});






$('#stp_efficency').keyup(function(){
    let b2 = parseFloat($('#waste_water_generated').val());
    let b3 = parseFloat($('#stp_capacity').val());
    let com = b3*1000;
    
    if($(this).val() > 100){
        $(this).val(100);
    }
    let b4 = parseFloat($(this).val());
    let percent = b4/100;
    let b5 = 0;
    let b12 = parseFloat($('#reuse_daily_total').val());
    if(b2 >= com){
        b5 = b3*1000*percent;
    }else{
        b5 = b2*percent;
    }
    if(b5){
        $('#treated_daily_water').val(b5.toFixed(2)||0);
        
        let cal = ((b5/percent)/b2)*100;
        $('#treated_water_percent').val(cal.toFixed(2)||0);
    
        $('#reuse_water_percent').val(((b12/b5)*100).toFixed(2)||0);
        }else{
            $('#treated_daily_water').val(0);
            $('#treated_water_percent').val(0);
            $('#reuse_water_percent').val(0);
        }
});

function calculate_annex_four(){
    let b2 = parseFloat($('#waste_water_generated').val());
    let b3 = parseFloat($('#stp_capacity').val());
    let com = b3*1000;
    let b4 = parseFloat($('#stp_efficency').val());
    let b5 = 0;
    let percent = b4/100;
    let b12 = parseFloat($('#reuse_daily_total').val());
    if(b2 >= com){
        b5 = b3*1000*percent;
    }else{
        b5 = (b2*percent);
    }
    
    if(b5){
    $('#treated_daily_water').val(b5.toFixed(2)||0);
    
    let cal = ((b5/percent)/b2)*100;
    $('#treated_water_percent').val(cal.toFixed(2)||0);

    $('#reuse_water_percent').val(((b12/b5)*100).toFixed(2)||0);
    }else{
        $('#treated_daily_water').val(0);
        $('#treated_water_percent').val(0);
        $('#reuse_water_percent').val(0);
    }
}

calculate_annex_four();

function calculate_annax_two(){

    let sink_status = $("#sink_status").val();
    if(sink_status === 'yes'){
        var total = 0;
        var totalTwo = 0;
        if(rating == 5){
            total = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_total_fte").val()) * parseFloat($("#sink_base").val());

        }else{
            total = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_occupancy").val()) * parseFloat($("#sink_base").val());
        }
        
        $("#sink_total_use").val(total.toFixed(2))

        if($("#sink_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_total_fte").val()) * parseFloat($("#sink_proposed").val());
            }else{
                totalTwo = parseFloat($("#sink_duration").val()) * parseFloat($("#sink_daily").val()) * parseFloat($("#sink_occupancy").val()) * parseFloat($("#sink_proposed").val());
            }
            $("#sink_proposed_total").val(totalTwo.toFixed(2))
        }
        
    }
    
    let full_flush_status = $("#full_flush_status").val();
    if(full_flush_status === 'yes'){
        var total = 0;
        var totalTwo = 0;
        if(rating == 5){
            total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_total_fte").val()) * parseFloat($("#full_flush_base").val());

        }else{
            total = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_occupancy").val()) * parseFloat($("#full_flush_base").val());
        }
        
        $("#full_flush_total_use").val(total.toFixed(2))

        if($("#full_flush_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_total_fte").val()) * parseFloat($("#full_flush_proposed").val());
            }else{
                totalTwo = parseFloat($("#full_flush_duration").val()) * parseFloat($("#full_flush_daily").val()) * parseFloat($("#full_flush_occupancy").val()) * parseFloat($("#full_flush_proposed").val());
            }
            $("#full_flush_proposed_total").val(totalTwo.toFixed(2))
        }
    }
    
    let half_flush_status = $("#half_flush_status").val();
    if(half_flush_status === 'yes'){
        var total = 0;
        var totalTwo = 0;
    if(rating == 5){
            total = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_total_fte").val()) * parseFloat($("#half_flush_base").val());

        }else{
            total = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_occupancy").val()) * parseFloat($("#half_flush_base").val());
        }
        
        $("#half_flush_total_use").val(total.toFixed(2))

        if($("#half_flush_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_total_fte").val()) * parseFloat($("#half_flush_proposed").val());
            }else{
                totalTwo = parseFloat($("#half_flush_duration").val()) * parseFloat($("#half_flush_daily").val()) * parseFloat($("#half_flush_occupancy").val()) * parseFloat($("#half_flush_proposed").val());
            }
            $("#half_flush_proposed_total").val(totalTwo.toFixed(2))
        }
    }
   
    let hand_spary_status = $("#hand_spary_status").val();
    if(hand_spary_status === 'yes'){
        var total = 0;
        var totalTwo = 0;
    if(rating == 5){
            total = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_total_fte").val()) * parseFloat($("#hand_spary_base").val());

        }else{
            total = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_occupancy").val()) * parseFloat($("#hand_spary_base").val());
        }
        
        $("#hand_spary_total_use").val(total.toFixed(2))

        if($("#hand_spary_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_total_fte").val()) * parseFloat($("#hand_spary_proposed").val());
            }else{
                totalTwo = parseFloat($("#hand_spary_duration").val()) * parseFloat($("#hand_spary_daily").val()) * parseFloat($("#hand_spary_occupancy").val()) * parseFloat($("#hand_spary_proposed").val());
            }
            $("#hand_spary_proposed_total").val(totalTwo.toFixed(2))
        }
    }
   
    let taps_status = $("#taps_status").val();
    if(taps_status === 'yes'){
        var total = 0;
        var totalTwo = 0;
        if(rating == 5){
            total = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_total_fte").val()) * parseFloat($("#taps_base").val());

        }else{
            total = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_occupancy").val()) * parseFloat($("#taps_base").val());
        }
        
        $("#taps_total_use").val(total.toFixed(2))

        if($("#taps_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_total_fte").val()) * parseFloat($("#taps_proposed").val());
            }else{
                totalTwo = parseFloat($("#taps_duration").val()) * parseFloat($("#taps_daily").val()) * parseFloat($("#taps_occupancy").val()) * parseFloat($("#taps_proposed").val());
            }
            $("#taps_proposed_total").val(totalTwo.toFixed(2))
        }
    }
    
    let urinal_status = $("#urinal_status").val();
    if(urinal_status === 'yes'){
        var total = 0;
        var totalTwo = 0;
        if(rating == 5){
            total = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_total_fte").val()) * parseFloat($("#urinal_base").val());

        }else{
            total = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_occupancy").val()) * parseFloat($("#urinal_base").val());
        }
        
        $("#urinal_total_use").val(total.toFixed(2))

        if($("#urinal_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_total_fte").val()) * parseFloat($("#urinal_proposed").val());
            }else{
                totalTwo = parseFloat($("#urinal_duration").val()) * parseFloat($("#urinal_daily").val()) * parseFloat($("#urinal_occupancy").val()) * parseFloat($("#urinal_proposed").val());
            }
            $("#urinal_proposed_total").val(totalTwo.toFixed(2))
        }
    }
    





    let shower_status = $("#shower_status").val();
    if(shower_status === 'yes'){
        var total = 0;
        var totalTwo = 0;
        if(rating == 5){
            total = parseFloat($("#shower_duration").val()) * parseFloat($("#shower_daily").val()) * parseFloat($("#shower_total_fte").val()) * parseFloat($("#shower_base").val());

        }else{
            total = parseFloat($("#shower_duration").val()) * parseFloat($("#shower_daily").val()) * parseFloat($("#shower_occupancy").val()) * parseFloat($("#shower_base").val());
        }
        
        $("#shower_total_use").val(total.toFixed(2))

        if($("#shower_proposed").val()){
            if(rating == 5){
                totalTwo = parseFloat($("#shower_duration").val()) * parseFloat($("#shower_daily").val()) * parseFloat($("#shower_total_fte").val()) * parseFloat($("#shower_proposed").val());
            }else{
                totalTwo = parseFloat($("#shower_duration").val()) * parseFloat($("#shower_daily").val()) * parseFloat($("#shower_occupancy").val()) * parseFloat($("#shower_proposed").val());
            }
            $("#shower_proposed_total").val(totalTwo.toFixed(2))
        }
    }
    calculate_annex();

}
calculate_annax_two();
calculate_annex();

function clearRow(btn) {
    // find the closest <tr> to the clicked button
    const row = btn.closest("tr");

    // clear all input values inside that row
    row.querySelectorAll("input").forEach(input => {
        if (input.type === "number" || input.type === "text") {
            input.value = "";
        }
    });

    // reset all selects inside that row
    row.querySelectorAll("select").forEach(select => {
        select.selectedIndex = 0; // set to "Select"
    });
    calculate_annax_two();
}

const annualDays = document.getElementById("annual_days");

// annualDays.addEventListener("input", function () {
//     let val = parseInt(this.value, 10);

//     if (val > 365) {
//         this.value = 365;   // cap at 365
//     } 
//     // else if (val < 1) {
//     //     this.value = 1;     // minimum 1
//     // }
// });
// annualDays.addEventListener("input", function () {
//     let val = parseInt(this.value, 10);

//     // Allow empty input while typing
//     if (isNaN(val)) return;

//     if (val > 365) {
//         this.value = 365;
//     } 
//     // Uncomment if minimum should be 1
//     // else if (val < 1) {
//     //     this.value = 1;
//     // }
// });
