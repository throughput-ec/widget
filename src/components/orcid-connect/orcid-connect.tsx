import { Component, h } from "@stencil/core";

@Component({
  tag: "orcid-connect",
  styleUrl: "orcid-connect.css",
  shadow: true
})

export class OrcidConnect {
  openORCID() {
    console.log("Clicked ORCID connect button");
    window.open("https://sandbox.orcid.org/oauth/authorize?client_id=APP-EDLUYOOYTPV3RMXO&response_type=code&scope=/authenticate&show_login=false&redirect_uri=localhost:3333/", "_blank", "toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500");
  }

  render() {
    return <button id="connect-orcid-button" onClick={this.openORCID}><img id="orcid-id-icon" src="https://orcid.org/sites/default/files/images/orcid_24x24.png" width="24" height="24" alt="ORCID iD icon"/>Register or Connect your ORCID iD</button>;
  }
}