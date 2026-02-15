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
var searchInput = document.getElementById("searchInput");
var modelList = document.querySelectorAll(".models_name div");

searchInput.addEventListener("keyup", function () {

    var enteredValue = searchInput.value.toUpperCase();

    modelList.forEach(function(item) {

        var modelName = item.textContent;

        if(modelName.toUpperCase().indexOf(enteredValue) < 0) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
        }

    });

});
