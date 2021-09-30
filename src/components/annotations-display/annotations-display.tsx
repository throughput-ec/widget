import { Component, Prop, h, Listen } from "@stencil/core";

@Component({
  tag: "annotations-display",
  styleUrl: "annotations-display.css",
  assetsDirs: ["assets"],
  shadow: true,
})
export class AnnotationsDisplay {
  @Prop() authenticated: boolean = false;
  @Prop() addAnnotation: boolean = false; // show add annotation UI
  @Prop() identifier: string;
  @Prop() additionalType: string;
  @Prop() link: any;
  @Prop() throughputToken: string = null;
  @Prop() readOnlyMode: boolean = true;
  @Prop() orcidClientId: string;
  @Prop() useOrcidSandbox: boolean;
  @Prop() annotations: any = [];
  @Prop() annotationText: string;
  DEFAULT_ANNOTATION_TEXT: string = "Enter your annotation here.";

  @Listen("click")
  async handleClick(ev) {
    const clicked_id = ev.composedPath()[0].id;
    switch (clicked_id) {
      case "add_button":
        this.addAnnotation = true;
        break;
      case "submit_button":
        console.log("Submit clicked");
        var success = await this.submitAnnotation();
        this.addAnnotation = !success; // close add annotation UI if submit succeeds
        break;
      case "cancel_button":
        this.addAnnotation = false;
        break;
      case "close_x":
        // Ignore close_x here, it's handled in DataDisplay.handleClick(), which
        // is called after this.handleClick(). Otherwise we hit default below.
        break;
      default:
        console.error("Unhandled click, id = ", clicked_id);
    }
  }

  updateAnnotationText(event) {
    this.annotationText = event.target.value;
  }

  // If text box contains default text, clear it on click.
  clearDefaultAnnotationText(event) {
    if (event.target.value === this.DEFAULT_ANNOTATION_TEXT) {
      event.target.value = '';
    }
  }

  // POST new annotation to Throughput
  async submitAnnotation() {
    console.log("Submitting annotation text: ", this.annotationText);
    const annotation = {
      dbid: this.identifier,
      additionalType: this.additionalType,
      id: this.link,
      body: this.annotationText,
    };
    const url = "https://throughputdb.com/api/widget/";
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': this.throughputToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(annotation)
    })
    const json_thing = await response.json();
    console.log(json_thing);
    const success = json_thing.status && json_thing.status === "success";
    if (!success) {
      const errmsg = "Submit annotation failed: " + (json_thing.message ? json_thing.message : "[no message provided]");
      console.error(errmsg);
      alert(errmsg);
    }
    return success;
  }

  getFormattedDate(date) {
    const properDate = new Date(date);
    return (
      properDate.getMonth() +
      1 +
      "/" +
      properDate.getDate() +
      "/" +
      properDate.getFullYear()
    );
  }

  render() {
    return (
      <div class="overlay">
        <div class="annotation_list">
          <div class="closeContainer">
            {/* <div id="close_x" class="close" /> */}
            {/* brg 2/18/2021 Removing the href='#' to avoid appending '#' to window.location.href
              when annotations-display is opened. Otherwise we have to chop it off when we pass
              window.location.href as our redirect_uri when opening the ORCID auth page. Unsure if
              this is the "right way" to do this or not. The above <div> tag also seems to work right.
            <a href="#" id="close_x" class="close" /> */}
            <a id="close_x" class="close" />
          </div>
          <div class="header">
            {/* <img
              src="https://raw.githubusercontent.com/throughput-ec/throughput-ec.github.io/master/resources/throughput.png"
              height="100"
              width="222"
            /> */}
            Throughput Annotations
          </div>
          <div class="body">
            {!this.readOnlyMode ? (
              !this.authenticated ? (
                <orcid-connect
                  orcidClientId={this.orcidClientId}
                  useOrcidSandbox={this.useOrcidSandbox}
                />
              ) : !this.addAnnotation ? (
                <button id="add_button" class="add_button">
                  + Add Annotation
                </button>
              ) : (
                <div>
                  <textarea
                    onInput={(event) => this.updateAnnotationText(event)}
                    onFocus={(event) => this.clearDefaultAnnotationText(event)}
                  >
                    {this.DEFAULT_ANNOTATION_TEXT}
                  </textarea>
                  <button id="submit_button" class="add_button">
                    Submit
                  </button>
                  <button id="cancel_button" class="cancel_button">
                    Cancel
                  </button>
                </div>
              )
            ) : null}
            {this.annotations.map((annotation) => (
              <div class="annotation_item">
                {annotation.annotation}
                <div class="annotation_metadata">
                  <div class="annotation_author">{annotation.annotationauthor ? annotation.annotationauthor : "[null author]"}</div>
                  <div class="orcidLink">
                    <a
                      href={"https://orcid.org/" + annotation.orcid}
                      target="_blank"
                    >
                      <img
                        id="orcid-id-icon"
                        src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
                        width="14"
                        height="14"
                        alt="ORCID iD icon"
                      />
                    </a>
                  </div>
                  <div class="annotation_author">
                    ({this.getFormattedDate(annotation.date)}){" "}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
