const player = require("sound-play")
const inquirer = require("inquirer")
const data = require("./songs.json")
const chalk = require("chalk")

async function bootstrap() {
  async function requestSong() {
    const { artist } = await inquirer.prompt({
      name: "artist",
      message: "Artista: ",
      type: "list",
      choices: data.map(value => value.name)
    })

    const { song } = await inquirer.prompt({
      name: "song",
      message: "Música",
      type: "list",
      choices: data.find(({ name }) => name === artist).songs.map(song => song.name)
    })

    return { artist, song }
  }

  async function askForMore() {
    const { more } = await inquirer.prompt({
      name: "more",
      message: "Quer adicionar outra?",
      type: "confirm",
    })
    return more
  }

  const queue = []

  do {
    const { artist, song } = await requestSong()

    const target = data.find(({ name }) => name === artist).songs.find(({ name }) => name === song)

    queue.push(target)
  } while (await askForMore())

  console.log("\nMúsicas adicionadas à lista:")
  queue.forEach(song => {
    console.log(chalk.cyan(song.name))
  })

  for (const song of queue) {
    const [name] = song.name.split('.')

    console.log("\nAgora tocando " + chalk.green(name))

    await player.play(song.path, 1)
  }

}

bootstrap()