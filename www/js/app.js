// Ilocos Sur tourist data
const ilocosSurData = {
    cities: [
        {
            name: "Vigan",
            coordinates: [17.5747, 120.3870],
            description: "A UNESCO World Heritage site known for its preserved Spanish colonial and Asian architecture",
            image: "img/vigan-city.jpg",
            attractions: [
                {
                    name: "Calle Crisologo",
                    description: "Historic cobblestone street lined with Spanish colonial houses",
                    image: "img/calle-crisologo.jpg",
                    coordinates: [17.5747, 120.3870],
                    details: {
                        history: "Calle Crisologo is the heart of Vigan's historic district, featuring well-preserved Spanish colonial architecture from the 18th and 19th centuries.",
                        bestTime: "Early morning or late afternoon",
                        activities: ["Photography", "Shopping for souvenirs", "Horse-drawn carriage rides"],
                        tips: ["Visit early morning to avoid crowds", "Best photos during golden hour", "Try the local empanada nearby"]
                    }
                },
                {
                    name: "Vigan Cathedral",
                    description: "Also known as Metropolitan Cathedral of the Conversion of St. Paul",
                    image: "img/vigan-cathedral.jpg",
                    coordinates: [17.5757, 120.3867],
                    details: {
                        history: "Built in 1790, this baroque church represents the Spanish colonial influence on Philippine architecture.",
                        bestTime: "Any time during daylight hours",
                        activities: ["Attend mass", "Architecture appreciation", "Photography"],
                        tips: ["Respect dress code", "Check mass schedule", "Visit Plaza Salcedo after"]
                    }
                },
                {
                    name: "Plaza Salcedo",
                    description: "Historic plaza featuring a dancing fountain show",
                    image: "img/plaza-salcedo.jpg",
                    coordinates: [17.5752, 120.3873],
                    details: {
                        history: "Named after Juan de Salcedo, this plaza is the oldest monument in Northern Luzon.",
                        bestTime: "Evening for fountain shows",
                        activities: ["Watch fountain show", "Picnic", "Evening stroll"],
                        tips: ["Fountain shows at 7:30 PM", "Bring a camera", "Visit nearby restaurants"]
                    }
                }
            ]
        },
        {
            name: "Santa Maria",
            coordinates: [17.3667, 120.4833],
            description: "Home to the historic Santa Maria Church, a UNESCO World Heritage Site",
            image: "img/santa-maria-city.jpg",
            attractions: [
                {
                    name: "Santa Maria Church",
                    description: "UNESCO World Heritage Site, Baroque church built in 1765",
                    image: "img/santa-maria-church.jpg",
                    coordinates: [17.3667, 120.4833],
                    details: {
                        history: "One of the four baroque churches in the Philippines inscribed in the UNESCO World Heritage List",
                        bestTime: "Morning to afternoon",
                        activities: ["Church visit", "Historical tour", "Photography"],
                        tips: ["Climb the stairs for panoramic views", "Visit early morning", "Bring water"]
                    }
                }
            ]
        },
        {
            name: "Candon",
            coordinates: [17.2000, 120.4500],
            description: "Known as the Tobacco Capital of the Philippines",
            image: "img/candon-city.jpg",
            attractions: [
                {
                    name: "Candon Church",
                    description: "Historic church known for its architectural beauty",
                    image: "img/candon-church.jpg",
                    coordinates: [17.2000, 120.4500],
                    details: {
                        history: "Built in 1779, the church showcases Spanish colonial architecture and religious artistry",
                        bestTime: "Morning to late afternoon",
                        activities: ["Church visit", "Photography", "Local culture exploration"],
                        tips: ["Visit during off-peak hours", "Try local tobacco products", "Explore nearby markets"]
                    }
                }
            ]
        }
    ]
};

// Initialize the application
document.addEventListener('deviceready', onDeviceReady, false);

let map;
let markers = [];
let currentLocation = null;
let searchModal = null;
let locationModal = null;

function onDeviceReady() {
    // Initialize map
    initializeMap();
    
    // Initialize Bootstrap modals
    searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
    locationModal = new bootstrap.Modal(document.getElementById('locationModal'));
    
    // Populate city list
    populateCityList();
    
    // Load first city by default
    loadCity(ilocosSurData.cities[0]);
    
    // Initialize search
    initializeSearch();
    
    // Store data for offline use
    localStorage.setItem('ilocosSurData', JSON.stringify(ilocosSurData));
}

function initializeMap() {
    // Center the map on Ilocos Sur
    map = L.map('map').setView([17.5747, 120.3870], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

function populateCityList() {
    const cityList = document.querySelector('.city-list');
    cityList.innerHTML = '';
    
    ilocosSurData.cities.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.className = 'city-item';
        cityElement.innerHTML = `
            <h5>${city.name}</h5>
            <p class="mb-0">${city.description}</p>
        `;
        cityElement.addEventListener('click', () => {
            loadCity(city);
            document.querySelector('[data-bs-dismiss="offcanvas"]').click();
        });
        cityList.appendChild(cityElement);
    });
}

