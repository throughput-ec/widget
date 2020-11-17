import { Component, Prop, h, getAssetPath, Listen } from "@stencil/core";

@Component({
  tag: "annotations-display",
  styleUrl: "annotations-display.css",
  assetsDirs: ['assets'],
  shadow: true,
})

export class AnnotationsDisplay {
  @Prop() annotations: any = [];
  @Prop() authenticated: boolean = false;
  @Prop() addAnnotation: boolean = false;

  @Listen("click")
  handleClick(ev) {
    if (ev.composedPath()[0].id == "add_button") {
      this.addAnnotation = true;
    } else if (ev.composedPath()[0].id == "submit_button") {
      // TODO: submit
      this.addAnnotation = false;
    } else if (ev.composedPath()[0].id == "cancel_button") {
      this.addAnnotation = false;
    }
  }

  // todo: if authenticated, replace orcid-connect with "Authenticated as [user]"?
  render() {
    return (
      <div class="overlay">
        <div class="annotation_list">
          <div class="header">
            <img src={getAssetPath('./assets/throughput.png')} />
            <img src={getAssetPath('./assets/nsf.png')} />
            <img src={getAssetPath('./assets/earthcube.png')} />
            List of Annotations
            <img id="close_x" class="close_x" height="32" width="32" src={getAssetPath('./assets/close_x.png')} />
          </div>
          <div class="body">
            { !this.authenticated ? <orcid-connect /> :
              !this.addAnnotation ?
                <button id="add_button" class="add_button">+ Add Annotation</button> :
                <div>
                <textarea>Add your neato annotation here!</textarea>
                <button id="submit_button" class="add_button">Submit</button>
                <button id="cancel_button" class="cancel_button">Cancel</button>
                </div>
            }
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
