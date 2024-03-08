interface FormElements extends HTMLFormControlsCollection {
  tripStart: HTMLInputElement;
  tripEnd: HTMLInputElement;
  events?: HTMLSelectElement;
  activities?: HTMLSelectElement;
}

const earthRadiusM = 6378137;
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
const $activityTitle = document.querySelector('.info .activities-list > h3');
const $listViewTitle = document.querySelector('.map-column h1');
const $infoActivities = document.querySelector('.activities-list tbody');
const $infoButtons = document.querySelector('.col-buttons');
const $headerHomeButton1 = document.querySelector('.header-home-button');
const $headerHomeButton2 = document.querySelector('.header-title');
const $infoPhoto = document.querySelector('.photo-info-row') as HTMLDivElement;
const $form = document.querySelector('#submission-form') as HTMLFormElement;
const $iframes = document.querySelectorAll(
  '.activities iframe',
) as NodeListOf<HTMLIFrameElement>;
const $dateVisitedCol = document.querySelector('.visited-dates');
const $dateVisited = document.querySelector('.visited-dates h5');
const $visitedHeaderButton = document.querySelector('.header-visited-button');
const $countH2 = document.querySelector('.list-title-row h2');
const $dateStartInput = document.querySelector('#start');
const $dateEndInput = document.querySelector('#end');

let currentPark: NationalPark | undefined;
let currentIndex: number;
let currentStatus: undefined | 'visited' | 'wishlist';
let visitedParks = data.parks.filter(
  (park: NationalPark) => park.status === 'visited',
);

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
    '$sectionMain, $sectionForm, $sectionInfo, $mainListContainer, $scrollMenuDiv, $heroContainer, $heroButtonRow, $mainInfoContainer, $headerHomeButtons, $infoButtons query failed.',
  );

