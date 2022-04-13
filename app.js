//----------------------COMPASS----------------------

const compassCircle = document.querySelector(".compass-circle");
const myPoint = document.querySelector(".my-point");
const startBtn = document.querySelector(".start-btn");
const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

function init() {
    startBtn.addEventListener("click", startCompass);
    navigator.geolocation.getCurrentPosition(locationHandler);

    if (!isIOS) {
        window.addEventListener("deviceorientationabsolute", handler, true);
    }
}

function startCompass() {
    if (isIOS) {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === "granted") {
                    window.addEventListener("deviceorientation", handler, true);
                } else {
                    alert("has to be allowed!");
                }
            })
            .catch(() => alert("not supported"));
    }
}

function handler(e) {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

    // ±15 degree
    if (
        (pointDegree < Math.abs(compass) &&
            pointDegree + 15 > Math.abs(compass)) ||
        pointDegree > Math.abs(compass + 15) ||
        pointDegree < Math.abs(compass)
    ) {
        myPoint.style.opacity = 0;
    } else if (pointDegree) {
        myPoint.style.opacity = 1;
    }
}

let pointDegree;

function locationHandler(position) {
    const { latitude, longitude } = position.coords;
    pointDegree = calcDegreeToPoint(latitude, longitude);

    if (pointDegree < 0) {
        pointDegree = pointDegree + 360;
    }
}

function calcDegreeToPoint(latitude, longitude) {
    // Qibla geolocation
    const point = {
        lat: 21.422487,
        lng: 39.826206
    };

    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
        (180.0 / Math.PI) *
        Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) -
            Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
    return Math.round(psi);
}

init();

//----------------------LIST----------------------

//defining variables
const btnAddItem = document.getElementById("btn-add-item");
const itemLabel = document.getElementById("lbl-item");
const itemAmountLabel = document.getElementsByClassName("lbls-amount");
const itemAmountInput = document.getElementById("lbl-item-amount");
const itemAmountInputs = document.getElementsByClassName("lbl-item-amount");
const essentialsList = document.getElementById("list-output-essentials");
const btnUpdateList = document.getElementById("btn-update-list");
const fabRemove = document.getElementsByClassName("removeItemButtons");

//adding event listeners to buttons
btnAddItem.addEventListener('click', essentialsAdd);
btnUpdateList.addEventListener('click', essentialsUpdate);
essentialsList.addEventListener('click', function(e){
    if (e.target.classList.contains('removeItemButtons')){
        $(this).closest('.list-item').remove();   
        console.log(e);
    }
})

$(document).on('click', '.removeItemButtons', essentialsRemove);

function essentialsAdd() {
    let output = ``;
    //if either of values is empty, console print to input values
    if (itemLabel.value === "" || itemAmountInput.value === "") {
        output = `Input values`;

        //else if non-empty, obtain values, create an element and add an ion-item to the page
    } else if (itemLabel.value !== "" && itemAmountInput.value !== "") {
        output = `${itemLabel.value}:`;

        //creating ionic elements to add 
        const newListItem = document.createElement('ion-item');
        const gridElem = document.createElement('ion-grid');
        const rowElem = document.createElement('ion-row');
        const colElem1 = document.createElement('ion-col');
        const colElem2 = document.createElement('ion-col');
        const colElem3 = document.createElement('ion-col');
        const lblAmount = document.createElement('ion-label');
        const amountInput = document.createElement('ion-input');
        const fabButton = document.createElement('ion-fab-button');

        //setting text content
        colElem1.textContent = output;
        lblAmount.textContent = `${itemAmountInput.value}`;
        fabButton.textContent = "-";

        //adding needed classes
        lblAmount.classList.add("lbls-amount");
        newListItem.classList.add("lbl-amount")
        amountInput.classList.add("lbl-item-amount");
        fabButton.classList.add("removeItemButtons");

        $(fabButton).click(essentialsRemove);

        //adding settings
        colElem1.size = "7";
        amountInput.type = "number";
        fabButton.color = "warning";
        fabButton.size = "small";

        //adding ionic elements to appropriate parents
        essentialsList.appendChild(newListItem);
        newListItem.appendChild(gridElem);
        gridElem.appendChild(rowElem);
        rowElem.appendChild(colElem1);
        rowElem.appendChild(colElem2);
        colElem2.appendChild(lblAmount);
        colElem2.appendChild(amountInput);
        rowElem.appendChild(colElem3);
        colElem3.appendChild(fabButton);

        //cleaning form values
        itemLabel.value = "";
        itemAmountInput.value = "";
    }
}

