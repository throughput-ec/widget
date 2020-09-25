import { newSpecPage } from '@stencil/core/testing';
import { ThroughputSubmit } from '../throughput-submit';

describe('throughput-submit', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ThroughputSubmit],
      html: `<throughput-submit></throughput-submit>`,
    });
    expect(page.root).toEqualHtml(`
      <throughput-submit>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </throughput-submit>
    `);
  });
});
