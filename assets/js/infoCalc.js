const aliquotas = [
    {
        aliquota: "IRRF",
        dados: {
            recolhimentomin: 10,
            limite1: 1903.98,
            limite2: 2826.65,
            limite3: 3751.05,
            limite4: 4664.68,
            deducao1: 142.80,
            deducao2: 354.80,
            deducao3: 636.13,
            deducao4: 869.36,
            aliquota7: 7.5,
            aliquota15: 15,
            aliquota22: 22.5,
            aliquota27: 27.5,
            vlrdependente: 189.59
        }
    },
    {
        aliquota: "INSS",
        dados: {
            aliquota7: 7.5,
            aliquota9: 9,
            aliquota12: 12,
            aliquota14: 14,
            aliq_teto_individual: 11,
            aliq_teto_segurado: 0
        }
    }
];

const anos = [
    {
        ano: 2020,
        tetosegurado: 713.08,
        tetoindividual: 671.12,
        tabela: [
            {
                nome: "Limite 1ª Faixa",
                faixa: 1,
                valor: 1045,
                aliquota: 7.5
            },
            {
                nome: "Limite 2ª Faixa",
                faixa: 2,
                valor: 2089.6,
                aliquota: 9
            },
            {
                nome: "Limite 3ª Faixa",
                faixa: 3,
                valor: 3134.4,
                aliquota: 12
            },
            {
                nome: "Limite 4ª Faixa",
                faixa: 4,
                valor: 6101.06,
                aliquota: 14
            }
        ]
    },
    {
        ano: 2021,
        tetosegurado: 751.97,
        tetoindividual: 707.69,
        tabela: [
            {
                nome: "Limite 1ª Faixa",
                faixa: 1,
                valor: 1100,
                aliquota: 7.5
            },
            {
                nome: "Limite 2ª Faixa",
                faixa: 2,
                valor: 2203.48,
                aliquota: 9
            },
            {
                nome: "Limite 3ª Faixa",
                faixa: 3,
                valor: 3305.22,
                aliquota: 12
            },
            {
                nome: "Limite 4ª Faixa",
                faixa: 4,
                valor: 6433.57,
                aliquota: 14
            }
        ]
    },
    {
        ano: 2022,
        tetosegurado: 828.38,
        tetoindividual: 779.59,
        tabela: [
            {
                nome: "Limite 1ª Faixa",
                faixa: 1,
                valor: 1212,
                aliquota: 7.5
            },
            {
                nome: "Limite 2ª Faixa",
                faixa: 2,
                valor: 2427.35,
                aliquota: 9
            },
            {
                nome: "Limite 3ª Faixa",
                faixa: 3,
                valor: 3641.03,
                aliquota: 12
            },
            {
                nome: "Limite 4ª Faixa",
                faixa: 4,
                valor: 7087.22,
                aliquota: 14
            }
        ]
    }
];

function getAliquotas(id) {
    for (let item of aliquotas) {
        if (item.aliquota == id) {
            return item.dados;
        }
    }
}

function getLimite(faixa, ano) {
    let data = getINSSData(ano);
    for (let item of data.tabela) {
        if (item.faixa == faixa) {
            return item.valor;
        }
    }
}

function getINSSYears() {
    let result = [];
    for (let item of anos) {
        result.push(item.ano);
    }
    return result.reverse();
}

function getINSSData(ano) {
    for (let item of anos) {
        if (item.ano == ano) {
            return item;
        }
    }
}
