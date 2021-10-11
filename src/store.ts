import { createStore } from "@stencil/store";

const { state, onChange } = createStore({
    annotations: [], // list of annotations for identifier/additionalType/link params
    annotationCount: 0, // count of annotations for use in data-display
    getAnnotations: null, // throughput-widget getAnnotations() f'n
    authenticated: false, // are we authenticated through ORCID and Throughput?
    identifier: null, // re3 identifier for a top-level resource like Neotoma
    additionalType: null, // dataset type within resource
    link: null, // resource-specific dataset identifier
    orcidName: null, // if authenticated, user's ORCID name
    throughputToken: null, // Throughput authentication token
    readOnlyMode: false, // if true, hide ORCID login and add annotation UI elements
    orcidClientId: null, // ORCID API key; required if readOnlyMode = false
    useOrcidSandbox: false // use sandbox.orcid.org if true, else orcid.org (production)
});

onChange('annotations', value => {
    state.annotationCount = value.length;
});

export default state;
