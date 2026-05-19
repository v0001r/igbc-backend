// if (subtab == "minimum_energy_performance") {
//   toggleApproach($("#select_approach").val(), false);

//   $("#select_approach").change(function () {
//     toggleApproach($(this).val(), true);
//   });
// }

// function toggleApproach(value, clearHidden = true) {
//   if (value === "Prescriptive Approach") {
//     $(
//       "#div_simulation_method_input, #div_simulation_method_output, #div_detailed_energy_simulation_report, #div_narrative_min_energy, #div_comparison_baseline_building_parameters, #div_glazing_details_proposed, #div_construction_details_proposed_wall_roof, #div_drawings_wall_roof_assembly, #div_proposed_lighting_system_details, #div_proposed_lpd_calculations_interior_exterior, #div_lighting_layout_interior_common_areas, #div_exterior_lighting_layout, #div_proposed_air_conditioning_system, #div_brochures_cut_sheets_letters, #div_wall_roof_construction, #div_invoices_releavent_materials"
//     ).show();

//     $(
//       "#div_retv_calculation_template, #div_narrative_min_energy_cert, #div_baseline_building_parameters_ecbc, #div_porposed_glazing_details_ecbc, #div_drawings_wall_roof_assembly_ecbc, #div_proposed_lighting_system_details_ecbc, #div_lpd_calculations_interior_exterior_ecbc, #div_conceptual_interior_common_ecbc, #div_layout_lighting_exterior_ecbc, #div_air_proposed_conditioning_ecbc, #div_manufacturer_brochures_ecbc, #div_wall_roof_photographs_construction_ecbc, #div_all_releavent_materials_ecbc, div#retv_calculation_template_doc, div#narrative_min_energy_cert_doc, div#baseline_building_parameters_ecbc_doc, div#porposed_glazing_details_ecbc_doc, div#drawings_wall_roof_assembly_ecbc_doc, div#proposed_lighting_system_details_ecbc_doc, div#lpd_calculations_interior_exterior_ecbc_doc, div#conceptual_interior_common_ecbc_doc, div#layout_lighting_exterior_ecbc_doc, div#air_proposed_conditioning_ecbc_doc, div#manufacturer_brochures_ecbc_doc, div#wall_roof_photographs_construction_ecbc_doc, div#all_releavent_materials_ecbc_doc"
//     ).hide();

//     if (clearHidden) {
//       $(
//         "#div_retv_calculation_template, #div_narrative_min_energy_cert, #div_baseline_building_parameters_ecbc, #div_porposed_glazing_details_ecbc, #div_drawings_wall_roof_assembly_ecbc, #div_proposed_lighting_system_details_ecbc, #div_lpd_calculations_interior_exterior_ecbc, #div_conceptual_interior_common_ecbc, #div_layout_lighting_exterior_ecbc, #div_air_proposed_conditioning_ecbc, #div_manufacturer_brochures_ecbc, #div_wall_roof_photographs_construction_ecbc, #div_all_releavent_materials_ecbc, div#retv_calculation_template_doc, div#narrative_min_energy_cert_doc, div#baseline_building_parameters_ecbc_doc, div#porposed_glazing_details_ecbc_doc, div#drawings_wall_roof_assembly_ecbc_doc, div#proposed_lighting_system_details_ecbc_doc, div#lpd_calculations_interior_exterior_ecbc_doc, div#conceptual_interior_common_ecbc_doc, div#layout_lighting_exterior_ecbc_doc, div#air_proposed_conditioning_ecbc_doc, div#manufacturer_brochures_ecbc_doc, div#wall_roof_photographs_construction_ecbc_doc, div#all_releavent_materials_ecbc_doc"
//       )
//         .find(
//           "input[type=checkbox], input[type=radio], input[type=text], textarea"
//         )
//         .prop("checked", false)
//         .val("");
//     }
//   } else if (value === "Performance Approach (Simulation Approach)") {
//     $(
//       "#div_retv_calculation_template, #div_narrative_min_energy_cert, #div_baseline_building_parameters_ecbc, #div_porposed_glazing_details_ecbc, #div_drawings_wall_roof_assembly_ecbc, #div_proposed_lighting_system_details_ecbc, #div_lpd_calculations_interior_exterior_ecbc, #div_conceptual_interior_common_ecbc, #div_layout_lighting_exterior_ecbc, #div_air_proposed_conditioning_ecbc, #div_manufacturer_brochures_ecbc, #div_wall_roof_photographs_construction_ecbc, #div_all_releavent_materials_ecbc"
//     ).show();

//     $(
//       "#div_simulation_method_input, #div_simulation_method_output, #div_detailed_energy_simulation_report, #div_narrative_min_energy, #div_comparison_baseline_building_parameters, #div_glazing_details_proposed, #div_construction_details_proposed_wall_roof, #div_drawings_wall_roof_assembly, #div_proposed_lighting_system_details, #div_proposed_lpd_calculations_interior_exterior, #div_lighting_layout_interior_common_areas, #div_exterior_lighting_layout, #div_proposed_air_conditioning_system, #div_brochures_cut_sheets_letters, #div_wall_roof_construction, #div_invoices_releavent_materials, div#simulation_method_input_doc, div#simulation_method_output_doc, div#detailed_energy_simulation_report_doc, div#narrative_min_energy_doc, div#comparison_baseline_building_parameters_doc, div#glazing_details_proposed_doc, div#construction_details_proposed_wall_roof_doc, div#drawings_wall_roof_assembly_doc, div#proposed_lighting_system_details_doc, div#proposed_lpd_calculations_interior_exterior_doc, div#lighting_layout_interior_common_areas_doc, div#exterior_lighting_layout_doc, div#proposed_air_conditioning_system_doc, div#brochures_cut_sheets_letters_doc, div#wall_roof_construction_doc, div#invoices_releavent_materials_doc"
//     ).hide();

