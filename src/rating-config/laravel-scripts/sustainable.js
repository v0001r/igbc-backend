

if(subtab == 'green_parking'){

    $('#dwelling_units').on('keyup', function(){
        let tot_cycle = $('#bycycle').val();
        let ev_units = $('#dwelling_units').val();
        let by_percent = (parseFloat(tot_cycle)/parseFloat(ev_units))*100;

        $('#bycycle_parking_percent').val(by_percent.toFixed(2));
    });
        let tot_cycle = $('#bycycle').val();
        let ev_units = $('#dwelling_units').val();
        let by_percent = (parseFloat(tot_cycle)/parseFloat(ev_units))*100;

        $('#bycycle_parking_percent').val(by_percent.toFixed(2));
}

if(subtab == 'transplantation_of_trees'){
    let total_site_area = $('#total_site_area').val();
    let preserved = $('#preserved').val();
    let adaptive = $('#adaptive').val();
    let existing = $('#existing').val();
    let tot = parseFloat(preserved) + parseFloat(adaptive);
    let percent = (tot/parseFloat(total_site_area))*4046;
    $('#trees_per_acre').val(percent.toFixed(2));
}
if(subtab == 'green_transportation' || subtab == 'green_parking'){
    let four_wheel = $('#four_wheel').val();
    let two_wheel = $('#two_wheel').val();
    let ev_fourwheel = $('#ev_fourwheel').val();
    let ev_twowheel = $('#ev_twowheel').val();
    let four_parking_percent = (parseFloat(ev_fourwheel)/parseFloat(four_wheel))*100;
    let two_parking_percent = (parseFloat(ev_twowheel)/parseFloat(two_wheel))*100;
    $('#two_parking_percent_green').val(two_parking_percent.toFixed(2));
    $('#four_parking_percent_green').val(four_parking_percent.toFixed(2));

    console.log(two_parking_percent, four_parking_percent);

    
}

if(subtab == 'urban_heat_island'){

    if($("#sri_vegetation").is(':checked') || $("#high_reflective").is(':checked') || $("#only_vegetation").is(':checked')){
        $('#div_sri_vegetation_island_mitigation').show();
        $('#div_high_reflective_island_mitigation').show();
        $('#div_only_vegetation_island_mitigation').show();
    }else{
        $('#div_sri_vegetation_island_mitigation').hide();
        $('#div_high_reflective_island_mitigation').hide();
        $('#div_only_vegetation_island_mitigation').hide();
    }
    $('#sri_vegetation').change(function() {
        if(this.checked) {
            $('#div_sri_vegetation_island_mitigation').show();

        }else{
            $('#div_sri_vegetation_island_mitigation').hide();
        }
        let exposed = $('#exposed').val();
        let insert_area = $('#insert_area').val();
        let tolerant = $('#tolerant').val();
        let sri_vegetation = parseFloat(insert_area) + parseFloat(tolerant);
        let high_reflective_percent = (parseFloat(insert_area)/parseFloat(exposed))*100;
        let sri_vegetation_percent = (sri_vegetation/parseFloat(exposed))*100;
        let only_vegetation_percent = (parseFloat(tolerant)/parseFloat(exposed))*100;
        $('#sri_vegetation_island_mitigation').val(sri_vegetation_percent.toFixed(1));
        $('#high_reflective_island_mitigation').val(high_reflective_percent.toFixed(1));
        $('#only_vegetation_island_mitigation').val(only_vegetation_percent.toFixed(1));
    
    });
        let exposed = $('#exposed').val();
        let insert_area = $('#insert_area').val();
        let tolerant = $('#tolerant').val();
        let sri_vegetation = parseFloat(insert_area) + parseFloat(tolerant);
        let high_reflective_percent = (parseFloat(insert_area)/parseFloat(exposed))*100;
        let sri_vegetation_percent = (sri_vegetation/parseFloat(exposed))*100;
        let only_vegetation_percent = (parseFloat(tolerant)/parseFloat(exposed))*100;
        $('#sri_vegetation_island_mitigation').val(sri_vegetation_percent.toFixed(1));
        $('#high_reflective_island_mitigation').val(high_reflective_percent.toFixed(1));
        $('#only_vegetation_island_mitigation').val(only_vegetation_percent.toFixed(1));
    $('#high_reflective').change(function() {
        if(this.checked) {
            $('#div_high_reflective_island_mitigation').show();

        }else{
            $('#div_high_reflective_island_mitigation').hide();
        }
        let exposed = $('#exposed').val();
        let insert_area = $('#insert_area').val();
        let tolerant = $('#tolerant').val();
        let sri_vegetation = parseFloat(insert_area) + parseFloat(tolerant);
        let high_reflective_percent = (parseFloat(insert_area)/parseFloat(exposed))*100;
        let sri_vegetation_percent = (sri_vegetation/parseFloat(exposed))*100;
        let only_vegetation_percent = (parseFloat(tolerant)/parseFloat(exposed))*100;
        $('#sri_vegetation_island_mitigation').val(sri_vegetation_percent.toFixed(1));
        $('#high_reflective_island_mitigation').val(high_reflective_percent.toFixed(1));
        $('#only_vegetation_island_mitigation').val(only_vegetation_percent.toFixed(1));
    
    });
    $('#only_vegetation').change(function() {
        if(this.checked) {
            $('#div_only_vegetation_island_mitigation').show();

        }else{
            $('#div_only_vegetation_island_mitigation').hide();
        }
        let exposed = $('#exposed').val();
        let insert_area = $('#insert_area').val();
        let tolerant = $('#tolerant').val();
        let sri_vegetation = parseFloat(insert_area) + parseFloat(tolerant);
        let high_reflective_percent = (parseFloat(insert_area)/parseFloat(exposed))*100;
        let sri_vegetation_percent = (sri_vegetation/parseFloat(exposed))*100;
        let only_vegetation_percent = (parseFloat(tolerant)/parseFloat(exposed))*100;
        $('#sri_vegetation_island_mitigation').val(sri_vegetation_percent.toFixed(1));
        $('#high_reflective_island_mitigation').val(high_reflective_percent.toFixed(1));
        $('#only_vegetation_island_mitigation').val(only_vegetation_percent.toFixed(1));
    
    });

    $('#total_exposed_roof_area').on('keyup', function(){
        let total_exposed_roof_area = $('#total_exposed_roof_area').val();
        let area_of_high_sri = $('#area_of_high_sri').val();
        let area_of_landscape_builtup = $('#area_of_landscape_builtup').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#heat_island_mitigation').val(by_percent.toFixed(2));
    });
    $('#area_of_high_sri').on('keyup', function(){
        let total_exposed_roof_area = $('#total_exposed_roof_area').val();
        let area_of_high_sri = $('#area_of_high_sri').val();
        let area_of_landscape_builtup = $('#area_of_landscape_builtup').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#heat_island_mitigation').val(by_percent.toFixed(2));
    });
    $('#area_of_landscape_builtup').on('keyup', function(){
        let total_exposed_roof_area = $('#total_exposed_roof_area').val();
        let area_of_high_sri = $('#area_of_high_sri').val();
        let area_of_landscape_builtup = $('#area_of_landscape_builtup').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#heat_island_mitigation').val(by_percent.toFixed(2));
    });
    $('#exposed').on('keyup', function(){
        let total_exposed_roof_area = $('#exposed').val();
        let area_of_high_sri = $('#insert_area').val();
        let area_of_landscape_builtup = $('#tolerant').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#heat_island_mitigation').val(by_percent.toFixed(2));
    });
    $('#insert_area').on('keyup', function(){
        let total_exposed_roof_area = $('#exposed').val();
        let area_of_high_sri = $('#insert_area').val();
        let area_of_landscape_builtup = $('#tolerant').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#heat_island_mitigation').val(by_percent.toFixed(2));
    });
    $('#tolerant').on('keyup', function(){
        let total_exposed_roof_area = $('#exposed').val();
        let area_of_high_sri = $('#insert_area').val();
        let area_of_landscape_builtup = $('#tolerant').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#heat_island_mitigation').val(by_percent.toFixed(2));
    });

        let total_exposed_roof_area = $('#exposed').val();
        let area_of_high_sri = $('#insert_area').val();
        let area_of_landscape_builtup = $('#tolerant').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#heat_island_mitigation').val(by_percent.toFixed(2))

        // let qwtotal_exposed_roof_area = $('#total_exposed_roof_area').val();
        // let qwarea_of_high_sri = $('#area_of_high_sri').val();
        // let qwarea_of_landscape_builtup = $('#area_of_landscape_builtup').val();
        // let qwtot = parseFloat(qwarea_of_high_sri) + parseFloat(qwarea_of_landscape_builtup);
        // let qwby_percent = (qwtot/parseFloat(qwtotal_exposed_roof_area));

        // $('#heat_island_mitigation').val(qwby_percent.toFixed(1));


}

