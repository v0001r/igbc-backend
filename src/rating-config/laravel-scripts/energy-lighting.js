// $("#div_saving_percentage_space_method").hide();
// $("#div_saving_percentage_building_method").hide();
// $("#div_capacity_on_site_renewable_on_site").hide();
// $("#div_total_energy_consumption_project").hide();
// $("#div_capacity_on_site_renewable").hide();
// $("#div_capacity_percetage").hide();
// $("#div_capacity_percetage_on_site").show();
// $("#div_total_energy_consumption_project_off_site").hide();

$("#case_for_energy_efficent_lighting").on("change", function () {
  let val = $(this).val().toString().trim().toLowerCase();
  if (val === "space area method") {
    $("#div_saving_percentage_space_method").show();
    $("#div_saving_percentage_building_method").hide();
  }

  if (val === "building area method") {
    $("#div_saving_percentage_building_method").show();
    $("#div_saving_percentage_space_method").hide();
  }
});

function case_option() {
  let case_opt = $("#case_for_energy_efficent_lighting").val();

  if (case_opt === "space area method") {
    $("#div_saving_percentage_space_method").show();
    $("#div_saving_percentage_building_method").hide();
  }

  if (case_opt === "building area method") {
    $("#div_saving_percentage_building_method").show();
    $("#div_saving_percentage_space_method").hide();
  }
}
//on site renewable energy

// $("#case_for_renewable_energy").on("change", function () {
//   let val = $(this).val().toString().trim().toLowerCase();
//   if (val === "on-site renewable") {
//     $("#div_capacity_on_site_renewable_on_site").show();
//     $("#div_total_energy_consumption_project").show();
//     $("#div_capacity_on_site_renewable").hide();
//     $("#div_capacity_percetage").hide();
//     $("#div_capacity_percetage_on_site").show();
//     $("#div_total_energy_consumption_project_off_site").show();
//     $("#div_total_energy_consumption_project_off_site").hide();

//     // $("#capacity_on_site_renewable_on_site").val('');
//     $("#total_energy_consumption_project").val('');
    
//   }

//   if (val === "off-site renewable") {
//     $("#div_capacity_on_site_renewable_on_site").hide();
//     $("#div_total_energy_consumption_project").hide();
//     $("#div_capacity_on_site_renewable").show();
//     $("#div_capacity_percetage").show();
//     $("#div_capacity_percetage_on_site").hide();
//         $("#div_total_energy_consumption_project_off_site").hide();

//     $("#div_total_energy_consumption_project_off_site").show();

//     // $("#capacity_on_site_renewable").val('');
//     $("#total_energy_consumption_project_off_site").val('');
//   }
// });

// $(document).ready(function () {
//   case_option();

//   let caseVal = $("#case_for_renewable_energy").val().toString().trim().toLowerCase();

//   // alert(caseVal);

//   if (caseVal === "on-site renewable") {
//     $("#div_capacity_on_site_renewable_on_site").show();
//     $("#div_total_energy_consumption_project").show();
//     $("#div_capacity_on_site_renewable").hide();
//     $("#div_capacity_percetage").hide();
//     $("#div_capacity_percetage_on_site").show();
//     $("#div_total_energy_consumption_project_off_site").hide();
//   }

//   if (caseVal === "off-site renewable") {
//     $("#div_capacity_on_site_renewable_on_site").hide();
//     $("#div_total_energy_consumption_project").hide();
//     $("#div_capacity_on_site_renewable").show();
//     $("#div_capacity_percetage").show();
//     $("#div_capacity_percetage_on_site").hide();
//     $("#div_total_energy_consumption_project_off_site").show();
//   }
// });

// $(document).ready(function () {
//   let caseVal = $("#case_for_renewable_energy").val().toString().trim().toLowerCase();;

//   if (caseVal === "on-site renewable") {
//     $("#div_capacity_on_site_renewable_on_site").show();
//     $("#div_total_energy_consumption_project").show();
//     $("#div_capacity_on_site_renewable").hide();
//     $("#div_capacity_percetage").hide();
//     $("#div_capacity_percetage_on_site").show();
//     $("#div_total_energy_consumption_project_off_site").hide();
//   }

