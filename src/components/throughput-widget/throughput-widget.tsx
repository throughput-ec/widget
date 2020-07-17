import { Component, Prop, h } from "@stencil/core";
// import { DataDisplay } from "../data-display/data-display";
// import { format } from "../../utils/utils";

@Component({
  tag: "throughput-widget",
  styleUrl: "throughput-widget.css",
  shadow: true,
})
export class ThroughputWidget {
  dataHolder: string = "";
  componentWillLoad() {
    const inputs = Array.from(document.getElementsByTagName("script"));
    for (let script of inputs) {
      if (script.type.toLowerCase() == "application/ld+json") {
        console.log(script.type.toLowerCase());
        try {
          this.dataHolder = script.innerHTML;
          console.log(this.dataHolder);
        } catch (e) {
          if (e instanceof SyntaxError) {
            console.error(e);
          } else {
            console.error(e);
          }
        }
      }
    }
    // console.log(obj);
  }

  render() {
    return <data-display data={this.dataHolder}></data-display>;
  }
}
