let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let nuvens = []; // Array para armazenar as nuvens
let passarinhos = []; // Array para armazenar os passarinhos
let abelhas = []; // Array para armazenar as abelhas

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent("canvas-holder");
    solo = new Solo(tipoSolo);
    // Cria nuvens no início da simulação
    for (let i = 0; i < 5; i++) {
        nuvens.push(new Nuvem(random(width / 2), random(height / 4)));
    }
    // Cria passarinhos na área urbanizada
    if (tipoSolo === "urbanizado") {
        for (let i = 0; i < 3; i++) {
            passarinhos.push(new Passarinho(random(width), random(height / 2)));
        }
    }
    // Cria abelhas na área de vegetação
    if (tipoSolo === "vegetacao") {
        for (let i = 0; i < 5; i++) {
            abelhas.push(new Abelha(random(width), random(height / 2)));
        }
    }
}

function draw() {
    background(200, 220, 255); // céu

    // Desenha as nuvens
    for (let nuvem of nuvens) {
        nuvem.mostrar();
    }

    // Desenha os passarinhos
    if (tipoSolo === "urbanizado") {
        for (let passarinho of passarinhos) {
            passarinho.voar();
            passarinho.mostrar();
        }
    }

    // Desenha as abelhas
    if (tipoSolo === "vegetacao") {
        for (let abelha of abelhas) {
            abelha.voar();
            abelha.mostrar();
        }
    }

    for (let i = gotas.length - 1; i >= 0; i--) {
        gotas[i].cair();
        gotas[i].mostrar();

        if (gotas[i].atingeSolo(solo.altura)) {
            solo.aumentarErosao();
            gotas.splice(i, 1);
        }
    }

    solo.mostrar();

    if (frameCount % 5 === 0) {
        gotas.push(new Gota());
    }
}

function setSoilType(tipo) {
    tipoSolo = tipo;
    solo = new Solo(tipoSolo);
    // Reinicia as nuvens ao mudar o tipo de solo
    nuvens = [];
    for (let i = 0; i < 5; i++) {
        nuvens.push(new Nuvem(random(width / 2), random(height / 4)));
    }
    // Reinicia os passarinhos e abelhas
    passarinhos = [];
    abelhas = [];
    if (tipoSolo === "urbanizado") {
        for (let i = 0; i < 3; i++) {
            passarinhos.push(new Passarinho(random(width), random(height / 2)));
        }
    } else if (tipoSolo === "vegetacao") {
        for (let i = 0; i < 5; i++) {
            abelhas.push(new Abelha(random(width), random(height / 2)));
        }
    }
}

class Gota {
    constructor() {
        this.x = random(width);
        this.y = 0;
        this.vel = random(4, 6);
    }

    cair() {
        this.y += this.vel;
    }

    mostrar() {
        stroke(0, 0, 200);
        line(this.x, this.y, this.x, this.y + 10);
    }

    atingeSolo(ySolo) {
        return this.y > ySolo;
    }
}

class Solo {
    constructor(tipo) {
        this.tipo = tipo;
        this.altura = height - 80;
        this.erosao = 0;
        this.elementos = [];
        this.inicializarElementos();
    }

    inicializarElementos() {
        if (this.tipo === "vegetacao") {
            const numArvores = 5;
            const espacamentoArvores = width / (numArvores + 1);
            const alturaBaseArvores = this.altura;
            for (let i = 0; i < numArvores; i++) {
                let x = espacamentoArvores * (i + 1);
                this.elementos.push({
                    tipo: "arvore",
                    x: x,
                    y: alturaBaseArvores,
                    tamanho: random(60, 100),
                });
            }
            // Adiciona flores pequenas
            const numFloresPequenas = 15; // Mais flores pequenas
            const espacamentoFloresPequenas = width / (numFloresPequenas + 1);
            const alturaBaseFloresPequenas = this.altura - 5; // Altura um pouco acima do solo
            for (let i = 0; i < numFloresPequenas; i++) {
                let x = espacamentoFloresPequenas * (i + 1);
                this.elementos.push({
                    tipo: "florPequena",
                    x: x,
                    y: alturaBaseFloresPequenas,
                    cor: [random(255), random(255), random(255)],
                });
            }
        } else if (this.tipo === "urbanizado") {
            const numCasas = 2;
            const espacamentoCasas = width / (numCasas + 2);
            const alturaBaseCasas = this.altura;
            for (let i = 0; i < numCasas; i++) {
                let x = espacamentoCasas * (i + 1);
                let largura = random(80, 120);
                let altura = random(100, 150);
                this.elementos.push({
                    tipo: "casa",
                    x: x,
                    y: alturaBaseCasas - altura,
                    largura: largura,
                    altura: altura,
                    cor: [random(200), random(200), random(200)],
                });
            }

            // Adiciona a rua
            this.elementos.push({
                tipo: "rua",
                x: width / 2,
                y: this.altura,
                largura: width,
                altura: 40,
                cor: [100],
            });

            const numCarros = 2;
            const espacamentoCarros = width / (numCarros + 1);
            const alturaBaseCarros = this.altura - 30;
            const larguraCarro = 50;
            const alturaCarro = 30;
            for (let i = 0; i < numCarros; i++) {
                let x = espacamentoCarros * (i + 1);
                this.elementos.push({
                    tipo: "carro",
                    x: x,
                    y: alturaBaseCarros,
                    largura: larguraCarro,
                    altura: alturaCarro,
                    cor: [random(255), random(255), random(255)],
                });
            }
        }
    }

