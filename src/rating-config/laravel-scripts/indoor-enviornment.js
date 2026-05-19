if ($("#case_1_non_airconditioning_spaces").is(':checked')) {
    alert
    $("#div_meets_mandatory_requirement").show();
    $("#div_minimum_fresh_air_narrative").show();
    $("#div_floor_plan_indicating").show();
    $("#div_photographs_videos_geotagged").show();

            $('table#minimum_fresh_air_narrative_doc_table').show();
            $('table#floor_plan_indicating_doc_table').show();
     $('table#photographs_videos_geotagged_doc_table').show();

} else {
    $("#div_meets_mandatory_requirement").hide();
    $("#div_minimum_fresh_air_narrative").hide();
    $("#div_floor_plan_indicating").hide();
    $("#div_photographs_videos_geotagged").hide();
   
    $('table#minimum_fresh_air_narrative_doc_table').hide();
    $('table#floor_plan_indicating_doc_table').hide();
     $('table#photographs_videos_geotagged_doc_table').hide();


}


if ($("#case_2_annex_fresh_air_ac").is(':checked')) {
    $("#div_minimum_ventilation_of_freshair").show();
    $("#div_hvac_layout_with_location").show();
    $("#div_technical_cutsheet_fresh_air_system").show();
    $("#div_photographs_videos_geotagged_fresh_air").show();
    $("#div_purchase_invoice_fresh_air").show();
    $("#div_tenant_lease_agreement_declaration_letter").show();
    $("#div_calculation_of_design_peak_occupancy").show();
    $('#photographs_videos_geotagged_doc_table').hide();

} else {
    $("#div_minimum_ventilation_of_freshair").hide();
    $("#div_hvac_layout_with_location").hide();
    $("#div_technical_cutsheet_fresh_air_system").hide();
    $("#div_photographs_videos_geotagged_fresh_air").hide();
    $("#div_purchase_invoice_fresh_air").hide();
    $("#div_tenant_lease_agreement_declaration_letter").hide();
    $("#div_calculation_of_design_peak_occupancy").hide();

}


$('#case_1_non_airconditioning_spaces').change(function () {
    if (this.checked) {
        $("#div_meets_mandatory_requirement").show();
        $("#div_minimum_fresh_air_narrative").show();
        $("#div_floor_plan_indicating").show();
        $("#div_photographs_videos_geotagged").show();
       
        $('table#minimum_fresh_air_narrative_doc_table').show();
        $('table#floor_plan_indicating_doc_table').show();
        $('table#photographs_videos_geotagged_doc_table').show();

    }  else {
        $("#div_meets_mandatory_requirement").hide();
        $("#div_minimum_fresh_air_narrative").hide();
        $("#div_floor_plan_indicating").hide();
        $("#div_photographs_videos_geotagged").hide();

        $('table#minimum_fresh_air_narrative_doc_table').hide();
        $('table#floor_plan_indicating_doc_table').hide();
        $('table#photographs_videos_geotagged_doc_table').hide();
        $("div#meets_mandatory_requirement_doc, div#minimum_fresh_air_narrative_doc, div#floor_plan_indicating_doc, div#photographs_videos_geotagged_doc, table#minimum_fresh_air_narrative_doc_table, table#floor_plan_indicating_doc_table, table#photographs_videos_geotagged_doc_table").hide();

    
    }
    
});


$('#case_2_annex_fresh_air_ac').change(function () {
    if (this.checked) {
        $("#div_minimum_ventilation_of_freshair").show();
        $("#div_hvac_layout_with_location").show();
        $("#div_technical_cutsheet_fresh_air_system").show();
        $("#div_photographs_videos_geotagged_fresh_air").show();
        $("#div_purchase_invoice_fresh_air").show();
        $("#div_tenant_lease_agreement_declaration_letter").show();
        $("#div_calculation_of_design_peak_occupancy").show();
    } else {
        $("#div_minimum_ventilation_of_freshair").hide();
        $("#div_hvac_layout_with_location").hide();
        $("#div_technical_cutsheet_fresh_air_system").hide();
        $("#div_photographs_videos_geotagged_fresh_air").hide();
        $("#div_purchase_invoice_fresh_air").hide();
        $("#div_tenant_lease_agreement_declaration_letter").hide();
        $("#div_calculation_of_design_peak_occupancy").hide();
        $("div#minimum_ventilation_of_freshair_doc, div#hvac_layout_with_location_doc, div#technical_cutsheet_fresh_air_system_doc, div#photographs_videos_geotagged_fresh_air_doc, div#purchase_invoice_fresh_air_doc, div#tenant_lease_agreement_declaration_letter_doc, div#calculation_of_design_peak_occupancy_doc").hide();


        

    }

});

$('#input_number_of_plants_provided').on('keyup', function () {
    let provided = $('#input_number_of_plants_provided').val();
    let required = $("#required_number_of_plants").val();

    let percent = (provided/required)*100

    $('#display_percentage_of_indoor_plants_provided').val(percent.toFixed(2));
});


