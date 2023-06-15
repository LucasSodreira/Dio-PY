// Função para gerar o Mapa de Karnaugh e a expressão simplificada
function gerarMapaKarnaugh(tabela) {
    // Verificar o número de variáveis na tabela
    let numVariaveis = tabela[0].length - 1;
  
    // Verificar se o número de variáveis é válido (entre 2 e 4)
    if (numVariaveis < 2 || numVariaveis > 4) {
      console.log("Número de variáveis inválido");
      return;
    }

    // Criar o cabeçalho do Mapa de Karnaugh
    let mapaKarnaugh = "";
    for (let i = 0; i < numVariaveis; i++) {
      mapaKarnaugh += String.fromCharCode(65 + i) + "";
    }
    mapaKarnaugh += "| ";
    for (let i = 0; i < tabela.length; i++) {
      mapaKarnaugh += tabela[i][numVariaveis] + " ";
    }
    mapaKarnaugh += "\n";
  
    // Calcular o número de células na tabela
    let numCelulas = Math.pow(2, numVariaveis);
  
    // Loop para gerar as linhas do Mapa de Karnaugh
    for (let i = 0; i < numCelulas; i++) {
      // Converter o índice da célula em binário e preencher com zeros à esquerda se necessário
      let binario = i.toString(2).padStart(numVariaveis, "0");
      mapaKarnaugh += binario + "| ";
  
      // Preencher os valores das células da tabela
      for (let j = 0; j < tabela.length; j++) {
        let linha = tabela[j].slice(0, numVariaveis).join("");
        if (linha === binario) {
          mapaKarnaugh += tabela[j][numVariaveis] + " ";
        } else {
          mapaKarnaugh += "- ";
        }
      }
      mapaKarnaugh += "\n";
    }
  
    // Obter a expressão de saída simplificada
    let expressaoSimplificada = obterExpressaoSimplificada(tabela, numVariaveis);
  
    // Retornar o Mapa de Karnaugh e a expressão simplificada
    return { mapaKarnaugh, expressaoSimplificada };
  }
  
  // Função para obter a expressão de saída simplificada
  function obterExpressaoSimplificada(tabela, numVariaveis) {
    let mintermos = [];
  

    for (let i = 0; i < tabela.length; i++) {
      if (tabela[i][numVariaveis] === 1) {
        let binario = i.toString(2).padStart(numVariaveis, "0");
        mintermos.push(binario);
      }
    }
  
    if (mintermos.length === 0) {
      return "0";
    }
  
    function combinarMintermos(mintermos) {
      let grupos = [];
      let agrupados = [];
  
      for (let i = 0; i < mintermos.length; i++) {
        let mintermo = mintermos[i];
        if (!agrupados.includes(mintermo)) {
          let grupo = {
            tamanho: 1,
            mintermos: [mintermo],
          };
          for (let j = i + 1; j < mintermos.length; j++) {
            let outroMintermo = mintermos[j];
            if (!agrupados.includes(outroMintermo)) {
              let diferenca = 0;
              for (let k = 0; k < numVariaveis; k++) {
                if (mintermo[k] !== outroMintermo[k]) {
                  diferenca++;
                }
              }
              if (diferenca === 1) {
                grupo.tamanho *= 2;
                grupo.mintermos.push(outroMintermo);
                agrupados.push(outroMintermo);
              }
            }
          }
          grupos.push(grupo);
        }
      }
  
      return grupos;
    }
  

    function obterExpressaoGrupo(grupo) {
      let expressao = "";
  
      for (let i = 0; i < numVariaveis; i++) {
        let variavel = String.fromCharCode(65 + i);
        let valores = new Set();
  
        for (let j = 0; j < grupo.mintermos.length; j++) {
          let mintermo = grupo.mintermos[j];
          if (mintermo[i] === "0") {
            valores.add("~" + variavel);
          } else {
            valores.add(variavel);
          }
        }
  
        
        if (valores.size > 1) {
          expressao += "(" + Array.from(valores).join("+") + ")";
        } else {
          expressao += Array.from(valores).join("");
        }
  
        expressao += " ";
      }
  
      return expressao.trim();
    }
  
    let grupos = combinarMintermos(mintermos);
  
    let expressaoSimplificada = "";
  
    for (let i = 0; i < grupos.length; i++) {
      let grupo = grupos[i];
      let expressaoGrupo = obterExpressaoGrupo(grupo);
      expressaoSimplificada += expressaoGrupo;
      if (i < grupos.length - 1) {
        expressaoSimplificada += "+";
      }
    }
  
    return expressaoSimplificada;
  }
  
  // Exemplo de uso da função com uma tabela de 3 variáveis
  let tabela = [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [1, 1, 1, 1],
  ];
  
  let resultado = gerarMapaKarnaugh(tabela);
  console.log("Tabela Verdade:");
  console.log(resultado.mapaKarnaugh);
  let expressaoSimplificada = obterExpressaoSimplificada(tabela, tabela[0].length - 1);
  console.log("Expressão de saída simplificada:", expressaoSimplificada);
  
  