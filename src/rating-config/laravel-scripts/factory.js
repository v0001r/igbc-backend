if (subtab === "daylighting") {
  factoryindoor($("#daylight_approch").val(), false); 

  $("#daylight_approch").change(function () {

    factoryindoor($(this).val(), true); 
  });
}
function factoryindoor(value, clearData) { 
  if (value === "Simulation Approach") {
    // first option shows
    $("#div_day_parameters_area, #div_day_total_area").show();
    $("#div_day_narrative, #div_day_floor_plan,#div_day_manufacturer,#div_day_site_plan,#div_day_simulation_report,#div_day_photographs,#div_day_purchase_invoices").show();

    // second option hides
    $("#div_mannual_parameters_area,#div_mannual_total, #div_mannual_narrative,#div_mannual_def_report,#div_mannual_floor_plan, #div_mannual_site_plan, #div_mannual_manufacturer, #div_mannual_build,#div_mannual_purchase_invoices").hide();
    $(" div#mannual_narrative_doc, div#mannual_def_report_doc, div#mannual_floor_plan_doc, div#mannual_site_plan_doc, div#mannual_manufacturer_doc, div#mannual_build_doc, div#mannual_purchase_invoices_doc").hide();

    // 'clearData' 
    if (clearData) { 
      // Clear the "Measurement approach" fields when switching to "Simulation Approach"
      $("#div_mannual_parameters_area,#div_mannual_total, #div_mannual_narrative,#div_mannual_def_report,#div_mannual_floor_plan, #div_mannual_site_plan, #div_mannual_manufacturer, #div_mannual_build,#div_mannual_purchase_invoices")
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") 
        .not("input[type=file]") // Ensure file inputs aren't cleared (which causes issues)
        .prop("checked", false)
        .val("");

        $("div#mannual_narrative_doc, div#mannual_def_report_doc, div#mannual_floor_plan_doc, div#mannual_site_plan_doc, div#mannual_manufacturer_doc, div#mannual_build_doc, div#mannual_purchase_invoices_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
    }
  } else if (value === "Mannual Approach") {
     console.log("triggered", value);
    $("#div_mannual_parameters_area,#div_mannual_total, #div_mannual_narrative,#div_mannual_def_report,#div_mannual_floor_plan, #div_mannual_site_plan, #div_mannual_manufacturer, #div_mannual_build,#div_mannual_purchase_invoices").show();
    
    $("#div_day_parameters_area, #div_day_total_area").hide();
    $("#div_day_narrative, #div_day_floor_plan,#div_day_manufacturer,#div_day_site_plan,#div_day_simulation_report,#div_day_photographs,#div_day_purchase_invoices").hide();
    $("div#day_narrative_doc, div#day_floor_plan_doc, div#day_manufacturer_doc, div#day_site_plan_doc, div#day_simulation_report_doc, div#day_photographs_doc, div#day_purchase_invoices_doc").hide();

    
    //  'clearData' 
    if (clearData) {
      // Clear the "Simulation Approach" fields when switching to "Measurement approach"
      $("#div_day_parameters_area, #div_day_total_area,#div_day_narrative, #div_day_floor_plan,#div_day_manufacturer,#div_day_site_plan,#div_day_simulation_report,#div_day_photographs,#div_day_purchase_invoices").find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") // Added textareas and radio
        .not("input[type=file]") // Ensure file inputs aren't cleared
        .prop("checked", false)
        .val("");

         $("div#day_narrative_doc, div#day_floor_plan_doc, div#day_manufacturer_doc, div#day_site_plan_doc, div#day_simulation_report_doc, div#day_photographs_doc, div#day_purchase_invoices_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      console.log("Simulation value cleared", value);
    }
  } else  {
  $("#div_day_narrative, #div_day_floor_plan,#div_day_manufacturer,#div_day_site_plan,#div_day_simulation_report,#div_day_photographs,#div_day_purchase_invoices,#div_day_parameters_area, #div_day_total_area,#div_mannual_parameters_area,#div_mannual_total, #div_mannual_narrative,#div_mannual_def_report,#div_mannual_floor_plan, #div_mannual_site_plan, #div_mannual_manufacturer, #div_mannual_build,#div_mannual_purchase_invoices").hide();

  if (clearData) {
    $("#div_day_narrative, #div_day_floor_plan,#div_day_manufacturer,#div_day_site_plan,#div_day_simulation_report,#div_day_photographs,#div_day_purchase_invoices,#div_day_parameters_area, #div_day_total_area,#div_mannual_parameters_area,#div_mannual_total, #div_mannual_narrative,#div_mannual_def_report,#div_mannual_floor_plan, #div_mannual_site_plan, #div_mannual_manufacturer, #div_mannual_build,#div_mannual_purchase_invoices")
      .find(
        "input[type=radio], input[type=checkbox], select, input[type=text], textarea"
      )
      .not("input[type=file]")
      .prop("checked", false)
      .val("");
      $("div#day_narrative_doc, div#day_floor_plan_doc, div#day_manufacturer_doc, div#day_site_plan_doc, div#day_simulation_report_doc, div#day_photographs_doc, div#day_purchase_invoices_doc, div#day_parameters_area_doc, div#day_total_area_doc, div#mannual_parameters_area_doc, div#mannual_total_doc, div#mannual_narrative_doc, div#mannual_def_report_doc, div#mannual_floor_plan_doc, div#mannual_site_plan_doc, div#mannual_manufacturer_doc, div#mannual_build_doc, div#mannual_purchase_invoices_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
  } 

}
}



if (subtab == "access_public_transport") {
        $(document).ready(function () { 
            function factoryTransport() {

                // --- mechanically_ventilated_spaces---
                if ($("input[name='public_transport']").is(":checked")) {
                    $("#div_public_transport_select, #div_distance_annexure_ac_fresh_air").show();
                } else {
                    $("#div_public_transport_select, #div_distance_annexure_ac_fresh_air").hide();
                }
                
            }

            
            factoryTransport();

            $(
                "input[name='public_transport']"
            ).change(function () {
                
                // If the box that triggered this change is now UNCHECKED, clear its related fields.
                if (!$(this).is(":checked")) {
                    
                    // Get the ID of the related content DIVs to clear
                    let contentDivs;
                    switch ($(this).attr("name")) {
                        case "public_transport":
                            contentDivs = "#div_public_transport_select, #div_distance_annexure_ac_fresh_air";
                            break;
                        default:
                            contentDivs = "";
                    }

                    // Clear the content fields within the hidden section
                    if (contentDivs) {
                        $(contentDivs)
                            .find("input[type=checkbox], input[type=radio], input[type=text], textarea, select")
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
                factoryTransport();
            });
        }); 
}



if (subtab == "basic_amenities") {
        $(document).ready(function () { 
            function factorybasic() {

                // --- mechanically_ventilated_spaces---
                if ($("input[name='2_km_from_factory']").is(":checked")) {
                    $("#div_retail_store, #div_school, #div_hospital, #div_bank, #div_restaurant, #div_hospital_dental, #div_pharmacy,#div_courier_service").show();
                } else {
                    $("#div_retail_store, #div_school, #div_hospital, #div_bank, #div_restaurant, #div_hospital_dental, #div_pharmacy,#div_courier_service").hide();

                }
                if ($("input[name='provided_situ']").is(":checked")) {
                    $("#div_first_aid_medical_facility, #div_creche, #div_locker_shower, #div_canteen, #div_resting_prooms, #div_gymnasium").show();
                } else {
                    $("#div_first_aid_medical_facility, #div_creche, #div_locker_shower, #div_canteen, #div_resting_prooms, #div_gymnasium").hide();
                }
                
            }

            
            factorybasic();

            $(
                "input[name='2_km_from_factory'], input[name='provided_situ']"
            ).change(function () {
                
                // If the box that triggered this change is now UNCHECKED, clear its related fields.
                if (!$(this).is(":checked")) {
                    
                    // Get the ID of the related content DIVs to clear
                    let contentDivs;
                    switch ($(this).attr("name")) {
                        case "2_km_from_factory":
                            contentDivs = "#div_retail_store, #div_school, #div_hospital, #div_bank, #div_restaurant, #div_hospital_dental, #div_pharmacy,#div_courier_service";
                            break;
                        case "provided_situ":
                            contentDivs = "#div_first_aid_medical_facility, #div_creche, #div_locker_shower, #div_canteen, #div_resting_prooms, #div_gymnasium";
                            break;
                        default:
                            contentDivs = "";
                    }

                    // Clear the content fields within the hidden section
                    if (contentDivs) {
                        $(contentDivs)
                            .find("input[type=checkbox], input[type=radio], input[type=text], textarea, select")
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
                factorybasic();
            });
        }); 
}

// if (subtab == "heat_island_mitigation") {
//   factoryheat($("#island_mitigation_roof").val(), false); 

//   $("#island_mitigation_roof").change(function () {

//     factoryheat($(this).val(), true); 
//   });

//   // $("#urban_heat_roof_island, #urban_heat_non_roof_island").change(function () {
//   //     triggerFactoryHeat(true);
//   // });
// }

if (subtab == "heat_island_mitigation") {

          if ($("input[name='urban_heat_roof_island']").is(":checked")) {
              $("#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof").show();
              $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate").show();
          } else {
              $("#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof").hide();
              $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate").hide();
          }

          if ($("input[name='urban_heat_non_roof_island']").is(":checked")) {
                  $("#div_ex_pos,#div_non_roof_sampling, #div_hardscape_area_non_roof,#div_mitigation_non_roof_percent").show();
                  $("#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr").show();

          } else {
                  $("#div_ex_pos,#div_non_roof_sampling, #div_hardscape_area_non_roof,#div_mitigation_non_roof_percent").hide();
                  $("#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr").hide();
          }

          $("input[name='urban_heat_roof_island']").change(function() {
            if(this.checked) {
                  $("#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof").show();
                  $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate").show();
              } else {
                  $("#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof").hide();
                  $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate").hide();
              }
          });

          $("input[name='urban_heat_non_roof_island']").change(function() {
             if(this.checked) {
                  $("#div_ex_pos,#div_non_roof_sampling, #div_hardscape_area_non_roof,#div_mitigation_non_roof_percent").show();
                  $("#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr").show();

            } else {
                    $("#div_ex_pos,#div_non_roof_sampling,#div_hardscape_area_non_roof,#div_mitigation_non_roof_percent").hide();
                    $("#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr").hide();
            }

          });

          $('#total_exposed_roof').on('keyup', function(){
        let total_exposed_roof_area = $('#total_exposed_roof').val();
        let area_of_high_sri = $('#high_sri_finish').val();
        let area_of_landscape_builtup = $('#landscape_builtup').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#island_mitigation_non_roof').val(by_percent.toFixed(2));
    });
    $('#high_sri_finish').on('keyup', function(){
        let total_exposed_roof_area = $('#total_exposed_roof').val();
        let area_of_high_sri = $('#high_sri_finish').val();
        let area_of_landscape_builtup = $('#landscape_builtup').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#island_mitigation_non_roof').val(by_percent.toFixed(2));
    });
    $('#landscape_builtup').on('keyup', function(){
        let total_exposed_roof_area = $('#total_exposed_roof').val();
        let area_of_high_sri = $('#high_sri_finish').val();
        let area_of_landscape_builtup = $('#landscape_builtup').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#island_mitigation_non_roof').val(by_percent.toFixed(2));
    });
    $('#ex_pos').on('keyup', function(){
        let total_exposed_roof_area = $('#ex_pos').val();
        let area_of_high_sri = $('#non_roof_sampling').val();
        let area_of_landscape_builtup = $('#hardscape_area_non_roof').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#mitigation_non_roof_percent').val(by_percent.toFixed(2));
    });
    $('#non_roof_sampling').on('keyup', function(){
        let total_exposed_roof_area = $('#ex_pos').val();
        let area_of_high_sri = $('#non_roof_sampling').val();
        let area_of_landscape_builtup = $('#hardscape_area_non_roof').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#mitigation_non_roof_percent').val(by_percent.toFixed(2));
    });
    $('#hardscape_area_non_roof').on('keyup', function(){
        let total_exposed_roof_area = $('#ex_pos').val();
        let area_of_high_sri = $('#non_roof_sampling').val();
        let area_of_landscape_builtup = $('#hardscape_area_non_roof').val();
        let tot = parseFloat(area_of_high_sri) + parseFloat(area_of_landscape_builtup);
        let by_percent = (tot/parseFloat(total_exposed_roof_area))*100;

        $('#mitigation_non_roof_percent').val(by_percent.toFixed(2));
    });

}

if (subtab == "green_transportation_facility") {

          if ($("input[name='option_electric_charging_infra']").is(":checked")) {
              $("#div_four_wheels, #div_two_wheels,#div_ev_fourwheels,#div_ev_twowheels, #div_four_parking_percents, #div_two_parking_percents, #div_low_emmiting_vehicles").show();
          } else {
              $("#div_four_wheels, #div_two_wheels,#div_ev_fourwheels,#div_ev_twowheels, #div_four_parking_percents, #div_two_parking_percents, #div_low_emmiting_vehicles").hide();
          }

          if ($("input[name='option_eco_friendly_transport_facility']").is(":checked")) {
                  $("#div_narrative,#div_parking_plans, #div_ev_socketsev,#div_po_green_invoice, #div_photos_green, #div_laws_green_parking_re, #div_alternate_fuel").show();
                  $("#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr").show();

          } else {
                  $("#div_narrative,#div_parking_plans, #div_ev_socketsev,#div_po_green_invoice, #div_photos_green, #div_laws_green_parking_re, #div_alternate_fuel").hide();
                  $("#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr").hide();
          }

          $("input[name='option_electric_charging_infra']").change(function() {
            if(this.checked) {
                  $("#div_four_wheels, #div_two_wheels,#div_ev_fourwheels,#div_ev_twowheels, #div_four_parking_percents, #div_two_parking_percents, #div_low_emmiting_vehicles").show();
              } else {
                  $("#div_four_wheels, #div_two_wheels,#div_ev_fourwheels,#div_ev_twowheels, #div_four_parking_percents, #div_two_parking_percents, #div_low_emmiting_vehicles").hide();
              }
          });

          $("input[name='option_eco_friendly_transport_facility']").change(function() {
             if(this.checked) {
                  $("#div_narrative,#div_parking_plans, #div_ev_socketsev,#div_po_green_invoice, #div_photos_green, #div_laws_green_parking_re, #div_alternate_fuel").show();

            } else {
                  $("#div_narrative,#div_parking_plans, #div_ev_socketsev,#div_po_green_invoice, #div_photos_green, #div_laws_green_parking_re, #div_alternate_fuel").hide();
            }

          });

}



if (subtab == "building_flush_out") {

          if ($("input[name='build_natural_ventilation']").is(":checked")) {
              $("#div_before_nt").show();
          } else {
              $("#div_before_nt").hide();

          }

          if ($("input[name='build_forced_ventilation']").is(":checked")) {
                  $("#div_shall_perform").show();

          } else {
              $("#div_shall_perform").hide();
          }

          $("input[name='build_natural_ventilation']").change(function() {
            if(this.checked) {
                  $("#div_before_nt").show();
              } else {
                  $("#div_before_nt").hide();
              }
          });

          $("input[name='build_forced_ventilation']").change(function() {
             if(this.checked) {
                  $("#div_shall_perform").show();
            } else {
                  $("#div_shall_perform").hide();
            }

          });

}
if (subtab == "occupant_wellbeing_facilities") {

          if ($("input[name='indoor_outdoor_option_one']").is(":checked")) {
              $("#div_indoor_games,#div_table_tennis,#div_carrom,#div_sq_squash, #div_foot_ball,#div_air_hockey,#div_snooker").show();
              $("#div_outdoor_games,#div_badminton_court,#div_volleyball_court,#div_basketball_court, #div_tennis_court,#div_football_cricket,#div_kabaddi").show();
          } else {
              $("#div_indoor_games,#div_table_tennis,#div_carrom,#div_sq_squash, #div_foot_ball,#div_air_hockey,#div_snooker").hide();
              $("#div_outdoor_games,#div_badminton_court,#div_volleyball_court,#div_basketball_court, #div_tennis_court,#div_football_cricket,#div_kabaddi").hide();

          }


          $("input[name='indoor_outdoor_option_one']").change(function() {
            if(this.checked) {
                   $("#div_indoor_games,#div_table_tennis,#div_carrom,#div_sq_squash, #div_foot_ball,#div_air_hockey,#div_snooker").show();
                   $("#div_outdoor_games,#div_badminton_court,#div_volleyball_court,#div_basketball_court, #div_tennis_court,#div_football_cricket,#div_kabaddi").show();
              } else {
                  $("#div_indoor_games,#div_table_tennis,#div_carrom,#div_sq_squash, #div_foot_ball,#div_air_hockey,#div_snooker").hide();
                  $("#div_outdoor_games,#div_badminton_court,#div_volleyball_court,#div_basketball_court, #div_tennis_court,#div_football_cricket,#div_kabaddi").hide();
              }
          });

           if ($("input[name='break_out_option_two']").is(":checked")) {
              $("#div_occupant_number,#div_occupant_well").show();
            } else {
            $("#div_occupant_number,#div_occupant_well").hide();

          }
            $("input[name='break_out_option_two']").change(function() {
            if(this.checked) {
                   $("#div_occupant_number,#div_occupant_well").show();
              } else {
                  $("#div_occupant_number,#div_occupant_well").hide();
              }
          });




      }

// function triggerFactoryHeat(isChange) {
  
//     if ($("#urban_heat_roof_island").is(":checked")) {
//         factoryheat('Urban Heat island mitigation for Roof', isChange);

//     }

//     if ($("#urban_heat_non_roof_island").is(":checked")) {
//         factoryheat('Urban Heat island mitigation for Non-Roof', isChange);
//     }

// }

function factoryheat(value, clearData) { 
  if (value === "Urban Heat island mitigation for Roof") {
    // first option shows
    $("#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof").show();
    $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate").show();

   
    // 'clearData' 
    if (clearData) { 
      // Clear the "Measurement approach" fields when switching to "Simulation Approach"
      $("#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr")
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") 
        .not("input[type=file]") // Ensure file inputs aren't cleared (which causes issues)
        .prop("checked", false)
        .val("");

        $("div#material_tax_doc, div#photographs_non_roof_doc, div#developer_owner_doc, div#heat_narr_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
    }
  }else{
    $("#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof").hide();
    $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate").hide();

  }
  if (value === "Urban Heat island mitigation for Non-Roof") {
     console.log("triggered", value);
    $("#div_ex_pos,#div_non_roof_sampling, #div_non_roof_sampling,#div_non_roof_sampling").show();
    $("#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr").show();

    $("#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof").hide();
    $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate").hide();
    $("div#narrative_area_doc, div#site_uhi_doc, div#datasheet_certificate_doc").hide();

    
    //  'clearData' 
    if (clearData) {
      // Clear the "Simulation Approach" fields when switching to "Measurement approach"
      $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate")
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") // Added textareas and radio
        .not("input[type=file]") // Ensure file inputs aren't cleared
        .prop("checked", false)
        .val("");

         $("div#narrative_area_doc, div#site_uhi_doc, div#datasheet_certificate_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      console.log("Simulation value cleared", value);
    }
  } else  {
  $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate,#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof,#div_ex_pos,#div_non_roof_sampling, #div_non_roof_sampling,#div_non_roof_sampling,#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr").hide();

  if (clearData) {
    $("#div_narrative_area, #div_site_uhi,#div_datasheet_certificate,#div_total_roof, #div_total_exposed_roof,#div_high_sri_finish,#div_landscape_builtup, #div_island_mitigation_non_roof,#div_ex_pos,#div_non_roof_sampling, #div_non_roof_sampling,#div_non_roof_sampling,#div_material_tax,#div_photographs_non_roof, #div_developer_owner,#div_heat_narr")
      .find(
        "input[type=radio], input[type=checkbox], select, input[type=text], textarea"
      )
      .not("input[type=file]")
      .prop("checked", false)
      .val("");
      $("div#narrative_area_doc, div#site_uhi_doc, div#datasheet_certificate_doc,div#material_tax_doc, div#photographs_non_roof_doc, div#developer_owner_doc, div#heat_narr_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
    console.log("Total value cleared on switch to none", value);
  } 

}
}




if (subtab == "minimum_energy_efficiency") {
  factoryeng($("#min_select").val(), false); 

  $("#min_select").change(function () {

    factoryeng($(this).val(), true); 
  });
}

function factoryeng(value, clearData) { 
  if (value === "Prescriptive Method") {
    // first option shows
    $("#div_min_narr, #div_min_construction_details,#div_glazing_specification,#div_min_wwr_calculations, #div_lpd_calculations_along, #div_lighting_systems_controls, #div_lighting_systems_controls, #div_min_rendered, #div_mini_photo,#div_mini_letter").show();
    $("#div_min_narr,#div_calculation_wall_roof_assembly,#div_glazing_specification,#div_window_wall_ratio,#div_photographs_of_glazing,#div_detailed_lpd_calculations,#div_lighting_system_control,#div_air_condition_cop_isser,#div_photographs_lighting_fixtures,#div_description_installed_air_conditioning,#div_technical_cutsheet_installed_air,#div_technical_cutsheet_cooling_system,#div_technical_cutsheet_of_hvls,#div_photographs_of_hvls_cooloing,#div_description_low_energy_cooling_system,#div_drawing_indicating_area_coverd,#div_Photographs_installed_system").show();

    // second option hides
    $("#div_eng_purchase_in,#div_eng_photos, #div_eng_narrative,#div_eng_energy_simulation_report,#div_eng_manufacturer_cut_sheets,#div_eng_lpd_calculations,#div_eng_lighting_layouts,#div_eng_hvac_layouts,#div_eng_calculations,#div_eng_wall_roof_drawings,#div_eng_simulation_files").hide();
    $("div#eng_purchase_in_doc,div#eng_photos_doc,div#eng_narrative_doc,div#eng_energy_simulation_report_doc,div#eng_manufacturer_cut_sheets_doc,div#eng_lpd_calculations_doc,div#eng_lighting_layouts_doc,div#eng_hvac_layouts_doc,div#eng_calculations_doc,div#eng_wall_roof_drawings_doc,div#eng_simulation_files_doc").hide();
  
    // 'clearData' 
    if (clearData) { 
      // Clear the "Measurement approach" fields when switching to "Simulation Approach"
      $("#div_eng_purchase_in,#div_eng_photos,#div_eng_narrative,#div_eng_energy_simulation_report,#div_eng_manufacturer_cut_sheets,#div_eng_lpd_calculations,#div_eng_lighting_layouts,#div_eng_hvac_layouts,#div_eng_calculations,#div_eng_wall_roof_drawings,#div_eng_simulation_files")
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") 
        .not("input[type=file]") // Ensure file inputs aren't cleared (which causes issues)
        .prop("checked", false)
        .val("");

        $("div#eng_purchase_in_doc,div#eng_photos_doc,div#eng_narrative_doc,div#eng_energy_simulation_report_doc,div#eng_manufacturer_cut_sheets_doc,div#eng_lpd_calculations_doc,div#eng_lighting_layouts_doc,div#eng_hvac_layouts_doc,div#eng_calculations_doc,div#eng_wall_roof_drawings_doc,div#eng_simulation_files_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
    }
  } else if (value === "Whole Building Performance Method") {
    $("#div_eng_purchase_in,#div_eng_photos, #div_eng_narrative,#div_eng_energy_simulation_report,#div_eng_manufacturer_cut_sheets,#div_eng_lpd_calculations,#div_eng_lighting_layouts,#div_eng_hvac_layouts,#div_eng_calculations,#div_eng_wall_roof_drawings,#div_eng_simulation_files").show();
    
    //first option
    $(" #div_effi, #div_min_narr,#div_calculation_wall_roof_assembly,#div_glazing_specification,#div_window_wall_ratio,#div_photographs_of_glazing,#div_detailed_lpd_calculations,#div_lighting_system_control,#div_air_condition_cop_isser,#div_photographs_lighting_fixtures,#div_description_installed_air_conditioning,#div_technical_cutsheet_installed_air,#div_technical_cutsheet_cooling_system,#div_technical_cutsheet_of_hvls,#div_photographs_of_hvls_cooloing,#div_description_low_energy_cooling_system,#div_drawing_indicating_area_coverd,#div_Photographs_installed_system").hide();
    $("div#min_narr_doc,div#calculation_wall_roof_assembly_doc,div#glazing_specification_doc,div#window_wall_ratio_doc,div#photographs_of_glazing_doc,div#detailed_lpd_calculations_doc,div#lighting_system_control_doc,div#air_condition_cop_isser_doc,div#photographs_lighting_fixtures_doc,div#description_installed_air_conditioning_doc,div#technical_cutsheet_installed_air_doc,div#technical_cutsheet_cooling_system_doc,div#technical_cutsheet_of_hvls_doc,div#photographs_of_hvls_cooloing_doc,div#description_low_energy_cooling_system_doc,div#drawing_indicating_area_coverd_doc,div#Photographs_installed_system_doc").hide();

    
    //  'clearData' 
    if (clearData) {
      // Clear the "Simulation Approach" fields when switching to "Measurement approach"
      $("#div_min_narr,#div_effi, #div_calculation_wall_roof_assembly,#div_glazing_specification,#div_window_wall_ratio,#div_photographs_of_glazing,#div_detailed_lpd_calculations,#div_lighting_system_control,#div_air_condition_cop_isser,#div_photographs_lighting_fixtures,#div_description_installed_air_conditioning,#div_technical_cutsheet_installed_air,#div_technical_cutsheet_cooling_system,#div_technical_cutsheet_of_hvls,#div_photographs_of_hvls_cooloing,#div_description_low_energy_cooling_system,#div_drawing_indicating_area_coverd,#div_Photographs_installed_system")
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") // Added textareas and radio
        .not("input[type=file]") // Ensure file inputs aren't cleared
        .prop("checked", false)
        .val("");

         $("div#min_narr_doc,div#calculation_wall_roof_assembly_doc,div#glazing_specification_doc,div#window_wall_ratio_doc,div#photographs_of_glazing_doc,div#detailed_lpd_calculations_doc,div#lighting_system_control_doc,div#air_condition_cop_isser_doc,div#photographs_lighting_fixtures_doc,div#description_installed_air_conditioning_doc,div#technical_cutsheet_installed_air_doc,div#technical_cutsheet_cooling_system_doc,div#technical_cutsheet_of_hvls_doc,div#photographs_of_hvls_cooloing_doc,div#description_low_energy_cooling_system_doc,div#drawing_indicating_area_coverd_doc,div#Photographs_installed_system_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      console.log("Simulation value cleared", value);
    }
  } else  {
        $("#div_eng_purchase_in,#div_eng_photos, #div_min_narr, #div_effi, #div_calculation_wall_roof_assembly,#div_glazing_specification,#div_window_wall_ratio,#div_photographs_of_glazing,#div_detailed_lpd_calculations,#div_lighting_system_control,#div_air_condition_cop_isser,#div_photographs_lighting_fixtures,#div_description_installed_air_conditioning,#div_technical_cutsheet_installed_air,#div_technical_cutsheet_cooling_system,#div_technical_cutsheet_of_hvls,#div_photographs_of_hvls_cooloing,#div_description_low_energy_cooling_system,#div_drawing_indicating_area_coverd,#div_Photographs_installed_system").hide();
        $("#div_eng_purchase_in,#div_eng_photos, #div_eng_narrative,#div_eng_energy_simulation_report,#div_eng_manufacturer_cut_sheets,#div_eng_lpd_calculations,#div_eng_lighting_layouts,#div_eng_hvac_layouts,#div_eng_calculations,#div_eng_wall_roof_drawings,#div_eng_simulation_files").hide();
        $("div#min_narr_doc,div#calculation_wall_roof_assembly_doc,div#glazing_specification_doc,div#window_wall_ratio_doc,div#photographs_of_glazing_doc,div#detailed_lpd_calculations_doc,div#lighting_system_control_doc,div#air_condition_cop_isser_doc,div#photographs_lighting_fixtures_doc,div#description_installed_air_conditioning_doc,div#technical_cutsheet_installed_air_doc,div#technical_cutsheet_cooling_system_doc,div#technical_cutsheet_of_hvls_doc,div#photographs_of_hvls_cooloing_doc,div#description_low_energy_cooling_system_doc,div#drawing_indicating_area_coverd_doc,div#Photographs_installed_system_doc").hide();
        $("div#eng_narrative_doc,div#eng_purchase_in_doc,div#eng_photos_doc,div#eng_energy_simulation_report_doc,div#eng_manufacturer_cut_sheets_doc,div#eng_lpd_calculations_doc,div#eng_lighting_layouts_doc,div#eng_hvac_layouts_doc,div#eng_calculations_doc,div#eng_wall_roof_drawings_doc,div#eng_simulation_files_doc").hide();


  if (clearData) {
    $("#div_min_narr,#div_eng_purchase_in,#div_eng_photos,  #div_calculation_wall_roof_assembly,#div_glazing_specification,#div_window_wall_ratio,#div_photographs_of_glazing,#div_detailed_lpd_calculations,#div_lighting_system_control,#div_air_condition_cop_isser,#div_photographs_lighting_fixtures,#div_description_installed_air_conditioning,#div_technical_cutsheet_installed_air,#div_technical_cutsheet_cooling_system,#div_technical_cutsheet_of_hvls,#div_photographs_of_hvls_cooloing,#div_description_low_energy_cooling_system,#div_drawing_indicating_area_coverd,#div_Photographs_installed_system,#div_eng_narrative,#div_eng_energy_simulation_report,#div_eng_manufacturer_cut_sheets,#div_eng_lpd_calculations,#div_eng_lighting_layouts,#div_eng_hvac_layouts,#div_eng_calculations,#div_eng_wall_roof_drawings,#div_eng_simulation_files")
      .find(
        "input[type=radio], input[type=checkbox], select, input[type=text], textarea"
      )
      .not("input[type=file]")
      .prop("checked", false)
      .val("");
      $("div#eng_narrative_doc,div#eng_purchase_in_doc,div#eng_photos_doc,div#eng_energy_simulation_report_doc,div#eng_manufacturer_cut_sheets_doc,div#eng_lpd_calculations_doc,div#eng_lighting_layouts_doc,div#eng_hvac_layouts_doc,div#eng_calculations_doc,div#eng_wall_roof_drawings_doc,div#eng_simulation_files_doc,div#min_narr_doc,div#calculation_wall_roof_assembly_doc,div#glazing_specification_doc,div#window_wall_ratio_doc,div#photographs_of_glazing_doc,div#detailed_lpd_calculations_doc,div#lighting_system_control_doc,div#air_condition_cop_isser_doc,div#photographs_lighting_fixtures_doc,div#description_installed_air_conditioning_doc,div#technical_cutsheet_installed_air_doc,div#technical_cutsheet_cooling_system_doc,div#technical_cutsheet_of_hvls_doc,div#photographs_of_hvls_cooloing_doc,div#description_low_energy_cooling_system_doc,div#drawing_indicating_area_coverd_doc,div#Photographs_installed_system_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
    console.log("Total value cleared on switch to none", value);
  } 

}
}


if (subtab === "enhanced_water_efficencies") {
    // initial load
    existingwatereff($("#selectwater_eff").val());

    // on change
    $("#selectwater_eff").on("change", function () {
        existingwatereff($(this).val());
    });
}

function existingwatereff(value) {

    if (value === "Water Efficient Plumbing Fixture") {

        $("#div_water_efficiency_table, #div_water_efficiency_option1").show();
        $("#div_water_calculation_table").hide();

    } else if (value === "Reduction in water consumption") {

        $("#div_water_efficiency_table,#div_water_efficiency_option1").hide();
        $("#div_water_calculation_table").show();

    } else {

        $("#div_water_efficiency_table,#div_water_efficiency_option1").hide();
        $("#div_water_calculation_table").hide();
    }
}


 if (subtab == "sustainable_landscape_design") {
            $(document).ready(function () { 
                function existinglandspace() {

                    // --- enhanced_ventilation_spaces ---
                    if ($("input[name='irrigation_sys']").is(":checked")) {
                        $("#div_landscape_design_narrative, #div_high_irrgation, #div_cutsheet_fix,#div_photo_land").show();
                    } else {
                        $("#div_landscape_design_narrative, #div_high_irrgation, #div_cutsheet_fix,#div_photo_land").hide();
                        $("div#landscape_design_narrative_doc, div#high_irrgation_doc, div#cutsheet_fix_doc, div#photo_land_doc").hide();
                    }

                    if ($("input[name='limit_turf']").is(":checked")) {
                        $("#div_per_turf,#div_narr_turf, #div_vegetated_turf,#div_photo_turf").show();
                    } else {
                        $("#div_per_turf,#div_narr_turf, #div_vegetated_turf,#div_photo_turf").hide();
                        $("div#per_turf_doc, div#narr_turf_doc, div#vegetated_turf_doc, div#photo_turf_doc").hide();

                    }

                    if ($("input[name='landscape_design_exemplary']").is(":checked")) {
                        $("#div_area_adaptive_grd, #div_area_adaptive_built,#div_area_adaptive_vertical,#div_area_adaptive_land_grd,#div_area_adaptive_built_stru, #div_area_adaptive_verti_land, #div_local_adaptive  ").show();
                        $("#div_dio_narr, #div_area_drough,#div_species_used,#div_stamped_photo").show();
                    } else {
                         $("#div_area_adaptive_grd, #div_area_adaptive_built,#div_area_adaptive_vertical,#div_area_adaptive_land_grd,#div_area_adaptive_built_stru, #div_area_adaptive_verti_land, #div_local_adaptive  ").hide();
                        $("#div_dio_narr, #div_area_drough,#div_species_used,#div_stamped_photo").hide();
                        $("div#dio_narr_doc, div#area_drough_doc,div#species_used_doc,div#stamped_photo_doc").hide();
    
                    }
                }    
                existinglandspace();
                $(
                    "input[name='irrigation_sys'], input[name='limit_turf'],input[name='landscape_design_exemplary']"
                ).change(function () {
                    
                    if (!$(this).is(":checked")) {

                        let contentDivs;
                        switch ($(this).attr("name")) {
                            case "irrigation_sys":
                                contentDivs = "#div_landscape_design_narrative, #div_high_irrgation, #div_cutsheet_fix,#div_photo_land";
                                break;
                            case "limit_turf":
                                contentDivs = "#div_per_turf,#div_narr_turf, #div_vegetated_turf,#div_photo_turf";
                                break;
                            case "landscape_design_exemplary":
                                contentDivs = "#div_dio_narr, #div_area_drough,#div_species_used,#div_stamped_photo";
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
                                    $input.replaceWith($input.val('').clone(true));
                                });
                        }
                    }
                    existinglandspace();
                });
            }); 
     }



     if (subtab == "minimum_energy_performance") {
        console.log("ge");
      exisitingtoggledaylight($("#existing_apprich_similation").val(), false); 

      $("#existing_apprich_similation").change(function () {

        exisitingtoggledaylight($(this).val(), true); 
      });
    }
      let clearData = true;
      function exisitingtoggledaylight(value, clearData) { 
        if (value === "Prescriptive Approach") {
          // first option shows
          console.log("triggered", value);
          $("#div_percentage_energy_saving, #div_narrative_eng, #div_cal_del,#div_epi_calculation_eng, #div_ex_per_for, #div_project_area_details_eng, #div_monthly_energy_bill_eng, #div_photo_eng").show();

          // second option hides
          $("#div_option_narrative,#div_eng_per_saving,#div_option_deatiled,#div_calibration_nmbe, #div_exemplary_performance_eng, #div_energy_simulation_report_eng,#div_manufacturers_cut_sheets_eng,#div_lpd_calculations_eng, #div_lighting_layouts_eng, #div_hvac_layouts_eng, #div_calculations_envelope_eng,#div_wall_roof_assembly_eng,#div_simulation_output_reports_eng, #div_tenant_lease_agreement_eng, #div_declaration_letter_eng, #div_purchase_invoices_eng, #div_monthly_last_one_year_eng, #div_geotagged_timestamped_eng, #div_purchase_credit_measurement").hide();
          $("div#option_narrative_doc,div#option_deatiled_doc,div#energy_simulation_report_eng_doc,div#calibration_nmbe_doc, div#manufacturers_cut_sheets_eng_doc,div#lpd_calculations_eng_doc,div#lighting_layouts_eng_doc,div#hvac_layouts_eng_doc,div#calculations_envelope_eng_doc,div#wall_roof_assembly_eng_doc,div#simulation_output_reports_eng_doc,div#tenant_lease_agreement_eng_doc,div#declaration_letter_eng_doc,div#purchase_invoices_eng_doc,div#monthly_last_one_year_eng_doc,div#geotagged_timestamped_eng_doc,div#purchase_credit_measurement_doc").hide();
          
          // 'clearData' 
          if (clearData) { 
            $("#div_option_narrative,#div_option_deatiled,#div_eng_per_saving, #div_calibration_nmbe, #div_exemplary_performance_eng, #div_energy_simulation_report_eng,#div_manufacturers_cut_sheets_eng,#div_lpd_calculations_eng, #div_lighting_layouts_eng, #div_hvac_layouts_eng, #div_calculations_envelope_eng,#div_wall_roof_assembly_eng,#div_simulation_output_reports_eng, #div_tenant_lease_agreement_eng, #div_declaration_letter_eng, #div_purchase_invoices_eng, #div_monthly_last_one_year_eng, #div_geotagged_timestamped_eng")
              .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") 
              .not("input[type=file]") 
              .prop("checked", false)
              .val("");

              $("div#option_narrative_doc, div#calibration_nmbe_doc,div#option_deatiled_doc,div#energy_simulation_report_eng_doc,div#manufacturers_cut_sheets_eng_doc,div#lpd_calculations_eng_doc,div#lighting_layouts_eng_doc,div#hvac_layouts_eng_doc,div#calculations_envelope_eng_doc,div#wall_roof_assembly_eng_doc,div#simulation_output_reports_eng_doc,div#tenant_lease_agreement_eng_doc,div#declaration_letter_eng_doc,div#purchase_invoices_eng_doc,div#monthly_last_one_year_eng_doc,div#geotagged_timestamped_eng_doc")
                .find("input[type='file']")
                .each(function () {
                  var $input = $(this);
                  $input.replaceWith($input.val('').clone(true));
                });
          }
        } else if (value === "Calibrated Simulation") {
          console.log("triggered", value);
          $(
            "#div_option_narrative, #div_calibration_nmbe, #div_exemplary_performance_eng,#div_eng_per_saving,#div_option_deatiled, #div_energy_simulation_report_eng,#div_manufacturers_cut_sheets_eng,#div_lpd_calculations_eng, #div_lighting_layouts_eng, #div_hvac_layouts_eng, #div_calculations_envelope_eng,#div_wall_roof_assembly_eng,#div_simulation_output_reports_eng, #div_tenant_lease_agreement_eng, #div_declaration_letter_eng, #div_purchase_invoices_eng, #div_monthly_last_one_year_eng, #div_geotagged_timestamped_eng"
          ).show();
          $("#div_percentage_energy_saving, #div_narrative_eng, #div_cal_del,#div_epi_calculation_eng, #div_ex_per_for, #div_project_area_details_eng, #div_monthly_energy_bill_eng, #div_photo_eng").hide();
          $("div#narrative_eng_doc, div#cal_del_doc,div#epi_calculation_eng_doc,div#project_area_details_eng_doc,div#monthly_energy_bill_eng_doc,div#photo_eng_doc").hide();
          
          //  'clearData' 
          if (clearData) {
            // Clear the "Simulation Approach" fields when switching to "Measurement approach"
            $(
              "#div_percentage_energy_saving, #div_narrative_eng, #div_cal_del,#div_epi_calculation_eng, #div_ex_per_for,#div_project_area_details_eng, #div_monthly_energy_bill_eng, #div_photo_eng"
            )
              .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea")
              .not("input[type=file]") // Ensure file inputs aren't cleared
              .prop("checked", false)
              .val("");

              $("div#percentage_energy_saving_doc,div#narrative_eng_doc, div#cal_del_doc,div#epi_calculation_eng_doc,div#project_area_details_eng_doc,div#monthly_energy_bill_eng_doc,div#photo_eng_doc")
                .find("input[type='file']")
                .each(function () {
                  var $input = $(this);
                  $input.replaceWith($input.val('').clone(true));
                });
            console.log("Simulation value cleared", value);
          }
        } else  {
        $("#div_percentage_energy_saving, #div_eng_per_saving,#div_narrative_eng, #div_cal_del,#div_epi_calculation_eng,#div_ex_per_for, #div_project_area_details_eng, #div_monthly_energy_bill_eng, #div_photo_eng,#div_option_narrative, #div_calibration_nmbe, #div_exemplary_performance_eng, #div_option_deatiled, #div_energy_simulation_report_eng,#div_manufacturers_cut_sheets_eng,#div_lpd_calculations_eng, #div_lighting_layouts_eng, #div_hvac_layouts_eng, #div_calculations_envelope_eng,#div_wall_roof_assembly_eng,#div_simulation_output_reports_eng, #div_tenant_lease_agreement_eng, #div_declaration_letter_eng, #div_purchase_invoices_eng, #div_monthly_last_one_year_eng, #div_geotagged_timestamped_eng").hide();
      //   }

        if (clearData) {
          $("#div_narrative_eng, #div_cal_del,#div_epi_calculation_eng,#div_ex_per_for, #div_project_area_details_eng, #div_monthly_energy_bill_eng, #div_photo_eng,#div_option_narrative, #div_calibration_nmbe, #div_exemplary_performance_eng, #div_option_deatiled, #div_energy_simulation_report_eng,#div_manufacturers_cut_sheets_eng,#div_lpd_calculations_eng, #div_lighting_layouts_eng, #div_hvac_layouts_eng, #div_calculations_envelope_eng,#div_wall_roof_assembly_eng,#div_simulation_output_reports_eng, #div_tenant_lease_agreement_eng, #div_declaration_letter_eng, #div_purchase_invoices_eng, #div_monthly_last_one_year_eng, #div_geotagged_timestamped_eng")
            .find(
              "input[type=radio], input[type=checkbox], select, input[type=text], textarea"
            ).not("input[type=file]").prop("checked", false).val("");
            $("div#percentage_energy_saving_doc,div#narrative_eng_doc, div#cal_del_doc,div#epi_calculation_eng_doc,div#project_area_details_eng_doc,div#monthly_energy_bill_eng_doc,div#photo_eng_doc")
                .find("input[type='file']")
                .each(function () {
                  var $input = $(this);
                  $input.replaceWith($input.val('').clone(true));
                });


            $("div#option_narrative_doc,div#option_deatiled_doc, div#calibration_nmbe_doc,div#energy_simulation_report_eng_doc,div#manufacturers_cut_sheets_eng_doc,div#lpd_calculations_eng_doc,div#lighting_layouts_eng_doc,div#hvac_layouts_eng_doc,div#calculations_envelope_eng_doc,div#wall_roof_assembly_eng_doc,div#simulation_output_reports_eng_doc,div#tenant_lease_agreement_eng_doc,div#declaration_letter_eng_doc,div#purchase_invoices_eng_doc,div#monthly_last_one_year_eng_doc,div#geotagged_timestamped_eng_doc,div#purchase_credit_measurement_doc")
                .find("input[type='file']")
                .each(function () {
                  var $input = $(this);
                  $input.replaceWith($input.val('').clone(true));
                });
        }
          }
    }






if (subtab == "enhanced_energy_performance") {
    console.log("ge");
  existingEnchanced($("#existing_apprich_similation_ench").val(), false); 

  $("#existing_apprich_similation_ench").change(function () {

    existingEnchanced($(this).val(), true); 
  });
}

function existingEnchanced(value, clearData) { 
  if (value === "Prescriptive Approach") {
    // first option shows
    $("#div_percentage_energy_saving_ench,#div_narrative_eng_ench,#div_epi_calculation_eng_ench,#div_project_area_details_eng_ench,#div_monthly_energy_bill_eng_ench,#div_photo_eng_ench").show();

    // second option hides
    $("#div_eng_per_saving_ench,#div_option_narrative_ench,#div_option_deatiled_ench,#div_energy_simulation_report_eng_ench,#div_manufacturers_cut_sheets_eng_ench,#div_lpd_calculations_eng_ench,#div_lighting_layouts_eng_ench,#div_hvac_layouts_eng_ench,#div_calculations_envelope_eng_ench,#div_wall_roof_assembly_eng_ench,#div_simulation_output_reports_eng_ench,#div_tenant_lease_agreement_eng_ench,#div_declaration_letter_eng_ench,#div_purchase_invoices_eng_ench,#div_monthly_last_one_year_eng_ench,#div_geotagged_timestamped_eng_ench").hide();
    $("div#option_narrative_ench_doc,div#option_deatiled_ench_doc,div#energy_simulation_report_eng_ench_doc,div#manufacturers_cut_sheets_eng_ench_doc,div#lpd_calculations_eng_ench_doc,div#lighting_layouts_eng_ench_doc,div#hvac_layouts_eng_ench_doc,div#calculations_envelope_eng_ench_doc,div#wall_roof_assembly_eng_ench_doc,div#simulation_output_reports_eng_ench_doc,div#tenant_lease_agreement_eng_ench_doc,div#declaration_letter_eng_ench_doc,div#purchase_invoices_eng_ench_doc,div#monthly_last_one_year_eng_ench_doc,div#geotagged_timestamped_eng_ench_doc").hide();
    
    // 'clearData' 
    if (clearData) { 
      $("#div_eng_per_saving_ench,#div_option_narrative_ench,#div_option_deatiled_ench,#div_energy_simulation_report_eng_ench,#div_manufacturers_cut_sheets_eng_ench,#div_lpd_calculations_eng_ench,#div_lighting_layouts_eng_ench,#div_hvac_layouts_eng_ench,#div_calculations_envelope_eng_ench,#div_wall_roof_assembly_eng_ench,#div_simulation_output_reports_eng_ench,#div_tenant_lease_agreement_eng_ench,#div_declaration_letter_eng_ench,#div_purchase_invoices_eng_ench,#div_monthly_last_one_year_eng_ench,#div_geotagged_timestamped_eng_ench")
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") 
        .not("input[type=file]") 
        .prop("checked", false)
        .val("");

        $("div#option_narrative_ench_doc,div#option_deatiled_ench_doc,div#energy_simulation_report_eng_ench_doc,div#manufacturers_cut_sheets_eng_ench_doc,div#lpd_calculations_eng_ench_doc,div#lighting_layouts_eng_ench_doc,div#hvac_layouts_eng_ench_doc,div#calculations_envelope_eng_ench_doc,div#wall_roof_assembly_eng_ench_doc,div#simulation_output_reports_eng_ench_doc,div#tenant_lease_agreement_eng_ench_doc,div#declaration_letter_eng_ench_doc,div#purchase_invoices_eng_ench_doc,div#monthly_last_one_year_eng_ench_doc,div#geotagged_timestamped_eng_ench_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
    }
  } else if (value === "Calibrated Simulation") {
    
       $("#div_eng_per_saving_ench,#div_option_narrative_ench,#div_option_deatiled_ench,#div_energy_simulation_report_eng_ench,#div_manufacturers_cut_sheets_eng_ench,#div_lpd_calculations_eng_ench,#div_lighting_layouts_eng_ench,#div_hvac_layouts_eng_ench,#div_calculations_envelope_eng_ench,#div_wall_roof_assembly_eng_ench,#div_simulation_output_reports_eng_ench,#div_tenant_lease_agreement_eng_ench,#div_declaration_letter_eng_ench,#div_purchase_invoices_eng_ench,#div_monthly_last_one_year_eng_ench,#div_geotagged_timestamped_eng_ench").show();
       $("#div_percentage_energy_saving_ench,#div_narrative_eng_ench,#div_epi_calculation_eng_ench,#div_project_area_details_eng_ench,#div_monthly_energy_bill_eng_ench,#div_photo_eng_ench").hide();
        $("div#percentage_energy_saving_ench_doc,div#narrative_eng_ench_doc,div#epi_calculation_eng_ench_doc,div#project_area_details_eng_ench_doc,div#monthly_energy_bill_eng_ench_doc,div#photo_eng_ench_doc").hide();

    //  'clearData' 
    if (clearData) {
      // Clear the "Simulation Approach" fields when switching to "Measurement approach"
      $("#div_percentage_energy_saving_ench,#div_narrative_eng_ench,#div_epi_calculation_eng_ench,#div_project_area_details_eng_ench,#div_monthly_energy_bill_eng_ench,#div_photo_eng_ench")
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea")
        .not("input[type=file]") // Ensure file inputs aren't cleared
        .prop("checked", false)
        .val("");

         $("div#percentage_energy_saving_ench_doc,div#narrative_eng_ench_doc,div#epi_calculation_eng_ench_doc,div#project_area_details_eng_ench_doc,div#monthly_energy_bill_eng_ench_doc,div#photo_eng_ench_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      console.log("Simulation value cleared", value);
    }
  } else  {
  $("#div_percentage_energy_saving_ench,#div_narrative_eng_ench,#div_epi_calculation_eng_ench,#div_project_area_details_eng_ench,#div_monthly_energy_bill_eng_ench,#div_photo_eng_ench,#div_eng_per_saving_ench,#div_option_narrative_ench,#div_option_deatiled_ench,#div_energy_simulation_report_eng_ench,#div_manufacturers_cut_sheets_eng_ench,#div_lpd_calculations_eng_ench,#div_lighting_layouts_eng_ench,#div_hvac_layouts_eng_ench,#div_calculations_envelope_eng_ench,#div_wall_roof_assembly_eng_ench,#div_simulation_output_reports_eng_ench,#div_tenant_lease_agreement_eng_ench,#div_declaration_letter_eng_ench,#div_purchase_invoices_eng_ench,#div_monthly_last_one_year_eng_ench,#div_geotagged_timestamped_eng_ench").hide();
//   }

  if (clearData) {
    $("#div_percentage_energy_saving_ench,#div_narrative_eng_ench,#div_epi_calculation_eng_ench,#div_project_area_details_eng_ench,#div_monthly_energy_bill_eng_ench,#div_photo_eng_ench,#div_eng_per_saving_ench,#div_option_narrative_ench,#div_option_deatiled_ench,#div_energy_simulation_report_eng_ench,#div_manufacturers_cut_sheets_eng_ench,#div_lpd_calculations_eng_ench,#div_lighting_layouts_eng_ench,#div_hvac_layouts_eng_ench,#div_calculations_envelope_eng_ench,#div_wall_roof_assembly_eng_ench,#div_simulation_output_reports_eng_ench,#div_tenant_lease_agreement_eng_ench,#div_declaration_letter_eng_ench,#div_purchase_invoices_eng_ench,#div_monthly_last_one_year_eng_ench,#div_geotagged_timestamped_eng_ench")
      .find(
        "input[type=radio], input[type=checkbox], select, input[type=text], textarea"
      ).not("input[type=file]").prop("checked", false).val("");
      $("div#percentage_energy_saving_ench_doc,div#narrative_eng_ench_doc,div#epi_calculation_eng_ench_doc,div#project_area_details_eng_ench_doc,div#monthly_energy_bill_eng_ench_doc,div#photo_eng_ench_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });


       $("div#option_narrative_doc,div#calibration_nmbe_doc,div#option_deatiled_doc,div#energy_simulation_report_eng_doc,div#manufacturers_cut_sheets_eng_doc,div#lpd_calculations_eng_doc,div#lighting_layouts_eng_doc,div#hvac_layouts_eng_doc,div#calculations_envelope_eng_doc,div#wall_roof_assembly_eng_doc,div#simulation_output_reports_eng_doc,div#tenant_lease_agreement_eng_doc,div#declaration_letter_eng_doc,div#purchase_invoices_eng_doc,div#monthly_last_one_year_eng_doc,div#geotagged_timestamped_eng_doc,div#purchase_credit_measurement_doc,div#option_narrative_ench_doc,div#option_deatiled_ench_doc,div#energy_simulation_report_eng_ench_doc,div#manufacturers_cut_sheets_eng_ench_doc,div#lpd_calculations_eng_ench_doc,div#lighting_layouts_eng_ench_doc,div#hvac_layouts_eng_ench_doc,div#calculations_envelope_eng_ench_doc,div#wall_roof_assembly_eng_ench_doc,div#simulation_output_reports_eng_ench_doc,div#tenant_lease_agreement_eng_ench_doc,div#declaration_letter_eng_ench_doc,div#purchase_invoices_eng_ench_doc,div#monthly_last_one_year_eng_ench_doc,div#geotagged_timestamped_eng_ench_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
  }
    }
}


if (subtab == "indoor_air_quality") {
        $(document).ready(function () { 
            function factoryAirQuality() {

                // --- mechanically_ventilated_spaces---
                if ($("input[name='indoor_monitor_iaq']").is(":checked")) {
                    $("#div_indoor_total_area, #div_indoor_parameters_area").show();
                } else {
                      $("#div_indoor_total_area, #div_indoor_parameters_area").hide();
                } 
               
            }

            
            factoryAirQuality();

            $(
                "input[name='indoor_monitor_iaq']"
            ).change(function () {
                
                // If the box that triggered this change is now UNCHECKED, clear its related fields.
                if (!$(this).is(":checked")) {
                    
                    // Get the ID of the related content DIVs to clear
                    let contentDivs;
                    switch ($(this).attr("name")) {
                        case "indoor_monitor_iaq":
                            contentDivs = "#div_indoor_total_area, #div_indoor_parameters_area";
                            break;
                        default:
                            contentDivs = "";
                    }

                    // Clear the content fields within the hidden section
                    if (contentDivs) {
                        $(contentDivs)
                            .find("input[type=checkbox], input[type=radio], input[type=text], textarea, select")
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
                factoryAirQuality();
            });
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


if (subtab == 'natural_topography') {

    function handleTopographySelection() {
                  // $("#div_casea_vegetation").show();

        let selectedOption = $('#select_casea_vegetation').val();

        // Hide everything first (clean reset)
        $("[id^='div_casea_']").hide();
        $("[id^='div_caseb_']").hide();

        
        if (selectedOption === 'Option 1: Natural topography and/or landscape area') {

            $("#div_casea_total_site_area").show();
            $("#div_casea_natural_area").show();
            $("#div_casea_vegetated_area").show();
            $("#div_casea_total_area").show();
            $("#div_casea_percentage").show();
            $("#div_casea_adaptive").show();
            $("#div_casea_natural_topography_percent").show();

            calculateCaseA();
        }

      
        if (selectedOption === 'Option 2: Vegetatoin over build structure') {

            $("#div_caseb_total_site_area").show();
            $("#div_caseb_natural_area").show();
            $("#div_caseb_vegetated_area").show();
            $("#div_caseb_vegetated_structure").show();
            $("#div_caseb_total_area").show();
            $("#div_caseb_percent").show();
            $("#div_caseb_total_area_buildup").show();
            $("#div_caseb_natural_topography_2").show();
            $("#div_caseb_adaptive_3").show();
            $("#div_caseb_adaptive_2").show();

            calculateCaseB();
        }
    }

 
    function calculateCaseA() {

        let vegetated = parseFloat($('#casea_vegetated_area').val()) || 0;
        let natural   = parseFloat($('#casea_natural_area').val()) || 0;
        let adaptive  = parseFloat($('#casea_adaptive').val()) || 0;
        let totalSite = parseFloat($('#casea_total_site_area').val()) || 0;

        let total = vegetated + natural + adaptive;

        let percent = (total > 0 && totalSite > 0)
            ? (total / totalSite) * 100
            : 0;

        $('#casea_natural_topography_percent').val(percent.toFixed(2));
    }

  
    function calculateCaseB() {

        let adaptive2 = parseFloat($('#caseb_adaptive_2').val()) || 0;
        let adaptive3 = parseFloat($('#caseb_adaptive_3').val()) || 0;
        let natural   = parseFloat($('#caseb_natural_area').val()) || 0;
        let vegetated = parseFloat($('#caseb_vegetated_area').val()) || 0;
        let totalSite = parseFloat($('#caseb_total_site_area').val()) || 0;

        let total = adaptive2 + adaptive3 + natural + vegetated;

        let percent = (total > 0 && totalSite > 0)
            ? (total / totalSite) * 100
            : 0;

        $('#caseb_natural_topography_2').val(percent.toFixed(2));
    }

    // Trigger when dropdown changes
    $('#select_casea_vegetation').on('change', function () {
        handleTopographySelection();
    });

    // Run once on page load (important if editing saved data)
    handleTopographySelection();
}

if(subtab == 'organic_waste_management_post'){
  $('#garden_generated_waste').on('keyup', function(){
    let garden = $(this).val();
    let food = $('#org_generated_waste').val();

    let tot = parseFloat(garden) + parseFloat(food);

      $('#total_generated_waste').val(tot.toFixed(2));
  });
}


