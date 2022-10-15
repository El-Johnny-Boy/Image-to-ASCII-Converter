var img = new Image();
img.crossOrigin = "anonymous";
img.src = "https://avatars.githubusercontent.com/u/17520634?v=4";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

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

const squareSize = 2;

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

function brightnessToAscii(value) {
	return Math.floor(value / (256 / ascii.length) );
}

function printAsciiImage(table) {
	var characterImageLine = "";
	for (let i = 0; i < table.length; i++) {
		if (i % (img.width / squareSize) == 0) {
			var br = document.createElement("br");
			paragraph.appendChild(document.createTextNode(characterImageLine));
			paragraph.appendChild(br);
			characterImageLine = ""
		}
		characterImageLine += table[i];
	}
	
	// paragraph.appendChild(document.createTextNode(characterImageLine));
}

function squareAverage(data) {
	var r = 0;
    var g = 0;
    var b = 0;
	var asciiImageData = [];
	
	const step = 4 * squareSize;
	const lineReturn = 4 * img.width * squareSize;
	
    for (let i = 0; i < img.height / squareSize; i++) {
		for (let j = 0; j < img.width / squareSize; j++) {
			asciiImageData.push(ascii[brightnessToAscii(data[(i * lineReturn + j * step)])]);
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

		rgb = (r + b + g) / 3

		//Change pixels data
        for (let k = 0; k < squareSize; k++) {
          for (let l = 0; l < squareSize; l++) {
            data[(i * lineReturn + j * step) + 4 * (l + k * img.width)] = rgb;
            data[(i * lineReturn + j * step) + 4 * (l + k * img.width) + 1] = rgb;
            data[(i * lineReturn + j * step) + 4 * (l + k * img.width) + 2] = rgb;
          }
        }
		
      }
    }

	for (let i = 0; i < data.length; i += 4) {
	}

    return asciiImageData;
	// return data;
}



var grayscale = function() {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
		data[i]     = avg; // red
		data[i + 1] = avg; // green
		data[i + 2] = avg; // blue
	}
	ctx.putImageData(imageData, 0, 0);
};

main = () => {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    var data = imageData.data;
	//console.log(data);
	
	const asciiTable = squareAverage(data);
    // imageData.data = squareAverage(data);
	printAsciiImage(asciiTable);
	// ctx.putImageData(imageData, 0, 0);

};