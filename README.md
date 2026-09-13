# Storm Ranger — Desktop App (Windows)

A Tampa Bay storm and water station in a single window: live radar with a
forecast loop, the local forecast, National Weather Service warnings, marine
conditions, and a tide and fishing analyzer built on the NOAA gauge.

---

## What is on screen

**Live radar.** A dark map of the Greater Tampa Bay area with two hours of past
radar scans and a projected loop that runs an hour ahead. Drag to pan, use the
+ / − buttons or **Ctrl + scroll** to zoom, and the crosshair button snaps back
to your location. The timeline under the map plays the loop; blue ticks are real
scans, amber ticks are the forecast, and the white **NOW** line divides them.
Dashed rings mark 10, 25 and 50 miles from where you are standing.

**How the forecast loop works.** RainViewer publishes a nowcast feed, and the app
uses it whenever it has frames. It is frequently empty on the keyless feed, so
the app also measures the motion of the rain itself: it compares the last two
scans, finds the displacement that best lines them up, and slides the latest scan
along that track. The legend under the map says which one you are looking at and
which way the storms are moving. If the sky is too empty to correlate, it falls
back to the 700 hPa steering wind from the forecast.

**Forecast.** Current conditions, then a row of tiles covering the day's high and
low, heat index with its NWS danger wording, feels-like, rain chance and amount,
humidity, wind and gusts, UV index, and sunrise/sunset. Below that an hourly
chart with Temperature, Precipitation and Wind tabs — the temperature tab draws a
dashed line for what it actually feels like — and an eight-day strip. Click any
day to move the chart to it.

**Warnings.** Active National Weather Service alerts for your coordinates appear
at the top of the page, colour-coded by severity. Tap one for the full text.

**The right-hand rail is a tabbed analyzer.** Two tabs share the space.

*Marine and boating* answers whether it is worth going out:

- A **sea state** verdict — smooth, light chop, choppy, rough or hazardous — read
  off the wave model, with a caution note when the wind or the seas get up. That
  note is the app doing arithmetic on the numbers shown next to it, not an
  official Small Craft Advisory; real advisories appear in the warnings strip at
  the top of the page.
- Tiles for wave height and the direction it runs from, wave period, swell,
  sea surface temperature, and wind and gusts in knots.
- A **wave outlook** for the next 48 hours. The small-craft line only appears when
  the forecast actually approaches it, so a calm week does not draw as a flat line
  pinned to the axis.
- The **Coastal Waters Forecast** in the forecaster's own words, split by period,
  with a picker for every marine zone the local office issues. On Tampa Bay that
  is the bay itself, Charlotte Harbor, and the Gulf zones out to 20 and 60
  nautical miles. The office is looked up from your coordinates, so this keeps
  working anywhere on a US coast.

*Fishing and tides* pulls from the NOAA CO-OPS gauge at **St. Petersburg
(8726520)**, changeable in Settings. It shows:

- A **bite score** out of 100 with the verdict and every input listed, so you can
  disagree with it. It blends tide flow rate, solunar timing, moon phase, wind and
  the six-hour barometer trend. It is a rule of thumb, not a prediction.
- **Next tide** with a live countdown, the predicted height, and where the water
  is right now.
- A **tide chart** covering the next 22 hours: the predicted curve, the highs and
  lows marked with their times, and the live gauge reading drawn in green over the
  last three hours so you can see surge against prediction.
- A **tide table** for the next couple of days.
- **Station observations** — water temperature, air temperature, wind and gusts,
  barometer with its trend, moon phase, and the surge figure.
- **Solunar periods** — the major windows when the moon is overhead and underfoot,
  and the minor ones at moonrise and moonset, computed from the moon's actual
  position for your coordinates rather than a lookup table.

Smaller bay stations carry tide predictions but no sensors; those tiles say so
rather than showing a stale number.

**Settings** (top right) holds your location, tide station, units, radar
appearance, and the detector tuning sliders that used to sit on the main page.
Everything there is remembered between runs.

---

## One-time setup

### 1. Install Node.js
Download the **LTS** version from https://nodejs.org and run the installer (click
Next through the defaults). This gives you the `npm` command the next steps need.
You only do this once, ever.

To confirm it worked, open **Command Prompt** (press the Windows key, type `cmd`,
hit Enter) and run:

```bash
node --version
```

If it prints a version number (like `v20.x.x`), you're set.

### 2. Open this folder in Command Prompt
In File Explorer, open the `storm-ranger` folder. Click the address bar at the
top, type `cmd`, and press Enter — a Command Prompt opens already pointed at this
folder.

### 3. Install the app's pieces

```bash
npm install
```

This downloads Electron (the thing that turns the HTML into a real app). It takes
a few minutes and prints a lot of text — that's normal. Only needed once.

---

## Run it

```bash
npm start
```

The Storm Ranger window opens.

- **F11** = fullscreen storm-station mode. **Esc** leaves fullscreen.
- **Esc** also closes the settings panel.

To close it, close the window like any program.

---

## Make a real installer (optional)

When you want a double-click app you can install and pin to the taskbar:

```bash
npm run build
```

This creates a `dist` folder containing **Storm Ranger Setup 1.0.0.exe**. The
build is large (a few hundred MB) because it bundles its own browser engine —
that's what makes it standalone.

---

## Where the data comes from

Everything is keyless and free, and the app talks to these directly:

| Layer | Source |
| --- | --- |
| Radar tiles | RainViewer |
| Basemap and labels | Esri Dark Gray Canvas |
| Forecast | Open-Meteo |
| Warnings | US National Weather Service |
| Tides and station observations | NOAA CO-OPS |
| Waves and sea surface temperature | Open-Meteo marine model |
| Coastal Waters Forecast | US National Weather Service |

Radar tiles exist up to zoom 7 on the keyless feed, so zooming past that scales
the last available level over a sharper basemap — expect the precipitation to
soften while the coastline stays crisp.

Warnings and the Coastal Waters Forecast are US-only. Radar, forecast and the
wave model work anywhere; put any coordinates into Settings. The wave model snaps
an inland request to the nearest water cell, so a city-centre location reports the
sheltered water beside it rather than open sea — move the marker seaward, or pick
the Gulf zone in the forecast picker, for offshore conditions.

---

## Troubleshooting

- **`npm` is not recognized** — Node didn't install, or the Command Prompt was
  already open before you installed it. Close it, open a fresh one, try again.
- **Radar says "radar offline"** — no internet, or RainViewer is having a moment.
  Press **Refresh**. Everything else keeps working without it.
- **No amber forecast frames** — there is nothing moving to project. The legend
  says so directly.
- **Tide tiles all show em-dashes** — that station has tide predictions but no
  physical sensors. Switch to St. Petersburg or Clearwater Beach in Settings.
- **Nothing happens on `npm start` the very first time** — make sure `npm install`
  finished without a red `ERR!` at the end. If it errored, run `npm install` again.

---

## A note on privacy

The app has no camera or microphone access at all. The only thing written to disk
is your settings. Your coordinates are sent to the forecast, warnings, marine and
tide services, because that is how they know what to answer with.

`index.original.backup.html` is the original lightning-rangefinder version of the
app, kept for reference. It is not part of the build, and the rangefinder has been
removed from the current app entirely.
