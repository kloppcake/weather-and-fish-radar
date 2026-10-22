# Storm Ranger — Desktop App (Windows)

A Tampa Bay storm and water station in a single window: live radar with a
forecast loop, the local forecast, National Weather Service warnings, and a tide
and fishing analyzer built on the NOAA gauge at St. Petersburg.

---

## What is on screen

**Live radar.** A dark map of the Greater Tampa Bay area with two hours of past
radar scans and a projected loop that runs an hour ahead. Drag to pan, use the
+ / − buttons or **Ctrl + scroll** to zoom, and the crosshair button snaps back
to your location. The timeline under the map plays the loop; blue ticks are real
scans, amber ticks are the forecast, and the white **NOW** line divides them. The
loop spends most of its length in the past, so the **NOW** button jumps straight
to the latest scan and holds there; it lights up while that is the frame on
screen.
Dashed rings mark 10, 25 and 50 miles from where you are standing.

The **pin button** in the map's control stack, under the zoom buttons, turns the
tide gauges on and off and stays lit while they are showing. With it on, every
NOAA gauge in the list appears on the radar in its own colour: a translucent six-mile disc with a hard
outline, so the coastline and any rain read straight through it, plus a name chip
that steps aside rather than printing over its neighbour. The gauge you are using
is drawn brighter and on top. Click any disc to switch the tide panel to that
gauge. The disc marks the gauge and the water around it; it is not a surveyed
boundary, and the gauges themselves are points.

Under the map sit the three numbers worth a glance before you go out: **water
temperature, wind and gusts**. Wind is in knots because that is what the gauge
reports and what a marine forecast speaks, with your chosen units on the line
below. Each one says where it came from — the NOAA gauge has the sensor at
St. Petersburg and Clearwater Beach, and the forecast model fills in for wind at
the stations that do not.

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

**The right-hand rail is the fishing and tide analyzer.** It pulls from the NOAA
CO-OPS gauge at **St. Petersburg (8726520)**, changeable in Settings, and shows:

- A **bite score** out of 100 with the verdict and every input listed, so you can
  disagree with it. It blends tide flow rate, solunar timing, moon phase, wind and
  the six-hour barometer trend. It is a rule of thumb, not a prediction.
- **Next tide** with a live countdown, the predicted height, and where the water
  is right now.
- A **tide chart** covering the next 22 hours: the predicted curve, the highs and
  lows marked with their times, and the live gauge reading drawn in green over the
  last three hours so you can see surge against prediction.
- The **next four tides** as a compact strip, with the one coming up highlighted.

Two further cards are switched **off by default** and can be turned on under
*Fishing panel* in Settings:

- **Station observations** — air temperature, wind and gusts, barometer with its
  trend, moon phase, and the surge figure.
- **Solunar periods** — the major windows when the moon is overhead and underfoot,
  and the minor ones at moonrise and moonset, computed from the moon's actual
  position for your coordinates rather than a lookup table.

Hiding them changes nothing about the score. Wind, barometer and the solunar
times still feed it; the switches only decide whether you also read the detail.

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

Radar tiles exist up to zoom 7 on the keyless feed, so zooming past that scales
the last available level over a sharper basemap — expect the precipitation to
soften while the coastline stays crisp.

Warnings and tides are US-only. Radar and forecast work anywhere; put any
coordinates into Settings.

---

## Troubleshooting

- **`npm` is not recognized** — Node didn't install, or the Command Prompt was
  already open before you installed it. Close it, open a fresh one, try again.
- **Radar says "radar offline"** — no internet, or RainViewer is having a moment.
  Press **Refresh**. Everything else keeps working without it.
- **No amber forecast frames** — there is nothing moving to project. The legend
  says so directly.
- **Tide tiles, or the strip under the radar, show em-dashes** — that station has
  tide predictions but no physical sensors. Switch to St. Petersburg or Clearwater
  Beach in Settings.
- **The map looks stretched, or part of it is blank** — this was a real bug and is
  fixed. The canvas now re-checks its own size before every frame, so it recovers
  on its own within a fraction of a second even when nothing reports the change.
- **The map is fine but there is no colour on it** — the map says so itself. When
  nothing is falling inside the view, a note appears in the bottom-left reading
  "No rain in view" along with the distance and bearing of the nearest rain, so an
  empty radar can never be mistaken for a broken one. Tampa is dry for most of the
  winter and this is the normal state of things.
- **Nothing happens on `npm start` the very first time** — make sure `npm install`
  finished without a red `ERR!` at the end. If it errored, run `npm install` again.

---

## A note on privacy

The app has no camera or microphone access at all. The only thing written to disk
is your settings. Your coordinates are sent to the forecast, warnings and tide
services, because that is how they know what to answer with.

`index.original.backup.html` is the original lightning-rangefinder version of the
app, kept for reference. It is not part of the build, and the rangefinder has been
removed from the current app entirely.
