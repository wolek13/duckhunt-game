/**
 * File for the new duckhunt game for the project.
 */

/**
 * Function for getting and returning the value the checked radio.
 * Parameter is the name of the radio elements.
 */
function checkedRadio(radioName) {
  const allChoices = document.getElementsByName(radioName)
  let selectedValue = ""

  for (const item of allChoices) {
    if (item.checked) {
      selectedValue = item.value
      break
    }
  }
  return selectedValue
}

let gameObj = {
  highscore: [],
  score: 0,
  timeLeft: 0,
  backgroundChoice: 0,
  difficulty: "",
  duckImg: "",
  donaldDuckImg: "",
  superDuckImg: "",
  gameLength: 0,
  duckSize: 0,
  transitionSpeed: 0,
  duckShowTime: 0,
  donaldDuckSpeed: 0,
  superDuckSpeed: 0,
  animationDuration: "",
  gunShot: new Audio("sound/gun-shot.mp3"),
  counter: 0,
  gameCursor: `url("img/crosshair.png") 32 32, auto`,

  //Function for setting up the game.
  setupGame: async function() {
    const setupBtn = document.getElementById("setupBtn")
    const body = document.body
    setupBtn.addEventListener("click", async () => {

      //Getting the background choice.
      this.backgroundChoice = parseInt(checkedRadio("background"))
      if (this.backgroundChoice === 0) {
        this.backgroundChoice = Math.floor((Math.random() * 3) + 1)
      }

      //Fetching the selected settings as a json.
      this.difficulty = checkedRadio("difficulty")
      const file = await fetch(`json/${this.difficulty}.json`)
      const jsonDifficulty = await file.json()

      //Adjusting the game to the users choice of settings.
      this.gameLength = jsonDifficulty.gameLength
      this.duckSize = jsonDifficulty.duckSize
      this.duckShowTime = jsonDifficulty.duckShowTime
      this.donaldDuckSpeed = jsonDifficulty.donaldDuckSpeed
      this.superDuckSpeed = jsonDifficulty.superDuckSpeed
      this.animationDuration = jsonDifficulty.animationDuration + "s"

      //Loading the background and the game.
      body.innerHTML = ""
      body.style.backgroundImage = `url(img/project-background${this.backgroundChoice}.jpg)`
      document.body.classList.add("background")
      body.innerHTML = `
      <div class="pregameContent" id="pregameContent">
        <div class="gameName" id="gameName">
          <img class="letter" src="img/letterD.png" alt="letter D">
          <img class="letter" src="img/letterU.png" alt="letter U">
          <img class="letter" src="img/letterC.png" alt="letter C">
          <img class="letter" src="img/letterK.png" alt="letter K">
          <img class="letter" src="img/letterH.png" alt="letter H">
          <img class="letter" src="img/letterU.png" alt="letter U">
          <img class="letter" src="img/letterN.png" alt="letter N">
          <img class="letter" src="img/letterT.png" alt="letter T">
        </div>
      </div>
      `
      let pregameContent = document.getElementById("pregameContent")
      centerElement(pregameContent)
      window.addEventListener("resize", () => {centerElement(pregameContent)})

      //Adding sound for the intro. start with the animation of the first letter.
      const letter = document.querySelector(".letter")
      const introSound = new Audio("sound/intro-sound.mp3")

      letter.addEventListener("animationstart", () => {
        introSound.play()
      }, { once: true })

      //Creating the start button for starting the game.
      let startBtn = document.createElement("button")
      startBtn.id = "startBtn"
      startBtn.classList.add("startBtn")
      startBtn.innerText = "Start game"
      pregameContent.appendChild(startBtn)

      startBtn.addEventListener("click", () => {
        startGame()
        pregameContent.style.display = "none"

        //Adding the gun sound after the start button is pressed.
        setTimeout(() => {
          document.addEventListener("click", gameObj.playGunShot)
        }, 100)
      })

      //Adding the the ducks but hiding them for now.
      this.duckImg = document.createElement("img")
      this.duckImg.setAttribute("src", "img/duck-project.png")
      this.duckImg.classList.add("duckImg")
      this.duckImg.classList.add("duck")
      this.duckImg.style.display = "none"
      document.body.appendChild(this.duckImg)

      this.donaldDuckImg = document.createElement("img")
      this.donaldDuckImg.setAttribute("src", "img/donald-duck.png")
      this.donaldDuckImg.classList.add("donaldDuckImg")
      this.donaldDuckImg.classList.add("duck")
      this.donaldDuckImg.style.display = "none"
      document.body.appendChild(this.donaldDuckImg)

      this.superDuckImg = document.createElement("img")
      this.superDuckImg.setAttribute("src", "img/super-duck.png")
      this.superDuckImg.classList.add("superDuckImg")
      this.superDuckImg.classList.add("duck")
      this.superDuckImg.style.display = "none"
      document.body.appendChild(this.superDuckImg)

      //Preloading the gun sound so it doesn't lagg.
      this.gunShot.preload = "auto"
    })
  },
  playGunShot: function() {
    gameObj.gunShot.currentTime = 0
    gameObj.gunShot.play()
  }
}