if (subtab == 'tobacco_smoke_control') {
    $(function () {
        function tobacooSmoking() {
            const tobaccoSmoke = $("input[name='smoke_free_zone']").is(":checked");
            const designatedChecked = $("input[name='designated_smoking_area']").is(":checked");

            if (tobaccoSmoke) {
                $("#div_tobacco_smoke_control_narrative, #div_declaration_letter_no_smoking, #div_plan_showing_signages, #div_geotagged_photographs_signages").show();
            } else {
                $("#div_tobacco_smoke_control_narrative, #div_declaration_letter_no_smoking, #div_plan_showing_signages, #div_geotagged_photographs_signages").hide();
                $("div#tobacco_smoke_control_narrative_doc, div#declaration_letter_no_smoking_doc, div#plan_showing_signages_doc, div#geotagged_photographs_signages_doc").hide();

            }

            if (designatedChecked) {
                $("#div_declaration_designated_smoking,#div_tobacco_smoke_designated_narrative, #div_plan_showing_designated_smoking, #div_geotagged_designated_smoking, #div_exhust_installed_smoking").show();
            } else {
                $("#div_declaration_designated_smoking, #div_tobacco_smoke_designated_narrative, #div_plan_showing_designated_smoking, #div_geotagged_designated_smoking, #div_exhust_installed_smoking").hide();
                $("div#declaration_designated_smoking_doc,div#tobacco_smoke_designated_narrative_doc, div#plan_showing_designated_smoking_doc, div#geotagged_designated_smoking_doc, div#exhust_installed_smoking_doc").hide();

            }
        }

        tobacooSmoking(); 
        $(document).on("change", "input[name='smoke_free_zone'], input[name='designated_smoking_area']", tobacooSmoking);
    });
}



// checkbox
if (subtab == 'minimum_fresh_air_requirements') {
    $(function () {
        function freshair() {
            const tobaccoSmoke = $("input[name='mechanical_ventilation']").is(":checked");
            const designatedChecked = $("input[name='natural_ventilation']").is(":checked");

            if (tobaccoSmoke) {
                $("#div_fresh_air_mechanical_ventilation, #div_percentage_fresh_air_supplied, #div_minimum_fresh_air_narratives, #div_calculation_of_design, #div_project_indicating_fresh, #div_purchase_invoice_fresh_airsystem, #div_technical_cutsheet_fresh, #div_photographs_videos_air").show();
            } else {
                $("#div_fresh_air_mechanical_ventilation, #div_percentage_fresh_air_supplied, #div_minimum_fresh_air_narratives, #div_calculation_of_design, #div_project_indicating_fresh, #div_purchase_invoice_fresh_airsystem, #div_technical_cutsheet_fresh, #div_photographs_videos_air").hide();
                $("div#fresh_air_mechanical_ventilation_doc, div#percentage_fresh_air_supplied_doc, div#minimum_fresh_air_narratives_doc, div#calculation_of_design_doc, div#project_indicating_fresh_doc, div#purchase_invoice_fresh_airsystem_doc, div#technical_cutsheet_fresh_doc, div#photographs_videos_air_doc").hide();

            }

            if (designatedChecked) {
                $("#div_fresh_air_ventilation, #div_mandatory_fresh_air_requirement, #div_mandatoryechanced_fresh_air, #div_planfloor_indicating, #div_tagged_geo_short").show();
            } else {
                $("#div_fresh_air_ventilation, #div_mandatory_fresh_air_requirement, #div_mandatoryechanced_fresh_air, #div_planfloor_indicating, #div_tagged_geo_short").hide();
                $("div#fresh_air_ventilation_doc, div#mandatory_fresh_air_requirement_doc, div#mandatoryechanced_fresh_air_doc, div#planfloor_indicating_doc, div#tagged_geo_short_doc").hide();

            }
        }

        freshair();
        $(document).on("change", "input[name='mechanical_ventilation'], input[name='natural_ventilation']", freshair);
    });
}



// radio
// if (subtab == 'daylighting_credit') {

//     function toggleDaylight(clearHidden = false) {
//         let val = $("input[name='case_options_daylighting_credit']:checked").val();

//         if (val == "1") {
//             $("#div_daylight_measurement_report, #div_daylighting_narrative, #div_floor_plan_indicating_window_door_schedule, #div_drawing_highlighting_angle_of_obstruction, #div_measurement_report_space_wise_lux, #div_geotagged_photographs_videos_lux_meter").show();
//             $(" #div_simulation_report_daylight, #div_daylighting_simulation_narrative,#div_floor_plan_simulation_indicating_window_door_schedule, #div_manufacturer_brochure_glass, #div_photographs_geotagged_daylighting").hide();
//             $("div#simulation_report_daylight_doc, div#daylighting_simulation_narrative_doc, div#floor_plan_simulation_indicating_window_door_schedule_doc, div#manufacturer_brochure_glass_doc, div#photographs_geotagged_daylighting_doc").hide();

//             if (clearHidden) {
//                 $("#div_simulation_report_daylight, #div_manufacturer_brochure_glass, #div_photographs_geotagged_daylighting").find("input, select, textarea").val('');
//             }

//         } else if (val == "2") {
//             $("#div_daylighting_narrative, #div_declaration_project_owner, #div_floor_plan_indicating_window_door_schedule, #div_drawing_highlighting_angle_of_obstruction, #div_measurement_report_space_wise_lux, #div_geotagged_photographs_videos_lux_meter").hide();
//             $("#div_daylight_measurement_report, #div_simulation_report_daylight, #div_floor_plan_simulation_indicating_window_door_schedule,  #div_daylighting_simulation_narrative, #div_simulation_report_daylight, #div_manufacturer_brochure_glass, #div_photographs_geotagged_daylighting").show();
//             $("div#daylighting_narrative_doc, div#simulation_report_daylight_doc, div#floor_plan_indicating_window_door_schedule_doc,  div#declaration_project_owner_doc, div#drawing_highlighting_angle_of_obstruction_doc, div#measurement_report_space_wise_lux_doc, div#geotagged_photographs_videos_lux_meter_doc").hide();



//             if (clearHidden) {
//                 $(" #div_daylighting_narrative, #div_declaration_project_owner, #div_drawing_highlighting_angle_of_obstruction, #div_measurement_report_space_wise_lux, #div_geotagged_photographs_videos_lux_meter").find("input, select, textarea").val('');
//             }

