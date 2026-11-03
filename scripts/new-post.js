/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const rawArgs = process.argv.slice(2)
const isFolder = rawArgs.includes("--dir") || rawArgs.includes("-d") || rawArgs.includes("--folder")
const args = rawArgs.filter(arg => !arg.startsWith("-"))

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename> [--folder]`)
  process.exit(1) // Terminate the script and return error code 1
}

let inputName = args[0]
let targetFileRel = ""
let postTitle = ""

if (isFolder || inputName.endsWith("/")) {
  const folderName = inputName.replace(/\/+$/, "")
  targetFileRel = path.join(folderName, "index.md")
  postTitle = path.basename(folderName)
} else if (inputName.endsWith("/index.md") || inputName.endsWith("/index.mdx")) {
  targetFileRel = inputName
  postTitle = path.basename(path.dirname(inputName))
} else {
  const fileExtensionRegex = /\.(md|mdx)$/i
  if (!fileExtensionRegex.test(inputName)) {
    targetFileRel = `${inputName}.md`
  } else {
    targetFileRel = inputName
  }
  postTitle = path.basename(targetFileRel, path.extname(targetFileRel))
}

const targetDir = "./src/content/posts/"
const fullPath = path.join(targetDir, targetFileRel)

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true })
}

const content = `---
title: ${postTitle}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---
`

fs.writeFileSync(fullPath, content)

console.log(`Post ${fullPath} created`)
