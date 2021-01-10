const fs = require('fs')


const basePath = "E:/MÚSICAS"
const folders = fs.readdirSync(basePath)

const files = folders.map(folder => ({
  name: folder,
  songs: fs.readdirSync(`${basePath}/${folder}`).filter(name => {
    const nameSplited = name.split('.')
    const extension = nameSplited[nameSplited.length - 1]
    const isSong = extension === "mp3"
    return isSong
  }).map(name => ({
    name, path: `${basePath}/${folder}/${name}`
  }))
}))

fs.writeFileSync("src/songs.json", JSON.stringify(files, null, 2))

const songs = []

files.forEach(file => {
  file.songs.forEach(song => songs.push(song))
})