//         } else {
//             $("#div_daylight_measurement_report,#div_simulation_report_daylight,#div_floor_plan_simulation_indicating_window_door_schedule, #div_daylighting_simulation_narrative, #div_floor_plan_indicating_window_door_schedule, #div_manufacturer_brochure_glass, #div_photographs_geotagged_daylighting, #div_daylighting_narrative, #div_floor_plan_indicating_window_door_schedule, #div_drawing_highlighting_angle_of_obstruction, #div_measurement_report_space_wise_lux, #div_geotagged_photographs_videos_lux_meter")
//                 .hide();
//         }
//     }

//     toggleDaylight(false);

//     $("input[name='case_options_daylighting_credit']").change(function () {
//         toggleDaylight(true);
//     });
// }



if (subtab == 'daylighting_credit') {
    function toggleDaylight(clearHidden = false) {
        let val = $("input[name='case_options_daylighting_credit']:checked").val();

        if (val == "1") {
            $("#div_daylight_measurement_report, #div_daylighting_narrative, #div_floor_plan_indicating_window_door_schedule, #div_drawing_highlighting_angle_of_obstruction, #div_measurement_report_space_wise_lux, #div_geotagged_photographs_videos_lux_meter").show();

            $("#div_simulation_report_daylight, #div_daylighting_simulation_narrative, #div_floor_plan_simulation_indicating_window_door_schedule, #div_manufacturer_brochure_glass, #div_photographs_geotagged_daylighting").hide();
            $("#simulation_report_daylight_doc, #daylighting_simulation_narrative_doc, #floor_plan_simulation_indicating_window_door_schedule_doc, #manufacturer_brochure_glass_doc, #photographs_geotagged_daylighting_doc").hide();

            if (clearHidden) {
                $("#div_simulation_report_daylight, #div_daylighting_simulation_narrative, #div_floor_plan_simulation_indicating_window_door_schedule, #div_manufacturer_brochure_glass, #div_photographs_geotagged_daylighting")
                    .find("input, select, textarea").val('').prop("checked", false);
            }

        } else if (val == "2") {
            $("#div_daylight_measurement_report, #div_simulation_report_daylight, #div_floor_plan_simulation_indicating_window_door_schedule, #div_daylighting_simulation_narrative, #div_manufacturer_brochure_glass, #div_photographs_geotagged_daylighting").show();

            $("#div_daylighting_narrative, #div_declaration_project_owner, #div_floor_plan_indicating_window_door_schedule, #div_drawing_highlighting_angle_of_obstruction, #div_measurement_report_space_wise_lux, #div_geotagged_photographs_videos_lux_meter").hide();
            $("#daylighting_narrative_doc, #declaration_project_owner_doc, #floor_plan_indicating_window_door_schedule_doc, #drawing_highlighting_angle_of_obstruction_doc, #measurement_report_space_wise_lux_doc, #geotagged_photographs_videos_lux_meter_doc").hide();

            if (clearHidden) {
                $("#div_daylighting_narrative, #div_declaration_project_owner, #div_floor_plan_indicating_window_door_schedule, #div_drawing_highlighting_angle_of_obstruction, #div_measurement_report_space_wise_lux, #div_geotagged_photographs_videos_lux_meter")
                    .find("input, select, textarea").val('').prop("checked", false);
            }

        } else {
            $("#div_daylight_measurement_report, #div_simulation_report_daylight, #div_floor_plan_simulation_indicating_window_door_schedule, #div_daylighting_simulation_narrative, #div_manufacturer_brochure_glass, #div_photographs_geotagged_daylighting, #div_daylighting_narrative, #div_declaration_project_owner, #div_floor_plan_indicating_window_door_schedule, #div_drawing_highlighting_angle_of_obstruction, #div_measurement_report_space_wise_lux, #div_geotagged_photographs_videos_lux_meter").hide();
        }
    }
    toggleDaylight(false);

    $("input[name='case_options_daylighting_credit']").change(function () {
        toggleDaylight(true);
    });
}


// select
// if (subtab == 'thermal_comfort') {

//     // On page load check the current value
//     if ($("#compliancesyn").val() == "Yes") {
//         $("#div_narrative_thermal_comfort").show();
//         $("#div_existing_interiors_project").show();
//         $("#div_interior_project_new").show();
//         $("#div_calculation_indicating_more_than_75").show();
//         $("#div_geotagged_photographs_videos_thermostat").show();
        
//     } else {
//         $("#div_narrative_thermal_comfort").hide();
//         $("#div_existing_interiors_project").hide();
//         $("#div_interior_project_new").hide();
//         $("#div_calculation_indicating_more_than_75").hide();
//         $("#div_geotagged_photographs_videos_thermostat").hide();
//         $("div#narrative_thermal_comfort_doc, div#existing_interiors_project_doc, div#interior_project_new_doc, div#calculation_indicating_more_than_75_doc, div#geotagged_photographs_videos_thermostat_doc").hide();

//     }

//     $('#compliancesyn').change(function() {
//         if ($(this).val() == "Yes") {
//             $("#div_narrative_thermal_comfort").show();
//             $("#div_existing_interiors_project").show();
//             $("#div_interior_project_new").show();
//             $("#div_calculation_indicating_more_than_75").show();
//             $("#div_geotagged_photographs_videos_thermostat").show();
            
//         } else {
//             $("#div_narrative_thermal_comfort").hide();
//             $("#div_existing_interiors_project").hide();
//             $("#div_interior_project_new").hide();
//             $("#div_calculation_indicating_more_than_75").hide();
//             $("#div_geotagged_photographs_videos_thermostat").hide();
//             $("div#narrative_thermal_comfort_doc, div#existing_interiors_project_doc, div#interior_project_new_doc, div#calculation_indicating_more_than_75_doc, div#geotagged_photographs_videos_thermostat_doc").hide();

