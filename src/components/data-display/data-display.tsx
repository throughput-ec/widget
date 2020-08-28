import { Component, Prop, h, Watch, State, Listen } from "@stencil/core";

@Component({
  tag: "data-display",
  styleUrl: "data-display.css",
  shadow: true,
})
export class DataDisplay {
  @Prop() annotations: any = [];

  @State() open: boolean = false;

  @Listen("click")
  handleClick(e) {
    console.log("click");
    this.open = !this.open;
  }

  @Watch("annotations")
  watchHandler(newValue, oldValue) {
    console.log(newValue, oldValue);
  }

  render() {
    return this.annotations.map((annotation) => (
      <div>
        Annotations ({this.annotations.length})
        {this.open ? (
          <div class="annotation">{annotation.annotation}</div>
        ) : null}
      </div>
    ));
  }
}
