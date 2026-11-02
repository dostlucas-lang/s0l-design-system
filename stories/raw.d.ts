// Vite's ?raw suffix imports a file's source as a string.
declare module "*?raw" {
  const content: string
  export default content
}
