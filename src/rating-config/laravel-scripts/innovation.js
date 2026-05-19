// alert();

$("#div_exemplary_performance_in_a_credit_select_one").hide();
$("#div_exemplary_performance_in_a_credit_two_select").hide();
$("#div_exemplary_performance_in_a_credit_one_of_three_select").hide();
$("#div_exemplary_performance_in_a_credit_one_of_four_select").hide();



$("#select_innovation_one").on("change", function () {
  let val = $(this).val()?.toString().trim().toLowerCase();

  function hideAndClear(selector) {
    $(selector)
      .hide()
      .find("input, select, textarea").val('');
    $(selector)
      .find("input[type=checkbox], input[type=radio]").prop("checked", false);
  }

  if (val === "exemplary performance") {
    $("#div_narrative_performance_one, #div_exemplary_performance_in_a_credit_select_one, #div_selected_credit_link").show();

    hideAndClear("#div_description_narrative_intent, #div_illustrations_cut_sheets_one, #div_geo_tagged_videos, #div_narrative_invovation_one");
    $("div#description_narrative_intent_doc, div#illustrations_cut_sheets_one_doc, div#geo_tagged_videos_doc, div#narrative_invovation_one_doc").hide();
    $("#exemplary_performance_in_a_credit_select_one").attr("required", true);
     $('#div_embodied_carbon').hide(); 
      $('#div_embodied_carbon_kg').hide(); 
      $('#div_operational_carbon_building').hide(); 
      $('#div_operational_carbon_building').hide(); 
      $('#div_operational_carbon_kg').hide(); 
      $('#div_life_cycle_narrative').hide(); 
      $('#div_material_list_of_embodied_carbon').hide(); 
      $('#div_calculation_indicating_carbon').hide(); 
      $('#div_detailed_report_lca_analysis').hide();

  } else if (val === "innovation in interior design") {
    $("#div_description_narrative_intent, #div_illustrations_cut_sheets_one, #div_geo_tagged_videos, #div_narrative_invovation_one").show();

    hideAndClear("#div_narrative_performance_one, #div_exemplary_performance_in_a_credit_select_one, #div_selected_credit_link");
    $("div#narrative_performance_one_doc, div#selected_credit_link_doc").hide();
    $('#div_embodied_carbon').hide(); 
      $('#div_embodied_carbon_kg').hide(); 
      $('#div_operational_carbon_building').hide(); 
      $('#div_operational_carbon_building').hide(); 
      $('#div_operational_carbon_kg').hide(); 
      $('#div_life_cycle_narrative').hide(); 
      $('#div_material_list_of_embodied_carbon').hide(); 
      $('#div_calculation_indicating_carbon').hide(); 
      $('#div_detailed_report_lca_analysis').hide();

    $("#exemplary_performance_in_a_credit_select_one").removeAttr("required").val('');

  
  } else if (val === "life cycle assessment") {
    // $("#div_description_narrative_intent, #div_illustrations_cut_sheets_one, #div_geo_tagged_videos, #div_narrative_invovation_one").show();
      $('#div_embodied_carbon').show(); 
      $('#div_embodied_carbon_kg').show(); 
      $('#div_operational_carbon_building').show(); 
      $('#div_operational_carbon_building').show(); 
      $('#div_operational_carbon_kg').show(); 
      $('#div_life_cycle_narrative').show(); 
      $('#div_material_list_of_embodied_carbon').show(); 
      $('#div_calculation_indicating_carbon').show(); 
      $('#div_detailed_report_lca_analysis').show(); 
          $("div#narrative_performance_one_doc, div#selected_credit_link_doc").hide();


    hideAndClear("#div_narrative_performance_one, #div_exemplary_performance_in_a_credit_select_one, #div_selected_credit_link");
    $("div#narrative_performance_one_doc, div#selected_credit_link_doc").hide();
    $("div#description_narrative_intent_doc, div#illustrations_cut_sheets_one_doc, div#geo_tagged_videos_doc, div#narrative_invovation_one_doc").hide();
    $("#div_description_narrative_intent, #div_illustrations_cut_sheets_one, #div_geo_tagged_videos, #div_narrative_invovation_one").hide();

    $("#exemplary_performance_in_a_credit_select_one").removeAttr("required").val('');

  } else {
    hideAndClear("#div_selected_credit_link, #div_narrative_performance_one, #div_narrative_invovation_one, #div_description_narrative_intent, #div_illustrations_cut_sheets_one, #div_geo_tagged_videos, #div_exemplary_performance_in_a_credit_select_one, #div_embodied_carbon, #div_embodied_carbon_kg, #div_operational_carbon_building, #div_operational_carbon_building, #div_operational_carbon_kg, #div_life_cycle_narrative, #div_material_list_of_embodied_carbon, #div_calculation_indicating_carbon, #div_detailed_report_lca_analysis");
    hideAndClear("div#selected_credit_link_doc, div#narrative_performance_one_doc, div#narrative_invovation_one_doc, div#description_narrative_intent_doc, div#illustrations_cut_sheets_one_doc, div#geo_tagged_videos_doc, div#exemplary_performance_in_a_credit_select_one_doc");

    $("#exemplary_performance_in_a_credit_select_one").removeAttr("required").val('');
  }
});

