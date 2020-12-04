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

  @Listen("click")
  handleClick(ev) {
    if (ev.composedPath()[0].id == "add_button") {
      this.addAnnotation = true;
    } else if (ev.composedPath()[0].id == "submit_button") {
      console.log("Submit clicked");
      this.submitAnnotation();
      this.addAnnotation = false;
    } else if (ev.composedPath()[0].id == "cancel_button") {
      this.addAnnotation = false;
    }
  }

  updateAnnotationText(event) {
    this.annotationText = event.target.value;
  }

  submitAnnotation() {
    console.log("Annotation text = ", this.annotationText);
    // TODO: submit annotation to Throughput
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
                  >
                    Add your annotation here.
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
                <div class="annotation_author">{annotation.author}</div>
                <div class="annotation_metadata">{annotation.date}</div>
                {annotation.annotation}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
