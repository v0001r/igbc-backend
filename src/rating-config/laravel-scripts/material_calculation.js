function eco_labelled_interior_furniture() {
    let total_furniture_cost = $('#total_furniture_cost').val();
    let total_ecolabelled_furniture_cost = $('#total_ecolabelled_furniture_cost').val();

    //alert(total_furniture_cost, total_ecolabelled_furniture_cost);
    if (total_furniture_cost && total_ecolabelled_furniture_cost ) {
        let percentage_eco_labelled_interior_furniture = (parseFloat(total_ecolabelled_furniture_cost) / parseFloat(total_furniture_cost)) * 100;
        // let rounded_percentage = Math.round(percentage_eco_labelled_interior_furniture);
        console.log(percentage_eco_labelled_interior_furniture );
        $('#percent_eco_labelled_interior_furniture').val(percentage_eco_labelled_interior_furniture);
    } else {
        // Set to zero or empty string if values are not valid
        $('#percent_eco_labelled_interior_furniture').val('');
    }

}

// Add event listeners to input fields to trigger the calculation when values change
$('#total_furniture_cost, #total_ecolabelled_furniture_cost').on('input', eco_labelled_interior_furniture);


$(document).ready(function() {
   $('#div_percent_salavged_material_used').hide();
   $('#div_percent_materials_with_recycled_content_used').hide();
   $('#div_percent_local_materials_used').hide();
   $('#div_percent_eco_friendly_wood_based_material_used').hide();
   $('#div_option_building_reuse_narrative').hide();
   $('#div_percentange_structural_non_structural_area').hide();
   $('#div_option_building_reuse_photographs').hide();
   $('#div_quotation_purchase_invoice_payment_receipts').hide();
   $('#div_photographs_of_salvage_materials_before_and_after').hide();
   $('#div_technical_cutsheets_of_the_proposed_material').hide();
   $('#div_manufacturer_vendor_letter_indicating_the_location_of_manufacturing_unit').hide();
   $('#div_aerial_maps_highlighting_the_distance_of_the_manufacturing_unit_from_the_project_site').hide();
   $('#div_technical_cutsheet_for_composite_wood_coc_certificate_for_fsc_pefc_equivalent_certified_wood').hide();
   $('#div_purchase_invoice_indicating_type_of_wood_coc_number').hide();
   $('#div_manufacturer_letters_indicating_the_recycled_contents_along_with_the_quantities').hide();
   $('#div_option_four_purchase_invoice').hide();
   $('#div_option_building_reuse_narrative').hide();
   $('#div_option_salvage_materials_narrative').hide();
   $('#div_option_materials_with_recycled_content_narrative').hide();
   $('#div_option_local_materials_narrative').hide();
   $('#div_option_wood_based_materials_narrative').hide();
   
    if($('#option_building_reuse').is(':checked')) {
        $('#div_option_building_reuse_narrative').show();
        $('#div_percentange_structural_non_structural_area').show();
        $('#div_option_building_reuse_photographs').show();
    }
    if($('#option_salvage_materials').is(':checked')){
        $('#div_option_salvage_materials_narrative').show();
        $('#div_quotation_purchase_invoice_payment_receipts').show();
        $('#div_photographs_of_salvage_materials_before_and_after').show();
        $('#div_percent_salavged_material_used').show();
    }
    if($('#option_materials_with_recycled_content').is(':checked')){
        $('#div_option_materials_with_recycled_content_narrative').show();
        $('#div_manufacturer_letters_indicating_the_recycled_contents_along_with_the_quantities').show();
        $('#div_technical_cutsheets_of_the_proposed_material').show();
        $('#div_percent_materials_with_recycled_content_used').show();
    }
    if($('#option_local_materials').is(':checked')){
        $('#div_option_local_materials_narrative').show();
        $('#div_manufacturer_vendor_letter_indicating_the_location_of_manufacturing_unit').show();
        $('#div_aerial_maps_highlighting_the_distance_of_the_manufacturing_unit_from_the_project_site').show();
        $('#div_option_four_purchase_invoice').show();
        $('#div_percent_local_materials_used').show();
    }
    if($('#option_wood_based_materials').is(':checked')){
        $('#div_option_wood_based_materials_narrative').show();
        $('#div_technical_cutsheet_for_composite_wood_coc_certificate_for_fsc_pefc_equivalent_certified_wood').show();
        $('#div_purchase_invoice_indicating_type_of_wood_coc_number').show();
        $('#div_percent_eco_friendly_wood_based_material_used').show();
    }
});

    

