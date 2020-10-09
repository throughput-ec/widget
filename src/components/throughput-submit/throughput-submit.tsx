import { Component, h } from "@stencil/core";

@Component({
  tag: "throughput-submit",
  styleUrl: "throughput-submit.css",
  shadow: true,
})
export class ThroughputSubmit {
  handleClick() {
    console.log("clicks");
    console.log(window.location.href);
    window.location.href =
      "https://orcid.org/oauth/authorize?client_id=APP-STQ2Q8H8Q8FRIX7N&response_type=code&scope=openid&redirect_uri=" +
      window.location.href;
  }

  render() {
    return <button onClick={this.handleClick}>tesst</button>;
  }
}
