[![lifecycle](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://www.tidyverse.org/lifecycle/#experimental)
[![NSF-1928366](https://img.shields.io/badge/NSF-1928366-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1928366)

# Throughput Annotation Widget

The Throughput Annotation Widget is a lightweight web component that allows web users to view Throughput annotations on a dataset, and to add new annotations after authenticating through [ORCID](https://orcid.org/).

Built with the [Stencil](https://stenciljs.com) toolchain, the widget is easy to integrate into  Vue, React, and Angular applications, or a static HTML webpage.

## Contributors

This project is an open project, and contributions are welcome from any individual.  All contributors to this project are bound by a [code of conduct](CODE_OF_CONDUCT.md).  Please review and follow this code of conduct as part of your contribution.

  * [Shane Loeffler](https://orcid.org/0000-0003-1445-5615) [![orcid](https://img.shields.io/badge/orcid-0000--0003--1445--5615-brightgreen.svg)](https://orcid.org/0000-0003-1445-5615)
  * [Brian Grivna](https://orcid.org/0000-0002-1662-5318) [![orcid](https://img.shields.io/badge/orcid-0000--0002--1662--5318-brightgreen.svg)](https://orcid.org/0000-0002-1662-5318)

### Tips for Contributing

Issues and bug reports are always welcome.  Code clean-up, and feature additions can be done either through pull requests to [project forks]() or branches.

All products of the Throughput Annotation Project are licensed under an [MIT License](LICENSE) unless otherwise noted.

## How to use this repository

### Developing the widget locally
Install [npm](https://www.npmjs.com/).\
Clone the repository and run `npm install` in its root directory.\
In `index.html`, add `identifier`, `link`, `additional-type`, and `token` (or set `read-only-mode` to `false`) properties.\
Run with `npm run start`.\
View the widget in a browser at `http://localhost:3333`.\
Hack away and send us pull requests!

### Integrating the widget into an existing application/website
Minimal examples of widget integration into Vue, React, Angular, and static HTML can be found in the [examples directory](https://github.com/throughput-ec/widget/tree/master/examples).

#### Register with ORCID
*If you plan to use the widget in* `read-only-mode`, *skip this step.*

To add annotations, widget users must first authenticate through ORCID. We encourage devs to [register for the public ORCID API](https://info.orcid.org/documentation/integration-guide/registering-a-public-api-client/#easy-faq-2606 ) so they can freely manage post-authentication redirects for their site.

Separate registrations are required for the [ORCID production](https://orcid.org) and [ORCID sandbox](https://sandbox.orcid.org) sites.

Once registered, an ORCID Client ID (e.g. APP-1234567890ABCDEF) will be provided. This is passed to the widget in the `orcid-client-id` property, described below.

#### Install the widget

For Vue, React, and Angular applications, install the widget with [npm](https://www.npmjs.com/):

`npm install throughput-widget`

<a name="import"></a>For static HTML pages, import the widget with the following tag:

```
<script type="module" src="https://unpkg.com/throughput-widget/dist/throughputwidget/throughputwidget.esm.js"></script>
```

Vue, React, and Angular can use this tag as an alternative to npm.

#### \<throughput-widget\> properties
Once installed, your application will have access to the `<throughput-widget>` component.
It accepts the following properties:

- `identifier` Required. [re3data](https://www.re3data.org/) identifier for top-level data resource.
- `link` Required. Identifies a dataset within the top-level data resource.
- `additional-type` Required. Identifies the data type associated with `link`.
- `read-only-mode` Optional, boolean, default `false`. If `true`, add annotation UI will be hidden.
- `orcid-client-id` Required if `read-only-mode` is `false`. The ORCID client ID to be used for authentication.
- `use-orcid-sandbox` Optional, boolean, default `false`. If `false`, use [ORCID production](https://orcid.org) for authentication. If `true`, use [ORCID sandbox](https://sandbox.orcid.org/).
- `token` Required if `read-only-mode` is `false`. Throughput-provided secret. Required to add annotations.

Vue, React, and Angular each require additional changes to make use of the widget, detailed below.

#### Vue

In main.js, import the widget and tell Vue to ignore the widget element:

```
import { applyPolyfills, defineCustomElements } from 'throughput-widget/loader';
Vue.config.ignoredElements = ["throughput-widget"];
applyPolyfills().then(() => {
  defineCustomElements();
});
```

Add the widget to your dataset template, and pass in props. Note the Vue-specific syntax for the `link` prop. `this.dsid` is the dataset page's ID.

```
<throughput-widget
  identifier="[your re3data ID]"
  :link.prop="this.dsid"
  additional-type="[your dataset type]"
  orcid-client-id="[your ORCID client ID]"
  token="[your token]"
/>
```

#### React

In App.js, import the widget:
```
import { applyPolyfills, defineCustomElements } from 'throughput-widget/loader';
applyPolyfills().then(() => {
  defineCustomElements();
});
```

Add the widget to your dataset template, and pass in props. Note the React-specific syntax for the `link` prop. `dsid` is the dataset page's ID.

```
<throughput-widget
  identifier="[your re3data ID]"
  link={dsid}
  additional-type="[your dataset type]"
  orcid-client-id="[your ORCID client ID]"
  token="[your token]"
/>
```

#### Angular

In app.module.ts, add `CUSTOM_ELEMENTS_SCHEMA` to the imports from `@angular/core`, then include it in AppModule's `schemas` list. Repeat for other modules that use the widget.

```
// ...
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'; // import CUSTOM_ELEMENTS_SCHEMA

@NgModule({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // add CUSTOM_ELEMENTS_SCHEMA to AppModule and other modules using the widget
})
export class AppModule { }
```

In main.ts, import and call `defineCustomElements()`:

```
// ...
import { defineCustomElements } from 'throughput-widget/loader';

// ...
defineCustomElements();
```

Add the widget to your dataset template, and pass in props. Note the Angular-specific syntax for the `link` prop. `dsid` is the dataset page's ID.

```
<throughput-widget
  identifier="[your re3data ID]"
  link="{{ dsid }}"
  additional-type="[your dataset type]"
  orcid-client-id="[your ORCID client ID]"
  token="[your token]"
></throughput-widget>
```

#### Static HTML

Add the [imported](#import) `<throughput-widget>` tag to your dataset page(s):

```
<throughput-widget
  identifier="[your re3data ID]"
  link="[your dataset ID]"
  additional-type="[your dataset type]"
  orcid-client-id="[your ORCID client ID]"
  token="[your token]"
></throughput-widget>
```

### Workflow Overview
[in progress]

### System Requirements

This project is developed with [Stencil](https://stenciljs.com).

### Data Requirements

The widget pulls annotations from throughputdb.com.

### Key Outputs

Once a user authenticates through ORCID, the widget can be used to annotate a dataset.
These annotations are maintained on throughputdb.com.

### Metrics

This project is to be evaluated using the following metrics...
