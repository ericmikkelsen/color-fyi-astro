import colorTable from './colorTable.js';
class CompareColors extends HTMLElement {
    static observedAttributes = ["data-colors"];
    constructor() {
      super();
    }
    connectedCallback() {
        if(!this.dataset.prerendered) {
            this.render();
        }
    }
    getColors(){
      let colors = []
      if(this.dataset.colors) {
        this.dataset.colors.split(',').forEach(color => {
          color = color.trim();
          if(color){
            colors.push(color)
          }
        })
      }
      return colors
    }
    getMarkup(){
        return colorTable( this.getColors() );
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if(name === 'data-colors'){
        this.render();
      }
    }
    render(){
        this.innerHTML = this.getMarkup();
    }
}
customElements.define("compare-colors", CompareColors);