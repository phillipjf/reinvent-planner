import React, { useEffect } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Filters from "./Filters";
import EventsLoader from "./EventsLoader";
import SessionCalendar from "./Calendar";
import { loadApp } from "./actions";

import "./App.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";

function App(props) {
  useEffect(() => {
    props.loadApp();
  });

  const { isFiltersShown, filteredEvents } = props;
  const classNames = ["App"];
  if (isFiltersShown) {
    classNames.push("App-showFilters");
  }
  return (
    <div className={classNames.join(" ")}>
      <Header />
      <Filters />
      <SessionCalendar events={filteredEvents} />
      <EventsLoader />
    </div>
  );
}

const mapStateToProps = ({ events }) => ({
  filteredEvents: events.filteredEvents,
  isFiltersShown: events.isFiltersShown,
});

export default connect(mapStateToProps, { loadApp })(App);
