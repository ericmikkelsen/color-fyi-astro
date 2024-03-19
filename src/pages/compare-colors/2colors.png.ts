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
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
      <path ${noGood ? '' : 'fill="#fff" '} d="M0 0h1200v1200H0z"/>
      <path fill="${color1}" d="M0 0h400v1200H0z"/>
      <path fill="${color2}" d="M400 0h400v1200H400z"/>
      ${noGood ? '<path fill="none" stroke="#fff" stroke-width="80" d="m887 482 236 236m-236 0 236-236"/>' : ''}
      ${largeText ? '<path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M20 19H5l7-13Zm-8-8v2zm0 5v0Z" transform="matrix(18.71 0 0 18.81 781 371)"/>' : ''}
      ${good ? '<path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="30" d="M1144 504 971 696l-104-87"/>' : ''}
    </svg>`;
    const png = new Resvg(svg, { background: "#000" }).render().asPng();
    return new Response(png,{
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=0, must-revalidate", // Tell browsers to always revalidate
        "Netlify-CDN-Cache-Control": "public, max-age=31536000, must-revalidate", // Tell Edge to cache asset for up to a year
      },
    });
  }
};