if(subtab == 'urban_heat_island'){

    if($("#site_plan").is(':checked') || $("#covered_parking").is(':checked')){
        $('#div_mitigation').show();
        $('#div_island_mitigation').show();
    }else{
        $('#div_mitigation').hide();
        $('#div_island_mitigation').hide();
    }
    $('#site_plan').change(function() {
        if(this.checked) {
            $('#div_mitigation').show();

        }else{
            $('#div_mitigation').hide();
        }
        let impervious = $('#impervious').val();
        let shaded = $('#shaded').val();
        let area_of_hardscape_non_roof = $('#area_of_hardscape_non_roof').val();
        let tot = parseFloat(shaded) + parseFloat(area_of_hardscape_non_roof);
        let percent = (parseFloat(tot)/parseFloat(impervious));
        $('#mitigation').val(percent.toFixed(1));
    });
        let impervious = $('#impervious').val();
        let shaded = $('#shaded').val();
        let qarea_of_hardscape_non_roof = $('#area_of_hardscape_non_roof').val();
        let tot = parseFloat(shaded) + parseFloat(qarea_of_hardscape_non_roof);
        let qpercent = (parseFloat(tot)/parseFloat(impervious))*100;
        $('#mitigation').val(qpercent.toFixed(2));

    $('#covered_parking').change(function() {
        if(this.checked) {
            $('#div_island_mitigation').show();

        }else{
            $('#div_island_mitigation').hide();
        }
        let covered = $('#covered').val();
        let parking = $('#parking').val();
        let percent = (parseFloat(covered)/parseFloat(parking))*100;
        $('#island_mitigation').val(percent.toFixed(2));
    
    });
    let covered = $('#covered').val();
        let parking = $('#parking').val();
        let percent = (parseFloat(covered)/parseFloat(parking));
        $('#island_mitigation').val(percent.toFixed(1));
    $('#total_exposed_non_roof_area').on('keyup', function(){
        let total_exposed_non_roof_area = $('#total_exposed_non_roof_area').val();
        let exposed_area_of_high_sri_non_roof = $('#exposed_area_of_high_sri_non_roof').val();
        let area_of_hardscape_non_roof = $('#area_of_hardscape_non_roof').val();
        let tot = parseFloat(exposed_area_of_high_sri_non_roof) + parseFloat(area_of_hardscape_non_roof);
        let by_percent = (tot/parseFloat(total_exposed_non_roof_area))*100;

        $('#heat_island_mitigation_non_roof').val(by_percent.toFixed(2));
    });
    $('#exposed_area_of_high_sri_non_roof').on('keyup', function(){
        let total_exposed_non_roof_area = $('#total_exposed_non_roof_area').val();
        let exposed_area_of_high_sri_non_roof = $('#exposed_area_of_high_sri_non_roof').val();
        let area_of_hardscape_non_roof = $('#area_of_hardscape_non_roof').val();
        let tot = parseFloat(exposed_area_of_high_sri_non_roof) + parseFloat(area_of_hardscape_non_roof);
        let by_percent = (tot/parseFloat(total_exposed_non_roof_area))*100;

        $('#heat_island_mitigation_non_roof').val(by_percent.toFixed(2));
    });
    $('#area_of_hardscape_non_roof').on('keyup', function(){
        let total_exposed_non_roof_area = $('#total_exposed_non_roof_area').val();
        let exposed_area_of_high_sri_non_roof = $('#exposed_area_of_high_sri_non_roof').val();
        let area_of_hardscape_non_roof = $('#area_of_hardscape_non_roof').val();
        let tot = parseFloat(exposed_area_of_high_sri_non_roof) + parseFloat(area_of_hardscape_non_roof);
        let by_percent = (tot/parseFloat(total_exposed_non_roof_area))*100;

        $('#heat_island_mitigation_non_roof').val(by_percent.toFixed(2));
    });
        let atotal_exposed_non_roof_area = $('#total_exposed_non_roof_area').val();
        let aexposed_area_of_high_sri_non_roof = $('#exposed_area_of_high_sri_non_roof').val();
        let aarea_of_hardscape_non_roof = $('#area_of_hardscape_non_roof').val();
        let atot = parseFloat(aexposed_area_of_high_sri_non_roof) + parseFloat(aarea_of_hardscape_non_roof);
        let aby_percent = (atot/parseFloat(atotal_exposed_non_roof_area))*100;

        $('#heat_island_mitigation_non_roof').val(aby_percent.toFixed(2));
}

