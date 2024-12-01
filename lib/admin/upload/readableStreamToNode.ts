import { Readable } from "stream";

export function readableStreamToNodeReadable(stream: any) {
  const reader = stream.getReader();
  const readable = new Readable({
    read() {
      reader.read().then(({ done, value }: { done: boolean; value: any }) => {
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      });
    },
  });
  return readable;
}