// $("#select_innovation_two").on("change", function () {
//   let val = $(this).val().toString().trim().toLowerCase();
//   if (val === "exemplary performance") {
//       $("#div_narrative_invovation_two").hide();
//       $("#div_description_narrative_intent_two").hide();
//       $("div#description_narrative_intent_two_doc").hide();
//       $("#div_illustrations_cut_sheets_two").hide();
//       $("div#illustrations_cut_sheets_two_doc").hide();
//       $("#div_geo_tagged_videos_two").hide();
//       $("div#geo_tagged_videos_two_doc").hide();
//       $("div#narrative_invovation_two_doc").hide();
//       $("#div_exemplary_performance_in_a_credit_select_two").show();
//       $("#div_selected_credit_link_two").show();
//       $("#exemplary_performance_in_a_credit_select_two").attr("required", true);

//   } else if (val === "innovation in interior design") {

//       $("#div_selected_credit_link_two").hide();
//       $("div#selected_credit_link_two_doc").hide();
//       $("#div_narrative_invovation_two").show();
//       $("#div_description_narrative_intent_two").show();  
//       $("#div_geo_tagged_videos_two").show();
//       $("#div_illustrations_cut_sheets_two").show();
//       $("#div_exemplary_performance_in_a_credit_select_two").hide();
//       $("div#exemplary_performance_in_a_credit_select_two_doc").hide();
//       $('#exemplary_performance_in_a_credit_select_two').val(''); 
//       $("#exemplary_performance_in_a_credit_select_two").removeAttr("required").val('');

//   }
//   else {
//       $("#div_selected_credit_link_two").hide();
//       $("#div_narrative_invovation_two").hide();
//       $("#div_description_narrative_intent_two").hide();
//       $("#div_illustrations_cut_sheets_two").hide();
//       $("#div_geo_tagged_videos_two").hide();
//       $("#div_exemplary_performance_in_a_credit_select_two").hide();
//       $('#exemplary_performance_in_a_credit_select_two').val(''); 
//       $("#exemplary_performance_in_a_credit_select_two").removeAttr("required").val('');
//   }
// });

$("#select_innovation_two").on("change", function () {
  let val = $(this).val()?.toString().trim().toLowerCase();

  function hideAndClear(selector) {
    $(selector)
      .hide()
      .find("input, select, textarea").val('');
    $(selector)
      .find("input[type=checkbox], input[type=radio]").prop("checked", false);
  }

  if (val === "exemplary performance") {
    $("#div_exemplary_performance_in_a_credit_select_two, #div_narrative_performance_two, #div_selected_credit_link_two").show();

    hideAndClear("#div_narrative_invovation_two, #div_description_narrative_intent_two, #div_illustrations_cut_sheets_two, #div_geo_tagged_videos_two");
    $("div#narrative_invovation_two_doc, div#description_narrative_intent_two_doc, div#illustrations_cut_sheets_two_doc, div#geo_tagged_videos_two_doc").hide();

    $("#exemplary_performance_in_a_credit_select_two").attr("required", true);

  } else if (val === "innovation in interior design") {
    $("#div_narrative_invovation_two, #div_description_narrative_intent_two, #div_illustrations_cut_sheets_two, #div_geo_tagged_videos_two").show();

    hideAndClear("#div_exemplary_performance_in_a_credit_select_two,#div_narrative_performance_two, #div_selected_credit_link_two");
    $("div#exemplary_performance_in_a_credit_select_two_doc, div#selected_credit_link_two_doc").hide();

    $("#exemplary_performance_in_a_credit_select_two").removeAttr("required").val('');

  } else {
    hideAndClear("#div_selected_credit_link_two,#div_narrative_performance_two, #div_narrative_invovation_two, #div_description_narrative_intent_two, #div_illustrations_cut_sheets_two, #div_geo_tagged_videos_two, #div_exemplary_performance_in_a_credit_select_two");
    hideAndClear("div#selected_credit_link_two_doc, div#narrative_performance_two_doc, div#narrative_invovation_two_doc, div#description_narrative_intent_two_doc, div#illustrations_cut_sheets_two_doc, div#geo_tagged_videos_two_doc, div#exemplary_performance_in_a_credit_select_two_doc");

    $("#exemplary_performance_in_a_credit_select_two").removeAttr("required").val('');
  }
});


