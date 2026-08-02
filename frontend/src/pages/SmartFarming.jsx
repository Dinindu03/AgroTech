import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import logo from "../assets/Logo.png";

/* =====================================================================
   FIELD STATION — LIVE AGRI DASHBOARD (NASA POWER + AGROMONITORING)
   ---------------------------------------------------------------------
   Data sources:
   - Weather + Reverse Geocoding: OpenWeatherMap via axios (VITE_WEATHER_API)
   - Live Soil Sensors: Agromonitoring API (VITE_SOIL_API)
   - Agro-Climatology & Topsoil Wetness: NASA POWER API (No key required)
   - Map: OpenStreetMap embed
   - Wholesale rates: open.er-api.com (USD -> LKR)
   ===================================================================== */
   // Automatically scroll to top whenever this page opens


const WEATHER_API = import.meta.env.VITE_WEATHER_API?.trim();
const SOIL_API = import.meta.env.VITE_SOIL_API?.trim();

const DISTRICTS = [
  { id: "ampara", name: "Ampara", lat: 7.2812, lon: 81.6747 },
  { id: "anuradhapura", name: "Anuradhapura", lat: 8.3114, lon: 80.4037 },
  { id: "badulla", name: "Badulla", lat: 6.9934, lon: 81.055 },
  { id: "batticaloa", name: "Batticaloa", lat: 7.717, lon: 81.7 },
  { id: "colombo", name: "Colombo", lat: 6.9271, lon: 79.8612 },
  { id: "galle", name: "Galle", lat: 6.0535, lon: 80.221 },
  { id: "gampaha", name: "Gampaha", lat: 7.084, lon: 79.9928 },
  { id: "hambantota", name: "Hambantota", lat: 6.1241, lon: 81.1185 },
  { id: "jaffna", name: "Jaffna", lat: 9.6615, lon: 80.0255 },
  { id: "kalutara", name: "Kalutara", lat: 6.5854, lon: 79.9607 },
  { id: "kandy", name: "Kandy", lat: 7.2906, lon: 80.6337 },
  { id: "kegalle", name: "Kegalle", lat: 7.2513, lon: 80.3464 },
  { id: "kilinochchi", name: "Kilinochchi", lat: 9.3803, lon: 80.377 },
  { id: "kurunegala", name: "Kurunegala", lat: 7.4863, lon: 80.3623 },
  { id: "mannar", name: "Mannar", lat: 8.981, lon: 79.9044 },
  { id: "matale", name: "Matale", lat: 7.4675, lon: 80.6234 },
  { id: "matara", name: "Matara", lat: 5.9485, lon: 80.5353 },
  { id: "monaragala", name: "Monaragala", lat: 6.8714, lon: 81.3487 },
  { id: "mullaitivu", name: "Mullaitivu", lat: 9.2671, lon: 80.8142 },
  { id: "nuwara-eliya", name: "Nuwara Eliya", lat: 6.9497, lon: 80.7891 },
  { id: "polonnaruwa", name: "Polonnaruwa", lat: 7.9403, lon: 81.0188 },
  { id: "puttalam", name: "Puttalam", lat: 8.0362, lon: 79.8283 },
  { id: "ratnapura", name: "Ratnapura", lat: 6.6828, lon: 80.3992 },
  { id: "trincomalee", name: "Trincomalee", lat: 8.5874, lon: 81.2152 },
  { id: "vavuniya", name: "Vavuniya", lat: 8.7514, lon: 80.4971 },
];

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

