import { Component, h } from "@stencil/core";

@Component({
  tag: "orcid-connect",
  styleUrl: "orcid-connect.css",
  shadow: true
})

export class OrcidConnect {
  openORCID() {
    window.open("https://sandbox.orcid.org/oauth/authorize?response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2F&client_id=APP-EDLUYOOYTPV3RMXO&scope=openid&nonce=ThroughputWidgetNonce", "_self");
  }

  render() {
    return <button id="connect-orcid-button" onClick={this.openORCID}><img id="orcid-id-icon" src="https://orcid.org/sites/default/files/images/orcid_24x24.png" width="24" height="24" alt="ORCID iD icon"/>Register or Connect your ORCID iD</button>;
  }
}