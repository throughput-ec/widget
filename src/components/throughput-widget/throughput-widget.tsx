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
        console.log(KJUR.jws.JWS.parse(id_token).payloadPP)
        this.authenticated = true;
      } else {
        console.log("no id_token found");
      }
    } else {
      console.log("no hash");
    }

    // Pure OAuth approach - including, commented, on the off-chance it
    // might be useful going forward 11/6/2020 brg
    // const orcid_code = url.searchParams.get('code');
    // if (orcid_code != null) {
    //   console.log("ORCID post-auth code = ", orcid_code);
    //   this.fetchOrcidOAuth(orcid_code);
    // } else {
    //   console.log("No ORCID post-auth code found");
    // }

    // console.log(this.level, this.link, this.identifier);
    if (this.identifier) {
      // console.log(this.identifier);
      let url =
        "http://throughputdb.com/api/db/annotations?id=" +
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
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  checkSig(idToken, clientId) {
    const orcidCert = {"kty":"RSA","e":"AQAB","use":"sig","kid":"sandbox-orcid-org-3hpgosl3b6lapenh1ewsgdob3fawepoj","n":"pl-jp-kTAGf6BZUrWIYUJTvqqMVd4iAnoLS6vve-KNV0q8TxKvMre7oi9IulDcqTuJ1alHrZAIVlgrgFn88MKirZuTqHG6LCtEsr7qGD9XyVcz64oXrb9vx4FO9tLNQxvdnIWCIwyPAYWtPMHMSSD5oEVUtVL_5IaxfCJvU-FchdHiwfxvXMWmA-i3mcEEe9zggag2vUPPIqUwbPVUFNj2hE7UsZbasuIToEMFRZqSB6juc9zv6PEUueQ5hAJCEylTkzMwyBMibrt04TmtZk2w9DfKJR91555s2ZMstX4G_su1_FqQ6p9vgcuLQ6tCtrW77tta-Rw7McF_tyPmvnhQ"};
    const pubKey = KEYUTIL.getKey(orcidCert);
    return KJUR.jws.JWS.verifyJWT(idToken, pubKey, {
      alg: ['RS256'], iss: ["https:\/\/sandbox.orcid.org"] , aud: clientId, gracePeriod: 15*60 //15 mins skew allowed
    });
  }

  // 11/6/2020 brg
  // use OAuth with secret key to access user's public ORCID data
  // orcid_code: six-character code included in redirect after ORCID authentication
  // fetchOrcidOAuth(orcid_code: string) {
  //   const url = "https://sandbox.orcid.org/oauth/token";
  //   const client_id = "APP-EDLUYOOYTPV3RMXO";
  //   const client_secret = "[SEEEEEEECRET]"; // replace with your app's ORCID secret key
  //   let myHeaders = new Headers();
  //   myHeaders.append('Accept', 'application/json');
  //   myHeaders.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
  //   let params = new URLSearchParams();
  //   params.append("client_id", client_id);
  //   params.append("client_secret", client_secret);
  //   params.append("grant_type", "authorization_code");
  //   params.append("code", orcid_code);
  //   params.append("redirect_uri", "http://localhost:3333/");
  //   let options = {
  //     mode: 'no-cors' as RequestMode,
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: params
  //   };
  //   fetch(url, options).then((response) => {
  //     console.log(response);
  //   });
  // }

  render() {
    return (
      <div>
        <data-display annotations={this.annotations} authenticated={this.authenticated}></data-display>
      </div>
    );
  }
}