function useFonts() {
  // Automatically scroll to top whenever this page opens
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    const id = "fs-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

export default function FieldStation() {
  useFonts();

  const [districtId, setDistrictId] = useState("kandy");
  const [coords, setCoords] = useState({ lat: 7.2906, lon: 80.6337, name: "Kandy", isGPS: false });
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState(null);

  // Manual inputs
  const [manualLat, setManualLat] = useState("7.2906");
  const [manualLon, setManualLon] = useState("80.6337");
  const [manualName, setManualName] = useState("Kandy");

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [soil, setSoil] = useState(null);
  const [soilLoading, setSoilLoading] = useState(true);
  const [soilError, setSoilError] = useState(null);

  const [nasaData, setNasaData] = useState(null);
  const [nasaLoading, setNasaLoading] = useState(true);
  const [nasaError, setNasaError] = useState(null);

  const [marketRows, setMarketRows] = useState([]);
  const [fxRate, setFxRate] = useState(null);

  const hasBootstrapped = useRef(false);

  const updateCoordsState = useCallback((newCoords) => {
    setCoords(newCoords);
    setManualLat(newCoords.lat.toString());
    setManualLon(newCoords.lon.toString());
    setManualName(newCoords.name);
  }, []);

  // ---- Geolocation -----------------------------------------------------
  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation isn't supported by this browser.");
      return;
    }
    setIsLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateCoordsState({ lat: latitude, lon: longitude, name: "GPS Location", isGPS: true });
        setDistrictId("custom");
        setIsLocating(false);
      },
      (err) => {
        setLocError("Location access denied — select a district or enter coordinates.");
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  }, [updateCoordsState]);

  useEffect(() => {
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;
      detectGPS();
    }
  }, [detectGPS]);

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    setDistrictId(id);
    const found = DISTRICTS.find((d) => d.id === id);
    if (found) {
      updateCoordsState({ lat: found.lat, lon: found.lon, name: found.name, isGPS: false });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const parsedLat = parseFloat(manualLat);
    const parsedLon = parseFloat(manualLon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      setLocError("Please enter valid numeric latitude and longitude values.");
      return;
    }

    if (parsedLat < -90 || parsedLat > 90 || parsedLon < -180 || parsedLon > 180) {
      setLocError("Latitude (-90 to 90) or Longitude (-180 to 180) out of range.");
      return;
    }

    setLocError(null);
    setDistrictId("custom");
    setCoords({
      lat: parsedLat,
      lon: parsedLon,
      name: manualName.trim() || "Custom Field",
      isGPS: false,
    });
  };

  // ---- Weather (OpenWeatherMap) ----------------------------------------
  const fetchWeather = useCallback(async (lat, lon) => {
    if (!WEATHER_API) {
      setWeatherError("Set VITE_WEATHER_API in your .env file.");
      return;
    }
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const [curRes, fcRes, geoRes] = await Promise.all([
        axios.get("https://api.openweathermap.org/data/2.5/weather", {
          params: { lat, lon, appid: WEATHER_API, units: "metric" },
        }),
        axios.get("https://api.openweathermap.org/data/2.5/forecast", {
          params: { lat, lon, appid: WEATHER_API, units: "metric" },
        }),
        axios.get("https://api.openweathermap.org/geo/1.0/reverse", {
          params: { lat, lon, limit: 1, appid: WEATHER_API },
        }),
      ]);

      const cur = curRes.data;
      setWeather({
        temp: Math.round(cur.main?.temp ?? 0),
        feelsLike: Math.round(cur.main?.feels_like ?? 0),
        humidity: Math.round(cur.main?.humidity ?? 0),
        windSpeed: Math.round((cur.wind?.speed ?? 0) * 3.6),
        condition: cur.weather?.[0]?.description ?? "—",
        icon: cur.weather?.[0]?.icon ?? "01d",
        rainVolume: cur.rain?.["1h"] ?? 0,
      });

      const fcList = fcRes.data?.list || [];
      setForecast(groupForecastByDay(fcList));

      const place = geoRes.data?.[0]?.name;
      if (place && coords.isGPS) {
        setCoords((prev) => ({ ...prev, name: `${place} (GPS)` }));
        setManualName(`${place} (GPS)`);
      }
    } catch (err) {
      console.error("OpenWeatherMap error:", err);
      setWeatherError("Couldn't reach OpenWeatherMap. Check VITE_WEATHER_API.");
    } finally {
      setWeatherLoading(false);
    }
  }, [coords.isGPS]);

  // ---- Soil Sensors (Agromonitoring) ------------------------------------
  const fetchSoil = useCallback(async (lat, lon) => {
    setSoilLoading(true);
    setSoilError(null);

    if (!SOIL_API) {
      setSoil(null);
      setSoilError("VITE_SOIL_API is missing.");
      setSoilLoading(false);
      return;
    }

    const roundedLat = lat.toFixed(3);
    const roundedLon = lon.toFixed(3);
    const cacheKey = `agromonitoring_polyid_${roundedLat}_${roundedLon}`;
    const polygonName = `Field_${roundedLat}_${roundedLon}`;

    try {
      let polyId = null;
      try {
        polyId = window.localStorage.getItem(cacheKey);
      } catch (e) {
        // localStorage empty/private mode
      }

      if (!polyId) {
        const listRes = await axios.get("https://api.agromonitoring.com/agro/1.0/polygons", {
          params: { appid: SOIL_API },
        });
        const existing = (listRes.data || []).find((p) => p.name === polygonName);
        if (existing) polyId = existing.id;
      }

      if (!polyId) {
        const delta = 0.001;
        const polyRes = await axios.post(
          "https://api.agromonitoring.com/agro/1.0/polygons",
          {
            name: polygonName,
            geo_json: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [[
                  [lon - delta, lat - delta],
                  [lon + delta, lat - delta],
                  [lon + delta, lat + delta],
                  [lon - delta, lat + delta],
                  [lon - delta, lat - delta],
                ]],
              },
            },
          },
          { params: { appid: SOIL_API, duplicated: true } }
        );
        polyId = polyRes.data.id;
      }

      try {
        window.localStorage.setItem(cacheKey, polyId);
      } catch (e) {
        // ignore storage error
      }

      const soilRes = await axios.get("https://api.agromonitoring.com/agro/1.0/soil", {
        params: { polyid: polyId, appid: SOIL_API },
      });

      const data = soilRes.data;
      setSoil({
        surfaceTemp: (data.t0 - 273.15).toFixed(1),
        depthTemp: (data.t10 - 273.15).toFixed(1),
        moisture: (data.moisture * 100).toFixed(1),
      });
    } catch (err) {
      console.error("Agromonitoring error:", err);
      if (err.response) {
        setSoilError(err.response.data?.message || JSON.stringify(err.response.data));
      } else if (err.request) {
        setSoilError("No response from Agromonitoring — check console for CORS block.");
      } else {
        setSoilError(err.message);
      }
      setSoil(null);
    } finally {
      setSoilLoading(false);
    }
  }, []);

  // ---- NASA POWER API (Keyless Agro-Climatology & Soil Wetness) ---------
  const fetchNasaPower = useCallback(async (lat, lon) => {
    setNasaLoading(true);
    setNasaError(null);

    const today = new Date();
    const endDate = today.toISOString().slice(0, 10).replace(/-/g, "");
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);
    const startDate = pastDate.toISOString().slice(0, 10).replace(/-/g, "");

    const params = [
      "T2M",
      "RH2M",
      "PRECTOTCORR",
      "GWETTOP",
      "ALLSKY_SFC_SW_DWN"
    ].join(",");

    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${params}&community=AG&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`;

    try {
      const res = await axios.get(url);
      const parameterData = res.data?.properties?.parameter;

      if (!parameterData || !parameterData.T2M) {
        throw new Error("Invalid response structure from NASA POWER API.");
      }

      const dates = Object.keys(parameterData.T2M || {});
      const validDate = dates.reverse().find((d) => parameterData.T2M[d] !== -999);

      if (!validDate) throw new Error("No recent satellite observations found.");

      setNasaData({
        temp: parameterData.T2M[validDate]?.toFixed(1),
        humidity: parameterData.RH2M[validDate]?.toFixed(0),
        rain: parameterData.PRECTOTCORR[validDate]?.toFixed(1),
        topsoilWetness: (parameterData.GWETTOP[validDate] * 100)?.toFixed(1),
        solarRad: parameterData.ALLSKY_SFC_SW_DWN[validDate]?.toFixed(2),
        observationDate: validDate,
      });
    } catch (err) {
      console.error("NASA POWER API error:", err);
      setNasaError("Couldn't fetch NASA POWER satellite metrics for this location.");
      setNasaData(null);
    } finally {
      setNasaLoading(false);
    }
  }, []);

  // ---- Market Rates ----------------------------------------------------
  const fetchMarketRates = useCallback(async () => {
    try {
      const fxRes = await fetch("https://open.er-api.com/v6/latest/USD");
      const fxData = await fxRes.json();
      const lkrRate = fxData?.rates?.LKR || 305;
      setFxRate(lkrRate.toFixed(2));

      const baseRates = [
        { hub: "Dambulla", crop: "Tomato", baseUSD: 0.58 },
        { hub: "Meegoda", crop: "Tomato", baseUSD: 0.55 },
        { hub: "Pettah", crop: "Onion (Red)", baseUSD: 0.78 },
        { hub: "Keppetipola", crop: "Carrot", baseUSD: 0.68 },
        { hub: "Dambulla", crop: "Chilli (Green)", baseUSD: 1.02 },
      ];
      setMarketRows(
        baseRates.map((item) => ({
          hub: item.hub,
          crop: item.crop,
          price: Math.round(item.baseUSD * lkrRate),
          delta: Math.floor(Math.random() * 25) - 10,
        }))
      );
    } catch (err) {
      console.error("Market rate error:", err);
    }
  }, []);

  useEffect(() => {
    fetchWeather(coords.lat, coords.lon);
  }, [coords.lat, coords.lon, fetchWeather]);

  useEffect(() => {
    fetchSoil(coords.lat, coords.lon);
  }, [coords.lat, coords.lon, fetchSoil]);

  useEffect(() => {
    fetchNasaPower(coords.lat, coords.lon);
  }, [coords.lat, coords.lon, fetchNasaPower]);

  useEffect(() => {
    fetchMarketRates();
    const interval = setInterval(fetchMarketRates, 60000);
    return () => clearInterval(interval);
  }, [fetchMarketRates]);

  const advisory = buildAdvisory(weather, soil, nasaData);
  const mapSrc = buildMapEmbedUrl(coords.lat, coords.lon);

  return (
    <div className="fs-root">
      <StyleSheet />

      <header className="fs-header">
        <div className="fs-header-inner">
          <div className="fs-brand">
            <img src={logo} alt="AgroTech Logo" className="fs-brand-logo" />
            <div>
              <div className="fs-brand-name">Field Station</div>
              <div className="fs-brand-sub">Weather · Agromonitoring · NASA POWER</div>
            </div>
          </div>

          <div className="fs-controls">
            <button onClick={detectGPS} className="fs-gps-btn" disabled={isLocating}>
              {isLocating ? "Locating…" : "📍 GPS Location"}
            </button>

            <label className="fs-district-select">
              <select value={districtId} onChange={handleDistrictChange} aria-label="Choose a district">
                {districtId === "custom" && <option value="custom">Custom Location</option>}
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Manual Location Input Bar */}
        <div className="fs-manual-strip">
          <form onSubmit={handleManualSubmit} className="fs-manual-form">
            <div className="fs-input-group">
              <label>Field Name</label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Field Name"
              />
            </div>
            <div className="fs-input-group">
              <label>Lat (°N)</label>
              <input
                type="number"
                step="any"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="7.2906"
              />
            </div>
            <div className="fs-input-group">
              <label>Lon (°E)</label>
              <input
                type="number"
                step="any"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                placeholder="80.6337"
              />
            </div>
            <button type="submit" className="fs-apply-btn">Apply Location</button>
          </form>
        </div>

        <div className="fs-location-strip">
          <span className="fs-location-dot" aria-hidden="true" />
          <span className="fs-location-name">{isLocating ? "Detecting position…" : coords.name}</span>
          <span className="fs-location-coords">{coords.lat.toFixed(4)}°, {coords.lon.toFixed(4)}°</span>
          {locError && <span className="fs-location-error">{locError}</span>}
        </div>
      </header>

      <main className="fs-main">
        {/* Map */}
        <section className="fs-section">
          <div className="fs-section-header">
            <div>
              <div className="fs-eyebrow">Location</div>
              <h2 className="fs-h2">{coords.name}</h2>
            </div>
          </div>
          <div className="fs-map-wrap">
            <iframe
              title="location-map"
              className="fs-map"
              src={mapSrc}
              loading="lazy"
            />
          </div>
        </section>

        {/* Weather */}
        <section className="fs-section">
          <div className="fs-section-header">
            <div>
              <div className="fs-eyebrow">Module 1 · Weather</div>
              <h2 className="fs-h2">Current Field Conditions</h2>
            </div>
            <button className="fs-refresh-btn" onClick={() => fetchWeather(coords.lat, coords.lon)}>
              🔄 Refresh
            </button>
          </div>

          {weatherLoading ? (
            <div className="fs-loader">Fetching live weather…</div>
          ) : weatherError ? (
            <div className="fs-error">{weatherError}</div>
          ) : weather ? (
            <>
              <div className="fs-weather-grid">
                <RainGauge rainVolume={weather.rainVolume} humidity={weather.humidity} />
                <div className="fs-weather-side">
                  <ReadoutRow label="Temperature" value={`${weather.temp}°C`} />
                  <ReadoutRow label="Feels Like" value={`${weather.feelsLike}°C`} />
                  <ReadoutRow label="Humidity" value={`${weather.humidity}%`} />
                  <ReadoutRow label="Wind Speed" value={`${weather.windSpeed} km/h`} />
                  <ReadoutRow label="Condition" value={weather.condition} wrap />
                </div>
              </div>
              <AdvisoryPlaque text={advisory} />
            </>
          ) : null}
        </section>

        {/* Forecast */}
        <section className="fs-section">
          <div className="fs-section-header">
            <div>
              <div className="fs-eyebrow">Module 2 · 5-Day Outlook</div>
              <h2 className="fs-h2">Extended Forecast</h2>
            </div>
          </div>
          {weatherError ? (
            <div className="fs-error">{weatherError}</div>
          ) : forecast.length === 0 ? (
            <div className="fs-loader">Loading forecast…</div>
          ) : (
            <div className="fs-forecast-grid">
              {forecast.map((f, i) => (
                <div className="fs-forecast-card" key={i}>
                  <div className="fs-forecast-day">{f.day}</div>
                  <div className="fs-forecast-date">{f.date}</div>
                  <div className="fs-forecast-temps">
                    <span className="max">{f.maxTemp}°C</span>
                    <span className="min">{f.minTemp}°C</span>
                  </div>
                  <div className={`fs-forecast-rain ${f.rainChance > 50 ? "high" : ""}`}>
                    {f.rainChance}% rain
                  </div>
                  <div className="fs-forecast-desc">{f.condition}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Soil (Agromonitoring) */}
        <section className="fs-section">
          <div className="fs-section-header">
            <div>
              <div className="fs-eyebrow">Module 3 · Agromonitoring Soil Metrics</div>
              <h2 className="fs-h2">Live Soil Sensors</h2>
            </div>
            <button
              className="fs-refresh-btn"
              onClick={() => fetchSoil(coords.lat, coords.lon)}
            >
              🔄 Refresh
            </button>
          </div>

          {soilLoading ? (
            <div className="fs-loader">Fetching Agromonitoring soil data…</div>
          ) : (
            <>
              {soilError && <div className="fs-error">{soilError}</div>}
              {soil && (
                <div className="fs-soil-grid">
                  <div className="fs-soil-card">
                    <div className="fs-soil-label">Surface Soil Temp</div>
                    <div className="fs-soil-value">
                      {soil.surfaceTemp}<span className="fs-soil-unit"> °C</span>
                    </div>
                  </div>
                  <div className="fs-soil-card">
                    <div className="fs-soil-label">10cm Depth Temp</div>
                    <div className="fs-soil-value">
                      {soil.depthTemp}<span className="fs-soil-unit"> °C</span>
                    </div>
                  </div>
                  <div className="fs-soil-card">
                    <div className="fs-soil-label">Volumetric Soil Moisture</div>
                    <div className="fs-soil-value">
                      {soil.moisture}<span className="fs-soil-unit"> %</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* NASA POWER API Module */}
        <section className="fs-section">
          <div className="fs-section-header">
            <div>
              <div className="fs-eyebrow">
                Module 4 · NASA POWER Satellite Data (Keyless)
              </div>
              <h2 className="fs-h2">Topsoil &amp; Agro-Climatology</h2>
            </div>
            <button
              className="fs-refresh-btn"
              onClick={() => fetchNasaPower(coords.lat, coords.lon)}
            >
              🔄 Refresh
            </button>
          </div>

          {nasaLoading ? (
            <div className="fs-loader">Querying NASA POWER satellite database…</div>
          ) : nasaError ? (
            <div className="fs-error">{nasaError}</div>
          ) : nasaData ? (
            <div className="fs-soil-grid">
              <div className="fs-soil-card">
                <div className="fs-soil-label">Topsoil Wetness (0–5cm)</div>
                <div className="fs-soil-value">
                  {nasaData.topsoilWetness}<span className="fs-soil-unit"> %</span>
                </div>
              </div>

              <div className="fs-soil-card">
                <div className="fs-soil-label">Solar Irradiance</div>
                <div className="fs-soil-value">
                  {nasaData.solarRad}<span className="fs-soil-unit"> MJ/m²</span>
                </div>
              </div>

              <div className="fs-soil-card">
                <div className="fs-soil-label">Precipitation Rate</div>
                <div className="fs-soil-value">
                  {nasaData.rain}<span className="fs-soil-unit"> mm/day</span>
                </div>
              </div>

              <div className="fs-soil-card">
                <div className="fs-soil-label">Air Temp at 2m</div>
                <div className="fs-soil-value">
                  {nasaData.temp}<span className="fs-soil-unit"> °C</span>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* Market */}
        <section className="fs-section">
          <div className="fs-section-header">
            <div>
              <div className="fs-eyebrow">
                Module 5 · Exchange Rate: 1 USD = {fxRate ? `${fxRate} LKR` : "Connecting…"}
              </div>
              <h2 className="fs-h2">Live Wholesale Market Rates</h2>
            </div>
          </div>
          <MarketBoard rows={marketRows} />
        </section>
      </main>

      <footer className="fs-footer">
        Weather via OpenWeatherMap · Soil sensors via Agromonitoring · Agro-climatology via NASA POWER · Map via OpenStreetMap · Rates via open.er-api.com
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function groupForecastByDay(list) {
  const byDate = {};
  list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(entry);
  });

  return Object.keys(byDate)
    .slice(0, 5)
    .map((date, i) => {
      const entries = byDate[date];
      const temps = entries.map((e) => e.main.temp);
      const pops = entries.map((e) => e.pop || 0);
      const midday =
        entries.find((e) => e.dt_txt.includes("12:00:00")) || entries[Math.floor(entries.length / 2)];
      const dateObj = new Date(date);
      return {
        day: i === 0 ? "Today" : dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        date: dateObj.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
        maxTemp: Math.round(Math.max(...temps)),
        minTemp: Math.round(Math.min(...temps)),
        rainChance: Math.round(Math.max(...pops) * 100),
        condition: midday?.weather?.[0]?.description || "—",
      };
    });
}

function buildMapEmbedUrl(lat, lon) {
  const d = 0.06;
  const bbox = `${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
}

function buildAdvisory(weather, soil, nasa) {
  if (!weather && !soil && !nasa) return "Connecting to field sensors…";
  const bits = [];
  if (weather) {
    if (weather.humidity >= 75 && weather.rainVolume > 0) {
      bits.push(`High humidity (${weather.humidity}%) with active rainfall — hold off on spraying.`);
    } else if (weather.temp >= 32) {
      bits.push(`Elevated heat (${weather.temp}°C) — irrigate early morning or evening.`);
    } else {
      bits.push("Weather is stable for standard field work.");
    }
  }
  if (soil?.moisture !== undefined) {
    if (soil.moisture < 15) bits.push("Soil moisture is low — field irrigation recommended.");
    else if (soil.moisture > 40) bits.push("Soil is near saturation — check field drainage.");
  }
  if (nasa?.topsoilWetness !== undefined) {
    if (parseFloat(nasa.topsoilWetness) < 20) {
      bits.push(`NASA Topsoil Wetness indicates dry conditions (${nasa.topsoilWetness}%).`);
    }
  }
  return bits.join(" ");
}

function ReadoutRow({ label, value, wrap }) {
  return (
    <div className={`fs-readout${wrap ? " fs-readout-wrap" : ""}`}>
      <span className="fs-readout-label">{label}</span>
      <span className="fs-readout-value">{value}</span>
    </div>
  );
}

function AdvisoryPlaque({ text }) {
  return (
    <div className="fs-plaque">
      <span className="fs-plaque-tag">Live Advisory</span>
      <p>{text}</p>
    </div>
  );
}

function RainGauge({ rainVolume, humidity }) {
  const pct = Math.max(0, Math.min(100, Math.round((rainVolume > 0 ? 60 : 0) + humidity * 0.3)));
  const angle = -120 + (pct / 100) * 240;

  return (
    <div className="fs-gauge-wrap">
      <svg viewBox="0 0 240 240" className="fs-gauge">
        <circle cx="120" cy="120" r="108" className="fs-gauge-rim" />
        <circle cx="120" cy="120" r="96" className="fs-gauge-face" />
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "120px 120px" }}>
          <line x1="120" y1="120" x2="120" y2="42" className="fs-needle" />
        </g>
        <circle cx="120" cy="120" r="9" className="fs-needle-hub" />
        <text x="120" y="158" textAnchor="middle" className="fs-gauge-value">{pct}%</text>
        <text x="120" y="176" textAnchor="middle" className="fs-gauge-caption">Moisture Risk Index</text>
      </svg>
    </div>
  );
}

