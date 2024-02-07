const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

console.log("CANDIDATE_ID: ", process.env.CANDIDATE_ID);

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
        `${data.entity} set successfully at row: ${data.row}, column: ${
          data.column
        }${data.color ? ", and with color: " + data.color : ""}${
          data.direction ? ", and direction: " + data.direction : ""
        }`
      );

      return response.data;
    } catch (error) {
      console.error("Error send post ", error.message);
    }
  }

  async delete(endpoint, data) {
    try {
      const response = await this.app.delete(endpoint, {
        data: {
          ...data,
          candidateId: this.candidateId,
        },
      });

      console.log(
        `${data.entity} deleted successfully at row: ${data.row}, column: ${
          data.column
        }`
      );

      return response.data;
    } catch (error) {
      console.error("Error delete ", error.message);
    }
  }
}

const getGoalMap = async () => {
  const goalURL = `https://challenge.crossmint.io/api/map/${process.env.CANDIDATE_ID}/goal`;
  try {
    const result = await axios.get(goalURL);
    const mapdata = result.data;
    console.log("Goal map data: ", mapdata);
    return mapdata['goal'];
  } catch (error) {
    console.error("Error get goal map ", error.message);
  }
};

const myMegaverse = new Megaverse();

const drawMyMegaverse = async (map) => {
  let promises = [];

  for (let i = 0; i < map.length; i++){
    for (let j = 0; j < map[i].length; j++){
      const value = map[i][j];
      if (value !== "SPACE") {
        const [prefix, suffix] = value.split("_");
        if (value === "POLYANET") {
          promises.push(myMegaverse.set("/polyanets", { entity: "POLYANETS", row: i, column: j }));
        }
        else if (suffix === "SOLOON" && prefix && ["WHITE", "RED", "BLUE", "PURPLE"].includes(prefix)) {
          promises.push(myMegaverse.set("/soloons", { entity: "SOLOONS", row: i, column: j, color: prefix.toLowerCase() }));
        }
        else if (suffix === "COMETH" && prefix && ["UP", "DOWN", "LEFT", "RIGHT"].includes(prefix)) {
          promises.push(myMegaverse.set("/comeths", { entity: "COMETHS", row: i, column: j, direction: prefix.toLowerCase() }));
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  };
    
  const results = await Promise.allSettled(promises);
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`POST ${index + 1} success:`, result.value);
    } else {
      console.error(`POST ${index + 1} FAILED:`, result.reason);
    }
  });
}

async function run() {
  try{

    const goalMap = await getGoalMap();
    await drawMyMegaverse(goalMap);
    console.log("DRAW MY MEGAVERSE");
  } catch (error) {
    console.error("Error run ", error.message);
  }
}

run();
