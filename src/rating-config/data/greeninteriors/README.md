# Green Interiors annexure data (`data/greeninteriors/`)

MERN-native annexure definitions for **IGBC Green Interiors** (`ratingKey`: `green_interiors`, `ratingTypeId`: **5**).

Loaded when `buildAnnexureSchemaIndex()` runs for a project with `version_type` matching the folder name (e.g. `3` → `data/greeninteriors/3/`).

## Folder layout

```
data/greeninteriors/
  README.md
  3/
    {tab_slug}/
      {sub_slug}.json   → workspace key "{tab_slug}/{sub_slug}"
```

## Implemented annexes (version 3)

| Tab | Subtab | JSON file | Notes |
|-----|--------|-----------|-------|
| `sustainable_design` | `area_space_circulation` | `3/sustainable_design/area_space_circulation.json` | Area statement, circulation, sensors (from `annexAreaSpacesCirculation.blade.php`) |
| `water_conservation` | `annex_wc_one` | `3/water_conservation/annex_wc_one.json` | Rainwater calculation (`annexOne.blade.php`); render mode `rainwater`; 15 fixed surface rows; Case A only |
| `water_conservation` | `annex_wc_two` | `3/water_conservation/annex_wc_two.json` | FTE + water fixtures (`annexTwo.blade.php`); render mode `greenInteriorsWcTwo`; typology-based baselines |
| `energy_efficency` | `annex_conditioned_spaces` | `3/energy_efficency/annex_conditioned_spaces.json` | Air conditioning systems + conditioned area (`annexConditionedSpaces.blade.php`); render mode `conditionedSpaces`; area rows from `area_space_circulation` (regularly occupied + air conditioned) |
| `energy_efficency` | `annex_natural_venilation` | `3/energy_efficency/annex_natural_venilation.json` | Natural ventilation (`annexNaturalVenilation.blade.php`); render mode `naturalVentilation`; rows from `area_space_circulation` (regularly occupied + non air conditioned); carpet sq ft → sq m |
| `energy_efficency` | `lpd_building_area_method` | `3/energy_efficency/lpd_building_area_method.json` | LPD building area method; render mode `lpdBuildingAreaMethod`; rows from `area_space_circulation`; expandable lighting fixture sub-rows; typology baselines from `shared/lpd-building-typology-baselines.json` |
| `energy_efficency` | `lpd_space_function_method` | `3/energy_efficency/lpd_space_function_method.json` | LPD space function method; render mode `lpdSpaceFunctionMethod`; rows pre-filled from `area_space_circulation`; per-space baseline from `shared/lpd-baseline-spaces-interiors.json`; scoring field `total_regularly_occupied_area` (percentage reduction) |
| `energy_efficency` | `annexure_onsite_renewable_energy` | `3/energy_efficency/annexure_onsite_renewable_energy.json` | On-site / off-site renewable energy (`annexOneSiteRenewable.blade.php`); render mode `onsiteRenewableEnergy`; monthly rows + live percentage totals |
| `material_resources` | `annexure_master_material` | `3/material_resources/annexure_master_material.json` | Master material calculator (`annexMasterMaterial.blade.php`); render mode `masterMaterial`; material/sub-category dropdowns, local/salvaged/reuse/eco/recycled/wood/furniture costs + summary percentages |
| `material_resources` | `annexure_waste_management` | `3/material_resources/annexure_waste_management.json` | Waste management (`annexMasterWaste.blade.php`); render mode `wasteManagement`; rows from `annexure_master_material` sub-categories; landfill + diversion % |
| `indoor_enviornment_quality` | `annexure_ac_fresh_air` | `3/indoor_enviornment_quality/annexure_ac_fresh_air.json` | Fresh air mechanical ventilation (`annexAc.blade.php`); render mode `acFreshAir`; tab 1 fresh air systems, tab 2 mechanically ventilated area from `area_space_circulation` (regularly occupied + air conditioned); `type_of_fresh_air` dropdown from tab 1 |
| `indoor_enviornment_quality` | `annex_daylight_noise` | `3/indoor_enviornment_quality/annex_daylight_noise.json` | Daylight, outdoor view & noise (`annexDaylightcoTwoNoise.blade.php`); render mode `daylightNoise`; rows from `area_space_circulation` (regularly occupied + air conditioned); daylight + acoustic columns + summary totals |
| `indoor_enviornment_quality` | `annexure_occupant_wellbeing_facility` | `3/indoor_enviornment_quality/annexure_occupant_wellbeing_facility.json` | Occupant wellbeing facilities (`annexOccupantWellbeingFacility.blade.php`); render mode `occupantWellbeing`; dynamic facility rows + `total_recreational` % (feeds checklist `recreational_facilities`) |

## Adding another annex

1. Add subtab in `configs/greeninteriors/greeninteriors.json` if missing.
2. Create `data/greeninteriors/{version}/{tab}/{subtab}.json` with `ratingTypeIds: [5]`.
3. Restart the API (schemas are read at workspace load).
4. Use `renderMode: "table"` with `rowPipeline` / `scalarPipeline`, or a dedicated render mode if needed.

## Laravel param names

Keep param names identical to Blade `name="..."` attributes so existing `rating_data` rows hydrate correctly (e.g. `reqularly_occupied_spaces` typo preserved).

## Related docs

- [`docs/ANNEXURE_RENDERING_FLOW.md`](../../../docs/ANNEXURE_RENDERING_FLOW.md)