// $("#select_innovation_three").on("change", function () {
//   let val = $(this).val().toString().trim().toLowerCase();
//   if (val === "exemplary performance") {
//       $("#div_narrative_invovation_three").hide();
//       $("div#narrative_invovation_three_doc").hide();
//       $("#div_description_narrative_intent_three").hide();
//       $("div#description_narrative_intent_three_doc").hide();
//       $("#div_illustrations_cut_sheets_three").hide();
//       $("div#illustrations_cut_sheets_three_doc").hide();
//       $("#div_geo_tagged_videos_three").hide();
//       $("div#geo_tagged_videos_three_doc").hide();
//       $("#div_exemplary_performance_in_a_credit_select_three").show();
//       $("#div_selected_credit_link_three").show();
//       $("#div_narrative_performance_three").show();
//       $("#exemplary_performance_in_a_credit_select_three").attr("required", true);

//   } else if (val === "innovation in interior design") {

//       $("#div_selected_credit_link_three").hide();
//       $("div#selected_credit_link_three_doc").hide();
//       $("#div_narrative_performance_three").hide();
//       $("div#narrative_performance_three_doc").hide();
//       $("#div_illustrations_cut_sheets_three").show();
//       $("#div_description_narrative_intent_three").show();
//       $("#div_narrative_invovation_three").show();
//       $("#div_geo_tagged_videos_three").show();
//       $("#div_exemplary_performance_in_a_credit_select_three").hide();
//       $("div#exemplary_performance_in_a_credit_select_three_doc").hide();
//       $('#exemplary_performance_in_a_credit_select_three').val(''); 
//       $("#exemplary_performance_in_a_credit_select_three").removeAttr("required").val('');

//   }
//   else {
//       $("#div_selected_credit_link_three").hide();
//       $("#div_narrative_invovation_three").hide();
//       $("#div_description_narrative_intent_three").hide();
//       $("#div_illustrations_cut_sheets_three").hide();
//       $("#div_geo_tagged_videos_three").hide();
//       $("#div_exemplary_performance_in_a_credit_select_three").hide();
//       $('#exemplary_performance_in_a_credit_select_three').val(''); 
//       $("#exemplary_performance_in_a_credit_select_three").removeAttr("required").val('');
//   }
// });


