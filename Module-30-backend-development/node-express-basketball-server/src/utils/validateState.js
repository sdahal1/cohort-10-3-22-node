function onlyLetters(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function validateState(req,res,next){
    const {stateName} = req.params;

    //if statename is one char long then its invalid statename
    if(stateName.length < 2){
        return next("State name is invalid. Name too short");
    }
    //if statename is not purley letters, then its not valid either
    if(onlyLetters(stateName)===false){
        return next("State name is invalid. Can only have alphabet letters");
    }

    next();
}


module.exports = validateState;