//         }
//     });
// }


if (subtab == 'thermal_comfort') {

    function toggleThermal(clearHidden = false) {
        let val = $("#compliancesyn").val();

        if (val == "Yes") {
            // Show Yes fields
            $("#div_narrative_thermal_comfort, #div_existing_interiors_project, #div_interior_project_new, #div_calculation_indicating_more_than_75, #div_geotagged_photographs_videos_thermostat").show();

        } else {
            // Hide Yes fields
            $("#div_narrative_thermal_comfort, #div_existing_interiors_project, #div_interior_project_new, #div_calculation_indicating_more_than_75, #div_geotagged_photographs_videos_thermostat").hide();
            $("#narrative_thermal_comfort_doc, #existing_interiors_project_doc, #interior_project_new_doc, #calculation_indicating_more_than_75_doc, #geotagged_photographs_videos_thermostat_doc").hide();

            if (clearHidden) {
                // Clear inputs when switching to "No"
                $("#div_narrative_thermal_comfort, #div_existing_interiors_project, #div_interior_project_new, #div_calculation_indicating_more_than_75, #div_geotagged_photographs_videos_thermostat")
                    .find("input, select, textarea")
                    .val('')
                    .prop("checked", false);
            }
        }
    }

    toggleThermal(false);
    $('#compliancesyn').change(function () {
        toggleThermal(true);
    });
}


// checkboxx
if (subtab == 'material_acoustic_performance') {
    $(function () {
        function acousticperformance() {
            const mechanicalven = $("input[name='system_ceiling']").is(":checked");
            const naturalVen = $("input[name='system_floor']").is(":checked");
            const noiseceriteria = $("input[name='criteria_noise']").is(":checked");

             $("#div_credit_requirements,#div_narrative_noise_criteria, #div_narrative_flooring_system, #div_consolidated_noise_levels, #div_geo_tagged_fitout, #div_percentage_area_meeting_acoustic, #div_narrative_acoustic, #div_technical_datasheet_nrc_floors_ceiling, #div_noise_criteria, #div_percentage_cal, #div_highlighting_areas_acoustical, #div_close_geotagged, #div_nrc_value_flooring_system, #div_percentage_area_flooring, #div_legend_flooring_type, #div_acoustical_flooring_system").hide();

            if (mechanicalven) {
                $("#div_narrative_acoustic, #div_technical_datasheet_nrc_floors_ceiling, #div_percentage_cal, #div_highlighting_areas_acoustical, #div_close_geotagged").show();
                $("div#nrc_value_flooring_system_doc, div#percentage_area_flooring_doc, div#legend_flooring_type_doc, div#acoustical_flooring_system_doc, div#noise_criteria_doc").hide();
                $("div#credit_requirements_doc, div#percentage_area_meeting_acoustic_doc, div#narrative_noise_criteria_doc, div#narrative_flooring_system_doc,  div#consolidated_noise_levels_doc, div#geo_tagged_fitout_doc").hide();

            }

            if (naturalVen) {
                $("#div_nrc_value_flooring_system, #div_narrative_flooring_system, #div_percentage_area_flooring, #div_legend_flooring_type, #div_acoustical_flooring_system, #div_noise_criteria").show();
                $(" div#narrative_noise_criteria_doc, div#narrative_acoustic_doc, div#consolidated_noise_levels_doc, div#technical_datasheet_nrc_floors_ceiling_doc, div#percentage_cal_doc, div#highlighting_areas_acoustical_doc, div#close_geotagged_doc").hide();

            }
            if (noiseceriteria) {
                $("#div_credit_requirements,#div_percentage_area_meeting_acoustic, #div_narrative_noise_criteria, #div_consolidated_noise_levels, #div_geo_tagged_fitout").show();
                $("div#technical_datasheet_nrc_floors_ceiling_doc, div#percentage_cal_doc, div#highlighting_areas_acoustical_doc, div#close_geotagged_doc").hide();
                $(" div#nrc_value_flooring_system_doc, div#narrative_flooring_system_doc, div#narrative_acoustic_doc, div#percentage_area_flooring_doc, div#legend_flooring_type_doc, div#acoustical_flooring_system_doc, div#noise_criteria_doc").hide();

            }
        }

        acousticperformance();
        $(document).on("change", "input[name='system_ceiling'], input[name='system_floor'], input[name='criteria_noise']", acousticperformance);
    });
}


