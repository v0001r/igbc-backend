
 // Green Power - simplified format (same as tobacco_smoke_control)
if (subtab == "green_power") {
    existingGreenPower($("#green_power_select").val(), false);

    $("#green_power_select").change(function () {
        existingGreenPower($(this).val(), true);
    });
}

function existingGreenPower(value, clearData) {
    if (value === "On-site Renewable Energy") {
        // Show on-site fields
        $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power").show();

        // Hide off-site and off-set fields
        $("#div_annual_off_site, #div_gen_off_set, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site, #div_grid_off_set,#div_generation_onsite, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set").hide();

        if (clearData) {
            $("#div_annual_off_site, #div_gen_off_set, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site, #div_grid_off_set,#div_generation_onsite, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set")
                .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea")
                .not("input[type=file]")
                .prop("checked", false)
                .val("");

            $("#div_annual_off_site, #div_gen_off_set, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site, #div_grid_off_set,#div_generation_onsite, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set")
                .find("input[type='file']")
                .each(function () {
                    var $input = $(this);
                    $input.replaceWith($input.val('').clone(true));
                });
        }
    }
    else if (value === "Off-site Renewable Energy") {
        // Show off-site fields
        $("#div_annual_off_site, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site").show();

        // Hide on-site and off-set fields
        $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_grid_off_set,#div_generation_onsite, #div_gen_off_set, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set").hide();

        if (clearData) {
            $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_grid_off_set,#div_generation_onsite, #div_gen_off_set, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set")
                .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea")
                .not("input[type=file]")
                .prop("checked", false)
                .val("");

            $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_grid_off_set,#div_generation_onsite, #div_gen_off_set, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set")
                .find("input[type='file']")
                .each(function () {
                    var $input = $(this);
                    $input.replaceWith($input.val('').clone(true));
                });
        }
    }
    else if (value === "Off-set Grid Energy Use by Renewable Energy") {
        // Show off-set fields
        $("#div_grid_off_set,#div_generation_onsite, #div_gen_off_set, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set").show();

        // Hide on-site and off-site fields
        $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_annual_off_site, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site").hide();

        if (clearData) {
            $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_annual_off_site, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site")
                .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea")
                .not("input[type=file]")
                .prop("checked", false)
                .val("");

            $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_annual_off_site, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site")
                .find("input[type='file']")
                .each(function () {
                    var $input = $(this);
                    $input.replaceWith($input.val('').clone(true));
                });
        }
    }
    else {
        // No option selected - hide all
        $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_annual_off_site, #div_gen_off_set, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site, #div_grid_off_set,#div_generation_onsite, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set").hide();

        if (clearData) {
            $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_annual_off_site, #div_gen_off_set, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site, #div_grid_off_set, #div_generation_onsite, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set")
                .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea")
                .not("input[type=file]")
                .prop("checked", false)
                .val("");

            $("#div_annual_generation_green_power, #div_total_annual_energy_green_power, #div_total_annual_energy_green_power_re, #div_percentage_energy_solor, #div_narrative_green_power, #div_detailed_calculations_green_power, #div_layout_green_power, #div_purchase_invoice_green_power, #div_monthly_energy_bill_green_power, #div_energy_meter_reading_green_power, #div_geotagged_photograph_green_power, #div_annual_off_site, #div_gen_off_set, #div_generation_off_site, #div_building_off_site, #div_catered_off_site, #div_narrative_off_site, #div_detailed_off_site, #div_signed_client_off_site, #div_energy_bill_off_site, #div_geotagged_off_site, #div_grid_off_set,#div_generation_onsite, #div_gen_off_setsolar, #div_con_build_off_set, #div_eng_catered_off_set, #div_narrative_off_set, #div_detailed_off_set, #div_layout_locatio_off_set, #div_energy_highliting_total_off_set, #div_renewable_energy_off_set, #div_submit_company_off_set, #div_timestamped_off_set, #div_exemplary_off_set")
                .find("input[type='file']")
                .each(function () {
                    var $input = $(this);
                    $input.replaceWith($input.val('').clone(true));
                });
        }
    }
}








    if (subtab == "tobacco_smoke_control") {
        console.log("green_smoke_control");
    exisitingtobacco($("#green_smoke_control").val(), false); 
    
    $("#green_smoke_control").change(function () {
        exisitingtobacco($(this).val(), true); 
    });
    }

    function exisitingtobacco(value, clearData) { 
        console.log("entered function", value);
    if (value === "No Smoking") {
        console.log("triggered", value);
        // first option shows
        $("#div_narrative_hc,   #div_organisation_poly_hc,#div_site_plan_hc, #div_geotag_hc").show();

        // second option hides
        $("#div_narrative_outdoor_hc,#div_organisation_hc, #div_site_floor_hc,#div_stamped_designated_hc").hide();
        //third option hides
        $("div#narrative_outdoor_hc_doc,div#organisation_hc_doc,div#site_floor_hc_doc,div#stamped_designated_hc_doc,#div_narrative_smoke_hc,#div_org_allowed_smoking_hc, #div_location_smoking_hc,#div_design_smoking_hc, #div_showing_smoking_hc, div#narrative_smoke_hc_doc,div#org_allowed_smoking_hc_doc,div#location_smoking_hc_doc,div#design_smoking_hc_doc,div#showing_smoking_hc_doc").hide();




        // 'clearData' 
        if (clearData) { 
        // Clear the "Measurement approach" fields when switching to "Simulation Approach"
        $("#div_narrative_outdoor_hc,#div_organisation_hc, #div_site_floor_hc,#div_stamped_designated_hc,#div_narrative_smoke_hc,#div_org_allowed_smoking_hc, #div_location_smoking_hc,#div_design_smoking_hc, #div_showing_smoking_hc")
            .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") 
            .not("input[type=file]") // Ensure file inputs aren't cleared (which causes issues)
            .prop("checked", false)
            .val("");

        $("div#narrative_outdoor_hc_doc,div#organisation_hc_doc,div#site_floor_hc_doc,div#stamped_designated_hc_doc,div#narrative_smoke_hc_doc,div#org_allowed_smoking_hc_doc,div#location_smoking_hc_doc,div#design_smoking_hc_doc,div#showing_smoking_hc_doc")
            .find("input[type='file']")
            .each(function () {
                var $input = $(this);
                $input.replaceWith($input.val('').clone(true));
            });
        }
    } 
    else if (value === "Outdoor Smoking Areas") {
        console.log("triggered", value);
        $("#div_narrative_outdoor_hc,#div_organisation_hc, #div_site_floor_hc,#div_stamped_designated_hc").show();

        // option 01
         $("#div_narrative_hc,#div_site_plan_hc, #div_geotag_hc").hide();
       
        //option 03
        $("#div_narrative_smoke_hc, #div_organisation_poly_hc,#div_org_allowed_smoking_hc, #div_location_smoking_hc,#div_design_smoking_hc, #div_showing_smoking_hc").hide();
        $("div#narrative_hc_doc, div#organisation_poly_hc_doc,div#site_plan_hc_doc,div#geotag_hc_doc,div#narrative_smoke_hc_doc,div#org_allowed_smoking_hc_doc,div#location_smoking_hc_doc,div#design_smoking_hc_doc,div#showing_smoking_hc_doc").hide();

        //  'clearData' 
        if (clearData) {
        // Clear the "Simulation Approach" fields when switching to "Measurement approach"
        $("#div_narrative_hc, #div_organisation_poly_hc, #div_site_plan_hc, #div_geotag_hc, #div_narrative_smoke_hc,#div_org_allowed_smoking_hc, #div_location_smoking_hc,#div_design_smoking_hc, #div_showing_smoking_hc")
            .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") // Added textareas and radio
            .not("input[type=file]") // Ensure file inputs aren't cleared
            .prop("checked", false)
            .val("");

            $("div#narrative_hc_doc, div#organisation_poly_hc_doc,div#site_plan_hc_doc,div#geotag_hc_doc,div#narrative_smoke_hc_doc,div#org_allowed_smoking_hc_doc,div#location_smoking_hc_doc,div#design_smoking_hc_doc,div#showing_smoking_hc_doc")
            .find("input[type='file']")
            .each(function () {
                var $input = $(this);
                $input.replaceWith($input.val('').clone(true));
            });
        }
    }else if (value === "Designated Smoking Rooms") {
                console.log("triggered", value);

        $("#div_narrative_smoke_hc,#div_org_allowed_smoking_hc, #div_location_smoking_hc,#div_design_smoking_hc, #div_showing_smoking_hc").show();

        // option 01
        $("#div_narrative_hc, #div_organisation_hc,#div_site_plan_hc, #div_geotag_hc").hide();

        // option 02
        $("#div_narrative_outdoor_hc, #div_organisation_poly_hc,#div_organisation_hc, #div_site_floor_hc,#div_stamped_designated_hc").hide();
        $("div#narrative_hc_doc,div#organisation_hc_doc, div#organisation_poly_hc_doc,div#site_plan_hc_doc,div#geotag_hc_doc,div#narrative_outdoor_hc_doc,div#site_floor_hc_doc,div#stamped_designated_hc_doc").hide();
        //  'clearData' 
        if (clearData) {
        // Clear the "Simulation Approach" fields when switching to "Measurement approach"
        $("#div_narrative_hc, #div_organisation_hc,#div_site_plan_hc, #div_organisation_poly_hc, #div_geotag_hc,#div_narrative_outdoor_hc,#div_organisation_hc, #div_site_floor_hc,#div_stamped_designated_hc")
            .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") // Added textareas and radio
            .not("input[type=file]") // Ensure file inputs aren't cleared
            .prop("checked", false)
            .val("");

            $("div#narrative_hc_doc,div#organisation_hc_doc, div#organisation_poly_hc_doc,div#site_plan_hc_doc,div#geotag_hc_doc,div#narrative_outdoor_hc_doc,div#site_floor_hc_doc,div#stamped_designated_hc_doc")
            .find("input[type='file']")
            .each(function () {
                var $input = $(this);
                $input.replaceWith($input.val('').clone(true));
            });
        console.log("Simulation value cleared", value);
        }
    }
    
    else  {
    $("div#narrative_hc_doc, div#organisation_poly_hc_doc,div#site_plan_hc_doc,div#geotag_hc_doc,div#narrative_smoke_hc_doc,div#org_allowed_smoking_hc_doc,div#location_smoking_hc_doc,div#design_smoking_hc_doc,div#showing_smoking_hc_doc,div#narrative_hc_doc, div#organisation_poly_hc_doc,div#site_plan_hc_doc,div#geotag_hc_doc,div#narrative_smoke_hc_doc,div#org_allowed_smoking_hc_doc,div#location_smoking_hc_doc,div#design_smoking_hc_doc,div#showing_smoking_hc_doc,div#narrative_outdoor_hc_doc,div#organisation_hc_doc,div#site_floor_hc_doc,div#stamped_designated_hc_doc,#div_narrative_smoke_hc,#div_org_allowed_smoking_hc, #div_location_smoking_hc,#div_design_smoking_hc, #div_showing_smoking_hc, div#narrative_smoke_hc_doc,div#org_allowed_smoking_hc_doc,div#location_smoking_hc_doc,div#design_smoking_hc_doc,div#showing_smoking_hc_doc,#div_narrative_hc, #div_organisation_hc,#div_site_plan_hc, #div_organisation_poly_hc, #div_geotag_hc,#div_narrative_outdoor_hc,#div_organisation_hc, #div_site_floor_hc,#div_stamped_designated_hc,#div_narrative_smoke_hc,#div_org_allowed_smoking_hc, #div_location_smoking_hc,#div_design_smoking_hc, #div_showing_smoking_hc").hide();

    if (clearData) {
        $("#div_narrative_hc, #div_organisation_hc,#div_site_plan_hc, #div_organisation_poly_hc, #div_geotag_hc,#div_narrative_outdoor_hc,#div_organisation_hc, #div_site_floor_hc,#div_stamped_designated_hc,#div_narrative_smoke_hc,#div_org_allowed_smoking_hc, #div_location_smoking_hc,#div_design_smoking_hc, #div_showing_smoking_hc")
        .find(
            "input[type=radio], input[type=checkbox], select, input[type=text], textarea"
        )
        .not("input[type=file]")
        .prop("checked", false)
        .val("");
        $("div#narrative_hc_doc,div#organisation_hc_doc,div#site_plan_hc_doc,div#geotag_hc_doc,div#narrative_outdoor_hc_doc,div#site_floor_hc_doc,div#stamped_designated_hc_doc,div#narrative_smoke_hc_doc,div#org_allowed_smoking_hc_doc,div#location_smoking_hc_doc,div#design_smoking_hc_doc,div#showing_smoking_hc_doc")
            .find("input[type='file']")
            .each(function () {
                var $input = $(this);
                $input.replaceWith($input.val('').clone(true));
            });
    } 

    }
    }




    if (subtab == "rainwater_harvesting") {
    exisitinggreenpowerhar($("#select_caseab").val(), false); 
    
    $("#select_caseab").change(function () {
        exisitinggreenpowerhar($(this).val(), true); 
    });
    }

    function exisitinggreenpowerhar(value, clearData) { 
    if (value === "Case A: Rainwater harvesting system for roof and non-roof areas") {
        // first option shows
        $("#div_plumbing_narrative, #div_plumbing_rainfall,#div_rainwater_harvesting_annex, #div_plumbing_rain_harvesting,#div_plumbing_highlights,#div_plumbing_drawings,#div_plumbing_hydrology,#div_plumbing_photos").show();
        $("#div_proposed_rain_harvesting,#div_capacity_rainwater_harve,#div_meeting_mandatory_require,#div_water_goes_grd,#div_storage_for_reuse,#div_recharge_percen,#div_resue_percen").show();
        
        // second option hides
        $("#div_case_b_ex, #div_hydrological_water,div#hydrological_water_doc,div#case_b_ex_doc").hide();

    
        // 'clearData' 
        if (clearData) { 
        // Clear the "Measurement approach" fields when switching to "Simulation Approach"
        $("#div_case_b_ex, #div_hydrological_water")
            .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") 
            .not("input[type=file]") 
            .prop("checked", false)
            .val("");

        $("div#hydrological_water_doc,div#case_b_ex_doc")
            .find("input[type='file']")
            .each(function () {
                var $input = $(this);
                $input.replaceWith($input.val('').clone(true));
            });
        }
    } else if (value === "Case B: Groundwater table is less than 8 meter") {

        $("#div_case_b_ex, #div_hydrological_water").show();
                
        $("#div_plumbing_narrative, #div_plumbing_rainfall,#div_rainwater_harvesting_annex, #div_plumbing_rain_harvesting,#div_plumbing_highlights,#div_plumbing_drawings,#div_plumbing_hydrology,#div_plumbing_photos").hide();
        $("div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc,div#plumbing_highlights_doc,div#plumbing_drawings_doc,div#plumbing_hydrology_doc,div#plumbing_photos_doc").hide();
        $("#div_proposed_rain_harvesting,#div_capacity_rainwater_harve,#div_meeting_mandatory_require,#div_water_goes_grd,#div_storage_for_reuse,#div_recharge_percen,#div_resue_percen").hide();

    

        //  'clearData' 
        if (clearData) {
        // Clear the "Simulation Approach" fields when switching to "Measurement approach"
        $("#div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting,#div_plumbing_highlights,#div_plumbing_drawings,#div_plumbing_hydrology,#div_plumbing_photos")
            .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") // Added textareas and radio
            .not("input[type=file]") // Ensure file inputs aren't cleared
            .prop("checked", false)
            .val("");

            $("div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc,div#plumbing_highlights_doc,div#plumbing_drawings_doc,div#plumbing_hydrology_doc,div#plumbing_photos_doc")
            .find("input[type='file']")
            .each(function () {
                var $input = $(this);
                $input.replaceWith($input.val('').clone(true));
            });
        }
    }else  {
        $("#div_proposed_rain_harvesting,#div_capacity_rainwater_harve,#div_rainwater_harvesting_annex,#div_meeting_mandatory_require,#div_water_goes_grd,#div_storage_for_reuse,#div_recharge_percen,#div_resue_percen,#div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting,#div_plumbing_highlights,#div_plumbing_drawings,#div_plumbing_hydrology,#div_plumbing_photos,div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc,div#plumbing_highlights_doc,div#plumbing_drawings_doc,div#plumbing_hydrology_doc,div#plumbing_photos_doc,div#hydrological_water_doc,div#case_b_ex_doc, #div_case_b_ex, #div_hydrological_water").hide();

        // ONLY CLEAR IF clearData is TRUE (i.e., on change, not on initial load) 
            if (clearData) {
                $("#div_plumbing_narrative, #div_plumbing_rainfall,#div_rainwater_harvesting_annex, #div_plumbing_rain_harvesting,#div_plumbing_highlights,#div_plumbing_drawings,#div_plumbing_hydrology,#div_plumbing_photos, #div_case_b_ex, #div_hydrological_water")
                .find(
                    "input[type=radio], input[type=checkbox], select, input[type=text], textarea"
                )
                .not("input[type=file]")
                .prop("checked", false)
                .val("");
                $(",div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc,div#plumbing_highlights_doc,div#plumbing_drawings_doc,div#plumbing_hydrology_doc,div#plumbing_photos_doc,div#hydrological_water_doc,div#case_b_ex_doc")
                    .find("input[type='file']")
                    .each(function () {
                        var $input = $(this);
                        $input.replaceWith($input.val('').clone(true));
                    });
            } 

     }
    }

    // if (subtab == "project_details") {

    //     exisitinggreenpower($("#select_epi").val(), false);

    //     $("#select_epi").change(function () {
    //         exisitinggreenpower($(this).val(), true);
    //     });
    // }

    // function exisitinggreenpower(value, clearData) {

    //     if (value === "Epi Office") {
    //         $("#div_select_sub_office").show();
    //     } else {
    //         $("#div_select_sub_office").hide();
    //     }

    // }

    