    aumentarErosao() {
        let taxa;
        if (this.tipo === "vegetacao") taxa = 0.05;
        else if (this.tipo === "exposto") taxa = 0.5;
        else if (this.tipo === "urbanizado") taxa = 0.2;

        this.erosao += taxa;
        this.altura -= taxa;
    }

    mostrar() {
        noStroke();
        if (this.tipo === "vegetacao") fill(60, 150, 60);
        else if (this.tipo === "exposto") fill(139, 69, 19);
        else if (this.tipo === "urbanizado") fill(120);

        rect(0, this.altura, width, height - this.altura);

        // Desenha os elementos do solo
        for (let elemento of this.elementos) {
            if (elemento.tipo === "arvore") {
                fill(0, 100, 0);
                rect(elemento.x - 5, elemento.y, 10, elemento.tamanho);
                fill(0, 200, 0);
                ellipse(elemento.x, elemento.y - 10, 30, 30);
            } else if (elemento.tipo === "florPequena") {
                fill(elemento.cor);
                ellipse(elemento.x, elemento.y, 8, 8); // Flores menores
                fill(255, 255, 0);
                ellipse(elemento.x, elemento.y, 3, 3);
            } else if (elemento.tipo === "casa") {
                fill(elemento.cor);
                rect(elemento.x - elemento.largura / 2, elemento.y, elemento.largura, elemento.altura);
                // Telhado da casa
                fill(180, 0, 0);
                triangle(
                    elemento.x - elemento.largura / 2,
                    elemento.y,
                    elemento.x + elemento.largura / 2,
                    elemento.y,
                    elemento.x,
                    elemento.y - 20
                );
                // Janelas da casa
                let numJanelasHorizontais = Math.floor(elemento.largura / 30);
                let numJanelasVerticais = Math.floor(elemento.altura / 30);
                let espacamentoHorizontal = elemento.largura / (numJanelasHorizontais + 1);
                let espacamentoVertical = elemento.altura / (numJanelasVerticais + 1);

                for (let i = 0; i < numJanelasVerticais; i++) {
                    for (let j = 0; j < numJanelasHorizontais; j++) {
                        fill(220);
                        rect(
                            elemento.x - elemento.largura / 2 + (j + 1) * espacamentoHorizontal - 15,
                            elemento.y + (i + 1) * espacamentoVertical + 10,
                            20,
                            20
                        );
                    }
                }
            } else if (elemento.tipo === "rua") {
                fill(elemento.cor);
                rect(elemento.x - elemento.largura / 2, elemento.y, elemento.largura, elemento.altura);
                // Desenha faixas amarelas
                for (let i = -elemento.largura / 2 + 10; i < elemento.largura / 2; i += 30) {
                    fill(255, 255, 0);
                    rect(elemento.x + i, elemento.y + elemento.altura / 4, 20, 5);
                }
            } else if (elemento.tipo === "carro") {
                fill(elemento.cor);
                rect(elemento.x - elemento.largura / 2, elemento.y, elemento.largura, elemento.altura);
                fill(0);
                ellipse(elemento.x - elemento.largura / 2 + 10, elemento.y + elemento.altura, 10, 10);
                ellipse(elemento.x + elemento.largura / 2 - 10, elemento.y + elemento.altura, 10, 10);
            }
        }

        fill(0);
        textSize(14);
        textAlign(LEFT);
        text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
        text(`Tipo de solo: ${this.tipo}`, 10, 40);
        text(`Altura do solo: ${this.altura.toFixed(1)}`, 10, 60);
        text(`Nível da água: ${height - this.altura.toFixed(1)}`, 10, 80);
    }
}