//   if (caseVal === "off-site renewable") {
//     $("#div_capacity_on_site_renewable_on_site").hide();
//     $("#div_total_energy_consumption_project").hide();
//     $("#div_capacity_on_site_renewable").show();
//     $("#div_capacity_percetage").show();
//     $("#div_capacity_percetage_on_site").hide();
//     $("#div_total_energy_consumption_project_off_site").show();
//   }
// });

if (subtab == 'energy_efficent_lighting') {
    $(function () {
        function energySustainabilityConcept() {
            const lightingChecked = $("input[name='lighting_power_density']").is(":checked");
            const sensorsChecked = $("input[name='Sensors']").is(":checked");
            const selectedOption = $("select[name='case_for_energy_efficent_lighting']").val();

            // --- Lighting Power Density ---
            if (lightingChecked) {
                // Hide both first, then show based on selection
                $("#div_saving_percentage_space_method_lpd, #div_saving_percentage_building_method_lpd").hide();

                if (lpdspace == 'LPD Space Function Method') {
                    $("#div_saving_percentage_space_method_lpd").show();
                } else if (lpdspace == 'LPD Building Area Method') {
                    $("#div_saving_percentage_building_method_lpd").show();
                }

                $("#div_case_for_energy_efficent_lighting, #div_narrative_energy_efficency_method, #div_lighting_fixtures_installed, #div_lighting_layout_wattage, #div_purchase_invoices_lighting_fixtures, #div_technical_specification_manufacture, #div_geo_photographs_lighting_fixtures").show();
                $("div#case_for_energy_efficent_lighting_sensors_doc, div#cnarrative_energy_efficency_lighting_doc, div#indicating_wattage_lighting_fixtures_doc, div#technical_specification_sensors_doc, div#tagged_photographs_sensors_doc, div#purchase_invoices_lighting_quantity_doc").hide();
            } else {
                $("#div_case_for_energy_efficent_lighting, #div_saving_percentage_space_method_lpd, #div_saving_percentage_building_method_lpd, #div_narrative_energy_efficency_method, #div_lighting_fixtures_installed, #div_lighting_layout_wattage, #div_purchase_invoices_lighting_fixtures, #div_technical_specification_manufacture, #div_geo_photographs_lighting_fixtures").hide();
            }

            // --- Sensors ---
            if (sensorsChecked) {
                $("#div_saving_percentage_building_method, #div_sensors_installed_non_regularly_occupied_spaces, #div_passive_measures_pipes, #div_saving_percentage_space_method, #div_case_for_energy_efficent_lighting_sensors, #div_narrative_energy_efficency_lighting, #div_indicating_wattage_lighting_fixtures, #div_technical_specification_sensors, #div_tagged_photographs_sensors, #div_purchase_invoices_lighting_quantity").show();
                $("div#case_for_energy_efficent_lighting_doc, div#narrative_energy_efficency_method_doc, div#lighting_fixtures_installed_doc, div#lighting_layout_wattage_doc, div#purchase_invoices_lighting_fixtures_doc, div#technical_specification_manufacture_doc, div#geo_photographs_lighting_fixtures_doc").hide();
            } else {
                $("#div_saving_percentage_building_method, #div_sensors_installed_non_regularly_occupied_spaces, #div_passive_measures_pipes, #div_saving_percentage_space_method, #div_case_for_energy_efficent_lighting_sensors, #div_narrative_energy_efficency_lighting, #div_indicating_wattage_lighting_fixtures, #div_technical_specification_sensors, #div_tagged_photographs_sensors, #div_purchase_invoices_lighting_quantity").hide();
            }
        }

        // Run on load
        energySustainabilityConcept();

        // Bind to checkbox + select changes
        $(document).on("change", "input[name='lighting_power_density'], input[name='Sensors'], select[name='case_for_energy_efficent_lighting']", energySustainabilityConcept);
    });
}

