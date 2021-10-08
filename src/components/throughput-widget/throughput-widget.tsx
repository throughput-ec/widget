import { Component, h, Prop } from "@stencil/core";
import { KEYUTIL, KJUR } from "jsrsasign";
import state from "../../store";

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

  componentWillLoad() {
    if (!this.hasRequiredProps()) {
      return;
    }

    // todo: check authenticated state in localStorage and set state.authenticated

    // Update our state object with passed-in props and getAnnotations() method
    // so annotations-display can refresh annotations after annotations are added.
    if (state.getAnnotations == null) {
      state.getAnnotations = this.getAnnotations;
      state.identifier = this.identifier;
      state.additionalType = this.additionalType;
      state.link = this.link;
      state.readOnlyMode = this.readOnlyMode;
      state.orcidClientId = this.orcidClientId;
      state.useOrcidSandbox = this.useOrcidSandbox;
    }

    // Presence of #...id_token...  in window.location indicates redirect from successful
    // ORCID authentication. Exchange ORCID bearer token for Throughput token.
    state.authenticated = false;
    if (window.location.hash != "") {
      const bearerToken = this.getFragmentParameterByName("access_token");
      const id_token = this.getFragmentParameterByName("id_token");
      // clear #... in address bar so we don't hit this block every time
      // the page reloads when changing code!!!
      // https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r/5298684#5298684
      history.replaceState("", document.title, window.location.pathname + window.location.search);
      if (id_token !== null) {
        const sigIsValid = this.checkSig(id_token);
        console.log("ORCID bearer token (access_token key of window.location.hash):", bearerToken);
        // console.log("ORCID id_token signature is valid:", sigIsValid);
        // console.log("Decrypted token contents:", KJUR.jws.JWS.parse(id_token).payloadPP);
        if (sigIsValid) {
          this.getThroughputToken(bearerToken).then((response) => {
            // console.log("Throughput response:", response);
            response.json().then((json) => {
              if (json.status == "success") {
                state.authenticated = true;
                state.throughputToken = json.data.token;
                state.orcidName = json.data.user.given_name + " " + json.data.user.family_name;
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
    this.getAnnotations();
  }
  
  // Pull Throughput annotations
  // example: https://throughputdb.com/api/ccdrs/annotations?dbid=r3d100011761&id=1114&additionalType=site
  getAnnotations() {
    const ANNOTATION_SEARCH_ENDPOINT = "https://throughputdb.com/api/ccdrs/annotations?";
    const params = new URLSearchParams({
        dbid: state.identifier,
        additionalType: state.additionalType,
        id: state.link,
        limit: "9999"
    });
    fetch(ANNOTATION_SEARCH_ENDPOINT + params).then((response) => {
      response.json().then((json) => {
        console.log(json);
        state.annotations = json.data;
      });
    });
  }

  // After user authentication, exchange the short-lived ORCID bearer token for a
  // more persistent throughputdb.com token to be used when adding annotations.
  async getThroughputToken(orcidBearerToken) {
    // console.log("Passing bearer token to Throughput:", orcidBearerToken);
    let response = await fetch('https://throughputdb.com/auth/orcid', {
      method:'POST',
      body: JSON.stringify({token: orcidBearerToken}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
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

  render() {
    return this.hasRequiredProps() ?
      (<div>
        <data-display></data-display>
      </div>) :
      (<div>Error: see console for details</div>);
  }
}
