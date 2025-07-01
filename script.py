# Create sample air quality data structure for the application
import json
import random
from datetime import datetime, timedelta
import pandas as pd

# Sample cities with coordinates
cities = [
    {"name": "New York", "lat": 40.7128, "lon": -74.0060, "country": "USA"},
    {"name": "Los Angeles", "lat": 34.0522, "lon": -118.2437, "country": "USA"},
    {"name": "London", "lat": 51.5074, "lon": -0.1278, "country": "UK"},
    {"name": "Paris", "lat": 48.8566, "lon": 2.3522, "country": "France"},
    {"name": "Tokyo", "lat": 35.6762, "lon": 139.6503, "country": "Japan"},
    {"name": "Delhi", "lat": 28.7041, "lon": 77.1025, "country": "India"},
    {"name": "Beijing", "lat": 39.9042, "lon": 116.4074, "country": "China"},
    {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777, "country": "India"},
    {"name": "São Paulo", "lat": -23.5505, "lon": -46.6333, "country": "Brazil"},
    {"name": "Sydney", "lat": -33.8688, "lon": 151.2093, "country": "Australia"}
]

# Generate sample air quality data
def generate_aqi_data():
    current_time = datetime.now()
    data = []
    
    for city in cities:
        # Generate historical data (last 30 days)
        for i in range(30):
            timestamp = current_time - timedelta(days=i)
            
            # Simulate seasonal and daily variations
            base_aqi = random.randint(50, 150)
            
            # Add some variation based on city (some cities typically have worse air quality)
            if city["name"] in ["Delhi", "Beijing", "Mumbai"]:
                base_aqi += random.randint(20, 80)
            elif city["name"] in ["Sydney", "New York"]:
                base_aqi = max(20, base_aqi - random.randint(20, 40))
                
            # Generate pollutant data
            pm25 = random.uniform(10, min(base_aqi * 0.8, 200))
            pm10 = pm25 * random.uniform(1.2, 2.5)
            no2 = random.uniform(20, 100)
            o3 = random.uniform(50, 150)
            co = random.uniform(0.5, 15)
            so2 = random.uniform(5, 50)
            
            data.append({
                "city": city["name"],
                "country": city["country"],
                "lat": city["lat"],
                "lon": city["lon"],
                "timestamp": timestamp.isoformat(),
                "aqi": min(int(base_aqi), 500),
                "pm25": round(pm25, 2),
                "pm10": round(pm10, 2),
                "no2": round(no2, 2),
                "o3": round(o3, 2),
                "co": round(co, 2),
                "so2": round(so2, 2),
                "dominant_pollutant": "pm25" if pm25 > 35 else "o3" if o3 > 100 else "no2"
            })
    
    return data

# Generate forecast data (next 5 days)
def generate_forecast_data():
    current_time = datetime.now()
    forecast_data = []
    
    for city in cities:
        current_aqi = random.randint(50, 150)
        if city["name"] in ["Delhi", "Beijing", "Mumbai"]:
            current_aqi += random.randint(20, 60)
        
        for i in range(1, 6):  # Next 5 days
            # Add some trend (slight improvement or degradation)
            trend = random.uniform(-5, 5)
            current_aqi = max(20, min(500, current_aqi + trend + random.uniform(-10, 10)))
            
            forecast_date = current_time + timedelta(days=i)
            
            forecast_data.append({
                "city": city["name"],
                "country": city["country"],
                "lat": city["lat"],
                "lon": city["lon"],
                "forecast_date": forecast_date.isoformat(),
                "predicted_aqi": int(current_aqi),
                "confidence": random.uniform(0.75, 0.95)
            })
    
    return forecast_data

# Generate health recommendations based on AQI
def get_health_recommendations(aqi):
    if 0 <= aqi <= 50:
        return {
            "level": "Good",
            "color": "#00e400",
            "description": "Air quality is satisfactory, and air pollution poses little or no risk.",
            "recommendations": [
                "Enjoy outdoor activities",
                "Perfect time for exercise outdoors",
                "No health precautions needed"
            ]
        }
    elif 51 <= aqi <= 100:
        return {
            "level": "Moderate",
            "color": "#ffff00",
            "description": "Air quality is acceptable for most people.",
            "recommendations": [
                "Unusually sensitive people should consider reducing prolonged outdoor exertion",
                "Generally safe for outdoor activities",
                "Monitor symptoms if you're sensitive to air pollution"
            ]
        }
    elif 101 <= aqi <= 150:
        return {
            "level": "Unhealthy for Sensitive Groups",
            "color": "#ff7e00",
            "description": "Members of sensitive groups may experience health effects.",
            "recommendations": [
                "People with respiratory or heart disease should limit prolonged outdoor exertion",
                "Children and elderly should reduce outdoor activities",
                "Consider wearing a mask outdoors"
            ]
        }
    elif 151 <= aqi <= 200:
        return {
            "level": "Unhealthy",
            "color": "#ff0000",
            "description": "Everyone may begin to experience health effects.",
            "recommendations": [
                "Everyone should limit prolonged outdoor exertion",
                "Sensitive groups should avoid outdoor activities",
                "Close windows and use air purifiers indoors",
                "Wear N95 masks when going outside"
            ]
        }
    elif 201 <= aqi <= 300:
        return {
            "level": "Very Unhealthy",
            "color": "#8f3f97",
            "description": "Health alert: everyone may experience serious health effects.",
            "recommendations": [
                "Everyone should avoid outdoor exertion",
                "Stay indoors with windows closed",
                "Use air purifiers",
                "Seek medical attention if experiencing symptoms"
            ]
        }
    else:
        return {
            "level": "Hazardous",
            "color": "#7e0023",
            "description": "Emergency conditions. The entire population is affected.",
            "recommendations": [
                "Everyone must avoid outdoor activities",
                "Stay indoors with all windows and doors sealed",
                "Use high-efficiency air purifiers",
                "Seek immediate medical attention for any symptoms"
            ]
        }