if(subtab == 'optimise_spaces'){
    $('#storage_area').on('keyup', function(){
        let carpet_area = $('#carpet_area').val();
        let storage_area = $('#storage_area').val();
        let furniture_area = $('#furniture_area').val();
        let tot = parseFloat(carpet_area) - parseFloat(storage_area) - parseFloat(furniture_area);
        let by_percent = (tot/parseFloat(carpet_area))*100;
        // $('#circulation_percent').val(by_percent.toFixed(1));
    });
    
    $('#furniture_area').on('keyup', function(){
        let carpet_area = $('#carpet_area').val();
        let storage_area = $('#storage_area').val();
        let furniture_area = $('#furniture_area').val();
        let tot = parseFloat(carpet_area) - parseFloat(storage_area) - parseFloat(furniture_area);
        let by_percent = (tot/parseFloat(carpet_area))*100;
        // $('#circulation_percent').val(by_percent.toFixed(1));
    });
        let carpet_area = $('#carpet_area').val();
        let storage_area = $('#storage_area').val();
        let furniture_area = $('#furniture_area').val();
        let tot = parseFloat(carpet_area) - parseFloat(storage_area) - parseFloat(furniture_area);
        let by_percent = (tot/parseFloat(carpet_area))*100;

        // $('#circulation_percent').val(by_percent.toFixed(1));
}

if(subtab == 'eco_friendly_landcaping_practices'){
    $('#total_fertilzer').on('keyup', function(){
        let total_fertilzer = $('#total_fertilzer').val();
        let total_organic_fertilzer = $('#total_organic_fertilzer').val();
        let by_percent = (parseFloat(total_organic_fertilzer)/parseFloat(total_fertilzer))*100;

        $('#percent_organic_fertilzer').val(by_percent.toFixed(1));
    });
    $('#total_organic_fertilzer').on('keyup', function(){
        let total_fertilzer = $('#total_fertilzer').val();
        let total_organic_fertilzer = $('#total_organic_fertilzer').val();
        let by_percent = (parseFloat(total_organic_fertilzer)/parseFloat(total_fertilzer))*100;

        $('#percent_organic_fertilzer').val(by_percent.toFixed(1));
    });

    // seperate claculation
        let area_adaptive_tolerant = $('#area_adaptive_tolerant').val();
        let area_adaptive_tolerant_builtup = $('#area_adaptive_tolerant_builtup').val();
        let area_vrticl_adptiv_tolerant_landscape = $('#area_vrticl_adptiv_tolerant_landscape').val();
        let total_area_ground = $('#total_area_ground').val();
        let total_area_builtup = $('#total_area_builtup').val();
        let total_area_vertical_landscape = $('#total_area_vertical_landscape').val();
        let tot_one = parseFloat(area_adaptive_tolerant) + parseFloat(area_adaptive_tolerant_builtup) + parseFloat(area_vrticl_adptiv_tolerant_landscape);
        let tot_two= parseFloat(total_area_ground) + parseFloat(total_area_builtup) + parseFloat(total_area_vertical_landscape);
        let percent_adaptive_species = (parseFloat(tot_one)/parseFloat(tot_two))*100;
        // alert(area_adaptive_tolerant);
        $('#percent_adaptive_species').val(percent_adaptive_species.toFixed(1));
    
}

