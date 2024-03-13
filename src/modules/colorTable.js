import Color from "colorjs.io";
import slugify from '@sindresorhus/slugify';
const contrastText = (contrast) => {
    const good = contrast >= 4.5;
    const goodForLargeText = contrast >= 3;
    const iconX = `<svg class="icon-no" xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" stroke-width="4">
    <path d="m6 6 12 12M6 18 18 6"/>
  </svg>`
    let text = `${iconX} is not accessible`
    if(good) {
        text = `<svg class="icon-yes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="4" fill="none">
        <path d="m19.9 5.8-10 11-6-5"/>
    </svg> is accessible`
    } else if (goodForLargeText) {
        text = `<svg class="icon-large" xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke-width="2"
        style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round"    
            >
         <path d="M19.5 18.7h-15l7.5-13Z"/>
         <path d="M12 10.9v2.4zm0 5v.1z"/>
       </svg> is only accessible for large text`
    }
    return text
}
/**
 * 
 * @param {array[string|object]} colors 
 * @param {*} prefix 
 * @returns 
 */
const colorList = (colors, headingLevel = 2, prefix = 'color-list') => {

    const colorObjects = colors.map(color => {
        try {
            const colorObject = new Color(color.trim());
            const colorName = color.name || color;
            return {
                name: colorName.trim(),
                data: colorObject
            }
        } catch {
            return false;
        }
    }).filter(Boolean)
    colorObjects.forEach((color1,index,) => {
        if(color1) {
            colorObjects.forEach((color2) =>{
                if(color1 !== color2){
                    if(! colorObjects[index].colors) {
                        colorObjects[index].colors = [];
                    }
                    if(color2) {
                        const contrast = color1.data.contrast(color2.data,"WCAG21")
                        colorObjects[index].colors.push({...color2, contrast: contrast})
                    }
                }
            })
        }
    });
    const heading = (text,h = headingLevel) => {
        const id = slugify(text)
        return `<h${h} id="${id}">
            ${text}
        </h${h}>`;
    }
    const colorSwatch = (name,color,number) => {
        return `<span class="${prefix}-color-${number}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
            <circle fill="${color}" cx="8" cy="8" r="7"/>
            </svg> 
            ${name}
        </span>`
    }
    
    if(colorObjects.length === 2 ){
        const [color1,color2] = colorObjects;
        console.log(color1.colors[0].contrast)
        return `<div class="${prefix}">
        ${heading('Comparison')}
        <p>        
            ${colorSwatch( color1.name, color1.data, 1 )}
            <span>with</span>
            ${colorSwatch( color2.name, color2.data, 2 )}
            <span class="${prefix}-info">${contrastText(color1.colors[0].contrast)}</span>
        </p>
        </div>`;
    }
    if(colorObjects.length > 2 ) {
        return `<div class="${prefix}">
            ${colorObjects.map((color,index)=>{
                return `${heading(index+1 + `<span style="color:${color.data}">.</span> ` + color.name.trim())}
                    ${color.colors.map(col => {
                        return `<p>        
                                ${colorSwatch(color.name,color.data,1)}
                                <span>with</span>
                                ${colorSwatch(col.name,col.data,2)}
                                <span class="${prefix}-info">${contrastText(col.contrast)}</span>
                        </p>`;
                    }).join('')}
                `;
            }).join('')}
        </div>`;
    }
    return '';
}
export default colorList