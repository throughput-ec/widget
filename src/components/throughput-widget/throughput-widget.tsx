import { Component, h, Prop, State } from "@stencil/core";

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

  componentWillLoad() {
    console.log(this.level, this.link, this.identifier);
    if (this.identifier) {
      console.log(this.identifier);
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

  render() {
    return (
      <div>
        <data-display annotations={this.annotations}></data-display>
      </div>
    );
  }
}
