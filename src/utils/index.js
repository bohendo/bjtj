
const err = (tag) => (e) => {
  console.group(tag)
  console.error(e)
  console.groupEnd()
  process.exit(1)
}

export { err }
