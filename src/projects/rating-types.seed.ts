/** Laravel `rating_type` ids — extend when new systems are added */
export const RATING_TYPE_SEED: Array<{
  id: number;
  name: string;
  abbreviation: string;
  configKey: string | null;
  versionTypes: string[];
}> = [
  { id: 1, name: "IGBC Green New Buildings", abbreviation: "GNB", configKey: "green_new_buildings", versionTypes: ["4"] },
  { id: 2, name: "IGBC Green Homes", abbreviation: "GH", configKey: "green_homes", versionTypes: ["3"] },
  { id: 3, name: "IGBC Green Factory Buildings", abbreviation: "GFB", configKey: "green_factories", versionTypes: ["3", "3.3.1"] },
  { id: 4, name: "IGBC Green Existing Buildings", abbreviation: "EB", configKey: "green_existing_buildings", versionTypes: ["3"] },
  { id: 5, name: "IGBC Green Interiors", abbreviation: "CI", configKey: "green_interiors", versionTypes: ["3"] },
  { id: 6, name: "IGBC Green Affordable Housing", abbreviation: "GAH", configKey: null, versionTypes: ["3"] },
  { id: 7, name: "IGBC Green Healthcare Facilities", abbreviation: "GHF", configKey: null, versionTypes: ["3"] },
  { id: 8, name: "IGBC Green Resorts", abbreviation: "GR", configKey: null, versionTypes: ["3"] },
  { id: 9, name: "IGBC Health & Well Being", abbreviation: "HWB", configKey: null, versionTypes: ["3"] },
  { id: 10, name: "IGBC Green Logistics Parks & Warehouses", abbreviation: "GLPW", configKey: null, versionTypes: ["3"] },
  { id: 11, name: "IGBC Green Service Buildings", abbreviation: "GSB", configKey: null, versionTypes: ["3"] },
  { id: 12, name: "IGBC Green Residential Societies", abbreviation: "GRS", configKey: null, versionTypes: ["3"] },
  { id: 13, name: "IGBC Green Places of Worship", abbreviation: "GPW", configKey: null, versionTypes: ["3"] },
  { id: 14, name: "IGBC Green Schools", abbreviation: "GS", configKey: null, versionTypes: ["3"] },
  { id: 15, name: "IGBC Green Campus", abbreviation: "GC", configKey: null, versionTypes: ["3"] },
  { id: 16, name: "IGBC Green Townships", abbreviation: "GT", configKey: null, versionTypes: ["3"] },
  { id: 17, name: "IGBC Green Cities", abbreviation: "IGC", configKey: null, versionTypes: ["3"] },
  { id: 18, name: "IGBC Green Existing Cities", abbreviation: "GEC", configKey: null, versionTypes: ["3"] },
  { id: 19, name: "IGBC Green Landscapes", abbreviation: "GL", configKey: null, versionTypes: ["3"] },
  { id: 20, name: "IGBC Green Villages", abbreviation: "GV", configKey: null, versionTypes: ["3"] },
  { id: 21, name: "Green Data Centers", abbreviation: "DC", configKey: null, versionTypes: ["3"] },
  { id: 22, name: "Nest", abbreviation: "NE", configKey: null, versionTypes: ["3"] },
  { id: 23, name: "Nest Plus", abbreviation: "NP", configKey: null, versionTypes: ["3"] },
  { id: 24, name: "IGBC Green Hotels", abbreviation: "GHL", configKey: null, versionTypes: ["3"] },
];