//     if (clearHidden) {
//       $(
//         "#div_simulation_method_input, #div_simulation_method_output, #div_detailed_energy_simulation_report, #div_narrative_min_energy, #div_comparison_baseline_building_parameters, #div_glazing_details_proposed, #div_construction_details_proposed_wall_roof, #div_drawings_wall_roof_assembly, #div_proposed_lighting_system_details, #div_proposed_lpd_calculations_interior_exterior, #div_lighting_layout_interior_common_areas, #div_exterior_lighting_layout, #div_proposed_air_conditioning_system, #div_brochures_cut_sheets_letters, #div_wall_roof_construction, #div_invoices_releavent_materials, div#simulation_method_input_doc, div#simulation_method_output_doc, div#detailed_energy_simulation_report_doc, div#narrative_min_energy_doc, div#comparison_baseline_building_parameters_doc, div#glazing_details_proposed_doc, div#construction_details_proposed_wall_roof_doc, div#drawings_wall_roof_assembly_doc, div#proposed_lighting_system_details_doc, div#proposed_lpd_calculations_interior_exterior_doc, div#lighting_layout_interior_common_areas_doc, div#exterior_lighting_layout_doc, div#proposed_air_conditioning_system_doc, div#brochures_cut_sheets_letters_doc, div#wall_roof_construction_doc, div#invoices_releavent_materials_doc"
//       )
//         .find(
//           "input[type=checkbox], input[type=radio], input[type=text], textarea"
//         )
//         .prop("checked", false)
//         .val("");
//     }
//   } else {
//     $(
//       "#div_simulation_method_input, #div_simulation_method_output, #div_detailed_energy_simulation_report, #div_narrative_min_energy, #div_comparison_baseline_building_parameters, #div_glazing_details_proposed, #div_construction_details_proposed_wall_roof, #div_drawings_wall_roof_assembly, #div_proposed_lighting_system_details, #div_proposed_lpd_calculations_interior_exterior, #div_lighting_layout_interior_common_areas, #div_exterior_lighting_layout, #div_proposed_air_conditioning_system, #div_brochures_cut_sheets_letters, #div_wall_roof_construction, #div_invoices_releavent_materials, #div_retv_calculation_template, #div_narrative_min_energy_cert, #div_baseline_building_parameters_ecbc, #div_porposed_glazing_details_ecbc, #div_drawings_wall_roof_assembly_ecbc, #div_proposed_lighting_system_details_ecbc, #div_lpd_calculations_interior_exterior_ecbc, #div_conceptual_interior_common_ecbc, #div_layout_lighting_exterior_ecbc, #div_air_proposed_conditioning_ecbc, #div_manufacturer_brochures_ecbc, #div_wall_roof_photographs_construction_ecbc, #div_all_releavent_materials_ecbc"
//     ).hide();
//   }
// }


if (subtab == "minimum_energy_performance") {
  // Ensure the script runs after the DOM is fully loaded, especially the select element
  $(document).ready(function () {
    // Initial Call FIX: Pass 'false' to clearHidden so that saved data 
    // is displayed and NOT cleared by the first run of toggleApproach.
    toggleApproach($("#select_approach").val(), false);

    $("#select_approach").change(function () {
      // Change Call: Pass 'true' to clearHidden so that data is cleared
      // from the approach that is NOW hidden.
      toggleApproach($(this).val(), true);
    });
  });
}

