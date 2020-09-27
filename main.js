const fs = require("fs");
const MessageBuilder = require("./util/MessageBuilder");

const { english, portuguese } = require("./util/frequency");

const {
  countFrequency,
  calculateDistanceBetweenChars,
  mostFrequentlySorted,
  sliceTextByM,
  calculeIncidenceOfEachTextPart,
  decryptByKeyShift
} = require("./util");

const language = portuguese;
const indexOfCoincidence = language.indexOfCoincidence;

// até quando testar o provavel tamanho da chave
let maxM = 20;

console.log("==".repeat(23));

const rawText = fs.readFileSync("./test/text.txt", "utf8").trim();

// probabilidades para cada M (tentativa)
const propableKeySize = [];
// texto divido pelo M que esta sendo calculado seu ic
let slicedText = {};

for (let i = 1; i <= maxM; i++) {
  slicedText = sliceTextByM(i, rawText);

  const { average } = calculeIncidenceOfEachTextPart(slicedText);

  // armazena cada ic de cada M tentado
  propableKeySize[i] = average;
}

// Econtra a melhor ic de todas tentativas
const bestIncidence = propableKeySize.reduce((prev, curr, index) => {
  return Math.abs(curr - indexOfCoincidence) <
    Math.abs(prev - indexOfCoincidence)
    ? curr
    : prev;
});

// pega o tamanho da chave
const keyLenght = propableKeySize.indexOf(bestIncidence);
// divide o texto de acordo com o tamanho da chave encontrada
const parsedByKey = sliceTextByM(keyLenght, rawText);

//chave (plain text)
let key = '';
//distancia da letra mais incidente da lingua 
let keyShift = [];

// para cada parte calcula o char mais incidente
Object.keys(parsedByKey).forEach(async (e) => {
    const incidence = countFrequency(parsedByKey[e].text);

    // depois de analizar a frequencia do texto, ordena por letra mais incidente
    const arrayOfCoincidenceSorted = mostFrequentlySorted(incidence);

    // formata e pergunta ao usuario qual das tres letras mais recorrentes 
    // deve ser comparada com a letra mais incidente da lingua
    const letterKey = MessageBuilder.selectOneOfThreeKeys(arrayOfCoincidenceSorted);

    key += letterKey;

    const distanceByLanguage = Math.abs(calculateDistanceBetweenChars(letterKey, language.mostFrequentlyChar))
    
    // armazena a distancia em relação a letra mais incidente da linguagem
    keyShift[e] = distanceByLanguage;
});


decryptByKeyShift(keyShift, rawText)

console.log(`Key Length: ${keyLenght}   ||    IC: ${bestIncidence}\n`);
console.log(`Possible key: ${key} \n`);
console.log(`Result is saved on out.txt file. \n`);
