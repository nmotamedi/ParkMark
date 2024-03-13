interface FormElements extends HTMLFormControlsCollection {
  tripStart: HTMLInputElement;
  tripEnd: HTMLInputElement;
  events?: HTMLSelectElement;
  activities?: HTMLSelectElement;
  'departure-select'?: HTMLSelectElement;
  'arrival-select'?: HTMLSelectElement;
  'departing-city'?: HTMLInputElement;
}

interface Events {
  location: string;
  date: string;
  title: string;
}

interface Locations {
  code: string;
}

interface Flights {
  cityFrom: string;
  cityTo: string;
  local_arrival: string;
  local_departure: string;
  price: number;
  airline: string;
  flight_no: number;
  availability?: {
    seats: number | null;
  };
}

const earthRadiusM = 6378137;
const $heroContainer = document.querySelector('.hero.container');
const $scrollMenuDiv = document.querySelector('.scrollmenu');
const $heroButtonRow = document.querySelector('.hero-button-row');
const $sectionMain = document.querySelector('.main');
const $sectionInfo = document.querySelector('.info');
const $sectionForm = document.querySelector('.form');
const $activitySelect = document.querySelector('#activities');
const $eventSelect = document.querySelector('#events');
const $mainListContainer = document.querySelector('.main-list-container');
const $mainInfoContainer = document.querySelector('.main-park-info');
const $infoParkName = document.querySelector('.col-park-name h1');
const $infoParkState = document.querySelector('.col-park-name h3');
const $infoParkDescription = document.querySelector('.main-park-info h5');
const $activityTitle = document.querySelector('.info .activities-list > h3');
const $activityFormTitle = document.querySelector('.activities-list-form > h3');
const $listViewTitle = document.querySelector('.map-column h1');
const $infoActivities = document.querySelector('.activities-list tbody');
const $infoButtons = document.querySelector('.col-buttons');
const $headerHomeButton1 = document.querySelector('.header-home-button');
const $headerSearchButton = document.querySelector('.header-search');
const $headerHomeButton2 = document.querySelector('.header-title');
const $infoPhoto = document.querySelector('.photo-info-row') as HTMLDivElement;
const $form = document.querySelector('#submission-form') as HTMLFormElement;
const $iframesDiv = document.querySelectorAll(
  '.hikes-div',
) as NodeListOf<HTMLDivElement>;
let $iframes = document.querySelectorAll(
  '.hikes-div iframe',
) as NodeListOf<HTMLIFrameElement>;
const $dateVisitedCol = document.querySelector('.visited-dates');
const $dateVisited = document.querySelector('.visited-dates h5');
const $visitedHeaderButton = document.querySelector('.header-visited-button');
const $countH2 = document.querySelector('.list-title-row h2');
const $dateStartInput = document.querySelector('#start') as HTMLInputElement;
const $dateEndInput = document.querySelector('#end') as HTMLInputElement;
const $eventsForm = document.querySelector('.events-list-form');
const $dateTitle = document.querySelector('.date-input-title h3');
const $hikeTitle = document.querySelector('.hikes-form > h3');
const $infoEvents = document.querySelector('.events-list tbody');
const $dateToVisitCol = document.querySelector('.wishlist-dates');
const $dateToVisit = document.querySelector('.wishlist-dates h5');
const $infoEventsDiv = document.querySelector('.events-list');
const $wishlistHeaderButton = document.querySelector('.header-wishlist-button');
const $searchBar = document.querySelector('.header-search-bar');
const $searchBarInput = document.querySelector('#search') as HTMLInputElement;
const $stateSelect = document.querySelector(
  '#state-select',
) as HTMLSelectElement;
const $headerMoreButton = document.querySelector('.header-more-button');
const $headerMoreVisitedButton = document.querySelector(
  '.header-more-visited-button',
);
const $headerMoreWishlistButton = document.querySelector(
  '.header-more-wishlist-button',
);
const $modal = document.querySelector('.loading-dialog') as HTMLDialogElement;
const $travelPlanButton = document.querySelector('.travel-plan-button');
const $editPlanButton = document.querySelector('.edit-plan-button');
const $deleteAnchor = document.querySelector('.delete-anchor');
const $deleteModal = document.querySelector(
  '.delete-modal',
) as HTMLDialogElement;
const $cancelButton = document.querySelector('.cancel-button');
const $deleteButton = document.querySelector('.delete-button');
const $arrivalSelect = document.querySelector(
  '#arrival-select',
) as HTMLSelectElement;
const $departureSelect = document.querySelector(
  '#departure-select',
) as HTMLSelectElement;
const $departingCityInput = document.querySelector(
  '#departing-city',
) as HTMLInputElement;
const $flightSearchButton = document.querySelector('#flight-search-button');
const $flightsForm = document.querySelector('.flights-form');
const $flightsInfo = document.querySelector('.flights-info');
const $arrivalFlightH5 = document.querySelector('.arrival-flight');
const $departureFlightH5 = document.querySelector('.departure-flight');

