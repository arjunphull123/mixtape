import sharp from "sharp";

const title = "awesome mix vol. 1"
const color = "color-1"

const titleSVG = `
    <svg width="1075" height="150">
        <style>
            @font-face {
                font-family: 'Ugly Dave';
                src: url('/fonts/Ugly-Dave-Regular.woff2') format('woff2'),
                url('/fonts/Ugly-Dave-Regular.woff') format('woff');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }
            .title {
                fill: black;
                font-size: 75px;
                font-family: 'Ugly Dave';
                font-weight: 600;
                opacity: 77.5%;
                letter-spacing: -.35%;
            }
        </style>
        <text x="0" y="100" text-anchor="left" transform="rotate(-0.75)" class="title">${title}</text>
    </svg>
`

/*const titleBuffer = await sharp({
    text: {
        text: titleFormatted,
        rgba: true,
        font: "/public/fonts/Ugly-Dave-Regular.woff",
        dpi: 500,
    }
}).toFormat('png').toBuffer()*/

const titleBuffer = Buffer.from(titleSVG)


await sharp(`${color}-base.png`)
    .composite([{
        input: titleBuffer,
        top: 185,
        left: 375,
    }
    ])
    .toFile('mixPreview.png')