if(subtab == 'site_preservation'){

    $('#area_retained_topography').on('keyup', function(){
        let area_retained_topography = $('#area_retained_topography').val();
        let total_site_area = $('#total_site_area').val();
        let by_percent = (parseFloat(area_retained_topography)/parseFloat(total_site_area))*100;
        $('#retained_percent').val(Math.abs(by_percent.toFixed(1)));
    });
    $('#area_retainted_site_countour').on('keyup', function(){
        let area_retainted_site_countour = $('#area_retainted_site_countour').val();
        let countour_site_area = $('#countour_site_area').val();
        let by_percent = (parseFloat(area_retainted_site_countour)/parseFloat(countour_site_area))*100;
        $('#retainted_site_countour_percent').val(Math.abs(by_percent.toFixed(1)));
    });
    $('#area_retainted_natural_rock').on('keyup', function(){
        let building_footprint = $('#building_footprint').val();
        let rock_total_site_area = $('#rock_total_site_area').val();
        let area_retainted_natural_rock = $('#area_retainted_natural_rock').val();
        let by_percent = (parseFloat(area_retainted_natural_rock)/(parseFloat(rock_total_site_area) - parseFloat(building_footprint)))*100;
        $('#retainted_natural_rock_percent').val(Math.abs(by_percent.toFixed(1)));
    });

    let no_preserved_trees = $('#no_preserved_trees').val();
    let no_existing_trees = $('#no_existing_trees').val();
    let by_percent = (parseFloat(no_preserved_trees)/parseFloat(no_existing_trees))*100;
    $('#preserved_trees_percent').val(Math.abs(by_percent.toFixed(1)));
   
    if($("#retained_topography").is(':checked')){
        $("#div_area_retained_topography").show();
        $("#div_total_site_area").show();
        $("#div_retained_percent").show();
    }else{
        $("#div_area_retained_topography").hide();
        $("#div_total_site_area").hide();
        $("#div_retained_percent").hide();
    }
    if($("#preserved_trees").is(':checked')){
        $("#div_no_existing_trees").show();
        $("#div_no_preserved_trees").show();
        $("#div_preserved_trees_percent").show();
    }else{
        $("#div_no_existing_trees").hide();
        $("#div_no_preserved_trees").hide();
        $("#div_preserved_trees_percent").hide();
    }
    if($("#retainted_site_countour").is(':checked')){
            $("#div_area_retainted_site_countour").show();
            $("#div_countour_site_area").show();
            $("#div_retainted_site_countour_percent").show();
    }else{
            $("#div_area_retainted_site_countour").hide();
            $("#div_countour_site_area").hide();
            $("#div_retainted_site_countour_percent").hide();
    }
    if($("#retainted_natural_rock").is(':checked')){
            $("#div_area_retainted_natural_rock").show();
            $("#div_building_footprint").show();
            $("#div_rock_total_site_area").show();
            $("#div_retainted_natural_rock_percent").show();
    }else{
        $("#div_area_retainted_natural_rock").hide();
            $("#div_building_footprint").hide();
            $("#div_rock_total_site_area").hide();
            $("#div_retainted_natural_rock_percent").hide(); 
        
    }
    $('#retained_topography').change(function() {
        if(this.checked) {
            $("#div_area_retained_topography").show();
            $("#div_total_site_area").show();
            $("#div_retained_percent").show();
        }else{
            $("#div_area_retained_topography").hide();
            $("#div_total_site_area").hide();
            $("#div_retained_percent").hide();
        }
    });
    $('#preserved_trees').change(function() {
        if(this.checked) {
            $("#div_no_existing_trees").show();
        $("#div_no_preserved_trees").show();
        $("#div_preserved_trees_percent").show();
        }else{
            $("#div_no_existing_trees").hide();
        $("#div_no_preserved_trees").hide();
        $("#div_preserved_trees_percent").hide();
        }
    });
    $('#retainted_site_countour').change(function() {
        if(this.checked) {
            $("#div_area_retainted_site_countour").show();
            $("#div_countour_site_area").show();
            $("#div_retainted_site_countour_percent").show();
        }else{
            $("#div_area_retainted_site_countour").hide();
            $("#div_countour_site_area").hide();
            $("#div_retainted_site_countour_percent").hide();
        }
    });
    $('#retainted_natural_rock').change(function() {
        if(this.checked) {
            $("#div_area_retainted_natural_rock").show();
            $("#div_building_footprint").show();
            $("#div_rock_total_site_area").show();
            $("#div_retainted_natural_rock_percent").show();    
        }else{
            $("#div_area_retainted_natural_rock").hide();
            $("#div_building_footprint").hide();
            $("#div_rock_total_site_area").hide();
            $("#div_retainted_natural_rock_percent").hide(); 
        }
    });
}

if(subtab == 'eco_friendly_commuting' || subtab == 'eco_friendly'){
    if($("input[name='public_transport']:checked").val() == 1){
        $("#div_public_transport_select").show(); 
        $("#div_distance_public_transport").show();
        $("#div_areial_plan").show();
        $("#div_geo_tagged_photos").show();
        $("#div_contract_agreement").hide();
        $("#div_highlight_documents").hide();
        $("#div_narrative_shuttle").hide();
        $("#div_geo_tagged_photos_shuttle_buses").hide();
        $("div#contract_agreement_doc").hide();
        $("div#highlight_documents_doc").hide();
        $("div#geo_tagged_photos_shuttle_buses_doc").hide();
        $("#div_narrative_shuttle_doc").hide();
        $("#narrative_shuttle_doc").hide();

    } else {
        $("#div_public_transport_select").hide();
        $("#div_distance_public_transport").hide();
        $("#div_areial_plan").hide();
        $("#div_geo_tagged_photos").hide();
        $("#div_narrative").hide();
        $("div#narrative_doc").hide();
        $("div#public_transport_select_doc").hide(); 
        $("div#distance_public_transport_doc").hide();
        $("div#areial_plan_doc").hide();
        $("div#geo_tagged_photos_doc").hide();
        $("#div_contract_agreement").show();
        $("#div_highlight_documents").show();
        $("#div_narrative_shuttle").show();
        $("#div_geo_tagged_photos_shuttle_buses").show();
        $("#public_transport_select").val('');
        $("#distance_public_transport").val('');
        $("input[name='public_transport_option']").prop("checked", false);
    }

    $("input[name='public_transport']").change(function() {
        if($(this).val() == 1) {
            $("#div_public_transport_select").show(); 
            $("#div_distance_public_transport").show();
            $("#div_areial_plan").show();
            $("#div_geo_tagged_photos").show();
            $("#div_narrative").show();

            $("#div_contract_agreement").hide();
            $("#div_highlight_documents").hide();
            $("#div_narrative_shuttle").hide();
            $("#div_narrative_shuttle_doc").hide();
            $("#narrative_shuttle_doc").hide();
            $("#div_geo_tagged_photos_shuttle_buses").hide();
            $("div#contract_agreement_doc").hide();
            $("div#highlight_documents_doc").hide();
            $("div#geo_tagged_photos_shuttle_buses_doc").hide();


           $("#public_transport_select").val('');
            $("#distance_public_transport").val('');
            $("input[name='shuttle_service']").prop("checked", false);
            $("input[name='narrative_shuttle']").prop("checked", false);
            $("input[name='contract_agreement']").prop("checked", false);
            $("input[name='highlight_documents']").prop("checked", false);
            $("input[name='geo_tagged_photos_shuttle_buses']").prop("checked", false);
       
        } else {
            
            $("#div_public_transport_select").hide();
            $("#div_distance_public_transport").hide();
            $("#div_areial_plan").hide();
            $("#div_geo_tagged_photos").hide();
            $("#div_narrative").hide();
            $("div#narrative_doc").hide();
            $("div#public_transport_select_doc").hide(); 
            $("div#distance_public_transport_doc").hide();
            $("div#areial_plan_doc").hide();
            $("div#geo_tagged_photos_doc").hide();

            $("#div_contract_agreement").show();
            $("#div_highlight_documents").show();
            $("#div_narrative_shuttle").show();
            $("#div_geo_tagged_photos_shuttle_buses").show();


            $("#public_transport_select").val('');
            $("#distance_public_transport").val('');
            $("input[name='narrative']").prop("checked", false);
            $("input[name='areial_plan']").prop("checked", false);
            $("input[name='geo_tagged_photos']").prop("checked", false);
        }
    });
}


