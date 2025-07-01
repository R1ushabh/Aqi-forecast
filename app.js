// Air Quality Visualizer & Forecasting App
class AirQualityApp {
    constructor() {
        this.data = null;
        this.currentCity = 'New York';
        this.map = null;
        this.charts = {};
        this.selectedCities = [];
        this.currentTheme = 'light';
        
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.setupTheme();
            this.updateCurrentTime();
            this.renderDashboard();
            this.renderCompareTable();
            
            // Initialize other sections but don't render yet
            this.setupMobileNavigation();
            
            // Start real-time updates
            setInterval(() => this.updateCurrentTime(), 1000);
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    async loadData() {
        try {
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/11b31e104a38988973a7c5092595df55/3a07133f-a7f6-41cb-a2f6-5d45827c8d35/c772065a.json');
            this.data = await response.json();
            // Try to load ML forecast data if available
            try {
                const mlForecastRes = await fetch('aqi_forecast_ml.json');
                if (mlForecastRes.ok) {
                    this.mlForecastData = await mlForecastRes.json();
                } else {
                    this.mlForecastData = null;
                }
            } catch (err) {
                this.mlForecastData = null;
            }
        } catch (error) {
            // Fallback data if fetch fails
            this.data = {
                "historical_data": [
                    {"city": "New York", "country": "USA", "lat": 40.7128, "lon": -74.0060, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 94, "pm25": 28.5, "pm10": 42.3, "no2": 45.2, "o3": 87.1, "co": 8.2, "so2": 15.8, "dominant_pollutant": "o3"},
                    {"city": "Los Angeles", "country": "USA", "lat": 34.0522, "lon": -118.2437, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 126, "pm25": 45.2, "pm10": 78.9, "no2": 52.1, "o3": 112.4, "co": 9.8, "so2": 22.1, "dominant_pollutant": "pm25"},
                    {"city": "London", "country": "UK", "lat": 51.5074, "lon": -0.1278, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 64, "pm25": 18.2, "pm10": 28.7, "no2": 38.9, "o3": 67.3, "co": 4.5, "so2": 12.3, "dominant_pollutant": "o3"},
                    {"city": "Paris", "country": "France", "lat": 48.8566, "lon": 2.3522, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 78, "pm25": 22.1, "pm10": 35.4, "no2": 41.7, "o3": 89.2, "co": 6.3, "so2": 18.9, "dominant_pollutant": "o3"},
                    {"city": "Tokyo", "country": "Japan", "lat": 35.6762, "lon": 139.6503, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 89, "pm25": 31.2, "pm10": 48.6, "no2": 47.8, "o3": 76.5, "co": 7.1, "so2": 14.2, "dominant_pollutant": "o3"},
                    {"city": "Delhi", "country": "India", "lat": 28.7041, "lon": 77.1025, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 187, "pm25": 89.4, "pm10": 145.2, "no2": 68.9, "o3": 98.7, "co": 12.5, "so2": 32.1, "dominant_pollutant": "pm25"},
                    {"city": "Beijing", "country": "China", "lat": 39.9042, "lon": 116.4074, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 154, "pm25": 67.8, "pm10": 98.4, "no2": 59.2, "o3": 87.6, "co": 10.3, "so2": 28.7, "dominant_pollutant": "pm25"},
                    {"city": "Mumbai", "country": "India", "lat": 19.0760, "lon": 72.8777, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 142, "pm25": 58.9, "pm10": 89.7, "no2": 54.3, "o3": 92.1, "co": 9.6, "so2": 26.4, "dominant_pollutant": "pm25"},
                    {"city": "São Paulo", "country": "Brazil", "lat": -23.5505, "lon": -46.6333, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 98, "pm25": 34.7, "pm10": 52.8, "no2": 48.6, "o3": 85.3, "co": 8.9, "so2": 19.5, "dominant_pollutant": "o3"},
                    {"city": "Sydney", "country": "Australia", "lat": -33.8688, "lon": 151.2093, "timestamp": "2025-06-23T23:06:28.970623", "aqi": 56, "pm25": 16.8, "pm10": 24.9, "no2": 32.1, "o3": 62.4, "co": 3.8, "so2": 9.7, "dominant_pollutant": "o3"}
                ],
                "forecast_data": [
                    {"city": "New York", "country": "USA", "lat": 40.7128, "lon": -74.0060, "forecast_date": "2025-06-24", "predicted_aqi": 98, "confidence": 0.89},
                    {"city": "New York", "country": "USA", "lat": 40.7128, "lon": -74.0060, "forecast_date": "2025-06-25", "predicted_aqi": 102, "confidence": 0.85},
                    {"city": "Los Angeles", "country": "USA", "lat": 34.0522, "lon": -118.2437, "forecast_date": "2025-06-24", "predicted_aqi": 132, "confidence": 0.91},
                    {"city": "Delhi", "country": "India", "lat": 28.7041, "lon": 77.1025, "forecast_date": "2025-06-24", "predicted_aqi": 195, "confidence": 0.87}
                ]
            };
        }
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Desktop Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.navigateToSection(e.target.dataset.section);
            });
        });

        // Mobile Navigation
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.navigateToSection(e.target.dataset.section);
            });
        });

        // City search and comparison
        const citySearch = document.getElementById('citySearch');
        if (citySearch) {
            citySearch.addEventListener('input', (e) => {
                this.handleCitySearch(e.target.value);
            });
            // Add Enter key support for adding city to comparison
            citySearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.addCityToComparison();
                }
            });
        }

        const addCityBtn = document.getElementById('addCityBtn');
        if (addCityBtn) {
            addCityBtn.addEventListener('click', () => {
                this.addCityToComparison();
            });
        }

        // Forecast city selection
        const forecastCity = document.getElementById('forecastCity');
        if (forecastCity) {
            forecastCity.addEventListener('change', (e) => {
                this.currentCity = e.target.value;
                this.renderForecast();
            });
        }

        const globalCityBtn = document.getElementById('globalCityBtn');
        if (globalCityBtn) {
            globalCityBtn.addEventListener('click', async () => {
                const input = document.getElementById('globalCitySearch');
                const errorSpan = document.getElementById('globalCityError');
                if (errorSpan) errorSpan.textContent = '';
                if (!input || !input.value.trim()) return;
                try {
                    const coords = await getCoordinates(input.value.trim());
                    const aqiData = await fetchAirQuality(coords.lat, coords.lon);
                    this.displayGlobalCityAQI(coords, aqiData);
                } catch (err) {
                    if (errorSpan) errorSpan.textContent = 'City not found or API error';
                }
            });
        }
    }

    setupMobileNavigation() {
        // Create mobile navigation if it doesn't exist
        if (!document.querySelector('.mobile-nav')) {
            const mobileNav = document.createElement('div');
            mobileNav.className = 'mobile-nav';
            mobileNav.innerHTML = `
                <div class="mobile-nav-grid">
                    <button class="mobile-nav-btn active" data-section="dashboard">📊<br>Dashboard</button>
                    <button class="mobile-nav-btn" data-section="map">🗺️<br>Map</button>
                    <button class="mobile-nav-btn" data-section="charts">📈<br>Charts</button>
                    <button class="mobile-nav-btn" data-section="compare">⚖️<br>Compare</button>
                    <button class="mobile-nav-btn" data-section="forecast">🔮<br>Forecast</button>
                </div>
            `;
            document.body.appendChild(mobileNav);
            
            // Add event listeners to mobile nav buttons
            mobileNav.querySelectorAll('.mobile-nav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.navigateToSection(e.target.dataset.section);
                });
            });
        }
    }

    setupTheme() {
        // Try to get saved theme, otherwise default to light
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        this.updateThemeIcon(theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    navigateToSection(sectionId) {
        // Update active nav button (desktop)
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const desktopBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
        if (desktopBtn) {
            desktopBtn.classList.add('active');
        }

        // Update active nav button (mobile)
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const mobileBtn = document.querySelector(`.mobile-nav-btn[data-section="${sectionId}"]`);
        if (mobileBtn) {
            mobileBtn.classList.add('active');
        }

        // Update active section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Special handling for different sections
        if (sectionId === 'map') {
            setTimeout(() => {
                if (!this.map) {
                    this.initializeMap();
                } else {
                    this.map.invalidateSize();
                }
            }, 100);
        } else if (sectionId === 'charts') {
            setTimeout(() => this.renderCharts(), 100);
        } else if (sectionId === 'forecast') {
            setTimeout(() => this.renderForecast(), 100);
        }
    }

    getAQILevel(aqi) {
        if (aqi <= 50) return { level: 'Good', color: '#00e400', class: 'aqi-good' };
        if (aqi <= 100) return { level: 'Moderate', color: '#ffff00', class: 'aqi-moderate' };
        if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#ff7e00', class: 'aqi-unhealthy-sensitive' };
        if (aqi <= 200) return { level: 'Unhealthy', color: '#ff0000', class: 'aqi-unhealthy' };
        if (aqi <= 300) return { level: 'Very Unhealthy', color: '#8f3f97', class: 'aqi-very-unhealthy' };
        return { level: 'Hazardous', color: '#7e0023', class: 'aqi-hazardous' };
    }

    getHealthRecommendations(aqi) {
        const level = this.getAQILevel(aqi);
        const recommendations = {
            'Good': [
                'Enjoy outdoor activities',
                'Perfect time for exercise outdoors',
                'No health precautions needed'
            ],
            'Moderate': [
                'Generally safe for outdoor activities',
                'Monitor symptoms if you\'re sensitive to air pollution',
                'Unusually sensitive people should consider reducing prolonged outdoor exertion'
            ],
            'Unhealthy for Sensitive Groups': [
                'People with respiratory or heart disease should limit prolonged outdoor exertion',
                'Children and elderly should reduce outdoor activities',
                'Consider wearing a mask outdoors'
            ],
            'Unhealthy': [
                'Everyone should limit prolonged outdoor exertion',
                'Sensitive groups should avoid outdoor activities',
                'Close windows and use air purifiers indoors',
                'Wear N95 masks when going outside'
            ]
        };

        return {
            level: level.level,
            description: level.level === 'Good' ? 'Air quality is satisfactory, and air pollution poses little or no risk.' :
                        level.level === 'Moderate' ? 'Air quality is acceptable for most people.' :
                        'Members of sensitive groups may experience health effects.',
            recommendations: recommendations[level.level] || recommendations['Unhealthy']
        };
    }

    renderDashboard() {
        const currentData = this.data.historical_data.find(d => d.city === this.currentCity);
        if (!currentData) return;

        const aqiLevel = this.getAQILevel(currentData.aqi);
        const healthInfo = this.getHealthRecommendations(currentData.aqi);

        // Update AQI display
        const aqiValueEl = document.getElementById('aqiValue');
        const aqiLabelEl = document.getElementById('aqiLabel');
        const currentLocationEl = document.getElementById('currentLocation');
        const dominantPollutantEl = document.getElementById('dominantPollutant');
        
        if (aqiValueEl) aqiValueEl.textContent = currentData.aqi;
        if (aqiLabelEl) aqiLabelEl.textContent = aqiLevel.level;
        if (currentLocationEl) currentLocationEl.textContent = `${currentData.city}, ${currentData.country}`;
        if (dominantPollutantEl) {
            dominantPollutantEl.innerHTML = `Dominant: <span>${currentData.dominant_pollutant.toUpperCase()}</span>`;
        }
        
        // Update timestamp
        const date = new Date(currentData.timestamp);
        const updateTimeEl = document.getElementById('updateTime');
        if (updateTimeEl) {
            updateTimeEl.textContent = `Last updated: ${date.toLocaleString()}`;
        }

        // Update health recommendations
        const statusElement = document.querySelector('.health-status .status');
        if (statusElement) {
            statusElement.className = `status status--${aqiLevel.level === 'Good' ? 'success' : 
                                                       aqiLevel.level === 'Moderate' ? 'warning' : 'error'}`;
            statusElement.textContent = aqiLevel.level;
        }
        
        const healthDescEl = document.getElementById('healthDesc');
        if (healthDescEl) {
            healthDescEl.textContent = healthInfo.description;
        }
        
        const recommendationsList = document.getElementById('healthRecommendations');
        if (recommendationsList) {
            recommendationsList.innerHTML = healthInfo.recommendations
                .map(rec => `<li>${rec}</li>`)
                .join('');
        }

        // Update pollutant values
        const pollutantIds = ['pm25', 'pm10', 'no2', 'o3', 'co', 'so2'];
        pollutantIds.forEach(pollutant => {
            const valueEl = document.getElementById(`${pollutant}Value`);
            if (valueEl) {
                valueEl.textContent = currentData[pollutant];
            }
        });

        // Update pollutant bars
        this.updatePollutantBars(currentData);
    }

    updatePollutantBars(data) {
        const maxValues = { pm25: 100, pm10: 150, no2: 100, o3: 200, co: 20, so2: 100 };
        
        Object.keys(maxValues).forEach(pollutant => {
            const percentage = Math.min((data[pollutant] / maxValues[pollutant]) * 100, 100);
            const barFill = document.querySelector(`[data-pollutant="${pollutant}"] .bar-fill`);
            if (barFill) {
                barFill.style.width = `${percentage}%`;
            }
        });
    }

    initializeMap() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer || this.map) return;

        this.map = L.map('mapContainer').setView([40.7128, -74.0060], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add markers for each city
        this.data.historical_data.forEach(cityData => {
            const aqiLevel = this.getAQILevel(cityData.aqi);
            
            const marker = L.circleMarker([cityData.lat, cityData.lon], {
                radius: 8,
                fillColor: aqiLevel.color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);

            const popupContent = `
                <div class="popup-header">${cityData.city}, ${cityData.country}</div>
                <div class="popup-aqi" style="color: ${aqiLevel.color};">AQI: ${cityData.aqi}</div>
                <div class="popup-pollutants">
                    <div>PM2.5: ${cityData.pm25} µg/m³</div>
                    <div>PM10: ${cityData.pm10} µg/m³</div>
                    <div>NO2: ${cityData.no2} µg/m³</div>
                    <div>O3: ${cityData.o3} µg/m³</div>
                    <div>CO: ${cityData.co} mg/m³</div>
                    <div>SO2: ${cityData.so2} µg/m³</div>
                </div>
                <div class="popup-recommendation">
                    <strong>${aqiLevel.level}</strong><br>
                    ${this.getHealthRecommendations(cityData.aqi).description}
                </div>
            `;

            marker.bindPopup(popupContent);
        });
    }

    renderCharts() {
        this.renderHistoricalChart();
        this.renderPollutantChart();
        this.renderCitiesChart();
        this.renderDistributionChart();
    }

    renderHistoricalChart() {
        const ctx = document.getElementById('historicalChart');
        if (!ctx) return;
        
        const chartData = this.generateHistoricalData(this.currentCity);

        if (this.charts.historical) {
            this.charts.historical.destroy();
        }

        this.charts.historical = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(d => d.date),
                datasets: [{
                    label: 'AQI',
                    data: chartData.map(d => d.aqi),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'AQI'
                        }
                    }
                }
            }
        });
    }

    generateHistoricalData(cityName) {
        const currentData = this.data.historical_data.find(d => d.city === cityName);
        if (!currentData) return [];

        const historicalData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const baseAqi = currentData.aqi;
            const variation = (Math.random() - 0.5) * 30;
            const aqi = Math.max(0, Math.round(baseAqi + variation));
            
            historicalData.push({
                date: date.toLocaleDateString(),
                aqi: aqi
            });
        }
        
        return historicalData;
    }

    renderPollutantChart() {
        const ctx = document.getElementById('pollutantChart');
        if (!ctx) return;
        
        const currentData = this.data.historical_data.find(d => d.city === this.currentCity);
        if (!currentData) return;

        if (this.charts.pollutant) {
            this.charts.pollutant.destroy();
        }

        this.charts.pollutant = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['PM2.5', 'PM10', 'NO2', 'O3', 'CO', 'SO2'],
                datasets: [{
                    label: 'Concentration',
                    data: [currentData.pm25, currentData.pm10, currentData.no2, currentData.o3, currentData.co, currentData.so2],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Concentration (µg/m³)'
                        }
                    }
                }
            }
        });
    }

    renderCitiesChart() {
        const ctx = document.getElementById('citiesChart');
        if (!ctx) return;

        if (this.charts.cities) {
            this.charts.cities.destroy();
        }

        this.charts.cities = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.historical_data.map(d => d.city),
                datasets: [{
                    label: 'AQI',
                    data: this.data.historical_data.map(d => d.aqi),
                    backgroundColor: this.data.historical_data.map(d => this.getAQILevel(d.aqi).color)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'AQI'
                        }
                    }
                }
            }
        });
    }

    renderDistributionChart() {
        const ctx = document.getElementById('distributionChart');
        if (!ctx) return;
        
        const currentData = this.data.historical_data.find(d => d.city === this.currentCity);
        if (!currentData) return;

        if (this.charts.distribution) {
            this.charts.distribution.destroy();
        }

        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['PM2.5', 'PM10', 'NO2', 'O3', 'CO', 'SO2'],
                datasets: [{
                    data: [currentData.pm25, currentData.pm10, currentData.no2, currentData.o3, currentData.co, currentData.so2],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    handleCitySearch(query = '') {
        // Simple search implementation - could be enhanced with autocomplete
        query = query.trim().toLowerCase();
        const cityOptions = document.querySelectorAll('#citySearchResults .city-option');
        cityOptions.forEach(option => {
            const cityName = option.textContent.toLowerCase();
            if (cityName.includes(query)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    }

    addCityToComparison() {
        const searchInput = document.getElementById('citySearch');
        if (!searchInput) return;
        
        const cityName = searchInput.value.trim();
        if (!cityName) return;
        
        const cityData = this.data.historical_data.find(d => 
            d.city.toLowerCase() === cityName.toLowerCase()
        );
        
        if (cityData && !this.selectedCities.includes(cityData.city)) {
            this.selectedCities.push(cityData.city);
            this.renderCompareTable();
            searchInput.value = '';
        }
    }

    async renderCompareTable() {
        const tbody = document.querySelector('#compareTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        // Add some default cities if none selected
        if (this.selectedCities.length === 0) {
            this.selectedCities = ['New York', 'Los Angeles', 'Delhi', 'London'];
        }

        // Update forecast city dropdown
        const forecastCitySelect = document.getElementById('forecastCity');
        if (forecastCitySelect) {
            forecastCitySelect.innerHTML = '';
            this.selectedCities.forEach(cityName => {
                const option = document.createElement('option');
                option.value = cityName;
                option.textContent = cityName;
                forecastCitySelect.appendChild(option);
            });
            // Set current city as selected
            forecastCitySelect.value = this.currentCity;
        }

        for (const cityName of this.selectedCities) {
            try {
                const coords = await getCoordinates(cityName);
                const aqiData = await fetchAirQuality(coords.lat, coords.lon);
                // Calculate AQI from PM2.5 using US EPA formula
                const pm25 = aqiData.list[0].components.pm2_5;
                function calcAqiPm25(c) {
                    if (c <= 12) return Math.round((50/12)*c);
                    if (c <= 35.4) return Math.round(((100-51)/(35.4-12.1))*(c-12.1)+51);
                    if (c <= 55.4) return Math.round(((150-101)/(55.4-35.5))*(c-35.5)+101);
                    if (c <= 150.4) return Math.round(((200-151)/(150.4-55.5))*(c-55.5)+151);
                    if (c <= 250.4) return Math.round(((300-201)/(250.4-150.5))*(c-150.5)+201);
                    if (c <= 350.4) return Math.round(((400-301)/(350.4-250.5))*(c-250.5)+301);
                    if (c <= 500.4) return Math.round(((500-401)/(500.4-350.5))*(c-350.5)+401);
                    return 500;
                }
                const aqi = calcAqiPm25(pm25);
                const aqiLevel = this.getAQILevel(aqi);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${coords.city}, ${coords.country}</td>
                    <td style="color: ${aqiLevel.color}; font-weight: bold;">${aqi}</td>
                    <td><span class="status status--${aqiLevel.level === 'Good' ? 'success' : 
                                                       aqiLevel.level === 'Moderate' ? 'warning' : 'error'}">${aqiLevel.level}</span></td>
                    <td>${pm25}</td>
                    <td>${aqiData.list[0].components.pm10}</td>
                    <td>${aqiData.list[0].components.no2}</td>
                    <td>${aqiData.list[0].components.o3}</td>
                    <td>${aqiData.list[0].components.co}</td>
                    <td>${aqiData.list[0].components.so2}</td>
                    <td><button class="remove-city-btn" onclick="app.removeCityFromComparison('${coords.city}')">Remove</button></td>
                `;
                tbody.appendChild(row);

                // --- Add/Update historical_data for this city so forecast works ---
                const histIdx = this.data.historical_data.findIndex(d => d.city === coords.city);
                const newHist = {
                    city: coords.city,
                    country: coords.country,
                    lat: coords.lat,
                    lon: coords.lon,
                    timestamp: new Date().toISOString(),
                    aqi: aqi,
                    pm25: pm25,
                    pm10: aqiData.list[0].components.pm10,
                    no2: aqiData.list[0].components.no2,
                    o3: aqiData.list[0].components.o3,
                    co: aqiData.list[0].components.co,
                    so2: aqiData.list[0].components.so2,
                    dominant_pollutant: 'pm2_5'
                };
                if (histIdx === -1) {
                    this.data.historical_data.push(newHist);
                } else {
                    this.data.historical_data[histIdx] = newHist;
                }
                // --- End add/update historical_data ---
            } catch (err) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="10">${cityName}: Unable to fetch real-time AQI</td>`;
                tbody.appendChild(row);
            }
        }
        // After updating data, update the map if it's initialized
        if (this.map) {
            this.map.eachLayer(layer => {
                if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
                    this.map.removeLayer(layer);
                }
            });
            // Add updated markers
            this.data.historical_data.forEach(cityData => {
                const aqiLevel = this.getAQILevel(cityData.aqi);
                const marker = L.circleMarker([cityData.lat, cityData.lon], {
                    radius: 8,
                    fillColor: aqiLevel.color,
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(this.map);
                const popupContent = `
                    <div class="popup-header">${cityData.city}, ${cityData.country}</div>
                    <div class="popup-aqi" style="color: ${aqiLevel.color};">AQI: ${cityData.aqi}</div>
                    <div class="popup-pollutants">
                        <div>PM2.5: ${cityData.pm25} µg/m³</div>
                        <div>PM10: ${cityData.pm10} µg/m³</div>
                        <div>NO2: ${cityData.no2} µg/m³</div>
                        <div>O3: ${cityData.o3} µg/m³</div>
                        <div>CO: ${cityData.co} mg/m³</div>
                        <div>SO2: ${cityData.so2} µg/m³</div>
                    </div>
                    <div class="popup-recommendation">
                        <strong>${aqiLevel.level}</strong><br>
                        ${this.getHealthRecommendations(cityData.aqi).description}
                    </div>
                `;
                marker.bindPopup(popupContent);
            });
        }
    }

    removeCityFromComparison(cityName) {
        this.selectedCities = this.selectedCities.filter(city => city !== cityName);
        this.renderCompareTable();
    }

    renderForecast() {
        const ctx = document.getElementById('forecastChart');
        if (!ctx) return;
        
        // Generate forecast data for the current city
        const forecastData = this.generateForecastData(this.currentCity);
        
        if (this.charts.forecast) {
            this.charts.forecast.destroy();
        }

        this.charts.forecast = new Chart(ctx, {
            type: 'line',
            data: {
                labels: forecastData.map(d => d.date),
                datasets: [{
                    label: 'Predicted AQI',
                    data: forecastData.map(d => d.aqi),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Confidence Level (%)',
                    data: forecastData.map(d => d.confidence),
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    tension: 0.4,
                    fill: false,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'AQI / Confidence %'
                        }
                    }
                }
            }
        });
    }

    generateForecastData(cityName) {
        // Use ML forecast if available
        if (this.mlForecastData) {
            const cityForecast = this.mlForecastData.find(f => f.city === cityName);
            if (cityForecast && cityForecast.forecast) {
                return cityForecast.forecast.map(d => ({
                    date: new Date(d.date).toLocaleDateString(),
                    aqi: d.predicted_aqi,
                    confidence: Math.round((d.confidence || 0.8) * 100)
                }));
            }
        }
        // Fallback: simple random forecast
        const currentData = this.data.historical_data.find(d => d.city === cityName);
        if (!currentData) return [];
        const forecastDays = 5;
        const forecastData = [];
        for (let i = 1; i <= forecastDays; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const baseAqi = currentData.aqi;
            const randomVariation = (Math.random() - 0.5) * 20;
            const predictedAqi = Math.max(0, Math.round(baseAqi + randomVariation));
            forecastData.push({
                date: date.toLocaleDateString(),
                aqi: predictedAqi,
                confidence: Math.max(60, 95 - (i * 5))
            });
        }
        return forecastData;
    }

    displayGlobalCityAQI(coords, aqiData) {
        // OpenWeatherMap returns AQI index 1-5, map to your scale if needed
        const aqiIndex = aqiData.list[0].main.aqi;
        // Calculate AQI from PM2.5 using US EPA formula for more accurate value
        const pm25 = aqiData.list[0].components.pm2_5;
        const pm10 = aqiData.list[0].components.pm10;
        const no2 = aqiData.list[0].components.no2;
        const o3 = aqiData.list[0].components.o3;
        const co = aqiData.list[0].components.co;
        const so2 = aqiData.list[0].components.so2;

        // Helper function for AQI calculation (US EPA breakpoints for PM2.5)
        function calcAqiPm25(c) {
            if (c <= 12) return Math.round((50/12)*c);
            if (c <= 35.4) return Math.round(((100-51)/(35.4-12.1))*(c-12.1)+51);
            if (c <= 55.4) return Math.round(((150-101)/(55.4-35.5))*(c-35.5)+101);
            if (c <= 150.4) return Math.round(((200-151)/(150.4-55.5))*(c-55.5)+151);
            if (c <= 250.4) return Math.round(((300-201)/(250.4-150.5))*(c-150.5)+201);
            if (c <= 350.4) return Math.round(((400-301)/(350.4-250.5))*(c-250.5)+301);
            if (c <= 500.4) return Math.round(((500-401)/(500.4-350.5))*(c-350.5)+401);
            return 500;
        }
        // You can add similar functions for PM10, NO2, O3, etc. for a more robust AQI
        const aqiPm25 = calcAqiPm25(pm25);
        // For simplicity, use PM2.5 AQI as the main AQI (as is common in many apps)
        const aqi = aqiPm25;

        // Compose a data object similar to your existing structure
        const cityData = {
            city: coords.city,
            country: coords.country,
            lat: coords.lat,
            lon: coords.lon,
            timestamp: new Date().toISOString(),
            aqi: aqi,
            pm25: pm25,
            pm10: pm10,
            no2: no2,
            o3: o3,
            co: co,
            so2: so2,
            dominant_pollutant: 'pm2_5' // or choose based on highest value
        };

        // Optionally add to your data for comparison, or just display
        this.data.historical_data = [cityData, ...this.data.historical_data.filter(d => d.city !== cityData.city)];
        this.currentCity = cityData.city;
        this.renderDashboard();
        this.renderCharts();
    }
}

const OPENWEATHERMAP_API_KEY = "YOUR_API_Key"; // Replace with your API key

async function getCoordinates(cityName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon, city: data[0].name, country: data[0].country };
    }
    throw new Error('City not found');
}

async function fetchAirQuality(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`;
    const res = await fetch(url);
    return res.json();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AirQualityApp();
});