const today: string[] = new Date().toISOString().split('T');

let startDate: string | undefined;
let currentPark: NationalPark | undefined;
let currentIndex: number;
let currentStatus: undefined | 'visited' | 'wishlist';
let visitedParks = data.parks.filter(
  (park: NationalPark) => park.status === 'visited',
);
let wishlistParks = data.parks.filter(
  (park: NationalPark) => park.status === 'wishlist',
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

function searchOptions(): void {
  const $datalist = document.createElement('datalist');
  $datalist.setAttribute('id', 'search-list');
  data.parks.forEach((park: NationalPark) => {
    const $option = document.createElement('option');
    $option.setAttribute('value', park.fullName);
    $datalist.appendChild($option);
  });
  $searchBar?.appendChild($datalist);
}
searchOptions();

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
    if (
      today[0] >
      new Date(parkData.datesToVisitStart!).toISOString().split('T')[0]
    ) {
      $divWrapper.classList.add('outdated');
    }
  }
  $colDiv.appendChild($icon);
  $stateH5.textContent = parkData.states.join(', ');
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

function displayOptionList(parkData: NationalPark[]): void {
  $stateSelect.textContent = '';
  const states: string[] = [];
  for (const park of parkData) {
    for (const state of park.states) {
      if (!states.includes(state)) {
        states.push(state);
      }
    }
  }
  for (const state of states.sort()) {
    const $stateOption = document.createElement('option');
    $stateOption.setAttribute('value', state);
    $stateOption.textContent = state;
    $stateSelect.appendChild($stateOption);
  }
}

function displayList(parkData: NationalPark[]): void {
  $scrollMenuDiv!.textContent = '';
  if (parkData.length < 1) {
    const $divWrapper = document.createElement('div');
    $divWrapper.classList.add('row', 'list-item', 'empty-park');
    const $nameRowDiv = document.createElement('div');
    $nameRowDiv.classList.add('row');
    const $nameH3 = document.createElement('h3');
    $nameH3.textContent = 'Please add a park!';
    $nameRowDiv.appendChild($nameH3);
    $divWrapper.appendChild($nameRowDiv);
    $scrollMenuDiv?.appendChild($divWrapper);
  } else {
    for (const park of parkData) {
      const $listItem = createParkListItem(park);
      $scrollMenuDiv?.appendChild($listItem);
    }
  }
  displayOptionList(parkData);
}

$heroButtonRow.addEventListener('click', (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  if (eventTarget.closest('div')!.dataset.view === 'main-list') {
    viewSwap('main-list');
  } else if (eventTarget.closest('div')!.dataset.view === 'journal-list') {
    viewSwap('journal-list');
  } else if (eventTarget.closest('div')!.dataset.view === 'wish-list') {
    viewSwap('wishlist-list');
  }
});

