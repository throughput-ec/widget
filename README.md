[![lifecycle](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://www.tidyverse.org/lifecycle/#experimental)
[![NSF-1928366](https://img.shields.io/badge/NSF-1928366-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1928366) [![NPM](https://nodei.co/npm/throughput-widget.png)](https://npmjs.org/package/throughput-widget)

# Throughput Annotation Widget

The Throughput Annotation Widget is a lightweight web component that allows web users to view Throughput annotations on a dataset, and to add new annotations after authenticating through [ORCID](https://orcid.org/).

Built with the [Stencil](https://stenciljs.com) toolchain, the widget is easy to integrate into  Vue, React, and Angular applications, or a static HTML webpage.

## Contributors

This project is an open project, and contributions are welcome from any individual.  All contributors to this project are bound by a [code of conduct](CODE_OF_CONDUCT.md).  Please review and follow this code of conduct as part of your contribution.

  * [Shane Loeffler](https://orcid.org/0000-0003-1445-5615) [![orcid](https://img.shields.io/badge/orcid-0000--0003--1445--5615-brightgreen.svg)](https://orcid.org/0000-0003-1445-5615)
  * [Brian Grivna](https://orcid.org/0000-0002-1662-5318) [![orcid](https://img.shields.io/badge/orcid-0000--0002--1662--5318-brightgreen.svg)](https://orcid.org/0000-0002-1662-5318)

### Tips for Contributing

Issues and bug reports are always welcome.  Code clean-up, and feature additions can be done either through pull requests to project forks or branches.

All products of the Throughput Annotation Project are licensed under an [MIT License](LICENSE) unless otherwise noted.

## How to use this repository

### Developing the widget locally

1. Install [npm](https://www.npmjs.com/).
2. Clone the repository and run `npm install` in its root directory.
3. In `src/index.html`, set `identifier`, `link`, `additional-type` properties for the data resource to be annotated. Additionally, set `orcid-client-id`, which is required unless the optional `read-only-mode` property is set to `true`.
4. Run with `npm run start`.
5. View the widget in a browser at `http://localhost:3333`.
6. Hack away and send us pull requests or [issues](https://github.com/throughput-ec/widget/issues)!

### Integrating the widget into an existing application/website

Minimal examples of widget integration into Vue, React, Angular, and static HTML can be found in the [examples directory](https://github.com/throughput-ec/widget/tree/master/examples). All examples use `read-only-mode`.

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

#### `<throughput-widget\>` properties

Once installed, your application will have access to the `<throughput-widget>` component.
It accepts the following properties:

|  property | Required | Description |
| -------- | --------| -----------|
| `identifier` | **Required** |  [re3data](https://www.re3data.org/) identifier for top-level data resource. |
| `link` | **Required** | Identifies a dataset within the top-level data resource. |
| `additional-type` | **Required** | Identifies the data type associated with `link`. |
| `read-only-mode` | Optional bool (def. `false`) | If `true`, the *"Add Annotation"* UI will be hidden. |
| `orcid-client-id` | Required if `read-only-mode=false` | The ORCID client ID to be used for authentication. |
| `use-orcid-sandbox` | Optional bool (def. `false`) | If `false`, use [ORCID production](https://orcid.org) for authentication. If `true`, use [ORCID sandbox](https://sandbox.orcid.org/) |

Databases registered within Throughput use the [re3data](https://www.re3data.org/) identifier as a UID. For example, the Neotoma Paleoecology Database has a re3data landing page at [https://www.re3data.org/repository/r3d100011761](https://www.re3data.org/repository/r3d100011761), and a UID within Throughput of **r3d100011761**.

Within an individual database, individual data elements are identified using both an **identifier**, and an **additional-type**. These are defined by the database themselves.  For example, in a data service that provides access to data at multiple granularity, it might be the case that there is a *collectionunit* with an identifier *1223*, and also a *site* with the same identifier ID.  The use of the additional-type together with the identifier is intended to add flexibility for the data resource in managing and querying annotations.

Vue, React, and Angular each require additional changes to make use of the widget, detailed below.

#### Vue

In `src/main.js`, import the widget and tell Vue to ignore the widget element:

```javascript
import { applyPolyfills, defineCustomElements } from 'throughput-widget/loader';
Vue.config.ignoredElements = ["throughput-widget"];
applyPolyfills().then(() => {
  defineCustomElements();
});
```

The widget will be added to the `.vue` template file, as an HTML element.  Add the widget to your dataset template, and pass in props. Note the Vue-specific syntax for the `link` prop. `this.dsid` is the dataset page's ID.

```html
<throughput-widget
  identifier="[your re3data ID]"
  :link.prop="this.dsid"
  additional-type="[your dataset type]"
  orcid-client-id="[your ORCID client ID]"
/>
```

NOTE:  If the widget is to be run in read-only mode, you can omit the `orcid-client-id`.

#### React

In App.js, import the widget:

```javascript
import { applyPolyfills, defineCustomElements } from 'throughput-widget/loader';
applyPolyfills().then(() => {
  defineCustomElements();
});
```

Add the widget to your dataset template, and pass in props. Note the React-specific syntax for the `link` prop. `dsid` is the dataset page's ID.

```html
<throughput-widget
  identifier="[your re3data ID]"
  link={dsid}
  additional-type="[your dataset type]"
  orcid-client-id="[your ORCID client ID]"
/>
```

#### Angular

In app.module.ts, add `CUSTOM_ELEMENTS_SCHEMA` to the imports from `@angular/core`, then include it in AppModule's `schemas` list. Repeat for other modules that use the widget.

```javascript
// ...
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'; // import CUSTOM_ELEMENTS_SCHEMA

@NgModule({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // add CUSTOM_ELEMENTS_SCHEMA to AppModule and other modules using the widget
})
export class AppModule { }
```

In main.ts, import and call `defineCustomElements()`:

```javascript
// ...
import { defineCustomElements } from 'throughput-widget/loader';

// ...
defineCustomElements();
```

Add the widget to your dataset template, and pass in props. Note the Angular-specific syntax for the `link` prop. `dsid` is the dataset page's ID.

```html
<throughput-widget
  identifier="[your re3data ID]"
  link="{{ dsid }}"
  additional-type="[your dataset type]"
  orcid-client-id="[your ORCID client ID]"
></throughput-widget>
```

#### Static HTML

Add the [imported](#import) `<throughput-widget>` tag to your dataset page(s):

```html
<throughput-widget
  identifier="[your re3data ID]"
  link="[your dataset ID]"
  additional-type="[your dataset type]"
  orcid-client-id="[your ORCID client ID]"
></throughput-widget>
```

### Styling Options
There are several CSS variables available for styling. 

These currently include: 

  ```CSS
  --badge-background-color
  --badge-border-color
  --badge-font-color
  --modal-background-color
  --modal-font-color
  --modal-card-color
  --widget-font-family
  ```
  
 They can be added to your site's CSS like so: 
```css
throughput-widget {
  --badge-background-color: red; 
}
```

### Data Requirements

The widget pulls annotations from the [Throughput Annotation Database](throughputdb.com) using the [Annotation API](throughputdb.com/api-docs/).  Annotations are added by individuals, or through scripted workflows and are searchable using the API.

### Key Outputs

Once a user authenticates through ORCID, the widget can be used to annotate a dataset.  These annotations are maintained on [Throughput](https://throughputdb.com), but can be accessed by any individual.

### Metrics

This project is to be evaluated using the following metrics:

* [COMPLETE](https://www.npmjs.com/package/throughput-widget) -- Active npm registry page.
* Download activity for the `npm` module
* Number of data services using the Throughput widget
* Number of annotations added using the widget
