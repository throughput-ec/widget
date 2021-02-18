import { Component, Prop, h, Listen } from "@stencil/core";

@Component({
  tag: "annotations-display",
  styleUrl: "annotations-display.css",
  assetsDirs: ["assets"],
  shadow: true,
})
export class AnnotationsDisplay {
  @Prop() authenticated: boolean = false;
  @Prop() addAnnotation: boolean = false;
  @Prop() readOnlyMode: boolean = true;
  @Prop() annotations: any = [];
  @Prop() annotationText: string;
  DEFAULT_ANNOTATION_TEXT: string = "Add your annotation here.";

  @Listen("click")
  handleClick(ev) {
    if (ev.composedPath()[0].id == "add_button") {
      this.addAnnotation = true;
    } else if (ev.composedPath()[0].id == "submit_button") {
      console.log("Submit clicked");
      this.submitAnnotation();
      this.addAnnotation = false; // TODO: only close if submit successful?
    } else if (ev.composedPath()[0].id == "cancel_button") {
      this.addAnnotation = false;
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

  submitAnnotation() {
    console.log("Submitting annotation text: ", this.annotationText);
    // POST new annotation to Throughput
    // TODO: remove hard-codings
    const annotation = {
      dbid: "r3d100011761", // hard-code (Neotoma)
      orcid: "0000-0002-6229-7677", // hard-code
      additionalType: "site", // hard-code
      id: 1113, // hard-code
      body: this.annotationText,
      token: "[CCDR-specific token...don't post in public repo!]" // TODO: retrieve from environment variable
    };
    const url = "https://throughputdb.com/api/widget/";
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(annotation)
    }).then((response) => {
      response.json().then((json) => {
        console.log(json);
        const success = json.status && json.status === "success"; // TODO: how to return success var from submitAnnotation?
        if (!success) {
          const errmsg = "Submit annotation failed: " + (json.message ? json.message : "[no message provided]");
          console.error(errmsg);
          alert(errmsg);
        }
      });
    });
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
            <a href="#" id="close_x" class="close" />
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
                <orcid-connect />
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
                  <div class="annotation_author">{annotation.author}</div>
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
