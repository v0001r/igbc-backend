if (subtab == "site_preservation") {
  if ($("#retained_topography").is(":checked")) {
    $("#div_area_retained_topography").show();
    $("#div_total_site_area").show();
    $("#div_retained_percent").show();
  } else {
    $("#div_area_retained_topography").hide();
    $("#div_total_site_area").hide();
    $("#div_retained_percent").hide();
  }

  if ($("#preserved_trees").is(":checked")) {
    $("#div_no_existing_trees").show();
    $("#div_no_preserved_trees").show();
    $("#div_preserved_trees_percent").show();
  } else {
    $("#div_no_existing_trees").hide();
    $("#div_no_preserved_trees").hide();
    $("#div_preserved_trees_percent").hide();
  }

  if ($("#retainted_natural_rock").is(":checked")) {
    $("#div_area_retainted_natural_rock").show();
    $("#div_building_footprint").show();
    $("#div_rock_total_site_area").show();
    $("#div_retainted_natural_rock_percent").show();
  } else {
    $("#div_area_retainted_natural_rock").hide();
    $("#div_building_footprint").hide();
    $("#div_rock_total_site_area").hide();
    $("#div_retainted_natural_rock_percent").hide();
  }

  if ($("#retainted_site_countour").is(":checked")) {
    $("#div_area_retainted_site_countour").show();
    $("#div_countour_site_area").show();
    $("#div_retainted_site_countour_percent").show();
  } else {
    $("#div_area_retainted_site_countour").hide();
    $("#div_countour_site_area").hide();
    $("#div_retainted_site_countour_percent").hide();
  }

  $("#retained_topography").change(function () {
    if (this.checked) {
      $("#div_area_retained_topography").show();
      $("#div_total_site_area").show();
      $("#div_retained_percent").show();
    } else {
      $("#div_area_retained_topography").hide();
      $("#div_total_site_area").hide();
      $("#div_retained_percent").hide();
    }
  });

  $("#preserved_trees").change(function () {
    if (this.checked) {
      $("#div_no_existing_trees").show();
      $("#div_no_preserved_trees").show();
      $("#div_preserved_trees_percent").show();
    } else {
      $("#div_no_existing_trees").hide();
      $("#div_no_preserved_trees").hide();
      $("#div_preserved_trees_percent").hide();
    }
  });
  $("#retainted_natural_rock").change(function () {
    if (this.checked) {
      $("#div_area_retainted_natural_rock").show();
      $("#div_building_footprint").show();
      $("#div_rock_total_site_area").show();
      $("#div_retainted_natural_rock_percent").show();
    } else {
      $("#div_area_retainted_natural_rock").hide();
      $("#div_building_footprint").hide();
      $("#div_rock_total_site_area").hide();
      $("#div_retainted_natural_rock_percent").hide();
    }
  });

  $("#retainted_site_countour").change(function () {
    if (this.checked) {
      $("#div_area_retainted_site_countour").show();
      $("#div_countour_site_area").show();
      $("#div_retainted_site_countour_percent").show();
    } else {
      $("#div_area_retainted_site_countour").hide();
      $("#div_countour_site_area").hide();
      $("#div_retainted_site_countour_percent").hide();
    }
  });
}

// if (subtab == "passive_architecture") {
//   let caseVal = $("input[name='case_options_ecolabbled_credit']:checked").val();

//   if (caseVal == 2) {
//     $("#div_exterior").show();
//     $("#div_skylights").show();
//     $("#div_daylighting").show();
//     $("#div_passive").show();
//   } else {
//     $("#div_exterior").hide();
//     $("#div_skylights").hide();
//     $("#div_daylighting").hide();
//     $("#div_passive").hide();
//   }

//   $("input[name='passive_architecture_option']").change(function () {
//     let val = $("input[name='passive_architecture_option']:checked").val();
//     if (val == 2) {
//       $("#div_exterior").show();
//       $("#div_skylights").show();
//       $("#div_daylighting").show();
//       $("#div_passive").show();
//     } else {
//       $("#div_exterior").hide();
//       $("#div_skylights").hide();
//       $("#div_daylighting").hide();
//       $("#div_passive").hide();
//     }
//   });
// }

// if (subtab == "passive_architecture") {
//   function togglePassiveArchitectureDisplay() {
//     let val = $("input[name='passive_architecture_option']:checked").val();
//     if (val == 2) {
//       $("#div_exterior, #div_skylights, #div_daylighting, #div_passive").show();
//     } else {
//       $("#div_exterior, #div_skylights, #div_daylighting, #div_passive").hide();
//       $("#div_exterior, #div_skylights, #div_daylighting, #div_passive")
//           .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//           .prop("checked", false)
//           .val("");
//     }
//   }

//   togglePassiveArchitectureDisplay();

//   $("input[name='passive_architecture_option']").change(togglePassiveArchitectureDisplay);
// }
if (subtab == "passive_architecture") {
  function togglePassiveArchitectureDisplay(isUserAction = false) {
    let val = $("input[name='passive_architecture_option']:checked").val();
    if (val == 2) {
      $("#div_exterior, #div_skylights, #div_daylighting, #div_passive").show();
      $("#div_percentage_eng").hide();
    } else {
      $("#div_exterior, #div_skylights, #div_daylighting, #div_passive").hide();
            $("#div_percentage_eng").show();
      if (isUserAction) {
        $("#div_exterior, #div_skylights, #div_daylighting, #div_passive,#div_percentage_eng")
            .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
            .prop("checked", false)
            .val("");
      }
    }
  }

  // Initial call - don't clear values
  togglePassiveArchitectureDisplay(false);

  // User interaction - allow clearing
  $("input[name='passive_architecture_option']").change(function() {
    togglePassiveArchitectureDisplay(true);
  });
}


if (subtab == "eco_friendly_commuting") {
  let caseVal = $("input[name='new_buildings_public_transport']:checked").val();

  if (caseVal == 1) {
    $("#div_public_transport_select").show();
    $("#div_distance_public_transport, #div_areial_eco,#div_detailed_narrative_eco,#div_highlighting").show();
    $("#div_areial, div#areial_doc, div#signed_agreement_eco_doc").hide();
    $("#div_photographs_ecofriendly, #div_signed_agreement_eco,div#photographs_ecofriendly_doc").hide();

  } else if(caseVal == 2) {
    $("#div_public_transport_select").hide().find("select").val("");
    $("#div_distance_public_transport").hide();
     $("#div_areial").show();
     $("#div_photographs_ecofriendly,#div_signed_agreement_eco").show();
     $("div#distance_public_transport_doc, div#areial_eco_doc, div#detailed_narrative_eco_doc, div#highlighting_doc").hide();

  }
  else{
    $("#div_public_transport_select, #div_photographs_ecofriendly, #div_areial,#div_div_photographs_ecofriendly, #div_distance_public_transport, #div_areial_eco,#div_detailed_narrative_eco,#div_signed_agreement_eco,#div_highlighting").hide();
    $("div#public_transport_select_doc, div#photographs_ecofriendly_doc, div#areial_doc, div#distance_public_transport_doc, div#areial_eco_doc, div#detailed_narrative_eco_doc, div#signed_agreement_eco_doc, div#highlighting_doc").hide();

  }

  $("input[name='new_buildings_public_transport']").change(function () {
    let val = $("input[name='new_buildings_public_transport']:checked").val();
    if (val == 1) {
      $("#div_public_transport_select").show();
      $("#div_distance_public_transport,#div_areial_eco,#div_detailed_narrative_eco,#div_highlighting").show();
      $("#div_areial, div#areial_doc, div#signed_agreement_eco_doc").hide();
      $("#div_photographs_ecofriendly,#div_signed_agreement_eco, div#photographs_ecofriendly_doc").hide();


    $("#div_photographs_ecofriendly").hide();
    } else if (val == 2) {
      $("#div_public_transport_select").hide().find("select").val("");
      $("#div_distance_public_transport,#div_areial_eco,#div_detailed_narrative_eco,#div_highlighting").hide();
      $("#div_areial").show();
     $("#div_photographs_ecofriendly,#div_signed_agreement_eco" ).show();
      $("div#distance_public_transport_doc, div#areial_eco_doc, div#detailed_narrative_eco_doc, div#highlighting_doc").hide();

    }
    else{
      $("#div_public_transport_select,#div_photographs_ecofriendly, #div_areial,#div_div_photographs_ecofriendly, #div_distance_public_transport, #div_areial_eco,#div_detailed_narrative_eco,#div_signed_agreement_eco,#div_highlighting").hide();
      $("div#public_transport_select_doc, div#photographs_ecofriendly_doc, div#areial_doc, div#distance_public_transport_doc, div#areial_eco_doc, div#detailed_narrative_eco_doc, div#signed_agreement_eco_doc, div#highlighting_doc").hide();

    }
  });
}