gameObj.setupGame()

/**
 * Function for starting the game.
 */
function startGame() {
  gameObj.score = 0
  const body = document.body
  body.style.overflow = "hidden"
  document.documentElement.style.overflow = "hidden"

  gameObj.counter = (gameObj.gameLength / 1000)
  gameTimer()

  // Changing the cursor to a crosshair.
  body.style.cursor = gameObj.gameCursor

  //Intervall for the main duck.
  gameObj.duckIntervall = setInterval(() => {
    const duckWrapper = document.createElement("div")
    duckWrapper.classList.add("duckWrapper")

    const duckClone = cloneElement(gameObj.duckImg)
    duckClone.style.display = "block"

    duckWrapper.style.width = `${gameObj.duckSize}px`
    duckWrapper.style.height = `${gameObj.duckSize}px`

    duckWrapper.style.animationDuration = gameObj.animationDuration
    duckWrapper.appendChild(duckClone)
    body.appendChild(duckWrapper)

    startPosition(duckWrapper)

    duckClone.addEventListener("click", () => {
      const duckSound = new Audio("sound/duck-sound.mp3")
      duckSound.play()
      duckWrapper.style.animationPlayState = "paused"
      duckClone.classList.add("falling")
      gameObj.score++

      duckClone.addEventListener("animationend", () => { duckWrapper.remove() })
    }, { once: true })
  }, gameObj.duckShowTime)

  //Intervall for super duck.
  gameObj.superDuckIntervall = setInterval(() => {
    const superDuckClone = cloneElement(gameObj.superDuckImg)
    superDuckClone.style.display = "block"
    body.appendChild(superDuckClone)
    randomPlacement(superDuckClone)

    //Click event for making super duck responsive.
    superDuckClone.addEventListener("click", (event) => {
      const duckSound = new Audio("sound/duck-sound.mp3")
      duckSound.play()
      implode(event)
      gameObj.score += 2
      duckSound.play()
    }, { once: true })

    setTimeout(() => {
      superDuckClone.remove()
    }, (gameObj.superDuckSpeed)-1000)
  }, gameObj.superDuckSpeed)

  //Intervall for donald duck.
  gameObj.donaldDuckIntervall = setInterval(() => {
    const donaldDuckClone = cloneElement(gameObj.donaldDuckImg)
    donaldDuckClone.style.display = "block"
    body.appendChild(donaldDuckClone)
    randomPlacement(donaldDuckClone)

    //Click event for making donald duck responsive.
    donaldDuckClone.addEventListener("click", (event) => {
      const donaldDuckSound = new Audio("sound/no.mp3")
      donaldDuckSound.play()
      implode(event)
      gameObj.score -= 2
    }, { once: true })

    setTimeout(() => {
      donaldDuckClone.remove()
    }, (gameObj.donaldDuckSpeed)-1000)
  }, gameObj.donaldDuckSpeed)
}

/**
 * Visual timer for the game.
 */
function gameTimer() {
  const timerDiv = document.createElement("div")
  timerDiv.classList.add("timerDiv")
  timerDiv.style.height = "70px"
  timerDiv.style.width = "70px"
  document.body.appendChild(timerDiv)
  cornerPlacment(timerDiv)
  window.addEventListener("resize", () => {cornerPlacment(timerDiv)})

  const interval = setInterval(() => {
    timerDiv.innerHTML = gameObj.counter
    if (gameObj.counter < 0) {
      clearInterval(interval)
      clearInterval(gameObj.duckIntervall)
      clearInterval(gameObj.superDuckIntervall)
      clearInterval(gameObj.donaldDuckIntervall)
      document.removeEventListener("click", gameObj.playGunShot)
      endGame()
    }
    gameObj.counter-- //Placing the reduction here so the number 0 is also shown.
  }, 1000)
}

/**
 * function for ending the game.
 */
function endGame() {
  document.body.innerHTML = ""
  document.body.style.overflow = "auto"
  document.documentElement.style.overflow = "auto"
  document.body.style.cursor = "auto"
  fillHighScore(gameObj.difficulty, gameObj.score)

  //Creating the scoreboard
  let scoreboard = document.createElement("div")
  scoreboard.id = "scoreboard"
  scoreboard.classList.add("scoreboard")
  document.body.appendChild(scoreboard)
  fillHighScoreTable(gameObj.highscore)

  //Creating the start button for starting the game.
  let restartBtn = document.createElement("button")
  restartBtn.id = "restartBtn"
  restartBtn.classList.add("restartBtn")
  restartBtn.innerText = "Play again"
  scoreboard.appendChild(restartBtn)
  restartBtn.addEventListener("click", () => {
    restartGame()
  })

  centerElement(scoreboard)
  window.addEventListener("resize", () => { centerElement(scoreboard) })
}

