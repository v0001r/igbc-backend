# Green Homes annexure data (`data/greenhome/`)

**Architecture doc:** [`docs/ANNEXURE_RENDERING_FLOW.md`](../../../../docs/ANNEXURE_RENDERING_FLOW.md) (repo root `docs/` folder).

MERN-native annexure definitions for **IGBC Green Homes** (rating key `green_homes`, config version `3`). Loaded alongside legacy `data/annexures/green_homes/3/` when `buildAnnexureSchemaIndex()` runs.

**Laravel blades:** All `*.blade.php` under `data/laravel-annexure-blades/` have been removed from this repo. Annex tables that still say “Blade source” refer to the former Laravel template (for traceability). Only `annex-setup.json` remains in that folder.

## Folder layout

```
data/greenhome/
  README.md
  3/
    shared/
      lpd-baseline-spaces.json    # Baseline LPD catalog (slug → W/sq.m)
    energy_efficency/             # Config tab slug (note spelling)
      annex_lpd_calculation.json  # Annex EE 1: LPD Calculation
    material_resources/
      annexure_waste_management.json  # Annex MR 2: Waste Management Sheet
```

Path key in workspace API: `energy_efficency/annex_lpd_calculation` (tab/subtab from `configs/greenhomes/config.json`).

## Completed annex: LPD Calculation

| Item | Value |
|------|--------|
| Blade source | `data/laravel-annexure-blades/annex_lpd_calaculations.blade.php` |
| JSON schema | `3/energy_efficency/annex_lpd_calculation.json` |
| Route | `annexure-blade-routes.json` → tab `energy_efficency`, subtab `annex_lpd_calculation` |
| Laravel storage table | `material_resources` (`storageTable` in JSON; matches blade hidden `table`) |
| Rating type | `ratingTypeIds: [2]` |

### Config structure

- **table**: 10 columns (6 editable + 4 computed readonly).
- **rowPipeline**: per-row baseline lookup + annual proposed + basecase kW + annual base consumption.
- **scalarPipeline**: footer totals and savings percentages.
- **summary**: six readonly summary fields (same params as scalars).
- **baselineCatalogPath**: `shared/lpd-baseline-spaces.json` — loader merges options into `applicable_space_lpd` and `lookupMaps.lpdBaselines`.

### Calculation mapping (Blade jQuery → JSON expr)

| Output | Formula | Decimals |
|--------|---------|----------|
| `baseline_space_lpd` | `LPD_MAP[applicable_space_lpd]` via `mapGet` / `lpdBaselines` | as catalog |
| `annual_space_lpd` | `(proposed_space_lpd × hours_op_space_lpd) × 365` | 2 |
| `basecase_space_lpd` | `(area_space_lpd × baseline_space_lpd) / 1000` | 4 |
| `annual_consumption_space_lpd` | `(hours_op_space_lpd × basecase_space_lpd) × 365` | 2 |
| `total_annual_proposed_lpd` | sum all `annual_space_lpd` | 2 |
| `total_annual_consumption_lpds` | sum `annual_space_lpd` excluding two dwelling/guest slugs | 2 |
| `total_consumption_base_lpd` | sum all `annual_consumption_space_lpd` | 2 |
| `total_comnon_area_lpds` | sum base annual excluding same two slugs | 2 |
| `overall_energy_savings_lpd` | `(totalBase − totalAll) / totalBase × 100` if totalBase > 0 | 2 |
| `common_area_energy_savings_lpd` | `(totalhalfbase − totalAfterTwo) / totalhalfbase × 100` if totalhalfbase > 0 | 2 |

**Excluded space slugs** (common-area totals only):

- `dwelling_unit_level__apartments__villas__gated_communities`
- `guest_house__hostels__service_apartments`

**Slug rule** (must match Laravel): `strtolower(str_replace([' ', ',', '-'], '_', space_type))` — slashes are not replaced.

### Missing / deferred dependencies

| Dependency | Blade behavior | MERN status |
|------------|----------------|-------------|
| `__baseline_lpd_data()` | DB-driven space list + baselines | Stand-in catalog in `lpd-baseline-spaces.json`; **sync from Laravel DB export** |
| `reqularly_occupied_spaces` row count | Initial row count = count of that param if > 0, else 5 | **Not wired** — uses `defaultRowCount: 5` + max length from saved arrays |
| `storageTable` | Hidden field `material_resources` | Documented on schema; save path still uses workspace tab/subtab (verify API maps table if needed) |
| 2-decimal input clamp | jQuery on `input[type=number]` | Optional UX in `DynamicTable` (not required for calc accuracy) |
| Add row clone last row | Clears new row | MERN `onAddRow` adds empty row (equivalent UX) |

