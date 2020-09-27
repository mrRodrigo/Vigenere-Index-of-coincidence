const readline = require("readline-sync")

const selectOneOfThreeKeys = (arrayOfCoincidenceSorted) => {
    const [ firstFrequently, secondFrequently, thirdFrequently ] = arrayOfCoincidenceSorted;

  
    const query = `Select one of this possible most incident character for this set: \n\n` +
                 `1 - [letter: "${firstFrequently.letter}" incidence: ${firstFrequently.incidence}]\n` +
                 `2 - [letter: "${secondFrequently.letter}" incidence: ${secondFrequently.incidence}]\n` +
                 `3 - [letter: "${thirdFrequently.letter}" incidence: ${thirdFrequently.incidence}]\n\n` 
    
    const response = readline.question(query);
   
    if (response == 1 || response == firstFrequently.letter){
      return firstFrequently.letter;
    }
    
    if (response == 2 || response == secondFrequently.letter){
      return secondFrequently.letter;
    }
    
    if(response == 3 || response == thirdFrequently.letter){
      return thirdFrequently.letter;
    }
    
}

module.exports = { 
  selectOneOfThreeKeys
}