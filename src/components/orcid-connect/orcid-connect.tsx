import { Component, h } from "@stencil/core";

@Component({
  tag: "orcid-connect",
  styleUrl: "orcid-connect.css",
  shadow: true,
})
export class OrcidConnect {
  openORCID() {
    const redirect_uri = window.location.href.toString().split('#')[0]; // remove anchor '#' and everything to right
    const orcid_auth_uri =
      "https://sandbox.orcid.org/oauth/authorize?response_type=token&redirect_uri=" +
      redirect_uri +
      "&client_id=APP-EDLUYOOYTPV3RMXO&scope=openid&nonce=ThroughputWidgetNonce";
    window.open(
      orcid_auth_uri,
      "_self"
    );
  }

  render() {
    return (
      <div class="connect-orcid-button-wrapper">
        <button id="connect-orcid-button" onClick={this.openORCID}>
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
