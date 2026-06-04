# Choropleth EDA — Bivariate

An interactive bivariate choropleth explorer linking a 3×3 classified map to a scatterplot with OLS regression. Brushing either view highlights the corresponding features in the other.

Built with [D3.js](https://d3js.org). No build step required — plain HTML, CSS, and ES modules.

---

## Live demo

[View on GitHub Pages](#) *(update this link after deploying)*

---

## What it does

- **Bivariate choropleth map** — classifies features into a 3×3 grid based on tertile breaks for two user-selected variables, colored using bivariate color schemes
- **Linked scatterplot** — one dot per feature, X and Y axes matching the two mapped variables, with a full-population OLS regression line
- **Bidirectional selection** — lasso or rectangle selection on either the map or the scatterplot highlights the corresponding features in the other view
- **Selection regression line** — a second regression line draws for the selected subset, so you can immediately compare its slope and r to the full population
- **Summary statistics panel** — mean, median, std deviation, r, and slope for both variables, shown for the full dataset on load and updated for the selection when active, with percentage difference from the full population
- **Floating legend** — 3×3 color matrix with Low/Mid/High labels and class breakpoints
- **6 bivariate color schemes** — all selectable from a visual dropdown in the toolbar
- **Zoom and pan** — scroll wheel, +/− buttons, and a reset button; Shift+drag for lasso selection, Shift+Alt+drag for rectangle

---

## Project structure

```
project/
├── index.html          # Layout and controls — do not edit
├── app.js              # Visualization engine — do not edit
├── config.js           # ← Edit this to use your own data
└── data/
    └── *.geojson       # Drop your GeoJSON file here
```

---

## Using your own data

### 1. Prepare your GeoJSON

Your file must meet these requirements before loading:

- **Coordinate system: WGS 84 (EPSG:4326)** — standard lat/lng decimal degrees. If your file uses a projected CRS (e.g. State Plane feet, UTM metres) you must reproject it first. [QGIS](https://qgis.org) and the Python `pyproj` library can both do this.
- **Geometry types: Polygon or MultiPolygon** only
- **All variables must be pre-computed numeric fields** in the feature properties. The tool does not perform calculations — prepare percentages, rates, and derived fields in your data before loading.
- **A unique ID field** — one property that is a unique integer or string identifier per feature (e.g. FIPS code, GEOID, an auto-incremented `fid`)
- **No null geometries** — features with missing or empty geometries should be removed before loading

A good workflow for preparation is QGIS (for reprojection and field calculation) or GeoPandas in Python. See [Data preparation notes](#data-preparation-notes) below.

### 2. Place your file

Copy your GeoJSON file into the `data/` folder.

### 3. Edit config.js

Open `config.js` and update the following:

```javascript
// Path to your GeoJSON file
export const DATA_FILE = './data/YourFile.geojson';

// What one feature is called (singular), e.g. 'county', 'tract', 'zip code'
export const GEOGRAPHY_LABEL = 'tract';

// A property that uniquely identifies each feature
export const FEATURE_ID_FIELD = 'GEOID';

// A human-readable name shown in tooltips
export const FEATURE_NAME_FIELD = 'NAME';

// Optional secondary label in tooltips (e.g. state, borough). Set null to omit.
export const FEATURE_GROUP_FIELD = 'STATE_NAME';
```

Then replace the `VARIABLES` array with entries for your own fields:

```javascript
export const VARIABLES = [
  {
    id:    'med_income',           // unique key, no spaces
    label: 'Median Household Income',  // shown in dropdowns and axes
    prop:  'MED_HH_INC',          // exact property name in your GeoJSON
    fmt:   v => '$' + Math.round(v).toLocaleString(),  // tooltip/stats formatting
    unit:  '$',                   // short unit for regression slope label
  },
  {
    id:    'pct_college',
    label: 'Percent College Educated',
    prop:  'PCT_COLLEGE',
    fmt:   v => v.toFixed(1) + '%',
    unit:  '%',
  },
  // Add as many variables as you like — any two can be selected as X and Y
];
```

Finally set your defaults:

```javascript
export const DEFAULT_VAR_X = 'med_income';   // id of the variable shown on X axis at load
export const DEFAULT_VAR_Y = 'pct_college';  // id of the variable shown on Y axis at load
export const DEFAULT_BIVARIATE_SCHEME = 'DkBlue_DkRed';
```

### 4. Serve and open

You need a local web server because the app loads data via `fetch()`, which browsers block on `file://` URLs.

**Python (simplest):**
```bash
cd your-project-folder
python3 -m http.server 8000
# then open http://localhost:8000
```

**Node / npx:**
```bash
npx serve your-project-folder
```

**VS Code:** Install the "Live Server" extension → right-click `index.html` → Open with Live Server.

---

## Interaction reference

| Action | Effect |
|---|---|
| Shift + drag on map | Freehand lasso selection of features |
| Shift + Alt + drag on map | Rectangle selection of features |
| Shift + drag on scatterplot | Freehand lasso selection of points |
| Shift + Alt + drag on scatterplot | Rectangle selection of points |
| Scroll wheel on map | Zoom in/out centered on cursor |
| Drag on map (no Shift) | Pan |
| +/− buttons | Zoom in/out |
| ⊙ button | Reset map to full extent |
| Hover over feature or dot | Tooltip with variable values |
| Clear selection button | Reset both views |
| Variable dropdowns (X/Y) | Change mapped and plotted variables |
| Symbology dropdown | Change bivariate color scheme |

---

## Deploying to GitHub Pages

1. Push the entire project folder to a GitHub repository
2. Go to **Settings → Pages → Source**: `main` branch, `/ (root)`
3. Your tool will be live at `https://<username>.github.io/<repo>/`

No build step required.

---

## Data preparation notes

### Reprojecting in Python

```python
import geopandas as gpd

gdf = gpd.read_file('your_file.shp')          # or .geojson
gdf = gdf.to_crs('EPSG:4326')                 # reproject to WGS 84
gdf.to_file('your_file_wgs84.geojson', driver='GeoJSON')
```

### Adding a unique ID field

```python
gdf['fid'] = range(1, len(gdf) + 1)
```

### Simplifying geometry for web performance

For large datasets (1,000+ features), simplifying geometry significantly reduces file size and improves rendering speed:

```python
from shapely import simplify
gdf['geometry'] = gdf['geometry'].apply(
    lambda g: simplify(g, tolerance=0.0003, preserve_topology=True)
)
```

Tolerance values around 0.0002–0.0005 degrees work well for city/regional data. Increase for national datasets.

### Recommended file sizes

| Features | Target size | Notes |
|---|---|---|
| < 500 | < 1 MB | No simplification needed |
| 500–2,000 | 1–3 MB | Light simplification recommended |
| 2,000–5,000 | 2–5 MB | Moderate simplification required |
| 5,000+ | Consider vector tiles | SVG rendering becomes slow above ~5k features |

---

## Color schemes

Bivariate color schemes are adapted from the work of **Joshua Stevens**, whose palettes for bivariate choropleth mapping are the cartographic standard for this technique. The original schemes and methodology are described at [joshstevens.net/bivariate-choropleth-maps](https://www.joshuastevens.net/cartography/make-a-bivariate-choropleth-map/).

The six schemes included are:

| ID | Description |
|---|---|
| `DkBlue_DkRed` | Blue (X) × Red (Y) — high contrast, general purpose |
| `DkViolet_DkGreen` | Violet (X) × Green (Y) |
| `DkCyan_DkBrown` | Cyan (X) × Brown (Y) |
| `GrPink` | Green (X) × Pink (Y) — softer contrast |
| `PurpleOrange` | Purple (X) × Orange (Y) |
| `BlueTan` | Blue (X) × Tan (Y) |

---

## Demo data

The included demo dataset covers **NYC Modified Zip Code Tabulation Areas (MODZCTAs)** with COVID-19 vaccination rates and demographic data as of March 26, 2021.

**Source:** NYC Department of Health and Mental Hygiene (DOHMH)
NYC COVID-19 Vaccine Data — [github.com/nychealth/covid-vaccine-data](https://github.com/nychealth/covid-vaccine-data)

**Geography:** NYC MODZCTA boundaries are derived from US Census ZIP Code Tabulation Areas, modified by DOHMH for public health reporting. Original boundaries available at [NYC Open Data](https://data.cityofnewyork.us).

---

## Libraries and tools

| Library | Use | License |
|---|---|---|
| [D3.js v7](https://d3js.org) | Visualization, mapping, statistics | ISC |

---

## Classification method

Features are classified into three equal-frequency classes (tertiles) for each variable independently. The 3×3 bivariate grid assigns each feature a color based on the intersection of its X class and Y class. Tertile classification ensures roughly equal numbers of features in each class, which produces the most visually balanced bivariate map for most datasets.

---

## Related tools

This project is part of a series of linked-view exploratory data analysis tools:

- **Choropleth EDA — Univariate** — single variable choropleth with linked histogram, multiple classification schemes, and ColorBrewer palettes
- **Choropleth EDA — Bivariate** — this tool

---

## License

MIT — free to use, adapt, and redistribute with attribution.