if (subtab == 'efficent_space_conditioning') {
    $(function () {
        function toggleNonAirFields() {
            const nonAirChecked = $("input[name='non_air_conditioned_spaces']").is(":checked");
            const conditionedChecked = $("input[name='conditioned_spaces']").is(":checked");
            const caseValue = $("#case_for_energy_efficent_lighting").val();

            // --- Non-Air Conditioned ---
            if (nonAirChecked) {
                $("#div_case_for_energy_efficent_lighting").show();

                if (caseValue == "Door & window openings") {
                    $("#div_narrative_non_air, #div_area_percentage_credit, #div_floor_plan_window_schedule, #div_interior_project_temperature_humidity, #div_existing_interior_project_temperature_humidity, #div_geotagged_photographs_videos").show();
                    $("#div_elaborating_work_passive, #div_technical_specification_installed,#div_geotagged_specification_installed").hide();
                } 
                else if (caseValue == "Alternate efficient cooling methods") {
                    $("#div_elaborating_work_passive, #div_technical_specification_installed, #div_geotagged_specification_installed").show();
                    $("#div_narrative_non_air, #div_area_percentage_credit, #div_floor_plan_window_schedule, #div_interior_project_temperature_humidity, #div_existing_interior_project_temperature_humidity, #div_geotagged_photographs_videos").hide();
                } 
                else {
                    // Dropdown empty
                    $("#div_narrative_non_air, #div_area_percentage_credit, #div_floor_plan_window_schedule, #div_interior_project_temperature_humidity, #div_existing_interior_project_temperature_humidity, #div_geotagged_photographs_videos, #div_elaborating_work_passive, #div_technical_specification_installed,#div_geotagged_specification_installed").hide();
                    // $("#div_case_for_energy_efficent_lighting, #div_narrative_non_air, #div_area_percentage_credit, #div_floor_plan_window_schedule, #div_interior_project_temperature_humidity, #div_existing_interior_project_temperature_humidity, #div_geotagged_photographs_videos, #div_elaborating_work_passive, #div_technical_specification_installed").hide();
                }
               
            }
             else{
                $("#div_case_for_energy_efficent_lighting, #div_narrative_non_air, #div_area_percentage_credit, #div_floor_plan_window_schedule, #div_interior_project_temperature_humidity, #div_existing_interior_project_temperature_humidity, #div_geotagged_photographs_videos, #div_elaborating_work_passive, #div_technical_specification_installed,#div_geotagged_specification_installed").hide();
                }
            
            // --- Conditioned Spaces ---
            if (conditionedChecked) {
                $("#div_conditioning_system_installed, #div_hvac_layout_indicating, #div_purchase_invoice_air_conditioned_system, #div_technical_specification_manufacturer_cut_sheets, #div_geo_tagged_photographs_videos, #div_narrative_passive_technology_installed, #div_technical_specifications_photographs").show();
            }
             else {
                $("#div_conditioning_system_installed, #div_hvac_layout_indicating, #div_purchase_invoice_air_conditioned_system, #div_technical_specification_manufacturer_cut_sheets, #div_geo_tagged_photographs_videos, #div_narrative_passive_technology_installed, #div_technical_specifications_photographs").hide();
            }

            if(nonAirChecked  || conditionedChecked == false) {
                $("div#narrative_non_air_doc, div#area_percentage_credit_doc, div#floor_plan_window_schedule_doc, div#interior_project_temperature_humidity_doc, div#existing_interior_project_temperature_humidity_doc, div#geotagged_photographs_videos_doc").hide();
                $("div#elaborating_work_passive_doc, div#technical_specification_installed_doc, #div_geotagged_specification_installed_doc").hide();
                $("div#conditioning_system_installed_doc, div#hvac_layout_indicating_doc, div#purchase_invoice_air_conditioned_system_doc, div#technical_specification_manufacturer_cut_sheets_doc, div#geo_tagged_photographs_videos_doc, div#narrative_passive_technology_installed_doc, div#technical_specifications_photographs_doc").hide();
            }
            
        }

        // Run on page load
        toggleNonAirFields();

        // Bind events
        $(document).on("change", "input[name='non_air_conditioned_spaces'], input[name='conditioned_spaces'], #case_for_energy_efficent_lighting", toggleNonAirFields);
    });
}

