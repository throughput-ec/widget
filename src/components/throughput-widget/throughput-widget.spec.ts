import { newSpecPage } from "@stencil/core/testing";
import { ThroughputWidget } from "./throughput-widget";

describe("throughput-widget", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [ThroughputWidget],
      html: "<throughput-widget></throughput-widget>",
    });
    expect(root).toEqualHtml(`
      <throughput-widget>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </throughput-widget>
    `);
  });

  it("renders with values", async () => {
    const { root } = await newSpecPage({
      components: [ThroughputWidget],
      html: `<throughput-widget first="Stencil" last="'Don't call me a framework' JS"></throughput-widget>`,
    });
    expect(root).toEqualHtml(`
      <throughput-widget first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </throughput-widget>
    `);
  });
});