if (subtab == "topography") {
  let caseVal = $("input[name='new_building_topo_option']:checked").val();

  if (caseVal == 1) {
    $("#div_casea_total_site_area_nb").show();
    $("#div_casea_adaptive").show();
    $("#div_caseb_natural_topography_nb").show();
  } else {
    $("#div_casea_total_site_area_nb").hide();
    $("#div_casea_adaptive").hide();
    $("#div_caseb_natural_topography_nb").hide();
  }

  if (caseVal == 2) {
    $("#div_casea_total_site_area_nb_2").show();
    $("#div_case_adaptive_on_ground").show();
    $("#div_case_adaptive_on_buildup").show();
    $("#div_caseb_natural_topography_nb_2").show();
  } else {
    $("#div_casea_total_site_area_nb_2").hide();
    $("#div_case_adaptive_on_ground").hide();
    $("#div_case_adaptive_on_buildup").hide();
    $("#div_caseb_natural_topography_nb_2").hide();
  }

  $("input[name='new_building_topo_option']").change(function () {
    let val = $("input[name='new_building_topo_option']:checked").val();
    if (val == 1) {
      $("#div_casea_total_site_area_nb").show();
      $("#div_casea_adaptive").show();
      $("#div_caseb_natural_topography_nb").show();
    } else {
      $("#div_casea_total_site_area_nb").hide();
      $("#div_casea_adaptive").hide();
      $("#div_caseb_natural_topography_nb").hide();
    }

    if (val == 2) {
      $("#div_casea_total_site_area_nb_2").show();
      $("#div_case_adaptive_on_ground").show();
      $("#div_case_adaptive_on_buildup").show();
      $("#div_caseb_natural_topography_nb_2").show();
    } else {
      $("#div_casea_total_site_area_nb_2").hide();
      $("#div_case_adaptive_on_ground").hide();
      $("#div_case_adaptive_on_buildup").hide();
      $("#div_caseb_natural_topography_nb_2").hide();
    }
  });
}

if (subtab == "urban_heat_island") {
  function toggleRoofMitigation(val) {
    $(
      "#div_reflective_mitigation, #div_vegetation_mitigation, #div_sri_vegetation_island_mitigation"
    ).hide();

    if (val == 1) {
      $("#div_reflective_mitigation").show();
    } else if (val == 2) {
      $("#div_vegetation_mitigation").show();
    } else if (val == 3) {
      $("#div_sri_vegetation_island_mitigation").show();
    }
  }
  let caseVal = $("input[name='roof_public_transport']:checked").val();
  toggleRoofMitigation(caseVal);

  $("input[name='roof_public_transport']").change(function () {
    let roof = $("input[name='roof_public_transport']:checked").val();
    toggleRoofMitigation(roof);
  });
}

if (subtab == "urban_heat_non_roof") {
  function toggleNonRoofMitigation(val) {
    $("#div_non_roof_mitigation_one, #div_non_roof_mitigation_two, #div_impervious,#div_shaded,#div_hard_sri_least_materials,#div_open_grid_grass, #div_parking_non_roof, #div_covered").hide();

    if (val == 1) {
      $("#div_non_roof_mitigation_one,#div_impervious,#div_shaded,#div_hard_sri_least_materials,#div_open_grid_grass").show();
    } else if (val == 2) {
      $("#div_non_roof_mitigation_two,#div_parking_non_roof, #div_covered").show();
    }
  }
  let caseVal = $("input[name='non_roof_options']:checked").val();
  toggleNonRoofMitigation(caseVal);

  $("input[name='non_roof_options']").change(function () {
    let roof = $("input[name='non_roof_options']:checked").val();
    toggleNonRoofMitigation(roof);
  });
}

if (subtab == "site_preservation") {
  if ($("#retained_topography").is(":checked")) {
    $("#div_area_retained_topography").show();
    $("#div_total_site_area").show();
    $("#div_retained_percent").show();
  } else {
    $("#div_area_retained_topography").hide();
    $("#div_total_site_area").hide();
    $("#div_retained_percent").hide();
  }
}