$('#option_building_reuse').change(function() {
    if(this.checked) {
        $('#div_option_building_reuse_narrative').show();
        $('#div_percentange_structural_non_structural_area').show();
        $('#div_option_building_reuse_photographs').show();
    }else{
        $('#div_option_building_reuse_narrative').hide();
        $('#option_building_reuse_narrative').prop('checked', false)
	    $('#option_building_reuse_narrative_doc').hide();
        $('#div_percentange_structural_non_structural_area').hide();
        $('#percentange_structural_non_structural_area').prop('checked', false)
	    $('#percentange_structural_non_structural_area_doc').hide();
        $('#div_option_building_reuse_photographs').hide();
        $('#option_building_reuse_photographs').prop('checked', false)
	    $('#option_building_reuse_photographs_doc').hide();
    }
});

$('#option_salvage_materials').change(function() {
    if(this.checked) {
        $('#div_option_salvage_materials_narrative').show();
        $('#div_quotation_purchase_invoice_payment_receipts').show();
        $('#div_photographs_of_salvage_materials_before_and_after').show();
        $('#div_percent_salavged_material_used').show();
    }else{
        $('#div_option_salvage_materials_narrative').hide();
        $('#div_quotation_purchase_invoice_payment_receipts').hide();
        $('#div_photographs_of_salvage_materials_before_and_after').hide();
        $('#div_percent_salavged_material_used').hide();
	
        $('#option_salvage_materials_narrative_doc').hide();
        $('#quotation_purchase_invoice_payment_receipts_doc').hide();
        $('#photographs_of_salvage_materials_before_and_after_doc').hide();
        $('#percent_salavged_material_used_doc').hide();

        $('#option_salvage_materials_narrative').prop('checked', false);
        $('#quotation_purchase_invoice_payment_receipts').prop('checked', false);
        $('#photographs_of_salvage_materials_before_and_after').prop('checked', false);
        $('#percent_salavged_material_used').prop('checked', false);


    }
});
$('#option_materials_with_recycled_content').change(function() {
    if(this.checked) {
        $('#div_option_materials_with_recycled_content_narrative').show();
        $('#div_manufacturer_letters_indicating_the_recycled_contents_along_with_the_quantities').show();
        $('#div_technical_cutsheets_of_the_proposed_material').show();
        $('#div_percent_materials_with_recycled_content_used').show();
    }else{
        $('#div_option_materials_with_recycled_content_narrative').hide();
        $('#div_manufacturer_letters_indicating_the_recycled_contents_along_with_the_quantities').hide();
        $('#div_technical_cutsheets_of_the_proposed_material').hide();
        $('#div_percent_materials_with_recycled_content_used').hide();
	    
        $('#option_materials_with_recycled_content_narrative_doc').hide();
        $('#manufacturer_letters_indicating_the_recycled_contents_along_with_the_quantities_doc').hide();
        $('#technical_cutsheets_of_the_proposed_material_doc').hide();
        $('#percent_materials_with_recycled_content_used_doc').hide();

        $('#option_materials_with_recycled_content_narrative').prop('checked', false);
        $('#manufacturer_letters_indicating_the_recycled_contents_along_with_the_quantities').prop('checked', false);
        $('#technical_cutsheets_of_the_proposed_material').prop('checked', false);
        $('#percent_materials_with_recycled_content_used').prop('checked', false);


    }
});
$('#option_local_materials').change(function() {
    if(this.checked) {
        $('#div_option_local_materials_narrative').show();
        $('#div_manufacturer_vendor_letter_indicating_the_location_of_manufacturing_unit').show();
        $('#div_aerial_maps_highlighting_the_distance_of_the_manufacturing_unit_from_the_project_site').show();
        $('#div_option_four_purchase_invoice').show();
        $('#div_percent_local_materials_used').show();
    }else{
        $('#div_option_local_materials_narrative').hide();
        $('#div_manufacturer_vendor_letter_indicating_the_location_of_manufacturing_unit').hide();
        $('#div_aerial_maps_highlighting_the_distance_of_the_manufacturing_unit_from_the_project_site').hide();
        $('#div_option_four_purchase_invoice').hide();

        $('#div_percent_local_materials_used').hide();
	
	    $('#option_local_materials_narrative_doc').hide();
        $('#manufacturer_vendor_letter_indicating_the_location_of_manufacturing_unit_doc').hide();
        $('#aerial_maps_highlighting_the_distance_of_the_manufacturing_unit_from_the_project_site_doc').hide();
        $('#option_four_purchase_invoice_doc').hide();
        $('#percent_local_materials_used_doc').hide();

        $('#option_local_materials_narrative').prop('checked', false);
        $('#manufacturer_vendor_letter_indicating_the_location_of_manufacturing_unit').prop('checked', false);
        $('#aerial_maps_highlighting_the_distance_of_the_manufacturing_unit_from_the_project_site').prop('checked', false);
        $('#option_four_purchase_invoice').prop('checked', false);
        $('#percent_local_materials_used').prop('checked', false);

    }
});
$('#option_wood_based_materials').change(function() {
    if(this.checked) {
        $('#div_option_wood_based_materials_narrative').show();
        $('#div_technical_cutsheet_for_composite_wood_coc_certificate_for_fsc_pefc_equivalent_certified_wood').show();
        $('#div_purchase_invoice_indicating_type_of_wood_coc_number').show();
        $('#div_percent_eco_friendly_wood_based_material_used').show();
    }else{
        $('#div_option_wood_based_materials_narrative').hide();
        $('#div_technical_cutsheet_for_composite_wood_coc_certificate_for_fsc_pefc_equivalent_certified_wood').hide();
        $('#div_purchase_invoice_indicating_type_of_wood_coc_number').hide();


        $('#div_percent_eco_friendly_wood_based_material_used').hide();
	    
        $('#option_wood_based_materials_narrative_doc').hide();
        $('#technical_cutsheet_for_composite_wood_coc_certificate_for_fsc_pefc_equivalent_certified_wood_doc').hide();
        $('#purchase_invoice_indicating_type_of_wood_coc_number_doc').hide();
        $('#percent_eco_friendly_wood_based_material_used_doc').hide();

        $('#option_wood_based_materials_narrative').prop('checked', false);
        $('#technical_cutsheet_for_composite_wood_coc_certificate_for_fsc_pefc_equivalent_certified_wood').prop('checked', false);
        $('#purchase_invoice_indicating_type_of_wood_coc_number').prop('checked', false);
        $('#percent_eco_friendly_wood_based_material_used').prop('checked', false);


    }
});




function toggleEmbodiedCarbon() {
    if ($('#embodied_carbon').is(':checked')) {
        $('#div_embodied_carbon_kg').show();
    } else {
        $('#div_embodied_carbon_kg').hide();
    }
}

function toggleOperationalCarbon() {
    if ($('#operational_carbon_building').is(':checked')) {
        $('#div_operational_carbon_kg').show();
    } else {
        $('#div_operational_carbon_kg').hide();
    }
}

$('#embodied_carbon').change(toggleEmbodiedCarbon);
$('#operational_carbon_building').change(toggleOperationalCarbon);

$(document).ready(function () {
    toggleEmbodiedCarbon();
    toggleOperationalCarbon();
});