if (subtab == 'green_facility') {

    // On page load check the current value
    if ($("#compliances").val() == "Yes") {
        $("#div_narrative").show();
        $("#div_certificate_green_building").show();
        
    } else {
         $("#div_narrative").hide();
        $("#div_certificate_green_building").hide();

    }

    // On change of dropdown value
    $('#compliances').change(function() {
        if ($(this).val() == "Yes") {
            $("#div_narrative").show();
            $("#div_certificate_green_building").show();
            
        } else {
            $("#div_narrative").hide();
            $("#div_certificate_green_building").hide();
        }
    });
}

if (subtab == 'commercial_lease') {
    function toggleCommercialLease(clearHidden = false) {
        let val = $("input[name='commercial_lease']:checked").val();

        if (val == "1") {
            $("#lease_agreement_tenure").show();
            $("#div_lease_agreement_tenure").show();
            $("#div_lease_agreement").show();
            $("#div_declaration_project_owner").show();
            $("#div_commercial_narrative").show();

            $("#div_energy_bill_property_tax").hide()
            $("div#energy_bill_property_tax_doc").hide()
            $("#div_declaration_from_project_owner").hide()
            $("#div_commercial_narrative_occ").hide()
            $("div#commercial_narrative_occ_doc").hide()
            $("div#declaration_from_project_owner_doc").hide()

            if (clearHidden) {
                $("#div_energy_bill_property_tax").find("input, select, textarea").val('');
                $("#div_declaration_from_project_owner").find("input, select, textarea").val('');
            }
            $("input[name='commercial_narrative_occ']").prop("checked", false);
            $("input[name='energy_bill_property_tax']").prop("checked", false);
            $("input[name='declaration_from_project_owner']").prop("checked", false);

        } else if (val == "2") {
            // $("#lease_agreement_doc_table").hide();
             $("#div_energy_bill_property_tax").show();
            $("#div_declaration_from_project_owner").show();
            $("#div_commercial_narrative_occ").show()


            $("#div_lease_agreement_tenure").hide();
            $("#div_commercial_narrative").hide();
            $("#div_lease_agreement").hide();
            $("#div_declaration_project_owner").hide()
            $("div#declaration_project_owner_doc").hide()
            $("div#lease_agreement_doc").hide();
            $("div#commercial_narrative_doc").hide();


            if (clearHidden) {
                $("#div_lease_agreement").find("input, select, textarea").val('');
                $("#div_declaration_project_owner").find("input, select, textarea").val('');
            }
            $("input[name='commercial_narrative']").prop("checked", false);
            $("input[name='lease_agreement']").prop("checked", false);
            $("input[name='declaration_project_owner']").prop("checked", false);
        } else {
            $("#div_lease_agreement, #div_commercial_narrative_occ, #div_lease_agreement_tenure, #div_declaration_project_owner, #div_energy_bill_property_tax, #div_declaration_from_project_owner, #div_commercial_narrative").hide();
        }
    }

    toggleCommercialLease(false);

    $("input[name='commercial_lease']").change(function () {
        toggleCommercialLease(true);
    });
}

if(subtab == 'awareness_sustainability_concepts'){

    function toggleSustainabilityConcept() {
        if ($("input[name='awareness_sessions']").prop("checked")) {
            $("#div_schedule_green_awareness_program, #div_attendance_record_program, #div_geotagged_photos_awareness_sessions, #div_narrative_awareness_sessions").show();
        } 
        else if ($("input[name='display_permanent_signages']").prop("checked")) {
            $("#div_narrative_display_permanent").show();
            $("#div_geotagged_photos_permanent_highlighting").show();
            $("#div_schedule_green_awareness_program, #div_attendance_record_program, #div_geotagged_photos_awareness_sessions, #div_narrative_awareness_sessions").hide();
        } 
        else {
            $("#div_schedule_green_awareness_program, #div_attendance_record_program, #div_geotagged_photos_awareness_sessions, #div_narrative_display_permanent, #div_narrative_awareness_sessions, #div_geotagged_photos_permanent_highlighting").hide();
        }
    }

    toggleSustainabilityConcept();

    $("input[name='awareness_sessions'], input[name='display_permanent_signages']").change(function () {
        toggleSustainabilityConcept();
    });
}


