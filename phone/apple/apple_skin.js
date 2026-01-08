// selecting side_navbar
var sidenavbar = document.querySelector(".side_navbar");

function shownavbar() {
    sidenavbar.style.left = "0";
}

function closenavbar() {
    sidenavbar.style.left = "-50%";
}

// selecting main image
function changeImage(img) {
  document.getElementById("mainPhone").src = img.src;
}

