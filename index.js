import { encode, initialHexToBin, finalBinToHex } from "./des.js";


String.prototype.replaceAtIndex = function (index, value) {
	return (
		this.substring(0, index) +
		value +
		this.substring(index + value.length)
	);
};


function generateDifferentIndices(dist) {
	let indices = [];
	while (indices.length < dist) {
		let index = Math.floor(Math.random() * 65);
		if (indices.indexOf(index) === -1) indices.push(index);
	}
	return indices;
}

function generateSingleBitFlipList(input) {
	let values = [input];
	let indices = generateDifferentIndices(5);
	for (let i = 0; i < 5; i++) {
		values.push(input.replaceAtIndex(indices[i], input[indices[i]] === "0" ? "1" : "0"));
	}
	return values;
}
function generateDifferentHDList(input) {
	let values = [input];
	for (let i = 0; i < 5; i++) {
		let indices = generateDifferentIndices(i + 1);
		let newInput = input;
		indices.forEach(index => {
			newInput = newInput.replaceAtIndex(index, input[index] === "0" ? "1" : "0");
		});
		values.push(newInput);
	}
	return values;
}

function showTable1() {
	document.getElementById("boxplot").style.display = "none";
	document.getElementById("table1").style.display = "block";
	document.getElementById("table2").style.display = "none";
	document.getElementById("table3").style.display = "none";
}

function showTable2() {
	document.getElementById("boxplot").style.display = "none";
	document.getElementById("table1").style.display = "none";
	document.getElementById("table2").style.display = "block";
	document.getElementById("table3").style.display = "none";
}

function showTable3() {
	document.getElementById("boxplot").style.display = "none";
	document.getElementById("table1").style.display = "none";
	document.getElementById("table2").style.display = "none";
	document.getElementById("table3").style.display = "block";
}

function showBoxPlot() {
	document.getElementById("boxplot").style.display = "block";
	document.getElementById("table1").style.display = "none";
	document.getElementById("table2").style.display = "none";
	document.getElementById("table3").style.display = "none";
}

function generateBoxPlot(HDList) {
	let points = [];

	for (let j = 0; j <= 16; j++) {
		let result = [];
		for (let i = 1; i <= 5; i++) {
			result.push(HDList[i][j]);
		}
		points.push({
			y: result,
			type: "box",
			name: `<b>Round ${j}</b>`,
		});
	}

	let layout = {
		title: "<b>Box Plot: </b>" + "Graph showing variation of Hamming Distance in each j",
		xaxis: {
			title: "<b>Round Number</b>",
		},
		yaxis: {
			title: "<b>Hamming Distance</b>",
		},
		height: 650,
		width: 800,
		font: {
			family: 'Zilla Slab',
  }
	};

	let config = {
		responsive: true,
	};

	Plotly.newPlot("boxplot-plot", points, layout, config).then((gd) => {
		var boxCalcData = gd.calcdata;

		var joints = [];
		for (let i = 0; i < boxCalcData.length - 1; i++) {
			var box0 = boxCalcData[i][0];
			var box1 = boxCalcData[i + 1][0];

			joints.push({
				type: "line",
				x0: box0.x,
				x1: box1.x,
				y0: box0.med,
				y1: box1.med,
			});
		}

		Plotly.relayout(gd, "shapes", joints);
	});
}

function convert(str1, str2) {
	let result = "";
	for (let i = 0; i < 16; i++) {
		if (str1[i] === str2[i]) result += String(str2[i]);
		else result += "<b style='color:#0075ff'>" + str2[i] + "</b>";
	}
	return result;
}

function generateTable1(plaintextList, keyList, ciphertextList) {
	let tbody = document.getElementById("table1-body");
	let plaintext = finalBinToHex(plaintextList[0]);
	let key = finalBinToHex(keyList[0]);

	tbody.innerHTML = "";
	for (let i = 0; i < 6; i++) {
		let row = document.createElement("tr");
		tbody.appendChild(row);
		let cellType = document.createElement("th");
		cellType.innerHTML = i;
		let cellPlaintext = document.createElement("td");
		cellPlaintext.innerHTML = convert(plaintext, finalBinToHex(plaintextList[i]));
		let cellKey = document.createElement("td");
		cellKey.innerHTML = convert(key, finalBinToHex(keyList[i]));
		let cellCiphertext = document.createElement("td");
		cellCiphertext.innerHTML = finalBinToHex(ciphertextList[i]);
		row.appendChild(cellType);
		row.appendChild(cellPlaintext);
		row.appendChild(cellKey);
		row.appendChild(cellCiphertext);
	}
}