function toggleApproach(value, clearHidden = true) {
  // Define selectors for better readability and cleaner clearing logic
  const prescriptiveFields = "#div_simulation_method_input, #div_simulation_method_output, #div_simulation_method_overall, #div_simulation_method_output_doc, #div_detailed_energy_simulation_report, #div_narrative_min_energy, #div_comparison_baseline_building_parameters, #div_glazing_details_proposed, #div_construction_details_proposed_wall_roof, #div_drawings_wall_roof_assembly, #div_proposed_lighting_system_details, #div_proposed_lpd_calculations_interior_exterior, #div_lighting_layout_interior_common_areas, #div_exterior_lighting_layout, #div_proposed_air_conditioning_system, #div_brochures_cut_sheets_letters, #div_wall_roof_construction, #div_invoices_releavent_materials";
  const prescriptiveDocs = "div#simulation_method_input_doc, div#simulation_method_output_doc, div#detailed_energy_simulation_report_doc, div#narrative_min_energy_doc, div#comparison_baseline_building_parameters_doc, div#glazing_details_proposed_doc, div#construction_details_proposed_wall_roof_doc, div#drawings_wall_roof_assembly_doc, div#proposed_lighting_system_details_doc, div#proposed_lpd_calculations_interior_exterior_doc, div#lighting_layout_interior_common_areas_doc, div#exterior_lighting_layout_doc, div#proposed_air_conditioning_system_doc, div#brochures_cut_sheets_letters_doc, div#wall_roof_construction_doc, div#invoices_releavent_materials_doc";

  const performanceFields = "#div_retv_calculation_template, #div_retv_excel_sheet, #div_narrative_min_energy_cert, #div_baseline_building_parameters_ecbc, #div_porposed_glazing_details_ecbc, #div_drawings_wall_roof_assembly_ecbc, #div_proposed_lighting_system_details_ecbc, #div_lpd_calculations_interior_exterior_ecbc, #div_conceptual_interior_common_ecbc, #div_layout_lighting_exterior_ecbc, #div_air_proposed_conditioning_ecbc, #div_manufacturer_brochures_ecbc, #div_wall_roof_photographs_construction_ecbc, #div_all_releavent_materials_ecbc";
  const performanceDocs = "div#retv_calculation_template_doc, div#narrative_min_energy_cert_doc, div#retv_excel_sheet_doc, div#baseline_building_parameters_ecbc_doc, div#porposed_glazing_details_ecbc_doc, div#drawings_wall_roof_assembly_ecbc_doc, div#proposed_lighting_system_details_ecbc_doc, div#lpd_calculations_interior_exterior_ecbc_doc, div#conceptual_interior_common_ecbc_doc, div#layout_lighting_exterior_ecbc_doc, div#air_proposed_conditioning_ecbc_doc, div#manufacturer_brochures_ecbc_doc, div#wall_roof_photographs_construction_ecbc_doc, div#all_releavent_materials_ecbc_doc";


  if (value === "Performance Approach (Simulation Approach)") {
    // 1. Show Prescriptive fields
    $(prescriptiveFields).show();
    // 2. Hide Performance fields and docs
    $(performanceFields + ", " + performanceDocs).hide();

    // 3. Clear data from the HIDDEN option ONLY if 'clearHidden' is true
    if (clearHidden) {
      $(performanceFields)
        .find(
          "input[type=checkbox], input[type=radio], input[type=text], textarea"
        )
        .not("input[type=file]") // Preserve file inputs
        .prop("checked", false)
        .val("");
    }
  } else if (value === "Prescriptive Approach") {
    // 1. Show Performance fields
    $(performanceFields).show();
    // 2. Hide Prescriptive fields and docs
    $(prescriptiveFields + ", " + prescriptiveDocs).hide();

    // 3. Clear data from the HIDDEN option ONLY if 'clearHidden' is true
    if (clearHidden) {
      $(prescriptiveFields)
        .find(
          "input[type=checkbox], input[type=radio], input[type=text], textarea"
        )
        .not("input[type=file]") // Preserve file inputs
        .prop("checked", false)
        .val("");
    }
  } else {
    // If no option is selected, hide all
    $(prescriptiveFields + ", " + performanceFields).hide();
    $(prescriptiveDocs + ", " + performanceDocs).hide();

    // Clear all fields if switching away from a value
    if (clearHidden) {
        $(prescriptiveFields + ", " + performanceFields)
        .find(
          "input[type=checkbox], input[type=radio], input[type=text], textarea"
        )
        .not("input[type=file]")
        .prop("checked", false)
        .val("");
    }
  }
}

if (subtab == "integrated_energy_monitoring") {
  function toggleCommercialLease(clearHidden = false) {
    let val = $("input[name='energy_metering_monitoring']:checked").val();

    if (val == "1") {
      $("#div_area_lighting").show();
      $("#div_area_lighting_ex").show();
      $("#div_manag_sys").hide();
      $("#div_manag_sys_light").hide();
      if (clearHidden) {
        $("#div_manag_sys, #div_manag_sys_light")
          .find(
            "input:not([type=radio]):not([type=checkbox]), select, textarea"
          )
          .val("");
        $("#div_manag_sys, #div_manag_sys_light")
          .find("input[type=radio], input[type=checkbox]")
          .prop("checked", false); // only clear radios/checkbox when toggled, not on load
      }
    } else if (val == "2") {
      $("#div_manag_sys").show();
      $("#div_manag_sys_light").show();
      $("#div_area_lighting").hide();
      $("#div_area_lighting_ex").hide();

      if (clearHidden) {
        $("#div_area_lighting, #div_area_lighting_ex")
          .find(
            "input:not([type=radio]):not([type=checkbox]), select, textarea"
          )
          .val("");
        $("#div_area_lighting, #div_area_lighting_ex")
          .find("input[type=radio], input[type=checkbox]")
          .prop("checked", false);
      }
    } else {
      $(
        "#div_area_lighting, #div_area_lighting_ex, #div_manag_sys, #div_manag_sys_light"
      ).hide();
    }
  }
  toggleCommercialLease(false);

  $("input[name='energy_metering_monitoring']").change(function () {
    toggleCommercialLease(true);
  });
}



// if (subtab == "minimum_daylighting_enhanced") {
//   // Wait for the DOM to be fully loaded before running any script.
//   $(document).ready(function () {
    
