let step = 1;
let basket = JSON.parse(localStorage.getItem('basket')) || [];

function updateRad(v) { document.getElementById('rad-val').innerText = v; }

function changeStep(dir) {
    document.getElementById(`step-${step}`).style.display = 'none';
    step += dir;
    document.getElementById(`step-${step}`).style.display = 'block';
    document.getElementById('step-num').innerText = step;
}

async function getGPS() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Her kaldes Overpass API eller lignende
        alert("Position fundet! Finder butikker...");
        changeStep(1);
    });
}
