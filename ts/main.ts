interface FormElements extends HTMLFormControlsCollection {
  tripStart: HTMLInputElement;
  tripEnd: HTMLInputElement;
  events?: HTMLSelectElement;
  activities?: HTMLSelectElement;
}

interface Events {
  location: string;
  date: string;
  title: string;
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
const $dateStartInput = document.querySelector('#start');
const $dateEndInput = document.querySelector('#end');
const $eventsForm = document.querySelector('.events-list-form');
const $dateTitle = document.querySelector('.date-input-title h3');
const $hikeTitle = document.querySelector('.hikes-form > h3');
const $infoEvents = document.querySelector('.events-list tbody');
const $dateToVisitCol = document.querySelector('.wishlist-dates');
const $dateToVisit = document.querySelector('.wishlist-dates h5');
const $infoEventsDiv = document.querySelector('.events-list');
const $wishlistHeaderButton = document.querySelector('.header-wishlist-button');

const today: string[] = new Date().toISOString().split('T');
$dateStartInput?.setAttribute('max', today[0]);
$dateEndInput?.setAttribute('max', today[0]);

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
  } else if (eventTarget.closest('div')!.dataset.view === 'wish-list') {
    viewSwap('wishlist-list');
  }
});

function viewSwap(view: string): void {
  $form.reset();
  $dateEndInput?.removeAttribute('min');
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
      $activityFormTitle!.textContent = 'Activities To Do';
      $dateTitle!.textContent = 'Dates To Visit';
      $hikeTitle!.textContent = 'Hikes To Do';
      $dateStartInput?.setAttribute('min', today[0]);
      $dateEndInput?.setAttribute('min', today[0]);
      $dateStartInput?.removeAttribute('max');
      $dateEndInput?.removeAttribute('max');
      $eventSelect!.textContent = '';
    } else if (view === 'visit-form') {
      $activityFormTitle!.textContent = 'Activities Done';
      $dateTitle!.textContent = 'Dates Visited';
      $hikeTitle!.textContent = 'Hikes Done';
      $dateStartInput?.setAttribute('max', today[0]);
      $dateEndInput?.setAttribute('max', today[0]);
      $dateStartInput?.removeAttribute('min');
      $dateEndInput?.removeAttribute('min');
      $eventsForm?.classList.add('hidden');
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
  $infoParkState!.textContent = park.states;
  $activityTitle!.textContent = 'Activities';
  $infoParkDescription!.textContent = park.description;
  $infoEventsDiv?.classList.add('hidden');
  $infoActivities!.textContent = '';
  $infoEvents!.textContent = '';
  const x = longToX(park.longitude);
  const y = latToY(park.latitude);
  const URL = `https://hikingproject.com/widget/map?favs=1&amp;location=fixed&amp;x=${x}&amp;y=${y}&amp;z=9.4&amp;h=500`;
  $iframesDiv?.forEach(($iframeDiv: HTMLDivElement, index: number) => {
    $iframeDiv.removeChild($iframes[index]);
    const $iframe = document.createElement('iframe');
    $iframe.setAttribute(
      'style',
      'width: 100%; max-width: 1200px; height: 500px',
    );
    $iframe.setAttribute('src', URL);
    $iframeDiv.appendChild($iframe);
  });
  $iframes = document.querySelectorAll(
    '.hikes-div iframe',
  ) as NodeListOf<HTMLIFrameElement>;
  $infoPhoto.style.backgroundImage = `url(${park.imgURL})`;
  if (!park.status) {
    park.activities.forEach((activity: string) => {
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
      park.activitiesDone!.forEach((activity: string) => {
        const $tr = document.createElement('tr');
        const $td = document.createElement('td');
        $td.textContent = activity;
        $tr.appendChild($td);
        $infoActivities!.appendChild($tr);
      });
    }
    $infoButtons?.classList.add('hidden');
    $dateVisitedCol?.classList.remove('hidden');
  } else if (park.status === 'wishlist') {
    $dateToVisit!.textContent = `${park.datesToVisitStart} - ${park.datesToVisitEnd}`;
    $activityTitle!.textContent = 'Activities To Do';
    if (park.activitiesToDo) {
      park.activitiesToDo!.forEach((activity: string) => {
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
      park.eventsToDo!.forEach((activity: string) => {
        const $tr = document.createElement('tr');
        const $td = document.createElement('td');
        $td.textContent = activity;
        $tr.appendChild($td);
        $infoEvents!.appendChild($tr);
      });
    } else {
      const $tr = document.createElement('tr');
      const $td = document.createElement('td');
      $td.textContent = 'No Events Planned';
      $tr.appendChild($td);
      $infoEvents!.appendChild($tr);
    }
    $infoButtons?.classList.add('hidden');
    $dateToVisitCol?.classList.remove('hidden');
    $infoEventsDiv?.classList.remove('hidden');
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
  } else if (buttonText === 'Add Travel Plan') {
    currentStatus = 'wishlist';
    viewSwap('wishlist-form');
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
  wishlistParks = data.parks.filter(
    (park: NationalPark) => park.status === 'wishlist',
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
    viewSwap('journal-list');
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

$dateStartInput?.addEventListener('input', (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  startDate = eventTarget.value;
  $dateEndInput?.setAttribute('min', startDate);
  $dateEndInput?.setAttribute('value', startDate);
});

$dateEndInput?.addEventListener('input', (eventEnd: Event) => {
  const eventEndTarget = eventEnd.target as HTMLInputElement;
  const endDate = eventEndTarget.value;
  if (!startDate || !currentPark || !currentPark?.parkCode)
    throw new Error('Unable to run function.');
  getEventsData(startDate, endDate, currentPark.parkCode);
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
    eventsArr.forEach((events: Events) => {
      const $eventOption = document.createElement('option');
      $eventOption.textContent = `${events.date} - ${events.title} - ${events.location}`;
      $eventSelect?.appendChild($eventOption);
    });
  } catch (e) {
    console.error(e);
  }
}