//     // --- STEP 1: A function that ONLY handles showing and hiding sections ---
//     // This is safe to run on page load because it never deletes or resets data.
//     function updateVisibility() {
//       // Prescriptive Approach
//       if ($("input[name='prescriptive_approach']").is(":checked")) {
//         $("#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced").show();
//       } else {
//         $("#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced").hide();
//         $("div#annex_rwh_doc, div#min_percen_comp_doc, div#narrative_echanced_doc, div#master_Plan_buildings_doc, div#angle_obstruction_buildings_doc, div#floor_plan_window_enhanced_doc, div#techinal_cutsheet_enhnaced_doc, div#glass_purchase_invoice_doc, div#photographs_enhanced_doc").hide();
//       }

//       // Simulation Approach
//       if ($("input[name='simulation_approach']").is(":checked")) {
//         $("#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced").show();
//       } else {
//         $("#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced").hide();
//         $("div#annex_rwh_summary_doc, div#min_percen_comp_area_doc, div#narrative_daylit_doc, div#site_master_plan_enhanced_doc, div#simul_input_output_doc, div#techinal_cutsheet_enhnaced_day_doc, div#glass_purchase_invoice_enhanced_doc, div#photographs_geotagged_enhanced_doc").hide();
//       }
//     }

//     // --- STEP 2: Call the safe visibility function ONCE on page load ---
//     // This is the CRITICAL fix: it correctly sets the initial view based 
//     // on the saved 'checked' attribute in the HTML without clearing any data.
//     updateVisibility();

//     // --- STEP 3: Create a single handler for user actions ---
//     // The logic to reset fields only runs when a user MANUALLY unchecks a box.
//     $(
//       "input[name='prescriptive_approach'], input[name='simulation_approach']"
//     ).change(function () {
//       // Check if the box that triggered this change is now UNCHECKED.
//       if (!$(this).is(":checked")) {
//         let contentDivs;
//         if ($(this).attr("name") === 'prescriptive_approach') {
//           contentDivs = "#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced";
//         } else if ($(this).attr("name") === 'simulation_approach') {
//           contentDivs = "#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced";
//         }

//         // Clear the content fields within the section
//         if (contentDivs) {
//           $(contentDivs)
//             .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//             .not("input[type=file]")
//             .prop("checked", false)
//             .val("");
//         }
//       }

//       // After handling any necessary data clearing, update the view for all sections.
//       updateVisibility();
//     });
//   }); // End of $(document).ready()
// }


// if (subtab == "minimum_daylighting_enhanced") {
//   $(document).ready(function () {
//     function updateVisibility() {
//       if ($("input[name='prescriptive_approach']").is(":checked")) {
//         $("#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced").show()
//           .find("input[type=text], textarea, select, input[type=checkbox], input[type=radio]").attr('required', true);
//       } else {
//         $("#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced").hide()
//           .find("input[type=text], textarea, select, input[type=checkbox], input[type=radio]").removeAttr('required');
//         $("div#annex_rwh_doc, div#min_percen_comp_doc, div#narrative_echanced_doc, div#master_Plan_buildings_doc, div#angle_obstruction_buildings_doc, div#floor_plan_window_enhanced_doc, div#techinal_cutsheet_enhnaced_doc, div#glass_purchase_invoice_doc, div#photographs_enhanced_doc").hide();
//       }

//       if ($("input[name='simulation_approach']").is(":checked")) {
//         $("#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced").show()
//           .find("input[type=text], textarea, select, input[type=checkbox], input[type=radio]").attr('required', true);
//       } else {
//         $("#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced").hide()
//           .find("input[type=text], textarea, select, input[type=checkbox], input[type=radio]").removeAttr('required');
//         $("div#annex_rwh_summary_doc, div#min_percen_comp_area_doc, div#narrative_daylit_doc, div#site_master_plan_enhanced_doc, div#simul_input_output_doc, div#techinal_cutsheet_enhnaced_day_doc, div#glass_purchase_invoice_enhanced_doc, div#photographs_geotagged_enhanced_doc").hide();
//       }
//     }

//     function validateApproachCheckboxes() {
//       var errorDiv = $("#daylighting_error_div");
//       if (
//         !$("input[name='prescriptive_approach']").is(":checked") &&
//         !$("input[name='simulation_approach']").is(":checked")
//       ) {
//         if (errorDiv.length === 0) {
//           $("<div id='daylighting_error_div' style='color:red;margin:10px 0;'>Please check at least one.</div>").insertBefore("#div_annex_rwh");
//         }
//         return false;
//       } else {
//         errorDiv.remove();
//         return true;
//       }
//     }

//     updateVisibility();
//     validateApproachCheckboxes();

//     $("input[name='prescriptive_approach'], input[name='simulation_approach']").change(function () {
//       if (!$(this).is(":checked")) {
//         let contentDivs;
//         if ($(this).attr("name") === 'prescriptive_approach') {
//           contentDivs = "#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced";
//         } else if ($(this).attr("name") === 'simulation_approach') {
//           contentDivs = "#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced";
//         }
//         if (contentDivs) {
//           $(contentDivs)
//             .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//             .not("input[type=file]")
//             .prop("checked", false)
//             .val("")
//             .removeAttr('required'); // Remove required on deselect
//         }
//       }
//       updateVisibility();
//       validateApproachCheckboxes();
//     });