$("#select_innovation_three").on("change", function () {
  let val = $(this).val()?.toString().trim().toLowerCase();

  function hideAndClear(selector) {
    $(selector)
      .hide()
      .find("input, select, textarea").val('');
    $(selector)
      .find("input[type=checkbox], input[type=radio]").prop("checked", false);
  }

  if (val === "exemplary performance") {
    $("#div_exemplary_performance_in_a_credit_select_three, #div_selected_credit_link_three, #div_narrative_performance_three").show();

    hideAndClear("#div_narrative_invovation_three, #div_description_narrative_intent_three, #div_illustrations_cut_sheets_three, #div_geo_tagged_videos_three");
    $("div#narrative_invovation_three_doc, div#description_narrative_intent_three_doc, div#illustrations_cut_sheets_three_doc, div#geo_tagged_videos_three_doc").hide();

    $("#exemplary_performance_in_a_credit_select_three").attr("required", true);

  } else if (val === "innovation in interior design") {
    $("#div_illustrations_cut_sheets_three, #div_description_narrative_intent_three, #div_narrative_invovation_three, #div_geo_tagged_videos_three").show();

    hideAndClear("#div_exemplary_performance_in_a_credit_select_three, #div_selected_credit_link_three, #div_narrative_performance_three");
    $("div#exemplary_performance_in_a_credit_select_three_doc, div#selected_credit_link_three_doc, div#narrative_performance_three_doc").hide();

    $("#exemplary_performance_in_a_credit_select_three").removeAttr("required").val('');

  } else {
    hideAndClear(" #div_selected_credit_link_three, #div_narrative_performance_three, #div_narrative_invovation_three, #div_description_narrative_intent_three, #div_illustrations_cut_sheets_three, #div_geo_tagged_videos_three, #div_exemplary_performance_in_a_credit_select_three");
    hideAndClear("div#selected_credit_link_three_doc, div#narrative_performance_three_doc, div#narrative_invovation_three_doc, div#description_narrative_intent_three_doc, div#illustrations_cut_sheets_three_doc, div#geo_tagged_videos_three_doc, div#exemplary_performance_in_a_credit_select_three_doc");

    $("#exemplary_performance_in_a_credit_select_three").removeAttr("required").val('');
  }
});



// $("#select_innovation_four").on("change", function () {
//   let val = $(this).val().toString().trim().toLowerCase();
//   if (val === "exemplary performance") {
//       $("#div_narrative_invovation_four").hide();
//       $("#div_description_narrative_intent_four").hide();
//       $("#div_illustrations_cut_sheets_four").hide();
//       $("#div_geo_tagged_videos_four").hide();
//       $("#div_exemplary_performance_in_a_credit_select_four").show();
//       $("#div_selected_credit_link_four").show();
//       $("#exemplary_performance_in_a_credit_select_four").attr("required", true);
//       $("#div_narrative_performance_four").show();


//   } else if (val === "innovation in interior design") {

//       $("#div_selected_credit_link_four").hide();
//      $("div#narrative_performance_four_doc").hide();
//     $("#div_narrative_performance_four").hide();
//       $("#div_narrative_invovation_four").show();
//       $("#div_description_narrative_intent_four").show();  
//       $("#div_geo_tagged_videos_four").show();
//       $("#div_illustrations_cut_sheets_four").show();
//       $("#div_exemplary_performance_in_a_credit_select_four").hide();
//       $('#exemplary_performance_in_a_credit_select_four').val(''); 
//       $("#exemplary_performance_in_a_credit_select_four").removeAttr("required").val('');

//   }
//   else {
//       $("#div_selected_credit_link_four").hide();
//       $("#div_narrative_invovation_four").hide();
//       $("#div_description_narrative_intent_four").hide();
//       $("#div_illustrations_cut_sheets_four").hide();
//       $("#div_narrative_performance_four").hide();
//       $("#div_geo_tagged_videos_four").hide();
//       $("#div_exemplary_performance_in_a_credit_select_four").hide();
//       $('#exemplary_performance_in_a_credit_select_four').val(''); 
//       $("#exemplary_performance_in_a_credit_select_four").removeAttr("required").val('');
//   }
// });


$("#select_innovation_four").on("change", function () {
  let val = $(this).val()?.toString().trim().toLowerCase();

  function hideAndClear(selector) {
    $(selector)
      .hide()
      .find("input, select, textarea").val('');
    $(selector)
      .find("input[type=checkbox], input[type=radio]").prop("checked", false);
  }

  if (val === "exemplary performance") {
    $("#div_exemplary_performance_in_a_credit_select_four, #div_selected_credit_link_four, #div_narrative_performance_four").show();

    hideAndClear("#div_narrative_invovation_four, #div_description_narrative_intent_four, #div_illustrations_cut_sheets_four, #div_geo_tagged_videos_four");
    $("div#narrative_invovation_four_doc, div#description_narrative_intent_four_doc, div#illustrations_cut_sheets_four_doc, div#geo_tagged_videos_four_doc").hide();

    $("#exemplary_performance_in_a_credit_select_four").attr("required", true);

  } else if (val === "innovation in interior design") {
    $("#div_narrative_invovation_four, #div_description_narrative_intent_four, #div_illustrations_cut_sheets_four, #div_geo_tagged_videos_four").show();

    hideAndClear("#div_exemplary_performance_in_a_credit_select_four, #div_selected_credit_link_four, #div_narrative_performance_four");
    $("div#exemplary_performance_in_a_credit_select_four_doc, div#selected_credit_link_four_doc, div#narrative_performance_four_doc").hide();

    $("#exemplary_performance_in_a_credit_select_four").removeAttr("required").val('');

  } else {
    hideAndClear("#div_selected_credit_link_four, #div_narrative_performance_four, #div_narrative_invovation_four, #div_description_narrative_intent_four, #div_illustrations_cut_sheets_four, #div_geo_tagged_videos_four, #div_exemplary_performance_in_a_credit_select_four");
    hideAndClear("div#selected_credit_link_four_doc, div#narrative_performance_four_doc, div#narrative_invovation_four_doc, div#description_narrative_intent_four_doc, div#illustrations_cut_sheets_four_doc, div#geo_tagged_videos_four_doc, div#exemplary_performance_in_a_credit_select_four_doc");

    $("#exemplary_performance_in_a_credit_select_four").removeAttr("required").val('');
  }
});


