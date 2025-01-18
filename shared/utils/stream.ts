export function mapIterator<T, R>(
  iterator: AsyncIterator<T> | AsyncIterable<T>,
  mapper: (value: T) => Promise<R> | R,
): AsyncIterator<R> & AsyncIterable<R> {
  const it =
    Symbol.asyncIterator in iterator
      ? iterator[Symbol.asyncIterator]()
      : iterator;

  return {
    async next(): Promise<IteratorResult<R>> {
      const { value, done } = await it.next();

      if (done) {
        return { done: true, value: undefined };
      }

      const mappedValue = await mapper(value);
      return { done: false, value: mappedValue };
    },

    // Make the iterator iterable
    [Symbol.asyncIterator]() {
      return this;
    },

    // Forward return and throw if they exist on the source iterator
    return:
      it.return &&
      (async (value?: R) => {
        const result = await it.return?.(value as any);
        return { ...result, value: result!.value as R };
      }),

    throw:
      it.throw &&
      (async (err?: any) => {
        const result = await it.throw?.(err);
        return { ...result, value: result!.value as R };
      }),
  };
}

export function mapStream<T, R>(
  stream: ReadableStream<T>,
  mapper: (chunk: T) => Promise<R> | R,
): ReadableStream<R> {
  const reader = stream.getReader();

  return new ReadableStream<R>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();

        if (done) {
          controller.close();
          return;
        }

        const mapped = await mapper(value);
        controller.enqueue(mapped);
      } catch (error) {
        controller.error(error);
      }
    },

    cancel() {
      reader.releaseLock();
    },
  });
}

export function stringToStream(
  text: string,
  chunkSize = 1,
): ReadableStream<string> {
  let index = 0;

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return new ReadableStream({
    async start(controller) {
      const randomJitter = Math.random() * 20 - 20 / 2;
      await sleep(100 + randomJitter);
      (function push() {
        if (index >= text.length) {
          controller.close();
          return;
        }

        const chunk = text.slice(index, index + chunkSize);
        index += chunkSize;
        controller.enqueue(chunk);
        setTimeout(push, 200);
      })();
    },
  });
}

export function iteratorToStream<T, R = T>(
  iterator: AsyncIterator<T> | AsyncIterable<T>,
  mapper?: (value: T) => R | Promise<R> | undefined,
): ReadableStream<string> {
  const it =
    Symbol.asyncIterator in iterator
      ? iterator[Symbol.asyncIterator]()
      : iterator;

  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await it.next();
        if (done) {
          controller.close();
        } else {
          const mapped = mapper ? await mapper(value) : (value as unknown as R);
          if (mapped ?? false) {
            const chunk =
              typeof mapped === "string" ? mapped : JSON.stringify(mapped);
            controller.enqueue(chunk);
          }
          controller.enqueue("");
        }
      } catch (e) {
        console.log("Error", e);
        controller.close();
      }
    },
  });
}

export async function* streamToIterable<T = string>(
  stream: ReadableStream,
  map?: (text: string | Uint8Array) => T | T[],
): AsyncIterable<T> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      if (!map) yield chunk as T;
      else {
        const mapped = map(chunk);
        if (Array.isArray(mapped)) {
          for (const item of mapped) {
            yield item;
          }
        } else {
          yield mapped;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
