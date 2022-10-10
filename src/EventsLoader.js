import React, { Component } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import CodeSnippet from "./CodeSnippet";
import Button from "./Button";
import { importEvents, toggleEventsLoader } from "./actions";

ReactModal.setAppElement("#root");

class EventsLoader extends Component {
  constructor(props) {
    super(props);
    this.state = { rawEvents: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const rawEvents = localStorage.getItem("rawEvents");
    if (rawEvents) {
      this.setState({ rawEvents });
    }
  }

  handleChange(event) {
    this.setState({ rawEvents: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.importEvents(this.state.rawEvents);
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isEventsLoaderShown}
        contentLabel="Events Loader"
        onRequestClose={() => this.props.toggleEventsLoader(false)}
      >
        <Button
          className="EventsLoader__close"
          onClick={() => this.props.toggleEventsLoader(false)}
        >
          Close
        </Button>
        <div className="EventsLoader">
          <h2>Import your sessions</h2>
          <p>
            See the how to video:{" "}
            <a
              href="https://www.dropbox.com/s/ox4vf6ahidd3z3y/reinvent-planner.mov?dl=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.dropbox.com/s/ox4vf6ahidd3z3y/reinvent-planner.mov?dl=0
            </a>
          </p>
          <ol>
            <li>
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
            </li>
            <li>
              Paste the JSON result in the textarea below and hit Import:
              <form className="EventsLoader__form" onSubmit={this.handleSubmit}>
                <textarea
                  onChange={this.handleChange}
                  value={this.state.rawEvents}
                />
                <Button disabled={this.state.rawEvents.trim().length < 1}>
                  Import
                </Button>
                {this.props.importError && (
                  <div className="EventsLoader__error">
                    Sorry, unable to import. The following error happened:
                    <pre>{this.props.importError}</pre>
                  </div>
                )}
              </form>
            </li>
          </ol>
        </div>
      </ReactModal>
    );
  }
}

const mapStateToProps = ({ events }) => ({
  isEventsLoaderShown: events.isEventsLoaderShown,
  importError: events.importError,
});

export default connect(mapStateToProps, { importEvents, toggleEventsLoader })(
  EventsLoader
);