function viewSwap(view: string): void {
  $form.reset();
  $deleteAnchor?.classList.add('hidden');
  $searchBarInput.value = '';
  $searchBar?.classList.add('hidden');
  $dateStartInput?.removeAttribute('value');
  $dateEndInput?.removeAttribute('value');
  startDate = undefined;
  if (
    view === 'main-list' ||
    view === 'journal-list' ||
    view === 'wishlist-list'
  ) {
    currentIndex = 1000;
    currentStatus = undefined;
    currentPark = undefined;
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
      $listViewTitle!.textContent = 'Park Journal';
      $countH2!.textContent = `${data.parkCount}/63`;
      $countH2!.classList.remove('hidden');
    } else if (view === 'wishlist-list') {
      $listViewTitle!.textContent = 'Travel Plans';
      displayList(wishlistParks);
      $countH2!.classList.add('hidden');
    }
  } else if (view === 'info') {
    $mainListContainer?.classList.add('hidden');
    $mainInfoContainer?.classList.remove('hidden');
  } else if (view === 'visit-form' || view === 'wishlist-form') {
    $infoButtons?.classList.add('hidden');
    $sectionInfo?.classList.add('hidden');
    $sectionForm?.classList.remove('hidden');
    if (view === 'wishlist-form') {
      $eventsForm?.classList.remove('hidden');
      $departureSelect.textContent = '';
      $arrivalSelect.textContent = '';
      $flightsForm?.classList.remove('hidden');
      $activityFormTitle!.textContent = 'Activities To Do';
      $dateTitle!.textContent = 'Dates To Visit';
      $hikeTitle!.textContent = 'Hikes To Do';
      $dateStartInput?.setAttribute('min', today[0]);
      $dateEndInput?.setAttribute('min', today[0]);
      $dateStartInput?.removeAttribute('max');
      $dateEndInput?.removeAttribute('max');
      $eventSelect!.textContent = '';
      if (data.defaultLocation) {
        $departingCityInput.value = data.defaultLocation;
      }
    } else if (view === 'visit-form') {
      $activityFormTitle!.textContent = 'Activities Done';
      $dateTitle!.textContent = 'Dates Visited';
      $hikeTitle!.textContent = 'Hikes Done';
      $dateStartInput?.setAttribute('max', today[0]);
      $dateEndInput?.setAttribute('max', today[0]);
      $dateStartInput?.removeAttribute('min');
      $dateEndInput?.removeAttribute('min');
      $eventsForm?.classList.add('hidden');
      $flightsForm?.classList.add('hidden');
    }
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
  $infoParkState!.textContent = park.states.join(', ');
  $activityTitle!.textContent = 'Activities';
  $infoParkDescription!.textContent = park.description;
  $infoEventsDiv?.classList.add('hidden');
  $flightsInfo?.classList.add('hidden');
  $infoActivities!.textContent = '';
  $infoEvents!.textContent = '';
  $travelPlanButton?.classList.remove('hidden');
  $editPlanButton?.classList.add('hidden');
  const x = longToX(park.longitude);
  const y = latToY(park.latitude);
  const URL = `https://hikingproject.com/widget/map?favs=1&location=fixed&x=${x}&y=${y}&z=9&h=400`;
  $iframesDiv?.forEach(($iframeDiv: HTMLDivElement, index: number) => {
    $iframeDiv.removeChild($iframes[index]);
    const $iframe = document.createElement('iframe');
    $iframe.setAttribute(
      'style',
      'width:100%; max-width:1200px; height:400px;',
    );
    $iframe.setAttribute('src', URL);
    $iframeDiv.appendChild($iframe);
  });
  $iframes = document.querySelectorAll(
    '.hikes-div iframe',
  ) as NodeListOf<HTMLIFrameElement>;
  $infoPhoto.style.backgroundImage = `url(${park.imgURL})`;
  if (!park.status) {
    park.activities.sort().forEach((activity: string) => {
      $infoButtons?.classList.remove('hidden');
      $dateVisitedCol?.classList.add('hidden');
      $dateToVisitCol?.classList.add('hidden');
      const $tr = document.createElement('tr');
      const $td = document.createElement('td');
      $td.textContent = activity;
      $tr.appendChild($td);
      $infoActivities!.appendChild($tr);
    });
  } else if (park.status === 'visited') {
    $dateVisited!.textContent = `${park.datesVisitedStart} - ${park.datesVisitedEnd}`;
    $activityTitle!.textContent = 'Activities Done';
    if (park.activities) {
      park.activitiesDone!.sort().forEach((activity: string) => {
        const $tr = document.createElement('tr');
        const $td = document.createElement('td');
        $td.textContent = activity;
        $tr.appendChild($td);
        $infoActivities!.appendChild($tr);
      });
    }
    $infoButtons?.classList.add('hidden');
    $dateVisitedCol?.classList.remove('hidden');
    $dateToVisitCol?.classList.add('hidden');
  } else if (park.status === 'wishlist') {
    $dateToVisit!.textContent = `${park.datesToVisitStart} - ${park.datesToVisitEnd}`;
    if (
      today[0] > new Date(park.datesToVisitStart!).toISOString().split('T')[0]
    ) {
      $dateToVisit!.textContent = `Planned dates have passed`;
    }
    $activityTitle!.textContent = 'Activities To Do';
    if (park.activitiesToDo) {
      park.activitiesToDo!.sort().forEach((activity: string) => {
        const $tr = document.createElement('tr');
        const $td = document.createElement('td');
        $td.textContent = activity;
        $tr.appendChild($td);
        $infoActivities!.appendChild($tr);
      });
    } else {
      const $tr = document.createElement('tr');
      const $td = document.createElement('td');
      $td.textContent = 'No Activities Planned';
      $tr.appendChild($td);
      $infoActivities!.appendChild($tr);
    }
    if (park.eventsToDo) {
      park.eventsToDo!.forEach((eventArr: string[]) => {
        const $tr = document.createElement('tr');
        const $tdDate = document.createElement('td');
        const $tdEvent = document.createElement('td');
        const $tdLocation = document.createElement('td');
        $tdDate.textContent = new Date(
          eventArr[0].replace(/-/g, '/'),
        ).toDateString();
        $tdEvent.textContent = eventArr[1];
        $tdLocation.textContent = eventArr[2];
        $tr.appendChild($tdDate);
        $tr.appendChild($tdEvent);
        $tr.appendChild($tdLocation);
        $infoEvents!.appendChild($tr);
      });
    } else {
      const $tr = document.createElement('tr');
      const $td = document.createElement('td');
      $td.textContent = 'No Events Planned';
      $tr.appendChild($td);
      $infoEvents!.appendChild($tr);
    }
    if (park.arrivalFlight) {
      $arrivalFlightH5!.textContent = park.arrivalFlight;
    } else {
      $arrivalFlightH5!.textContent = 'No Flight Selected';
    }
    if (park.departureFlight) {
      $departureFlightH5!.textContent = park.departureFlight;
    } else {
      $departureFlightH5!.textContent = 'No Flight Selected';
    }
    $travelPlanButton?.classList.add('hidden');
    $editPlanButton?.classList.remove('hidden');
    $dateToVisitCol?.classList.remove('hidden');
    $infoEventsDiv?.classList.remove('hidden');
    $flightsInfo?.classList.remove('hidden');
    $dateVisitedCol?.classList.add('hidden');
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
    currentPark!.activities.sort().forEach((activity: string) => {
      const $activityOption = document.createElement('option');
      $activityOption.setAttribute('value', `${activity.replace(/\s/g, '')}`);
      $activityOption.textContent = activity;
      $activitySelect?.appendChild($activityOption);
    });
  } else if (buttonText === 'Add Travel Plan') {
    currentStatus = 'wishlist';
    viewSwap('wishlist-form');
    $activitySelect!.textContent = '';
    currentPark!.activities.sort().forEach((activity: string) => {
      const $activityOption = document.createElement('option');
      $activityOption.setAttribute('value', `${activity.replace(/\s/g, '')}`);
      $activityOption.textContent = activity;
      $activitySelect?.appendChild($activityOption);
    });
  } else if (buttonText === 'Edit Travel Plan') {
    currentStatus = 'wishlist';
    viewSwap('wishlist-form');
    $activitySelect!.textContent = '';
    $deleteAnchor?.classList.remove('hidden');
    currentPark!.activities.sort().forEach((activity: string) => {
      const $activityOption = document.createElement('option');
      $activityOption.setAttribute('value', `${activity.replace(/\s/g, '')}`);
      if (currentPark!.activitiesToDo?.includes(activity)) {
        $activityOption.selected = true;
      }
      $activityOption.textContent = activity;
      $activitySelect?.appendChild($activityOption);
    });
    $dateStartInput!.setAttribute(
      'value',
      new Date(currentPark!.datesToVisitStart!).toISOString().split('T')[0],
    );
    $dateEndInput!.setAttribute(
      'value',
      new Date(currentPark!.datesToVisitEnd!).toISOString().split('T')[0],
    );
    if (
      !currentPark?.datesToVisitStart ||
      !currentPark?.datesToVisitEnd ||
      !currentPark?.parkCode ||
      !currentPark?.baseLocation
    )
      throw new Error('Unable to run function.');
    $modal?.showModal();
    getEventsData(
      currentPark.datesToVisitStart,
      currentPark.datesToVisitEnd,
      currentPark.parkCode,
    );
    fetchAirport(
      currentPark,
      new Date(currentPark.datesToVisitStart).toISOString().split('T')[0],
      new Date(currentPark.datesToVisitEnd).toISOString().split('T')[0],
      currentPark.baseLocation,
    );
  }
});

