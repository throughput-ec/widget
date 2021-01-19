import { Component, h, Prop, State } from "@stencil/core";
import { KEYUTIL, KJUR } from "jsrsasign";

@Component({
  tag: "throughput-widget",
  styleUrl: "throughput-widget.css",
  shadow: true,
})
export class ThroughputWidget {
  //defaults for dev work
  @Prop() identifier: string = "r3d100011761"; //specifies a resource eg Neotoma
  @Prop() level: string = "site"; //specifies a dataset type eg site, core, etc
  @Prop() element: string = "annotation"; // type of DB entity to pull
  @Prop() link: any = 13971; //specifies the specific dataset // 11349
  @Prop() readOnlyMode = false; // dash-case ('read-only-mode') to set this prop in throughput-widget tag

  @State() annotations: Array<object>;
  @State() authenticated: boolean;

  componentWillLoad() {
    const client_id = "APP-EDLUYOOYTPV3RMXO";

    // OpenID approach
    // if we've loaded with #...id_token etc in the body, work OpenID magic
    this.authenticated = false;
    if (window.location.hash != "") {
      const id_token = this.getFragmentParameterByName("id_token");
      if (id_token !== null) {
        const sigIsValid = this.checkSig(id_token, client_id);
        console.log("sigIsValid = ", sigIsValid);
        console.log(KJUR.jws.JWS.parse(id_token).payloadPP);
        this.authenticated = true;
      } else {
        console.log("no id_token found");
      }
    } else {
      console.log("no hash");
    }

    // http://throughputdb.com/api/db/annotations?id=r3d100011761&"&level=site&element=annotation
    // console.log(this.level, this.link, this.identifier);
    if (this.identifier) {
      // console.log(this.identifier);
      let url =
        "https://throughputdb.com/api/db/annotations?id=" +
        this.identifier +
        // "&link=" +
        // this.link +
        "&level=" +
        this.level +
        "&element=" +
        this.element;
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
