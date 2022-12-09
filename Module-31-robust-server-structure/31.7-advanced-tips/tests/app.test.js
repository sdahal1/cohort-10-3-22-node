const request = require("supertest");
const teams = require("../src/data/teams-data");
const app = require("../src/app");


//describe is use to group related tests together
describe("path /teams", () => {
  // Add tests here
  beforeEach(() => {
    teams.splice(0, teams.length); // Clears out the teams dataset in memory so that we can test it with a test dataset
  });

  describe("GET method to get all teams", ()=>{
    it("gets back an array of team objects",async ()=>{
        let expected = [
            {
              id: 1,
              name: "Lakers",
              city: "Los Angeles",
              state: "California",
              players: [
                  "Lebron",
                  "Anthony Davis",
                  "Russell Westbrook"
              ]
          },
          {
              id: 2,
              name: "Warriors",
              city: "San Fran",
              state: "California",
              players: [
                  "Steph Curry",
                  "Klay Thompson"
              ]
          
          }
        ];
        teams.push(...expected)

        //test the api and store the response in a variable
        const response = await request(app).get("/teams");
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expected);

        // const promiseFromAPICall = await request(app).get("/teams");
        // promiseFromAPICall
        //     .then(response=>{
        //         expect(response.status).toBe(200);
        //         expect(response.body.data).toEqual(expected);

        //     })
    })
  })

  describe("POST Method to create a new player. Must return a response with an team object containing a newly created id", ()=>{
    it("creates a new team and assigns an id to the team", async ()=>{
        let newTeamToCreate = {
            "name": "NJ Devils",
            "city": "New Jersey",
            "state": "New Jersey",
            "players": [
                "Martin Brodeur",
                "N Bastian"
            ]
        }

        const response = await request(app)
            .post("/teams")
            .set("Accept", "application/json")
            .send({data: newTeamToCreate})
        
        expect(response.status).toBe(201);
        expect(response.body.data).toEqual({
            id:1,
            ...newTeamToCreate,
        })
    })

    it("returns 400 if name is missing", async () => {
        let newTeamToCreate = {
            "city": "New Jersey",
            "state": "New Jersey",
            "players": [
                "Martin Brodeur",
                "N Bastian"
            ]
        }

        const response = await request(app)
          .post("/teams")
          .set("Accept", "application/json")
          .send({ data: newTeamToCreate});
    
        expect(response.status).toBe(400);
      });

  })
});