$deleteAnchor?.addEventListener('click', () => {
  $deleteModal.showModal();
});

$cancelButton?.addEventListener('click', () => {
  $deleteModal.close();
});

$deleteButton?.addEventListener('click', () => {
  data.parks[currentIndex].status = undefined;
  data.parks[currentIndex].activitiesToDo = undefined;
  data.parks[currentIndex].eventsToDo = undefined;
  data.parks[currentIndex].datesToVisitStart = undefined;
  data.parks[currentIndex].datesToVisitEnd = undefined;
  wishlistParks = data.parks.filter(
    (park: NationalPark) => park.status === 'wishlist',
  );
  viewSwap('main-list');
  $deleteModal.close();
});

$form?.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const eventTarget = event.target as HTMLFormElement;
  const $formElements = eventTarget.elements as FormElements;
  data.parks[currentIndex].status = currentStatus;
  visitedParks = data.parks.filter(
    (park: NationalPark) => park.status === 'visited',
  );
  wishlistParks = data.parks.filter(
    (park: NationalPark) => park.status === 'wishlist',
  );
  if (currentStatus === 'visited') {
    if (data.parks[currentIndex].fullName === 'Sequoia & Kings Canyon') {
      data.parkCount += 2;
    } else {
      data.parkCount++;
    }
    data.parks[currentIndex].datesVisitedStart = new Date(
      $formElements.tripStart.value.replace(/-/g, '/'),
    ).toDateString();
    data.parks[currentIndex].datesVisitedEnd = new Date(
      $formElements.tripEnd.value.replace(/-/g, '/'),
    ).toDateString();
    if ($formElements.activities?.value) {
      const optionsArray = $formElements.activities.selectedOptions;
      data.parks[currentIndex].activitiesDone = [];
      for (const option of optionsArray) {
        data.parks[currentIndex].activitiesDone!.push(option.textContent!);
      }
    }
    viewSwap('journal-list');
  } else if (currentStatus === 'wishlist') {
    data.parks[currentIndex].datesToVisitStart = new Date(
      $formElements.tripStart.value.replace(/-/g, '/'),
    ).toDateString();
    data.parks[currentIndex].datesToVisitEnd = new Date(
      $formElements.tripEnd.value.replace(/-/g, '/'),
    ).toDateString();
    if (
      $formElements['departure-select']?.value ===
      'No Flights Found For Current Date'
    ) {
      data.parks[currentIndex].departureFlight = undefined;
    } else {
      data.parks[currentIndex].departureFlight =
        $formElements['departure-select']?.value;
    }
    if (
      $formElements['arrival-select']?.value ===
      'No Flights Found For Current Date'
    ) {
      data.parks[currentIndex].arrivalFlight = undefined;
    } else {
      data.parks[currentIndex].arrivalFlight =
        $formElements['arrival-select']?.value;
    }
    data.parks[currentIndex].baseLocation =
      $formElements['departing-city']?.value;
    if (!data.defaultLocation) {
      data.defaultLocation = $formElements['departing-city']?.value;
    }
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
        data.parks[currentIndex].eventsToDo!.push(
          option.textContent!.split(' - '),
        );
      }
    }
    viewSwap('wishlist-list');
  }
});

