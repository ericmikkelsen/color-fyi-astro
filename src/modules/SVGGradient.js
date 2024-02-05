import svgToMiniDataURI from 'mini-svg-data-uri';
export default (color1, color2) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%'>
        <defs>
        <linearGradient id='0' x1='0' x2='1' y1='0.5' y2='0.5'>
            <stop offset='0%' stop-color='${color1}'/>
            <stop offset='100%' stop-color='${color2}'/>
        </linearGradient>
        </defs>
        <rect fill='url("#0")' height='100%' width='100%'/>
    </svg>`;

    const encodedSVG = encodeURIComponent(svg);
    return `data:image/svg+xml,${encodedSVG}`
}