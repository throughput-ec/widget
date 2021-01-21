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

Minimal examples of widget integration into Vue, React, Angular, and static HTML can be found in the [examples directory](https://github.com/throughput-ec/widget/tree/orcid/examples).

#### Add the widget to a Vue app:
Install the widget with npm:

`npm install throughput-widget`

In main.js, import the widget and tell Vue to ignore the widget element:

```
import { applyPolyfills, defineCustomElements } from 'throughput-widget/loader';
Vue.config.ignoredElements = ["throughput-widget"];
applyPolyfills().then(() => {
  defineCustomElements();
});
```

Add the widget to your dataset template, and pass in props. Note the Vue-specific syntax for the `link` prop. `this.dsid` is the dataset page's ID.

`<throughput-widget identifier="r3d100011761" level="site" :link.prop="this.dsid" />`

#### Add the widget to a React app:
Install the widget with npm:

`npm install throughput-widget`

In App.js, import the widget:
```
import { applyPolyfills, defineCustomElements } from 'throughput-widget/loader';
applyPolyfills().then(() => {
  defineCustomElements();
});
```

Add the widget to your dataset template, and pass in props. Note the React-specific syntax for the `link` prop. `dsid` is the dataset page's ID.

`<throughput-widget identifier="r3d100011761" level="site" link={dsid} />`

#### Add the widget to an Angular app:

In app.module.ts, add `CUSTOM_ELEMENTS_SCHEMA` to the imports from `@angular/core`,
then include it in AppModule's `schemas` list. Repeat for other modules that use the widget.

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

`<throughput-widget identifier="r3d100011761" level="site" link="{{ dsid }}"></throughput-widget>`

#### Add the widget to a static HTML page:
Import the widget with a script tag:

`<script type="module" src="https://unpkg.com/throughput-widget/dist/throughputwidget/throughputwidget.esm.js"></script>`

Add the widget to your dataset page(s):

`<throughput-widget identifier="r3d100011761" level="site" link="[your dataset ID]"></throughput-widget>`

#### \<throughput-widget\> properties
- identifier: ID for top-level resource e.g. Neotoma.
- link: ID for dataset within top-level resource.
- level: Default: 'site'.
- element: Type of database entity to display. Default: 'annotation'.
- read-only-mode: View existing annotations only. 'true' or 'false'.

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