function longToX(longitude: number): number {
  return Math.round(earthRadiusM * ((longitude * Math.PI) / 180));
}

function latToY(latitude: number): number {
  const latRad = (latitude * Math.PI) / 180;
  return Math.round(
    earthRadiusM * Math.log(Math.tan(Math.PI / 4 + latRad / 2)),
  );
}

$visitedHeaderButton?.addEventListener('click', () => {
  viewSwap('journal-list');
});

$wishlistHeaderButton?.addEventListener('click', () => {
  viewSwap('wishlist-list');
});

$headerMoreButton?.addEventListener('click', () => {
  $headerMoreVisitedButton?.classList.toggle('hidden');
  $headerMoreWishlistButton?.classList.toggle('hidden');
  $headerMoreButton?.classList.toggle('on');
});

$headerMoreVisitedButton?.addEventListener('click', () => {
  viewSwap('journal-list');
});

$headerMoreWishlistButton?.addEventListener('click', () => {
  viewSwap('wishlist-list');
});

$dateStartInput?.addEventListener('input', (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  startDate = eventTarget.value;
  $dateEndInput?.setAttribute('min', startDate);
  $dateEndInput?.setAttribute('value', startDate);
});

$dateEndInput?.addEventListener('input', (eventEnd: Event) => {
  const eventEndTarget = eventEnd.target as HTMLInputElement;
  const endDate = eventEndTarget.value;
  if (currentStatus === 'wishlist') {
    $modal?.showModal();
    if (!startDate || !currentPark || !currentPark?.parkCode)
      throw new Error('Unable to run function.');
    getEventsData(startDate, endDate, currentPark.parkCode);
  }
});