# Create the main data structure
air_quality_data = generate_aqi_data()
forecast_data = generate_forecast_data()

# Add health recommendations to current data
for item in air_quality_data:
    if item["timestamp"].startswith(datetime.now().strftime("%Y-%m-%d")):  # Today's data
        item["health_info"] = get_health_recommendations(item["aqi"])

# Create a comprehensive dataset
complete_dataset = {
    "historical_data": air_quality_data,
    "forecast_data": forecast_data,
    "cities": cities,
    "api_endpoints": {
        "openweathermap": "http://api.openweathermap.org/data/2.5/air_pollution",
        "aqicn": "https://api.waqi.info/feed/",
        "waqi": "https://api.waqi.info/v2/"
    },
    "pollutant_info": {
        "PM2.5": {
            "name": "Fine Particulate Matter",
            "unit": "µg/m³",
            "description": "Particles with diameter ≤ 2.5 micrometers",
            "sources": ["Vehicle emissions", "Industrial processes", "Wildfires"],
            "health_effects": ["Respiratory issues", "Cardiovascular problems", "Lung cancer"]
        },
        "PM10": {
            "name": "Coarse Particulate Matter", 
            "unit": "µg/m³",
            "description": "Particles with diameter ≤ 10 micrometers",
            "sources": ["Dust storms", "Construction", "Road dust"],
            "health_effects": ["Throat irritation", "Asthma", "Lung inflammation"]
        },
        "NO2": {
            "name": "Nitrogen Dioxide",
            "unit": "µg/m³", 
            "description": "Reddish-brown gas",
            "sources": ["Vehicle emissions", "Power plants", "Industrial facilities"],
            "health_effects": ["Respiratory infections", "Asthma", "Lung development issues"]
        },
        "O3": {
            "name": "Ground-level Ozone",
            "unit": "µg/m³",
            "description": "Secondary pollutant formed by photochemical reactions",
            "sources": ["Vehicle emissions + sunlight", "Industrial emissions"],
            "health_effects": ["Chest pain", "Coughing", "Throat irritation"]
        },
        "CO": {
            "name": "Carbon Monoxide",
            "unit": "mg/m³",
            "description": "Colorless, odorless gas",
            "sources": ["Vehicle emissions", "Residential heating", "Industrial processes"],
            "health_effects": ["Headaches", "Dizziness", "Reduced oxygen delivery"]
        },
        "SO2": {
            "name": "Sulfur Dioxide",
            "unit": "µg/m³",
            "description": "Colorless gas with pungent odor",
            "sources": ["Coal burning", "Industrial processes", "Volcanic emissions"],
            "health_effects": ["Respiratory irritation", "Asthma", "Eye irritation"]
        }
    }
}

# Save to JSON for the web application
with open('air_quality_dataset.json', 'w') as f:
    json.dump(complete_dataset, f, indent=2)

print("✅ Generated comprehensive air quality dataset with:")
print(f"- {len(air_quality_data)} historical data points")
print(f"- {len(forecast_data)} forecast data points") 
print(f"- {len(cities)} cities")
print(f"- Pollutant information and health recommendations")
print(f"- API endpoint configurations")

# Display sample data
print("\n📊 Sample Current Data:")
current_data = [item for item in air_quality_data if item["timestamp"].startswith("2025-06-23")][:3]
for item in current_data:
    print(f"🏙️ {item['city']}: AQI {item['aqi']} - {get_health_recommendations(item['aqi'])['level']}")
    
print("\n🔮 Sample Forecast Data:")
for item in forecast_data[:3]:
    print(f"🏙️ {item['city']}: Predicted AQI {item['predicted_aqi']} (Confidence: {item['confidence']:.1%})")