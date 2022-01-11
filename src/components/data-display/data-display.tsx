import { Component, h, Prop, State, Listen } from "@stencil/core";

@Component({
  tag: "data-display",
  styleUrl: "data-display.css",
  assetsDirs: ["assets"],
  shadow: true,
})
export class DataDisplay {
  @Prop() annotations: any = [];
  @Prop() authenticated: boolean = false;
  @Prop() orcidName: string;
  @Prop() throughputToken: string = null;
  @Prop() identifier: string;
  @Prop() additionalType: string;
  @Prop() link: any;
  @Prop() readOnlyMode: boolean;
  @Prop() orcidClientId: string;
  @Prop() useOrcidSandbox: boolean;  

  @State() open: boolean = false; // is overlay being displayed?

  @Listen("click")
  handleClick(ev) {
    if (this.annotations.length === 0 && this.readOnlyMode) {
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
    if (this.annotations.length == 0) {
      text = "No Annotations";
    } else if (this.annotations.length == 1) {
      text = "1 Annotation";
    } else {
      text = this.annotations.length + " Annotations";
    }
    return text;
  }

  getHelpText() {
    let text = null;
    if (this.readOnlyMode) {
      text = this.annotations.length > 0 ? "Click to view" : "";
    } else {
      text = this.annotations.length > 0 ? "Click to view or add" : "Click to add";
    }
    return text;
  }

  render() {
    return (
      <div class="badge" title-="Throughput Annotation Widget. Learn more at throughputdb.com">
        <div class='throughput-logo'>
          <img
            src="https://github.com/throughput-ec/widget/blob/master/figures/TPlogo_small.png?raw=true"
            title="Throughput"
          />
        </div>
        <div class="summary-container">
          <div class="summary">{this.getCountText()}</div>
        <div class="helptext">{this.getHelpText()}</div>
        </div>
        
        {this.open ? (
          <annotations-display
            annotations={this.annotations}
            authenticated={this.authenticated}
            orcidName={this.orcidName}
            throughputToken={this.throughputToken}
            identifier={this.identifier}
            additionalType={this.additionalType}
            link={this.link}
            readOnlyMode={this.readOnlyMode}
            orcidClientId={this.orcidClientId}
            useOrcidSandbox={this.useOrcidSandbox}
          ></annotations-display>
        ) : null}
      </div>
    );
  }
}
