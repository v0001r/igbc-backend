if ($("#case_1_water_efficent").is(":checked")) {
  $("#div_water_consumption_saving").show();
  $("#div_case_1_narrative").show();
  $("#div_case_1_model").show();
  $("#div_fte_calculation").show();
  $("#div_manufacture_cutsheet").show();
  $("#div_case_one_purchase_invoice").show();
  $("#div_case_one_photographs").show();
  $("#div_declaration_letter_highligthing").show();
  $("#case_2_beyond_the_fence").prop("checked", false);
} else {
  $("#div_water_consumption_saving").hide();
  $("#div_case_1_narrative").hide();
  $("#case_1_narrative_doc").hide();
  $("#div_case_1_model").hide();
  $("#case_1_model_doc").hide();
  $("#div_fte_calculation").hide();
  $("#fte_calculation_doc").hide();
  $("#div_manufacture_cutsheet").hide();
  $("#manufacture_cutsheet_doc").hide();
  $("#div_case_one_purchase_invoice").hide();
  $("#case_one_purchase_invoice_doc").hide();
  $("#case_one_photographs").hide();
    $("#div_case_one_photographs").hide();
  $("#case_one_photographs_doc").hide();
  $("#div_declaration_letter_highligthing").hide();
  $("#declaration_letter_highligthing_doc").hide();
}

if ($("#case_2_beyond_the_fence").is(":checked")) {
  $("#div_case_2_narrative").show();
  $("#div_highlighting_quantity_of_rainwater").show();
  $("#div_site_drawings_highlights_rainwater").show();
  $("#div_deatils_of_rainwater_harvesting").show();
  $("#div_third_party_report").show();
  $("#div_eco_labelled_interior_furniture_other_documents").show();
  $("#case_1_water_efficent").prop("checked", false)
} else {
  $("#div_case_2_narrative").hide();
  $("#div_highlighting_quantity_of_rainwater").hide();
  $("#div_site_drawings_highlights_rainwater").hide();
  $("#div_deatils_of_rainwater_harvesting").hide();
  $("#div_third_party_report").hide();
  $("#div_eco_labelled_interior_furniture_other_documents").hide();
}

$("#case_1_water_efficent").change(function () {
  if (this.checked) {
    $("#case_2_beyond_the_fence").prop("checked", false);
    $("#div_water_consumption_saving").show();
    $("#div_case_1_narrative").show();
    $("#div_case_1_model").show();
    $("#div_fte_calculation").show();
    $("#div_manufacture_cutsheet").show();
    $("#div_case_one_purchase_invoice").show();
    $("#div_case_one_photographs").show();
    $("#div_declaration_letter_highligthing").show();
    $("#div_case_2_narrative").hide();
    $("#case_2_narrative_doc").hide();
    $("#div_site_drawings_highlights_rainwater").hide();
    $("#site_drawings_highlights_rainwater_doc").hide();
    $("#div_highlighting_quantity_of_rainwater").hide();
    $("#highlighting_quantity_of_rainwater_doc").hide();
    $("#div_deatils_of_rainwater_harvesting").hide();
    $("#deatils_of_rainwater_harvesting_doc").hide();
    $("#div_third_party_report").hide();
    $("#third_party_report_doc").hide();
    $("#div_eco_labelled_interior_furniture_other_documents").hide();
    $("#eco_labelled_interior_furniture_other_documents_doc").hide();
  } else {
    $("#div_water_consumption_saving").hide();
    $("#div_case_1_narrative").hide();
    $("#case_1_narrative_doc").hide();
    $("#div_case_1_model").hide();
    $("#case_1_model_doc").hide();
    $("#div_fte_calculation").hide();
    $("#fte_calculation_doc").hide();
    $("#div_manufacture_cutsheet").hide();
    $("#manufacture_cutsheet_doc").hide();
    $("#div_case_one_purchase_invoice").hide();
    $("#case_one_purchase_invoice_doc").hide();
    $("#div_case_one_photographs").hide();
    $("#case_one_photographs_doc").hide();
    $("#div_declaration_letter_highligthing").hide();
    $("#declaration_letter_highligthing_doc").hide();
  }
});

$("#case_2_beyond_the_fence").change(function () {
  if (this.checked) {
    $("#div_case_2_narrative").show();
    $("#div_highlighting_quantity_of_rainwater").show();
    $("#div_site_drawings_highlights_rainwater").show();
    $("#div_deatils_of_rainwater_harvesting").show();
    $("#div_third_party_report").show();
    $("#div_eco_labelled_interior_furniture_other_documents").show();
    $("#case_1_water_efficent").prop("checked", false);
    $("#div_water_consumption_saving").hide();
    $("#div_case_1_narrative").hide();
    $("#case_1_narrative_doc").hide();
    $("#div_case_1_model").hide();
    $("#case_1_model_doc").hide();
    $("#div_fte_calculation").hide();
    $("#fte_calculation_doc").hide();
    $("#div_manufacture_cutsheet").hide();
    $("#manufacture_cutsheet_doc").hide();
    $("#div_case_one_purchase_invoice").hide();
    $("#case_one_purchase_invoice_doc").hide();
    $("#div_case_one_photographs").hide();
    $("#case_one_photographs_doc").hide();
    $("#div_declaration_letter_highligthing").hide();
    $("#declaration_letter_highligthing_doc").hide();

  } else {
    $("#div_case_2_narrative").hide();
    $("#case_2_narrative_doc").hide();
    $("#div_site_drawings_highlights_rainwater").hide();
    $("#site_drawings_highlights_rainwater_doc").hide();
    $("#div_highlighting_quantity_of_rainwater").hide();
    $("#highlighting_quantity_of_rainwater_doc").hide();
    $("#div_deatils_of_rainwater_harvesting").hide();
    $("#deatils_of_rainwater_harvesting_doc").hide();
    $("#div_third_party_report").hide();
    $("#third_party_report_doc").hide();
    $("#div_eco_labelled_interior_furniture_other_documents").hide();
    $("#eco_labelled_interior_furniture_other_documents_doc").hide();
  }
});
