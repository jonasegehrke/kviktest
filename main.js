//const allCenters = document.querySelector(".all_centers_table")
//const chosenCenters = document.querySelector(".chosen_centers_table")
console.log("Cloudfare test")

const allCenters = document.querySelector(".all_centers_cards")
const chosenCenters = document.querySelector(".chosen_centers_cards")

let cphMedAPI = `https://api.storepoint.co/v1/1614b4269b6d23/locations?lat=55.7067581&long=12.5502443&radius=311`
var notificationSound = document.getElementById("myAudio");

let chosenIndexes = [];

async function getCenters() {

    const resp = await fetch(cphMedAPI)
    const respData = await resp.json();

    return respData;
}


async function createCard() {
    const respData = await getCenters();

    let isLive = false;


    for (let i = 0; i < respData.results.locations.length; i++) {
        //respData.results.locations[i].description = "🟢 Estimeret kø: 0 - 15 min Åbningstid i dag: 08:00 - 20:00"


        const card = document.createElement("div");
        card.classList.add("center_card");

        const id = document.createElement("p");
        id.classList.add("center_id");
        id.innerHTML = respData.results.locations[i].id;

        const queueIcon = document.createElement("p");
        queueIcon.classList.add("center_queue_icon");
        queueIcon.innerHTML = respData.results.locations[i].description.substring(0, 3)

        const name = document.createElement("h5");
        name.classList.add("center_name");
        name.innerHTML = respData.results.locations[i].name;

        const description = document.createElement("p");
        description.classList.add("center_discription");
        description.innerHTML = respData.results.locations[i].description;

        const address = document.createElement("p");
        address.classList.add("center_address");
        address.innerHTML = respData.results.locations[i].streetaddress;


        const trackBtn = document.createElement("button");
        trackBtn.classList.add("btn");
        trackBtn.classList.add("btn-dark")
        trackBtn.classList.add("track_btn")
        trackBtn.onclick = function () {
            card.removeChild(trackBtn)
            track(card)
        }
        trackBtn.innerHTML = "Track"



        card.appendChild(id);
        card.appendChild(name);
        card.appendChild(queueIcon);
        card.appendChild(description);
        card.appendChild(address);
        card.appendChild(trackBtn);
        allCenters.appendChild(card);


        if (respData.results.locations[i].description.length > 5) {
            isLive = true;
        }

    }

    if (!isLive) {
        alert("Copenhagen Medical API either seems to have problems fetching queue times or all test-centers are closed \n Please stand by further updates")
    }

}




function track(card) {
    
    chosenCenters.appendChild(card)
    let queue = card.childNodes[3].textContent.substring(17, 18);

    if (card.childNodes[2].textContent.substring(17, 18) === "M") {
        queue = 6;
    }

    chosenIndexes.push({ card: card, id: card.childNodes[0].textContent, description: card.childNodes[3].textContent, queue: queue })
}


async function checkUpdates() {
    const respData = await getCenters();
    for (let i = 0; i < chosenIndexes.length; i++) {

        for (let j = 0; j < respData.results.locations.length; j++) {

            if (respData.results.locations[j].id === parseInt(chosenIndexes[i].id)) {

                if (respData.results.locations[j].description != chosenIndexes[i].description) {

                    playAudio();
                    if (respData.results.locations[j].description.substring(17, 18) < chosenIndexes[i].queue) {
                        updateCard(true, chosenIndexes[i].card, respData.results.locations[j].description)
                    } else {
                        updateCard(false, chosenIndexes[i].card, respData.results.locations[j].description)
                    }

                    chosenIndexes[i].description = respData.results.locations[j].description;
                    chosenIndexes[i].queue = respData.results.locations[j].description.substring(17, 18);

                    if (respData.results.locations[j].description.substring(17, 18) === "M") {
                        queue = 6;
                    }
                }
            }
        }
    }
}


function updateCard(isLess, card, newDiscription) {

    if (isLess) {
        card.style.background = "green";

    } else {
        card.style.background = "red";
    }

    card.childNodes[3].textContent = newDiscription
}


function playAudio() {
    notificationSound.play();
}

function refresh() {
    for (let i = 0; i < chosenIndexes.length; i++) {
        chosenIndexes[i].card.style.background = "#7859a1"
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.\n Geolocation is set to Nørrebro by default")
    }
}

function showPosition(position) {


    cphMedAPI = `https://api.storepoint.co/v1/1614b4269b6d23/locations?lat=${position.coords.latitude}&long=${position.coords.longitude}&radius=311`
}


getLocation()
setInterval(async function () {
    await checkUpdates()
}, 30000)
setTimeout(function () {
    createCard();
}, 1000)
