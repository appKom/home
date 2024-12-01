import { Readable } from "stream";

export function readableStreamToNodeReadable(
  stream: ReadableStream<Uint8Array>
) {
  const reader = stream.getReader();
  const readable = new Readable({
    read() {
      reader
        .read()
        .then(({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
          if (done) {
            this.push(null);
          } else {
            this.push(Buffer.from(value!));
          }
        });
    },
  });
  return readable;
}
