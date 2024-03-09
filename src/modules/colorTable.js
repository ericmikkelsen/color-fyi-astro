import Color from "colorjs.io";
import slugify from '@sindresorhus/slugify';
const a11yObject = (contrast) => {
    const text = contrast >= 4.5;
    const largeText = contrast >= 3;
    const interactive = contrast >= 3;
    const wcagAAAText = contrast >= 7;
    const wcagAAALargeText = contrast >= 4.5;
    return {
        AA: {
            text: text,
            largeText: largeText,
            interactive: interactive,
        },
        AAA: {
            text: wcagAAAText,
            largeText: wcagAAALargeText
        },
        text: {
            large: 'Large text is text has a font size of at last 24 pixels or a font size of 19 pixels and a font weight of bold(700).'
        }
    }
}
const contrastText = (contrast) => {
    const good = contrast >= 4.5;
    const goodForLargeText = contrast >= 3;
    const iconX = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" stroke-width="4">
    <path d="m6 6 12 12M6 18 18 6"/>
  </svg>`
    let text = `${iconX} is not accessible`
    if(good) {
        text = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="4" fill="none">
        <path id="a" d="m19.9 5.8-10 11-6-5"/>
    </svg> is accessible`
    } else if (goodForLargeText) {
        text = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"    
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
                if(! colorObjects[index].colors) {
                    colorObjects[index].colors = [];
                }
                if(color2) {
                    const contrast = color1.data.contrast(color2.data,"WCAG21")
                    colorObjects[index].colors.push({...color2, contrast: contrast})
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
    return `<div class="${prefix}">
        ${colorObjects.map((color,index)=>{
            return `${heading(index+1 + '. ' + color.name.trim())}
                ${color.colors.map(col => {
                    return `<p>        
                            <span class="${prefix}-color-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                                <circle fill="${color.data}" cx="8" cy="8" r="7"/>
                                </svg> 
                                ${color.name}
                            </span>
                            <span>with</span>
                            <span class="${prefix}-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                                    <circle fill="${col.data}" cx="8" cy="8" r="7"/>
                                </svg> ${col.name}
                            </span>
                            <span class="${prefix}-info">${contrastText(col.contrast)}</span>
                    </p>`;
                }).join('')}
            `;
        }).join('')}
    </div>`;
}
export default colorList