$(Document).ready(function () {
  let invOne = $("#select_innovation_one")
    .val()
    .toString()
    .trim()
    .toLowerCase();
  if (invOne === "exemplary performance") {
      $("#div_narrative_invovation_one").hide();
      $("#div_description_narrative_intent").hide();
      $("#div_geo_tagged_videos").hide();
      $("#div_illustrations_cut_sheets_one").hide();
      $("#div_exemplary_performance_in_a_credit_select_one").show();
      $("#div_selected_credit_link").show();
      $("#exemplary_performance_in_a_credit_select_one").attr("required", true);

  } else if (invOne === "innovation in interior design") {

      $("#div_selected_credit_link").hide();
      $("#div_narrative_invovation_one").show();
      $("#div_illustrations_cut_sheets_one").show();
      $("#div_description_narrative_intent").show();  
      $("#div_geo_tagged_videos").show();
      $("#div_narrative_performance_one").hide();
      $("#div_exemplary_performance_in_a_credit_select_one").hide();
      $('#exemplary_performance_in_a_credit_select_one').val(''); 
      $("#exemplary_performance_in_a_credit_select_one").removeAttr("required").val('');

  }
  else {
      $("#div_selected_credit_link").hide();
      $("#div_narrative_invovation_one").hide();
      $("#div_description_narrative_intent").hide();
      $("#div_illustrations_cut_sheets_one").hide();
      $("#div_geo_tagged_videos").hide();
      $("#div_narrative_performance_one").hide();
      $("#div_exemplary_performance_in_a_credit_select_one").hide();
      $('#exemplary_performance_in_a_credit_select_one').val(''); 
      $('#div_embodied_carbon').hide(); 
      $('#div_embodied_carbon_kg').hide(); 
      $('#div_operational_carbon_building').hide(); 
      $('#div_operational_carbon_building').hide(); 
      $('#div_operational_carbon_kg').hide(); 
      $('#div_life_cycle_narrative').hide(); 
      $('#div_material_list_of_embodied_carbon').hide(); 
      $('#div_calculation_indicating_carbon').hide(); 
      $('#div_detailed_report_lca_analysis').hide(); 
      $("#exemplary_performance_in_a_credit_select_one").removeAttr("required").val('');
  }
});

$(Document).ready(function () {
  let invtwo = $("#select_innovation_two")
    .val()
    .toString()
    .trim()
    .toLowerCase();
 if (invtwo === "exemplary performance") {
      $("#div_narrative_invovation_two").hide();
      $("#div_description_narrative_intent_two").hide();
      $("#div_geo_tagged_videos_two").hide();
      $("#div_illustrations_cut_sheets_two").hide();
      $("#div_exemplary_performance_in_a_credit_select_two").show();
      $("#div_selected_credit_link_two").show();
      $("#exemplary_performance_in_a_credit_select_two").attr("required", true);

  } else if (invtwo === "innovation in interior design") {

      $("#div_selected_credit_link_two").hide();
      $("#div_narrative_invovation_two").show();
      $("#div_description_narrative_intent_two").show();  
      $("#div_illustrations_cut_sheets_two").show();  
      $("#div_geo_tagged_videos_two").show();
      $("#div_narrative_performance_two").hide();
      $("#div_exemplary_performance_in_a_credit_select_two").hide();
      $('#exemplary_performance_in_a_credit_select_two').val(''); 
      $("#exemplary_performance_in_a_credit_select_two").removeAttr("required").val('');

  }
  else {
      $("#div_selected_credit_link_two").hide();
      $("#div_narrative_invovation_two").hide();
      $("#div_description_narrative_intent_two").hide();
      $("#div_illustrations_cut_sheets_two").hide();
      $("#div_geo_tagged_videos_two").hide();
      $("#div_narrative_performance_two").hide();
      $("#div_exemplary_performance_in_a_credit_select_two").hide();
      $('#exemplary_performance_in_a_credit_select_two').val(''); 
      $("#exemplary_performance_in_a_credit_select_two").removeAttr("required").val('');
  }
});