if (subtab == 'minimise_indoor_pollutant') {
  $(function () {

    // map a child "name" -> its _doc div(s)
    function docSel(name) {
      return "#" + name + "_doc, #div_" + name + "_doc";
    }

    // hide all _doc divs for every checkbox inside a scope (even if _doc is elsewhere)
    function hideDocsIn($scope, clearFiles = true) {
      $scope.find("input[type=checkbox]").each(function () {
        const name = $(this).attr("name");
        const $doc = $(docSel(name));
        $doc.hide();
        if (clearFiles) {
          $doc.find("input[type='file']").val(""); // reset file inputs in UI
        }
      });
    }

    function minimiseindoor() {
      const mechanicalvenair   = $("input[name='fresh_air_supply_25_feet_away']").is(":checked");
      const naturalVenair      = $("input[name='install_entryway_systems']").is(":checked");
      const noiseceriteriaair  = $("input[name='isolate_areas_exposed_hazardous_gases']").is(":checked");
      const cleanairfilters    = $("input[name='clean_air_conditioning_ducts_filters']").is(":checked");
      const greenhouse         = $("input[name='green_house_keeping_products']").is(":checked");

      // 1) Hide all main sections first
      $("#div_narrative_keeping_daily,#div_narrative_clean_air,#div_narrative_geotagged_entry_way_installed,#div_ecolabeling_certificate,#div_narrative_install_entryway_systems, #div_green_consumbales_procured, #div_green_consumbales,#div_least_pervious,#div_air_condition_ducts,#div_isolcation_exposed_hazardous,#div_measures_undertaken,#div_geotagged_entry_way,#div_narrative_minimise_indoor_pollutant,#div_floor_plan_fresh_air_intake_source_contamination,#div_geotagged_videos_source_contamination").hide();

      // 2) Parent groups: show when checked, else uncheck children + hide their _doc(s)
      // fresh_air_supply_25_feet_away group
      const $g1 = $("#div_narrative_minimise_indoor_pollutant, #div_floor_plan_fresh_air_intake_source_contamination, #div_geotagged_videos_source_contamination");
      if (mechanicalvenair) {
        $g1.show();
      } else {
        $g1.find("input[type=checkbox]").prop("checked", false);
        hideDocsIn($g1); // hides docs using child names, even if docs live outside
      }

      // install_entryway_systems group
      const $g2 = $("#div_narrative_install_entryway_systems, #div_geotagged_entry_way");
      if (naturalVenair) {
        $g2.show();
      } else {
        $g2.find("input[type=checkbox]").prop("checked", false);
        hideDocsIn($g2);
      }

      // isolate_areas_exposed_hazardous_gases group
      const $g3 = $("#div_narrative_geotagged_entry_way_installed, #div_isolcation_exposed_hazardous, #div_measures_undertaken");
      if (noiseceriteriaair) {
        $g3.show();
      } else {
        $g3.find("input[type=checkbox]").prop("checked", false);
        hideDocsIn($g3);
      }

      // clean_air_conditioning_ducts_filters group
      const $g4 = $("#div_narrative_clean_air, #div_air_condition_ducts");
      if (cleanairfilters) {
        $g4.show();
      } else {
        $g4.find("input[type=checkbox]").prop("checked", false);
        hideDocsIn($g4);
      }

      // green_house_keeping_products group
      const $g5 = $("#div_narrative_keeping_daily, #div_ecolabeling_certificate, #div_green_consumbales, #div_green_consumbales_procured, #div_least_pervious");
      if (greenhouse) {
        $g5.show();
      } else {
        $g5.find("input[type=checkbox]").prop("checked", false);
        hideDocsIn($g5);
      }

      // 3) Finally, for *all* checkboxes: show its _doc only if that checkbox is checked
      $("input[type=checkbox]").each(function () {
        const $cb = $(this);
        const name = $cb.attr("name");
        const $doc = $(docSel(name));
        if ($doc.length) {
          $doc.toggle($cb.is(":checked"));
        }
      });
    }

    // Run once on page load
    minimiseindoor();

    // Run on any parent/child checkbox change
    $(document).on(
      "change",
      "input[name='fresh_air_supply_25_feet_away'], input[name='install_entryway_systems'], input[name='isolate_areas_exposed_hazardous_gases'], input[name='clean_air_conditioning_ducts_filters'], input[name='green_house_keeping_products'], input[type=checkbox]",
      minimiseindoor
    );
  });
}


// if (subtab == 'low_emitting_materials') {
//     $(function () {
//         function emittingMaterials() {
//             const mechanicalvenair = $("input[name='paints_coatings']").is(":checked");
//             const naturalVenair = $("input[name='adhesives']").is(":checked");
//             const noiseceriteriaair = $("input[name='composite_wood']").is(":checked");
//             const floorsys = $("input[name='flooring_sys']").is(":checked");
           
//                 $("#div_narrative_adhesives,#div_composite_narrative,#div_receipts_composite_wood, #div_safety_data_urea, #div_calimed_material, #div_narrative_low_emitting_materials, #div_payment_receipts, #div_manufacturer_adhesives, #div_certificate_green_pro, #div_narrative_low_emitting_materials, #div_voc_content_materials, #div_purchase_invoice_voc, #div_manufacturer_brochures_cut_sheets, #div_green_pro_certificate").hide();
//                 $("#div_flooring_narrative,#div_cal_indicating_area,#div_floor_plan_highlighting_area,#div_purchase_invoice_payrece,#div_green_cri_claimed").hide();
//             if (mechanicalvenair) {
//                 $("#div_narrative_low_emitting_materials, #div_voc_content_materials, #div_purchase_invoice_voc, #div_manufacturer_brochures_cut_sheets, #div_green_pro_certificate").show();
//                 $("div#receipts_composite_wood_doc, div#safety_data_urea_doc, div#calimed_material_doc").hide();
//                 $("div#payment_receipts_doc,  div#manufacturer_adhesives_doc, div#certificate_green_pro_doc").hide();
//                 $("div#narrative_adhesives_doc, div#composite_narrative_doc, div#flooring_narrative_doc,div#cal_indicating_area_doc,div#floor_plan_highlighting_area_doc,div#purchase_invoice_payrece_doc,div#green_cri_claimed_doc").hide();
//             }

//             if (naturalVenair) {
//                 $("#div_narrative_adhesives, #div_payment_receipts, #div_manufacturer_adhesives, #div_certificate_green_pro").show();
//                 $("div#voc_content_materials_doc,   div#purchase_invoice_voc_doc, div#manufacturer_brochures_cut_sheets_doc, div#green_pro_certificate_doc").hide();
//                 $("div#composite_narrative_doc,div#receipts_composite_wood_doc, div#safety_data_urea_doc, div#calimed_material_doc").hide();
//                 $("div#flooring_narrative_doc,div#cal_indicating_area_doc,div#floor_plan_highlighting_area_doc,div#purchase_invoice_payrece_doc,div#green_cri_claimed_doc").hide();

