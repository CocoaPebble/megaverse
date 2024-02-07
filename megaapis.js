const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

class Megaverse {
  constructor() {
    this.candidateId = process.env.CANDIDATE_ID;
    this.app = axios.create({
      baseURL: "https://challenge.crossmint.io/api/",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async set(endpoint, data) {
    try {
      const response = await this.app.post(endpoint, {
        ...data,
        candidateId: this.candidateId,
      });

      console.log(
        `${data.planet} set successfully at row: ${data.row}, column: ${
          data.column
        }${data.color ? ", and with color: " + data.color : ""}${
          data.direction ? ", and direction: " + data.direction : ""
        }`
      );
      return;
    } catch (error) {
      console.error("Error send post ", error.message);
    }
  }
}

const getGoalMap = (candidateId) => {
  const goalURL = "/map/" + candidateId + "/goal";
  console.log(goalURL);
  return app
    .get(goalURL)
    .then((result) => {
      const mapdata = result.data;
      // console.log("Goal Map: ", mapdata);
      // console.log(JSON.stringify(mapdata));
      // console.log(
      //   "The map is length",
      //   mapdata["goal"].length,
      //   " and width",
      //   mapdata["goal"][0].length
      // );
      return result.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const findPlanet = (map) => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] !== "SPACE") {
        if (map[i][j] === "POLYANET") {
          setPolyanets(i, j);
        } else if (map[i][j].includes("SOLOON")) {
          if (map[i][j].includes("RED")) {
            setSoloons(i, j, "red");
          }
          if (map[i][j].includes("BLUE")) {
            setSoloons(i, j, "blue");
          }
          if (map[i][j].includes("PURPLE")) {
            setSoloons(i, j, "purple");
          }
          if (map[i][j].includes("WHITE")) {
            setSoloons(i, j, "white");
          }
        } else if (map[i][j].includes("COMETH")) {
          if (map[i][j].includes("UP")) {
            setCometh(i, j, "up");
          }
          if (map[i][j].includes("DOWN")) {
            setCometh(i, j, "down");
          }
          if (map[i][j].includes("LEFT")) {
            setCometh(i, j, "left");
          }
          if (map[i][j].includes("RIGHT")) {
            setCometh(i, j, "right");
          }
        }
      }
    }
  }
  return [-1, -1];
};

const resetPlanets = (map) => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "POLYANET") {
        deletePolyanets(i, j);
      } else if (map[i][j].includes("SOLOON")) {
        deleteSoloons(i, j);
      } else if (map[i][j].includes("COMETH")) {
        deleteCometh(i, j);
      }
    }
  }
};

// const map = getGoalMap(candidateId);
// setPolyanets(1, 1);
deletePolyanets(1, 1);
