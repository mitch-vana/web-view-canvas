module.exports = class WebViewCanvas {
    /** @type {WebView} */
    webView;

    /** @type {boolean} */
    hasCanvas;

    /** @type {number} in pixels */
    width;

    /** @type {number} in pixels */
    height;

    /**
     * Canvas constructor.
     *
     * @param {number} width in pixels
     * @param {number} height in pixels
     */
    constructor(width, height) {
        this.webView = new WebView();
        this.width = width;
        this.height = height;
        this.hasCanvas = false;
    }

    /**
     * Create a new HTMLCanvasElement within the WebView.
     *
     * @returns {Promise}
     */
    resetCanvas = async () => {
        this.hasCanvas = true;

        await this.webView.loadHTML(
            `<script>
                const canvas = document.createElement('canvas');
                canvas.width = ${this.width};
                canvas.height = ${this.height};

                const context = canvas.getContext('2d');
            </script>`
        );
    };

    /**
     * Get the current state of the HTMLCanvasElement as an Image.
     *
     * @returns {Promise<Image>}
     */
    getImage = async () => {
        if (!this.hasCanvas) {
            await this.resetCanvas();
        }

        const img = () => {
            return new Promise((resolve) => {
                resolve(canvas.toDataURL().split(';base64,')[1]);
            });
        };

        return Image.fromData(Data.fromBase64String(await this.run(img)));
    };

    /**
     * Run arbitrary code in the WebView.
     *
     * Provide a function that returns a Promise and accepts zero or more arguments.
     * If arguments are expected then they must be within the provided data array (the array will be destructured).
     * A "canvas" and a "context" variable can be used for drawing inside of the provided function.
     *
     * @param {function (...): Promise} func
     * @param {array} data
     * @returns {Promise}
     */
    run = async (func, data = []) => {
        if (!this.hasCanvas) {
            await this.resetCanvas();
        }

        const script = `
            setTimeout(() => {
                (${func.toString()})(...JSON.parse('${JSON.stringify(data)}'))
                    .then((resolve) => {
                        completion(resolve);
                    });
            }, 1);
        `;

        return await this.webView.evaluateJavaScript(script, true);
    };
};