### Applicable Spaces dropdown — source of values

| Layer | Source |
|--------|--------|
| **Laravel (production)** | PHP helper `__baseline_lpd_data()` — rows from the IGBC database (`space_type` + `baseline` W/sq.m). Blade builds options with slug = `strtolower(str_replace([' ', ',', '-'], '_', space_type))`. |
| **MERN (this repo)** | `3/shared/lpd-baseline-spaces.json` — static catalog aligned to Annexure I space-by-space + prescriptive categories until a DB export is wired. |
| **At API load** | `enrichSchemaFromGreenhomeCatalog()` merges catalog into `table.columns[].options` and `lookupMaps.lpdBaselines` for calculations. |

The dropdown list in the UI is **not hard-coded in React**; it comes from the workspace schema payload (`applicable_space_lpd.options`). To match Laravel exactly after a DB change, update `lpd-baseline-spaces.json` (or replace it with an API-fed catalog).

Footer totals use integrated **`<tfoot>`** on the same table as the Blade `annex_lpd_calaculations` layout (two-column totals + full-width savings rows).

### Frontend render requirements

Uses existing **table** mode (no new renderer):

1. `CertificationSectionRouter` → `AnnexureRenderer` when schema is `table`, `comparison`, or `reference` (see `hasConfigAnnex` in `CertificationSectionRouter.tsx`).
2. **Expression ops** in `annexureExprEval.ts`: `mapGet`, `sumRowsExclude`, `formatNum`; `lookupMaps` passed from schema in `runAnnexureCalculations`.
3. **Live recalc**: `useMemo` on `draftRows` / `scalarSeed` — any cell change re-runs row + scalar pipelines.
4. **Save**: `buildSavePayloadFromAnnex` — column params as JSON arrays; scalars as single values (same as Master Material).
5. **Types**: keep `igbc-frontend/src/annexure/annexureTypes.ts` aligned with `annexure-schema.types.ts`.

Restart backend after JSON/catalog changes so `buildAnnexureSchemaIndex` reloads enriched schema (select options + `lookupMaps`).

## Completed annex: Simulation Method Input

| Item | Value |
|------|--------|
| Blade source | `data/laravel-annexure-blades/simulaition_method.blade.php` |
| JSON schema | `3/energy_efficency/simulaition_method.json` |
| Workspace key | `energy_efficency/simulaition_method` |
| Render mode | `comparison` — PARAMETERS / BASE CASE / DESIGN CASE textareas, no calculations |
| Storage | `material_resources`; each field saved as JSON array `["value"]` (Laravel `param[]`) |

Sections: BUILDING ENVELOPE, LIGHTING SYSTEMS, HVAC SYSTEM (all fields from Blade, including rows below COP).

## Completed annex: Simulation Method Output

| Item | Value |
|------|--------|
| Blade source | `simulaition_method_output.blade.php` |
| JSON | `3/energy_efficency/simulaition_method_output.json` |
| Workspace key | `energy_efficency/simulaition_method_output` |
| Render mode | `table` + integrated `footerRows` |

**Live calculations (matches Blade JS):**

| Step | Formula |
|------|---------|
| Row `baseline_average` | `(baseline_simulation + baseline_90 + baseline_180 + baseline_270) / 4` |
| Column totals | Sum of each column across rows |
| Net rows | `total_* − simulation_*` per orientation |
| `overall_energy_savings_output` | `(simulation_net_average − simulation_net_proposed) / simulation_net_average × 100` if net average > 0 |

Footer row **Onsite R.E genenration** fields are editable; totals and savings recalc on every change.

## Completed annex: RHW 1.2 Daylight Summary

| Item | Value |
|------|--------|
| Blade source | `rwh-one_one.blade.php` |
| JSON | `3/resident_health_wellbeing/annex_rwh_one_one.json` |
| Workspace key | `resident_health_wellbeing/annex_rwh_one_one` |
| Render mode | `table` — rows synced from Annex RHW 1.1 (no Add row / remove row) |

**Source annex:** `annex_rwh_one` → `dwelling_type` → `dwelling_name` (readonly); `percentage_home` → `percentage_dwelling` (prefill, editable).

