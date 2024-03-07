const $heroContainer = document.querySelector('.hero.container');
const $scrollMenuDiv = document.querySelector('.scrollmenu');
const $heroButtonRow = document.querySelector('.hero-button-row');
const $section = document.querySelector('section');
const $mainListContainer = document.querySelector('.main-list-container');
const $mainInfoContainer = document.querySelector('.main-park-info');
const $infoParkName = document.querySelector('.col-park-name h1');
const $infoParkState = document.querySelector('.col-park-name h3');
const $infoParkDescription = document.querySelector('.main-park-info h5');
const $infoActivities = document.querySelector('.activities-list tbody');
// const $infoEvents = document.querySelector(".events-list tbody");
const $headerHomeButton1 = document.querySelector('.header-home-button');
const $headerHomeButton2 = document.querySelector('.header-title');
const $infoPhoto = document.querySelector('.photo-info-row') as HTMLDivElement;
if (
  !$section ||
  !$mainListContainer ||
  !$scrollMenuDiv ||
  !$heroButtonRow ||
  !$heroContainer ||
  !$mainInfoContainer ||
  !$headerHomeButton1 ||
  !$headerHomeButton2
)
  throw new Error(
    '$scrollMenuDiv, $heroContainer, or $heroButtonRow query failed.',
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

function displayList(parkData: NationalPark[]): void {
  $scrollMenuDiv!.textContent = '.';
  for (const park of parkData) {
    const $listItem = createParkListItem(park);
    $scrollMenuDiv?.appendChild($listItem);
  }
}

$heroButtonRow.addEventListener('click', (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  if (eventTarget.closest('div')!.dataset.view === 'main-list') {
    displayList(data.parks);
    $heroContainer.classList.add('hidden');
    $section.classList.remove('hidden');
    $mainListContainer.classList.remove('hidden');
  }
});

$scrollMenuDiv.addEventListener('click', (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  const nearestDIV = eventTarget.closest('div.list-item') as HTMLDivElement;
  const parkClicked = nearestDIV.dataset.park;
  const parkInfo = data.parks.find(
    (park: NationalPark) => park.fullName === parkClicked,
  );
  populateInfo(parkInfo!);
  $mainListContainer.classList.add('hidden');
  $mainInfoContainer.classList.remove('hidden');
});

function populateInfo(park: NationalPark): void {
  $infoParkName!.textContent = park.fullName;
  $infoParkState!.textContent = park.states;
  $infoParkDescription!.textContent = park.description;
  $infoActivities!.textContent = '';
  park.activities.forEach((activity: string) => {
    const $tr = document.createElement('tr');
    const $td = document.createElement('td');
    $td.textContent = activity;
    $tr.appendChild($td);
    $infoActivities!.appendChild($tr);
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
