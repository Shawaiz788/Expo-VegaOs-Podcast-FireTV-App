/**
 * Minimal SHA1 implementation (hex output).
 * Used for PodcastIndex request signing in environments where platform crypto modules
 * may not be available.
 */
function rotl(n: number, s: number) {
  return (n << s) | (n >>> (32 - s));
}

function toHex32(n: number) {
  // Force unsigned
  const u = n >>> 0;
  return u.toString(16).padStart(8, '0');
}

function utf8Bytes(input: string): Uint8Array {
  // Convert JS string to UTF-8 bytes without relying on TextEncoder
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const codePoint = input.charCodeAt(i);

    // Handle surrogate pairs
    if (codePoint >= 0xd800 && codePoint <= 0xdbff && i + 1 < input.length) {
      const next = input.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        const full =
          ((codePoint - 0xd800) << 10) + (next - 0xdc00) + 0x10000;
        i++;

        // 4-byte UTF-8
        bytes.push(
          0xf0 | (full >> 18),
          0x80 | ((full >> 12) & 0x3f),
          0x80 | ((full >> 6) & 0x3f),
          0x80 | (full & 0x3f),
        );
        continue;
      }
    }

    // 1-byte UTF-8
    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
      continue;
    }

    // 2-byte UTF-8
    if (codePoint <= 0x7ff) {
      bytes.push(
        0xc0 | (codePoint >> 6),
        0x80 | (codePoint & 0x3f),
      );
      continue;
    }

    // 3-byte UTF-8
    bytes.push(
      0xe0 | (codePoint >> 12),
      0x80 | ((codePoint >> 6) & 0x3f),
      0x80 | (codePoint & 0x3f),
    );
  }

  return new Uint8Array(bytes);
}

function sha1Hex(input: string): string {
  const msg = utf8Bytes(input);

  const ml = msg.length * 8;
  // Pre-processing: append '1' bit then padding with zeros until length ≡ 448 mod 512
  const withOne = new Uint8Array(msg.length + 1);
  withOne.set(msg, 0);
  withOne[msg.length] = 0x80;

  // Total length in bytes after padding (must be 56 mod 64)
  let paddedLength = withOne.length;
  while ((paddedLength % 64) !== 56) paddedLength++;

  const padded = new Uint8Array(paddedLength + 8);
  padded.set(withOne, 0);

  // Append original length in bits as 64-bit big-endian integer
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength, Math.floor(ml / 2 ** 32));
  view.setUint32(paddedLength + 4, ml >>> 0);

  // Initialize hash values
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const w = new Uint32Array(80);

  for (let i = 0; i < padded.length; i += 64) {
    // Break chunk into sixteen 32-bit big-endian words w[0..15]
    for (let t = 0; t < 16; t++) {
      const j = i + t * 4;
      w[t] = (padded[j] << 24) | (padded[j + 1] << 16) | (padded[j + 2] << 8) | padded[j + 3];
    }
    // Extend to 80 words
    for (let t = 16; t < 80; t++) {
      w[t] = rotl(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let t = 0; t < 80; t++) {
      let f: number;
      let k: number;

      if (t <= 19) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (t <= 39) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (t <= 59) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (rotl(a, 5) + f + e + k + w[t]) >>> 0;
      e = d;
      d = c;
      c = rotl(b, 30) >>> 0;
      b = a;
      a = temp;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  return `${toHex32(h0)}${toHex32(h1)}${toHex32(h2)}${toHex32(h3)}${toHex32(h4)}`;
}

export async function digestSHA1(input: string): Promise<string> {
  return sha1Hex(input);
}
