function stripUndefined(value: any): any {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)]),
    );
  }

  return value;
}

const obj = { id: "hello", affiliateId: undefined };
const stripped = stripUndefined(obj);
console.log(Object.keys(stripped));
console.log(stripped.affiliateId);