class Nuvem {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tamanho = random(50, 100);
        this.cor = [150, 150, 150];
        this.tipo = "comum";
        this.velocidade = random(0.5, 1);
    }

    mostrar() {
        if (tipoSolo === "urbanizado") {
            this.cor = [100, 100, 100];
        } else {
            this.cor = [150, 150, 150];
        }
        fill(this.cor);
        ellipse(this.x, this.y, this.tamanho, this.tamanho * 0.6);
        ellipse(this.x + this.tamanho * 0.5, this.y - this.tamanho * 0.3, this.tamanho * 0.8, this.tamanho * 0.5);
        ellipse(this.x - this.tamanho * 0.5, this.y - this.tamanho * 0.3, this.tamanho * 0.8, this.tamanho * 0.5);
    }
}

class Passarinho {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tamanho = 20;
        this.velocidade = random(2, 4);
        this.direcao = random([-1, 1]); // Direção horizontal aleatória
    }

    voar() {
        this.x += this.velocidade * this.direcao;
        // Limites horizontais
        if (this.x > width + this.tamanho || this.x < -this.tamanho) {
            this.direcao *= -1; // Inverte a direção
        }
        this.y += random(-1, 1); // Movimento vertical aleatório
    }

    mostrar() {
        fill(255, 255, 0); // Amarelo
        // Corpo do passarinho
        ellipse(this.x, this.y, this.tamanho, this.tamanho * 0.6);
        // Asas
        let anguloAsa = frameCount * 0.2; // Animação das asas
        push();
        translate(this.x, this.y);
        rotate(anguloAsa);
        triangle(0, 0, this.tamanho, this.tamanho * 0.4, this.tamanho * 0.6, 0);
        pop();
        push();
        translate(this.x, this.y);
        rotate(-anguloAsa);
        triangle(0, 0, -this.tamanho, this.tamanho * 0.4, -this.tamanho * 0.6, 0);
        pop();
        // Bico
        fill(0, 0, 0);
        triangle(this.x + this.tamanho * 0.5, this.y, this.x + this.tamanho * 0.8, this.y - this.tamanho * 0.2, this.x + this.tamanho * 0.8, this.y + this.tamanho * 0.2);
    }
}

class Abelha {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tamanho = 15;
        this.velocidade = random(2, 4); // Aumenta a velocidade
        this.direcaoX = random(-1, 1);
        this.direcaoY = random(-1, 1);
        this.frequenciaAsa = random(8, 12); // Define a frequência do movimento das asas
        this.anguloAsa = 0;
    }

    voar() {
        this.x += this.velocidade * this.direcaoX;
        this.y += this.velocidade * this.direcaoY;
        // Limites da tela
        if (this.x > width || this.x < 0) this.direcaoX *= -1;
        if (this.y > height || this.y < 0) this.direcaoY *= -1;
    }

    mostrar() {
        fill(255, 255, 0); // Amarelo
        // Corpo da abelha
        ellipse(this.x, this.y, this.tamanho, this.tamanho * 0.6);
        // Listras
        fill(0, 0, 0);
        rect(this.x - this.tamanho * 0.3, this.y, 3, this.tamanho * 0.6);
        rect(this.x, this.y, 3, this.tamanho * 0.6);
        rect(this.x + this.tamanho * 0.3, this.y, 3, this.tamanho * 0.6);
        // Asas
        this.anguloAsa = sin(frameCount / this.frequenciaAsa) * 0.5; // Calcula o ângulo da asa
        fill(200, 200, 200, 150); // Transparente
        push();
        translate(this.x, this.y);
        rotate(this.anguloAsa);
        ellipse(this.tamanho * 0.5, -this.tamanho * 0.3, this.tamanho * 0.8, this.tamanho * 0.5); // Aumenta o tamanho da asa
        pop();
        push();
        translate(this.x, this.y);
        rotate(-this.anguloAsa);
        ellipse(-this.tamanho * 0.5, -this.tamanho * 0.3, this.tamanho * 0.8, this.tamanho * 0.5); // Aumenta o tamanho da asa
        pop();
        // Antenas
        stroke(0, 0, 0);
        line(this.x - this.tamanho * 0.3, this.y - this.tamanho * 0.3, this.x - this.tamanho * 0.5, this.y - this.tamanho * 0.5);
        line(this.x + this.tamanho * 0.3, this.y - this.tamanho * 0.3, this.x + this.tamanho * 0.5, this.y - this.tamanho * 0.5);
    }
}