// checkbox
      

    if (subtab == "minimum_fresh_air_requirements") {
        $(document).ready(function async() { 
            function exisitingUpdatevisibility() {

                // --- mechanically_ventilated_spaces---
                if ($("input[name='mechanically_ventilated_spaces']").is(":checked")) {
                    $("#div_narrative_stating_space, #div_cal_inficating_space, #div_highlighting_list_space, #div_test_results_space, #div_geotag_time_space").show();
                } else {
                    $("#div_narrative_stating_space, #div_cal_inficating_space, #div_highlighting_list_space, #div_test_results_space, #div_geotag_time_space").hide();
                    $("div#narrative_stating_space_doc,div#cal_inficating_space_doc,div#highlighting_list_space_doc,div#test_results_space_doc,div#geotag_time_space_doc").hide();
                }

                // --- non_air_conditioned_spaces ---
                if ($("input[name='non_air_conditioned_spaces']").is(":checked")) {
                    $("#div_narrative_spaces_non, #div_window_door_schedule_space, #div_details_installed_space, #div_building_elevations_space, #div_indicating_openable_space, #div_geotag_time_stamped_space").show();
                } else {
                    $("#div_narrative_spaces_non, #div_window_door_schedule_space, #div_details_installed_space, #div_building_elevations_space, #div_indicating_openable_space, #div_geotag_time_stamped_space").hide();
                    $("div#narrative_spaces_non_doc,div#window_door_schedule_space_doc,div#details_installed_space_doc,div#building_elevations_space_doc,div#indicating_openable_space_doc,div#geotag_time_stamped_space_doc").hide();
                }
            }

            
            exisitingUpdatevisibility();

            $(
                "input[name='mechanically_ventilated_spaces'], input[name='non_air_conditioned_spaces']"
            ).change(function async() {
                
                // If the box that triggered this change is now UNCHECKED, clear its related fields.
                if (!$(this).is(":checked")) {
                    
                    // Get the ID of the related content DIVs to clear
                    let contentDivs;
                    switch ($(this).attr("name")) {
                        case "mechanically_ventilated_spaces":
                            contentDivs = "#div_narrative_stating_space, #div_cal_inficating_space, #div_highlighting_list_space, #div_test_results_space, #div_geotag_time_space,div#narrative_stating_space_doc,div#cal_inficating_space_doc,div#highlighting_list_space_doc,div#test_results_space_doc,div#geotag_time_space_doc";
                            break;
                        case "non_air_conditioned_spaces":
                            contentDivs = "#div_narrative_spaces_non, #div_window_door_schedule_space, #div_details_installed_space, #div_building_elevations_space, #div_indicating_openable_space, #div_geotag_time_stamped_space,div#narrative_spaces_non_doc,div#window_door_schedule_space_doc,div#details_installed_space_doc,div#building_elevations_space_doc,div#indicating_openable_space_doc,div#geotag_time_stamped_space_doc";
                            break;
                        default:
                            contentDivs = "";
                    }

                    // Clear the content fields within the hidden section
                    if (contentDivs) {
                        $(contentDivs)
                            .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                            .prop("checked", false).val('');

                    //  $(contentDivs).each(function () {
                    //     var $input = $(this);
                    //     $input.replaceWith($input.val('').clone(true));
                    // });
                        $(contentDivs)
                            .find("input[type='file']")
                            .each(function () {
                                var $input = $(this);
                                $input.replaceWith($input.val('').clone(true));
                            });
                    }
                }

                // After handling any necessary data clearing, update the view for all sections.
                exisitingUpdatevisibility();
            });
        }); 
    }



    
        if (subtab == "enhanced_indoor_environment_quality") {
            $(document).ready(function () { 
                // This is safe to run on page load because it never deletes or resets data.
                function qualityexisiting() {

                    // --- enhanced_ventilation_spaces ---
                    if ($("input[name='enhanced_ventilation_spaces']").is(":checked")) {
                        $("#div_cfm_required_space,#div_single_annex, #div_outdoor_annex, #div_cfm_provided_space, #div_percentage_improvement_space_indoor").show();
                        $("#div_narrative_spaces_indoor_non, #div_window_door_schedule_space_indoor, #div_details_installed_space_indoor, #div_building_elevations_space_indoor, #div_indicating_openable_space_indoor, #div_geotag_time_stamped_space_indoor").show();
                    } else {
                        $("#div_cfm_required_space, #div_cfm_provided_space,#div_single_annex, #div_outdoor_annex, #div_percentage_improvement_space_indoor").hide();
                        $("#div_narrative_spaces_indoor_non, #div_window_door_schedule_space_indoor, #div_details_installed_space_indoor, #div_building_elevations_space_indoor, #div_indicating_openable_space_indoor, #div_geotag_time_stamped_space_indoor").hide();
                        $("div#narrative_spaces_indoor_non_doc,div#window_door_schedule_space_indoor_doc,div#details_installed_space_indoor_doc,div#building_elevations_space_indoor_doc,div#indicating_openable_space_indoor_doc,div#geotag_time_stamped_space_indoor_doc").hide();
                    }

                    // --- monitor iaq ---
                    if ($("input[name='monitor_iaq_parameters_spaces']").is(":checked")) {
                        $("#div_monitor_iaq_parameters_space, #div_narrative_indicating_space, #div_parameter_report, #div_quarterly_monitoring, #div_location_sensors, #div_stamped_photo").show();
                    } else {
                        $("#div_monitor_iaq_parameters_space, #div_narrative_indicating_space, #div_parameter_report, #div_quarterly_monitoring, #div_location_sensors, #div_stamped_photo").hide();
                        $("div#monitor_iaq_parameters_space_doc,div#narrative_indicating_space_doc,div#parameter_report_doc,div#quarterly_monitoring_doc,div#location_sensors_doc,div#stamped_photo_doc").hide();
                    }

                    // ---thermal comfort ---
                    if ($("input[name='thermal_comfort']").is(":checked")) {
                        $("#div_thermal_comfort_strategies, #div_indoor_temp_rh").show();
                    } else {
                        $("#div_thermal_comfort_strategies, #div_indoor_temp_rh").hide();
                        $("div#thermal_comfort_strategies_doc, div#indoor_temp_rh_doc").hide();
                    }

                    // --- daylight ---
                    if ($("input[name='daylight_access']").is(":checked")) {
                        $("#div_compliant_area, #div_total_area_daylight, #div_regularly_occupied_area").show();
                        $("#div_narrative_daylight, #div_site_building_daylight, #div_floor_plan_daylight,#div_report_analysis_daylight, #div_cutsheet_installed_glass, #div_photo_graphs_interiors, #div_purchase_invoice_daylight").show();
                    } else {
                        $("#div_compliant_area, #div_total_area_daylight, #div_regularly_occupied_area").hide();
                        $("#div_narrative_daylight, #div_site_building_daylight, #div_floor_plan_daylight,#div_report_analysis_daylight, #div_cutsheet_installed_glass, #div_photo_graphs_interiors, #div_purchase_invoice_daylight").hide();
                        $("div#narrative_daylight_doc,div#site_building_daylight_doc,div#floor_plan_daylight_doc,div#report_analysis_daylight_doc,div#cutsheet_installed_glass_doc,div#photo_graphs_interiors_doc,div#purchase_invoice_daylight_doc").hide();
                    }

                    // --- acoustical ---
                    if ($("input[name='acoustical_parameters']").is(":checked")) {
                        $("#div_regularly_area_para, #div_total_area_para, #div_occupied_area_para").show();
                        $("#div_narrative_para,#div_highithin_area,  #div_indicating_levels_para, #div_recommedation_para,#div_cutsheet_insulation_para, #div_photographs_para").show();
                    } else {
                        $("#div_regularly_area_para, #div_total_area_para, #div_occupied_area_para,#div_narrative_para,#div_highithin_area, #div_indicating_levels_para, #div_recommedation_para,#div_cutsheet_insulation_para, #div_photographs_para").hide();
                        $("div#narrative_para_doc, div#highithin_area_doc,div#indicating_levels_para_doc,div#recommedation_para_doc,div#cutsheet_insulation_para_doc,div#photographs_para_doc").hide();
                    }

                    //olfactory
                    if ($("input[name='olfactory_parameters_eng']").is(":checked")) {
                        $("#div_narrative_fac, #div_isolated_space_factory, #div_exhaust_system_factroy,#div_measure_undertaken_factroy").show();
                    } else {
                        $("#div_narrative_fac, #div_isolated_space_factory, #div_exhaust_system_factroy,#div_measure_undertaken_factroy").hide();
                        $("div#narrative_fac_doc,div#isolated_space_factory_doc,div#exhaust_system_factroy_doc,div#measure_undertaken_factroy_doc").hide();
                    }
                }

                
                qualityexisiting();

                $(
                    "input[name='enhanced_ventilation_spaces'], input[name='monitor_iaq_parameters_spaces'], input[name='daylight_access'], input[name='thermal_comfort'], input[name='acoustical_parameters'], input[name='olfactory_parameters_eng']").change(function () {
                    
                    // If the box that triggered this change is now UNCHECKED, clear its related fields.
                    if (!$(this).is(":checked")) {
                        
                        // Get the ID of the related content DIVs to clear
                        let contentDivs;
                        switch ($(this).attr("name")) {
                            case "enhanced_ventilation_spaces":
                                contentDivs = "#div_cfm_required_space,#div_single_annex, #div_outdoor_annex, #div_cfm_provided_space, #div_percentage_improvement_space_indoor,#div_narrative_spaces_indoor_non, #div_window_door_schedule_space_indoor, #div_details_installed_space_indoor, #div_building_elevations_space_indoor, #div_indicating_openable_space_indoor, #div_geotag_time_stamped_space_indoor,div#narrative_spaces_indoor_non_doc,div#window_door_schedule_space_indoor_doc,div#details_installed_space_indoor_doc,div#building_elevations_space_indoor_doc,div#indicating_openable_space_indoor_doc,div#geotag_time_stamped_space_indoor_doc";
                                break;
                            case "monitor_iaq_parameters_spaces":
                                contentDivs = "#div_monitor_iaq_parameters_space, #div_narrative_indicating_space, #div_parameter_report, #div_quarterly_monitoring, #div_location_sensors, #div_stamped_photo,div#monitor_iaq_parameters_space_doc,div#narrative_indicating_space_doc,div#parameter_report_doc,div#quarterly_monitoring_doc,div#location_sensors_doc,div#stamped_photo_doc";
                                break;
                            case "thermal_comfort":
                                contentDivs = "#div_thermal_comfort_strategies, #div_indoor_temp_rh, div#thermal_comfort_strategies_doc, div#indoor_temp_rh_doc";
                                break;
                            case "daylight_access":
                                contentDivs = "#div_narrative_daylight, #div_site_building_daylight, #div_floor_plan_daylight,#div_report_analysis_daylight, #div_cutsheet_installed_glass, #div_photo_graphs_interiors, #div_purchase_invoice_daylight,div#narrative_daylight_doc,div#site_building_daylight_doc,div#floor_plan_daylight_doc,div#report_analysis_daylight_doc,div#cutsheet_installed_glass_doc,div#photo_graphs_interiors_doc,div#purchase_invoice_daylight_doc";
                                break;
                            case 'acoustical_parameters':
                                contentDivs = '#div_regularly_area_para, #div_total_area_para, #div_occupied_area_para,#div_narrative_para,#div_highithin_area, #div_indicating_levels_para, #div_recommedation_para,#div_cutsheet_insulation_para, #div_photographs_para,div#narrative_para_doc, div#highithin_area_doc,div#indicating_levels_para_doc,div#recommedation_para_doc,div#cutsheet_insulation_para_doc,div#photographs_para_doc';
                                break;
                            case 'olfactory_parameters_eng':
                                contentDivs = '#div_narrative_fac, #div_isolated_space_factory, #div_exhaust_system_factroy,#div_measure_undertaken_factroy,div#narrative_fac_doc,div#isolated_space_factory_doc,div#exhaust_system_factroy_doc,div#measure_undertaken_factroy_doc';
                                break;
                            default:
                                contentDivs = "";
                        }

                        // Clear the content fields within the hidden section
                        if (contentDivs) {
                            $(contentDivs)
                                .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                                .prop("checked", false).val('');

                            $(contentDivs)
                                .find("input[type='file']")
                                .each(function () {
                                    var $input = $(this);
                                    $input.replaceWith($input.val('').clone(true));
                                });
                        }
                    }
                    qualityexisiting();
                });
            }); 
        }



        if (subtab == "green_education") {
        $(document).ready(function () { 
            function existingreenedu() {

                // --- mechanically_ventilated_spaces---
                if ($("input[name='awarness_green_education']").is(":checked")) {
                    $("#div_relevant_applicable_documents, #div_photographs_green_education").show();
                } else {
                    $("#div_relevant_applicable_documents, #div_photographs_green_education").hide();
                    $("div#relevant_applicable_documents_doc,div#photographs_green_education_doc").hide();}

                // --- non_air_conditioned_spaces ---
                if ($("input[name='educa_on']").is(":checked")) {
                    $("#div_crediy_comp, #div_photographs_showing_measure").show();
                } else {
                    $("#div_crediy_comp, #div_photographs_showing_measure").hide();
                    $("div#crediy_comp_doc,div#photographs_showing_measure_doc").hide();}
            }

            
            existingreenedu();

            $(
                "input[name='awarness_green_education'], input[name='educa_on']"
            ).change(function () {
                
                // If the box that triggered this change is now UNCHECKED, clear its related fields.
                if (!$(this).is(":checked")) {
                    
                    // Get the ID of the related content DIVs to clear
                    let contentDivs;
                    switch ($(this).attr("name")) {
                        case "awarness_green_education":
                            contentDivs = "#div_relevant_applicable_documents, #div_photographs_green_education,div#relevant_applicable_documents_doc,div#photographs_green_education_doc";
                            break;
                        case "educa_on":
                            contentDivs = "#div_crediy_comp, #div_photographs_showing_measure,div#crediy_comp_doc,div#photographs_showing_measure_doc";
                            break;
                        default:
                            contentDivs = "";
                    }

                    // Clear the content fields within the hidden section
                    if (contentDivs) {
                        $(contentDivs)
                            .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                            .prop("checked", false).val('');

                        $(contentDivs)
                            .find("input[type='file']")
                            .each(function () {
                                var $input = $(this);
                                $input.replaceWith($input.val('').clone(true));
                            });
                    }
                }

                // After handling any necessary data clearing, update the view for all sections.
                existingreenedu();
            });
        }); 
    }


    if (subtab == "enhanced_waste_managementv") {
        $(document).ready(function () { 
            //    var clearedFiles = {};
            function existingreenedu() {

                // --- mechanically_ventilated_spaces---
                if ($("input[name='dry_waste_reduction']").is(":checked")) {
                    $("#div_dry_water_gene, #div_data_year_before_previous_year, #div_percentage_reduction").show();
                    $("#div_enhanced_waste_narrative, #div_enhanced_waste, #div_enhanced_waste_consent, #div_enhanced_waste_letter, #div_enhanced_waste_green_practices, #div_enhanced_waste_geotag_project,#div_enhanced_waste_list_of_waste,#div_calculation_highlighting").show();
                } else {
                    $("#div_dry_water_gene, #div_data_year_before_previous_year, #div_percentage_reduction").hide();
                    $("#div_enhanced_waste_narrative, #div_enhanced_waste, #div_enhanced_waste_consent, #div_enhanced_waste_letter, #div_enhanced_waste_green_practices, #div_enhanced_waste_geotag_project,#div_enhanced_waste_list_of_waste,#div_calculation_highlighting").hide();
                    $("div#enhanced_waste_narrative_doc, div#enhanced_waste_doc, div#enhanced_waste_consent_doc, div#enhanced_waste_letter_doc, div#enhanced_waste_green_practices_doc, div#enhanced_waste_geotag_project_doc, div#enhanced_waste_list_of_waste_doc, div#calculation_highlighting_doc").hide();
                }
                // --- non_air_conditioned_spaces ---
                if ($("input[name='dry_waste_recycling_resue']").is(":checked")) {
                    $("#div_dry_waste, #div_dry_waste_enhanced_waste, #div_dry_waste_enhanced_waste_consent, #div_dry_waste_enhanced_waste_letter, #div_dry_waste_enhanced_waste_renovation, #div_dry_waste_stamped,#div_manufacturer_certificate_dry").show();
                } else {
                    $("#div_dry_waste, #div_dry_waste_enhanced_waste, #div_dry_waste_enhanced_waste_consent, #div_dry_waste_enhanced_waste_letter, #div_dry_waste_enhanced_waste_renovation, #div_dry_waste_stamped,#div_manufacturer_certificate_dry").hide();
                    $("div#dry_waste_doc, div#dry_waste_enhanced_waste_doc, div#dry_waste_enhanced_waste_consent_doc, div#dry_waste_enhanced_waste_letter_doc, div#dry_waste_enhanced_waste_renovation_doc, div#dry_waste_stamped_doc, div#manufacturer_certificate_dry_doc").hide();

                }
                if ($("input[name='wet_waste_composting']").is(":checked")) {
                    $("#div_details_converted_preceding, #div_enhanced_waste_photos, #div_location_organic_waste, #div_payment_organic_wet, #div_wet_stamped_showing").show();
                } else {
                    $("#div_details_converted_preceding, #div_enhanced_waste_photos, #div_location_organic_waste, #div_payment_organic_wet, #div_wet_stamped_showing").hide();
                    $("div#details_converted_preceding_doc, div#enhanced_waste_photos_doc, div#location_organic_waste_doc, div#payment_organic_wet_doc, div#wet_stamped_showing_doc").hide();

                }

            }
            existingreenedu();

            $(
                "input[name='dry_waste_reduction'], input[name='dry_waste_recycling_resue'], input[name='wet_waste_composting']"
            ).change(function () {
                
                // If the box that triggered this change is now UNCHECKED, clear its related fields.
                if (!$(this).is(":checked")) {
                    
                    // Get the ID of the related content DIVs to clear
                    let contentDivs;
                    let docMarker;

                    switch ($(this).attr("name")) {
                        case "dry_waste_reduction":
                            contentDivs = "#div_dry_water_gene, #div_data_year_before_previous_year, #div_percentage_reduction,#div_enhanced_waste_narrative, #div_enhanced_waste, #div_enhanced_waste_consent, #div_enhanced_waste_letter, #div_enhanced_waste_green_practices, #div_enhanced_waste_geotag_project,#div_enhanced_waste_list_of_waste,#div_calculation_highlighting,#div_enhanced_waste_narrative, #div_enhanced_waste, #div_enhanced_waste_consent, #div_enhanced_waste_letter, #div_enhanced_waste_green_practices, #div_enhanced_waste_geotag_project,#div_enhanced_waste_list_of_waste,#div_calculation_highlighting";
                            // docMarker = "div#enhanced_waste_narrative_doc, div#enhanced_waste_doc, div#enhanced_waste_consent_doc, div#enhanced_waste_letter_doc, div#enhanced_waste_green_practices_doc, div#enhanced_waste_geotag_project_doc, div#enhanced_waste_list_of_waste_doc, div#calculation_highlighting_doc";
                            break;
                        case "dry_waste_recycling_resue":
                            contentDivs = "#div_dry_waste, #div_dry_waste_enhanced_waste, #div_dry_waste_enhanced_waste_consent, #div_dry_waste_enhanced_waste_letter, #div_dry_waste_enhanced_waste_renovation, #div_dry_waste_stamped,#div_manufacturer_certificate_dry,div#dry_waste_doc, div#dry_waste_enhanced_waste_doc, div#dry_waste_enhanced_waste_consent_doc, div#dry_waste_enhanced_waste_letter_doc, div#dry_waste_enhanced_waste_renovation_doc, div#dry_waste_stamped_doc, div#manufacturer_certificate_dry_doc";
                            // docMarker = "div#dry_waste_doc, div#dry_waste_enhanced_waste_doc, div#dry_waste_enhanced_waste_consent_doc, div#dry_waste_enhanced_waste_letter_doc, div#dry_waste_enhanced_waste_renovation_doc, div#dry_waste_stamped_doc, div#manufacturer_certificate_dry_doc";
                            break;
                        case "wet_waste_composting":
                            contentDivs = "#div_details_converted_preceding, #div_enhanced_waste_photos, #div_location_organic_waste, #div_payment_organic_wet, #div_wet_stamped_showing,div#details_converted_preceding_doc, div#enhanced_waste_photos_doc, div#location_organic_waste_doc, div#payment_organic_wet_doc, div#wet_stamped_showing_doc";
                            // docMarker = "div#details_converted_preceding_doc, div#enhanced_waste_photos_doc, div#location_organic_waste_doc, div#payment_organic_wet_doc, div#wet_stamped_showing_doc"
                            break;
                        default:
                            // docMarker = "";
                            contentDivs = "";
                    }

                    // Clear the content fields within the hidden section
                    if (contentDivs) {
                        $(contentDivs)
                            .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                            .prop("checked", false).val('');

                        $(contentDivs)
                            .find("input[type='file']")
                            .each(function () {
                                var $input = $(this);
                                $input.val('').clone(true);
                                // $input.replaceWith($input.val('').clone(true));
                            });

                            // if (docMarker) {
                            //     clearedFiles[docMarker] = true;
                            // }
                    }
                }

                // After handling any necessary data clearing, update the view for all sections.
                existingreenedu();
            });
        }); 
    }
    



     if (subtab == "sustainable_retrofitting") {
            $(document).ready(function () { 
                function existingretrofit() {

                    // --- enhanced_ventilation_spaces ---
                    if ($("input[name='eco_labelled']").is(":checked")) {
                        $("#div_select_radio").show();
                        $("#div_sustainable_narrative, #div_procured_materials_list, #div_greenpro_certificate, #div_used_eco, #div_greenpro_geotag").show();
                    } else {
                        $("#div_sustainable_narrative, #div_procured_materials_list, #div_greenpro_certificate, #div_used_eco, #div_greenpro_geotag").hide();
                        $("div#sustainable_narrative_doc,div#procured_materials_list_doc,div#greenpro_certificate_doc,div#used_eco_doc,div#greenpro_geotag_doc").hide();
                        $("#div_select_radio").hide();
                    }

                    if ($("input[name='sus_pro_policy']").is(":checked")) {
                        $("#div_signed_sustainable_policy").show();
                    } else {
                            $("#div_signed_sustainable_policy").hide();
                            $("div#signed_sustainable_policy_doc").hide();
                    }

                }
                existingretrofit();
                $(
                    "input[name='eco_labelled'], input[name='sus_pro_policy']"
                ).change(function () {
                    
                    if (!$(this).is(":checked")) {

                        let contentDivs;
                        switch ($(this).attr("name")) {
                            case "eco_labelled":
                                contentDivs = "div_select_radio, div#sustainable_narrative_doc,div#procured_materials_list_doc,div#greenpro_certificate_doc,div#used_eco_doc,div#greenpro_geotag_doc,#div_sustainable_narrative, #div_procured_materials_list, #div_greenpro_certificate, #div_used_eco, #div_greenpro_geotag";
                                break;
                            case "sus_pro_policy":
                                contentDivs = "div_signed_sustainable_policy, div#signed_sustainable_policy_doc";
                                break;
                            default:
                                contentDivs = "";
                        }

                        // Clear the content fields within the hidden section
                        if (contentDivs) {
                            $(contentDivs)
                                .find("input[type=checkbox], input[type=radio], input[type=text], select, textarea")
                                .prop("checked", false).val('');

                            $(contentDivs)
                                .find("input[type='file']")
                                .each(function () {
                                    var $input = $(this);
                                    $input.replaceWith($input.val('').clone(true));
                                });
                        }
                    }
                    existingretrofit();
                });
            }); 
     }
    


     if (subtab == "urban_heat_island") {
            $(document).ready(function () { 
                function existingUrban() {

                    // --- enhanced_ventilation_spaces ---
                    if ($("input[name='urban_heat_island_mitigation']").is(":checked")) {
                        $("#div_narrative_with_detailed,#div_per_treated_roof,#div_exposed_islad_annex, #div_site_and_roof_area_plan_highlighting, #div_sri_test_certificate, #div_tax_invoice_of_materials,#div_sustainable_design_photographs,#div_geo_photo").show();
                    } else {
                        $("#div_narrative_with_detailed,#div_per_treated_roof,#div_exposed_islad_annex, #div_site_and_roof_area_plan_highlighting, #div_sri_test_certificate, #div_tax_invoice_of_materials,#div_sustainable_design_photographs,#div_geo_photo").hide();
                        $("div#narrative_with_detailed_doc,div#site_and_roof_area_plan_highlighting_doc,div#exposed_islad_annex_doc, div#sri_test_certificate_doc,div#tax_invoice_of_materials_doc,div#sustainable_design_photographs_doc,div#geo_photo_doc").hide();

                    }

                    if ($("input[name='non_roof_impervious_area']").is(":checked")) {
                        $("#div_site_plan_non,#div_cal_of_non_roof_area,#div_per_treated_non_roof,#div_urban_heat_annex, #div_receipt_high, #div_nabl_test,#div_stamped_reduce").show();
                    } else {
                            $("#div_site_plan_non, #div_cal_of_non_roof_area,#div_per_treated_non_roof,#div_urban_heat_annex, #div_receipt_high, #div_nabl_test,#div_stamped_reduce").hide();
                            $("div#site_plan_non_doc,div#cal_of_non_roof_area_doc, div#receipt_high_doc,div#urban_heat_annex_doc,div#_nabl_test_doc,div#stamped_reduce_doc").hide();
                        }

                }
                existingUrban();
                $(
                    "input[name='urban_heat_island_mitigation'], input[name='non_roof_impervious_area']"
                ).change(function () {
                    
                    if (!$(this).is(":checked")) {

                        let contentDivs;
                        switch ($(this).attr("name")) {
                            case "urban_heat_island_mitigation":
                                contentDivs = "#div_narrative_with_detailed,#div_per_treated_roof,#div_exposed_islad_annex, #div_site_and_roof_area_plan_highlighting, #div_sri_test_certificate, #div_tax_invoice_of_materials,#div_sustainable_design_photographs,#dvi_geo_photo,div#narrative_with_detailed_doc,div#site_and_roof_area_plan_highlighting_doc,div#sri_test_certificate_doc,div#tax_invoice_of_materials_doc,div#sustainable_design_photographs_doc,div#dvi_geo_photo_doc ";
                                break;
                            case "non_roof_impervious_area":
                                contentDivs = "#div_site_plan_non,#div_per_treated_non_roof,#div_urban_heat_annex, #div_receipt_high,#div_cal_of_non_roof_area, #div_nabl_test,#div_stamped_reduce,div#non_roof_impervious_area_doc, div#site_plan_non_doc, div#receipt_high_doc,div#_nabl_test_doc,div#stamped_reduce_doc";
                                break;
                            default:
                                contentDivs = "";
                        }

                        // Clear the content fields within the hidden section
                        if (contentDivs) {
                            $(contentDivs)
                                .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                                .prop("checked", false).val('');

                            $(contentDivs)
                                .find("input[type='file']")
                                .each(function () {
                                    var $input = $(this);
                                    $input.replaceWith($input.val('').clone(true));
                                });
                        }
                    }
                    existingUrban();
                });
            }); 
     }


     if (subtab == "eco_friendly_commuting") {
            $(document).ready(function () { 
                function existingCommuting() {

                    // --- enhanced_ventilation_spaces ---
                    if ($("input[name='public_transport']").is(":checked")) {
                        $("#div_total_permanents, #div_total_permanen_ecos, #div_occupants_public_transport").show();
                        $("#div_narrative_eco_nar, #div_commuting_practices_eco, #div_detailed_indicating_occupants,#div_eco_friendly_photographs_eco").show();
                    } else {
                        $("#div_total_permanents, #div_total_permanen_ecos, #div_occupants_public_transport").hide();
                        $("#div_narrative_eco_nar, #div_commuting_practices_eco, #div_detailed_indicating_occupants,#div_eco_friendly_photographs_eco").hide();
                        $("div#narrative_eco_nar_doc,div#commuting_practices_eco_doc,div#detailed_indicating_occupants_doc,div#eco_friendly_photographs_eco_doc").hide();


                    }

                    if ($("input[name='shuttel_service_eco']").is(":checked")) {
                        $("#div_permanent_eco, #div_using_service_eco, #div_occupants_shutter_eco").show();
                        $("#div_narrative_shutter_eco, #div_contract_project").show();
                    } else {
                         $("#div_permanent_eco, #div_using_service_eco, #div_occupants_shutter_eco").hide();
                        $("#div_narrative_shutter_eco, #div_contract_project, #div_narrative_shutter_eco_doc, div#contract_project_doc").hide();
                    }

                }
                existingCommuting();
                $(
                    "input[name='public_transport'], input[name='shuttel_service_eco']"
                ).change(function () {
                    
                    if (!$(this).is(":checked")) {

                        let contentDivs;
                        switch ($(this).attr("name")) {
                            case "public_transport":
                                contentDivs = "#div_total_permanents, #div_total_permanen_ecos, #div_occupants_public_transport,#div_narrative_eco_nar, #div_commuting_practices_eco, #div_detailed_indicating_occupants,#div_eco_friendly_photographs_eco,div#narrative_eco_nar_doc,div#commuting_practices_eco_doc,div#detailed_indicating_occupants_doc,div#eco_friendly_photographs_eco_doc";
                                break;
                            case "shuttel_service_eco":
                                contentDivs = "#div_permanent_eco, #div_using_service_eco, #div_occupants_shutter_eco,#div_narrative_shutter_eco, #div_contract_project, #div_narrative_shutter_eco_doc, div#contract_project_doc";
                                break;
                            default:
                                contentDivs = "";
                        }

                        // Clear the content fields within the hidden section
                        if (contentDivs) {
                            $(contentDivs)
                                .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                                .prop("checked", false).val('');

                            $(contentDivs)
                                .find("input[type='file']")
                                .each(function () {
                                    var $input = $(this);
                                    $input.replaceWith($input.val('').clone(true));
                                });
                        }
                    }
                    existingCommuting();
                });
            }); 
     }



     if (subtab == "building_operations_maintenance") {
            $(document).ready(function () { 
                function existingOperations() {

                    // --- enhanced_ventilation_spaces ---
                    if ($("input[name='is_maintenance_plan_systems']").is(":checked")) {
                        // $("#div_public_transport").show();
                        $("#div_hvac_chiller, #div_waster_sys, #div_divder_line, #div_waster_sys, #div_onsite_engergy, #div_rain_har, #div_power_sys, #div_elevators_escalators,#div_building_sys").show();
                        $("#div_building_operations_narrative, #div_annual_maintenance_contracts").show();
                    } else {
                        $("#div_building_operations_narrative, #div_divder_line,#div_annual_maintenance_contracts").hide();
                        $("div#building_operations_narrative_doc,div#annual_maintenance_contracts_doc").hide();
                        $("#div_hvac_chiller, #div_waster_sys,  #div_waster_sys, #div_onsite_engergy, #div_rain_har, #div_power_sys, #div_elevators_escalators,#div_building_sys").hide();
                    }

                    if ($("input[name='bulding_energy']").is(":checked")) {
                        $("#div_energy_and_water_assessment_report,#div_audit_report, #div_water_report, #div_building_narr").show();
                    } else {
                         $("#div_energy_and_water_assessment_report, #div_building_narr,#div_audit_report, #div_water_report,div#audit_report_doc, div#water_report_doc, div#building_narr_doc, div#energy_and_water_assessment_report_doc").hide();}

                }
                existingOperations();
                $(
                    "input[name='is_maintenance_plan_systems'], input[name='bulding_energy']"
                ).change(function () {
                    
                    if (!$(this).is(":checked")) {

                        let contentDivs;
                        switch ($(this).attr("name")) {
                            case "is_maintenance_plan_systems":
                                contentDivs = "#div_public_transport,#div_hvac_chiller, #div_divder_line, #div_waster_sys,  #div_waster_sys, #div_onsite_engergy, #div_rain_har, #div_power_sys, #div_elevators_escalators,#div_building_sys, #div_building_operations_narrative, #div_annual_maintenance_contracts,div#building_operations_narrative_doc,div#annual_maintenance_contracts_doc";
                                break;
                            case "bulding_energy":
                                contentDivs = "#div_energy_and_water_assessment_report,#div_audit_report, #div_water_report, #div_building_narr,div#audit_report_doc, div#water_report_doc, div#building_narr_doc, div#energy_and_water_assessment_report_doc";
                                break;
                            default:
                                contentDivs = "";
                        }

                        // Clear the content fields within the hidden section
                        if (contentDivs) {
                            $(contentDivs)
                                .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                                .prop("checked", false).val('');

                            $(contentDivs)
                                .find("input[type='file']")
                                .each(function () {
                                    var $input = $(this);
                                    $input.replaceWith($input.val('').clone(true));
                                });
                        }
                    }
                    existingOperations();
                });
            }); 
     }



     if (subtab == "building_performance_dashboard") {
            $(document).ready(function () { 
                function existingOperations() {

                    // --- enhanced_ventilation_spaces ---
                    if ($("input[name='monitoring_energy_consumption']").is(":checked")) {
                        $("#div_building_operations_narrative_dash, #div_sechematic_bms_installed, #div_monitoring_system_details,#div_system_dashboard_details,#div_meter_installed_details,#div_water_meter_photographs,#div_total_water_consumption_data, #div_project_comm_one").show();
                    } else {
                        $("#div_building_operations_narrative_dash, #div_sechematic_bms_installed, #div_monitoring_system_details,#div_system_dashboard_details,#div_meter_installed_details,#div_water_meter_photographs,#div_total_water_consumption_data, #div_project_comm_one").hide();
                        $("div#building_operations_narrative_dash_doc,div#sechematic_bms_installed_doc,div#monitoring_system_details_doc,div#system_dashboard_details_doc,div#meter_installed_details_doc,div#water_meter_photographs_doc,div#total_water_consumption_data_doc, div#project_comm_one_doc").hide();
                    }

                    if ($("input[name='monitoring_con']").is(":checked")) {
                        $("#div_narrative_con,#div_diagram_bms_installed, #div_system_pro,#div_installed_project,#div_water_meter_pro,#div_share_total,  #div_project_comm_two").show();
                    } else {
                        $("#div_narrative_con,#div_diagram_bms_installed, #div_system_pro,#div_installed_project,#div_water_meter_pro,#div_share_total,#div_project_comm_two").hide();
                        $("div#narrative_con_doc, div#diagram_bms_installed_doc, div#system_pro_doc, div#installed_project_doc, div#water_meter_pro_doc, div#share_total_doc, div#project_comm_two_doc").hide();
                    }

                    if ($("input[name='indoor_air_quality']").is(":checked")) {
                        $("#div_sehematic_m,#div_system_project, #div_installed_pro,#div_sensors_installed_photographs,#div_perfor, #div_project_comm_three").show();
                    } else {
                        $("#div_sehematic_m,#div_system_project, #div_installed_pro,#div_sensors_installed_photographs,#div_perfor,#div_project_comm_three").hide();
                        $("div#sehematic_m_doc, div#system_project_doc, div#installed_pro_doc, div#sensors_installed_photographs_doc, div#perfor_doc, div#project_comm_three_doc").hide();
                    }
                }    
                existingOperations();
                $(
                    "input[name='monitoring_energy_consumption'], input[name='monitoring_con'],input[name='indoor_air_quality']"
                ).change(function () {
                    
                    if (!$(this).is(":checked")) {

                        let contentDivs;
                        switch ($(this).attr("name")) {
                            case "monitoring_energy_consumption":
                                contentDivs = "#div_building_operations_narrative_dash, #div_sechematic_bms_installed,#div_project_comm_one,div#project_comm_one_doc, #div_monitoring_system_details,#div_system_dashboard_details,#div_meter_installed_details,#div_water_meter_photographs,#div_total_water_consumption_data,div#building_operations_narrative_dash_doc,div#sechematic_bms_installed_doc,div#monitoring_system_details_doc,div#system_dashboard_details_doc,div#meter_installed_details_doc,div#water_meter_photographs_doc,div#total_water_consumption_data_doc";
                                break;
                            case "monitoring_con":
                                contentDivs = "#div_narrative_con,#div_diagram_bms_installed, #div_system_pro,#div_installed_project,#div_project_comm_two,div#project_comm_two_doc, #div_water_meter_pro,#div_share_total,div#narrative_con_doc, div#diagram_bms_installed_doc, div#system_pro_doc, div#installed_project_doc, div#water_meter_pro_doc, div#share_total_doc";
                                break;
                            case "indoor_air_quality":
                                contentDivs = "#div_sehematic_m,#div_system_project, #div_installed_pro,#div_sensors_installed_photographs,#div_perfor,#div_project_comm_three,div#project_comm_three_doc, div#sehematic_m_doc, div#system_project_doc, div#installed_pro_doc, div#sensors_installed_photographs_doc, div#perfor_doc";
                                break;
                            default:
                                contentDivs = "";
                        }

                        // Clear the content fields within the hidden section
                        if (contentDivs) {
                            $(contentDivs)
                                .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                                .prop("checked", false).val('');

                            $(contentDivs)
                                .find("input[type='file']")
                                .each(function () {
                                    var $input = $(this);
                                    $input.replaceWith($input.val('').clone(true));
                                });
                        }
                    }
                    existingOperations();
                });
            }); 
     }




     
    if (subtab == "universal_designs") {
        $(document).ready(function () { 
            //    var clearedFiles = {};
            function existingreenedu() {

                // --- mechanically_ventilated_spaces---
                if ($("input[name='list_application_eco']").is(":checked")) {
                    $("#div_parking_differently_abled, #div_highlighting_ramps, #div_seating_lift, #div_interior_abled_toilet").show();
                } else {
                     $("#div_parking_differently_abled, #div_highlighting_ramps, #div_seating_lift, #div_interior_abled_toilet").hide();
                    $("div#parking_differently_abled_doc, div#highlighting_ramps_doc, div#seating_lift_doc, div#interior_abled_toilet_doc").hide();
                }
            }

            $(
                "input[name='list_application_eco']"
            ).change(function () {
                
                if (!$(this).is(":checked")) {
                    
                    let contentDivs;

                        switch ($(this).attr("name")) {
                            case "list_application_eco":
                                contentDivs = "#div_parking_differently_abled, #div_highlighting_ramps, #div_seating_lift, #div_interior_abled_toilet,div#parking_differently_abled_doc, div#highlighting_ramps_doc, div#seating_lift_doc, div#interior_abled_toilet_doc";
                                break;
                            default:
                                contentDivs = "";
                        }

                    if (contentDivs) {
                        $(contentDivs)
                            .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                            .prop("checked", false).val('');

                        $(contentDivs)
                            .find("input[type='file']")
                            .each(function () {
                                var $input = $(this);
                                $input.val('').clone(true);
                            });
                    }
                }
                existingreenedu();
            });
        }); 
    }

       

     if (subtab == "alternative_water_performances") {
        $(document).ready(function async() { 
            function exisitingUpdatevisibility() {
                if ($("input[name='log_sheets']").is(":checked")) {
                    $("#div_municipal_water_supply, #div_ro_water_con, #div_stp_input, #div_stp_output, #div_rain_coll, #div_dom_consum, #div_cooling_tower,#div_flush_consum,#div_landscap_consum").show();
                } else {
                    $("#div_municipal_water_supply, #div_ro_water_con, #div_stp_input, #div_stp_output, #div_rain_coll, #div_dom_consum, #div_cooling_tower,#div_flush_consum,#div_landscap_consum").hide();
                    $("div#municipal_water_supply_doc, div#ro_water_con_doc, div#stp_input_doc, div#stp_output_doc, div#rain_coll_doc, div#dom_consum_doc, div#cooling_tower_doc, div#flush_consum_doc, div#landscap_consum_doc").hide();
                }

            }            
            exisitingUpdatevisibility();

            $(
                "input[name='log_sheets']"
            ).change(function async() {
                
                if (!$(this).is(":checked")) {
                    
                    let contentDivs;
                    switch ($(this).attr("name")) {
                        case "log_sheets":
                            contentDivs = "#div_municipal_water_supply, #div_ro_water_con, #div_stp_input, #div_stp_output, #div_rain_coll, #div_dom_consum, #div_cooling_tower,#div_flush_consum,#div_landscap_consum,div#municipal_water_supply_doc, div#ro_water_con_doc, div#stp_input_doc, div#stp_output_doc, div#rain_coll_doc, div#dom_consum_doc, div#cooling_tower_doc, div#flush_consum_doc, div#landscap_consum_doc";
                            break;
                        default:
                            contentDivs = "";
                    }

                    // Clear the content fields within the hidden section
                    if (contentDivs) {
                        $(contentDivs)
                            .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                            .prop("checked", false).val('');
                        $(contentDivs)
                            .find("input[type='file']")
                            .each(function () {
                                var $input = $(this);
                                $input.replaceWith($input.val('').clone(true));
                            });
                    }
                }
                exisitingUpdatevisibility();
            });
        }); 
    }

  