async function getEventsData(
  start: string,
  end: string,
  code: string,
): Promise<void> {
  try {
    $eventSelect!.textContent = '';
    const eventsArr: Events[] = [];
    const resp = await fetch(
      `https://developer.nps.gov/api/v1/events?parkCode=${code}&dateStart=${start}&dateEnd=${end}`,
      { headers },
    );
    if (!resp.ok) throw new Error('Network Failure');
    const eventData = await resp.json();
    eventData.data.forEach((events: Events) => {
      const singleEvent: Events = {
        location: events.location,
        date: events.date,
        title: events.title,
      };
      eventsArr.push(singleEvent);
    });
    if (eventsArr.length < 1) {
      const $eventOption = document.createElement('option');
      $eventOption.textContent = 'No Events in this window.';
      $eventSelect?.appendChild($eventOption);
    } else {
      eventsArr.forEach((events: Events) => {
        const $eventOption = document.createElement('option');
        $eventOption.textContent = `${events.date} - ${events.title} - ${events.location}`;
        if (currentPark?.eventsToDo) {
          if (
            JSON.stringify(currentPark.eventsToDo).includes(
              JSON.stringify($eventOption.textContent.split(' - ')),
            )
          ) {
            $eventOption.selected = true;
          }
        }
        $eventSelect?.appendChild($eventOption);
      });
    }
    $modal?.close();
  } catch (e) {
    console.error(e);
  }
}

