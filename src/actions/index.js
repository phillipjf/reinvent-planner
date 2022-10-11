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
  const rawEvents =
    typeof rawEventsJson === "object"
      ? rawEventsJson
      : JSON.parse(rawEventsJson);
  const events = {};
  const locations = [];
  const types = [];

  rawEvents
    // Filter out events that have no time information.
    .filter((event) => ![event.startTime, event.endTime].includes(null))
    // Map events to calendar format.
    .forEach((event) => {
      // Process event location.
      const venue = (event.venue && event.venue.name) || "TBD";
      if (!locations.includes(venue)) {
        locations.push(venue);
      }

      // Process event type.
      const type = event.sessionType.name;
      if (!types.includes(type)) {
        types.push(type);
      }
      const alias = event.alias;

      // Add event to events object.
      events[alias] = {
        id: alias,
        title: `${alias} (${venue}) [${type}]`,
        tooltip: `${event.name} - ${event.description} (${venue}) [${type}]`,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        link: "",
        type,
        location: venue,
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

    console.log("index.loadApp: import success");
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
    console.log("index.loadApp: import error", error);
    return {
      type: LOAD_APP_FAIL,
      payload: error.toString(),
    };
  }
};

export const importEvents = (rawEventsJson) => {
  try {
    const { events, locations, types } = parseEvents(rawEventsJson);
    // localStorage.setItem("rawEvents", JSON.stringify(rawEventsJson));
    console.log("index.importEvents: import success");
    return {
      type: IMPORT_EVENTS_SUCCESS,
      payload: { events, locations, types },
    };
  } catch (error) {
    console.log("index.importEvents: import error", error);
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