//take value from input forms and set labels to new values
function essentialsUpdate() {
    //if input value is non-empty, change the value of the label to one 
    //that assigned input form has
    for (let i = 0; i < itemAmountLabel.length; i++) {
         if (itemAmountInputs[i].value > 0){
            itemAmountLabel[i].textContent = `${itemAmountInputs[i].value}`;
            //clear value of the input form
            itemAmountInputs[i].value = "";
        }
    }    
}

//remove a list element corresponding to the clicked button
function essentialsRemove() {
    $(this).closest('.list-item').remove();    
}
//----------------------HOME----------------------

//----------------------TREASURE MAP----------------------

//map setup
var map = L.map('map').setView([66, 0], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXJnZW50eW51bSIsImEiOiJjbDFlcmhwMjIwdTdlM2JwNDFuZm0zZnR6In0.ksX4ZVryxl1_vYfJK5u1IA'
}).addTo(map);

var theMarker = {};
const markers = [];
const treasures = [];

map.on('click', function (e) {
    lat = e.latlng.lat;
    lon = e.latlng.lng;

    console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
    //Clear existing marker, 

    /*
    if (theMarker != undefined) {
          map.removeLayer(theMarker);
    };*/

    //add a marker to show where you clicked.
    theMarker = L.marker([lat, lon]).addTo(map);
    markers.push([[lat, lon]]);
    console.log(markers)

});

//defined constants 
const placeLabel = document.getElementById('lbl-place');
const typeLabel = document.getElementById('lbl-type');
const addTreasure = document.getElementById('btn-add-treasure');
const treasureList = document.getElementById('list-output');
const saveChanges = document.getElementById('btn-save');
const getData = document.getElementById('btn-get');

//adding event listeners to buttons
addTreasure.addEventListener('click', addTresureToList);
saveChanges.addEventListener('click', saveChangesToLocal);
getData.addEventListener('click', getLocalData);

//adding treasure from user input to the ion-list
function addTresureToList() {
    let output = ``;
    //if either of values is empty, console print to input values
    if (placeLabel.value === "" || typeLabel.value === "") {
        output = `Input values`;

        //else if non-empty, obtain values, create an element and add an ion-item to the page
    } else if (placeLabel.value !== "" && typeLabel.value !== "") {
        output = `${placeLabel.value} - ${typeLabel.value}`;

        const newTreasure = document.createElement('ion-item');
        newTreasure.textContent = output;

        //adding new treasure to the list on the page
        treasureList.appendChild(newTreasure);

        //saving the treasure to an array of treasures
        treasures.push(newTreasure.textContent);
        console.log(treasures);

        placeLabel.value = "";
        typeLabel.value = "";
    }

    console.log(output);
}

//saving markers and list items to local storage, so that they can be obtained next time
function saveChangesToLocal() {
    //if there are some markers and treasures on list, and there is the same amount of them, 
    //save them to the local storage
    if (markers.length > 0 && treasures.length > 0 && markers.length === treasures.length) {
        localStorage.setItem("pinMarker", markers);
        localStorage.setItem("treasureListItem", treasures);
    }
    // if there is an unequal amount of markers and list items or they are empty, console log 
    // to input pins and values 
    else {
        console.log("Add pins and list values");
    }
}

//function gets items from local storage
function getLocalData() {
    const localDataMarker = localStorage.getItem("pinMarker");
    const localDataTreasure = localStorage.getItem("treasureListItem");
    console.log(localDataMarker);
    console.log(localDataTreasure);
    let output = ``;

    //should go through array of coordinates and create a new marker - says there is invalid latlng object
    for (aLocalDataMarker of localDataMarker) {
        var lat = aLocalDataMarker[0].latlng.lat;
        var lon = aLocalDataMarker[1].latlng.lng;

        //var lat = parseFloat(latCoor);
        //var lon = parseFloat(lonCoor);
        theMarker = L.marker([lat, lon]).addTo(map);
    }
    
    //should add the data from local storage to the treasure list
    for (aLocalDataTreasure of localDataTreasure){
        output = `${aLocalDataTreasure.value}`;
        const newTreasure = document.createElement('ion-item');
        newTreasure.textContent = output;

        //adding new treasure to the list on the page
        treasureList.appendChild(newTreasure);

        //saving the treasure to an array of treasures
        treasures.push(newTreasure.textContent);
    }
}