//     // Optional: form submit validation
//     $("#rating_form").submit(function (e) {
//       if (!validateApproachCheckboxes()) {
//         e.preventDefault();
//       }
//     });
//   });
// }

if (subtab == "minimum_daylighting_enhanced") {
  $(document).ready(function () {

    function updateVisibility() {

      // ---- PRESCRIPTIVE ----
      if ($("input[name='prescriptive_approach']").is(":checked")) {
        $("#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced").show();
      } else {
        $("#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced").hide();

        $("div#annex_rwh_doc, div#min_percen_comp_doc, div#narrative_echanced_doc, div#master_Plan_buildings_doc, div#angle_obstruction_buildings_doc, div#floor_plan_window_enhanced_doc, div#techinal_cutsheet_enhnaced_doc, div#glass_purchase_invoice_doc, div#photographs_enhanced_doc").hide();
      }

      // ---- SIMULATION ----
      if ($("input[name='simulation_approach']").is(":checked")) {
        $("#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced").show();
      } else {
        $("#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced").hide();

        $("div#annex_rwh_summary_doc, div#min_percen_comp_area_doc, div#narrative_daylit_doc, div#site_master_plan_enhanced_doc, div#simul_input_output_doc, div#techinal_cutsheet_enhnaced_day_doc, div#glass_purchase_invoice_enhanced_doc, div#photographs_geotagged_enhanced_doc").hide();
      }
    }

    updateVisibility();

    $("input[name='prescriptive_approach'], input[name='simulation_approach']").change(function () {

      if (!$(this).is(":checked")) {

        let contentDivs;

        if ($(this).attr("name") === 'prescriptive_approach') {
          contentDivs = "#div_annex_rwh, #div_min_percen_comp, #div_narrative_echanced, #div_master_Plan_buildings, #div_angle_obstruction_buildings, #div_floor_plan_window_enhanced, #div_techinal_cutsheet_enhnaced, #div_glass_purchase_invoice, #div_photographs_enhanced";
        } else if ($(this).attr("name") === 'simulation_approach') {
          contentDivs = "#div_annex_rwh_summary, #div_min_percen_comp_area, #div_narrative_daylit, #div_site_master_plan_enhanced,#div_simul_input_output, #div_techinal_cutsheet_enhnaced_day, #div_glass_purchase_invoice_enhanced, #div_photographs_geotagged_enhanced";
        }

        if (contentDivs) {
          $(contentDivs)
            .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
            .not("input[type=file]")
            .prop("checked", false)
            .val("");
        }
      }

      updateVisibility();
    });

  });
}


// if (subtab == "ventilation_design_enhanced") {

//   // 1. ADD 'clearHidden' parameter, set to false by default (for initial page load)
//   function toggleSustainabilitydesign(clearHidden = false) { 
    
//     // Define selectors for cleaner code
//     const openableAreaFields = "#div_no_of_floors,#div_annex_rwh_floors,#div_comp_requ,#div_narrative_design_enhanced,#div_door_window_schedule_design,#div_photographs_ventilation_design";
//     const openableAreaDocs = "div#no_of_floors_doc,div#annex_rwh_floors_doc,div#comp_requ_doc,div#narrative_design_enhanced_doc,div#door_window_schedule_design_doc,div#photographs_ventilation_design_doc";
    
//     const cfdAnalysisFields = "#div_detailed_cfd_analysis_report,#div_narrative_two,#div_floor_plans_door_design,#div_photographs_ventilation_design_two,#div_annex_two_one,#div_annex_two_high";
//     const cfdAnalysisDocs = "div#detailed_cfd_analysis_report_doc,div#narrative_two_doc,div#floor_plans_door_design_doc,div#photographs_ventilation_design_two_doc,div#annex_two_one_doc,div#annex_two_high_doc";

//     const airConditionedFields = "#div_annex_two_three,#div_narrative_air_conditioned,#div_hvac_layout_design,#div_system_hvac_design,#div_annex_two_high_two,#div_photographs_hvac_design";
//     const airConditionedDocs = "div#annex_two_three_doc,div#narrative_air_conditioned_doc,div#hvac_layout_design_doc,div#system_hvac_design_doc,div#annex_two_high_two_doc,div#photographs_hvac_design_doc";

//     // Show/hide dropdown based on natural_ventilated_spaces checkbox
//     if ($("input[name='natural_ventilated_spaces']").is(":checked")) {
//       $("#div_ventilated_spaces_design").show();

//       // Get selected value of dropdown
//       var value = $("#ventilated_spaces_design").val();

//       // Logic for "Through Opeanable Area"
//       if (value === "Through Opeanable Area") {
//         $(openableAreaFields).show();
//       } else {
//         $(openableAreaFields).hide();
//         $(openableAreaDocs).hide();

//         // 2. Wrap clearing logic in an IF statement
//         if (clearHidden) {
//           $(openableAreaFields, '#div_ventilated_spaces_design')
//             .find("input[type=checkbox], input[type=radio], select, input[type=text], textarea")
//             .prop("checked", false)
//             .val("");
//         }
//       }

//       // Logic for "Through CFD Analysis"
//       if (value === "Through CFD Analysis") {
//         $(cfdAnalysisFields).show();
//       } else {
//         $(cfdAnalysisFields).hide();
//         $(cfdAnalysisDocs).hide();

