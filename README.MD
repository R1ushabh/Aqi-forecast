# 🌬️ Air Quality Forecaster

A modern, interactive web application for visualizing, comparing, and forecasting air quality (AQI) and pollutant levels for major cities worldwide. Built with real-time data, beautiful charts, and a clean UI.

---

## 🖼️ App Screenshots

### Dashboard
![Dashboard](Dashboard.png)

### Charts
![Charts](Charts.png)

### Compare Cities
![Compare](Compare.png)

### ML Forecast
![ML Forecast](ML-forecast.png)

---

## 🚀 Features

- 📊 **Live AQI Dashboard:**
  - View current AQI, pollutant breakdown, and health recommendations for any city.
- 🗺️ **Global Map:**
  - Explore AQI and pollutant levels on an interactive world map.
- 📈 **Trends & Charts:**
  - Visualize historical AQI trends, pollutant distributions, and city comparisons.
- ⚖️ **Compare Cities:**
  - Add/remove cities, see real-time AQI and pollutant stats side-by-side.
- 🔮 **Forecast:**
  - Predict AQI for the next 5 days (statistical/random model; ML integration ready).
- 💾 **Data Persistence:**
  - User-selected cities and preferences are saved locally.
- 📱 **Mobile Friendly:**
  - Responsive design and mobile navigation.

---

## 🌳 Project Structure (Branch-wise)

- **main** — Production-ready app, stable features.
- **dev** — Latest development, experimental features.
- **ml-forecast** — (Optional) ML/statistical AQI forecasting integration and scripts.
- **data-scripts** — (Optional) Data generation and charting scripts (Python).
- **docs** — Documentation and guides.

### Key Files (in each branch as relevant):
- `index.html` — Main web page, UI layout, and section containers.
- `app.js` — Main frontend logic: data loading, real-time API calls, charts, map, forecast logic, and UI interactions.
- `style.css` — Core styles for a clean, modern look.
-  (Optional)`script.py` — Python script to generate realistic air quality datasets for the app.

- `README.md` — This documentation.

---

## ⚡ Getting Started

1. **Install Python dependencies (for data/scripts):**
   ```bash
   pip install pandas statsmodels plotly
   ```

2. **Start the app:**
   - Open `index.html` in your browser.
   - All features work offline with the sample dataset, or use your own API keys for live data.

---

## 🔮 Forecasting

- The Forecast page currently uses a simple statistical/random model for AQI prediction.
- For real ML/statistical forecasting, see the `ml-forecast` branch and its instructions/scripts.

---

## 🌐 API Integration

- Uses [OpenWeatherMap Air Pollution API](https://openweathermap.org/api/air-pollution) for real-time AQI and pollutant data.
- API key is managed securely via `.env` (see `.env.sample`) or in the file itself.

---

## ✨ Credits & Acknowledgements

- Data: OpenWeatherMap, AQICN, and simulated datasets.
- Charts: Chart.js, Plotly.
- Maps: Leaflet.js.
- UI: Custom CSS, responsive design.

---

## 📣 License

MIT License. Free to use, modify, and share.

---

> Made with ❤️ for clean air and data-driven insights.
