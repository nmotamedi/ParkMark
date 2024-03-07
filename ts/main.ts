interface Park {
  fullName: string;
  designation: string;
  parkCode: string;
  images: {
    url: string;
    altText: string;
  }[];
  activities: {
    id: string;
    name: string;
  }[];
  states: string;
  description: string;
}

interface NationalPark {
  fullName: string;
  imgURL: string;
  imgAlt: string;
  activities: string[];
  states: string;
  description: string;
}

const parksEndpoint = 'https://developer.nps.gov/api/v1/parks?limit=1000';
const headers = {
  'X-Api-Key': 'etA2FldfC7HhYmqU7qvOsi5HIeCezAaSefRG26Hk',
};
const $heroContainer = document.querySelector('.hero.container');
const $scrollMenuDiv = document.querySelector('.scrollmenu');
const $heroButtonRow = document.querySelector('.hero-button-row');
const $section = document.querySelector('section');
const $mainListContainer = document.querySelector('.main-list-container');
const $mainInfoContainer = document.querySelector('.main-park-info');
const $infoParkName = document.querySelector('.col-park-name h1');
const $infoParkState = document.querySelector('.col-park-name h3');
const $infoParkDescription = document.querySelector('.main-park-info h5');
const $infoActivities = document.querySelector('.activities tbody');
const $headerHomeButton1 = document.querySelector('.header-home-button');
const $headerHomeButton2 = document.querySelector('.header-title');
const $infoPhoto = document.querySelector('.photo-info-row') as HTMLDivElement;
const allNPParks: NationalPark[] = [];
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

async function getParksData(url: string): Promise<void> {
  try {
    const resp = await fetch(url, { headers });
    if (!resp.ok) throw new Error('Network failure');
    const parkJSON = await resp.json();
    const npParkData = parkJSON.data.filter((park: Park) => {
      return (
        park.designation === 'National Park' ||
        park.designation === 'National Park & Preserve' ||
        park.designation === 'National Parks' ||
        park.designation === 'National and State Parks' ||
        park.parkCode === 'npsa'
      );
    });
    for (const park of npParkData) {
      const parkActivities: string[] = park.activities.map(
        (activity: { id: string; name: string }) => activity.name,
      );
      const parkObj: NationalPark = {
        fullName: park.fullName,
        imgURL: park.images[0].url,
        imgAlt: park.images[0].altText,
        states: park.states,
        activities: parkActivities,
        description: park.description,
      };
      allNPParks.push(parkObj);
    }
    displayList(allNPParks);
  } catch (e) {
    console.error(e);
  }
}

function createParkListItem(parkData: NationalPark): HTMLDivElement {
  const $divWrapper = document.createElement('div');
  $divWrapper.classList.add('row', 'list-item');
  $divWrapper.setAttribute('data-park', parkData.fullName);
  const $imgColDiv = document.createElement('div');
  $imgColDiv.classList.add('column-third');
  const $listImg = document.createElement('img');
  $listImg.setAttribute('src', parkData.imgURL);
  $listImg.setAttribute('alt', parkData.imgAlt);
  const $textColDiv = $imgColDiv.cloneNode(true);
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
  for (const park of parkData) {
    const $listItem = createParkListItem(park);
    $scrollMenuDiv?.appendChild($listItem);
  }
}

getParksData(parksEndpoint);

$heroButtonRow.addEventListener('click', (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  if (eventTarget.closest('div')!.dataset.view === 'main-list') {
    $heroContainer.classList.add('hidden');
    $section.classList.remove('hidden');
    $mainListContainer.classList.remove('hidden');
  }
});

$scrollMenuDiv.addEventListener('click', (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  const nearestDIV = eventTarget.closest('div.list-item') as HTMLDivElement;
  const parkClicked = nearestDIV.dataset.park;
  const parkInfo = allNPParks.find(
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
  $mainListContainer.classList.remove('hidden');
  $mainInfoContainer.classList.add('hidden');
});

$headerHomeButton2.addEventListener('click', () => {
  $mainListContainer.classList.remove('hidden');
  $mainInfoContainer.classList.add('hidden');
});
