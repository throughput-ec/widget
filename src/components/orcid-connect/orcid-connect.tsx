import { Component, h, Listen, Prop } from "@stencil/core";

@Component({
  tag: "orcid-connect",
  styleUrl: "orcid-connect.css",
  shadow: true,
})
export class OrcidConnect {
  @Prop() orcidClientId: string;
  @Prop() useOrcidSandbox: boolean;

  @Listen('click')
  handleClick(ev) {
    const clicked_id = ev.composedPath()[0].id;
    if (clicked_id) {
      this.openORCID();
    }
  }

  openORCID() {
    const redirect_uri = window.location.href.toString().split('#')[0]; // remove anchor '#' and everything to right
    const orcid_auth_uri =
      (this.useOrcidSandbox ? "https://sandbox.orcid.org" : "https://orcid.org") +
      "/oauth/authorize?response_type=token&redirect_uri=" +
      redirect_uri +
      "&client_id=" + this.orcidClientId +
      "&scope=openid&nonce=ThroughputWidgetNonce";

    console.log("opening URL ", orcid_auth_uri);

    window.open(
      orcid_auth_uri,
      "_self"
    );
  }

  render() {
    return (
      <div class="connect-orcid-button-wrapper">
        <button id="connect-orcid-button">
          To Submit Annotations - Connect your ORCID iD
          <img
            id="orcid-id-icon"
            src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
            width="24"
            height="24"
            alt="ORCID iD icon"
          />
        </button>
      </div>
    );
  }
}
