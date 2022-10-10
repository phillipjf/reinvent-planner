import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Filters from "./Filters";
import EventsLoader from "./EventsLoader";
import SessionCalendar from "./Calendar";
import { loadApp } from "./actions";

import "./App.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";

class App extends Component {
  componentDidMount() {
    this.props.loadApp();
  }

  render() {
    const { isFiltersShown, filteredEvents } = this.props;
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
}

const mapStateToProps = ({ events }) => ({
  filteredEvents: events.filteredEvents,
  isFiltersShown: events.isFiltersShown,
});

export default connect(mapStateToProps, { loadApp })(App);
