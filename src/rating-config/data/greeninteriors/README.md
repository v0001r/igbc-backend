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

## Adding another annex

1. Add subtab in `configs/greeninteriors/greeninteriors.json` if missing.
2. Create `data/greeninteriors/{version}/{tab}/{subtab}.json` with `ratingTypeIds: [5]`.
3. Restart the API (schemas are read at workspace load).
4. Use `renderMode: "table"` with `rowPipeline` / `scalarPipeline`, or a dedicated render mode if needed.

## Laravel param names

Keep param names identical to Blade `name="..."` attributes so existing `rating_data` rows hydrate correctly (e.g. `reqularly_occupied_spaces` typo preserved).

## Related docs

- [`docs/ANNEXURE_RENDERING_FLOW.md`](../../../docs/ANNEXURE_RENDERING_FLOW.md)
