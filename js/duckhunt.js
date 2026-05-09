/**
 * File for the Duckhunt game functions.
 */

let gameObj = {
  score: 0,
  gameBackground: 0,
  gameLength: 0,
  duckSpeed: 0,
  duckImg: "",

  //Function for checking the input from the user, fetching the necessary images and setting up the game.
  setupGame: async function() {
    const setupBtn = document.getElementById("setupBtn")
    setupBtn.addEventListener("click", async () => {

      //Checking and setting the background.
      let userBg = document.getElementById("chooseBg").value
      const bgChoices = ["0", "1", "2", "3", "4", "5"]
      if (!bgChoices.includes(userBg)) {
        alert("Use the pointers to choose a valid background!")
        if (confirm) {
          location.reload()
        }
      }else {
        if ((parseInt(userBg)) === 0) {
          this.gameBackground = Math.floor((Math.random() * 5) + 1)
        }else {
          this.gameBackground = parseInt(userBg)
        }
      }

      //Checking and setting the game length.
      let userGameLength = document.getElementById("gameLength").value
      const lengthChoices = ["10", "20", "30"]
      if (!lengthChoices.includes(userGameLength)) {
        alert("Use the pointers to choose a valid game length!")
        if (confirm) {
          location.reload()
        }
      }else {
        this.gameLength = parseInt((userGameLength) * 1000) //Converts it into miliseconds.
      }

      //Checking and setting the game speed.
      let userGameSpeed = document.getElementById("chooseSpeed").value
      const gameSpeedChoices = ["1", "2", "3"]
      if (!gameSpeedChoices.includes(userGameSpeed)) {
        alert("Use the pointers to choose a valid game speed!")
        if (confirm) {
          location.reload()
        }
      }else {
        this.duckSpeed = parseInt((userGameSpeed) * 1000) //Converts it into miliseconds.
      }

      // Fetching the background image.
      document.body.innerHTML = "game loading..."
      let tempBg = await fetch(`https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom06/backgrounds/${this.gameBackground}.jpg`)
      let bgblob = await tempBg.blob()
      let backgroundImage = URL.createObjectURL(bgblob)
      document.body.style.backgroundImage = `url(${backgroundImage})`
      document.body.classList.add("background")

      // Fetching the duck image.
      let tempDuck = await fetch(`https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom06/duck/duck.png`)
      let duckblob = await tempDuck.blob()
      this.duckImg = URL.createObjectURL(duckblob)

      //Removing everything from the body element before the game starts.
      document.body.innerHTML = ""

      //Adding the the duck but hiding it for now.
      let duck = document.createElement("img")
      duck.setAttribute("src", `${this.duckImg}`)
      duck.style.width = "70px"
      duck.style.height = "70px"
      duck.id = "duck"
      duck.classList.add("duck")
      duck.style.display = "none"
      document.body.appendChild(duck)

      //Creating the start button for starting the game.
      let startBtn = document.createElement("button")
      startBtn.id = "startBtn"
      startBtn.classList.add("startBtn")
      startBtn.innerText = "Start game"
      document.body.appendChild(startBtn)

      centerElement(startBtn)
      window.addEventListener("resize", () => centerElement(startBtn))

      startBtn.addEventListener("click", () => {
        startGame()
        startBtn.style.display = "none"
      })

    })
  }
}

gameObj.setupGame()

/**
 * Function for centering an element.
 */
function centerElement(element) {
  element.style.top = (window.innerHeight / 2) - (element.offsetHeight / 2) + "px"
  element.style.left = (window.innerWidth / 2) - (element.offsetWidth / 2) + "px"
}

/**
 * Function for placing an object in a random place on the screen.
 */
function randomPlacement(element) {
  const elementHeight = element.offsetHeight
  const elementWidth = element.offsetWidth
  element.style.top = Math.floor(Math.random() * (window.innerHeight - elementHeight)) + "px"
  element.style.left = Math.floor(Math.random() * (window.innerWidth - elementWidth)) + "px"
}


/**
 * Function for running the game.
 */
function startGame() {
  let duck = document.getElementById("duck")

  duck.addEventListener("click", () => {
    gameObj.score++
  })

  duck.style.display = "block"
  randomPlacement(duck)

  const duckIntervall = setInterval(function() {
    randomPlacement(duck)
  }, gameObj.duckSpeed)

  setTimeout(function () {
    clearInterval(duckIntervall)
    duck.style.display = "none"
    endGame()
  }, gameObj.gameLength)
}

/**
 * Function for showing the the result.
 */
function endGame() {
  //Creating the scoreboard
  document.body.innerHTML = ""
  let scoreboard = document.createElement("div")
  scoreboard.id = "scoreboard"
  scoreboard.classList.add("scoreboard")
  document.body.appendChild(scoreboard)

  centerElement(scoreboard)
  window.addEventListener("resize", () => centerElement(scoreboard))

  scoreboard.innerHTML = `Score: ${gameObj.score}`

  //Button for reloading the page.
  let reloadBtn = document.createElement("button")
  reloadBtn.id = "reloadBtn"
  reloadBtn.classList.add("reloadBtn")
  reloadBtn.innerHTML = "Play again"
  scoreboard.appendChild(reloadBtn)
  reloadBtn.addEventListener("click", () => {location.reload()})
}
