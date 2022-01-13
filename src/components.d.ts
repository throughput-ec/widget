/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface AnnotationsDisplay {
        "additionalType": string;
        "annotations": any;
        "authenticated": boolean;
        "identifier": string;
        "link": any;
        "orcidClientId": string;
        "orcidName": string;
        "readOnlyMode": boolean;
        "throughputToken": string;
        "useOrcidSandbox": boolean;
    }
    interface DataDisplay {
        "additionalType": string;
        "annotations": any;
        "authenticated": boolean;
        "identifier": string;
        "link": any;
        "orcidClientId": string;
        "orcidName": string;
        "readOnlyMode": boolean;
        "throughputToken": string;
        "useOrcidSandbox": boolean;
    }
    interface OrcidConnect {
        "authenticated": boolean;
        "orcidClientId": string;
        "orcidName": string;
        "useOrcidSandbox": boolean;
    }
    interface ThroughputWidget {
        "additionalType": string;
        "identifier": string;
        "link": any;
        "orcidClientId": string;
        "readOnlyMode": boolean;
        "useOrcidSandbox": boolean;
    }
}
declare global {
    interface HTMLAnnotationsDisplayElement extends Components.AnnotationsDisplay, HTMLStencilElement {
    }
    var HTMLAnnotationsDisplayElement: {
        prototype: HTMLAnnotationsDisplayElement;
        new (): HTMLAnnotationsDisplayElement;
    };
    interface HTMLDataDisplayElement extends Components.DataDisplay, HTMLStencilElement {
    }
    var HTMLDataDisplayElement: {
        prototype: HTMLDataDisplayElement;
        new (): HTMLDataDisplayElement;
    };
    interface HTMLOrcidConnectElement extends Components.OrcidConnect, HTMLStencilElement {
    }
    var HTMLOrcidConnectElement: {
        prototype: HTMLOrcidConnectElement;
        new (): HTMLOrcidConnectElement;
    };
    interface HTMLThroughputWidgetElement extends Components.ThroughputWidget, HTMLStencilElement {
    }
    var HTMLThroughputWidgetElement: {
        prototype: HTMLThroughputWidgetElement;
        new (): HTMLThroughputWidgetElement;
    };
    interface HTMLElementTagNameMap {
        "annotations-display": HTMLAnnotationsDisplayElement;
        "data-display": HTMLDataDisplayElement;
        "orcid-connect": HTMLOrcidConnectElement;
        "throughput-widget": HTMLThroughputWidgetElement;
    }
}
declare namespace LocalJSX {
    interface AnnotationsDisplay {
        "additionalType"?: string;
        "annotations"?: any;
        "authenticated"?: boolean;
        "identifier"?: string;
        "link"?: any;
        "onAnnotationAdded"?: (event: CustomEvent<void>) => void;
        "onCheckAuth"?: (event: CustomEvent<void>) => void;
        "orcidClientId"?: string;
        "orcidName"?: string;
        "readOnlyMode"?: boolean;
        "throughputToken"?: string;
        "useOrcidSandbox"?: boolean;
    }
    interface DataDisplay {
        "additionalType"?: string;
        "annotations"?: any;
        "authenticated"?: boolean;
        "identifier"?: string;
        "link"?: any;
        "orcidClientId"?: string;
        "orcidName"?: string;
        "readOnlyMode"?: boolean;
        "throughputToken"?: string;
        "useOrcidSandbox"?: boolean;
    }
    interface OrcidConnect {
        "authenticated"?: boolean;
        "onOrcidLogout"?: (event: CustomEvent<void>) => void;
        "orcidClientId"?: string;
        "orcidName"?: string;
        "useOrcidSandbox"?: boolean;
    }
    interface ThroughputWidget {
        "additionalType"?: string;
        "identifier"?: string;
        "link"?: any;
        "orcidClientId"?: string;
        "readOnlyMode"?: boolean;
        "useOrcidSandbox"?: boolean;
    }
    interface IntrinsicElements {
        "annotations-display": AnnotationsDisplay;
        "data-display": DataDisplay;
        "orcid-connect": OrcidConnect;
        "throughput-widget": ThroughputWidget;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "annotations-display": LocalJSX.AnnotationsDisplay & JSXBase.HTMLAttributes<HTMLAnnotationsDisplayElement>;
            "data-display": LocalJSX.DataDisplay & JSXBase.HTMLAttributes<HTMLDataDisplayElement>;
            "orcid-connect": LocalJSX.OrcidConnect & JSXBase.HTMLAttributes<HTMLOrcidConnectElement>;
            "throughput-widget": LocalJSX.ThroughputWidget & JSXBase.HTMLAttributes<HTMLThroughputWidgetElement>;
        }
    }
}
