// GLTFExporter (binary mode) reads Blobs through FileReader, which Node does not ship.
// This minimal polyfill covers the two methods the exporter calls.
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onload = null;
      this.onloadend = null;
      this.onerror = null;
    }

    #finish(result) {
      this.result = result;
      this.onload?.({ target: this });
      this.onloadend?.({ target: this });
    }

    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then(
        (buffer) => this.#finish(buffer),
        (error) => this.onerror?.(error),
      );
    }

    readAsDataURL(blob) {
      blob.arrayBuffer().then(
        (buffer) => {
          const type = blob.type || 'application/octet-stream';
          this.#finish(`data:${type};base64,${Buffer.from(buffer).toString('base64')}`);
        },
        (error) => this.onerror?.(error),
      );
    }
  };
}
