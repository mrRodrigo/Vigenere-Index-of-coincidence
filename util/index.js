const fs = require("fs");
const { byLetter } = require("./alphabet");

/**
 * @description Para cada parte do texto calcula seu ic
 * @param {Object} object - Objeto parcialmente dividido pela func sliceTextByM()
 * @returns {Object} { <index> : <text> }
 */
// 
const calculeIncidenceOfEachTextPart = (object) => {
  const eachCoincidence = [];

  Object.keys(object).forEach((k) => {
    const { text } = object[k];
    const coincidence = calculateIndexOfCoincidence(text);

    object[k].indexOfCoincidence = coincidence;
    eachCoincidence.push(coincidence);
  });

  const average = calculeAverageOfArray(eachCoincidence);

  return { parsedText: object, eachCoincidence, average };
};


/**
 * @description Divide o texto em M Partes
 * @param {Number} m - Tamanho da chave
 * @param {String} text - Texto a ser dividio
 * @returns {Object} { <index> : <text> }
 */
const sliceTextByM = (m, text) => {
  const slicedText = {};

  let divideInMparts = m;

  while (divideInMparts--) {
    slicedText[divideInMparts] = { text: "" };
  }

  Object.keys(slicedText).forEach((partOfText) => {
    let i = Number(partOfText);
    while (i < text.length) {
      slicedText[partOfText].text += text[i];
      i += m;
    }
  });

  return slicedText;
};

/**
 * @description Calcula a distancia entre duas letras no alfabeto.
 * @param {Char} a letra qualquer
 * @param {Char} b letra qualquer
 */
const calculateDistanceBetweenChars = (a, b) => {
    return byLetter[b] - byLetter[a];
};

/**
 * @description Transforma e ordena um objeto com frequencia a cada letra.
 * @param {Object} incidence - Objeto contendo a frequencia de cada letra de um texto resultado de countFrequency().
 * @returns {Array} eg. [ { letter: 'c': incidence: 1 } , ... ] ordenado.
 */
const mostFrequentlySorted = (incidence) => {
    const arrayOfCoincidence = Object.keys(incidence).map((key) => ({
      letter: [key],
      incidence: incidence[key],
    }));

    const arrayOfCoincidenceSorted = arrayOfCoincidence.sort(
      (a, b) => parseFloat(b.incidence) - parseFloat(a.incidence)
    );

    return arrayOfCoincidenceSorted;
};

/**
 * @description Conta a frequencia de cada letra em um texto.
 * @param {String} text - Texto qualquer.
 * @returns {Object} eg. { 'c': 1 , 'b': 2 }.
 */
const countFrequency = (text) => {
    const countIncidence = {};

    [...text].forEach((char) => {
      countIncidence[char]
        ? (countIncidence[char] += 1)
        : (countIncidence[char] = 1);
    });

    return countIncidence;
};

/**
 * @description Dado um texto qualquer, é calculado seu indice de coincidencia IC.
 * @param {String} text - texto qualquer.
 * @returns {Number} resultado do calculo do indice de coincidencia da quele texto.
 */
const calculateIndexOfCoincidence = (text) => {
    let n = text.length;
    let sumOfChars = 0;

    // para cada letra do texto, armazena em countIncidence a incidencia da letra.
    const countIncidence = countFrequency(text);

    // Soma da incidencia de cada letra * incidencia de cada letra - 1.
    Object.keys(countIncidence).forEach((letter) => {
      const letterIncidence = countIncidence[letter];
      sumOfChars += letterIncidence * letterIncidence - 1;
    });

    return sumOfChars / (n * (n - 1));
};

/**
 * @description Calcula a media de um array de numeros.
 * @param {Array = []} array Array de numeros.
 * @returns Zero se n for possivel fazer a media, ou a propria media.
 */
const calculeAverageOfArray = (array = []) =>
  array.reduce((a, b) => a + b, 0) / array.length;

/**
 * @description decifra um texto a partir de um array de casas que deve ser deslocado
 * @param {Array} keyShift array de casas que contem a mascara que deve ser aplicado no texto
 * @param {String} rawText texto encriptado
 */
const decryptByKeyShift = (keyShift, rawText) => {
  const min = 'a'.charCodeAt(), max = 'z'.charCodeAt();
  let index = 0, decripted = '';

  // para cada letra do texto cifrado
  for(let i = 0; i < rawText.length; i++){
      // pega deslocamento atual
      const distance = keyShift[index];

      // calcula o novo charcode aplicando o deslocamento
      const distanceFromMostFrequently = rawText.toLowerCase().charCodeAt(i) - distance;

      // rotaciona o deslocamento caso tenha exedido os limites de 'a' e 'z'
      const rawCharDeslocated = distanceFromMostFrequently < min ? 
          (max - (min - distanceFromMostFrequently)) + 1
          : distanceFromMostFrequently
          
      // converte novo codigo do caractere ja deslocado para ASCII    
      const charConvertedToASCII = String.fromCharCode(rawCharDeslocated);
      // concatena o novo character para o texto final
      decripted += charConvertedToASCII;

      // atualiza posição do deslocamentos
      index += 1;
      // retorna o ponteiro para a posicao inicial em caso de estar no ultimo deslocamento (de acordo com o tamanho da chave)
      if(index === keyShift.length) index = 0;

  }   
  fs.writeFileSync("out.txt", decripted);
};

module.exports = {
  calculateIndexOfCoincidence,
  calculeAverageOfArray,
  countFrequency,
  mostFrequentlySorted,
  calculateDistanceBetweenChars,
  sliceTextByM,
  calculeIncidenceOfEachTextPart,
  decryptByKeyShift
};
