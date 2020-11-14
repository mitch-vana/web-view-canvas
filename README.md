# web-view-canvas

This library allows one to draw with a **HTMLCanvasElement** in a [Scriptable](https://scriptable.app/) **[WebView](https://docs.scriptable.app/webview/)**.

## Example Usage

The below example will create a small widget with the correct width and height for an iPhone 11 Pro Max.

1. Clone the **web-view-canvas** repository to the Scriptable directory.

2. Create a new script named `Example Widget` with the below content:

```javascript
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: times;
const WebViewCanvas = importModule('/web-view-canvas');

const canvas = new WebViewCanvas(507, 507);

/**
 * Draw a background with the provided color.
 *
 * @param {string} fillColor
 */
const drawBackground = async (fillColor) => {
    context.fillStyle = fillColor;
    context.fillRect(0, 0, 507, 507);
};

/**
 * Draw a border with the provided color.
 *
 * @returns {Promise}
 */
const drawBorder = async (strokeColor) => {
    context.beginPath();
    context.moveTo(40, 40);
    context.lineTo(507 - 40, 40);
    context.lineTo(507 - 40, 507 - 40);
    context.lineTo(40, 507 - 40);
    context.closePath();

    context.lineWidth = 10;
    context.strokeStyle = strokeColor;
    context.lineJoin = 'round';

    context.stroke();
};

/**
 * Draw a line from one point to another with the provided color.
 *
 * @param {number} xStart
 * @param {number} yStart
 * @param {number} xEnd
 * @param {number} yEnd
 * @param {string} strokeColor
 * @returns {Promise}
 */
const drawLine = async (xStart, yStart, xEnd, yEnd, strokeColor) => {
    context.beginPath();
    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);
    context.closePath();

    context.lineWidth = 40;
    context.strokeStyle = strokeColor;
    context.lineCap = 'round';

    context.stroke();
};

const colors = {
    green: 'rgb(143, 205, 120)',
    white: 'rgb(255, 255, 255)',
};

await canvas.run(drawBackground, [colors.green]);
await canvas.run(drawBorder, [colors.white]);
await canvas.run(drawLine, [100, 100, 507 - 100, 507 - 100]);
await canvas.run(drawLine, [507 - 100, 100, 100, 507 - 100]);

const listWidget = new ListWidget();
listWidget.setPadding(0, 0, 0, 0);

const widgetImage = listWidget.addImage(await canvas.getImage());
widgetImage.applyFillingContentMode();
widgetImage.centerAlignImage();

Script.setWidget(listWidget);
```

3. Add a new small Scriptable widget to your phone and select `Example Widget` for the script.