if (subtab == 'eco_freindly_refrigerants') {
    function RefrigerantsAndFireExt() {
        if ($("input[name='eco_freindly_refrigerant']").prop("checked")) {
            $("#div_detailed_narrative_energy_efficency, #div_declaration_letter_project_owner, #div_installed_air_conditioning_systems, #div_manufacturer_technical_cutsheet, #div_multiple_geo_photographs").show();
        } 
        else {
            $("#div_detailed_narrative_energy_efficency, #div_declaration_letter_project_owner, #div_installed_air_conditioning_systems, #div_manufacturer_technical_cutsheet, #div_multiple_geo_photographs").hide();
        }

        if ($("input[name='halons_free_fire_extinguisher']").prop("checked")) {
            $("#div_indicating_quantity_fire_extinguishers, #div_manufacturer_brochure_fire_suppression, #div_geotagged_photographs_fire_suppression").show();
        } else {
            $("#div_indicating_quantity_fire_extinguishers, #div_manufacturer_brochure_fire_suppression, #div_geotagged_photographs_fire_suppression").hide();
        }
    }

    RefrigerantsAndFireExt();

    $("input[name='eco_freindly_refrigerant'], input[name='halons_free_fire_extinguisher']").change(function () {
        RefrigerantsAndFireExt();
    });
}


// if (subtab == 'efficent_space_conditioning') {
//     $(document).ready(function () {
//         function toggleNonAirFields() {
//             if ($("input[name='non_air_conditioned_spaces']").is(":checked")) {
//                 $("#div_narrative_non_air").show();
//                 $("#div_floor_plan_window_schedule").show();
//                 $("#div_interior_project_temperature_humidity").show();
//                 $("#div_existing_interior_project_temperature_humidity").show();
//                 $("#div_geotagged_photographs_videos").show();
//             } else {
//                 $("#div_narrative_non_air").hide();
//                 $("#div_floor_plan_window_schedule").hide();
//                 $("#div_interior_project_temperature_humidity").hide();
//                 $("#div_existing_interior_project_temperature_humidity").hide();
//                 $("#div_geotagged_photographs_videos").hide();
//             }

//             if ($("input[name='conditioned_spaces']").is(":checked")) {
//             $("#div_conditioning_system_installed, #div_hvac_layout_indicating, #div_purchase_invoice_air_conditioned_system, #div_technical_specification_manufacturer_cut_sheets, #div_geo_tagged_photographs_videos,#div_narrative_passive_technology_installed,#div_technical_specifications_photographs,").show();
//         } else {
//             $("#div_conditioning_system_installed, #div_hvac_layout_indicating, #div_purchase_invoice_air_conditioned_system, #div_technical_specification_manufacturer_cut_sheets, #div_geo_tagged_photographs_videos,#div_narrative_passive_technology_installed,#div_technical_specifications_photographs,").hide();
//         }
//         }
//         toggleNonAirFields();
//         $("input[name='non_air_conditioned_spaces'], input[name='conditioned_spaces']").change(function () {
//             toggleNonAirFields();
//         });
//     });
// }



if(subtab == 'passive_architecture'){
   
    if($("#prescriptive_method").is(':checked')){
        $("#div_exterior").show();
        $("#div_skylights").show();
        $("#div_daylighting").show();
        $("#div_passive").show();
    }else{
        $("#div_exterior").hide();
        $("#div_skylights").hide();
        $("#div_daylighting").hide();
        $("#div_passive").hide();
    }

    $('#prescriptive_method').change(function() {
        if(this.checked) {
            $("#div_exterior").show();
            $("#div_skylights").show();
            $("#div_daylighting").show();
            $("#div_passive").show();
        }else{
            $("#div_exterior").hide();
            $("#div_skylights").hide();
            $("#div_daylighting").hide();
            $("#div_passive").hide();
        }
    });
}

if(subtab == 'building_operations_maintenance'){
    if($("#is_maintenance_plan_systems").is(':checked')){
        $("#div_public_transport").show();
    }else{
        $("#div_public_transport").hide();
    }
    $('#is_maintenance_plan_systems').change(function() {
        if(this.checked) {
            $("#div_public_transport").show();
            $("#public_transport").val('');
        }else{
            $("#div_public_transport").hide();
            $("#public_transport").val('');
        }
    });
   
}

// if(subtab == 'topography'){
//     if($("#casea_vegetation").is(':checked') || $("#option_1").is(':checked')){
//         $("#div_casea_total_site_area").show();
//         $("#div_casea_natural_area").show();
//         $("#div_casea_vegetated_area").show();
//         $("#div_casea_total_area").show();
//         $("#div_casea_percentage").show();
//         $("#div_casea_adaptive").show();
//         $("#div_casea_natural_topography_percent").show();
//     }else{
//         $("#div_casea_total_site_area").hide();
//         $("#div_casea_natural_area").hide();
//         $("#div_casea_vegetated_area").hide();
//         $("#div_casea_total_area").hide();
//         $("#div_casea_percentage").hide();
//         $("#div_casea_adaptive").hide();
//         $("#div_casea_natural_topography_percent").hide();
//     }
//     if($("#caseb_vegetation").is(':checked') || $("#option_2").is(':checked')){
//         $("#div_caseb_total_site_area").show();
//         $("#div_caseb_natural_area").show();
//         $("#div_caseb_vegetated_area").show();
//         $("#div_caseb_vegetated_structure").show();
//         $("#div_caseb_total_area").show();
//         $("#div_caseb_percent").show();
//         $("#div_caseb_total_area_buildup").show();
//         $("#div_caseb_natural_topography_2").show();
//         $("#div_caseb_adaptive_3").show();
//         $("#div_caseb_adaptive_2").show();
//         $("#div_caseb_total_site_area").show();

