import { Component, h } from "@stencil/core";

@Component({
  tag: "about-throughput",
  styleUrl: "about-throughput.css",
  shadow: true,
})

export class AboutThroughput {
  render() {
    return (
      <div class="about_area">
        <div class="closeContainer">
          <a id="close_about_x" class="close" />
        </div>
        <div class="header">
          About Throughput
        </div>
        <div class="body">
          <p>
            The <a href="https://throughputdb.com" target="_blank">Throughput Annotation Database</a> links research
            objects across the web, including data resources -- research databases and datasets -- to
            code repositories, such as those on <a href="https://github.com" target="_blank">github.com</a>.
          </p>
          <p>
            Throughput serves to make tacit knowledge explicit, and supports equity in data sharing.            
          </p>
        </div>
      </div>
    );
  }
}
