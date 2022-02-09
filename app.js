let ip_text = document.querySelector("#ip_text");
let location_text = document.querySelector("#location_text");
let timezone_text = document.querySelector("#timezone_text");
let isp_text = document.querySelector("#isp_text");
let ip_info = document.querySelector(".ip_info");

let ip_form = document.querySelector("#ip_form");
let ip_input = document.querySelector("#ip_input");

let map = L.map('map');
let myIcon = L.icon({
    iconUrl:'images/icon-location.svg',
    iconSize:[40,50],
    iconAnchor:[22,94],
    popUpAnchor:[-3,76]
});
map.setView([37.97175,23.72577],13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(map);

ip_form.addEventListener("submit",function(e) {
    e.preventDefault();
    var ip_value = ip_input.value;

    fetchIpInfo(ip_value).then(data=> {
        showInfo(data);
    })
    .catch(e=>{
        throw new Error(e);
    })
});

async function fetchIpInfo(value) {
    const result = await fetch(`http://ip-api.com/json/${value}`)
    return await result.json();
}

function showInfo(data) {
    if(data.status==="fail") {
        ip_form.nextElementSibling.style.display = "block";
        return;
    }
    
    if(ip_form.nextElementSibling.offsetParent!==null) {
        ip_form.nextElementSibling.style.display="none";
    }
    ip_text.textContent = data.query;
    location_text.textContent = `${data.city}, ${data.regionName}, ${data.countryCode}`;
    timezone_text.textContent = data.timezone;
    isp_text.textContent = data.isp;

    showMap(data.lat,data.lon);
    if(ip_info.classList.length!==2) {
        ip_info.classList.toggle("reveal_info");
    }
}

function showMap(lat,lon) {
    map.setView([lat,lon],15);
    L.marker([lat,lon],{icon:myIcon}).addTo(map);
}