import { Component, Prop, h, getAssetPath } from "@stencil/core";

@Component({
  tag: "annotations-display",
  styleUrl: "annotations-display.css",
  assetsDirs: ['assets'],
  shadow: true,
})

export class AnnotationsDisplay {
  @Prop() annotations: any = [];

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
          <orcid-connect></orcid-connect>
          <div class="body">
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
