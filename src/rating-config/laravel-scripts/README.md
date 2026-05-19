# Laravel certification scripts (reference)

Original jQuery scripts from the IGBC Laravel portal. They controlled:

- **Show/hide** of form fields (`#motionDiv_*` wrappers)
- **Readonly** toggles on dependent inputs
- **Live calculations** (row totals, percentages)

## MERN implementation

1. **Generate** — `npm run generate:field-rules` parses these scripts into `../field-rules/generated/laravel-field-rules.json` (49+ subtabs).
2. **Override** — Hand-tuned modules in `../field-rules/rules/*.rules.ts` replace generated rules where needed (e.g. daylighting upload `_doc` fields, EE CR 5 radio cases).
3. **API** — `GET /projects/:id/certification-workspace` returns `fieldRules` keyed by `tab/subtab` for every subtab in the rating config.
4. **React** — `DynamicForm` + `useCertificationFieldRules` evaluate show/hide; `getFieldsHiddenByRules` clears values on change (Laravel `clearData`).

See `../field-rules/LARAVEL-FLOW.md` for route → blade → script mapping.

`JsUtility.js`, `app.js`, `app-menu.min.js` are theme/UI only.

Annex row calculators (`annex.js`, `air_conditioner.js` tables) still need dedicated React annex components beyond field rules.
