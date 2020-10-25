import { Component, Prop, h, getAssetPath } from "@stencil/core";

@Component({
  tag: "annotations-display",
  styleUrl: "annotations-display.css",
  assetsDirs: ['assets'],
  shadow: true,
})

export class AnnotationsDisplay {
  @Prop() annotations: any = [];

  render() {
    return (
      <div class="overlay">
        <div class="annotations">
          <div class="header">
            <img src={getAssetPath('./assets/throughput.png')} />
            <img src={getAssetPath('./assets/nsf.png')} />
            <img src={getAssetPath('./assets/earthcube.png')} />
            ALL THE ANNOTATIONS!!!
            <div id="magic_x" class="close_x">X</div>
          </div>
          <div class="body">
            {this.annotations.map((annotation) => (
              <div class="annotation_item">{
                annotation.author}<br/>{annotation.date}<br/>{annotation.annotation}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
