import * as path from 'deno/std/path/mod.ts'

const IGNORED_DIRECTORIES = new Set(['.git'])

interface FilterOptions {
  extension?: string
}

export async function getFilesList(
  directory: string,
  options: FilterOptions = {},
): Promise<string[]> {
  const foundFiles: string[] = []
  for await (const fileOrFolder of Deno.readDir(directory)) {
    if (fileOrFolder.isDirectory) {
      if (IGNORED_DIRECTORIES.has(fileOrFolder.name)) {
        // Skip this folder, it's in the ignore list.
        continue
      }
      // If it's not ignored, recurse and search this folder for files.
      const nestedFiles = await getFilesList(
        path.join(directory, fileOrFolder.name),
        options,
      )
      foundFiles.push(...nestedFiles)
    } else {
      // We know it's a file, and not a folder.

      // True if we weren't given an extension to filter, or if we were and the file's extension matches the provided filter.
      const shouldStoreFile = !options.extension ||
        path.extname(fileOrFolder.name) === `.${options.extension}`

      if (shouldStoreFile) {
        foundFiles.push(path.join(directory, fileOrFolder.name))
      }
    }
  }
  return foundFiles
}

export function getFirstFileName(
  directory: string,
  options: FilterOptions = {},
): Promise<string> {
  return getFilesList(directory, options).then((files) => {
    const filename = files[0]
    return filename.substring(filename.lastIndexOf('/'))
  })
}
