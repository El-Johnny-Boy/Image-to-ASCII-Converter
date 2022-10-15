var img = new Image();
img.crossOrigin = "anonymous";
img.src = "https://avatars.githubusercontent.com/u/17520634?v=4";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = img.width;
canvas.height = img.height;

var paragraph = document.getElementById("text");

// const ascii = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|)}]?-_+~<>i!lI;:,\"^`'."
const ascii = "@#$%?*+;:,.";


// var video = document.querySelector("#videoElement");

// if (navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices.getUserMedia({ video: true })
//     .then(function (stream) {
//       video.srcObject = stream;
//     })
//     .catch(function (err0r) {
//       console.log("Something went wrong!");
//     });
// }

img.onload = () => {
	ctx.drawImage(img, 0, 0, img.width, img.height);
};

var squareSize = 5;

function updateSliderValue() {
	var slider = document.getElementById("range").value;
	document.getElementById("slider-value").innerHTML = "Value: " + slider;

	return slider;
}

//Function that draws a black square on the coordinates (i, j).
//Used to debug the indexing problem I faced for the main loop.
function drawBlackSquare(i, j, data) {
	console.log(i, j, i * lineReturn + j * step);
	for (let k = 0; k < squareSize; k++) {
		for (let l = 0; l < squareSize; l++) {
			data[(i * lineReturn + j * step) + 4 * (l + k * img.width)] = 0;
			data[(i * lineReturn + j * step) + 4 * (l + k * img.width) + 1] = 0;
			data[(i * lineReturn + j * step) + 4 * (l + k * img.width) + 2] = 0;
		}
	}
	
	return data;
}

//Assign an ascii character depending on the brightness value.
//Since I'm converting the pixels to grey, it's just a integer value ranging from 0 to 255.
function brightnessToAscii(value) {
	return Math.floor(value / (256 / ascii.length) );
}

//Function that displays the ascii array to the screen.
function printAsciiImage(table) {
	const newLine = Math.floor(img.width / squareSize);
	var characterImageLine = "";
	document.getElementById("text").innerHTML ="";
	for (let i = 0; i < table.length; i++) {
		if (i % newLine == 0) {
			var br = document.createElement("br");
			paragraph.appendChild(document.createTextNode(characterImageLine));
			paragraph.appendChild(br);
			characterImageLine = ""
		}
		characterImageLine += table[i];
	}
	
}

//Main loop
function squareAverage(data) {
	var r = 0;
    var g = 0;
    var b = 0;
	var asciiImageData = [];
	
	//Each pixel has four cells in the data array, one for red, green, blue, and alpha.
	//So I need to take that into account to jump from one pixel to another.
	const step = 4 * squareSize;

	//Since the image data array is a one-dimensionnal array, I also need to account for the line returns of the image.
	const lineReturn = 4 * img.width * squareSize;
	
    for (let i = 0; i < Math.floor(img.height / squareSize); i++) {
		for (let j = 0; j < Math.floor(img.width / squareSize); j++) {
			
			r = 0;
			g = 0;
			b = 0;
			for (let k = 0; k < squareSize; k++) {
				for (let l = 0; l < squareSize; l++) {
					r += data[(i * lineReturn + j * step) + 4 * (l + k * img.width)];
					g += data[(i * lineReturn + j * step) + 4 * (l + k * img.width) + 1];
					b += data[(i * lineReturn + j * step) + 4 * (l + k * img.width) + 2];
					
				}
			}
			
			r /= squareSize ** 2;
			g /= squareSize ** 2;
			b /= squareSize ** 2;
			
			//Take the greyscaled value by averaging the red, green and blue values.
			//I could have made it in one step but I wanted to see the non greyed result first.
			rgb = (r + b + g) / 3
			
			//Change pixels data
			for (let k = 0; k < squareSize; k++) {
				for (let l = 0; l < squareSize; l++) {
					data[(i * lineReturn + j * step) + 4 * (l + k * img.width)] = rgb;
					data[(i * lineReturn + j * step) + 4 * (l + k * img.width) + 1] = rgb;
					data[(i * lineReturn + j * step) + 4 * (l + k * img.width) + 2] = rgb;
				}
			}
			
			//We add the ascii equivalent of each square of pixels into an array. 
			asciiImageData.push(ascii[brightnessToAscii(data[(i * lineReturn + j * step)])]);
		
      }
    }

	for (let i = 0; i < data.length; i += 4) {
	}

    return asciiImageData;
	// return data;
}

main = () => {
	squareSize = document.getElementById("range").value;
	var slider = updateSliderValue();
	document.getElementById("text").style.fontSize = slider*1.83 + "px";
	console.log(slider, slider * 1.83);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    var data = imageData.data;
	//console.log(data);
	
	const asciiTable = squareAverage(data);
    // imageData.data = squareAverage(data);
	printAsciiImage(asciiTable);
	// ctx.putImageData(imageData, 0, 0);

};