if (subtab === 'energy_metering_management') {
    $(function () {
        function meteringManagment() {
            const subMeteringChecked = $("input[name='sub_metering']").is(":checked");
            const bmsChecked = $("input[name='building_management_system']").is(":checked");

            if (subMeteringChecked) {
                $("#div_lighting_circuits, #div_power_back_up_systems, #div_btu_meter_chilled, #div_meters_renewable_energy, #div_other_major_equipment, #div_narrative_energy_metering_management, #div_single_line_diagram_sld, #div_purchase_invoices_energy, #div_photographs_videos_energy_metering").show();
            } else {
                $("#div_lighting_circuits, #div_power_back_up_systems, #div_btu_meter_chilled, #div_meters_renewable_energy, #div_other_major_equipment, #div_narrative_energy_metering_management, #div_single_line_diagram_sld, #div_purchase_invoices_energy, #div_photographs_videos_energy_metering").hide();
                $("div#narrative_energy_metering_management_doc, div#single_line_diagram_sld_doc, div#purchase_invoices_energy_doc, div#photographs_videos_energy_metering_doc").hide();
            }

            if (bmsChecked) {
                $("#div_air_conditioning_management_system, #div_lighting_management_system, #div_purchase_invoice_bms_energy, #div_elevator_management_system, #div_fresh_air_monitoring_system, #div_co2_control_monitoring_system, #div_narrative_bms_energy, #div_tagged_photographs_bms_energy, #div_existing_interior_project_data, #div_interior_project_data").show();
            } else {
                $("#div_air_conditioning_management_system, #div_lighting_management_system, #div_purchase_invoice_bms_energy, #div_elevator_management_system, #div_fresh_air_monitoring_system, #div_co2_control_monitoring_system, #div_narrative_bms_energy, div#narrative_bms_energy_doc, #div_tagged_photographs_bms_energy, #div_existing_interior_project_data, #div_interior_project_data").hide();
                $("div#narrative_bms_energy_doc, div#tagged_photographs_bms_energy_doc, div#existing_interior_project_data_doc, div#interior_project_data_doc").hide();
            }
        }
        meteringManagment();
        $(document).on("change", "input[name='sub_metering'], input[name='building_management_system']", meteringManagment);
    });
}

