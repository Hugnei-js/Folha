function getINSSvalues(ano) {
    let INSSvalues
    for (item of anos) {
        if (item.ano == ano) {
            INSSvalues = item.dados;
            break;
        }
    }
    return INSSvalues
}

function getINSSaliquots(aliquota) {
    let INSSaliquots
    for (item of aliquotas) {
        if (item.aliquota == aliquota) {
            INSSaliquots = item.dados;
            break;
        }
    }
    return INSSaliquots
}

function getValoresIRRF(aliquota) {
    let IRRFvalues;
    for (item of aliquotas) {
        if (item.aliquota == aliquota) {
            IRRFvalues = item.dados;
            break;
        }
    }
    return IRRFvalues
}

let aliquotas = [
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
    
let anos = [
    {
        ano: 2020,
        dados: {
            salariominimo: 1045,
            salariomaximo: 6101.06,
            tetosegurado: 713.08,
            tetoindividual: 671.12,
            limite2: 2089.60,
            limite3: 3134.40
        }
    },
    {
        ano: 2021,
        dados: {
            salariominimo: 1100,
            salariomaximo: 6433.57,
            tetosegurado: 751.97,
            tetoindividual: 707.69,
            limite2: 2203.48,
            limite3: 3305.22
        }
    },
    {
        ano: 2022,
        dados: {
            salariominimo: 1212,
            salariomaximo: 7087.22,
            tetosegurado: 828.38,
            tetoindividual: 779.59,
            limite2: 2427.35,
            limite3: 3641.03
        }
    }
];