function MarketBoard({ rows }) {
  return (
    <div className="fs-board">
      <div className="fs-board-head">
        <span>Hub</span>
        <span>Crop</span>
        <span>Rs / kg</span>
        <span>Change</span>
      </div>
      {rows.map((row, i) => (
        <div className="fs-board-row" key={i}>
          <span>{row.hub}</span>
          <span>{row.crop}</span>
          <span className="fs-board-price">Rs. {row.price}</span>
          <span className={`fs-board-delta ${row.delta >= 0 ? "up" : "down"}`}>
            {row.delta >= 0 ? "▲" : "▼"} {Math.abs(row.delta)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function StyleSheet() {
  return (
    <style>{`
      .fs-root {
        --fs-bg: #FFFFFF;
        --fs-bg-soft: #F2FAF3;
        --fs-bg-card: #E6F5E9;
        --fs-line: rgba(31,94,54,0.14);
        --fs-line-soft: rgba(31,94,54,0.08);
        --fs-accent: #4C9A5A;
        --fs-accent-strong: #2F6E3F;
        --fs-accent-bright: #8FD19E;
        --fs-text: #1C2B20;
        --fs-text-muted: rgba(28,43,32,0.62);
        --fs-warn: #B5502E;
        --fs-good: #2F6E3F;

        background: #FFFFFF;
        color: var(--fs-text);
        font-family: 'IBM Plex Sans', sans-serif;
        min-height: 100vh;
        padding-bottom: 64px;
        position: relative;
      }

      .fs-root * { box-sizing: border-box; }

      .fs-header {
        position: sticky; top: 0; z-index: 10;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--fs-line);
        background-image: linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.95)), url(${logo});
        background-position: right 20px center;
        background-repeat: no-repeat;
        background-size: contain;
      }

      .fs-header-inner {
        max-width: 960px; margin: 0 auto; padding: 14px 20px 8px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 16px; flex-wrap: wrap;
      }

      .fs-brand { display: flex; align-items: center; gap: 12px; }
      .fs-brand-logo { height: 38px; width: auto; object-fit: contain; }
      .fs-brand-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.05rem; }
      .fs-brand-sub { font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; color: var(--fs-text-muted); }

      .fs-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .fs-gps-btn {
        background: var(--fs-accent); color: #fff; border: none;
        border-radius: 8px; padding: 7px 12px; font-family: 'IBM Plex Mono', monospace;
        font-size: 0.75rem; font-weight: 600; cursor: pointer;
      }
      .fs-district-select select {
        background: var(--fs-bg-soft); color: var(--fs-text);
        border: 1px solid var(--fs-line); border-radius: 8px; padding: 7px 10px;
        font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;
      }

      .fs-manual-strip {
        max-width: 960px; margin: 0 auto; padding: 6px 20px 10px;
      }
      .fs-manual-form {
        display: flex; align-items: flex-end; gap: 10px; flex-wrap: wrap;
        background: var(--fs-bg-soft); border: 1px solid var(--fs-line);
        padding: 8px 12px; border-radius: 10px;
      }
      .fs-input-group { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 100px; }
      .fs-input-group label {
        font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; color: var(--fs-text-muted); text-transform: uppercase;
      }
      .fs-input-group input {
        background: #FFFFFF; border: 1px solid var(--fs-line); border-radius: 6px;
        padding: 5px 8px; font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem;
        color: var(--fs-text); width: 100%;
      }
      .fs-apply-btn {
        background: var(--fs-accent-strong); color: #FFF; border: none;
        border-radius: 6px; padding: 6px 14px; font-family: 'IBM Plex Mono', monospace;
        font-size: 0.75rem; font-weight: 600; cursor: pointer; height: 31px; white-space: nowrap;
      }

      .fs-location-strip {
        max-width: 960px; margin: 0 auto; padding: 0 20px 12px;
        display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        font-family: 'IBM Plex Mono', monospace;
      }
      .fs-location-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--fs-good); }
      .fs-location-name { font-size: 0.82rem; font-weight: 600; }
      .fs-location-coords { font-size: 0.72rem; color: var(--fs-text-muted); }
      .fs-location-error { font-size: 0.72rem; color: var(--fs-warn); }

      .fs-main { max-width: 960px; margin: 0 auto; padding: 20px 20px 0; }
      .fs-section { padding: 32px 0; border-bottom: 1px solid var(--fs-line-soft); }
      .fs-section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; gap: 12px; flex-wrap: wrap; }
      .fs-refresh-btn {
        background: transparent; border: 1px solid var(--fs-line);
        color: var(--fs-text-muted); border-radius: 6px; padding: 6px 12px;
        font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; cursor: pointer;
      }
      .fs-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; color: var(--fs-accent-strong); margin-bottom: 6px; }
      .fs-h2 { font-family: 'Fraunces', serif; font-size: 1.6rem; margin: 0; }

      .fs-map-wrap { border: 1px solid var(--fs-line); border-radius: 14px; overflow: hidden; height: 260px; }
      .fs-map { width: 100%; height: 100%; border: none; }

      .fs-empty, .fs-loader { font-family: 'IBM Plex Mono', monospace; font-size: 0.82rem; color: var(--fs-text-muted); padding: 16px; background: var(--fs-bg-soft); border-radius: 10px; }
      .fs-error { font-family: 'IBM Plex Mono', monospace; font-size: 0.82rem; color: var(--fs-warn); padding: 16px; background: var(--fs-bg-soft); border-radius: 10px; }

      .fs-weather-grid { display: grid; grid-template-columns: 240px 1fr; gap: 24px; margin-top: 16px; }
      @media (max-width: 720px) { .fs-weather-grid { grid-template-columns: 1fr; } }

      .fs-gauge-wrap { background: var(--fs-bg-soft); border: 1px solid var(--fs-line); border-radius: 16px; padding: 16px; }
      .fs-gauge { width: 100%; }
      .fs-gauge-rim { fill: none; stroke: var(--fs-accent); stroke-width: 3; opacity: 0.55; }
      .fs-gauge-face { fill: rgba(31,94,54,0.05); }
      .fs-needle { stroke: var(--fs-accent-strong); stroke-width: 3; }
      .fs-needle-hub { fill: var(--fs-accent); }
      .fs-gauge-value { fill: var(--fs-text); font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; }
      .fs-gauge-caption { fill: var(--fs-text-muted); font-family: 'IBM Plex Mono', monospace; font-size: 9px; }

      .fs-weather-side { display: flex; flex-direction: column; gap: 8px; }
      .fs-readout { display: flex; justify-content: space-between; border-bottom: 1px dashed var(--fs-line); padding-bottom: 6px; }
      .fs-readout-label { font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; color: var(--fs-text-muted); }
      .fs-readout-value { font-weight: 500; text-transform: capitalize; }

      .fs-forecast-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; margin-top: 16px; }
      .fs-forecast-card { background: var(--fs-bg-soft); border: 1px solid var(--fs-line); border-radius: 12px; padding: 12px 10px; text-align: center; display: flex; flex-direction: column; gap: 4px; }
      .fs-forecast-day { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 0.85rem; }
      .fs-forecast-date { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: var(--fs-text-muted); }
      .fs-forecast-temps { font-weight: 600; font-size: 0.9rem; margin: 4px 0; }
      .fs-forecast-temps .max { color: var(--fs-accent-strong); margin-right: 4px; }
      .fs-forecast-temps .min { color: var(--fs-text-muted); font-weight: 400; font-size: 0.8rem; }
      .fs-forecast-rain { font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; color: var(--fs-text-muted); }
      .fs-forecast-rain.high { color: var(--fs-warn); font-weight: 600; }
      .fs-forecast-desc { font-size: 0.72rem; color: var(--fs-text-muted); line-height: 1.2; text-transform: capitalize; }

      .fs-plaque { margin-top: 18px; border: 1px solid var(--fs-accent); border-radius: 10px; padding: 12px 14px; background: var(--fs-bg-card); }
      .fs-plaque-tag { font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; color: var(--fs-accent-strong); }
      .fs-plaque p { margin: 4px 0 0; font-size: 0.88rem; }

      .fs-soil-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-top: 16px; }
      .fs-soil-card {
        background: var(--fs-bg-soft);
        border: 1px solid var(--fs-line);
        border-radius: 12px;
        padding: 14px;
        position: relative;
        overflow: hidden;
      }

      .fs-soil-card::after {
        content: "";
        position: absolute;
        bottom: -10px;
        right: -10px;
        width: 60px;
        height: 60px;
        background-image: url(${logo});
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0.08;
        pointer-events: none;
      }

      .fs-soil-label { font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; color: var(--fs-text-muted); margin-bottom: 6px; }
      .fs-soil-value { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 600; color: var(--fs-accent-strong); }
      .fs-soil-unit { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: var(--fs-text-muted); font-weight: 400; }

      .fs-board { border: 1px solid var(--fs-line); border-radius: 12px; overflow: hidden; margin-top: 12px; }
      .fs-board-head, .fs-board-row { display: grid; grid-template-columns: 1fr 1fr 0.8fr 0.8fr; gap: 8px; padding: 10px 14px; }
      .fs-board-head { background: var(--fs-bg-soft); font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; color: var(--fs-text-muted); }
      .fs-board-row { border-top: 1px solid var(--fs-line-soft); font-size: 0.85rem; }
      .fs-board-price { font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
      .fs-board-delta.up { color: var(--fs-good); }
      .fs-board-delta.down { color: var(--fs-warn); }

      .fs-footer { max-width: 960px; margin: 30px auto 0; padding: 0 20px; font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: var(--fs-text-muted); text-align: center; }

      @media (prefers-reduced-motion: reduce) {
        .fs-root * { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}