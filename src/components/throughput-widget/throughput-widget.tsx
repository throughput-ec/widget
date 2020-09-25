import { Component, h, Prop, State, Listen } from "@stencil/core";

@Component({
  tag: "throughput-widget",
  styleUrl: "throughput-widget.css",
  shadow: true,
})
export class ThroughputWidget {
  //defaults for dev work
  @Prop() identifier: string = "r3d100011761"; //specifies a resource eg Neotoma
  @Prop() level: string = "site"; //specifies a dataset type eg site, core, etc
  @Prop() link: any = 13971; //specifies the specific dataset

  @State() annotations: Array<object>;

  componentWillLoad() {
    console.log(this.level, this.link, this.identifier);
    if (this.identifier) {
      console.log(this.identifier);
      let url =
        "http://throughputdb.com/api/db/annotations?id=" +
        this.identifier +
        "&link=" +
        this.link +
        "&level=" +
        this.level;
      fetch(url).then((response) => {
        response.json().then((json) => {
          console.log(json);
          this.annotations = json.data;
        });
      });
    }
  }

  render() {
    return <data-display annotations={this.annotations}></data-display>;
  }
}
