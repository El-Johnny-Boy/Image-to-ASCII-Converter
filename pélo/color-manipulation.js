var img = new Image();
img.crossOrigin = 'anonymous';
img.src = 'https://avatars.githubusercontent.com/u/17520634?v=4';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var paragraph = document.getElementById("text");

const ascii = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|)}]?-_+~<>i!lI;:,\"^`'."
const squareSize = 5;
const step = 4 * squareSize;
const lineReturn = 4 * img.width * squareSize;

img.onload = function() {
	ctx.drawImage(img, 0, 0, img.width, img.height);
};

var original = function() {
	ctx.drawImage(img, 0, 0);
};

var sepia = function() {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		let red = data[i], green = data[i + 1], blue = data[i + 2];

		data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
		data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
		data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
	}
	ctx.putImageData(imageData, 0, 0);
}

var invert = function() {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		data[i]     = 255 - data[i];     // red
		data[i + 1] = 255 - data[i + 1]; // green
		data[i + 2] = 255 - data[i + 2]; // blue
	}
	ctx.putImageData(imageData, 0, 0);
};

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

function brightnessToAscii(value) {
	return Math.floor(value / 4);
}

function printAsciiImage(table) {
	console.log(characterImageLine, table.length);
	var characterImageLine = "";
	for (let i = 0; i < table.length; i++) {
		if (i % 80 == 0) {
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

    for (let i = 0; i < img.width / squareSize; i++) {
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


main = () => {
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;
  console.log(data);
  const asciiTable = squareAverage(data);
  // imageData.data = squareAverage(data);
  printAsciiImage(asciiTable);
  // ctx.putImageData(imageData, 0, 0);
}

const inputs = document.querySelectorAll('[name=color]');
for (const input of inputs) {
	input.addEventListener("change", function(evt) {
		switch (evt.target.value) {
			case "inverted":
				return invert();
			case "grayscale":
				return grayscale();
			case "sepia":
				return sepia();
			default:
				return main();
		}
	});
}