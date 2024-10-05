import { animais } from "./animais";
import { recintos } from "./recintos";

class RecintosZoo {
  constructor() {
    this.animais = animais;
    this.recintos = recintos;
  }

  encontrarAnimal(animal) {
    return this.animais.find(
      (a) => a.especie.toUpperCase() === animal.toUpperCase()
    );
  }

  verificaBioma(recinto, animal) {
    return animal.bioma.some((a) => recinto.bioma.includes(a));
  }

  calculaEspaco(recinto, animal, quantidade){
    const animaisRecinto = recinto.animais.map((a) => this.encontrarAnimal(a));
    const espacoOcupado = animaisRecinto.reduce((acc, a) => acc + a.tamanho, 0);
    let espacoDisponivel = recinto.tamanho - espacoOcupado - (animal.tamanho * quantidade);

    if(recinto.animais.length > 0 && !recinto.animais.includes(animal.especie)){
      espacoDisponivel -= 1;
    }

    return espacoDisponivel;
  }

  verificaCarnivoro(recinto, animal) {
    const animaisRecinto = recinto.animais.map((a) => this.encontrarAnimal(a));

    if(animaisRecinto.length === 0){
      return true;
    }

    const possuiCarnivoro = animaisRecinto.some((a) => a.carnivoro);
    if(possuiCarnivoro && !animal.carnivoro){
      return false;
    }
    if(possuiCarnivoro && animaisRecinto.some((a) => a.especie === animal.especie)){
      return true;
    }
    if(!possuiCarnivoro && !animal.carnivoro){
      return true;
    }
    return false;
  }

  verificaHipopotamo(recinto, animal){
    if(animal.especie !== 'HIPOPOTAMO'){
      return true;
    }
    const animaisRecinto = recinto.animais.map((a) => this.encontrarAnimal(a));
    const outrasEspecies = animaisRecinto.filter((a) => a.especie !== 'HIPOPOTAMO');
    if (outrasEspecies.length === 0) {
      return true;
    }
    if (recinto.bioma.includes('SAVANA') && recinto.bioma.includes('RIO')) {
      return true;
    }
    return false;
  }

  verificaMacaco(recinto, animal, quantidade){
    if(animal.especie !== 'MACACO' || quantidade > 1) return true;
    if(recinto.animais.length > 0) return true;
    return false;
  }

  analisaRecintos(animal, quantidade) {
    const animalEncontrado = this.encontrarAnimal(animal);

    if (quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    if (!animalEncontrado) {
      return { erro: "Animal inválido" };
    }

    const recintosViaveis = this.recintos
      .filter(
        (recinto) =>
          this.verificaBioma(recinto, animalEncontrado) &&
          this.calculaEspaco(recinto, animalEncontrado, quantidade) >= 0 &&
          this.verificaCarnivoro(recinto, animalEncontrado) &&
          this.verificaHipopotamo(recinto, animalEncontrado) &&
          this.verificaMacaco(recinto, animalEncontrado, quantidade)
      )
      .map((recinto) => {
        const espacoFinal = this.calculaEspaco(recinto, animalEncontrado, quantidade);

        return {
          numero: recinto.numero,
          espacoFinal: espacoFinal,
          espacoTotal: recinto.tamanho,
        };
      });

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    recintosViaveis.sort((a, b) => a.numero - b.numero);

    return {
      erro: false,
      recintosViaveis: recintosViaveis.map(
        (recinto) =>
          `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoFinal} total: ${recinto.espacoTotal})`
      ),
    };
  }
}

export { RecintosZoo as RecintosZoo };