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

const LEAFLET_API_KEY = "pk.eyJ1IjoidGVvc3RhbWF0aWFkaXMiLCJhIjoiY2t6ZmZvemtuMnN4NzJybjk3dHU1dWt1OCJ9.dNaYOxOB7obCYJMBcmhYXQ";
const IP_GEO_API_KEY = "23a014fe0a0342949e2ce2ec3bf0baf9";


map.setView([37.97175,23.72577],13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: LEAFLET_API_KEY
}).addTo(map);

ip_form.addEventListener("submit",function(e) {
    e.preventDefault();
    var ip_value = ip_input.value;

    fetchIpInfo(ip_value).then(data=> {
        showInfo(data);
    })
    .catch(e=> {
        ip_form.nextElementSibling.style.display = "block";
    })
});

async function fetchIpInfo(value) {
    const result = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${IP_GEO_API_KEY}&ip=${value}`);
    if(result.ok) return await result.json();
    else return null;
}

function showInfo(data) {
    var timezone_offset = data.time_zone.offset;
    
    if(ip_form.nextElementSibling.offsetParent!==null) ip_form.nextElementSibling.style.display="none";

    ip_text.textContent = data.ip;
    location_text.textContent = `${data.country_capital}, ${data.country_name}`;
    isp_text.textContent = data.isp;

    if(timezone_offset<0) {
        timezone_text.textContent = `${data.time_zone.name} GMT ${timezone_offset}`;
    }
    else {
        timezone_text.textContent = `${data.time_zone.name} GMT +${timezone_offset}`;
    }

    showMap(data.latitude,data.longitude);
    
    if(!ip_info.classList.contains("reveal_info")) ip_info.classList.toggle("reveal_info");
    
}

function showMap(lat,lon) {
    map.setView([lat,lon],15);
    L.marker([lat,lon],{icon:myIcon}).addTo(map);
}