//             }
//             if (noiseceriteriaair) {
//                 $("#div_composite_narrative, #div_receipts_composite_wood, #div_safety_data_urea, #div_calimed_material").show();
//                 $(" div#voc_content_materials_doc,   div#purchase_invoice_voc_doc, div#manufacturer_brochures_cut_sheets_doc, div#green_pro_certificate_doc").hide();
//                 $("div#payment_receipts_doc,  div#manufacturer_adhesives_doc, div#certificate_green_pro_doc").hide();
//                 $("div#narrative_adhesives_doc,div#flooring_narrative_doc,div#cal_indicating_area_doc,div#floor_plan_highlighting_area_doc,div#purchase_invoice_payrece_doc,div#green_cri_claimed_doc").hide();


//             }   
//             if (floorsys) {
//                 $("#div_flooring_narrative,#div_cal_indicating_area,#div_floor_plan_highlighting_area,#div_purchase_invoice_payrece,#div_green_cri_claimed").show();
//                 $("div#voc_content_materials_doc,   div#purchase_invoice_voc_doc, div#manufacturer_brochures_cut_sheets_doc, div#green_pro_certificate_doc").hide();
//                 $("div#payment_receipts_doc,  div#manufacturer_adhesives_doc, div#certificate_green_pro_doc").hide();
//                 $("div#narrative_adhesives_doc,div#composite_narrative_doc, div#receipts_composite_wood_doc, div#safety_data_urea_doc, div#calimed_material_doc").hide();


//             }   
            
//         }

//         emittingMaterials();
//          $(document).on("change", 
//             "input[name='paints_coatings'], input[name='adhesives'], input[name='composite_wood'],input[name='flooring_sys']", 
//             emittingMaterials
//         );
//     });
// }

if (subtab == 'low_emitting_materials') {
  $(function () {

    // helper: match possible doc ID naming patterns
    const docSel = name => `#${name}_doc, #div_${name}_doc`;

    // hide a doc and optionally clear file inputs inside it
    function hideDocByName(name, clearFiles = true) {
      if (!name) return;
      const $doc = $(docSel(name));
      if (!$doc.length) return;
      $doc.hide();
      if (clearFiles) {
        $doc.find('input[type="file"]').each(function () {
          try { $(this).val(''); } catch (e) {}
          // replace with clone to ensure value cleared in all browsers
          const $clone = $(this).clone(true);
          $(this).replaceWith($clone);
        });
        // hide any file preview elements that follow a naming convention (optional)
        $(`.file-preview-${name}`).hide();
      }
    }

    // show a doc by checkbox name
    function showDocByName(name) {
      if (!name) return;
      const $doc = $(docSel(name));
      if ($doc.length) $doc.show();
    }

    function emittingMaterials() {
      // parent flags
      const mechanicalvenair = $("input[name='paints_coatings']").is(":checked");
      const naturalVenair    = $("input[name='adhesives']").is(":checked");
      const noiseceriteriaair= $("input[name='composite_wood']").is(":checked");
      const floorsys         = $("input[name='flooring_sys']").is(":checked");

      $("#div_narrative_adhesives, #div_list_of_low_voc_content_materials, #div_composite_narrative,#div_receipts_composite_wood,#div_safety_data_urea,#div_calimed_material,#div_narrative_low_emitting_materials,#div_payment_receipts,#div_manufacturer_adhesives,#div_certificate_green_pro,#div_voc_content_materials,#div_purchase_invoice_voc,#div_manufacturer_brochures_cut_sheets,#div_green_pro_certificate").hide();
      $("#div_flooring_narrative,#div_cal_indicating_area,#div_floor_plan_highlighting_area,#div_purchase_invoice_payrece,#div_green_cri_claimed").hide();

      const $g1 = $("#div_narrative_low_emitting_materials, #div_list_of_low_voc_content_materials, #div_voc_content_materials, #div_purchase_invoice_voc, #div_manufacturer_brochures_cut_sheets, #div_green_pro_certificate");
      if (mechanicalvenair) {
        $g1.show();
      } else {
        $g1.find("input[type=checkbox]").prop("checked", false).each(function () {
          hideDocByName($(this).attr("name"), true);
        });
      }

      const $g2 = $("#div_narrative_adhesives, #div_payment_receipts, #div_manufacturer_adhesives, #div_certificate_green_pro");
      if (naturalVenair) {
        $g2.show();
      } else {
        $g2.find("input[type=checkbox]").prop("checked", false).each(function () {
          hideDocByName($(this).attr("name"), true);
        });
      }

      const $g3 = $("#div_composite_narrative, #div_receipts_composite_wood, #div_safety_data_urea, #div_calimed_material");
      if (noiseceriteriaair) {
        $g3.show();
      } else {
        $g3.find("input[type=checkbox]").prop("checked", false).each(function () {
          hideDocByName($(this).attr("name"), true);
        });
      }

      const $g4 = $("#div_flooring_narrative,#div_cal_indicating_area,#div_floor_plan_highlighting_area,#div_purchase_invoice_payrece,#div_green_cri_claimed");
      if (floorsys) {
        $g4.show();
      } else {
        $g4.find("input[type=checkbox]").prop("checked", false).each(function () {
          hideDocByName($(this).attr("name"), true);
        });
      }

      $("input[type=checkbox]").each(function () {
        const name = $(this).attr("name");
        if (!name) return;
        if ($(this).is(":checked")) {
          showDocByName(name);
        } else {
          hideDocByName(name, false);
        }
      });
    }

    // run on load
    emittingMaterials();

    // run when parent or any checkbox changes
    $(document).on("change",
      "input[name='paints_coatings'], input[name='adhesives'], input[name='composite_wood'], input[name='flooring_sys'], input[type='checkbox']",
      emittingMaterials
    );

    // also make immediate toggle of child doc snappy (optional redundancy)
    $(document).on("change", "input[type='checkbox']", function () {
      const name = $(this).attr("name");
      if (!name) return;
      if ($(this).is(":checked")) showDocByName(name);
      else hideDocByName(name, false);
    });

  });
}