//     }else{
//         $("#div_caseb_total_site_area").hide();
//         $("#div_caseb_natural_area").hide();
//         $("#div_caseb_vegetated_area").hide();
//         $("#div_caseb_vegetated_structure").hide();
//         $("#div_caseb_total_area").hide();
//         $("#div_caseb_percent").hide();
//         $("#div_caseb_total_area_buildup").hide();
//         $("#div_caseb_natural_topography_2").hide();
//         $("#div_caseb_adaptive_3").hide();
//         $("#div_caseb_adaptive_2").hide();
//         $("#div_caseb_total_site_area").hide();

//     }

//     $('#casea_vegetation').change(function() {
//         if(this.checked) {
//             $("#div_casea_total_site_area").show();
//             $("#div_casea_natural_area").show();
//             $("#div_casea_vegetated_area").show();
//             $("#div_casea_total_area").show();
//             $("#div_casea_percentage").show();
//         }else{
//             $("#div_casea_total_site_area").hide();
//             $("#div_casea_natural_area").hide();
//             $("#div_casea_vegetated_area").hide();
//             $("#div_casea_total_area").hide();
//             $("#div_casea_percentage").hide();
//         }
       
//     });
//         let casea_total_area = parseFloat($('#casea_total_area').val()) || 0;
//         let casea_vegetated_area = parseFloat($('#casea_vegetated_area').val()) || 0;
//         let casea_natural_area = parseFloat($('#casea_natural_area').val()) || 0;
//         let casea_total_site_area = parseFloat($('#casea_total_site_area').val()) || 0;

//         let casea_tot = casea_vegetated_area + casea_natural_area + casea_total_area;

//         let casea_percent = (casea_tot > 0 && casea_total_site_area > 0)
//             ? (casea_tot / casea_total_site_area) * 100
//             : 0;

//         $('#casea_percentage').val(casea_percent.toFixed(2));
    
//     $('#option_2').change(function() {
//         if(this.checked) {
//             $("#div_caseb_natural_topography_2").show();
//             $("#div_caseb_adaptive_3").show();
//             $("#div_caseb_adaptive_2").show();
//             $("#div_caseb_total_site_area").show();
//             $("#div_caseb_natural_area").show();
//             $("#div_caseb_vegetated_area").show();
//         }else{
//             $("#div_caseb_natural_topography_2").hide();
//             $("#div_caseb_adaptive_3").hide();
//             $("#div_caseb_adaptive_2").hide();
//             $("#div_caseb_natural_area").hide();
//             $("#div_caseb_vegetated_area").hide();
//             $("#div_caseb_total_site_area").hide();
//         }
       
    
//     });
//     let caseb_adaptive_3 = parseFloat($('#caseb_adaptive_3').val()) || 0;
//     let caseb_adaptive_2 = parseFloat($('#caseb_adaptive_2').val()) || 0;
//     let caseb_natural_area = parseFloat($('#caseb_natural_area').val()) || 0;
//     let caseb_vegetated_area = parseFloat($('#caseb_vegetated_area').val()) || 0;
//     let caseb_total_site_area = parseFloat($('#caseb_total_site_area').val()) || 0;

//     let caseb_tot = caseb_adaptive_2 
//                 + caseb_adaptive_3 
//                 + caseb_natural_area 
//                 + caseb_vegetated_area;

//     let caseb_percent = (caseb_tot > 0 && caseb_total_site_area > 0)
//         ? (caseb_tot / caseb_total_site_area) * 100
//         : 0;

//     $('#caseb_natural_topography_2').val(caseb_percent.toFixed(2));

//     $('#option_1').change(function() {
//         if(this.checked) {
//             $("#div_casea_total_site_area").show();
//             $("#div_casea_adaptive").show();
//             $("#div_casea_natural_area").show();
//             $("#div_casea_vegetated_area").show();
//             $("#div_casea_natural_topography_percent").show();
//         }else{
//             $("#div_casea_total_site_area").hide();
//             $("#div_casea_adaptive").hide();
//             $("#div_casea_natural_topography_percent").hide();
//             $("#div_casea_natural_area").hide();
//             $("#div_casea_vegetated_area").hide();
//         }
     
    
//     });
//     let wcasea_vegetated_area = parseFloat($('#casea_vegetated_area').val()) || 0;
//     let wcasea_natural_area   = parseFloat($('#casea_natural_area').val()) || 0;
//     let wcasea_total_area     = parseFloat($('#casea_total_site_area').val()) || 0;
//     let wcasea_adaptive       = parseFloat($('#casea_adaptive').val()) || 0;

//     let wcasea_tot = wcasea_adaptive + wcasea_natural_area + wcasea_vegetated_area;

//     let wcasea_percent = (wcasea_tot > 0 && wcasea_total_area > 0)
//         ? (wcasea_tot / wcasea_total_area) * 100
//         : 0;

//     $('#casea_natural_topography_percent').val(wcasea_percent.toFixed(2));


//     $('#caseb_vegetation').change(function() {
//         if(this.checked) {
//             $("#div_caseb_total_site_area").show();
//             $("#div_caseb_natural_area").show();
//             $("#div_caseb_vegetated_area").show();
//             $("#div_caseb_vegetated_structure").show();
//             $("#div_caseb_total_area").show();
//             $("#div_caseb_percent").show();
//             $("#div_caseb_total_area_buildup").show();
//         }else{
//             $("#div_caseb_total_site_area").hide();
//             $("#div_caseb_natural_area").hide();
//             $("#div_caseb_vegetated_area").hide();
//             $("#div_caseb_vegetated_structure").hide();
//             $("#div_caseb_total_area").hide();
//             $("#div_caseb_percent").hide();
//             $("#div_caseb_total_area_buildup").hide();

//         }
       
