# Laravel → MERN field visibility flow

## End-to-end (Laravel)

1. **Route** — User opens certification for a project (e.g. Green Homes checklist).
2. **Controller** — Loads project, rating type, active tab/subtab (`$activeMenu`, `$activeSubmenu`), and field values via helpers like `__get_rating_data`.
3. **Blade** — `igbc-frontend/src/index.blade.php` renders the form:
   - Each field is wrapped in `#div_{fieldName}` (or `motionDiv#field_doc` for uploads).
   - Global JS sets `subtab` to the current subtab slug.
4. **Scripts** — `@push` block loads jQuery scripts from `public/js/core/` (copied under `igbc-backend/src/rating-config/laravel-scripts/`):
   - `sustainable.js` when `$activeSubmenu == 'sustainable_design'`
   - `material_calculation.js` when `$activeSubmenu == 'material_resources'`
   - `annex.js` for water conservation annexes
   - `energy-lighting.js`, `air_conditioner.js`, `interiorhome.js`, `existing_building.js`, `factory.js` for many energy/indoor subtabs
   - `new-building.js` when `$rating_type[0] == 1`
   - See `index.blade.php` lines ~2668–2709.
5. **Field behavior** — Each script gates on `if (subtab === "…")`, binds `.change()` on controls, and calls helpers that `.show()` / `.hide()` `#motionDiv_*` wrappers.

Example (daylighting in `factory.js`):

```js
if (subtab === "daylighting") {
  factoryindoor($("#daylight_approch").val(), false);
  $("#daylight_approch").change(function () {
    factoryindoor($(this).val(), true);
  });
}
```

## MERN equivalent

| Laravel | MERN |
|---------|------|
| Blade field wrappers | `DynamicForm` + `isFieldVisibleByRules` |
| `subtab` global | `tab` / `subtab` props from workspace navigation |
| jQuery `.show()` / `.hide()` | `fieldRules.showWhen` / `hideWhen` evaluated in `field-rules.engine.ts` and `igbc-frontend/src/lib/fieldRules.ts` |
| `clearData` on change | `getFieldsHiddenByRules` clears values when a controller changes |
| Static JSON in Laravel | `GET /projects/:id/certification-workspace` → `config` + `fieldRules` |
| Manual TS rules | `field-rules/rules/*.rules.ts` (override generated where needed) |
| Bulk port from JS | `node scripts/generate-laravel-field-rules.mjs` → `generated/laravel-field-rules.json` |

## Regenerating rules from Laravel JS

```bash
cd igbc-backend
npm run generate:field-rules
```

Restart the API after regenerating so workspace payloads include updated `fieldRules`.

## Rating keys

Use registry keys from `rating-config.registry.ts`: `green_homes`, `green_factories`, `green_new_buildings`, `green_existing_buildings`, `green_interiors`.

Tab slugs come from each rating’s `config.json` (e.g. Green Homes uses `energy_efficency`, not `energy_efficiency`).