if (subtab == "green_transportation") {
  $(document).ready(function () {
    
    function updateAllSectionsVisibility() {
      if ($("input[name='option_1_a_electric_vehicles']").is(":checked")) {
        $("#div_detailed_narrative_cal, #div_parking_plan_cal, #div_purchase_invoice_cal, #div_photographs_green").show();
      } else {
        $("#div_detailed_narrative_cal, #div_parking_plan_cal, #div_purchase_invoice_cal, #div_photographs_green").hide();
        $("div#detailed_narrative_cal_doc, div#parking_plan_cal_doc, div#purchase_invoice_cal_doc, div#photographs_green_doc").hide();
        
      }

      if ($("input[name='option_1_b_cng_powered_vehicles']").is(":checked")) {
        $("#div_detailed_narrative_cal_optionb, #div_parking_plan_cal_optionb, #div_site_vicinity_map, #div_purchase_invoice_cal_optionb, #div_photographs_green_optionb").show();
      } else {
        $("#div_detailed_narrative_cal_optionb, #div_parking_plan_cal_optionb, #div_site_vicinity_map, #div_purchase_invoice_cal_optionb, #div_photographs_green_optionb").hide();
        $("div#detailed_narrative_cal_optionb_doc, div#parking_plan_cal_optionb_doc, div#site_vicinity_map_doc, div#purchase_invoice_cal_optionb_doc, div#photographs_green_optionb_doc").hide();
      }

      if ($("input[name='facilities_ev_site']").is(":checked")) {
        $("#div_four_wheel, #div_two_wheel, #div_ev_fourwheel, #div_ev_twowheel, #div_four_parking_percents, #div_two_parking_percents").show();
        $("#div_narrative_charging, #div_parking_plans_charging, #div_ev_sockets, #div_po, #div_photos_po, #div_copy_local_bye, #div_exemplary_performance_check").show();
      } else {
        $("#div_four_wheel, #div_two_wheel, #div_ev_fourwheel, #div_ev_twowheel, #div_four_parking_percents, #div_two_parking_percents").hide();
        $("#div_narrative_charging, #div_parking_plans_charging, #div_ev_sockets, #div_po, #div_photos_po, #div_copy_local_bye, #div_exemplary_performance_check").hide();
        $("div#narrative_charging_doc, div#parking_plans_charging_doc, div#ev_sockets_doc, div#po_doc, div#photos_po_doc, div#copy_local_bye_doc, div#exemplary_performance_check_doc").hide();

      }
    }

    // sets the initial state correctly without clearing any saved child checkboxes.
    updateAllSectionsVisibility();

    // Now, we add the "reset" logic only when a user MANUALLY unchecks a box.
    $("input[name='option_1_a_electric_vehicles']").change(function () {
      updateAllSectionsVisibility(); // Update visibility first
      if (!$(this).is(":checked")) {
        // If it was just UNCHECKED, then clear its children.
        $("div#detailed_narrative_cal_doc, div#parking_plan_cal_doc, div#purchase_invoice_cal_doc, div#photographs_green_doc").hide();
        $("#div_detailed_narrative_cal, #div_parking_plan_cal, #div_purchase_invoice_cal, #div_photographs_green")
          .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
          .prop("checked", false)
          .val("");

          $("#div_detailed_narrative_cal, #div_parking_plan_cal, #div_purchase_invoice_cal, #div_photographs_green,div#detailed_narrative_cal_doc, div#parking_plan_cal_doc, div#purchase_invoice_cal_doc, div#photographs_green_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
          
      }
    });

    $("input[name='option_1_b_cng_powered_vehicles']").change(function () {
      updateAllSectionsVisibility(); 
      if (!$(this).is(":checked")) {
        $("div#detailed_narrative_cal_optionb_doc, div#parking_plan_cal_optionb_doc, div#site_vicinity_map_doc, div#purchase_invoice_cal_optionb_doc, div#photographs_green_optionb_doc").hide();
        $("#div_detailed_narrative_cal_optionb, #div_parking_plan_cal_optionb, #div_site_vicinity_map, #div_purchase_invoice_cal_optionb, #div_photographs_green_optionb")
          .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
          .prop("checked", false)
          .val("");

          $("div#detailed_narrative_cal_optionb_doc, div#parking_plan_cal_optionb_doc, div#site_vicinity_map_doc, div#purchase_invoice_cal_optionb_doc, div#photographs_green_optionb_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      }
    });

    $("input[name='facilities_ev_site']").change(function () {
      updateAllSectionsVisibility(); 
      if (!$(this).is(":checked")) {
        $("div#narrative_charging_doc, div#parking_plans_charging_doc, div#ev_sockets_doc, div#po_doc, div#photos_po_doc, div#copy_local_bye_doc, div#exemplary_performance_check_doc").hide();
        $("#div_narrative_charging, #div_parking_plans_charging, #div_ev_sockets, #div_po, #div_photos_po,#div_copy_local_bye,#div_exemplary_performance_check")
          .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
          .prop("checked", false)
          .val("");

          $("div#narrative_charging_doc, div#parking_plans_charging_doc, div#ev_sockets_doc, div#po_doc, div#photos_po_doc, div#copy_local_bye_doc, div#exemplary_performance_check_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      }
    });
  }); 
}


// if (subtab == "rainwater_harvesting") {
//   toggleApproach($("#select_approach_rain").val(), false);

//   $("#select_approach_rain").change(function () {
//     toggleApproach($(this).val(), true);
//   });
// }

// function toggleApproach(value, clearHidden = true) {
//   if (value === "Case A") {
//     $("#div_runoff_cal, #div_oneday_cal, #div_rain_cal_harvest").show();
//     $(
//       "#div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings"
//     ).show();

//     $(
//       "#div_cap_rain_req, #div_cap_rain_prpposed, #div_per_rain_harvest, #div_plumbing_performance"
//     ).hide();
//     $(
//       "#div_plumbing_hydrology,#div_plumbing_narra, div#plumbing_narra_doc, #div_plumbing_photos,div#plumbing_hydrology_doc, div#plumbing_photos_doc"
//     ).hide();

//     if (clearHidden) {
//       $(
//         "#div_plumbing_hydrology,#div_plumbing_narra, div#plumbing_narra_doc, #div_plumbing_photos, div#plumbing_hydrology_doc, div#plumbing_photos_doc"
//       )
//         .find(
//           "input[type=checkbox], input[type=radio], input[type=text], textarea"
//         )
//         .prop("checked", false)
//         .val("");
//     }
//   } else if (value === "Case B") {
//     $(
//       "#div_cap_rain_req, #div_cap_rain_prpposed, #div_per_rain_harvest, #div_plumbing_performance"
//     ).show();
//     $(
//       "#div_plumbing_hydrology,#div_plumbing_narra, #div_plumbing_photos"
//     ).show();

//     $("#div_runoff_cal, #div_oneday_cal, #div_rain_cal_harvest").hide();
//     $(
//       "#div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings,div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc, div#plumbing_highlights_doc, div#plumbing_drawings_doc"
//     ).hide();

//     if (clearHidden) {
//       $(
//         "#div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings, div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc, div#plumbing_highlights_doc, div#plumbing_drawings_doc"
//       )
//         .find(
//           "input[type=checkbox], input[type=radio], input[type=text], textarea"
//         )
//         .prop("checked", false)
//         .val("");
//     }
//   } else {
//     $(
//       "div#plumbing_narra_doc, #div_plumbing_photos,div#plumbing_hydrology_doc, div#plumbing_photos_doc,div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc, div#plumbing_highlights_doc, div#plumbing_drawings_doc,#div_runoff_cal, #div_oneday_cal, #div_rain_cal_harvest, #div_plumbing_narra, #div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings,#div_cap_rain_req, #div_cap_rain_prpposed, #div_per_rain_harvest, #div_plumbing_performance,#div_plumbing_hydrology, #div_plumbing_photos"
//     ).hide();
//   }
// }


if (subtab == "rainwater_harvesting") {
  // Wait for the entire page to be ready before running any code.
  console.log("rainwater_harvesting");
  $(document).ready(function () {
    function updateVisibility() {
      const selectedValue = $("#select_approach_rain").val();

      if (selectedValue === "Case A") {
        // Show all divs for Case A
        $("#div_runoff_cal, #div_oneday_cal, #div_rain_cal_harvest").show();
        $("#div_plumbing_narrative, #div_enhanced_photos, #div_plumbing_rainfall, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings").show();
      
        
        // Hide all divs for Case B
        $("#div_cap_rain_req, #div_cap_rain_prpposed, #div_per_rain_harvest, #div_plumbing_performance").hide();
        $("#div_plumbing_hydrology, #div_plumbing_narra, div#plumbing_narra_doc, #div_plumbing_photos, div#plumbing_hydrology_doc, div#plumbing_photos_doc").hide();
      } else if (selectedValue === "Case B") {
        // Show all divs for Case B
        $("#div_cap_rain_req, #div_cap_rain_prpposed, #div_per_rain_harvest, #div_plumbing_performance").show();
        $("#div_plumbing_hydrology, #div_plumbing_narra, #div_plumbing_photos").show();

        // Hide all divs for Case A
        $("#div_runoff_cal, #div_oneday_cal,#div_enhanced_photos, #div_rain_cal_harvest").hide();
        $("#div_plumbing_narrative, #div_plumbing_rainfall,div#enhanced_photos_doc, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings, div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc, div#plumbing_highlights_doc, div#plumbing_drawings_doc").hide();
      } else {
        $("#div_runoff_cal, #div_oneday_cal, #div_rain_cal_harvest,#div_enhanced_photos, div#enhanced_photos_doc, #div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings, #div_cap_rain_req, #div_cap_rain_prpposed, #div_per_rain_harvest, #div_plumbing_performance, #div_plumbing_hydrology, #div_plumbing_narra, #div_plumbing_photos, div[id$='_doc']").hide();
      }
    }

    updateVisibility();

    $("#select_approach_rain").change(function () {
      const selectedValue = $(this).val();

      // the user is navigating away from.
      if (selectedValue === "Case A") {
        // User switched TO Case A, so clear Case B's inputs
        $("#div_cap_rain_req, #div_cap_rain_prpposed, #div_per_rain_harvest, #div_plumbing_performance, #div_plumbing_hydrology, #div_plumbing_narra, #div_plumbing_photos")
          .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
          .prop("checked", false)
          .val("");

          $("div#cap_rain_req_doc, div#cap_rain_prpposed_doc, div#per_rain_harvest_doc, div#plumbing_performance_doc, div#plumbing_hydrology_doc, div#plumbing_narra_doc, div#plumbing_photos_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });

      } else if (selectedValue === "Case B") {
        // User switched TO Case B, so clear Case A's inputs
        $("#div_runoff_cal,#div_enhanced_photos, #div_oneday_cal, #div_rain_cal_harvest, #div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings")
          .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
          .prop("checked", false)
          .val("");

          $("div#runoff_cal_doc, div#oneday_cal_doc,div#enhanced_photos_doc, div#rain_cal_harvest_doc,div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc, #div#plumbing_highlights_doc, div#plumbing_drawings_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      }
      else{
        $("#div_cap_rain_req, #div_cap_rain_prpposed, #div_per_rain_harvest, #div_plumbing_performance, #div_plumbing_hydrology, #div_plumbing_narra, #div_plumbing_photos")
          .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
          .prop("checked", false)
          .val("");

        $("div#cap_rain_req_doc, div#cap_rain_prpposed_doc, div#per_rain_harvest_doc, div#plumbing_performance_doc, div#plumbing_hydrology_doc, div#plumbing_narra_doc, div#plumbing_photos_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });

          $("#div_runoff_cal, #div_enhanced_photos, #div_oneday_cal, #div_rain_cal_harvest, #div_plumbing_narrative, #div_plumbing_rainfall, #div_plumbing_rain_harvesting, #div_plumbing_highlights, #div_plumbing_drawings")
          .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
          .prop("checked", false)
          .val("");
        $("div#runoff_cal_doc, div#oneday_cal_doc, div#enhanced_photos_doc, div#rain_cal_harvest_doc,div#plumbing_narrative_doc, div#plumbing_rainfall_doc, div#plumbing_rain_harvesting_doc, #div#plumbing_highlights_doc, div#plumbing_drawings_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      }

      // After potentially clearing the old section, update the view.
      updateVisibility();
    });
  });
}






// if (subtab == "minimum_fresh_air_enhanced") {
//   // Wait for the document to be fully loaded before running any script.
//   $(document).ready(function () {
//     // --- STEP 1: A function that ONLY handles showing and hiding sections ---
//     // This is safe to run on page load because it never deletes or resets data.
//     function updateVisibilityminimum() {

//     if ($("input[name='case_a_mechanically_ventilated']").is(":checked")) {

//     $("#div_vrp_calculations_select").show();

//     let value = $("#vrp_calculations_select").val();
//     console.log(value, "selected new");

//     $("#div_vrp_calculations, #div_vrp_calculations_single, #div_vrp_calculations_multiple").hide();

//     if (value == "100% outdoor air system") {
//         $("#div_vrp_calculations").show();

//     } else if (value == "Single zone system") {
//         $("#div_vrp_calculations_single").show();

//     } else if (value == "Mutiple zone recirculating systems") {
//         $("#div_vrp_calculations_multiple").show();
//     }

//     $("#div_decalaration_minimum, #div_narrative_minimum_air, #div_hvac_layout_fresh_air, #div_technical_cutsheet_fresh_air, #div_videos_geotagged_time, #div_purchase_invoices_minimum, #div_lease_agreement_applicable").show();

// } else {

//     $("#div_vrp_calculations_select, #div_vrp_calculations, #div_vrp_calculations_single, #div_vrp_calculations_multiple").hide();
//     $("#div_decalaration_minimum, #div_narrative_minimum_air, #div_hvac_layout_fresh_air, #div_technical_cutsheet_fresh_air, #div_videos_geotagged_time, #div_purchase_invoices_minimum, #div_lease_agreement_applicable").hide();
//     $("div[id$='_doc']").hide();
// }



//       // --- Logic for Case B ---
//       if ($("input[name='case_b_nartural_ventilation']").is(":checked")) {
//         $("#div_caseb_narrative, #div_floor_plans_windows, #div_details_installed_windows, #div_elevation_building_ope, #div_openable_carpet_cal_area, #div_stamped_operable_doors").show();
//       } else {
//         $("#div_caseb_narrative, #div_floor_plans_windows, #div_details_installed_windows, #div_elevation_building_ope, #div_openable_carpet_cal_area, #div_stamped_operable_doors, div#caseb_narrative_doc, div#floor_plans_windows_doc, div#details_installed_windows_doc, div#elevation_building_ope_doc, div#openable_carpet_cal_area_doc, div#stamped_operable_doors_doc").hide();
//       }
//     }

//     // --- STEP 2: Call the safe visibility function ONCE on page load ---
//     // This correctly sets the initial view based on saved data without clearing anything.
//     updateVisibilityminimum();

//     // --- STEP 3: Create a single handler for user actions ---
//     // The logic to reset fields only runs when a user MANUALLY unchecks a box.
//     $("input[name='case_a_mechanically_ventilated'], input[name='case_b_nartural_ventilation']").change(function () {
//       // Check if the box that triggered this change is now UNCHECKED.
//       if (!$(this).is(":checked")) {
//         // Determine which checkbox it was and clear only its related fields.
//         if ($(this).attr("name") === "case_a_mechanically_ventilated") {
//           $("#div_narrative_minimum_air,#div_vrp_calculations_select, #div_decalaration_minimum, #div_hvac_layout_fresh_air, #div_vrp_calculation_ashrae, #div_technical_cutsheet_fresh_air, #div_videos_geotagged_time, #div_purchase_invoices_minimum, #div_lease_agreement_applicable")
//             .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//             .not("input[type=file]")
//             .prop("checked", false)
//             .val("");

//              $("div#narrative_minimum_air_doc, div#decalaration_minimum_doc, div#hvac_layout_fresh_air_doc, div#vrp_calculation_ashrae_doc, div#technical_cutsheet_fresh_air_doc, div#videos_geotagged_time_doc, div#purchase_invoices_minimum_doc, div#lease_agreement_applicable_doc")
//           .find("input[type='file']")
//           .each(function () {
//             var $input = $(this);
//             $input.replaceWith($input.val('').clone(true));
//           });

//         } else if ($(this).attr("name") === "case_b_nartural_ventilation") {
//           $("#div_caseb_narrative, #div_floor_plans_windows, #div_details_installed_windows, #div_elevation_building_ope, #div_openable_carpet_cal_area, #div_stamped_operable_doors")
//             .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//             .not("input[type=file]")
//             .prop("checked", false)
//             .val("");

//             $("div#caseb_narrative_doc, div#floor_plans_windows_doc, div#details_installed_windows_doc, div#elevation_building_ope_doc, div#openable_carpet_cal_area_doc, div#stamped_operable_doors_doc")
//           .find("input[type='file']")
//           .each(function () {
//             var $input = $(this);
//             $input.replaceWith($input.val('').clone(true));
//           });
//         }
//       }

//       updateVisibilityminimum();
//     });
//   }); 
// }


// $(document).on("change", "#vrp_calculations_select", function () {
//     console.log("Dropdown changed to:", $(this).val());
//     updateVisibilityminimum(); 
// });

function updateVisibilityminimum() {

    if ($("input[name='case_a_mechanically_ventilated']").is(":checked")) {

        $("#div_vrp_calculations_select").show();

        let value = $("#vrp_calculations_select").val();
        console.log(value, "selected new");

        $("#div_vrp_calculations, #div_vrp_calculations_single, #div_vrp_calculation_ashrae").hide();

        if (value === "100% outdoor air system") {
            $("#div_vrp_calculations").show();
        } else if (value === "Single zone system") {
            $("#div_vrp_calculations_single").show();
        } else if (value === "Mutiple zone recirculating systems") {
            $("#div_vrp_calculation_ashrae").show();
        }

        $("#div_decalaration_minimum, #div_narrative_minimum_air, #div_hvac_layout_fresh_air, #div_technical_cutsheet_fresh_air, #div_videos_geotagged_time, #div_purchase_invoices_minimum, #div_lease_agreement_applicable").show();

    } else {
        $("#div_vrp_calculations_select, #div_vrp_calculations,#div_vrp_calculation_ashrae, #div_vrp_calculations_single, #div_vrp_calculations_multiple").hide();
        $("#div_decalaration_minimum, #div_narrative_minimum_air, #div_hvac_layout_fresh_air, #div_technical_cutsheet_fresh_air, #div_videos_geotagged_time, #div_purchase_invoices_minimum, #div_lease_agreement_applicable").hide();
        $("div[id$='_doc']").hide();
    }

    if ($("input[name='case_b_nartural_ventilation']").is(":checked")) {
        $("#div_caseb_narrative, #div_floor_plans_windows, #div_details_installed_windows, #div_elevation_building_ope, #div_openable_carpet_cal_area, #div_stamped_operable_doors").show();
    } else {
        $("#div_caseb_narrative, #div_floor_plans_windows, #div_details_installed_windows, #div_elevation_building_ope, #div_openable_carpet_cal_area, #div_stamped_operable_doors, div#caseb_narrative_doc, div#floor_plans_windows_doc, div#details_installed_windows_doc, div#elevation_building_ope_doc, div#openable_carpet_cal_area_doc, div#stamped_operable_doors_doc").hide();
    }
}
if (subtab == "minimum_fresh_air_enhanced") {
    $(document).ready(function () {
        updateVisibilityminimum();

        $("input[name='case_a_mechanically_ventilated'], input[name='case_b_nartural_ventilation']")
            .on("change", updateVisibilityminimum);
    });
}

$(document).on("change", "#vrp_calculations_select", updateVisibilityminimum);






if (subtab == "daylighting_credit") {
  // Pass 'false' on initial load to show the correct state without clearing existing saved data
  toggledaylight($("#select_approach_credit").val(), false); 
  
  $("#select_approach_credit").change(function () {
    // Pass 'true' on change to clear the data of the *hidden* approach
    toggledaylight($(this).val(), true); 
  });
}

function toggledaylight(value, clearData) { 
  console.log("toggledaylight Value", value);

  if (value === "Simulation Approach") {
    console.log("sim value", value);
    $("#div_total_compliant_area").show();
    $(
      "#div_total_compliant_reg_area2,#div_narrative_daylighting, #div_indicating_window_door, #div_simulation_report_credit, #div_cutsheet_credit, #div_photographs_credit,#div_purchase_credit"
    ).show();
    $(
      "#div_total_compliant_reg_area,#div_total_compliant_reg,#div_simulation_report_credit_measurement,#div_narrative_daylighting_measurement,#div_indicating_window_door_measurement,#div_site_master_measurement,#div_cutsheet_credit_measurement,#div_photographs_credit_measurement,#div_purchase_credit_measurement"
    ).hide();
    $(
      "div#narrative_daylighting_measurement_doc,div#indicating_window_door_measurement_doc, div#simulation_report_credit_measurement_doc,div#site_master_measurement_doc,div#cutsheet_credit_measurement_doc,div#photographs_credit_measurement_doc,div#purchase_credit_measurement_doc"
    ).hide();
    
    // 'clearData' 
    if (clearData) { 
      // Clear the "Measurement approach" fields when switching to "Simulation Approach"
      $(
        "#div_total_compliant_reg_area,#div_total_compliant_reg,#div_simulation_report_credit_measurement,#div_narrative_daylighting_measurement,#div_indicating_window_door_measurement, #div_site_master_measurement,#div_cutsheet_credit_measurement,#div_photographs_credit_measurement,#div_purchase_credit_measurement"
      )
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") 
        .not("input[type=file]") // Ensure file inputs aren't cleared (which causes issues)
        .prop("checked", false)
        .val("");

        $("div#narrative_daylighting_measurement_doc,div#indicating_window_door_measurement_doc, div#simulation_report_credit_measurement_doc,div#site_master_measurement_doc,div#cutsheet_credit_measurement_doc,div#photographs_credit_measurement_doc,div#purchase_credit_measurement_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      console.log("Measurement value cleared", value);
    }
  } else if (value === "Measurement approach") {
    console.log("mes value", value);
    $(
      "#div_total_compliant_reg_area,#div_total_compliant_reg,#div_simulation_report_credit_measurement,#div_narrative_daylighting_measurement,#div_indicating_window_door_measurement, #div_site_master_measurement,#div_cutsheet_credit_measurement,#div_photographs_credit_measurement,#div_purchase_credit_measurement"
    ).show();
    $(
      "#div_total_compliant_reg_area2,#div_total_compliant_area,#div_narrative_daylighting, #div_indicating_window_door, #div_simulation_report_credit, #div_cutsheet_credit, #div_photographs_credit,#div_purchase_credit"
    ).hide();
    $(
      "div#narrative_daylighting_doc, div#indicating_window_door_doc, div#simulation_report_credit_doc, div#cutsheet_credit_doc, div#photographs_credit_doc, div#purchase_credit_doc"
    ).hide();
    
    //  'clearData' 
    if (clearData) {
      // Clear the "Simulation Approach" fields when switching to "Measurement approach"
      $(
        "#div_total_compliant_area,#div_narrative_daylighting, #div_indicating_window_door, #div_simulation_report_credit, #div_cutsheet_credit, #div_photographs_credit,#div_purchase_credit"
      )
        .find("input[type=checkbox],input[type=radio],select,input[type=text],textarea") // Added textareas and radio
        .not("input[type=file]") // Ensure file inputs aren't cleared
        .prop("checked", false)
        .val("");

         $("div#narrative_daylighting_doc, div#indicating_window_door_doc, div#simulation_report_credit_doc, div#cutsheet_credit_doc, div#photographs_credit_doc, div#purchase_credit_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
      console.log("Simulation value cleared", value);
    }
  } else  {
  $(
    "#div_total_compliant_reg_area2,#div_total_compliant_reg_area,#div_total_compliant_reg,#div_total_compliant_area,#div_narrative_daylighting, #div_indicating_window_door, #div_simulation_report_credit, #div_cutsheet_credit, #div_photographs_credit,#div_purchase_credit,div#narrative_daylighting_doc, div#indicating_window_door_doc, div#simulation_report_credit_doc, div#cutsheet_credit_doc, div#photographs_credit_doc, div#purchase_credit_doc,#div_simulation_report_credit_measurement,#div_narrative_daylighting_measurement,#div_indicating_window_door_measurement, #div_site_master_measurement,#div_cutsheet_credit_measurement,#div_photographs_credit_measurement,#div_purchase_credit_measurement,div#simulation_report_credit_measurement_doc,div#narrative_daylighting_measurement_doc,div#indicating_window_door_measurement_doc, div#simulation_report_credit_measurement_doc,div#site_master_measurement_doc,div#cutsheet_credit_measurement_doc,div#photographs_credit_measurement_doc,div#purchase_credit_measurement_doc"
  ).hide();

  // ONLY CLEAR IF clearData is TRUE (i.e., on change, not on initial load) 
  if (clearData) {
    $(
      "#div_total_compliant_area, #div_total_compliant_reg_area2, #div_narrative_daylighting, #div_indicating_window_door, #div_simulation_report_credit, #div_cutsheet_credit, #div_photographs_credit, #div_purchase_credit, #div_total_compliant_reg_area, #div_total_compliant_reg, #div_simulation_report_credit_measurement, #div_narrative_daylighting_measurement, #div_indicating_window_door_measurement, #div_site_master_measurement, #div_cutsheet_credit_measurement, #div_photographs_credit_measurement, #div_purchase_credit_measurement, div#narrative_daylighting_doc, div#indicating_window_door_doc, div#simulation_report_credit_doc, div#cutsheet_credit_doc, div#photographs_credit_doc, div#purchase_credit_doc, div#simulation_report_credit_measurement_doc, div#narrative_daylighting_measurement_doc, div#indicating_window_door_measurement_doc, div#site_master_measurement_doc, div#cutsheet_credit_measurement_doc, div#photographs_credit_measurement_doc, div#purchase_credit_measurement_doc"
    )
      .find(
        "input[type=radio], input[type=checkbox], select, input[type=text], textarea"
      )
      .not("input[type=file]")
      .prop("checked", false)
      .val("");
      $("div#narrative_daylighting_measurement_doc,div#indicating_window_door_measurement_doc, div#simulation_report_credit_measurement_doc,div#site_master_measurement_doc,div#cutsheet_credit_measurement_doc,div#photographs_credit_measurement_doc,div#purchase_credit_measurement_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });


       $("div#narrative_daylighting_doc, div#indicating_window_door_doc, div#simulation_report_credit_doc, div#cutsheet_credit_doc, div#photographs_credit_doc, div#purchase_credit_doc")
          .find("input[type='file']")
          .each(function () {
            var $input = $(this);
            $input.replaceWith($input.val('').clone(true));
          });
    console.log("Total value cleared on switch to none", value);
  } 
  // else {
  //   console.log("Initial load with no approach selected. Fields hidden, NOT cleared.");
  // }
}
}



if (subtab == "minimise_indoor_outdoor_pollutants") {
    $(document).ready(function () { 
        // This is safe to run on page load because it never deletes or resets data.
        function updateVisibility() {

            // --- Entryway Systems ---
            if ($("input[name='entryway_systems']").is(":checked")) {
                $("#div_narrative_entryway, #div_site_master_outdoor_minimise, #div_photographs_outdoor_minimise").show();
            } else {
                $("#div_narrative_entryway, #div_site_master_outdoor_minimise, #div_photographs_outdoor_minimise").hide();
                $("div#narrative_entryway_doc, div#site_master_outdoor_minimise_doc, div#photographs_outdoor_minimise_doc").hide();
            }

            // --- Printer Rooms ---
            if ($("input[name='printer_rooms']").is(":checked")) {
                $("#div_narrative_printer, #div_higihlighting_printer, #div_exhaust_system, #div_geotagged_photograph_indoor").show();
            } else {
                $("#div_narrative_printer, #div_higihlighting_printer, #div_exhaust_system, #div_geotagged_photograph_indoor").hide();
                $("div#narrative_printer_doc, div#higihlighting_printer_doc, div#exhaust_system_doc, div#geotagged_photograph_indoor_doc").hide();
            }

            // --- Air Filtering Media ---
            if ($("input[name='air_filtering_media']").is(":checked")) {
                $("#div_narrative_air_filtering_media, #div_purchase_invoices_air_filtering, #div_technical_cutsheet_air_filtering, #div_fresh_air_system_floor_plan, #div_geotagged_photograph_indoor_tech").show();
            } else {
                $("#div_narrative_air_filtering_media, #div_purchase_invoices_air_filtering, #div_technical_cutsheet_air_filtering, #div_fresh_air_system_floor_plan, #div_geotagged_photograph_indoor_tech").hide();
                $("div#narrative_air_filtering_media_doc, div#purchase_invoices_air_filtering_doc, div#technical_cutsheet_air_filtering_doc, div#fresh_air_system_floor_plan_doc, div#geotagged_photograph_indoor_tech_doc").hide();
            }

            // --- Germicidal UV Lamps ---
            if ($("input[name='germicidal_uv_lamps']").is(":checked")) {
                $("#div_narrative_germicidal, #div_purchase_invoices_germicidal, #div_technical_cutsheet_germicidal, #div_fresh_air_system_germicidal, #div_geotagged_photograph_germicidal").show();
            } else {
                $("#div_narrative_germicidal, #div_purchase_invoices_germicidal, #div_technical_cutsheet_germicidal, #div_fresh_air_system_germicidal, #div_geotagged_photograph_germicidal").hide();
                $("div#narrative_germicidal_doc, div#purchase_invoices_germicidal_doc, div#technical_cutsheet_germicidal_doc, div#fresh_air_system_germicidal_doc, div#geotagged_photograph_germicidal_doc").hide();
            }
        }

        
        updateVisibility();

        $(
            "input[name='entryway_systems'], input[name='printer_rooms'], input[name='germicidal_uv_lamps'], input[name='air_filtering_media']"
        ).change(function () {
            
            // If the box that triggered this change is now UNCHECKED, clear its related fields.
            if (!$(this).is(":checked")) {
                
                // Get the ID of the related content DIVs to clear
                let contentDivs;
                switch ($(this).attr("name")) {
                    case "entryway_systems":
                        contentDivs = "#div_narrative_entryway, #div_site_master_outdoor_minimise, #div_photographs_outdoor_minimise,div#narrative_entryway_doc, div#site_master_outdoor_minimise_doc, div#photographs_outdoor_minimise_doc";
                        break;
                    case "printer_rooms":
                        contentDivs = "#div_narrative_printer, #div_higihlighting_printer, #div_exhaust_system, #div_geotagged_photograph_indoor,div#narrative_printer_doc, div#higihlighting_printer_doc, div#exhaust_system_doc, div#geotagged_photograph_indoor_doc";
                        break;
                    case "air_filtering_media":
                        contentDivs = "#div_narrative_air_filtering_media, #div_purchase_invoices_air_filtering, #div_technical_cutsheet_air_filtering, #div_fresh_air_system_floor_plan, #div_geotagged_photograph_indoor_tech,div#narrative_air_filtering_media_doc, div#purchase_invoices_air_filtering_doc, div#technical_cutsheet_air_filtering_doc, div#fresh_air_system_floor_plan_doc, div#geotagged_photograph_indoor_tech_doc";
                        break;
                    case "germicidal_uv_lamps":
                        contentDivs = "#div_narrative_germicidal, #div_purchase_invoices_germicidal, #div_technical_cutsheet_germicidal, #div_fresh_air_system_germicidal, #div_geotagged_photograph_germicidal,div#narrative_germicidal_doc, div#purchase_invoices_germicidal_doc, div#technical_cutsheet_germicidal_doc, div#fresh_air_system_germicidal_doc, div#geotagged_photograph_germicidal_doc";
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
            updateVisibility();
        });
    }); 
}




if (subtab == "low_emitting_materials") {
    $(document).ready(function () { 

        // This is safe to run on page load and on change because it never deletes or resets data.
        function updateVisibility() {
            // --- Paints & Coatings ---
            if ($("input[name='paints_coatings']").is(":checked")) {
                $("#div_narrative_coatings, #div_list_voc, #div_manufacturer_cutsheet_brochures,#div_purchase_invoices_voc").show();
            } else {
                $("#div_narrative_coatings, #div_list_voc, #div_manufacturer_cutsheet_brochures,#div_purchase_invoices_voc").hide();
                $("div#narrative_coatings_doc, div#list_voc_doc, div#manufacturer_cutsheet_brochures_doc, div#purchase_invoices_voc_doc").hide();
            }

            // --- Adhesives VOC ---
            if ($("input[name='adhesives_voc']").is(":checked")) {
                $("#div_adh_narrative, #div_adhesives_sealants_model, #div_cutssheet_brochures, #div_purchase_invoices_adhesives").show();
            } else {
                $("#div_adh_narrative, #div_adhesives_sealants_model, #div_cutssheet_brochures, #div_purchase_invoices_adhesives").hide();
                $("div#adh_narrative_doc, div#adhesives_sealants_model_doc, div#cutssheet_brochures_doc, div#purchase_invoices_adhesives_doc").hide();
            }

            // --- Carpets ---
            if ($("input[name='carpets']").is(":checked")) {
                $("#div_area_cri,#div_area_cri_applicable, #div_narrative_carpets, #div_highlighting_carpets, #div_percentage_area_carpets, #div_cri_certificate, #div_purchase_invoices_carpets,#div_time_stamped").show();
            } else {
                $("#div_area_cri,#div_area_cri_applicable, #div_narrative_carpets, #div_highlighting_carpets, #div_percentage_area_carpets, #div_cri_certificate,#div_purchase_invoices_carpets,#div_time_stamped").hide();
                $("div#area_cri_doc, div#narrative_carpets_doc, div#highlighting_carpets_doc, div#percentage_area_carpets_doc, div#cri_certificate_doc, div#purchase_invoices_carpets_doc, div#time_stamped_doc").hide();
            }

            // --- Composite Wood ---
            if ($("input[name='composite_wood']").is(":checked")) {
                $("#div_narrative_wood, #div_list_composite_wood, #div_cutsheet_test_report, #div_purchase_invoices_wood").show();
            } else {
                $("#div_narrative_wood, #div_list_composite_wood, #div_cutsheet_test_report, #div_purchase_invoices_wood").hide();
                $("div#narrative_wood_doc, div#list_composite_wood_doc, div#cutsheet_test_report_doc, div#purchase_invoices_wood_doc").hide();
            }

            // --- New Wood Furniture ---
            if ($("input[name='new_wood_furniture']").is(":checked")) {
                $("#div_narrative_furniture, #div_list_of_new_wood_furniture_used, #div_manufacturer_cutsheet_test_reports, #div_purchase_invoices,#div_geotagged_and_timestamped_photograph").show();
            } else {
                $("#div_narrative_furniture, #div_list_of_new_wood_furniture_used, #div_manufacturer_cutsheet_test_reports, #div_purchase_invoices,#div_geotagged_and_timestamped_photograph").hide();
                $("div#narrative_furniture_doc, div#list_of_new_wood_furniture_used_doc, div#manufacturer_cutsheet_test_reports_doc, div#purchase_invoices_doc, div#geotagged_and_timestamped_photograph_doc").hide();
            }
        }
        updateVisibility();

        $(
            "input[name='paints_coatings'], input[name='adhesives_voc'], input[name='carpets'], input[name='composite_wood'], input[name='new_wood_furniture']"
        ).change(function () {
            
            const checkboxName = $(this).attr("name");

            // Check if the box that triggered this change is now UNCHECKED.
            if (!$(this).is(":checked")) {
                
                // Determine which set of fields to clear based on the checkbox name.
                let contentDivs;
                switch (checkboxName) {
                    case "paints_coatings":
                        contentDivs = "#div_narrative_coatings, #div_list_voc, #div_manufacturer_cutsheet_brochures,#div_purchase_invoices_voc,div#narrative_coatings_doc, div#list_voc_doc, div#manufacturer_cutsheet_brochures_doc, div#purchase_invoices_voc_doc";
                        break;
                    case "adhesives_voc":
                        contentDivs = "#div_adh_narrative, #div_adhesives_sealants_model, #div_cutssheet_brochures, #div_purchase_invoices_adhesives,div#adh_narrative_doc, div#adhesives_sealants_model_doc, div#cutssheet_brochures_doc, div#purchase_invoices_adhesives_doc";
                        break;
                    case "carpets":
                        contentDivs = "#div_area_cri, #div_area_cri_applicable, #div_narrative_carpets, #div_highlighting_carpets, #div_percentage_area_carpets, #div_cri_certificate,#div_purchase_invoices_carpets,#div_time_stamped,div#area_cri_doc, div#narrative_carpets_doc, div#highlighting_carpets_doc, div#percentage_area_carpets_doc, div#cri_certificate_doc, div#purchase_invoices_carpets_doc, div#time_stamped_doc";
                        break;
                    case "composite_wood":
                        contentDivs = "#div_narrative_wood, #div_list_composite_wood, #div_cutsheet_test_report, #div_purchase_invoices_wood,div#narrative_wood_doc, div#list_composite_wood_doc, div#cutsheet_test_report_doc, div#purchase_invoices_wood_doc";
                        break;
                    case "new_wood_furniture":
                        contentDivs = "#div_narrative_furniture, #div_list_of_new_wood_furniture_used, #div_manufacturer_cutsheet_test_reports, #div_purchase_invoices,#div_geotagged_and_timestamped_photograph,div#narrative_furniture_doc, div#list_of_new_wood_furniture_used_doc, div#manufacturer_cutsheet_test_reports_doc, div#purchase_invoices_doc, div#geotagged_and_timestamped_photograph_doc";
                        break;
                }

                // Clear the content fields within the section only if the user unchecked it
                if (contentDivs) {
                    $(contentDivs)
                        .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                        .not("input[type=file]")
                        .prop("checked", false).val("");

                        $(contentDivs)
                        .find("input[type='file']")
                        .each(function () {
                            var $input = $(this);
                            $input.replaceWith($input.val('').clone(true));
                        });
                }
            }
            updateVisibility();
        });
    }); 
}


if (subtab == "on_site_renewable_energy") {
  toggleonsite($("#select_approach_credit_onsite").val(), false);

  $("#select_approach_credit_onsite").change(function () {
    toggleonsite($(this).val(), true);
  });
}
function toggleonsite(value, clearHidden = true) {
  if (value === "Owner Occupied") {
    $(
      "#div_generation_onsite_solar,#div_total_energy_building,#div_percentage_energy_catered"
    ).show();
    $(
      "#div_generation_onsite_solar_annex,#div_lighting_energy_building,#div_catered_lighting_energy"
    ).hide();
  } else if (value === "Tenant Occupied") {
    $(
      "#div_generation_onsite_solar_annex,#div_lighting_energy_building,#div_catered_lighting_energy"
    ).show();
    $(
      "#div_generation_onsite_solar,#div_total_energy_building,#div_percentage_energy_catered"
    ).hide();
  } else {
    $(
      "#div_generation_onsite_solar_annex,#div_lighting_energy_building,#div_catered_lighting_energy,#div_generation_onsite_solar,#div_total_energy_building,#div_percentage_energy_catered"
    ).hide();
  }
}

if (subtab == "off_site_renewable_energy") {
  toggleoffsite($("#select_approac_off_site").val(), false);

  $("#select_approac_off_site").change(function () {
    toggleoffsite($(this).val(), true);
  });
}
function toggleoffsite(value, clearHidden = true) {
  if (value === "Owner Occupied") {
    $(
      "#div_generation_offsite_solar,#div_total_energy_offsite,#div_percentage_energy_offsite"
    ).show();
    $(
      "#div_generation_offsite,#div_lighting_energy_offsite,#div_catered_lighting_offsite"
    ).hide();
  } else if (value === "Tenant Occupied") {
    $(
      "#div_generation_offsite,#div_lighting_energy_offsite,#div_catered_lighting_offsite"
    ).show();
    $(
      "#div_generation_offsite_solar,#div_total_energy_offsite,#div_percentage_energy_offsite"
    ).hide();
  } else {
    $(
      "#div_generation_offsite_solar,#div_total_energy_offsite,#div_percentage_energy_offsite,#div_generation_offsite,#div_lighting_energy_offsite,#div_catered_lighting_offsite"
    ).hide();
  }
}


if (subtab == "energy_metering_management") {
    $(document).ready(function () { 

        // This is safe to run on page load and on change because it never deletes or resets data.
        function updateVisibility() {
            // --- Paints & Coatings ---
            if ($("input[name='new_energy_metering']").is(":checked")) {
                $("#div_annex_narrative_offsite1,#div_annex_singleline_diagram,#div_annex_geotagged_photo1").show();
            } else {
                $("#div_annex_narrative_offsite1,#div_annex_singleline_diagram,#div_annex_geotagged_photo1").hide();
                $("div#annex_narrative_offsite1_doc, div#annex_singleline_diagram_doc,div#annex_geotagged_photo1_doc").hide();
            }

            // --- Adhesives VOC ---
            if ($("input[name='new_building_managment']").is(":checked")) {
                $("#div_annex_narrative_offsite2,#div_annex_declaration_letter,#div_project_owner_provide_total, #div_annex_geotagged_photo2").show();
            } else {
                $("#div_annex_narrative_offsite2,#div_annex_declaration_letter,#div_project_owner_provide_total, #div_annex_geotagged_photo2").hide();
                $("div#annex_narrative_offsite2_doc, div#annex_declaration_letter_doc,div#project_owner_provide_total_doc, div#annex_geotagged_photo2_doc").hide();
            }

        }
        updateVisibility();

        $(
            "input[name='new_energy_metering'], input[name='new_building_managment']").change(function () {
            
            const checkboxName = $(this).attr("name");

            // Check if the box that triggered this change is now UNCHECKED.
            if (!$(this).is(":checked")) {
                
                // Determine which set of fields to clear based on the checkbox name.
                let contentDivs;
                switch (checkboxName) {
                    case "new_energy_metering":
                        contentDivs = "#div_annex_narrative_offsite1,#div_annex_singleline_diagram,#div_annex_geotagged_photo1,div#annex_narrative_offsite1_doc, div#annex_singleline_diagram_doc,div#annex_geotagged_photo1_doc";
                        break;
                    case "new_building_managment":
                        contentDivs = "#div_annex_narrative_offsite2,#div_annex_declaration_letter,#div_project_owner_provide_total, #div_annex_geotagged_photo2,div#annex_narrative_offsite2_doc, div#annex_declaration_letter_doc,div#project_owner_provide_total_doc, div#annex_geotagged_photo2_doc";
                        break;
                }

                // Clear the content fields within the section only if the user unchecked it
                if (contentDivs) {
                    $(contentDivs)
                        .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                        .not("input[type=file]")
                        .prop("checked", false).val("");

                        $(contentDivs)
                        .find("input[type='file']")
                        .each(function () {
                            var $input = $(this);
                            $input.replaceWith($input.val('').clone(true));
                        });
                }
            }
            updateVisibility();
        });
    }); 
}


// function toggleMetering(value, clearHidden = true) {
//     const group1_show = "#div_annex_narrative_offsite1,#div_annex_singleline_diagram,#div_annex_geotagged_photo1";
//     const group1_docs = "div#annex_narrative_offsite1_doc, div#annex_singleline_diagram_doc,div#annex_geotagged_photo1_doc";
    
//     const group2_show = "#div_annex_narrative_offsite2,#div_annex_declaration_letter,#div_project_owner_provide_total, #div_annex_geotagged_photo2";
//     const group2_docs = "div#annex_narrative_offsite2_doc, div#annex_declaration_letter_doc,div#project_owner_provide_total_doc, div#annex_geotagged_photo2_doc";

//     // --- Energy Metering Selected ---
//     if (value === "Energy Metering") {
//         $(group1_show).show();
//         $(group2_show).hide();
//         $(group2_docs).hide();

//         if (clearHidden) {
//             $(group2_show)
//                 .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//                 .not("input[type=file]") // Prevent clearing uploaded file paths
//                 .prop("checked", false)
//                 .val("");

//             $(group2_docs)
//                 .find("input[type='file']")
//                 .each(function () {
//                     var $input = $(this);
//                     $input.replaceWith($input.val('').clone(true));
//                 });
//         }

//     // --- Building Management System Selected ---
//     } else if (value === "Building Management System") {
//         $(group2_show).show();
//         $(group1_show).hide();
//         $(group1_docs).hide();

//         if (clearHidden) {
//             $(group1_show)
//                 .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//                 .not("input[type=file]") // Prevent clearing uploaded file paths
//                 .prop("checked", false)
//                 .val("");

//             $(group1_docs)
//                 .find("input[type='file']")
//                 .each(function () {
//                     var $input = $(this);
//                     $input.replaceWith($input.val('').clone(true));
//                 });
//         }
    
//     } else {
//         $(group1_show + "," + group2_show).hide();
//         $(group1_docs + "," + group2_docs).hide();

//         if (clearHidden) {
//             $(group1_show + "," + group2_show)
//                 .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
//                 .not("input[type=file]")
//                 .prop("checked", false)
//                 .val("");

//             $(group1_docs + "," + group2_docs)
//                 .find("input[type='file']")
//                 .each(function () {
//                     var $input = $(this);
//                     $input.replaceWith($input.val('').clone(true));
//                 });
//         }
//     }
// }
// if (subtab == "energy_metering_management") {
//     $(document).ready(function () {
//         toggleMetering($("#select_approach_metering").val(), false);
//         $("#select_approach_metering").change(function () {
//             toggleMetering($(this).val(), true);
//         });
//     });
// }


if (subtab == "waste_water_reuse_construction") {

    // Wrap in $(document).ready() for reliable execution
    $(document).ready(function () {

        // --- STEP 1: Visibility Function (Safe to run anytime) ---
        function updateVisibility() {
            // --- Admixtures/Curing Compounds ---
            if ($("input[name='admixtures_curing_compounds']").is(":checked")) {
                $(
                    "#div_narrative_water, #div_cal_reduction_water, #div_annex_mix_design_report1,#div_annex_purchase_invoice2,#div_annex_manufacturer_cutsheet3,#div_annex_declaration4"
                ).show();
            } else {
                $(
                    "#div_narrative_water, #div_cal_reduction_water, #div_annex_mix_design_report1,#div_annex_purchase_invoice2,#div_annex_manufacturer_cutsheet3,#div_annex_declaration4"
                ).hide();
                $(
                    "div#narrative_water_doc, div#cal_reduction_water_doc, div#annex_mix_design_report1_doc, div#purchase_invoice2_doc,div#annex_manufacturer_cutsheet3_doc, div#manufacturer_cutsheet3_doc, div#declaration4_doc"
                ).hide();
            }

            // --- Treated Water Use ---
            if ($("input[name='admixtures_curing_treated']").is(":checked")) {
                $(
                    "#div_narrative_water2,#div_annex_calculations_potable5, #div_annex_treated_water6, #div_annex_single_line_diagram7, #div_annex_purchase_invoice_gatepass8,#div_annex_declaration9"
                ).show();
            } else {
                $(
                    "#div_narrative_water2,#div_annex_calculations_potable5, #div_annex_treated_water6, #div_annex_single_line_diagram7, #div_annex_purchase_invoice_gatepass8,#div_annex_declaration9"
                ).hide();
                $(
                    "div#narrative_water2_doc,div#annex_calculations_potable5_doc, div#annex_treated_water6_doc, div#annex_single_line_diagram7_doc, div#annex_purchase_invoice_gatepass8_doc, div#annex_declaration9_doc"
                ).hide();
            }
        }

        // --- STEP 2: Call the safe visibility function ONCE on page load ---
        // FIX for the initial save problem: This ensures saved data remains checked/filled.
        updateVisibility();

        // --- STEP 3: Change Handler (Only clears data when a box is UNCHECKED) ---
        $(
            "input[name='admixtures_curing_compounds'], input[name='admixtures_curing_treated']"
        ).change(function () {
            
            // If the box that triggered this change is now UNCHECKED, clear its related fields.
            if (!$(this).is(":checked")) {
                
                let contentDivs;
                
                // Determine which set of fields to clear
                if ($(this).attr("name") === 'admixtures_curing_compounds') {
                    contentDivs = "#div_narrative_water, #div_cal_reduction_water, #div_annex_mix_design_report1,#div_annex_purchase_invoice2,#div_annex_manufacturer_cutsheet3,#div_annex_declaration4";
                } else if ($(this).attr("name") === 'admixtures_curing_treated') {
                    contentDivs = "#div_narrative_water2,#div_annex_calculations_potable5, #div_annex_treated_water6, #div_annex_single_line_diagram7, #div_annex_purchase_invoice_gatepass8,#div_annex_declaration9";
                }

                // Clear the content fields within the hidden section
                if (contentDivs) {
                    $(contentDivs)
                        .find("input[type=checkbox], input[type=radio], input[type=text], textarea")
                        .not("input[type=file]") // Important: Do not clear file inputs unless necessary
                        .prop("checked", false).val("");
                }
            }

            // After clearing, update the view based on the current state.
            updateVisibility();
        });
    }); 
}


// if (subtab == "minimum_energy_enhanced") {
//   toggledaylights($("#select_approach_credit").val(), false); 
//   $("#select_approach_credit").change(function () {
//     toggledaylights($(this).val(), true); 
//   });
// }
// function toggledaylights(value, clearData) { 
//   if (value === "Case A: Performance Based Approach ") {
//     $("#div_energy_savings_percentage").show();
//     $(
//       "#div_narrative_energy,#div_energy_report, #div_hvac_cut_sheets, #div_lpd_calculations, #div_lighting_layouts, #div_hvac_layouts,#div_energy_calculations,#div_wall_roof_drawings,#div_simulation_reports,#div_tenant_agreement_energy,#div_purchase_invoices_energy,#div_geo_photograph_energy"
//     ).show();
    
//   } else if (value === "Case B: Prescriptive Based Approach") {
//     $("#div_energy_savings_percentage").hide();
//     $(
//       "#div_narrative_energy,#div_energy_report, #div_hvac_cut_sheets, #div_lpd_calculations, #div_lighting_layouts, #div_hvac_layouts,#div_energy_calculations,#div_wall_roof_drawings,#div_simulation_reports,#div_tenant_agreement_energy,#div_purchase_invoices_energy,#div_geo_photograph_energy"
//     ).show();
    
//   } else  {
//      if(clearData){
//        $(
//       "#div_energy_savings_percentage,#div_narrative_energy,#div_energy_report, #div_hvac_cut_sheets, #div_lpd_calculations, #div_lighting_layouts, #div_hvac_layouts,#div_energy_calculations,#div_wall_roof_drawings,#div_simulation_reports,#div_tenant_agreement_energy,#div_purchase_invoices_energy,#div_geo_photograph_energy"
//     ).hide();
//     $("div#energy_savings_percentage_doc,div#narrative_energy_doc,div#energy_report_doc,div#hvac_cut_sheets_doc,div#lpd_calculations_doc,div#lighting_layouts_doc,div#hvac_layouts_doc,div#energy_calculations_doc,div#wall_roof_drawings_doc,div#simulation_reports_doc,div#tenant_agreement_energy_doc,div#purchase_invoices_energy_doc,div#geo_photograph_energy_doc").hide();

//      }
//     $(
//       "#div_energy_savings_percentage,#div_narrative_energy,#div_energy_report, #div_hvac_cut_sheets, #div_lpd_calculations, #div_lighting_layouts, #div_hvac_layouts,#div_energy_calculations,#div_wall_roof_drawings,#div_simulation_reports,#div_tenant_agreement_energy,#div_purchase_invoices_energy,#div_geo_photograph_energy"
//     ).hide();
//     $("div#energy_savings_percentage_doc,div#narrative_energy_doc,div#energy_report_doc,div#hvac_cut_sheets_doc,div#lpd_calculations_doc,div#lighting_layouts_doc,div#hvac_layouts_doc,div#energy_calculations_doc,div#wall_roof_drawings_doc,div#simulation_reports_doc,div#tenant_agreement_energy_doc,div#purchase_invoices_energy_doc,div#geo_photograph_energy_doc").hide();


// }
// }


if (subtab == "minimum_energy_enhanced") {
    toggledaylights($("#select_approach_credit_2").val(), false); 
    
    $("#select_approach_credit_2").change(function () {
        toggledaylights($(this).val(), true); 
    });
}

function toggledaylights(value, clearData) { 
    const commonFieldsSelector = "#div_narrative_energy, #div_energy_report, #div_hvac_cut_sheets, #div_lpd_calculations, #div_lighting_layouts, #div_hvac_layouts,#div_energy_calculations,#div_wall_roof_drawings,#div_simulation_reports,#div_tenant_agreement_energy, #div_declaration_letter_energy, #div_purchase_invoices_energy,#div_geo_photograph_energy";
    
    const uniqueFieldSelector = "#div_energy_savings_percentage";
    const optionb = "#div_narrative_energy_caseb, #div_suppotive_energy_caseb";
    const optionbdocuments = "div#narrative_energy_caseb_doc, div#suppotive_energy_caseb_doc";

    const docFieldsSelector = "div#energy_savings_percentage_doc,div#narrative_energy_doc,div#energy_report_doc,div#hvac_cut_sheets_doc,div#lpd_calculations_doc,div#lighting_layouts_doc,div#hvac_layouts_doc,div#energy_calculations_doc,div#wall_roof_drawings_doc,div#simulation_reports_doc,div#tenant_agreement_energy_doc,div#purchase_invoices_energy_doc,div#geo_photograph_energy_doc";
    
    const allDataFieldsSelector = uniqueFieldSelector + ", " + commonFieldsSelector;
    const alldataofoptionb = optionb + ", " + optionbdocuments;

    if (value === "Case A: Performance Based Approach") {
        $(allDataFieldsSelector).show();
        $(alldataofoptionb).hide();
        $(optionbdocuments).hide();
    } else if (value === "Case B: Prescriptive Based Approach") {
        $(allDataFieldsSelector).hide(); 
        $(docFieldsSelector).hide(); 
        $(optionb).show(); 
    } else { 
      
        $(allDataFieldsSelector).hide();
        $(docFieldsSelector).hide();
        $(alldataofoptionb).hide();
        $(optionbdocuments).hide();

        // 2. Only clear all data if triggered by a change (not initial load)
        if (clearData) {
             $(allDataFieldsSelector, alldataofoptionb)
                .find("input, select, textarea")
                .not("input[type=file]")
                .prop("checked", false)
                .val("");

            $(docFieldsSelector,optionbdocuments)
                .find("input[type='file']")
                .each(function () {
                    var $input = $(this);
                    $input.replaceWith($input.val('').clone(true));
                });
        }
    }
}




if (subtab == "innovation_one") {
    $(document).ready(function () { 
        function updateVisibility() {

            // --- Entryway Systems ---
            if ($("input[name='innova_one']").is(":checked")) {
                $("#div_narrative_invovation_one, #div_supporting_documents_innovation_one, #div_photos_innovation_one").show();
            } else {
                $("#div_narrative_invovation_one, #div_supporting_documents_innovation_one, #div_photos_innovation_one").hide();
                $("div#narrative_invovation_one_doc, div#supporting_documents_innovation_one_doc, div#photos_innovation_one_doc").hide();
            }

            // --- Printer Rooms ---
            if ($("input[name='perfor_ex']").is(":checked")) {
                $("#div_new_build_credit_one").show();
            } else {
                $("#div_new_build_credit_one, div#new_build_credit_one_doc").hide();
            }

        }

        updateVisibility();

        $(
            "input[name='innova_one'], input[name='perfor_ex']"
        ).change(function () {
            
            if (!$(this).is(":checked")) {
                
                let contentDivs;
                switch ($(this).attr("name")) {
                    case "innova_one":
                        contentDivs = "#div_narrative_invovation_one, #div_supporting_documents_innovation_one, #div_photos_innovation_one,div#narrative_invovation_one_doc, div#supporting_documents_innovation_one_doc, div#photos_innovation_one_doc";
                        break;
                    case "perfor_ex":
                        contentDivs = "#div_new_build_credit_one, div#new_build_credit_one_doc";
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
            updateVisibility();
        });
    }); 
}













if (subtab == "innovation_one") {
    $(document).ready(function () { 
        function updateVisibility() {

            // --- Entryway Systems ---
            if ($("input[name='innova_one']").is(":checked")) {
                $("#div_narrative_invovation_one, #div_supporting_documents_innovation_one, #div_photos_innovation_one").show();
            } else {
                $("#div_narrative_invovation_one, #div_supporting_documents_innovation_one, #div_photos_innovation_one").hide();
                $("div#narrative_invovation_one_doc, div#supporting_documents_innovation_one_doc, div#photos_innovation_one_doc").hide();
            }

            // --- Printer Rooms ---
            if ($("input[name='perfor_ex']").is(":checked")) {
                $("#div_new_build_credit_one").show();
            } else {
                $("#div_new_build_credit_one, div#new_build_credit_one_doc").hide();
            }

        }

        updateVisibility();

        $(
            "input[name='innova_one'], input[name='perfor_ex']"
        ).change(function () {
            
            if (!$(this).is(":checked")) {
                
                let contentDivs;
                switch ($(this).attr("name")) {
                    case "innova_one":
                        contentDivs = "#div_narrative_invovation_one, #div_supporting_documents_innovation_one, #div_photos_innovation_one,div#narrative_invovation_one_doc, div#supporting_documents_innovation_one_doc, div#photos_innovation_one_doc";
                        break;
                    case "perfor_ex":
                        contentDivs = "#div_new_build_credit_one, div#new_build_credit_one_doc";
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
            updateVisibility();
        });
    }); 
}


if (subtab == "innovation_two") {
    $(document).ready(function () { 
        function updateVisibility() {

            if ($("input[name='innova_two']").is(":checked")) {
                $("#div_narrative_invovation_two, #div_supporting_documents_innovation_two, #div_photos_innovation_two").show();
            } else {
                $("#div_narrative_invovation_two, #div_supporting_documents_innovation_two, #div_photos_innovation_two").hide();
                $("div#narrative_invovation_two_doc, div#supporting_documents_innovation_two_doc, div#photos_innovation_two_doc").hide();
            }

            if ($("input[name='perfor_ex_two']").is(":checked")) {
                $("#div_new_build_innovation_two").show();
            } else {
                $("#div_new_build_innovation_two").hide();
            }

        }

        updateVisibility();

        $("input[name='innova_two'], input[name='perfor_ex_two']" ).change(function () {
            
            if (!$(this).is(":checked")) {
                
                let contentDivs;
                switch ($(this).attr("name")) {
                    case "innova_two":
                        contentDivs = "#div_narrative_invovation_two, #div_supporting_documents_innovation_two, #div_photos_innovation_two, div#narrative_invovation_two_doc, div#supporting_documents_innovation_two_doc, div#photos_innovation_two_doc";
                        break;
                    case "perfor_ex_two":
                        contentDivs = "#div_new_build_innovation_two, div#new_build_innovation_two_doc";
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
            updateVisibility();
        });
    }); 
}


if (subtab == "innovation_three") {
    $(document).ready(function () { 
        function updateVisibility() {

            if ($("input[name='innova_three']").is(":checked")) {
                $("#div_narrative_invovation_three, #div_supporting_documents_innovation_three, #div_photos_innovation_three").show();
            } else {
                $("#div_narrative_invovation_three, #div_supporting_documents_innovation_three, #div_photos_innovation_three").hide();
                $("div#narrative_invovation_three_doc, div#supporting_documents_innovation_three_doc, div#photos_innovation_three_doc").hide();
            }

            if ($("input[name='perfor_ex_three']").is(":checked")) {
                $("#div_new_build_innovation_three").show();
            } else {
                $("#div_new_build_innovation_three").hide();
            }

        }

        updateVisibility();

        $("input[name='innova_three'], input[name='perfor_ex_three']" ).change(function () {
            
            if (!$(this).is(":checked")) {
                
                let contentDivs;
                switch ($(this).attr("name")) {
                    case "innova_three":
                        contentDivs = "#div_narrative_invovation_three, #div_supporting_documents_innovation_three, #div_photos_innovation_three,div#narrative_invovation_three_doc, div#supporting_documents_innovation_three_doc, div#photos_innovation_three_doc";
                        break;
                    case "perfor_ex_three":
                        contentDivs = "#div_new_build_innovation_three";
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
            updateVisibility();
        });
    }); 
}

if (subtab == "innovation_four") {
    $(document).ready(function () { 
        function updateVisibility() {

            if ($("input[name='innova_four']").is(":checked")) {
                $("#div_narrative_invovation_four, #div_supporting_documents_innovation_four, #div_photos_innovation_four").show();
            } else {
                $("#div_narrative_invovation_four, #div_supporting_documents_innovation_four, #div_photos_innovation_four").hide();
                $("div#narrative_invovation_four_doc, div#supporting_documents_innovation_four_doc, div#photos_innovation_four_doc").hide();
            }

            if ($("input[name='perfor_ex_four']").is(":checked")) {
                $("#div_new_build_innovation_four").show();
            } else {
                $("#div_new_build_innovation_four").hide();
            }

        }

        updateVisibility();

        $("input[name='innova_four'], input[name='perfor_ex_four']" ).change(function () {
            
            if (!$(this).is(":checked")) {
                
                let contentDivs;
                switch ($(this).attr("name")) {
                    case "innova_four":
                        contentDivs = "#div_narrative_invovation_four, #div_supporting_documents_innovation_four, #div_photos_innovation_four,div#narrative_invovation_four_doc, div#supporting_documents_innovation_four_doc, div#photos_innovation_four_doc";
                        break;
                    case "perfor_ex_four":
                        contentDivs = "#div_new_build_innovation_four";
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
            updateVisibility();
        });
    }); 
}