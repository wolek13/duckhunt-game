/**
 * Contains js code for making the box website responsive.
 */

const container = document.getElementById("container")
const allItems = document.getElementsByClassName("box")
const box = document.getElementsByClassName("box")[0]
let allSelected = document.getElementsByClassName("selected")
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
let counter = 0

/**
 * Function for positioning the box in the center.
 */
function centerBox() {
  const winHeight = window.innerHeight
  const winWidth = window.innerWidth
  const boxHeight = box.offsetHeight  // Using offsetHeight because i used it in the js course last year and i think it's better than clientHeight. 
  const boxWidth = box.offsetWidth

  box.style.top = (winHeight / 2) - (boxHeight / 2) + "px"
  box.style.left = (winWidth / 2) - (boxWidth / 2) + "px"
}

/**
 * Toggle function to be able to select items.
 */
function toggleSelected(event) {
  event.target.classList.toggle("selected")
}

/**
 * Function for making element disapear after 2 seconds.
 */
function doubleClick(event) {
  event.target.classList.add("animateSize")
  event.target.style.height = "2px"
  event.target.style.width = "2px"

  setTimeout(function() {
    event.target.remove()
  }, 2000)
}

/**
 * Function for toggling the shap of the box to circle.
 */
function toggleCircle() {
  for (let i = 0; i < allSelected.length; i++) {
    allSelected[i].classList.toggle("circle")
  }
}

/**
 * Function for changing the selected items color.
 */
function changeColor() {
  for (let i = 0; i < allSelected.length; i++) {
    allSelected[i].style.backgroundColor = colors[counter++ % colors.length]
  }
}

/**
 * Function to select all the elements.
 */
function selectAll() {
  for (const i of allItems) {
    if (!i.classList.contains("selected")) {
      i.classList.add("selected")
    }
  }
}

/**
 * Function for unselecting all the items.
 */
function unSelectAll() {
  for (const i of allItems) {
    if (i.classList.contains("selected")) {
      i.classList.remove("selected")
    }
  }
}

/**
 * Function for deleting the selected elements.
 */
function removeSelected() {
  const selected = document.querySelectorAll(".selected")
  for (const i of selected) {
    i.remove()
    console.log(i)
  }
}

/**
 * Function for making a random object.
 */
function randomObject() {
  const newBox = document.createElement("div")
  newBox.classList.add("box")

  // Random shape, between square and circle.
  if (Math.random() >= 0.5) {
    newBox.classList.add("circle")    
  }
  //Random color for the item.
  newBox.style.backgroundColor = colors[Math.floor(Math.random() * (colors.length))]    
  
  //Random placement of the element.
  const boxHeight = box.offsetHeight
  const boxWidth = box.offsetWidth
  newBox.style.top = Math.floor(Math.random() * (window.innerHeight - boxHeight)) + 'px'
  newBox.style.left = Math.floor(Math.random() * (window.innerWidth - boxWidth)) + 'px'

  container.appendChild(newBox)

  // Eventlisteners for the new element.
  newBox.addEventListener("click", toggleSelected)
  newBox.addEventListener("dblclick", doubleClick)
}

/**
 * Function for moving the selected items.
 */
function move (x, y) {
  for (const element of allSelected) {
    const oldY = parseFloat(element.style.top)
    const oldX = parseFloat(element.style.left)

    const newY = oldY + y
    const newX = oldX + x

    if (newY >= 0 && newY + element.offsetHeight <= window.innerHeight &&
        newX >= 0 && newX + element.offsetWidth <= window.innerWidth) {
      element.style.top = newY + 'px'
      element.style.left = newX + 'px'
    }
  }
}

/**
 * Function for changing the color and shape of the selected element during 5 seconds.
 */
function animateTimer() {
  let count = 0
  const timer = setInterval(() => {
    for (const element of allSelected) {
      //Random color for the item.
      element.style.backgroundColor = colors[Math.floor(Math.random() * (colors.length))]   

      if (element.classList.contains("circle")){
        element.classList.remove("circle")
      } else {element.classList.add("circle")}

      //Random placement of the element.
      const boxHeight = element.offsetHeight
      const boxWidth = element.offsetWidth
      element.style.top = Math.floor(Math.random() * (window.innerHeight - boxHeight)) + 'px'
      element.style.left = Math.floor(Math.random() * (window.innerWidth - boxWidth)) + 'px'
    }
    ++count
    if (count >= 5) {
      clearInterval(timer)
    }
  } ,1000)
}


/**
 * Function for all the keydown events.
 */
function keyboardPress(event) {
  const key = event.key

  switch (key) {
  case "e":
    toggleCircle()
    break
  case "r":
    changeColor()
    break
  case "i":
    selectAll()
    break
  case "u":
    unSelectAll()
    break
  case "y":
    removeSelected()
    break
  case "p":
    randomObject()
    break
  case "ArrowUp":
    move(0, -10)
    break
  case "ArrowDown":
    move(0, 10)
    break
  case "ArrowLeft":
    move(-10, 0)
    break
  case "ArrowRight":
    move(10, 0)
    break
  case "d":
    animateTimer()
    break
  }
}

/**
 * Eventlisteners
 */
window.addEventListener("resize", centerBox)
document.addEventListener("keydown", keyboardPress)

box.addEventListener("click", toggleSelected)
box.addEventListener("dblclick", doubleClick)

centerBox()