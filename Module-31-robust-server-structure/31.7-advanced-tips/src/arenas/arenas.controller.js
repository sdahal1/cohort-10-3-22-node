const arenas = require("../data/arena-data");

function list(req,res,next){
    res.json({data: arenas})
}


function read(req,res,next){
    // const cityName = req.params.cityName;
    const {cityName} = req.params;
  
    let arenaName = arenas[cityName]
    if(arenaName === undefined){
      return next(`Arena from the given city ${cityName} not found!`)
    }
    res.json({data: {cityCode: cityName, arenaName} })
}


module.exports = {
    list,
    read
}