import { Component, h, Prop, State, Listen } from "@stencil/core";

@Component({
  tag: "throughput-widget",
  styleUrl: "throughput-widget.css",
  shadow: true,
})
export class ThroughputWidget {
  @Prop() identifier: string;
  @Prop() level: string;
  @Prop() link: any;

  @State() open: boolean;
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
