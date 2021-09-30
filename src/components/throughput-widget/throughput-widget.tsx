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
  @Prop() readOnlyMode: boolean = false; // if true, hide add annotation UI elements
  @Prop() orcidClientId: string = null; // required if readOnlyMode = false
  @Prop() useOrcidSandbox: boolean = false; // use sandbox.orcid.org if true, else orcid.org (production)
  @Prop() token: string = null; // obsolete, but retaining until API no longer requires token
  
  @State() annotations: Array<object>;
  @State() authenticated: boolean;
  @State() orcidName: string;

  componentWillLoad() {
    if (!this.hasRequiredProps()) {
      return;
    }

    // ORCID authentication with OpenID
    // if we've loaded with #...id_token etc in the body, work OpenID magic
    // #...access_token is our Bearer Token to be passed to throughputdb.com
    this.authenticated = false;
    if (window.location.hash != "") {
      const bearerToken = this.getFragmentParameterByName("access_token");
      const id_token = this.getFragmentParameterByName("id_token");
      // clear #... in address bar so we don't hit this block every time
      // the page reloads when changing code!!!
      // https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r/5298684#5298684
      history.replaceState("", document.title, window.location.pathname + window.location.search);
      if (id_token !== null) {
        const sigIsValid = this.checkSig(id_token);
        console.log("ORCID bearer token (access_token key of window.location.hash): ", bearerToken);
        console.log("ORCID id_token signature is valid: ", sigIsValid);
        console.log("Decrypted token contents:")
        console.log(KJUR.jws.JWS.parse(id_token).payloadPP);
        if (sigIsValid) {
          this.getThroughputToken(bearerToken).then((response) => {
            console.log("Throughput response: ", response);
            response.json().then((json) => {
              console.log("JSON response: ", json);
              if (json.status == "success") {
                this.authenticated = true;
                this.orcidName = json.data.user.name;
                console.log("Got Throughput token for user ", this.orcidName);
              }
            });
          });
        } else {
          console.error("id_token signature is invalid");
        }
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
    const missingProps = !this.readOnlyMode && !this.orcidClientId;
    if (missingProps) {
      console.error("Throughput widget: 'orcid-client-id' property required if 'read-only-mode' is false.")
    }
    return (this.identifier && this.link && this.additionalType && !missingProps);
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

  checkSig(idToken) {
    const orcidSandboxCert = {
      kty: "RSA",
      e: "AQAB",
      use: "sig",
      kid: "sandbox-orcid-org-3hpgosl3b6lapenh1ewsgdob3fawepoj",
      n:
        "pl-jp-kTAGf6BZUrWIYUJTvqqMVd4iAnoLS6vve-KNV0q8TxKvMre7oi9IulDcqTuJ1alHrZAIVlgrgFn88MKirZuTqHG6LCtEsr7qGD9XyVcz64oXrb9vx4FO9tLNQxvdnIWCIwyPAYWtPMHMSSD5oEVUtVL_5IaxfCJvU-FchdHiwfxvXMWmA-i3mcEEe9zggag2vUPPIqUwbPVUFNj2hE7UsZbasuIToEMFRZqSB6juc9zv6PEUueQ5hAJCEylTkzMwyBMibrt04TmtZk2w9DfKJR91555s2ZMstX4G_su1_FqQ6p9vgcuLQ6tCtrW77tta-Rw7McF_tyPmvnhQ",
    };
    const orcidProdCert = {
      kty: "RSA",
      e: "AQAB",
      use: "sig",
      kid: "production-orcid-org-7hdmdswarosg3gjujo8agwtazgkp1ojs",
      n:
        "jxTIntA7YvdfnYkLSN4wk__E2zf_wbb0SV_HLHFvh6a9ENVRD1_rHK0EijlBzikb-1rgDQihJETcgBLsMoZVQqGj8fDUUuxnVHsuGav_bf41PA7E_58HXKPrB2C0cON41f7K3o9TStKpVJOSXBrRWURmNQ64qnSSryn1nCxMzXpaw7VUo409ohybbvN6ngxVy4QR2NCC7Fr0QVdtapxD7zdlwx6lEwGemuqs_oG5oDtrRuRgeOHmRps2R6gG5oc-JqVMrVRv6F9h4ja3UgxCDBQjOVT1BFPWmMHnHCsVYLqbbXkZUfvP2sO1dJiYd_zrQhi-FtNth9qrLLv3gkgtwQ",
    };
    const pubKey = KEYUTIL.getKey(this.useOrcidSandbox ? orcidSandboxCert : orcidProdCert);
    return KJUR.jws.JWS.verifyJWT(idToken, pubKey, {
      alg: ["RS256"],
      iss: [this.useOrcidSandbox ? "https://sandbox.orcid.org" : "https://orcid.org"],
      aud: this.orcidClientId,
      gracePeriod: 15 * 60, //15 mins skew allowed
    });
  }

  // After user authentication, exchange the short-lived ORCID bearer token
  // for, among other things, a persistent throughputdb.com token, required
  // to add new annotations.
  async getThroughputToken(orcidBearerToken) {
    let response = await fetch('https://throughputdb.com/auth/orcid', {
      method:'POST',
      body: JSON.stringify({token: orcidBearerToken})
    });
    
    // expected response is JSON of form:
    // {
    // "status": "success",
    // "data": {
    //     "token": "zI1NiIsInR5cCI6IkpXVkddxCJ9.eyJvcmNpZCI6eyJpZCI6Imh0dHBzOi8vb3JjaWQub3JnLzAwMDAtMDAwMi0yNzAwLTQ2MDUiLCJzdWIiOiIwMDAwLTAwMDItMjcwMC00NjA1IiwibmFtEdvcmluZyIsImZhbWlseV9uYW1lIjoiR29yaW5nIiwiZ2l2ZW5fbmFtZSI6IlNpbW9uIn0sImlhdCI6MTYyNzUwOTI5NiwiZXhwIjoxNjI3NTA5Mjk4fQ.Y9BZmQdU3wT3smgtWxPieAQAyNlr4bZ-XAXtcpb6Ltw",
    //     "user": {
    //         "id": "https://orcid.org/0000-1111-2222-3333",
    //         "sub": "0000-1111-2222-3333",
    //         "name": "Some Guy",
    //         "family_name": "Guy",
    //         "given_name": "Some"
    //     }
    // },
    // "message": "Throughput token expires in 1wk"
    return response;
  }

  render() {
    return this.hasRequiredProps() ?
      (<div>
        <data-display
          annotations={this.annotations}
          authenticated={this.authenticated}
          identifier={this.identifier}
          additionalType={this.additionalType}
          link={this.link}
          token={this.token}
          readOnlyMode={this.readOnlyMode}
          orcidClientId={this.orcidClientId}
          useOrcidSandbox={this.useOrcidSandbox}
        ></data-display>
      </div>) :
      (<div>Error: see console for details</div>);
  }
}
