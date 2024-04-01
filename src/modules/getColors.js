import Color from "colorjs.io";
/**
 * @param {string} colors comma seperated list of colors
 */
export const formatColors = (colors,pretty = true) => {
    return colors.split(',').map(color => {
        try {
            const colorObject = new Color(color.trim());
            return color.trim()
        } catch {}
        try {
            const colorObject = new Color('#' + color.trim());
            return '#' + color.trim()
        } catch {
            return color.trim()
        }
    }).filter(Boolean).join(pretty ? ', ' : ',' )
}
export default (colors) => {
    const colorObjects = colors.map(color => {
        try {
            const colorObject = new Color(color.trim());
            const colorName = color.name || color;
            return {
                name: colorName.trim(),
                data: colorObject
            }
        } catch {}
        try {
            const colorObject = new Color('#' + color.trim());
            const colorName = color.name || '#' + color.trim();
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
    return colorObjects
}