/**
 * Function for restarting the game.
 * without reloading the page.
 */
function restartGame() {
  //Resetting the page.
  document.body.innerHTML = `
  <div id="content" class="content">
    <h1>Choose the game difficulty wisely!</h1>
    <div class="difficultyChoices">
      <label><input type="radio" name="difficulty" value="easy" checked>Easy</label>
      <label><input type="radio" name="difficulty" value="normal">Normal</label>
      <label><input type="radio" name="difficulty" value="hard">Hard</label>
    </div>
    <h1>Choose your background</h1>
    <div class="bgChoices">
      <label><input type="radio" name="background" value="0" checked>Random background</label>
      <label><input type="radio" name="background" value="1">Space</label>
      <label><input type="radio" name="background" value="2">Waterfall</label>
      <label><input type="radio" name="background" value="3">Beach</label>
    </div>
    <button id="setupBtn" class="setupBtn">Continue</button>
  </div> 
  <script type="module" src="js/duckhunt2.js"></script>
  `
  gameObj.setupGame()
}

/**
 * Function for filling the highscore array.
 * Hard is converted to 3, normal to 2 and easy to 1. This to make the sorting easier.
 * It also sorts the values in decending order.
 */
function fillHighScore(difficulty, score) {
  switch (difficulty) {
  case "hard":
    difficulty = 3
    break
  case "normal":
    difficulty = 2
    break    
  case "easy":
    difficulty = 1
    break    
  }
  gameObj.highscore.push({"difficulty": difficulty, "score": score, "new": true})
  gameObj.highscore.sort((a, b) => b.score - a.score)   
  gameObj.highscore.sort((a, b) => b.difficulty - a.difficulty)
}

/**
 * Function for creating and filling a table for the highscore.
 */
function fillHighScoreTable() {
  const scoreboard = document.getElementById("scoreboard")
  scoreboard.innerHTML = `
    <h2>Highscore Table</h2>
    <table id="scoreTable" class="scoreTable">
      <thead>
        <tr>
          <th>Difficulty</th><th>Score</th>
        </tr>
      </thead>
      <tbody id="tableBody" class="tableBody"></tbody>
    </table>  
  `
  const tableBody = document.getElementById("tableBody")
  for (const item of gameObj.highscore) {
    const row = document.createElement("tr")

    //Adding a class to the new score and after removing the new tag.
    if (item.new) {
      row.classList.add("new")
      item.new = false 
    }

    const difficultyCell = document.createElement("td")
    const scoreCell = document.createElement("td")
  
    //Change back the difficulty 
    let difficultyText = ""
    switch (item.difficulty) {
    case 3: 
      difficultyText = "Hard" 
      break
    case 2: 
      difficultyText = "Normal" 
      break
    case 1: 
      difficultyText = "Easy" 
      break
    }

    difficultyCell.textContent = difficultyText
    scoreCell.textContent = item.score

    row.appendChild(difficultyCell)
    row.appendChild(scoreCell)

    tableBody.appendChild(row)
  }
}

/**
 * function for creating a clone.
 */
function cloneElement(element) {
  const clonedElement = element.cloneNode(true)
  clonedElement.style.width = `${gameObj.duckSize}px`
  clonedElement.style.height = `${gameObj.duckSize}px`
  return clonedElement
}

/**
 * function for start position of the duck outside the window on the right side.
 * Adds the style in the function.
 */
function startPosition(element) {
  const elementHeight = element.offsetHeight
  element.style.top = Math.floor(Math.random() * (window.innerHeight - elementHeight)) + "px"
  element.style.left = 0
}

/**
 * Function for placing an object in a random place on the screen.
 * For super duck and donald duck.
 */
function randomPlacement(element) {
  const elementHeight = element.offsetHeight
  const elementWidth = element.offsetWidth
  element.style.top = Math.floor(Math.random() * (window.innerHeight - elementHeight)) + "px"
  element.style.left = Math.floor(Math.random() * (window.innerWidth - elementWidth)) + "px"
}

/**
 * Function for centering an element.
 */
function centerElement(element) {
  element.style.top = (window.innerHeight / 2) - (element.offsetHeight / 2) + "px"
  element.style.left = (window.innerWidth / 2) - (element.offsetWidth / 2) + "px"
}

/**
 * Function for making an element small on click.
 */
function implode(event) {
  event.target.classList.add("implode")
  event.target.style.height = "2px"
  event.target.style.width = "2px"

  setTimeout(function() {
    event.target.remove()
  }, 2000)
}

/**
 * Function for positioning object in the corner.
 */
function cornerPlacment(element) {
  element.style.top = "10px"
  element.style.left = (window.innerWidth - element.offsetWidth) + "px"
}