//     });
//     let wcaseb_total_site_area    = parseFloat($('#caseb_total_site_area').val()) || 0;
//     let wcaseb_vegetated_area     = parseFloat($('#caseb_vegetated_area').val()) || 0;
//     let wcaseb_natural_area       = parseFloat($('#caseb_natural_area').val()) || 0;
//     let wcaseb_total_area         = parseFloat($('#caseb_total_area').val()) || 0;
//     let wcaseb_total_area_buildup = parseFloat($('#caseb_total_area_buildup').val()) || 0;

//     let wcaseb_tot = 
//         wcaseb_vegetated_area 
//         + wcaseb_natural_area 
//         + wcaseb_total_area 
//         + wcaseb_total_area_buildup;

//     let wcaseb_percent = (wcaseb_tot > 0 && wcaseb_total_site_area > 0)
//         ? (wcaseb_tot / wcaseb_total_site_area) * 100
//         : 0;
//     $('#caseb_percent').val(wcaseb_percent.toFixed(2));
// }

// if (subtab == "urban_heat_island") {
// $(document).ready(function () {
//     function updateRoof() {
//         if ($("input[name='heat_roof']").is(":checked")) {
//             $("#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_exemplary, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer").show()
//                 .find("input[type=text], textarea, select, input[type=checkbox], input[type=radio]").attr('required', true);
//         } else {
//             $("#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer").hide()
//                 .find("input[type=text], textarea, select, input[type=checkbox], input[type=radio]").removeAttr('required');
//             $("div#urban_narrative_doc, div#urban_roof_area_doc, div#test_certificate_doc, div#invoice_roof_doc, div#photos_roof_doc, div#developer_doc").hide();
//         }

//         if ($("input[name='heat_non_roof']").is(":checked")) {
//             $("#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration").show()
//                 .find("input[type=text], textarea, select, input[type=checkbox], input[type=radio]").attr('required', true);
//         } else {
//             $("#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration").hide()
//                 .find("input[type=text], textarea, select, input[type=checkbox], input[type=radio]").removeAttr('required');
//             $("div#total_exposed_non_roof_area_doc, div#exposed_area_of_high_sri_non_roof_doc, div#area_of_hardscape_non_roof_doc, div#heat_island_mitigation_non_roof_doc, div#non_roof_exemplary_performance_doc, div#non_roof_narrative_with_detailed_doc, div#non_roof_site_and_roof_area_plan_highlighting_doc, div#non_roof_sri_test_certificate_doc, div#non_roof_tax_invoice_of_materials_doc, div#non_roof_site_and_roof_photographs_doc, div#non_roof_developer_declaration_doc").hide();
//         }
//     }

//     function validateRoofCheckboxes() {
//         var errorDiv = $("#roof_error_div");
//         if (
//             !$("input[name='heat_roof']").is(":checked") &&
//             !$("input[name='heat_non_roof']").is(":checked")
//         ) {
//             if (errorDiv.length === 0) {
//                 $("<div id='roof_error_div' style='color:red;margin:10px 0;'>Please check at least one .</div>")
//                     .insertBefore("#div_exposed");
//             }
//             return false;
//         } else {
//             errorDiv.remove();
//             return true;
//         }
//     }

//     updateRoof();
//     // validateRoofCheckboxes();

//     $("input[name='heat_roof'], input[name='heat_non_roof']").change(function () {
//         if (!$(this).is(":checked")) {
//             let contentDivs;
//             if ($(this).attr("name") === 'heat_roof') {
//                 contentDivs = "#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer";
//             } else if ($(this).attr("name") === 'heat_non_roof') {
//                 contentDivs = "#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration";
//             }
//             if (contentDivs) {
//                 $(contentDivs)
//                     .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//                     .not("input[type=file]")
//                     .prop("checked", false)
//                     .val("")
//                     // .removeAttr('required');
//             }
//         }
//         updateRoof();
//         // validateRoofCheckboxes();
//     });

//     // Optional: form submission validation
//     // $("#rating_form").submit(function (e) {
//     //     if (!validateRoofCheckboxes()) {
//     //         e.preventDefault();
//     //     }
//     // });
// });

// }


if (subtab == "urban_heat_island") {
$(document).ready(function () {

    function updateRoof() {

        // ----- ROOF -----
        if ($("input[name='heat_roof']").is(":checked")) {
            $("#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_exemplary, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer").show();
        } else {
            $("#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_exemplary, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer").hide();

            $("div#urban_narrative_doc, div#urban_roof_area_doc, div#test_certificate_doc, div#invoice_roof_doc, div#photos_roof_doc, div#developer_doc").hide();
        }

        // ----- NON-ROOF -----
        if ($("input[name='heat_non_roof']").is(":checked")) {
            $("#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration").show();
        } else {
            $("#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration").hide();

            $("div#total_exposed_non_roof_area_doc, div#exposed_area_of_high_sri_non_roof_doc, div#area_of_hardscape_non_roof_doc, div#heat_island_mitigation_non_roof_doc, div#non_roof_exemplary_performance_doc, div#non_roof_narrative_with_detailed_doc, div#non_roof_site_and_roof_area_plan_highlighting_doc, div#non_roof_sri_test_certificate_doc, div#non_roof_tax_invoice_of_materials_doc, div#non_roof_site_and_roof_photographs_doc, div#non_roof_developer_declaration_doc").hide();
        }
    }

    updateRoof();

    $("input[name='heat_roof'], input[name='heat_non_roof']").change(function () {

        // CLEAR values when unchecked
        if (!$(this).is(":checked")) {

            let contentDivs;

            if ($(this).attr("name") === 'heat_roof') {
                contentDivs = "#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer";
            } else if ($(this).attr("name") === 'heat_non_roof') {
                contentDivs = "#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration";
            }

            if (contentDivs) {
                $(contentDivs)
                    .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                    .not("input[type=file]")
                    .prop("checked", false)
                    .val("");
            }
        }

        updateRoof();
    });

});
}
