document.querySelectorAll(".product-card button").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Mobile skin added to cart!");
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