//         // 3. Wrap clearing logic in an IF statement
//         if (clearHidden) {
//           $(cfdAnalysisFields)
//             .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//             .prop("checked", false)
//             .val("");
//         }
//       }
//     } 
//     // Logic when 'natural_ventilated_spaces' is UNCHECKED
//     else {
//       $("#div_ventilated_spaces_design").hide();
//       $("#ventilated_spaces_design").val("");
//       $(openableAreaDocs).hide();
//       $(cfdAnalysisDocs).hide();
      
//       const allVentilationFields = openableAreaFields + "," + cfdAnalysisFields;

//       $(allVentilationFields).hide();

//       // 4. Wrap clearing logic in an IF statement
//       if (clearHidden) {
//           // Clear all fields associated with natural ventilation and the dropdown itself
//           $(
//             "#div_ventilated_spaces_design, " + allVentilationFields
//           ).find("input[type=checkbox], input[type=radio], input[type=text], textarea").prop("checked", false).val("");
//       }
//     }

//     // Air-conditioned spaces checkbox
//     if ($("input[name='air_conditioned_spaces']").is(":checked")) {
//       $(airConditionedFields).show();
//     } else {
//       $(airConditionedFields).hide();
//       $(airConditionedDocs).hide();
      
//       // 5. Wrap clearing logic in an IF statement
//       if (clearHidden) {
//           $(airConditionedFields)
//             .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//             .prop("checked", false)
//             .val("");
//       }
//     }
//   }
  
//   // Wait for the document (and saved values) to load before running logic
//   $(document).ready(function() {
      
//       // Initial call: Pass 'false' to PREVENT clearing your saved data.
//       toggleSustainabilitydesign(false);
      
//       // Change handlers: Pass 'true' to clear hidden fields when the user changes the form
//       $(
//         "input[name='natural_ventilated_spaces'], input[name='air_conditioned_spaces']"
//       ).change(function () {
//         toggleSustainabilitydesign(true);
//       });
      
//       $("#ventilated_spaces_design").change(function () {
//         toggleSustainabilitydesign(true);
//       });

//        $("#rating_form").submit(function(event) {
//     let natVentChecked = $("input[name='natural_ventilated_spaces']").is(":checked");
//     let airCondChecked = $("input[name='air_conditioned_spaces']").is(":checked");

//     if (!natVentChecked && !airCondChecked) {
//       alert("Please check at least one main checkbox: Natural Ventilated Spaces or Air Conditioned Spaces.");
//       event.preventDefault();
//       return false;
//     }

//     if (natVentChecked) {
//       let natVentInternalChecked = $("#div_no_of_floors input[type='checkbox']:checked").length > 0 ||
//         $("#div_annex_rwh_floors input[type='checkbox']:checked").length > 0 ||
//         false;

//       if (!natVentInternalChecked) {
//         alert("Please check at least one option inside Natural Ventilated Spaces.");
//         event.preventDefault();
//         return false;
//       }
//     }

//     if (airCondChecked) {
//       let airCondInternalChecked = $("#div_annex_two_three input[type='checkbox']:checked").length > 0 ||
//         $("#div_narrative_air_conditioned input[type='checkbox']:checked").length > 0 ||
//         false;

//       if (!airCondInternalChecked) {
//         alert("Please check at least one option inside Air Conditioned Spaces.");
//         event.preventDefault();
//         return false;
//       }
//     }

//     return true; // Allow form submission if validations pass
//   });

      
//   });
// }

