/* exported data */
interface NationalPark {
  fullName: string;
  imgURL: string;
  imgAlt: string;
  activities: string[];
  states: string[];
  description: string;
  status?: string;
  parkCode: string;
  activitiesDone?: string[];
  activitiesToDo?: string[];
  eventsToDo?: string[][];
  datesVisitedStart?: string;
  datesVisitedEnd?: string;
  datesToVisitStart?: string;
  datesToVisitEnd?: string;
  latitude: number;
  longitude: number;
}

interface Park {
  name: string;
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
  latitude: string;
  longitude: string;
}

let data: {
  parkCount: number;
  parks: NationalPark[];
} = {
  parkCount: 0,
  parks: [],
};

const parksEndpoint = 'https://developer.nps.gov/api/v1/parks?limit=1000';
const headers = {
  'X-Api-Key': 'etA2FldfC7HhYmqU7qvOsi5HIeCezAaSefRG26Hk',
};

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
        fullName: park.name,
        imgURL: park.images[0].url,
        imgAlt: park.images[0].altText,
        states: park.states.split(','),
        parkCode: park.parkCode,
        activities: parkActivities,
        description: park.description,
        latitude: +park.latitude,
        longitude: +park.longitude,
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
