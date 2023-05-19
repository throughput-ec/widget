import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core";

@Component({
  tag: "orcid-connect",
  styleUrl: "orcid-connect.css",
  shadow: true,
})
export class OrcidConnect {
  @Prop() orcidClientId: string;
  @Prop() authenticated: boolean;
  @Prop() orcidName: string;
  @Prop() isamplesServerBase: string = "http://localhost:8000/manage/login";

  @Event({
    eventName: 'orcidLogout',
    bubbles: true,
    cancelable: false,
    composed: true
  }) orcidLogout: EventEmitter<void>;    

  @Listen('click')
  handleClick(ev) {
    const clicked_id = ev.composedPath()[0].id;
    if (clicked_id == "connect-orcid-button") {
      this.openORCID();
    } else if (clicked_id == "logout-button") {
      this.orcidLogout.emit(); // orcidLogout event for root to handle
    }
  }

  openORCID() {
    // end point to do login for annotation purposes
    const isamples_auth_uri =  this.isamplesServerBase + "?annotation=true";
    window.open( isamples_auth_uri , "_self");
  }

  render() {
    const orcidIcon =
     <img
      id="orcid-id-icon"
      src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
      width="24"
      height="24"
      alt="ORCID iD icon"
    />;

    return (
      <div class="connect-orcid-button-wrapper">
        {this.authenticated ? (
          <div class='author-name'>
            <div class='item'>
              {orcidIcon}
            </div>
            <div class='item'>
              Authenticated as {this.orcidName}
            </div>
            <div class='item'>
               <button id="logout-button" class="logout_button">Sign Out</button>
            </div>
          </div>
        ) : (
          <button id="connect-orcid-button">
            To Submit Annotations - Connect your ORCID iD
            {orcidIcon}
          </button>
        )}
      </div>
    );
  }
}
