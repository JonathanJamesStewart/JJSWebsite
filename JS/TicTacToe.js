var isX = true;

function foo(){
	var ul = document.getElementById("UL");
	if (isX) {
		ul.src = "Images/X.jpg";
		isX = false;
	}else{
		ul.src = "Images/Blank.jpg";
		isX = true;
	}
}