const fs = require("fs"); // needed to read the input file

// ensure input_file path is provided
if (process.argv.length !== 3) {
	console.error("usage: node main.js <input_file>");
	return;
}

// get input_file path from program arguments
const filePath = process.argv[2];

// read input_file data
try {
	var data = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
} catch (err) {
	console.error(err);
	return;
}

// split input_file data into lines to ease the parsing
const lines = data.split("\n");

// prevent segfault
if (lines.length === 0) {
	console.error("Error: invalid input file");
	return;
}

// get lawn dimensions
const lawnDim = lines[0].split(" ");
// ensure lawn dimensions line is valid
if (lawnDim.length !== 2) {
	console.error("Error: invalid input file");
	return;
}
const xMax = parseInt(lawnDim[0]);
const yMax = parseInt(lawnDim[1]);

// ensure lawn dimensions are valid
if (isNaN(xMax) || isNaN(yMax) || xMax < 0 || yMax < 0) {
	console.error("Error: invalid input file");
	return;
}

const rotate_mower = (mower, rotation_dir) => {
	if (mower.dir === "N") mower.dir = rotation_dir === "R" ? "E" : "W";
	else if (mower.dir === "E") mower.dir = rotation_dir === "R" ? "S" : "N";
	else if (mower.dir === "S") mower.dir = rotation_dir === "R" ? "W" : "E";
	else mower.dir = rotation_dir === "R" ? "N" : "S";
};

const move_mower_forward = (mower) => {
	if (mower.dir === "N" && mower.y !== yMax) mower.y += 1;
	else if (mower.dir === "E" && mower.x !== xMax) mower.x += 1;
	else if (mower.dir === "S" && mower.y !== 0) mower.y -= 1;
	else if (mower.dir === "W" && mower.x !== 0) mower.x -= 1;
};

const execute_instructions = (instructions, mower) => {
	for (let i = 0; i < instructions.length; i++) {
		if (instructions[i] === "F") move_mower_forward(mower);
		else if (instructions[i] === "R" || instructions[i] === "L") {
			rotate_mower(mower, instructions[i]);
		} else throw new Error();
	}
};

// store mowers final position in order to log it only if the input file is valid
const mowers = [];

let i = 1;
while (i < lines.length) {
	// get mower infos
	const mowerInfos = lines[i].split(" ");
	// ensure mower infos line is valid
	if (mowerInfos.length !== 3) {
		console.error("Error: invalid input file");
		return;
	}
	const mower = {
		x: parseInt(mowerInfos[0]),
		y: parseInt(mowerInfos[1]),
		dir: mowerInfos[2],
	};

	// ensure mower infos are valid
	if (
		isNaN(mower.x) ||
		isNaN(mower.y) ||
		mower.x < 0 ||
		mower.y < 0 ||
		(mower.dir !== "N" &&
			mower.dir !== "E" &&
			mower.dir !== "S" &&
			mower.dir !== "W")
	) {
		console.error("Error: invalid input file");
		return;
	}

	// if last mower doesn't have any instructions we stop and log an error
	if (i + 1 >= lines.length) {
		console.error("Error: invalid input file");
		return;
	}

	// get mower instructions
	const instructions = lines[i + 1];

	// execute the instructions & ensure instructions are valid
	try {
		execute_instructions(instructions, mower);
	} catch {
		console.error("Error: invalid input file");
		return;
	}

	// save mower final position
	mowers.push(`${mower.x} ${mower.y} ${mower.dir}`);

	// go to next mower
	i += 2;
}

// log mowers final position
mowers.forEach((mower) => console.log(mower));
