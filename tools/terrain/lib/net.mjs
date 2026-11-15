// Network helpers shared by the terrain build.

/** Retries flaky network work (S3 range requests fail now and then). */
export async function withRetry(work, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await work();
    } catch (error) {
      if (/CERT|SELF_SIGNED/.test(error.cause?.code ?? '')) {
        throw new Error(
          `${error.cause.code}: this network intercepts HTTPS. ` +
          'Run with NODE_OPTIONS=--use-system-ca (Node ≥ 22.15) or NODE_EXTRA_CA_CERTS=<proxy CA .pem>.',
        );
      }
      if (attempt >= attempts) throw error;
      console.warn(`  … retrying after: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

/** Bytes [start, end) of a remote file (HTTP range request). */
export async function fetchRange(url, start, end) {
  const response = await fetch(url, { headers: { Range: `bytes=${start}-${end - 1}` } });
  if (response.status !== 206) throw new Error(`${response.status} ${response.statusText} (range request): ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== end - start) throw new Error(`short range read (${bytes.length} of ${end - start} bytes): ${url}`);
  return bytes;
}

/** Runs `work(item)` for every item with at most `limit` in flight; results keep the input order. */
export async function mapLimit(items, limit, work) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await work(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