function generateTable2(HDList) {
	let tbody = document.getElementById("table2-body");
	tbody.innerHTML = "";
	for (let i = 0; i < 17; i++) {
		let row = document.createElement("tr");
		tbody.appendChild(row);
		let cellType = document.createElement("th");
		cellType.innerHTML = i;
		let cellHD1 = document.createElement("td");
		cellHD1.innerHTML = HDList[1][i];
		let cellHD2 = document.createElement("td");
		cellHD2.innerHTML = HDList[2][i];
		let cellHD3 = document.createElement("td");
		cellHD3.innerHTML = HDList[3][i];
		let cellHD4 = document.createElement("td");
		cellHD4.innerHTML = HDList[4][i];
		let cellHD5 = document.createElement("td");
		cellHD5.innerHTML = HDList[5][i];
		row.appendChild(cellType);
		row.appendChild(cellHD1);
		row.appendChild(cellHD2);
		row.appendChild(cellHD3);
		row.appendChild(cellHD4);
		row.appendChild(cellHD5);
	}
}

function generateTable3(intermediates) {
	let tbody = document.getElementById("table3-body");
	tbody.innerHTML = "";
	for (let i = 0; i < 17; i++) {
		let row = document.createElement("tr");
		tbody.appendChild(row);
		let cellType = document.createElement("th");
		cellType.innerHTML = i;
		let cellHD0 = document.createElement("td");
		cellHD0.innerHTML = finalBinToHex(intermediates[0][i]);
		let cellHD1 = document.createElement("td");
		cellHD1.innerHTML = finalBinToHex(intermediates[1][i]);
		let cellHD2 = document.createElement("td");
		cellHD2.innerHTML = finalBinToHex(intermediates[2][i]);
		let cellHD3 = document.createElement("td");
		cellHD3.innerHTML = finalBinToHex(intermediates[3][i]);
		let cellHD4 = document.createElement("td");
		cellHD4.innerHTML = finalBinToHex(intermediates[4][i]);
		let cellHD5 = document.createElement("td");
		cellHD5.innerHTML = finalBinToHex(intermediates[5][i]);
		row.appendChild(cellType);
		row.appendChild(cellHD0);
		row.appendChild(cellHD1);
		row.appendChild(cellHD2);
		row.appendChild(cellHD3);
		row.appendChild(cellHD4);
		row.appendChild(cellHD5);
	}
}

document.getElementById("plot").addEventListener("click", () => {
	let visibliity = document.getElementById("plot-slider").style.display;
	let value = document.getElementById("plot").value;
	if (visibliity == "none") return;
	if (value == 0) showBoxPlot();
	else if (value == 1) showTable1();
	else if (value == 2) showTable2();
	else if (value == 3) showTable3();
});

function calculateHD(intermediates) {
	let output = [];
	intermediates.forEach((inputs, index) => {
		let result = [];
		inputs.forEach((input, id) => {
			let dist = 0;
			for (let i = 0; i < 64; i++) {
				if (input[i] !== intermediates[0][id][i]) dist++;
			}
			result.push(dist);
		});
		output.push(result);
	});
	return output;
}

function appendZeros() {
	let plaintext = document.getElementById("plaintext").value;
	let key = document.getElementById("key").value;

	if (plaintext.length > 16) {
		plaintext = plaintext.slice(0, 16);
	} else if (plaintext.length < 16) {
		plaintext = plaintext.padEnd(16, "0");
	}

	if (key.length > 16) {
		key = key.slice(0, 16);
	} else if (key.length < 16) {
		key = key.padEnd(16, "0");
	}
	document.getElementById("plaintext").value = plaintext;
	document.getElementById("key").value = key;
}


document.getElementById("submit").addEventListener("click", () => {
	appendZeros();
	
	let plaintext = document.getElementById("plaintext").value;
	let key = document.getElementById("key").value;


	plaintext = initialHexToBin(plaintext);
	key = initialHexToBin(key);

	let mode = document.getElementById("mode").value;

	let plaintextList = [];
	let keyList = [];

	if (mode == "0") {
		plaintextList = generateSingleBitFlipList(plaintext);
		keyList = Array(6).fill(key);
	} else if (mode == "1") {
		plaintextList = generateDifferentHDList(plaintext);
		keyList = Array(6).fill(key);
	} else {
		plaintextList = Array(6).fill(plaintext);
		keyList = generateSingleBitFlipList(key);
	}

	let encryptedList = [];
	for (let i = 0; i < 6; i++) {
		encryptedList.push(encode(plaintextList[i], keyList[i]));
	}


	document.getElementById("ciphertext").value = finalBinToHex(encryptedList[0].cipher);

	let HDList = calculateHD(encryptedList.map((object) => object.intermediates));

	generateBoxPlot(HDList);
	generateTable1(plaintextList, keyList, encryptedList.map((object) => object.cipher));
	generateTable2(HDList);
	generateTable3(encryptedList.map((object) => object.intermediates));

	let plotSlider = document.getElementById("plot-slider");
	if (plotSlider.style.display != "block") {
		plotSlider.style.display = "block";
		showBoxPlot();
	}


});
