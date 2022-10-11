import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import CodeSnippet from "./CodeSnippet";
import Button from "./Button";
import { importEvents, toggleEventsLoader } from "./actions";
import { useQuery, gql } from "@apollo/client";

ReactModal.setAppElement("#root");

const GET_CALENDAR = gql`
  query AttendeeCalendar($eventId: ID!, $limit: Int, $nextToken: String) {
    event(id: $eventId) {
      id
      mySessions(limit: $limit, nextToken: $nextToken) {
        items {
          ...SessionCalendar
          __typename
        }
        __typename
      }
      myFavorites(limit: $limit, nextToken: $nextToken) {
        items {
          ...SessionCalendar
          __typename
        }
        __typename
      }
      myUserSessions {
        items {
          ...UserCalendar
          __typename
        }
        __typename
      }
      sessionCatalog {
        facets {
          venues {
            items {
              id
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }

  fragment SessionCalendar on Session {
    eventId
    sessionId
    name
    description
    startTime
    endTime
    duration
    isBlocking
    alias
    status
    isEmbargoed
    location
    type
    level
    package {
      itemId
      __typename
    }
    sessionType {
      name
      __typename
    }
    tracks {
      name
      __typename
    }
    venue {
      name
      __typename
    }
    room {
      name
      __typename
    }
    capacities {
      total
      reservableRemaining
      waitlistRemaining
      __typename
    }
    price {
      currency
      value
      __typename
    }
    isPaidSession
    isFavoritedByMe
    myReservationStatus
    action
    __typename
  }

  fragment UserCalendar on UserSession {
    eventId
    sessionId
    name
    description
    startTime
    endTime
    duration
    isBlocking
    location
    __typename
  }
`;

function EventsLoader(props) {
  const [rawEvents, setRawEvents] = useState("");
  const [token, setToken] = useState("");
  const { loading, error, data } = useQuery(GET_CALENDAR, {
    variables: {
      eventId: "53b5de8d-7b9d-4fcc-a178-6433641075fe",
      limit: 100,
      nextToken: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
    const rawEvents = localStorage.getItem("rawEvents");
    if (rawEvents) {
      setRawEvents(rawEvents);
    }
  });

  const handleChange = (e) => {
    setToken(e.target.value);
    localStorage.setItem("token", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.importEvents(data.event.myFavorites.items);
  };

  return (
    <ReactModal
      isOpen={props.isEventsLoaderShown}
      contentLabel="Events Loader"
      onRequestClose={() => props.toggleEventsLoader(false)}
    >
      <Button
        className="EventsLoader__close"
        onClick={() => props.toggleEventsLoader(false)}
      >
        Close
      </Button>
      <div className="EventsLoader">
        <h2>Import your sessions</h2>
        {/* <p>
            See the how to video:{" "}
            <a
              href="https://www.dropbox.com/s/ox4vf6ahidd3z3y/reinvent-planner.mov?dl=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.dropbox.com/s/ox4vf6ahidd3z3y/reinvent-planner.mov?dl=0
            </a>
          </p> */}
        <ol>
          {/* <li>
              Copy the JS code snippet below: <CodeSnippet />
            </li>
            <li>
              Login into the{" "}
              <a
                href="https://www.portal.reinvent.awsevents.com/connect/publicDashboard.ww"
                target="_blank"
                rel="noopener noreferrer"
              >
                re:Invent Event Catalog
              </a>{" "}
              and navigate to the Interests page.
            </li>
            <li>
              Paste the code snippet into the browser's console and run it.
            </li> */}
          <li>
            Paste the JSON result in the textarea below and hit Import:
            <form className="EventsLoader__form" onSubmit={handleSubmit}>
              <textarea onChange={handleChange} value={token} />
              <Button disabled={token.trim().length < 1}>Import</Button>
              {props.importError && (
                <div className="EventsLoader__error">
                  Sorry, unable to import. The following error happened:
                  <pre>{props.importError}</pre>
                </div>
              )}
            </form>
          </li>
        </ol>
      </div>
    </ReactModal>
  );
}

const mapStateToProps = ({ events }) => ({
  isEventsLoaderShown: events.isEventsLoaderShown,
  importError: events.importError,
});

export default connect(mapStateToProps, { importEvents, toggleEventsLoader })(
  EventsLoader
);
