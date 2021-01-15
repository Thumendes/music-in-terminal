const player = require("sound-play")
const inquirer = require("inquirer")
const data = require("./songs.json")
const chalk = require("chalk")

async function bootstrap() {
  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
  async function requestSong() {
    const { artist } = await inquirer.prompt({
      name: "artist",
      message: "Artista: ",
      type: "autocomplete",
      source: function (answersSoFar, input) {
        const artists = data.map(value => value.name)
        return artists.filter(value => {
          if (input?.length) {
            return value.toLowerCase().includes(input.toLowerCase())
          }
          return true
        })
      }
    })

    const { song } = await inquirer.prompt({
      name: "song",
      message: "Música",
      type: "autocomplete",
      source: function (answersSoFar, input) {
        const songs = data.find(({ name }) => name === artist).songs.map(song => song.name)
        return songs.filter(value => {
          if (input?.length) {
            return value.toLowerCase().includes(input.toLowerCase())
          }
          return true
        })
      }
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