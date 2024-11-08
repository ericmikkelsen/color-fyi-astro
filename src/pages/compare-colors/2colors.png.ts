import { Resvg } from "@resvg/resvg-js";
import type { APIContext } from 'astro';
import getColors from "../../modules/getColors";
export async function GET(context: APIContext) {
  // https://www.polpiella.dev/generating-beautiful-open-graph-images-dynamically
  const url = new URL(context.request.url);
  const colorString = url.searchParams.get('colors');
  const colors = getColors(colorString.split(','))
  if(colors.length > 1) {
    const color1 = colors[0].data.toString({format: "hex"});
    const color2 = colors[1].data.toString({format: "hex"});
    const contrast = colors[0].colors[0].contrast;
    const noGood = contrast < 3;
    const largeText = !noGood && contrast < 4.5;
    const good = contrast >= 4.5;
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
      <rect ${noGood ? '' : 'fill="#fff" '} width="1200" height="630"/>
      <rect fill="${color1}" width="400" height="630" />
      <rect fill="${color2}" width="400" height="630" x="400"/>
      ${noGood ? ' <path stroke="#fff" stroke-width="80" d="M887.4 197.1 1123.2 433m-235.8 0 235.8-236"/>' : ''}
      ${largeText ? '<path stroke="#000" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M19.5 18.7h-15l7.5-13ZM12 10.9v2.4zm0 5v.1Z" transform="matrix(18.71 0 0 18.81 780.8 85.5)"/>' : ''}
      ${good ? '<path stroke="#000" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="30" d="M1143.8 219.2 970.7 410.8l-104-87"/>' : ''}
    </svg>`;
    const png = new Resvg(svg, { background: "#000" }).render().asPng();
    return new Response(png,{
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=0, must-revalidate", // Tell browsers to always revalidate
        "Netlify-CDN-Cache-Control": "public, durable, max-age=31536000", // Tell Edge to cache asset for up to a year
      },
    });
  }
};