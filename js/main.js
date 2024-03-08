'use strict';
const $heroContainer = document.querySelector('.hero.container');
const $scrollMenuDiv = document.querySelector('.scrollmenu');
const $heroButtonRow = document.querySelector('.hero-button-row');
const $sectionMain = document.querySelector('.main');
const $sectionInfo = document.querySelector('.info');
const $sectionForm = document.querySelector('.form');
const $activitySelect = document.querySelector('#activities');
const $mainListContainer = document.querySelector('.main-list-container');
const $mainInfoContainer = document.querySelector('.main-park-info');
const $infoParkName = document.querySelector('.col-park-name h1');
const $infoParkState = document.querySelector('.col-park-name h3');
const $infoParkDescription = document.querySelector('.main-park-info h5');
const $infoActivities = document.querySelector('.activities-list tbody');
const $infoButtons = document.querySelector('.col-buttons');
// const $infoEvents = document.querySelector(".events-list tbody");
const $headerHomeButton1 = document.querySelector('.header-home-button');
const $headerHomeButton2 = document.querySelector('.header-title');
const $infoPhoto = document.querySelector('.photo-info-row');
const $form = document.querySelector('#submission-form');
let currentPark;
let currentIndex;
let currentStatus;
if (
  !$sectionMain ||
  !$sectionForm ||
  !$sectionInfo ||
  !$mainListContainer ||
  !$scrollMenuDiv ||
  !$heroButtonRow ||
  !$heroContainer ||
  !$mainInfoContainer ||
  !$headerHomeButton1 ||
  !$headerHomeButton2 ||
  !$infoButtons
)
  throw new Error(
    '$scrollMenuDiv, $heroContainer, or $heroButtonRow query failed.',
  );
function createParkListItem(parkData) {
  const $divWrapper = document.createElement('div');
  $divWrapper.classList.add('row', 'list-item');
  $divWrapper.setAttribute('data-park', parkData.fullName);
  const $imgColDiv = document.createElement('div');
  $imgColDiv.classList.add('column-third');
  const $listImg = document.createElement('img');
  $listImg.setAttribute('src', parkData.imgURL);
  $listImg.setAttribute('alt', parkData.imgAlt);
  const $textColDiv = $imgColDiv.cloneNode(true);
  $textColDiv.classList.add('list-text-col');
  const $nameRowDiv = document.createElement('div');
  $nameRowDiv.classList.add('row');
  const $nameH3 = document.createElement('h3');
  $nameH3.textContent = parkData.fullName;
  const $stateRowDiv = $nameRowDiv.cloneNode(true);
  const $colDiv = $imgColDiv.cloneNode(true);
  const $stateH5 = document.createElement('h5');
  $stateH5.textContent = parkData.states;
  $stateRowDiv.appendChild($stateH5);
  $nameRowDiv.appendChild($nameH3);
  $textColDiv.appendChild($nameRowDiv);
  $textColDiv.appendChild($stateRowDiv);
  $imgColDiv.appendChild($listImg);
  $divWrapper.appendChild($imgColDiv);
  $divWrapper.appendChild($textColDiv);
  $divWrapper.appendChild($colDiv);
  return $divWrapper;
}
function displayList(parkData) {
  $scrollMenuDiv.textContent = '.';
  for (const park of parkData) {
    const $listItem = createParkListItem(park);
    $scrollMenuDiv?.appendChild($listItem);
  }
}
$heroButtonRow.addEventListener('click', (event) => {
  const eventTarget = event.target;
  if (eventTarget.closest('div').dataset.view === 'main-list') {
    displayList(data.parks);
    $heroContainer.classList.add('hidden');
    $sectionMain.classList.remove('hidden');
    $mainListContainer.classList.remove('hidden');
  }
});
$scrollMenuDiv.addEventListener('click', (event) => {
  const eventTarget = event.target;
  const nearestDIV = eventTarget.closest('div.list-item');
  const parkClicked = nearestDIV.dataset.park;
  currentPark = data.parks.find((park, index) => {
    currentIndex = index;
    return park.fullName === parkClicked;
  });
  populateInfo(currentPark);
  $mainListContainer.classList.add('hidden');
  $mainInfoContainer.classList.remove('hidden');
});
function populateInfo(park) {
  $infoParkName.textContent = park.fullName;
  $infoParkState.textContent = park.states;
  $infoParkDescription.textContent = park.description;
  $infoActivities.textContent = '';
  park.activities.forEach((activity) => {
    const $tr = document.createElement('tr');
    const $td = document.createElement('td');
    $td.textContent = activity;
    $tr.appendChild($td);
    $infoActivities.appendChild($tr);
  });
  $infoPhoto.style.backgroundImage = `url(${park.imgURL})`;
}
$headerHomeButton1.addEventListener('click', () => {
  displayList(data.parks);
  $mainListContainer.classList.remove('hidden');
  $mainInfoContainer.classList.add('hidden');
});
$headerHomeButton2.addEventListener('click', () => {
  displayList(data.parks);
  $mainListContainer.classList.remove('hidden');
  $mainInfoContainer.classList.add('hidden');
});
$infoButtons.addEventListener('click', (event) => {
  const eventTarget = event.target;
  const buttonText = eventTarget.closest('button')?.textContent?.trim();
  console.log(buttonText);
  if (buttonText === 'Add to Journal') {
    currentStatus = 'visited';
    $infoButtons.classList.add('hidden');
    $sectionInfo.classList.add('hidden');
    $sectionForm.classList.remove('hidden');
    currentPark.activities.forEach((activity) => {
      const $activityOption = document.createElement('option');
      $activityOption.setAttribute('value', `${activity.replace(/\s/g, '')}`);
      $activityOption.textContent = activity;
      $activitySelect?.appendChild($activityOption);
    });
  }
});
$form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const eventTarget = event.target;
  const $formElements = eventTarget.elements;
  console.log($formElements);
  data.parks[currentIndex].status = currentStatus;
  if (currentStatus === 'visited') {
    if (data.parks[currentIndex].fullName === 'Sequoia & Kings Canyon') {
      data.parkCount += 2;
    } else {
      data.parkCount++;
    }
    data.parks[currentIndex].datesVisitedStart = $formElements.tripStart.value;
    data.parks[currentIndex].datesVisitedEnd = $formElements.tripEnd.value;
    if ($formElements.activities?.value) {
      console.log($formElements.activities);
      data.parks[currentIndex].activitiesDone = $formElements.activities.value;
    }
  } else if (currentStatus === 'wishlist') {
    data.parks[currentIndex].datesToVisitStart = $formElements.tripStart.value;
    data.parks[currentIndex].datesToVisitEnd = $formElements.tripEnd.value;
    if ($formElements.activities?.value) {
      data.parks[currentIndex].activitiesToDo = $formElements.activities.value;
    }
    if ($formElements.events?.value) {
      data.parks[currentIndex].eventsToDo = $formElements.events.value;
    }
  }
  $form.reset();
});