if (subtab == 'interior_flush_out') {

    function interiorFlushOut(clearHidden = false) {
        let val = $("input[name='ventilation_flush_out']:checked").val();

           if ($("#interior_flush_out_yn").val() == "Yes") {
              $("#div_ventilation_flush_out").show();
                 if (val == "1") {
                // Show fields for option 1
                $("#div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out").show();
                $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, div#narrative_ventilation_flush_out_doc, div#forced_ventilation_doc, div#during_flush_out_period_doc").hide();

                if (clearHidden) {
                    $("#div_forced_ventilation, #div_narrative_ventilation_flush_out, #div_during_flush_out_period")
                        .find("input, select, textarea").val('');
                    $("#div_forced_ventilation, #div_narrative_ventilation_flush_out, #div_during_flush_out_period")
                        .find("input[type='checkbox'], input[type='radio']").prop("checked", false);
                }

            } 
               else if (val == "2") {
                $("#div_narrative_ventilation_flush_out, #div_forced_ventilation, #div_during_flush_out_period").show();
                $("#div_declaration_letter_interior_flush_out, #div_narrative_interior_flush_out, div#narrative_interior_flush_out_doc, #div_photographs_geo_tagged_flush_out, div#declaration_letter_interior_flush_out_doc, div#photographs_geo_tagged_flush_out_doc").hide();

                if (clearHidden) {
                    $("#div_declaration_letter_interior_flush_out, #div_narrative_interior_flush_out, #div_photographs_geo_tagged_flush_out")
                        .find("input, select, textarea").val('');
                    $("#div_declaration_letter_interior_flush_out,#div_narrative_interior_flush_out, #div_photographs_geo_tagged_flush_out")
                        .find("input[type='checkbox'], input[type='radio']").prop("checked", false);
                }

                $("#div_forced_ventilation input[type='checkbox'], #div_during_flush_out_period input[type='checkbox']").each(function () {
                    if ($(this).data("saved") == "1") {
                        $(this).prop("checked", true);
                    }
                });

            } else {
                $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, #div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out").hide();

                if (clearHidden) {
                    $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, #div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out")
                        .find("input, select, textarea").val('');
                    $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, #div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out")
                        .find("input[type='checkbox'], input[type='radio']").prop("checked", false);
                }
            }
        
         }
             else {
              
                $("#div_ventilation_flush_out").hide();
                $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, #div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out").hide();
              $("div#forced_ventilation_doc, div#during_flush_out_period_doc, div#narrative_ventilation_flush_out_doc, div#narrative_interior_flush_out_doc, div#declaration_letter_interior_flush_out_doc, div#photographs_geo_tagged_flush_out_doc").hide();

            }

    // On change of dropdown value
    $('#interior_flush_out_yn').change(function() {
        if ($(this).val() == "Yes") {
          $("#div_ventilation_flush_out").show();
           if (val == "1") {
                $("#div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out").show();
                $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, div#narrative_ventilation_flush_out_doc, div#forced_ventilation_doc, div#during_flush_out_period_doc").hide();

                if (clearHidden) {
                    $("#div_forced_ventilation, #div_narrative_ventilation_flush_out, #div_during_flush_out_period")
                        .find("input, select, textarea").val('');
                    $("#div_forced_ventilation, #div_narrative_ventilation_flush_out, #div_during_flush_out_period")
                        .find("input[type='checkbox'], input[type='radio']").prop("checked", false);
                }

            } 
            else if (val == "2") {
                $("#div_narrative_ventilation_flush_out, #div_forced_ventilation, #div_during_flush_out_period").show();
                $("#div_declaration_letter_interior_flush_out, #div_narrative_interior_flush_out, div#narrative_interior_flush_out_doc, #div_photographs_geo_tagged_flush_out, div#declaration_letter_interior_flush_out_doc, div#photographs_geo_tagged_flush_out_doc").hide();

                if (clearHidden) {
                    $("#div_declaration_letter_interior_flush_out, #div_narrative_interior_flush_out, #div_photographs_geo_tagged_flush_out")
                        .find("input, select, textarea").val('');
                    $("#div_declaration_letter_interior_flush_out,#div_narrative_interior_flush_out, #div_photographs_geo_tagged_flush_out")
                        .find("input[type='checkbox'], input[type='radio']").prop("checked", false);
                }
                $("#div_forced_ventilation input[type='checkbox'], #div_during_flush_out_period input[type='checkbox']").each(function () {
                    if ($(this).data("saved") == "1") {
                        $(this).prop("checked", true);
                    }
                });

            } else {
                $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, #div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out").hide();
                if (clearHidden) {
                    $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, #div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out")
                        .find("input, select, textarea").val('');
                    $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, #div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out")
                        .find("input[type='checkbox'], input[type='radio']").prop("checked", false);
                }
            } 
        } 
       else {
                $("#div_ventilation_flush_out").hide();
                  $("#div_forced_ventilation, #div_during_flush_out_period, #div_narrative_ventilation_flush_out, #div_narrative_interior_flush_out, #div_declaration_letter_interior_flush_out, #div_photographs_geo_tagged_flush_out").hide();
                $("div#forced_ventilation_doc, div#during_flush_out_period_doc, div#narrative_ventilation_flush_out_doc, div#narrative_interior_flush_out_doc, div#declaration_letter_interior_flush_out_doc, div#photographs_geo_tagged_flush_out_doc").hide();

                }
    });
    }

    // Initialize without clearing
    interiorFlushOut(false);

    // On change, clear hidden fields
    $("input[name='ventilation_flush_out']").change(function () {
        interiorFlushOut(true);
    });
}