$(Document).ready(function () {
  let invThree = $("#select_innovation_three")
    .val()
    .toString()
    .trim()
    .toLowerCase();
  if (invThree === "exemplary performance") {
      $("#div_narrative_invovation_three").hide();
      $("#div_description_narrative_intent_three").hide();
      $("#div_illustrations_cut_sheets_three").hide();
      $("#div_geo_tagged_videos_three").hide();
      $("#div_exemplary_performance_in_a_credit_select_three").show();
      $("#div_selected_credit_link_three").show();
      $("#exemplary_performance_in_a_credit_select_three").attr("required", true);

  } else if (invThree === "innovation in interior design") {

      $("#div_selected_credit_link_three").hide();
      $("#div_narrative_invovation_three").show();
      $("#div_description_narrative_intent_three").show();  
      $("#div_geo_tagged_videos_three").show();
      $("#div_narrative_performance_three").hide();
      $("#div_illustrations_cut_sheets_three").show();
      $("#div_exemplary_performance_in_a_credit_select_three").hide();
      $('#exemplary_performance_in_a_credit_select_three').val(''); 
      $("#exemplary_performance_in_a_credit_select_three").removeAttr("required").val('');

  }
  else {
      $("#div_selected_credit_link_three").hide();
      $("#div_narrative_invovation_three").hide();
      $("#div_description_narrative_intent_three").hide();
      $("#div_illustrations_cut_sheets_three").hide();
      $("#div_geo_tagged_videos_three").hide();
      $("#div_narrative_performance_three").hide();
      $("#div_exemplary_performance_in_a_credit_select_three").hide();
      $('#exemplary_performance_in_a_credit_select_three').val(''); 
      $("#exemplary_performance_in_a_credit_select_three").removeAttr("required").val('');
  }
});

$(Document).ready(function () {
  let invFour = $("#select_innovation_four")
    .val()
    .toString()
    .trim()
    .toLowerCase();
  if (invFour === "exemplary performance") {
      $("#div_narrative_invovation_four").hide();
      $("#div_description_narrative_intent_four").hide();
      $("#div_illustrations_cut_sheets_four").hide();
      $("#div_geo_tagged_videos_four").hide();
      $("#div_exemplary_performance_in_a_credit_select_four").show();
      $("#div_selected_credit_link_four").show();
      $("#exemplary_performance_in_a_credit_select_four").attr("required", true);

      $("#div_narrative_invovation_four_doc").hide();
        $("#div_description_narrative_intent_four_doc").hide();
        $("#div_illustrations_cut_sheets_four_doc").hide();
        $("#div_geo_tagged_videos_four_doc").hide();
        // $("#div_narrative_performance_four").show();
        


  } else if (invFour === "innovation in interior design") {

      $("#div_selected_credit_link_four").hide();
      $("#div_selected_credit_link_four_doc").hide();
      $("div#narrative_performance_four_doc").hide();
    //   $("#div_narrative_performance_four").hide();
      $("#div_narrative_invovation_four").show();
      $("#div_description_narrative_intent_four").show();  
      $("#div_geo_tagged_videos_four").show();
      $("#div_illustrations_cut_sheets_four").show();
      $("#div_narrative_performance_four").hide();
      $("#div_exemplary_performance_in_a_credit_select_four").hide();
      $("div#exemplary_performance_in_a_credit_select_four_doc").hide();
      $('#exemplary_performance_in_a_credit_select_four').val(''); 
      $("#exemplary_performance_in_a_credit_select_four").removeAttr("required").val('');

  }
  else {
      $("#div_selected_credit_link_four").hide();
      $("#div_narrative_invovation_four").hide();
      $("#div_description_narrative_intent_four").hide();
      $("#div_illustrations_cut_sheets_four").hide();
      $("#div_geo_tagged_videos_four").hide();
      $("#div_narrative_performance_four").hide();
      $("#div_exemplary_performance_in_a_credit_select_four").hide();
      $('#exemplary_performance_in_a_credit_select_four').val(''); 
      $("#exemplary_performance_in_a_credit_select_four").removeAttr("required").val('');
      
  }

});