if (subtab == 'on_site_renewable_energy') {
    
    if ($('#case_for_on_site_renewable').is(':checked')) {
        $('#div_narrative_on_site_renewable_energy').show();
        $('#div_capacity_on_site_renewable_on_site').show();
        $('#div_capacity_percetage').show();
        $('#div_calculation_indicating_energy_consumption').show();
        $('#div_layout_indicating_the_pv_panels').show();
        $('#div_technical_specifications_manufacturer_brochure').show();
        $('#div_renewable_energy_generation_report').show();
        $('#div_purchase_invoices_on_site_renewable').show();
        $('#div_annual_energy_consumption_onsite').show();
        $('#div_geo_photographs_videos_on_site_renewable').show();
    } else {
        $('#div_capacity_percetage_on_site').hide();
        $('#div_capacity_on_site_renewable').hide();
        $('#div_calucation_indicating_percentage_energy_consumption').hide();
        $('#div_annual_energy_consumption').hide();
        $('#div_declaration_letter_from_owner').hide();
        $('#div_power_purchase_indica').hide();
        $('#div_power_purchase_agreement_green_tariff').hide();
        $('#div_green_tariff_certificates').hide();
    }
    //
    if ($('#case_for_off_site_renewable').is(':checked')) {
        $('#div_capacity_percetage_on_site').show();
        $('#div_capacity_on_site_renewable').show();
        $('#div_calucation_indicating_percentage_energy_consumption').show();
        $('#div_annual_energy_consumption').show();
        $('#div_declaration_letter_from_owner').show();
        $('#div_power_purchase_indica').show();
        $('#div_power_purchase_agreement_green_tariff').show();
        $('#div_green_tariff_certificates').show();capacity_on_site_renewable
    } else {
        $('#div_narrative_on_site_renewable_energy').hide();
        $('#div_capacity_on_site_renewable_on_site').hide();
        $('#div_capacity_percetage').hide();
        $('#div_calculation_indicating_energy_consumption').hide();
        $('#div_layout_indicating_the_pv_panels').hide();
        $('#div_technical_specifications_manufacturer_brochure').hide();
        $('#div_purchase_invoices_on_site_renewable').hide();
        $('#div_annual_energy_consumption_onsite').hide();
        $('#div_geo_photographs_videos_on_site_renewable').hide();
        $('#div_renewable_energy_generation_report').hide();
    }

    $('#case_for_on_site_renewable').on('change', function () {
        if ($(this).is(':checked')) {
            $('#div_narrative_on_site_renewable_energy').show();
            $('#div_capacity_on_site_renewable_on_site').show();
            $('#div_capacity_percetage').show();
            $('#div_calculation_indicating_energy_consumption').show();
            $('#div_layout_indicating_the_pv_panels').show();
            $('#div_technical_specifications_manufacturer_brochure').show();
            $('#div_renewable_energy_generation_report').show();
            $('#div_purchase_invoices_on_site_renewable').show();
            $('#div_annual_energy_consumption_onsite').show();
            $('#div_geo_photographs_videos_on_site_renewable').show();
        } else {
            $('#div_narrative_on_site_renewable_energy').hide();
            $('#div_capacity_on_site_renewable_on_site').hide();
            $('#div_capacity_percetage').hide();
            $('#div_calculation_indicating_energy_consumption').hide();
            $('#div_layout_indicating_the_pv_panels').hide();
            $('#div_technical_specifications_manufacturer_brochure').hide();
            $('#div_renewable_energy_generation_report').hide();
            $('#div_purchase_invoices_on_site_renewable').hide();
            $('#div_annual_energy_consumption_onsite').hide();
            $('#div_geo_photographs_videos_on_site_renewable').hide();
        }
    });

    $('#case_for_off_site_renewable').on('change', function () {
        if ($(this).is(':checked')) {
            $('#div_capacity_percetage_on_site').show();
            $('#div_capacity_on_site_renewable').show();
            $('#div_calucation_indicating_percentage_energy_consumption').show();
            $('#div_annual_energy_consumption').show();
            $('#div_declaration_letter_from_owner').show();
            $('#div_power_purchase_indica').show();
            $('#div_power_purchase_agreement_green_tariff').show();
            $('#div_green_tariff_certificates').show();
        } else {
             $('#div_capacity_percetage_on_site').hide();
            $('#div_capacity_on_site_renewable').hide();
            $('#div_calucation_indicating_percentage_energy_consumption').hide();
            $('#div_annual_energy_consumption').hide();
            $('#div_declaration_letter_from_owner').hide();
            $('#div_power_purchase_indica').hide();
            $('#div_power_purchase_agreement_green_tariff').hide();
            $('#div_green_tariff_certificates').hide();
        }
    });


}

