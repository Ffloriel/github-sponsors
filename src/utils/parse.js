import fs, { promises } from 'fs'
import path from 'path'
import YAML from 'yaml'

const FUNDING_FILENAME = 'FUNDING.yml'

// Parse the FUNDING.yml and return the content
export const parseFundingFile = async () => {
  let isFileExist = false
  const pathToFile = `${process.cwd()}/.github/${FUNDING_FILENAME}`
  try {
    isFileExist = await promises.access(pathToFile, fs.constants.R_OK)
  } catch(e) {
    throw new Error('FUNDING.yml file not found')
  }

  const fileContent = await promises.readFile(pathToFile, "utf-8")
  const yamlDoc = YAML.parse(fileContent);
  return yamlDoc
}