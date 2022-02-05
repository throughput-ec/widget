import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core";

@Component({
  tag: "orcid-connect",
  styleUrl: "orcid-connect.css",
  shadow: true,
})
export class OrcidConnect {
  @Prop() orcidClientId: string;
  @Prop() useOrcidSandbox: boolean;
  @Prop() authenticated: boolean;
  @Prop() orcidName: string;

  @Event({
    eventName: "orcidLogout",
    bubbles: true,
    cancelable: false,
    composed: true,
  })
  orcidLogout: EventEmitter<void>;

  @Listen("click")
  handleClick(ev) {
    let [login, logout] = [[], []];
    for (let path of ev.composedPath()) {
      if (path.id === "connect-orcid-button") login.push(path);
      if (path.id === "logout-button") logout.push(path);
    }
    if (login.length) {
      this.openORCID();
    } else if (logout.length) {
      this.orcidLogout.emit(); // orcidLogout event for root to handle
    }
  }

  openORCID() {
    const redirect_uri = window.location.href.toString().split("#")[0]; // remove anchor '#' and everything to right
    const orcid_auth_uri =
      (this.useOrcidSandbox
        ? "https://sandbox.orcid.org"
        : "https://orcid.org") +
      "/oauth/authorize?response_type=token&redirect_uri=" +
      redirect_uri +
      "&client_id=" +
      this.orcidClientId +
      "&scope=openid&nonce=ThroughputWidgetNonce";

    console.log("opening URL ", orcid_auth_uri);

    window.open(orcid_auth_uri, "_self");
  }

  render() {
    const orcidIcon = (
      <img
        id="orcid-id-icon"
        src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
        width="24"
        height="24"
        alt="ORCID iD icon"
      />
    );

    return (
      <div class="connect-orcid-button-wrapper">
        {this.authenticated ? (
          <div class="author-name">
            <div class="item">{orcidIcon}</div>
            <div class="item">
              <div class="name-text">{this.orcidName}</div>
              <div id="logout-button" class="logout_button">
                (Sign Out)
              </div>
            </div>
          </div>
        ) : (
          <button id="connect-orcid-button">
            {orcidIcon}
            <div class="orcid-button-text">
              To Submit Annotations Connect your ORCID iD
            </div>
          </button>
        )}
      </div>
    );
  }
}