if (subtab == 'dedicated_dining_spaces') {

    // On page load check the current value
    if ($("#compliances_environment_quality").val() == "Yes") {
        $("#div_narrative_dedicated_dining_spaces").show();
        $("#div_layout_location_dedicated_dining_space").show();
        $("#div_multiple_geo_tagged_photographs_dedicated_dining_space").show();
        
    } else {
        $("#div_narrative_dedicated_dining_spaces").hide();
        $("div#narrative_dedicated_dining_spaces_doc").hide();
        $("#div_layout_location_dedicated_dining_space").hide();
        $("div#layout_location_dedicated_dining_space_doc").hide();
        $("#div_multiple_geo_tagged_photographs_dedicated_dining_space").hide();
        $("div#multiple_geo_tagged_photographs_dedicated_dining_space_doc").hide();

    }

    // On change of dropdown value
    $('#compliances_environment_quality').change(function() {
        if ($(this).val() == "Yes") {
            $("#div_narrative_dedicated_dining_spaces").show();
            $("#div_layout_location_dedicated_dining_space").show();
            $("#div_multiple_geo_tagged_photographs_dedicated_dining_space").show();
            
        } else {
            $("#div_narrative_dedicated_dining_spaces").hide();
            $("div#narrative_dedicated_dining_spaces_doc").hide();
            $("#div_layout_location_dedicated_dining_space").hide();
            $("div#layout_location_dedicated_dining_space_doc").hide();
            $("#div_multiple_geo_tagged_photographs_dedicated_dining_space").hide();
            $("div#multiple_geo_tagged_photographs_dedicated_dining_space_doc").hide();
        }
    });
}


// if (subtab == 'co2_monitoring') {
//     $(function () {
//         function co2monitoring() {
//             const mechanicalven = $("input[name='mechianical_ventilation']").is(":checked");
//             const naturalVen = $("input[name='natural_ventilation']").is(":checked");

//              $("#div_percentage_regularly_area, #div_indicating_quantity_sensors, #div_plan_floor_indicating, #div_geotagged_mutiple_photovideos, #div_project_oneyear, #div_six_months_data,#div_percentage_regularly_occupied, #div_narrative_monitoring, #div_invoice_iaq_sensors_installed, #div_technical_specification_sheet, #div_multiple_geotagged_photo, #div_existing_interiors_project_latest,#div_interiors_project_latest_oneyear").hide();
//             $("div#percentage_regularly_area_doc, div#plan_floor_indicating_doc, div#geotagged_mutiple_photovideos_doc, div#project_oneyear_doc, div#six_months_data_doc").hide();
//             if (mechanicalven) {
//                 $("#div_percentage_regularly_occupied,#div_indicating_quantity_sensors,  #div_narrative_monitoring, #div_invoice_iaq_sensors_installed, #div_technical_specification_sheet, #div_multiple_geotagged_photo, #div_existing_interiors_project_latest,#div_interiors_project_latest_oneyear").show();

//             }

//             if (naturalVen) {
//                 $("#div_percentage_regularly_area, #div_plan_floor_indicating, #div_geotagged_mutiple_photovideos, #div_project_oneyear, #div_six_months_data").show();
//                 $("div#percentage_regularly_occupied_doc, div#indicating_quantity_sensors_doc, div#narrative_monitoring_doc, div#invoice_iaq_sensors_installed_doc, div#technical_specification_sheet_doc, div#multiple_geotagged_photo_doc, div#existing_interiors_project_latest_doc, div#interiors_project_latest_oneyear_doc").hide();

//             }
//         }

//         co2monitoring();
//         $(document).on("change", "input[name='mechianical_ventilation'], input[name='natural_ventilation']", co2monitoring);
//     });
// }


if (subtab == 'co2_monitoring') {
    $(function () {
        function co2monitoring() {
            const mechanicalven = $("input[name='mechianical_ventilation']").is(":checked");
            const naturalVen = $("input[name='natural_ventilation']").is(":checked");

            $("#div_percentage_regularly_area, #div_indicating_quantity_sensors, #div_plan_floor_indicating, #div_geotagged_mutiple_photovideos, #div_project_oneyear, #div_six_months_data, #div_percentage_regularly_occupied, #div_narrative_monitoring, #div_invoice_iaq_sensors_installed, #div_technical_specification_sheet, #div_multiple_geotagged_photo, #div_existing_interiors_project_latest, #div_interiors_project_latest_oneyear").hide();

            // $("div#percentage_regularly_area_doc, div#plan_floor_indicating_doc, div#geotagged_mutiple_photovideos_doc, div#project_oneyear_doc, div#six_months_data_doc, div#percentage_regularly_occupied_doc, div#indicating_quantity_sensors_doc, div#narrative_monitoring_doc, div#invoice_iaq_sensors_installed_doc, div#technical_specification_sheet_doc, div#multiple_geotagged_photo_doc, div#existing_interiors_project_latest_doc, div#interiors_project_latest_oneyear_doc").hide();

            if (mechanicalven) {
                $("#div_percentage_regularly_occupied, #div_indicating_quantity_sensors, #div_narrative_monitoring, #div_invoice_iaq_sensors_installed, #div_technical_specification_sheet, #div_multiple_geotagged_photo, #div_existing_interiors_project_latest, #div_interiors_project_latest_oneyear").show();
            }

            if (naturalVen) {
                $("#div_percentage_regularly_area, #div_plan_floor_indicating, #div_geotagged_mutiple_photovideos, #div_project_oneyear, #div_six_months_data").show();
            }
        }

        co2monitoring();
        $(document).on("change", "input[name='mechianical_ventilation'], input[name='natural_ventilation']", co2monitoring);
    });
}
