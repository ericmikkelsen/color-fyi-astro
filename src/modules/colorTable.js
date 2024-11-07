import slugify from '@sindresorhus/slugify';
import getColors from './getColors.js'
import contrastGrade from './contrastGrade.js';
const contrastText = (contrast) => {
    const good = contrast >= 4.5;
    const readableContrast = parseFloat(contrast.toFixed(1)).toString()
    const goodForLargeText = contrast >= 3;
    const iconX = `<svg class="icon-no" xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" stroke-width="4">
    <path d="m6 6 12 12M6 18 18 6"/>
  </svg>`
    let text = `${iconX} <span>is not accessible with a contrast of ${readableContrast}</span>`
    if(good) {
        text = `<svg class="icon-yes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="4" fill="none">
        <path d="m19.9 5.8-10 11-6-5"/>
    </svg> <span>is accessible with a contrast of ${readableContrast}</span>`
    } else if (goodForLargeText) {
        text = `<svg class="icon-large" xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke-width="2"
        style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round"    
            >
         <path d="M19.5 18.7h-15l7.5-13Z"/>
         <path d="M12 10.9v2.4zm0 5v.1z"/>
       </svg> <span>is only accessible for large text with a contrast of ${readableContrast}</span>`
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

    const colorObjects = getColors(colors);

    const heading = (text,h = headingLevel, id = false) => {
        id = id || slugify(text)
        return `<h${h} id="${id}">
            ${text}
        </h${h}>`;
    }
    const colorSwatch = (name,fill,number,stroke = fill) => {
        const strokeAttribute = stroke ? `stroke="${stroke}"` : ''
        return `<span class="${prefix}-color-${number}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
            <circle fill="${fill}" ${strokeAttribute} cx="8" cy="8" r="7" />
            </svg> 
            ${name} ${number === 1 ? ' with ' : ''}
        </span>`
    }
    
    if(colorObjects.length === 2 ){
        const [color1,color2] = colorObjects;
        const grade = contrastGrade(color1.colors[0].contrast);
        return `<div class="${prefix}">
        ${heading('Comparison')}
        <p class="color-list__item color-list__item--${grade}">        
            ${colorSwatch( color1.name, color1.data, 1 )}
            ${colorSwatch( color2.name, color2.data, 2 )}
            <span class="${prefix}-info">${contrastText(color1.colors[0].contrast)}</span>
        </p>
        </div>`;
    }
    if(colorObjects.length > 2 ) {
        return `<div class="${prefix}">
            ${colorObjects.map((color,index)=>{
                const isLight = color.data.contrast('black','wcag21') < 4.5;
                return `<div class="color-list__color ${isLight ? 'color-list__color--light' : 'color-list__color--dark'}" style="--color:${color.data}">
                ${heading(index+1 + `. ` + color.name.trim(), headingLevel + 1,  slugify(color.name.trim()) )}
                ${color.colors.map(col => {
                        const grade = contrastGrade(col.contrast);
                        return `<p class="color-list__item color-list__item--${grade}">        
                                ${colorSwatch(color.name,color.data,1, col.data )}
                                ${colorSwatch(col.name,col.data,2)}
                                <span class="${prefix}-info">${contrastText(col.contrast)}</span>
                        </p>`;
                    }).join('')}
                </div>`;
            }).join('')}
        </div>`;
    }
    return '';
}
export default colorList