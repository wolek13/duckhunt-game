/**
 * Contains the resposive elements in my website.
 */

// Get the relative elements by id name.
const menuToggle = document.getElementById("menu-toggle")
const navLinks = document.getElementById('nav-links')

// A click event for the menu Toggle.
menuToggle.addEventListener('click', () => {
  // Toggle the 'show' class on the nav links to show/hide the menu
  navLinks.classList.toggle('show')
})