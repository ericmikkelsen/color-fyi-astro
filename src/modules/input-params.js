class InputParams extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.input = this.querySelector("input,textarea");
        this.setupInput();
    }
    setupInput() {
        // set input to have value from params
        const url = new URL(window.location.href);
        const paramValue = url.searchParams.get(this.input.name) || false;
        if (paramValue) {
            this.input.value = paramValue;
        }

        // update param on input
        this.input.addEventListener("input", (event) => {
            const url = new URL(window.location.href);
            url.searchParams.set(this.input.name, this.input.value);
            window.history.pushState(null, null, url); // or pushState

            var popStateEvent = new PopStateEvent("popstate");
            dispatchEvent(popStateEvent);
        });
    }
}
customElements.define("input-params", InputParams);