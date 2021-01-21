import { newE2EPage } from '@stencil/core/testing';

describe('throughput-submit', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<throughput-submit></throughput-submit>');

    const element = await page.find('throughput-submit');
    expect(element).toHaveClass('hydrated');
  });
});