**Footer:** min positive `percentage_dwelling` → Compliance label (≥95 / ≥75 / ≥50 / Doesn't meet).

## Completed annex: WC 1 Rainwater Calculation

| Item | Value |
|------|--------|
| Blade source | `annexOne.blade.php` |
| JSON | `3/water_conservation/annex_wc_one.json` |
| Workspace key | `water_conservation/annex_wc_one` |
| Render mode | `rainwater` |

**Surface types:** from `shared/rainwater-surface-types.json` (same data as `laravel-annexure-blades/annex-setup.json`) → run-off coefficient auto-fill.

**Calcs:** average peak rainfall; one-day rainfall from case + average; impervious = area × coefficient; mandatory capacity; meets requirement vs **Water Conservation Details** `rainwater_harvesting_capacity`.

## Completed annex: WC 2 Water Efficiency Calculation

| Item | Value |
|------|--------|
| Blade source | `annexTwo_old.blade.php` (`annex_wc_two`); `annexTwo.blade.php` (`annex_wc_two_copy`) |
| JSON | `3/water_conservation/annex_wc_two.json`, `annex_wc_two_copy.json` |
| Workspace key | `water_conservation/annex_wc_two` |
| Render mode | `waterEfficiency` |

**Preset rows:** full/half flush, health faucet, taps, kitchen sink, urinal — occupancy from `occupancy_green` / `occupancy` on project details.

**Dynamic rows:** **Add More** — `fixture_type[]`, `shower[]` (detail), status, duration, daily uses, occupancy, base flow, unit (LPF/LPM), proposed flow; daily use = duration × daily × occupancy × flow when status is Yes.

**Summary:** flush (black) vs flow (grey) daily totals; annual = daily × `annual_days` (default 365); % savings = (base annual − proposed annual) / base annual × 100; **Meets Mandatory Requirement** = Yes when savings % ≥ 0.

## Completed annex: WC 3 Water Balance Calculation

| Item | Value |
|------|--------|
| Blade source | `annexThree.blade.php` |
| JSON | `3/water_conservation/annex_wc_three.json` |
| Workspace key | `water_conservation/annex_wc_three` |
| Render mode | `waterBalance` |

**Sections:** Water Availability, Demand/Consumption, Wastage, Reuse — each row has Daily (editable) and Annual (= Daily × 365, readonly).

**WC 2 link:** Flush and Flow fixture daily values are readonly, pulled from **Annex WC 2** `flush_proposed_total` and `fixture_proposed_total`.

**Validity:** **Valid** when `availability_daily_total` = `consumption_daily_total` + `waste_daily_total` (Laravel `calculate()` / `annex_three_cal()`).

## Completed annex: WC 4 Waste Water Treatment & Reuse

| Item | Value |
|------|--------|
| Blade source | `annexFour.blade.php` |
| JSON | `3/water_conservation/annex_wc_four.json` |
| Workspace key | `water_conservation/annex_wc_four` |
| Render mode | `wastewaterReuse` |

**Treatment:** `waste_water_generated` = WC 2 `flush_proposed_total` + `fixture_proposed_total`; `stp_capacity` from **Water Conservation Details** `capacity_of_stp` (KLD); user enters `stp_efficency` (0–100%); `treated_daily_water` from `calculate_annex_four()` (capacity × 1000 × efficiency% when waste ≥ STP daily capacity, else waste × efficiency%).

**Reuse table:** Daily inputs → Annual = Daily × 365; totals; **% waste treated** and **% treated water reused** in project.

## Completed annex: RHW 2.1 Natural Ventilation Calculation

| Item | Value |
|------|--------|
| Blade source | `rwh_ventilation_one.blade.php` |
| JSON | `3/resident_health_wellbeing/annex_ventilation_design_one.json` |
| Workspace key | `resident_health_wellbeing/annex_ventilation_design_one` |
| Render mode | `dwelling` / `rowTable` |

**Per-row:** openable % = `(window + door) / floor × 100`; mandatory/credit % from space type lookup; MR/Cr Yes/No vs thresholds.

**Dwelling header:** `rwh_one_coust` — synced into **RHW 2.4** summary (source `one`).

## Completed annex: RHW 2.2 Natural Ventilation (CFD)

| Item | Value |
|------|--------|
| Blade source | `rwh_ventilation_cfd.blade.php` |
| JSON | `3/resident_health_wellbeing/annex_ventilation_design_cfd.json` |
| Workspace key | `resident_health_wellbeing/annex_ventilation_design_cfd` |
| Render mode | `dwelling` / `rowTable` |

**Per-row:** MR Yes/No when minimum ACH ≥ mandatory ACH; Cr Yes/No when minimum ACH ≥ credit ACH (empty when both inputs are zero).

**Per unit footer:** sum floor area → `total_floor_area_cfd`; `Meeting Compliance` → all MR rows Yes; credit column → all Cr rows Yes.

## Completed annex: RHW 2.3 Air-conditioned Ventilation

| Item | Value |
|------|--------|
| Blade source | `rwh_ventilation_air_ventilation.blade.php` |
| JSON | `3/resident_health_wellbeing/annex_ventilation_design_air_conditioned.json` |
| Workspace key | `resident_health_wellbeing/annex_ventilation_design_air_conditioned` |
| Render mode | `dwelling` / `rowTable` |

**Per-row:** mandatory ACH = occupancy × 5; credit ACH = occupancy × 6.5; MR/Cr compare designed CFM to computed thresholds.

**Per unit footer:** `total_floor_area_air`; same compliance Yes/No aggregation as CFD.

## Completed annex: RHW 2.4 Summary of Ventilation Design

| Item | Value |
|------|--------|
| Blade source | `summary_two_one_ventilation.blade.php` |
| JSON | `3/resident_health_wellbeing/summanry_of_ventilation_two_one.json` |
| Workspace key | `resident_health_wellbeing/summanry_of_ventilation_two_one` |
| Render mode | `table` — combined rows from upstream ventilation annexes |

**Upstream (CFD example):** `annex_ventilation_design_cfd` → `rwh_one_coust_lpd` (dwelling name), `total_complied_area_ventilation` (MR), `percentage_home` (Cr).

**Floor filter:** annex **one** and **CFD/air** always; annex **two** when `no_of_floors` ≥ 5 on `ventilation_design_enhanced`.

**Footer:** overall Yes/No if any row is No for mandatory / enhanced columns.

## Completed annex: RHW 1.1 Daylighting (Prescriptive)

| Item | Value |
|------|--------|
| Blade source | `rwh-one.blade.php` |
| JSON | `3/resident_health_wellbeing/annex_rwh_one.json` |
| Workspace key | `resident_health_wellbeing/annex_rwh_one` |
| Render mode | `dwelling` / `rowTable` — **Add Dwelling Unit** + **Add Row** per unit |

**Per-row:** glazing target from space type catalog; glazing factor achieved = `((window×VLT×0.2)+(skylight×skylight VLT))/floor`; Yes/No criteria; complied area = floor when Yes.

**Per unit footer:** total floor area, total complied area, percentage = complied ÷ floor × 100.

## Completed annex: Waste Management Sheet

| Item | Value |
|------|--------|
| Blade source | `annexMasterWaste.blade.php` |
| JSON | `3/material_resources/annexure_waste_management.json` |
| Workspace key | `material_resources/annexure_waste_management` |
| Render mode | `table` — **Add More** rows, grouped header |

**Live calculations:** `total_generated` / `total_reused` = column sums; `percentage_waste_diverted_landfill` = `round((total_reused / total_generated) × 100)` when both totals &gt; 0, else `0`.

**Row params:** `materials`, `generated`, `reused`, `recycle_used` (diversion category select).

## Completed annex: Energy Annex / Building Profile (multi-tower)

| Item | Value |
|------|--------|
| Blade source | `energy_annex.blade.php` |
| JSON | `3/energy_efficency/energy_annex.json` |
| Workspace key | `energy_efficency/energy_annex` |
| Render mode | `dwelling` — **Add Tower** clones per-tower tables |
| Save | Laravel-style `paramName` rows with JSON `{"1":…,"2":…}` keyed by tower index |

**Per-tower live calculations:** `total_envelope_area = length × height`, `total_wall_area = envelope − glass`, column totals, `WWR = total_glass / total_envelope`.

**Global:** `location_select` → auto `latitude` / `climatic_zone` from `shared/location-climatic.json`.

## Adding more Green Homes annexures

1. Add JSON under `data/greenhome/3/{tab_slug}/annex_*.json`.
2. Match `tab`/`subtab` slugs in `configs/greenhomes/config.json` and `annexure-blade-routes.json`.
3. Reuse `rowPipeline` / `scalarPipeline` expression AST; extend ops in backend types + frontend `annexureExprEval.ts` if needed.
4. Shared catalogs → `3/shared/*.json` + `baselineCatalogPath` or custom loader enrichment.
