import crypto from "crypto";

export const generateCacheKey = (prefix, filters) => {
  const raw = JSON.stringify(filters);
  const hash = crypto.createHash("md5").update(raw).digest("hex");
  return `${prefix}:${hash}`;
};
