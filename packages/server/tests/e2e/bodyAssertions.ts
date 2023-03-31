export function equalOrError<T>(found: T, expected: T) {
  if (found !== expected) {
    throw new Error(`found != expected. expected:${expected}; found:${found}}`)
  }
}

export function matchOrError(found: string, exp: RegExp) {
  if (!exp.test(found)) {
    throw new Error(`regexp failed. exp:${exp}; target:${found}}`)
  }
}
