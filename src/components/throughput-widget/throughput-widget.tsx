import { Component, h, Prop, State } from "@stencil/core";
import { KEYUTIL, KJUR } from "jsrsasign";

@Component({
  tag: "throughput-widget",
  styleUrl: "throughput-widget.css",
  shadow: true,
})
export class ThroughputWidget {
  @Prop() identifier: string = null; // specifies a resource eg Neotoma
  @Prop() additionalType: string = null; // specifies a dataset type eg site, core, etc
  @Prop() link: any = null; // specifies the resource-specific dataset
  @Prop() readOnlyMode = false; // if true, hide add annotation UI elements
  // @Prop() element: string = "annotation"; // type of DB entity to pull
  
  @State() annotations: Array<object>;
  @State() authenticated: boolean;

  componentWillLoad() {
    if (!this.hasRequiredProps()) {
      return;
    }

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
    // example: https://throughputdb.com/api/ccdrs/annotations?dbid=r3d100011761&id=1114&additionalType=site
    const ANNOTATION_SEARCH_ENDPOINT = "https://throughputdb.com/api/ccdrs/annotations?";
    let url =
      ANNOTATION_SEARCH_ENDPOINT +
      "dbid=" + this.identifier +
      "&additionalType=" + this.additionalType +
      "&id=" + this.link;
    // brg 2/17/2021 element is ignored at present
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

  hasRequiredProps() {
    if (!this.identifier) {
      console.error("Throughput widget: missing required property 'identifier'.")
    }
    if (!this.link) {
      console.error("Throughput widget: missing required property 'link'.")
    }
    if (!this.additionalType) {
      console.error("Throughput widget: missing required property 'additional-type'.")
    }
    return (this.identifier && this.link && this.additionalType);
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
          identifier={this.identifier}
          additionalType={this.additionalType}
          link={this.link}
          readOnlyMode={this.readOnlyMode}
        ></data-display>
      </div>
    );
  }
}
