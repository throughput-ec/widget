import { Component, h } from "@stencil/core";

@Component({
  tag: "about-throughput",
  styleUrl: "about-throughput.css",
  shadow: true,
})

export class AboutThroughput {
  render() {
    const aboutText = "Throughput links data resources, such as research databases, to code repositories, such as those on github.com that reference those data resources.";
    return (
      <div class="about_area">
        <div class="closeContainer">
          <a id="close_about_x" class="close" />
        </div>
        <div class="header">
          About Throughput
        </div>
        <div class="body">
          <p>{aboutText}</p>
          <p>Learn more at <a href="https://throughputdb.com/about" target="_blank">throughputdb.com</a>.</p>
        </div>
      </div>
    );
  }
}
