// ============================================================
//  config.js  —  Edit this file to use your own data
// ============================================================

export const DATA_FILE = './data/MODZCTAS_Vaccine_2021.geojson';

// ============================================================
//  PAGE IDENTITY
//  The only page-level text that is not derived from the data.
//  Setting it here keeps index.html untouched when you adapt the
//  tool: app.js writes these into the tab title, the toolbar
//  heading, and the footer credit at load.
// ============================================================

export const PAGE_TITLE = 'Choropleth EDA – Bivariate';

// Footer credit. Inserted as markup so it can carry links — it is
// authored here, not read from the data, so it is trusted. Keep a
// data source and a link back to the source code: a published page
// should always say where its numbers came from.
export const DATA_CREDIT_HTML = `
  Demo data: NYC DOHMH
  <a href="https://github.com/nychealth/covid-vaccine-data" rel="noopener" target="_blank">COVID-19 Vaccine Data</a>.
  Source code, method notes and full citations:
  <a href="https://github.com/ssitari/ChoroplethEDABivariate" rel="noopener" target="_blank">ssitari/ChoroplethEDABivariate</a>.
`;

export const GEOGRAPHY_LABEL  = 'zip code area';
export const FEATURE_ID_FIELD = 'fid';
export const FEATURE_NAME_FIELD  = 'MODZCTA';
export const FEATURE_GROUP_FIELD = 'Area Name';  // shown in tooltip, set null to omit

// ============================================================
//  VARIABLES
//  All mappable numeric fields. Any two can be chosen as X / Y.
//  fmt: function to format a value for display in tooltips/stats
//  unit: short unit string shown on axis labels
// ============================================================

export const VARIABLES = [
  {
    id:    'vax_full',
    label: 'Percent Fully Vaccinated',
    prop:  'Percent Fully Vaccinated',
    fmt:   v => v.toFixed(1) + '%',
    unit:  '%',
  },
  {
    id:    'vax_one',
    label: 'Percent With at Least One Dose',
    prop:  'Percent With at Least One Dose',
    fmt:   v => v.toFixed(1) + '%',
    unit:  '%',
  },
  {
    id:    'over65',
    label: 'Percent Over 65',
    prop:  'Percent Over 65',
    fmt:   v => v.toFixed(1) + '%',
    unit:  '%',
  },
  {
    id:    'white',
    label: 'Percent White',
    prop:  'Percent White',
    fmt:   v => v.toFixed(1) + '%',
    unit:  '%',
  },
  {
    id:    'black',
    label: 'Percent Black',
    prop:  'Percent Black',
    fmt:   v => v.toFixed(1) + '%',
    unit:  '%',
  },
  {
    id:    'hispanic',
    label: 'Percent Hispanic',
    prop:  'Percent Hispanic',
    fmt:   v => v.toFixed(1) + '%',
    unit:  '%',
  },
];

// ============================================================
//  DEFAULTS
// ============================================================

export const DEFAULT_VAR_X = 'over65';
export const DEFAULT_VAR_Y = 'vax_full';

// Bivariate color scheme — choose from BIVARIATE_SCHEMES in app.js:
//   'DkBlue_DkRed', 'DkViolet_DkGreen', 'DkCyan_DkBrown',
//   'GrPink', 'PurpleOrange', 'BlueTan'
export const DEFAULT_BIVARIATE_SCHEME = 'DkBlue_DkRed';

// Color for features with null / no-data values
export const NULL_COLOR = '#d0d0d0';

// Color for selected features in scatterplot overlay
export const SELECTION_COLOR = '#e07b39';

// Opacity for de-emphasised (non-selected) features
export const DEEMPHASIS_OPACITY = 0.2;

// Dot radius in scatterplot (px)
export const DOT_RADIUS = 5;
