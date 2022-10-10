// Import action types.
import {
  LOAD_APP_SUCCESS,
  LOAD_APP_FAIL,
  IMPORT_EVENTS_SUCCESS,
  IMPORT_EVENTS_FAIL,
  TOGGLE_EVENTS_LOADER,
  FILTER_EVENTS,
  TOGGLE_FILTERS,
  SET_EVENT_PRIORITY,
  SET_EVENT_DELETE_STATE,
} from "./types";

function parseEvents(rawEventsJson) {
  const rawEvents = JSON.parse(rawEventsJson);
  const events = {};
  const locations = [];
  const types = [];

  rawEvents
    // Filter out events that have no time information.
    .filter((event) => ![event.start, event.end].includes(null))
    // Map events to calendar format.
    .forEach((event) => {
      // Process event location.
      const location =
        event.location && event.location.split(",")[0].replace("–", "").trim();
      if (!locations.includes(location)) {
        locations.push(location);
      }

      // Process event type.
      const type = event.type;
      if (!types.includes(type)) {
        types.push(type);
      }

      // Add event to events object.
      events[event.id] = {
        id: event.id,
        title: `${event.abbreviation} (${location}) [${event.type}]`,
        tooltip: `${event.abbreviation} - ${event.title} (${location}) [${event.type}]`,
        start: new Date(event.start),
        end: new Date(event.end),
        link: event.link,
        type,
        location,
      };
    });
  return {
    events,
    locations,
    types,
  };
}

export const loadApp = () => {
  try {
    const rawEventsJson = localStorage.getItem("rawEvents");
    const { events, locations, types } = parseEvents(rawEventsJson);

    const eventsUserData = JSON.parse(localStorage.getItem("eventsUserData"));

    return {
      type: LOAD_APP_SUCCESS,
      payload: {
        events,
        eventsUserData: eventsUserData ? eventsUserData : {},
        locations,
        types,
      },
    };
  } catch (error) {
    return {
      type: LOAD_APP_FAIL,
      payload: error.toString(),
    };
  }
};

export const importEvents = (rawEventsJson) => {
  try {
    const { events, locations, types } = parseEvents(rawEventsJson);
    localStorage.setItem("rawEvents", rawEventsJson);
    return {
      type: IMPORT_EVENTS_SUCCESS,
      payload: { events, locations, types },
    };
  } catch (error) {
    return {
      type: IMPORT_EVENTS_FAIL,
      payload: error.toString(),
    };
  }
};

export const toggleEventsLoader = (toggle = null) => ({
  type: TOGGLE_EVENTS_LOADER,
  payload: toggle,
});

export const filterEvents = (filteredEvents) => ({
  type: FILTER_EVENTS,
  payload: filteredEvents,
});

export const toggleFilters = (toggle = null) => ({
  type: TOGGLE_FILTERS,
  payload: toggle,
});

export const setEventPriority = ({ id, priority }) => ({
  type: SET_EVENT_PRIORITY,
  payload: {
    id,
    priority,
  },
});

export const deleteEvent = (id) => ({
  type: SET_EVENT_DELETE_STATE,
  payload: {
    id,
    deleted: true,
  },
});

export const restoreEvent = (id) => ({
  type: SET_EVENT_DELETE_STATE,
  payload: {
    id,
    deleted: false,
  },
});
