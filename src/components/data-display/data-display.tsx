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

  @Listen("click")
  handleClick(ev) {
    if (state.annotationCount === 0 && state.readOnlyMode) {
      return;
    }
    if (
      !this.open ||
      (this.open &&
        ev.composedPath().length > 0 &&
        ev.composedPath()[0].id == "close_x")
    ) {
      this.open = !this.open;
    }
  }

  getCountText() {
    let text = null;
    if (state.annotationCount == 0) {
      text = "No Annotations";
    } else if (state.annotationCount == 1) {
      text = "1 Annotation";
    } else {
      text = state.annotationCount + " Annotations";
    }
    return text;
  }

  getHelpText() {
    let text = null;
    if (state.readOnlyMode) {
      text = state.annotationCount > 0 ? "Click to view" : "";
    } else {
      text =
        state.annotationCount > 0 ? "Click to view or add" : "Click to add";
    }
    return text;
  }

  render() {
    return (
      <div class="badge" title-="Throughput Annotation Widget. Learn more at throughputdb.com">
        <div class='throughput-logo'>
          <img
            src="https://github.com/throughput-ec/widget/blob/qol/figures/TPlogo_small.png?raw=true"
            title="Throughput"
          />
        </div>
        <div class="summary-container">
          <div class="summary">{this.getCountText()}</div>
        <div class="helptext">{this.getHelpText()}</div>
        </div>
        
        {this.open ? <annotations-display></annotations-display> : null}
      </div>
    );
  }
}
