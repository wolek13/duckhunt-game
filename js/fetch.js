/**
 * File for fetching and presenting data in the website.
 */

/**
 * Function for fetching the data.
 * Returns an array with data in json files.
 */
async function getData() {
  let dataSwe = await fetch("https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom05/data/sweden.json")
  let jsonSwe = await dataSwe.json()

  let dataNor = await fetch("https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom05/data/norway.json")
  let jsonNor = await dataNor.json()

  let dataDen = await fetch("https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom05/data/denmark.json")
  let jsonDen = await dataDen.json()

  return [jsonSwe, jsonNor, jsonDen]
}

/**
 * Function for showing the fetched data in the table using html code.
 */
function showData (allData, chosenYear) {
  let tableBody = document.getElementById("tableBody")
  tableBody.innerHTML = ""

  for (const item of allData) {
    const chosenYearData = item.data.find(function(data) {return data.year === chosenYear})
    if (chosenYear) {
      tableBody.innerHTML += `
        <tr>
          <td>${item.country}</td>
          <td class="co2 ${(item.country).toLowerCase()}">${chosenYearData.co2}</td>
          <td class="co2pc ${(item.country).toLowerCase()}">${chosenYearData.co2_per_capita}</td>
          <td class="oilco2pc ${(item.country).toLowerCase()}">${chosenYearData.oil_co2_per_capita}</td>
        </tr>
      `
    }
  }
}

/**
 * Function for filling the select element.
 */
function fillSelectYear() {
  let mySelection = document.getElementById("mySelection")
  for (let i = 1900; i <= 2019; i++) {
    mySelection.innerHTML += `
      <option value="${i}" class="year">${i}</option>
    `
  }
}

/**
 * Function for finding the index of the lowest number in an array.
 */
function findMinNum(htmlCol) {
  let numArr = [...htmlCol].map(element => parseFloat(element.innerText))
  numArr = numArr.map(num => {
    if (Number.isNaN(num)) {
      num = Infinity
    }
    return num
  })
  return numArr.indexOf(Math.min(...numArr))
}

/**
 * Function for finding and showing the winner.
 */
function findWinner() {
  let co2ArrHtml = document.getElementsByClassName("co2")
  let co2pcArrHtml = document.getElementsByClassName("co2pc")
  let oilco2pcArrHtml = document.getElementsByClassName("oilco2pc")

  //Finding the index of the winner of every category.
  const co2Min = findMinNum(co2ArrHtml)
  const co2pcMin = findMinNum(co2pcArrHtml)
  const oilco2pcMin = findMinNum(oilco2pcArrHtml)

  //Highlighting the winner.
  const winnerco2 = [...co2ArrHtml][co2Min]
  winnerco2.classList.add("winner")

  const winnerCo2pc = [...co2pcArrHtml][co2pcMin]
  winnerCo2pc.classList.add("winner")

  const winnerOilco2pc = [...oilco2pcArrHtml][oilco2pcMin]
  winnerOilco2pc.classList.add("winner")
}

const data = await getData()
fillSelectYear()

//Filling the table on users click action.
let mySelection = document.getElementById("mySelection")
mySelection.addEventListener("change", function(event) {
  let selectedYear = parseInt(event.target.value)
  
  showData(data, selectedYear)
  findWinner()
})