$headerSearchButton?.addEventListener('click', () => {
  if ($searchBar?.classList.contains('hidden')) {
    $searchBar.classList.remove('hidden');
  } else {
    const $searchQuery = $searchBarInput.value;
    currentPark = data.parks.find((park: NationalPark, index: number) => {
      currentIndex = index;
      return park.fullName === $searchQuery;
    });
    populateInfo(currentPark!);
    viewSwap('info');
    $searchBar!.classList.add('hidden');
  }
});

$stateSelect.addEventListener('input', () => {
  const selectedState = $stateSelect.value;
  let filteredList: NationalPark[] = [];
  if ($listViewTitle!.textContent === 'Travel Plans') {
    filteredList = wishlistParks.filter((park: NationalPark) =>
      park.states.includes(selectedState),
    );
    $listViewTitle!.textContent = `${selectedState} Travel Plans`;
  } else if ($listViewTitle!.textContent === 'All National Parks') {
    filteredList = data.parks.filter((park: NationalPark) =>
      park.states.includes(selectedState),
    );
    $listViewTitle!.textContent = `${selectedState} National Parks`;
  } else if ($listViewTitle!.textContent === 'Park Journal') {
    filteredList = visitedParks.filter((park: NationalPark) =>
      park.states.includes(selectedState),
    );
    $listViewTitle!.textContent = `Park Journal - ${selectedState}`;
  }
  displayList(filteredList);
});

async function fetchAirport(
  park: NationalPark,
  dateStart: string,
  dateEnd: string,
  defaultLocation: string,
): Promise<void> {
  const airportRadiusURL = `https://api.tequila.kiwi.com/locations/radius?lat=${park.latitude}&lon=${park.longitude}&radius=400&locale=en-US&location_types=airport&limit=5&active_only=true`;
  const airportLocationURL = `https://api.tequila.kiwi.com/locations/query?term=${defaultLocation}&locale=en-US&location_types=airport&limit=1&active_only=true`;
  const airportHeader = {
    apikey: '2Q_NuNwGtLTXtRntdfeA2YJfOFTognUE',
    accept: 'application/json',
  };
  const parksAirports: string[] = [];

  try {
    const parkAirportsResp = await fetch(airportRadiusURL, {
      headers: airportHeader,
    });
    if (!parkAirportsResp.ok) throw new Error('Network failure');
    const parkAirportsJSON = await parkAirportsResp.json();
    parkAirportsJSON.locations.forEach((location: Locations) => {
      parksAirports.push(location.code);
    });
    const defaultAirportResp = await fetch(airportLocationURL, {
      headers: airportHeader,
    });
    if (!defaultAirportResp.ok) throw new Error('Network failure');
    const defaultAirportJSON = await defaultAirportResp.json();
    const defaultAirport = defaultAirportJSON.locations[0].code;
    const arrivalFlights = await fetchFlights(
      dateStart,
      defaultAirport,
      parksAirports,
    );
    const departureFlights = await fetchFlights(
      dateEnd,
      parksAirports,
      defaultAirport,
    );
    if (arrivalFlights) {
      if (arrivalFlights.length > 1) {
        arrivalFlights.forEach((flight: Flights) => {
          const $flightOption = document.createElement('option');
          $flightOption.textContent = `${flight.local_departure.split('T')[0]} ${flight.cityFrom}-${flight.local_departure.split('T')[1]} -- ${flight.cityTo}-${flight.local_arrival.split('T')[1]} -- ${flight.airline}${flight.flight_no} -- $${flight.price}`;
          $arrivalSelect?.appendChild($flightOption);
        });
      } else {
        const $flightOption = document.createElement('option');
        $flightOption.textContent = 'No Flights Found For Current Date';
        $arrivalSelect?.appendChild($flightOption);
      }
    } else {
      const $flightOption = document.createElement('option');
      $flightOption.textContent = 'No Flights Found For Current Date';
      $arrivalSelect?.appendChild($flightOption);
    }
    if (departureFlights) {
      if (departureFlights.length > 1) {
        departureFlights.forEach((flight: Flights) => {
          const $flightOption = document.createElement('option');
          $flightOption.textContent = `${flight.local_departure.split('T')[0]} ${flight.cityFrom}-${flight.local_departure.split('T')[1]} -- ${flight.cityTo}-${flight.local_arrival.split('T')[1]} -- ${flight.airline}${flight.flight_no} -- $${flight.price}`;
          $departureSelect?.appendChild($flightOption);
        });
      } else {
        const $flightOption = document.createElement('option');
        $flightOption.textContent = 'No Flights Found For Current Date';
        $arrivalSelect?.appendChild($flightOption);
      }
    } else {
      const $flightOption = document.createElement('option');
      $flightOption.textContent = 'No Flights Found For Current Date';
      $arrivalSelect?.appendChild($flightOption);
    }
  } catch (e) {
    console.error(e);
  }
}