if (subtab == "ventilation_design_enhanced") {

    function toggleSustainabilitydesign() {

        /* -----------------------------------
           FIELD GROUPS / SELECTORS
        ----------------------------------- */

        const lessThan = "#div_lessthan";
        const lessThanSummary = "#div_lesserthansummary";
        const greater = "#div_greater";
        const greaterThanSummary = "#div_greathethansummary";

        const openableAreaFields = "#div_no_of_floors,#div_annex_rwh_floors,#div_comp_requ,#div_narrative_design_enhanced,#div_door_window_schedule_design,#div_photographs_ventilation_design";
        const openableAreaDocs = "#no_of_floors_doc,#annex_rwh_floors_doc,#comp_requ_doc,#narrative_design_enhanced_doc,#door_window_schedule_design_doc,#photographs_ventilation_design_doc";

        const cfdAnalysisFields = "#div_detailed_cfd_analysis_report,#div_narrative_two,#div_floor_plans_door_design,#div_photographs_ventilation_design_two,#div_annex_two_one,#div_annex_two_high";
        const cfdAnalysisDocs = "#detailed_cfd_analysis_report_doc,#narrative_two_doc,#floor_plans_door_design_doc,#photographs_ventilation_design_two_doc,#annex_two_one_doc,#annex_two_high_doc";

        const airConditionedFields = "#div_annex_two_three,#div_narrative_air_conditioned,#div_hvac_layout_design,#div_system_hvac_design,#div_annex_two_high_two,#div_photographs_hvac_design";
        const airConditionedDocs = "#annex_two_three_doc,#narrative_air_conditioned_doc,#hvac_layout_design_doc,#system_hvac_design_doc,#annex_two_high_two_doc,#photographs_hvac_design_doc";

        
        const nv = $("input[name='natural_ventilated_spaces']").is(":checked");
        const ac = $("input[name='air_conditioned_spaces']").is(":checked");
        const val = ($("#ventilated_spaces_design").length ? $("#ventilated_spaces_design").val() : "");
        const floorsRaw = $("input[name='no_of_floors']").val();
        const floors = parseInt(floorsRaw);

        // helper to hide all annexures
        function hideAllAnnexures() {
            $(lessThan + "," + lessThanSummary + "," + greater + "," + greaterThanSummary).hide();
        }

        // helper to hide all NV + CFD + docs + annexures
        function hideAllNVAndAnnex() {
            $("#div_ventilated_spaces_design").hide();
            $("#ventilated_spaces_design").val("");
            $(openableAreaFields + "," + openableAreaDocs + "," + cfdAnalysisFields + "," + cfdAnalysisDocs).hide();
            hideAllAnnexures();
        }

      
        if (!nv && !ac && (val === "" || val == null) && (!floors || floors <= 0)) {
            hideAllNVAndAnnex();
            $(airConditionedFields + "," + airConditionedDocs).hide();
            return;
        }

       
        if (nv) {

            // show the NV dropdown block
            $("#div_ventilated_spaces_design").show();

            // CASE: dropdown has NO selection (empty) -> hide NV internals + hide annexures
            if (val === "" || val == null) {
                $(openableAreaFields + "," + openableAreaDocs + "," + cfdAnalysisFields + "," + cfdAnalysisDocs).hide();
                hideAllAnnexures();
            }
            else {
                // Openable Area selection
                if (val === "Through Opeanable Area") {
                    $(openableAreaFields).show();
                    $(openableAreaDocs).hide(); // show docs only where needed (keep hidden by default)
                } else {
                    $(openableAreaFields).hide();
                    $(openableAreaDocs).hide();
                }

                // CFD selection
                if (val === "Through CFD Analysis") {
                    $(cfdAnalysisFields).show();
                } else {
                    $(cfdAnalysisFields).hide();
                    $(cfdAnalysisDocs).hide();
                }
            }

        } else {
            // NV unchecked => hide NV block and related fields + annexures
            hideAllNVAndAnnex();
        }



        if (ac) {
            $(airConditionedFields).show();
        } else {
            $(airConditionedFields + "," + airConditionedDocs).hide();
            // Also hide annexures when AC is unchecked (as per requirements)
            hideAllAnnexures();
        }


      

        if (val === "Through CFD Analysis") {
            hideAllAnnexures();
            return; // stop further annexure-floor logic
        }

      

        if (nv || ac) {

            // if dropdown empty we already hid annexures above; protect again
            if (val === "" || val == null) {
                hideAllAnnexures();
                return;
            }

            // ensure annexures start hidden
            hideAllAnnexures();

            // floors must be a positive integer to show annexures
            if (floors > 0 && floors <= 5) {
                $(lessThan).show();
                $(greaterThanSummary).show();
            } else if (floors > 5) {
                $(greater).show();
                $(greaterThanSummary).show();
            } else {
                // floors invalid/zero/negative -> hide all annexures
                hideAllAnnexures();
            }
        }

    } 



    $(document).ready(function () {

        // run once at load
        toggleSustainabilitydesign();

        // when NV or AC checkbox changes
        $("input[name='natural_ventilated_spaces'], input[name='air_conditioned_spaces']").change(function () {
            toggleSustainabilitydesign();
        });

        // when dropdown changes
        $("#ventilated_spaces_design").change(function () {
            toggleSustainabilitydesign();
        });

        // live on floors input
        $("input[name='no_of_floors']").on("input change keyup", function () {
            toggleSustainabilitydesign();
        });
    });
}



