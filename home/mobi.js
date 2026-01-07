document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    alert("Added to cart!");
  });
});
// selecting side_navbar
var sidenavbar = document.querySelector(".side_navbar");

function shownavbar() {
    sidenavbar.style.left = "0";
}

function closenavbar() {
    sidenavbar.style.left = "-50%";
}