async function fetchFlights(
  travelDate: string,
  departureAirports: string | string[],
  arrivalAirports: string | string[],
): Promise<Flights[] | void> {
  let departure: string = '';
  let arrival: string = '';
  if (typeof departureAirports === 'string') {
    departure = departureAirports;
  } else {
    departure = departureAirports.join('%2C%20');
  }
  if (typeof arrivalAirports === 'string') {
    arrival = arrivalAirports;
  } else {
    arrival = arrivalAirports.join('%2C%20');
  }
  const dateArray = travelDate.split('-');
  const formattedDate = `${dateArray[2]}%2F${dateArray[1]}%2F${dateArray[0]}`;
  const flightsURL = `https://api.tequila.kiwi.com/v2/search?fly_from=${departure}&fly_to=${arrival}&date_from=${formattedDate}&date_to=${formattedDate}&ret_from_diff_city=true&ret_to_diff_city=true&one_for_city=0&one_per_date=0&adults=1&children=0&selected_cabins=M&adult_hold_bag=1&adult_hand_bag=1&only_working_days=false&only_weekends=false&partner_market=us&curr=USD&locale=us&max_stopovers=1&vehicle_type=aircraft&limit=20`;
  const flightsHeader = {
    apikey: '2Q_NuNwGtLTXtRntdfeA2YJfOFTognUE',
    accept: 'application/json',
  };
  const flightsArr: Flights[] = [];

  try {
    const fetchFlightsResp = await fetch(flightsURL, {
      headers: flightsHeader,
    });
    if (!fetchFlightsResp.ok) throw new Error('Network failure');
    const flightsJSON = await fetchFlightsResp.json();
    flightsJSON.data.forEach((flight: Flights) => {
      if (flight.availability!.seats !== null) {
        const flightInfo: Flights = {
          cityFrom: flight.cityFrom,
          cityTo: flight.cityTo,
          local_arrival: flight.local_arrival,
          local_departure: flight.local_departure,
          price: flight.price,
          flight_no: flight.flight_no,
          airline: flight.airline,
        };
        flightsArr.push(flightInfo);
      }
    });
    return flightsArr;
  } catch (E) {
    console.error(E);
  }
}

$flightSearchButton?.addEventListener('click', () => {
  if (!currentPark) {
    return;
  }
  fetchAirport(
    currentPark,
    $dateStartInput.value,
    $dateEndInput.value,
    $departingCityInput.value,
  );
});