function createParkListItem(parkData: NationalPark): HTMLDivElement {
  const $divWrapper = document.createElement('div');
  $divWrapper.classList.add('row', 'list-item');
  $divWrapper.setAttribute('data-park', parkData.fullName);
  const $imgColDiv = document.createElement('div');
  $imgColDiv.classList.add('column-third');
  const $listImg = document.createElement('img');
  $listImg.setAttribute('src', parkData.imgURL);
  $listImg.setAttribute('alt', parkData.imgAlt);
  const $textColDiv = $imgColDiv.cloneNode(true) as HTMLDivElement;
  $textColDiv.classList.add('list-text-col');
  const $nameRowDiv = document.createElement('div');
  $nameRowDiv.classList.add('row');
  const $nameH3 = document.createElement('h3');
  $nameH3.textContent = parkData.fullName;
  const $stateRowDiv = $nameRowDiv.cloneNode(true);
  const $colDiv = $imgColDiv.cloneNode(true) as HTMLDivElement;
  const $stateH5 = document.createElement('h5');
  const $icon = document.createElement('i');
  if (parkData.status === 'visited') {
    $icon.classList.add('fa-solid', 'fa-book-open');
  } else if (parkData.status === 'wishlist') {
    $icon.classList.add('fa-solid', 'fa-pencil');
  }
  $colDiv.appendChild($icon);
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

function displayList(parkData: NationalPark[]): void {
  $scrollMenuDiv!.textContent = '';
  for (const park of parkData) {
    const $listItem = createParkListItem(park);
    $scrollMenuDiv?.appendChild($listItem);
  }
}

$heroButtonRow.addEventListener('click', (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  if (eventTarget.closest('div')!.dataset.view === 'main-list') {
    viewSwap('main-list');
  } else if (eventTarget.closest('div')!.dataset.view === 'journal-list') {
    viewSwap('journal-list');
  }
});

function viewSwap(view: string): void {
  $form.reset();
  if (view === 'main-list' || view === 'journal-list') {
    $heroContainer?.classList.add('hidden');
    $sectionMain?.classList.remove('hidden');
    $mainListContainer?.classList.remove('hidden');
    $mainInfoContainer?.classList.add('hidden');
    $sectionInfo?.classList.remove('hidden');
    $sectionForm?.classList.add('hidden');
    $infoButtons?.classList.remove('hidden');
    if (view === 'main-list') {
      $listViewTitle!.textContent = 'All National Parks';
      displayList(data.parks);
      $countH2!.classList.add('hidden');
    } else if (view === 'journal-list') {
      displayList(visitedParks);
      $listViewTitle!.textContent = 'My Park Journal';
      $countH2!.textContent = `${data.parkCount}/63`;
      $countH2!.classList.remove('hidden');
    }
  } else if (view === 'info') {
    $mainListContainer?.classList.add('hidden');
    $mainInfoContainer?.classList.remove('hidden');
  } else if (view === 'visit-form') {
    $infoButtons?.classList.add('hidden');
    $sectionInfo?.classList.add('hidden');
    $sectionForm?.classList.remove('hidden');
  }
}

$scrollMenuDiv.addEventListener('click', (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  const nearestDIV = eventTarget.closest('div.list-item') as HTMLDivElement;
  const parkClicked = nearestDIV.dataset.park;
  currentPark = data.parks.find((park: NationalPark, index: number) => {
    currentIndex = index;
    return park.fullName === parkClicked;
  });
  populateInfo(currentPark!);
  viewSwap('info');
});

function populateInfo(park: NationalPark): void {
  $infoParkName!.textContent = park.fullName;
  $infoParkState!.textContent = park.states;
  $activityTitle!.textContent = 'Activities';
  $infoParkDescription!.textContent = park.description;
  $infoActivities!.textContent = '';
  const x = longToX(park.longitude);
  const y = latToY(park.latitude);
  const URL = `https://hikingproject.com/widget/map?favs=1&amp;location=fixed&amp;x=${x}&amp;y=${y}&amp;z=9.4&amp;h=500`;
  $iframes?.forEach(($iframe: HTMLIFrameElement) => {
    $iframe.setAttribute('src', URL);
  });
  $infoPhoto.style.backgroundImage = `url(${park.imgURL})`;
  if (!park.status) {
    park.activities.forEach((activity: string) => {
      $infoButtons?.classList.remove('hidden');
      $dateVisitedCol?.classList.add('hidden');
      const $tr = document.createElement('tr');
      const $td = document.createElement('td');
      $td.textContent = activity;
      $tr.appendChild($td);
      $infoActivities!.appendChild($tr);
    });
  } else if (park.status === 'visited') {
    $dateVisited!.textContent = `${park.datesVisitedStart} - ${park.datesVisitedEnd}`;
    $activityTitle!.textContent = 'Activities Done';
    park.activitiesDone!.forEach((activity: string) => {
      const $tr = document.createElement('tr');
      const $td = document.createElement('td');
      $td.textContent = activity;
      $tr.appendChild($td);
      $infoActivities!.appendChild($tr);
    });
    $infoButtons?.classList.add('hidden');
    $dateVisitedCol?.classList.remove('hidden');
  }
}

$headerHomeButton1.addEventListener('click', () => {
  viewSwap('main-list');
});

$headerHomeButton2.addEventListener('click', () => {
  viewSwap('main-list');
});

$infoButtons.addEventListener('click', (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  const buttonText = eventTarget.closest('button')?.textContent?.trim();
  if (buttonText === 'Add to Journal') {
    currentStatus = 'visited';
    viewSwap('visit-form');
    $activitySelect!.textContent = '';
    currentPark!.activities.forEach((activity: string) => {
      const $activityOption = document.createElement('option');
      $activityOption.setAttribute('value', `${activity.replace(/\s/g, '')}`);
      $activityOption.textContent = activity;
      $activitySelect?.appendChild($activityOption);
    });
  }
});

$form?.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const eventTarget = event.target as HTMLFormElement;
  const $formElements = eventTarget.elements as FormElements;
  data.parks[currentIndex].status = currentStatus;
  visitedParks = data.parks.filter(
    (park: NationalPark) => park.status === 'visited',
  );
  if (currentStatus === 'visited') {
    if (data.parks[currentIndex].fullName === 'Sequoia & Kings Canyon') {
      data.parkCount += 2;
    } else {
      data.parkCount++;
    }
    data.parks[currentIndex].datesVisitedStart = $formElements.tripStart.value;
    data.parks[currentIndex].datesVisitedEnd = $formElements.tripEnd.value;
    if ($formElements.activities?.value) {
      const optionsArray = $formElements.activities.selectedOptions;
      data.parks[currentIndex].activitiesDone = [];
      for (const option of optionsArray) {
        data.parks[currentIndex].activitiesDone!.push(option.textContent!);
      }
    }
  } else if (currentStatus === 'wishlist') {
    data.parks[currentIndex].datesToVisitStart = $formElements.tripStart.value;
    data.parks[currentIndex].datesToVisitEnd = $formElements.tripEnd.value;
    if ($formElements.activities?.value) {
      const optionsArray = $formElements.activities.selectedOptions;
      data.parks[currentIndex].activitiesToDo = [];
      for (const option of optionsArray) {
        data.parks[currentIndex].activitiesToDo!.push(option.textContent!);
      }
    }
    if ($formElements.events?.value) {
      const optionsArray = $formElements.events.selectedOptions;
      data.parks[currentIndex].eventsToDo = [];
      for (const option of optionsArray) {
        data.parks[currentIndex].eventsToDo!.push(option.textContent!);
      }
    }
  }
  viewSwap('journal-list');
  currentIndex = 1000;
  currentStatus = undefined;
  currentPark = undefined;
});

function longToX(longitude: number): number {
  return earthRadiusM * ((longitude * Math.PI) / 180);
}

function latToY(latitude: number): number {
  const latRad = (latitude * Math.PI) / 180;
  return earthRadiusM * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
}

$visitedHeaderButton?.addEventListener('click', () => {
  viewSwap('journal-list');
});

$dateStartInput?.addEventListener('input', (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  const startDate = eventTarget.value;
  $dateEndInput?.setAttribute('min', startDate);
  $dateEndInput?.setAttribute('value', startDate);
});
