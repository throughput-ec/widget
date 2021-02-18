import { Component, h, Prop, State } from "@stencil/core";
import { KEYUTIL, KJUR } from "jsrsasign";

@Component({
  tag: "throughput-widget",
  styleUrl: "throughput-widget.css",
  shadow: true,
})
export class ThroughputWidget {
  @Prop() identifier: string = null; //"r3d100011761"; // specifies a resource eg Neotoma
  @Prop() additionalType: string = null; // specifies a dataset type eg site, core, etc
  // @Prop() element: string = "annotation"; // type of DB entity to pull
  @Prop() link: any = null; // specifies the resource-specific dataset
  @Prop() readOnlyMode = false; // if true, hide add annotation UI elements

  @State() annotations: Array<object>;
  @State() authenticated: boolean;

  componentWillLoad() {
    const client_id = "APP-EDLUYOOYTPV3RMXO";

    // ORCID authentication with OpenID
    // if we've loaded with #...id_token etc in the body, work OpenID magic
    this.authenticated = false;
    if (window.location.hash != "") {
      const id_token = this.getFragmentParameterByName("id_token");
      if (id_token !== null) {
        const sigIsValid = this.checkSig(id_token, client_id);
        console.log("ORCID id_token signature is valid: ", sigIsValid);
        console.log(KJUR.jws.JWS.parse(id_token).payloadPP);
        this.authenticated = sigIsValid;
      } else {
        console.log("no id_token found");
      }
    } else {
      console.log("no hash");
    }

    // Pull Throughput annotations
    // example: https://throughputdb.com/api/ccdrs/annotations?dbid=r3d100011761&additionalType=site
    console.log(this.identifier, this.additionalType);
    // brg 2/17/2021: some returned JSON keys differ from corresponding search params:
    // [search param] -> [returned JSON key]
    // dbid -> ccdr
    // link -> id
    if (this.identifier) {
      // console.log(this.identifier);
      let url = "https://throughputdb.com/api/ccdrs/annotations?dbid=" + this.identifier;
      if (this.additionalType) {
        url += "&additionalType=" + this.additionalType;
      }
      if (this.link) {
        url += "&link=" + this.link;
      }
      // brg 2/17/2021 element seems to be ignored at present
      // if (this.element) {
      //   url += "&element" + this.element;
      // }
      url += "&limit=9999"; // default limit is 25
      console.log(url);
      fetch(url).then((response) => {
        response.json().then((json) => {
          console.log(json);
          this.annotations = json.data;
        });
      });
    }
  }

  // ORCID OpenID handling lifted from
  // https://github.com/ORCID/orcid-openid-examples/blob/master/js-orcid-jwt/example.html
  getFragmentParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)");
    var results = regex.exec(window.location.hash);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  checkSig(idToken, clientId) {
    const orcidCert = {
      kty: "RSA",
      e: "AQAB",
      use: "sig",
      kid: "sandbox-orcid-org-3hpgosl3b6lapenh1ewsgdob3fawepoj",
      n:
        "pl-jp-kTAGf6BZUrWIYUJTvqqMVd4iAnoLS6vve-KNV0q8TxKvMre7oi9IulDcqTuJ1alHrZAIVlgrgFn88MKirZuTqHG6LCtEsr7qGD9XyVcz64oXrb9vx4FO9tLNQxvdnIWCIwyPAYWtPMHMSSD5oEVUtVL_5IaxfCJvU-FchdHiwfxvXMWmA-i3mcEEe9zggag2vUPPIqUwbPVUFNj2hE7UsZbasuIToEMFRZqSB6juc9zv6PEUueQ5hAJCEylTkzMwyBMibrt04TmtZk2w9DfKJR91555s2ZMstX4G_su1_FqQ6p9vgcuLQ6tCtrW77tta-Rw7McF_tyPmvnhQ",
    };
    const pubKey = KEYUTIL.getKey(orcidCert);
    return KJUR.jws.JWS.verifyJWT(idToken, pubKey, {
      alg: ["RS256"],
      iss: ["https://sandbox.orcid.org"],
      aud: clientId,
      gracePeriod: 15 * 60, //15 mins skew allowed
    });
  }

  render() {
    return (
      <div>
        <data-display
          annotations={this.annotations}
          authenticated={this.authenticated}
          readOnlyMode={this.readOnlyMode}
        ></data-display>
      </div>
    );
  }
}
