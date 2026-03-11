// Allow importing CSS files (e.g., GrapesJS CSS)
declare module '*.css' {
  const content: string
  export default content
}
