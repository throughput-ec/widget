import { Component, Prop, h, Watch } from "@stencil/core";

@Component({
  tag: "data-display",
  styleUrl: "data-display.css",
  shadow: false,
})
export class DataDisplay {
  @Prop({}) data: string;
  @Watch("data")
  watchHandler(newValue, oldValue) {
    console.log(newValue, oldValue);
  }
  private getText(): string {
    return JSON.parse(this.data)["@context"]["@vocab"];
  }

  render() {
    return <div>{this.getText()}</div>;
  }
}
