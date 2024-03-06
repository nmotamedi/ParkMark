'use strict';
const parksEndpoint = 'https://developer.nps.gov/api/v1/parks?limit=1000';
// const eventsEndpoint = "https://developer.nps.gov/api/v1/events";
// const activitiesEndpoint = "https://developer.nps.gov/api/v1/activities";
// const ttdEndpoint = "https://developer.nps.gov/api/v1/thingstodo";
const headers = {
  'X-Api-Key': 'etA2FldfC7HhYmqU7qvOsi5HIeCezAaSefRG26Hk',
};
const $heroContainer = document.querySelector('.hero.container');
const $scrollMenuDiv = document.querySelector('.scrollmenu');
const $heroButtonRow = document.querySelector('.hero-button-row');
const $section = document.querySelector('section');
const $mainListContainer = document.querySelector('.main-list-container');
if (
  !$section ||
  !$mainListContainer ||
  !$scrollMenuDiv ||
  !$heroButtonRow ||
  !$heroContainer
)
  throw new Error(
    '$scrollMenuDiv, $heroContainer, or $heroButtonRow query failed.',
  );
async function getParksData(url) {
  try {
    const allNPParks = [];
    const resp = await fetch(url, { headers: headers });
    if (!resp.ok) throw new Error('Network failure');
    const parkJSON = await resp.json();
    const npParkData = parkJSON.data.filter((park) => {
      return (
        park.designation === 'National Park' ||
        park.designation === 'National Park & Preserve' ||
        park.designation === 'National Parks' ||
        park.designation === 'National and State Parks' ||
        park.parkCode === 'npsa'
      );
    });
    for (const park of npParkData) {
      const parkActivities = park.activities.map((activity) => activity.name);
      const parkObj = {
        fullName: park.fullName,
        imgURL: park.images[0].url,
        imgAlt: park.images[0].altText,
        states: park.states,
        activities: parkActivities,
      };
      allNPParks.push(parkObj);
    }
    displayList(allNPParks);
    return allNPParks;
  } catch (e) {
    console.error(e);
  }
}
function createParkListItem(parkData) {
  const $divWrapper = document.createElement('div');
  $divWrapper.classList.add('row', 'list-item');
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
function displayList(parkData) {
  for (const park of parkData) {
    const $listItem = createParkListItem(park);
    $scrollMenuDiv?.appendChild($listItem);
  }
}
const allParks = getParksData(parksEndpoint);
console.log(allParks);
$heroButtonRow.addEventListener('click', (event) => {
  const eventTarget = event.target;
  console.log(eventTarget);
  if (eventTarget.closest('div').dataset.view === 'main-list') {
    $heroContainer.classList.add('hidden');
    $section.classList.remove('hidden');
  }
});
