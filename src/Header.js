import React from "react";
import { connect } from "react-redux";
import Button from "./Button";
import { toggleEventsLoader, toggleFilters } from "./actions";

function Header(props) {
  return (
    <header className="Header">
      <div>
        <h1>re:Invent Planner</h1>
        <p>
          Plan your AWS re:Invent 2019 schedule by visualizing it in a calendar.
        </p>
      </div>
      <div className="Header__controls">
        <Button
          onClick={() => {
            props.toggleEventsLoader(true);
          }}
        >
          {props.numEvents ? "Re-Import Sessions" : "Get Started"}
        </Button>
        {props.numEvents ? (
          <Button onClick={() => props.toggleFilters()}>
            {props.isFiltersShown ? "Hide Filters" : "Show Filters"}
            {` (${props.numFilteredEvents}/${props.numEvents})`}
          </Button>
        ) : null}
      </div>
    </header>
  );
}

const mapStateToProps = ({ events }) => ({
  numEvents: Object.keys(events.events).length,
  numFilteredEvents: Object.keys(events.filteredEvents).length,
  isFiltersShown: events.isFiltersShown,
});

export default connect(mapStateToProps, { toggleEventsLoader, toggleFilters })(
  Header
);