if (subtab == "green_transportation") {
  function toggleLowEmitting() {
    if ($("input[name='option_1_a_electric_vehicles']").is(":checked")) {
      $("#div_detailed_narrative_cal, #div_parking_plan_cal, #div_purchase_invoice_cal, #div_photographs_green").show();
    } else {
      $("#div_detailed_narrative_cal, #div_parking_plan_cal, #div_purchase_invoice_cal, #div_photographs_green").hide();
      $("div#detailed_narrative_cal_doc, div#parking_plan_cal_doc, div#purchase_invoice_cal_doc, div#photographs_green_doc").hide();
      

      $("#div_detailed_narrative_cal, #div_parking_plan_cal, #div_purchase_invoice_cal, #div_photographs_green")
      .find("input[type=checkbox], input[type=radio], input[type=text], textarea").prop("checked", false).val("");
       
    }

    if ($("input[name='option_1_b_cng_powered_vehicles']").is(":checked")) {
      $("#div_detailed_narrative_cal_optionb, #div_parking_plan_cal_optionb, #div_site_vicinity_map, #div_purchase_invoice_cal_optionb, #div_photographs_green_optionb").show();
    } else {
      $("#div_detailed_narrative_cal_optionb, #div_parking_plan_cal_optionb, #div_site_vicinity_map, #div_purchase_invoice_cal_optionb, #div_photographs_green_optionb").hide();
      $("div#detailed_narrative_cal_optionb_doc, div#parking_plan_cal_optionb_doc, div#site_vicinity_map_doc, div#purchase_invoice_cal_optionb_doc, div#photographs_green_optionb_doc").hide();

      $( "#div_detailed_narrative_cal_optionb, #div_parking_plan_cal_optionb, #div_site_vicinity_map, #div_purchase_invoice_cal_optionb, #div_photographs_green_optionb")
      .find("input[type=checkbox], input[type=radio], input[type=text], textarea").prop("checked", false).val("");
       
    }


    if ($("input[name='facilities_ev_site']").is(":checked")) {
      $("#div_four_wheel, #div_two_wheel, #div_ev_fourwheel, #div_ev_twowheel, #div_four_parking_percent,#div_two_parking_percent").show();
      $("#div_narrative_charging, #div_parking_plans_charging, #div_ev_sockets, #div_po, #div_photos_po,#div_copy_local_bye,#div_exemplary_performance_check").show();
    } else {
      $("#div_four_wheel, #div_two_wheel, #div_ev_fourwheel, #div_ev_twowheel, #div_four_parking_percent,#div_two_parking_percent").hide();
      $("#div_narrative_charging, #div_parking_plans_charging, #div_ev_sockets, #div_po, #div_photos_po,#div_copy_local_bye,#div_exemplary_performance_check").hide();
      $("div#narrative_charging_doc, div#parking_plans_charging_doc, div#ev_sockets_doc, div#po_doc, div#photos_po_doc, div#copy_local_bye_doc, div#exemplary_performance_check_doc").hide();

      $("#div_narrative_charging, #div_parking_plans_charging, #div_ev_sockets, #div_po, #div_photos_po,#div_copy_local_bye,#div_exemplary_performance_check")
      .find("input[type=checkbox], input[type=radio], input[type=text], textarea").prop("checked", false).val("");
       
    }
   
  }
  toggleLowEmitting();

  $(
    "input[name='prescriptive_approach'], input[name='simulation_approach']"
  ).change(function () {
    toggleLowEmitting();
  });
}


// roof and non roof

// if (subtab == "urban_heat_island") {
//   // Wait for the DOM to be fully loaded before running any script.
//   $(document).ready(function () {
    
//     // --- STEP 1: A function that ONLY handles showing and hiding sections ---
//     // This is safe to run on page load because it never deletes or resets data.
//     function updateRoof() {
//       // Prescriptive Approach
//       if ($("input[name='heat_roof']").is(":checked")) {
//         $("#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_exemplary, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer").show();
//       } else {
//         $("#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_exemplary, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer").hide();
//         $(" div#urban_narrative_doc, div#urban_roof_area_doc, div#test_certificate_doc, div#invoice_roof_doc, div#photos_roof_doc,div#developer_doc").hide();
//       }

//       // Simulation Approach
//       if ($("input[name='heat_non_roof']").is(":checked")) {
//         $("#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration").show();
//       } else {
//         $("#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration").hide();
//         $("div#total_exposed_non_roof_area_doc, div#exposed_area_of_high_sri_non_roof_doc, div#area_of_hardscape_non_roof_doc, div#heat_island_mitigation_non_roof_doc, div#non_roof_exemplary_performance_doc, div#non_roof_narrative_with_detailed_doc, div#non_roof_site_and_roof_area_plan_highlighting_doc, div#non_roof_sri_test_certificate_doc, div#non_roof_tax_invoice_of_materials_doc, div#non_roof_site_and_roof_photographs_doc, div#non_roof_developer_declaration_doc").hide();
//       }
//     }

//     // --- STEP 2: Call the safe visibility function ONCE on page load ---
//     // This is the CRITICAL fix: it correctly sets the initial view based 
//     // on the saved 'checked' attribute in the HTML without clearing any data.
//     updateRoof();

//     // --- STEP 3: Create a single handler for user actions ---
//     // The logic to reset fields only runs when a user MANUALLY unchecks a box.
//     $(
//       "input[name='heat_roof'], input[name='heat_non_roof']"
//     ).change(function () {
//       // Check if the box that triggered this change is now UNCHECKED.
//       if (!$(this).is(":checked")) {
//         let contentDivs;
//         if ($(this).attr("name") === 'heat_roof') {
//           contentDivs = "#div_exposed, #div_insert_area, #div_tolerant, #div_heat_island_mitigation, #div_urban_exemplary, #div_urban_narrative, #div_urban_roof_area, #div_test_certificate, #div_invoice_roof, #div_photos_roof,#div_developer";
//         } else if ($(this).attr("name") === 'heat_non_roof') {
//           contentDivs = "#div_total_exposed_non_roof_area, #div_exposed_area_of_high_sri_non_roof, #div_area_of_hardscape_non_roof, #div_heat_island_mitigation_non_roof,#div_non_roof_exemplary_performance, #div_non_roof_narrative_with_detailed, #div_non_roof_site_and_roof_area_plan_highlighting, #div_non_roof_sri_test_certificate, #div_non_roof_tax_invoice_of_materials,#div_non_roof_site_and_roof_photographs,#div_non_roof_developer_declaration";
//         }

//         // Clear the content fields within the section
//         if (contentDivs) {
//           $(contentDivs)
//             .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//             .not("input[type=file]")
//             .prop("checked", false)
//             .val("");
//         }
//       }

//       // After handling any necessary data clearing, update the view for all sections.
//       updateRoof();
//     });
//   }); // End of $(document).ready()
// }
