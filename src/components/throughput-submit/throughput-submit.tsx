import { Component, h } from "@stencil/core";

@Component({
  tag: "throughput-submit",
  styleUrl: "throughput-submit.css",
  shadow: true,
})
export class ThroughputSubmit {
  handleClick() {
    console.log("clicks");
  }
  url: string =
    "https://orcid.org/signin?oauth&response_type=token&redirect_uri=https://orcid.github.io/orcid-auth-widget/widget.html&client_id=APP-34IBF14LOTOGDJZZ&scope=openid%20/activities/update";
  render() {
    return <button onClick={this.handleClick}>tesst</button>;
  }
}