function loadCity(city) {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];
    
    // Center map on city
    map.setView(city.coordinates, 13);
    
    // Add markers for attractions
    city.attractions.forEach(attraction => {
        const marker = L.marker(attraction.coordinates)
            .bindPopup(`
                <b>${attraction.name}</b><br>
                ${attraction.description}<br>
                <button onclick="showLocationDetails('${city.name}', '${attraction.name}')" class="btn btn-sm btn-primary mt-2">View Details</button>
            `)
            .addTo(map);
        markers.push(marker);
    });
    
    // Update attractions list
    updateAttractionsList(city);
}

function updateAttractionsList(city) {
    const attractionsList = document.querySelector('.attractions-list');
    attractionsList.innerHTML = '';
    
    city.attractions.forEach(attraction => {
        const card = document.createElement('div');
        card.className = 'attraction-card';
        card.innerHTML = `
            <img src="${attraction.image}" alt="${attraction.name}">
            <h4>${attraction.name}</h4>
            <p>${attraction.description}</p>
            <button class="btn btn-primary btn-sm" onclick="showLocationDetails('${city.name}', '${attraction.name}')">
                View Details
            </button>
        `;
        card.addEventListener('click', () => {
            map.setView(attraction.coordinates, 15);
            markers.find(m => 
                m.getLatLng().lat === attraction.coordinates[0] && 
                m.getLatLng().lng === attraction.coordinates[1]
            ).openPopup();
        });
        attractionsList.appendChild(card);
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.querySelector('.search-results');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = searchLocations(query);
        displaySearchResults(results);
    });
}

function searchLocations(query) {
    const results = [];
    
    ilocosSurData.cities.forEach(city => {
        if (city.name.toLowerCase().includes(query) || 
            city.description.toLowerCase().includes(query)) {
            results.push({
                type: 'city',
                city: city,
                item: city
            });
        }
        
        city.attractions.forEach(attraction => {
            if (attraction.name.toLowerCase().includes(query) || 
                attraction.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'attraction',
                    city: city,
                    item: attraction
                });
            }
        });
    });
    
    return results;
}

function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="text-muted">No results found</p>';
        return;
    }
    
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'search-result-item p-2 border-bottom';
        resultElement.innerHTML = `
            <h6 class="mb-1">${result.item.name}</h6>
            <p class="mb-1 small">${result.type === 'attraction' ? `In ${result.city.name}` : 'City'}</p>
            <p class="mb-0 small text-muted">${result.item.description}</p>
        `;
        
        resultElement.addEventListener('click', () => {
            if (result.type === 'city') {
                loadCity(result.item);
            } else {
                showLocationDetails(result.city.name, result.item.name);
            }
            searchModal.hide();
        });
        
        searchResults.appendChild(resultElement);
    });
}

function showLocationDetails(cityName, attractionName) {
    const city = ilocosSurData.cities.find(c => c.name === cityName);
    const attraction = city.attractions.find(a => a.name === attractionName);
    
    // Update modal content
    document.getElementById('locationTitle').textContent = attraction.name;
    document.getElementById('locationImage').src = attraction.image;
    document.getElementById('locationName').textContent = attraction.name;
    document.getElementById('locationDescription').textContent = attraction.description;
    
    // Update details
    const detailsContainer = document.getElementById('locationDetails');
    detailsContainer.innerHTML = `
        <div class="mt-3">
            <h5>History</h5>
            <p>${attraction.details.history}</p>
            
            <h5>Best Time to Visit</h5>
            <p>${attraction.details.bestTime}</p>
            
            <h5>Activities</h5>
            <ul>
                ${attraction.details.activities.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
            
            <h5>Tips</h5>
            <ul>
                ${attraction.details.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Show nearby attractions
    const nearbyContainer = document.getElementById('nearbyAttractions');
    const nearbyAttractions = city.attractions.filter(a => a.name !== attraction.name);
    nearbyContainer.innerHTML = nearbyAttractions.map(nearby => `
        <div class="col-md-4">
            <div class="card">
                <img src="${nearby.image}" class="card-img-top" alt="${nearby.name}">
                <div class="card-body">
                    <h6 class="card-title">${nearby.name}</h6>
                    <button class="btn btn-sm btn-primary" onclick="showLocationDetails('${city.name}', '${nearby.name}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Setup show on map button
    document.getElementById('showOnMap').onclick = () => {
        locationModal.hide();
        map.setView(attraction.coordinates, 15);
        markers.find(m => 
            m.getLatLng().lat === attraction.coordinates[0] && 
            m.getLatLng().lng === attraction.coordinates[1]
        ).openPopup();
    };
    
    // Show the modal
    locationModal.show();
}

// Handle offline functionality
window.addEventListener('offline', () => {
    console.log('App is offline');
    // Load data from localStorage
    const offlineData = JSON.parse(localStorage.getItem('ilocosSurData'));
    if (offlineData) {
        // Continue using cached data
        console.log('Using cached data');
    }
});

window.addEventListener('online', () => {
    console.log('App is back online');
    // Sync any necessary data here
});
