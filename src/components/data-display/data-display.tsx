import { Component, h, State, Listen } from "@stencil/core";
import state from "../../store";

@Component({
  tag: "data-display",
  styleUrl: "data-display.css",
  assetsDirs: ["assets"],
  shadow: true,
})
export class DataDisplay {
  @State() open: boolean = false; // is overlay being displayed?

  componentWillLoad() {
    console.log("data-display componentWillLoad(): authenticated =", state.authenticated);
    this.open = state.authenticated;
  }

  @Listen("click")
  handleClick(ev) {
    if (
      !this.open ||
      (this.open &&
        ev.composedPath().length > 0 &&
        ev.composedPath()[0].id == "close_x")
    ) {
      this.open = !this.open;
    }
  }

  render() {
    return (
      <div class="badge">
        <div class="summary">
          {state.annotationCount > 0 ? state.annotationCount : "No"}{" "}
          Annotation(s) Found
        </div>
        <div class="helptext">Click to add
          {state.annotationCount > 0 ? " or display" : ""}
        </div>

        {this.open ? (
          <annotations-display></annotations-display>
        ) : null}
      </div>
    );
  }
}
