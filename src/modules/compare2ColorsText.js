import getColors from "./getColors";
export default (color1, color2) => {
    const colors = getColors([color1,color2]);
    if(colors.length > 1) {
        const contrast = colors[0].colors[0].contrast.toFixed(2);
        const onlyLargeText =  4.5 > contrast && contrast >= 3;
        const good = contrast >= 4.5;
        let text = `${colors[0].name} with ${colors[1].name} is not accessible`;
        let description = `${colors[0].name} and ${colors[1].name} have a contrast of ${contrast}.`
        const largeText = 'Large text is considered at least 24px or bold(700) and at least 19px.'
        if( onlyLargeText ) {
            text = `${colors[0].name} with ${colors[1].name} is only accessible with large text`;
            description = `${colors[0].name} and ${colors[1].name} have a contrast of ${contrast}. ${largeText}`
        } else if ( good ) {
            text = `${colors[0].name} with ${colors[1].name} is accessible`;
        } else {
            description = description + ` In order to be accessible, text and background colors need at least a contrast of at least 4.5 or 3.0 for large text. ${largeText}`
        }
        return {
            colors: colors,
            contrast :contrast,
            description: description,
            good: good,
            onlyLargeText: onlyLargeText,
            text: text,
        };
    }
    return false;
}