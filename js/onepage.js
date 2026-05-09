/**
 * Contains the resposive elements in my website.
 */

// Get the relative elements by id name.
const showSidbar = document.getElementById("show-sidebar")
const sidebar = document.getElementById('sidebar')
const closeSidebar = document.getElementById('close-sidebar')
const sideLink = document.getElementById('sidelink')

// A click event for the menu Toggle.
showSidbar.addEventListener('click', () => {
  sidebar.style.display = 'flex'
  closeSidebar.style.display = 'block'
})
// A click event for the menu Toggle.
closeSidebar.addEventListener('click', () => {
  sidebar.style.display = 'none'
  closeSidebar.style.display = 'none'
})

sideLink.addEventListener('click', () => {
  sidebar.style.display = 'none'
  closeSidebar.style.display = 'none'
})
