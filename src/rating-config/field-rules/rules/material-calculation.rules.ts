import type { FieldRuleSet } from "../field-rules.types";

/** Ported from `laravel-scripts/material_calculation.js` */
export const materialCalculationRules: FieldRuleSet = {
  laravelScript: "material_calculation",
  showWhen: [
    {
      targets: [
        "option_building_reuse_narrative",
        "option_building_reuse_narrative_doc",
        "percentange_structural_non_structural_area",
        "percentange_structural_non_structural_area_doc",
        "option_building_reuse_photographs",
        "option_building_reuse_photographs_doc",
      ],
      when: { field: "option_building_reuse", op: "checked" },
    },
    {
      targets: [
        "option_salvage_materials_narrative",
        "option_salvage_materials_narrative_doc",
        "quotation_purchase_invoice_payment_receipts",
        "quotation_purchase_invoice_payment_receipts_doc",
        "photographs_of_salvage_materials_before_and_after",
        "photographs_of_salvage_materials_before_and_after_doc",
        "percent_salavged_material_used",
        "percent_salavged_material_used_doc",
      ],
      when: { field: "option_salvage_materials", op: "checked" },
    },
    {
      targets: [
        "option_materials_with_recycled_content_narrative",
        "option_materials_with_recycled_content_narrative_doc",
        "manufacturer_letters_indicating_the_recycled_contents_along_with_the_quantities",
        "manufacturer_letters_indicating_the_recycled_contents_along_with_the_quantities_doc",
        "technical_cutsheets_of_the_proposed_material",
        "technical_cutsheets_of_the_proposed_material_doc",
        "percent_materials_with_recycled_content_used",
        "percent_materials_with_recycled_content_used_doc",
      ],
      when: { field: "option_materials_with_recycled_content", op: "checked" },
    },
    {
      targets: [
        "option_local_materials_narrative",
        "option_local_materials_narrative_doc",
        "manufacturer_vendor_letter_indicating_the_location_of_manufacturing_unit",
        "manufacturer_vendor_letter_indicating_the_location_of_manufacturing_unit_doc",
        "aerial_maps_highlighting_the_distance_of_the_manufacturing_unit_from_the_project_site",
        "aerial_maps_highlighting_the_distance_of_the_manufacturing_unit_from_the_project_site_doc",
        "option_four_purchase_invoice",
        "option_four_purchase_invoice_doc",
        "percent_local_materials_used",
        "percent_local_materials_used_doc",
      ],
      when: { field: "option_local_materials", op: "checked" },
    },
    {
      targets: [
        "option_wood_based_materials_narrative",
        "option_wood_based_materials_narrative_doc",
        "technical_cutsheet_for_composite_wood_coc_certificate_for_fsc_pefc_equivalent_certified_wood",
        "technical_cutsheet_for_composite_wood_coc_certificate_for_fsc_pefc_equivalent_certified_wood_doc",
        "purchase_invoice_indicating_type_of_wood_coc_number",
        "purchase_invoice_indicating_type_of_wood_coc_number_doc",
        "percent_eco_friendly_wood_based_material_used",
        "percent_eco_friendly_wood_based_material_used_doc",
      ],
      when: { field: "option_wood_based_materials", op: "checked" },
    },
    {
      targets: ["embodied_carbon_kg"],
      when: { field: "embodied_carbon", op: "checked" },
    },
    {
      targets: ["operational_carbon_kg"],
      when: { field: "operational_carbon_building", op: "checked" },
    },
  ],
  computeWhen: [
    {
      target: "percent_eco_labelled_interior_furniture",
      computeId: "percent_eco_labelled_interior_furniture",
      sources: ["total_furniture_cost", "total_ecolabelled_furniture_cost"],
    },
  ],
};