if (subtab == 'materials_with_recycled_content') {
    function materialRecycled(clearHidden = false) {
        let val = $("select[name='material_recycled']").val();
        // alert(val);
        if (val == "Source recycled content materials") {
            $("#div_percent_recycled_content_used").show();
            $("#div_percent_recycled_content_used_ver_two").show();
            $("#div_materials_with_recycled_content_narrative").show();
            $("#div_manufacturer_letters_indicating").show();
            $("#div_geotagged_photographs_of_materials").show();
           

            // Hide Energy Bill & Declaration from Owner
            $("#div_number_ecolabelled_products").hide();
            $("#div_number_ecolabelled_products_doc").hide();
            $("#div_greenpro_certificates").hide();
            $("#div_greenpro_certificates_doc").hide();
            $("#div_materials_with_ecolabbled_narrative").hide();           
            $("#materials_with_ecolabbled_narrative_doc").hide();           

            if (clearHidden) {
                $("#div_number_ecolabelled_products, #div_greenpro_certificates")
                    .find("input, select, textarea").val('');
                $("input[type=checkbox]").prop("checked", false);

            }

        } else if (val == "Source type I eco-labelled products") {
            $("#div_number_ecolabelled_products").show();
            $("#div_greenpro_certificates").show();
            $("#div_materials_with_ecolabbled_narrative").show();
            $("#div_geotagged_photographs_of_materials").show();

            $("#div_percent_recycled_content_used").hide();
            $("#div_percent_recycled_content_used_doc").hide();
            $("#div_percent_recycled_content_used_ver_two").hide();
            $("#percent_recycled_content_used_ver_two_doc").hide();
            $("#div_manufacturer_letters_indicating").hide();
            $("#div_manufacturer_letters_indicating_doc").hide();
            $("#div_materials_with_recycled_content_narrative").hide();
            $("#materials_with_recycled_content_narrative_doc").hide();


            if (clearHidden) {
                $("#div_percent_recycled_content_used, #percent_recycled_content_used_ver_two, #div_manufacturer_letters_indicating, #materials_with_recycled_content_narrative")
                    .find("input, select, textarea").val('');
                $("input[type=checkbox]").prop("checked", false);

            }

        }
         else {
            $("#div_number_ecolabelled_products, #div_greenpro_certificates, #div_materials_with_recycled_content_narrative, #div_materials_with_ecolabbled_narrative_doc, #div_geotagged_photographs_of_materials, #div_percent_recycled_content_used, #div_percent_recycled_content_used_ver_two, #div_manufacturer_letters_indicating")
                .hide();
        }
    }

    materialRecycled(false);

    $("select[name='material_recycled']").change(function () {
        materialRecycled(true);
    });
}
if (subtab == 'use_of_ecolabelled_products') {
    function ecolablledProducts(clearHidden = false) {
      let selectedValue = $("input[name='case_options_ecolabbled_credit']:checked").val();
        if (selectedValue == 1) {
            $("#div_percent_recycled_materials").hide();
            $("#div_no_ecolablled_products").show();
        } else if (selectedValue == 2) {
            $("#div_percent_recycled_materials").show();
            $("#div_no_ecolablled_products").hide();
        } else {
            $("#div_no_ecolablled_products, #div_percent_recycled_materials").hide();
        }
    }

    ecolablledProducts(false);
    $("input[name='case_options_ecolabbled_credit']").change(function () {
        ecolablledProducts(true);
    });
}


if (subtab === 'energy_efficent_appliances') {
    $(function () {
        function energyEfficentapp() {
            const subMeteringChecked = $("input[name='other']").is(":checked");

            if (subMeteringChecked) {
                $("#div_other_input").show();
            } else {
                $("#div_other_input").hide();            }

           
        }
        energyEfficentapp();
        $(document).on("change", "input[name='other']", energyEfficentapp);
    });
}

if (subtab === 'embodied_energy') {
        function embodiedEnergy() {
    let embodiedOption = $("input[name='embodied_energy_option']:checked").val();

    if (embodiedOption == 1) {
        $("#div_narrative_embodied_energy").show();
        $("#div_declaration_letter_supporting_report").show();
        $("#div_pecentage_of_local_material_emboided").hide();
        $("#div_pecentage_of_recycled_content_emboided").hide();
    } else if (embodiedOption == 2) {
        $("#div_narrative_embodied_energy").hide();
        $("#div_declaration_letter_supporting_report").hide();
        $("#div_pecentage_of_local_material_emboided").show();
        $("#div_pecentage_of_recycled_content_emboided").show();
    }else{
        $("#div_narrative_embodied_energy").hide();
        $("#div_declaration_letter_supporting_report").hide();
        $("#div_pecentage_of_local_material_emboided").hide();
        $("#div_pecentage_of_recycled_content_emboided").hide();
    }
}

// Initial call
embodiedEnergy();

// On change
$(document).on("change", "input[name='embodied_energy_option']", embodiedEnergy);

}