'use strict';
let data = {
  parkCount: 0,
  parks: [],
};
const parksEndpoint = 'https://developer.nps.gov/api/v1/parks?limit=1000';
const headers = {
  'X-Api-Key': 'etA2FldfC7HhYmqU7qvOsi5HIeCezAaSefRG26Hk',
};
async function getParksData(url) {
  try {
    const resp = await fetch(url, { headers });
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
        fullName: park.name,
        imgURL: park.images[0].url,
        imgAlt: park.images[0].altText,
        states: park.states,
        activities: parkActivities,
        description: park.description,
      };
      data.parks.push(parkObj);
    }
  } catch (e) {
    console.error(e);
  }
}
window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('parks-local-storage', dataJSON);
});
const previousDataJSON = localStorage.getItem('parks-local-storage');
if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
} else {
  getParksData(parksEndpoint);
}