// if (subtab == 'igbc_accredited_professional') {

//     // On page load check the current value
//     if ($("#compliances_accredited").val() == "Yes") {
//         $("#div_narrative_igbc_accredited_professional").show();
//         $("#div_certificate_igbc_ap").show();
        
        
//     } else {
//          $("#div_narrative_igbc_accredited_professional").hide();
//         $("#div_certificate_igbc_ap").hide();
//          $("div#narrative_igbc_accredited_professional_doc").hide();
//         $("div#certificate_igbc_ap_doc").hide();
//     }

//     // On change of dropdown value
//     $('#compliances_accredited').change(function() {
//         if ($(this).val() == "Yes") {
//             $("#div_narrative_igbc_accredited_professional").show();
//              $("#div_certificate_igbc_ap").show();
            
//         } else {
//             $("#div_narrative_igbc_accredited_professional").hide();
//             $("#div_certificate_igbc_ap").hide();
//             $("div#narrative_igbc_accredited_professional_doc").hide();
//             $("div#certificate_igbc_ap_doc").hide();
//         }
//     });
// }

// if (subtab == 'igbc_accredited_professional') {

//     // Helper: hide + clear inputs
//     function hideAndClear(selector) {
//         $(selector)
//             .hide()
//             .find("input, select, textarea").val('');
//         $(selector)
//             .find("input[type=checkbox], input[type=radio]").prop("checked", false);
//     }

//     // On page load check the current value
//     if ($("#compliances_accredited").val() == "Yes") {
//         $("#div_narrative_igbc_accredited_professional").show();
//         $("#div_certificate_igbc_ap").show();
//     } else {
//         hideAndClear("#div_narrative_igbc_accredited_professional, #div_certificate_igbc_ap");
//         $("div#narrative_igbc_accredited_professional_doc, div#certificate_igbc_ap_doc").hide();
//     }

//     // On change of dropdown value
//     $('#compliances_accredited').change(function() {
//         if ($(this).val() == "Yes") {
//             $("#div_narrative_igbc_accredited_professional").show();
//             $("#div_certificate_igbc_ap").show();
//         } else {
//             hideAndClear("#div_narrative_igbc_accredited_professional, #div_certificate_igbc_ap");
//             $("div#narrative_igbc_accredited_professional_doc, div#certificate_igbc_ap_doc").hide();
//         }
//     });
// }

if (subtab == 'igbc_accredited_professional') {

    // Helper: hide + clear inputs
    function hideAndClear(selector) {
        $(selector)
            .hide()
            .find("input, select, textarea").val('');
        $(selector)
            .find("input[type=checkbox], input[type=radio]").prop("checked", false);
    }

    // On page load check the current value
    if ($("#compliances_accredited").val() == "Yes") {
        $("#div_narrative_igbc_accredited_professional").show();
        $("#div_certificate_igbc_ap").show();
    } else {
        // Just hide (do NOT clear here, so saved data still displays correctly)
        $("#div_narrative_igbc_accredited_professional").hide();
        $("#div_certificate_igbc_ap").hide();
        $("div#narrative_igbc_accredited_professional_doc, div#certificate_igbc_ap_doc").hide();
    }

    // On change of dropdown value
    $('#compliances_accredited').change(function() {
        if ($(this).val() == "Yes") {
            $("#div_narrative_igbc_accredited_professional").show();
            $("#div_certificate_igbc_ap").show();
        } else {
            // NOW clear when user switches to No
            hideAndClear("#div_narrative_igbc_accredited_professional, #div_certificate_igbc_ap");
            $("div#narrative_igbc_accredited_professional_doc, div#certificate_igbc_ap_doc").hide();
        }
    });
}

