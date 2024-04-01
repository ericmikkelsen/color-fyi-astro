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
        if (paramValue && !this.input.value) {
            this.input.value = paramValue;
        } else if (this.input.value) {
            url.searchParams.set(this.input.name,this.input.value)
        }
        // update param on input
        const isInput = this.input.tagName.toLowerCase() === 'input';
        const isCheckbox = isInput && this.input.getAttribute('type') === 'checkbox'
        const eventType = isCheckbox ? 'change' : 'input';
        this.input.addEventListener(eventType, (event) => {
            const url = new URL(window.location.href);
            if(isCheckbox) {
                if( this.input.checked){
                    url.searchParams.set(this.input.name, this.input.value);
                } else {
                    url.searchParams.delete(this.input.name);
                }
            } else {
                url.searchParams.set(this.input.name, this.input.value);
            }
            window.history.pushState(null, null, url); // or pushState

            var popStateEvent = new PopStateEvent("popstate");
            dispatchEvent(popStateEvent);
        });
    }
}
customElements.define("input-params", InputParams);