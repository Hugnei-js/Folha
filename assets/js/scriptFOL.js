function calcularFolha(ano) {

    var salbase = (Number.parseFloat(document.getElementById('salbase').value))
    var outrosdesc = (Number.parseFloat(document.getElementById('outrosdesc').value))
    var qtddepIRRF = (Number.parseFloat(document.getElementById('qtddependente').value))

    var incideImposto = ''
    var incimposto = document.getElementsByName('incimposto')

    var vinculo = ''
    var qualvinc = document.getElementsByName('vinculo')

    var contratosegurado = ''
    var contrato = document.getElementsByName('contrato')

    var valorFormatado

    /*bases e líquidos*/
    var base_comparacao = 0
    var liquido = 0
    
    /*prepara os valores de INSS*/
    var INSSvalues = getINSSvalues(ano)
    var INSSaliquots = getINSSaliquots("INSS")
    var baseINSS = 0
    var desc1 = 0
    var desc2 = 0
    var desc3 = 0
    var desc4 = 0
    var descontoINSS = 0
    var aliquotaefetivaINSS = 0

    /*prepara os valores de IRRF*/
    var IRRFvalues = getValoresIRRF("IRRF")
    var baseIRRF = 0
    var vlrDependentesIRRF = 0
    var descontoIRRF = 0
    var aliquotaIRRF = 0
    var deducaoIRRF = 0

    /*prepara os valores de FGTS*/
    var aliquotaFGTS = 0
    var recolhimentoFGTS = 0

    if (salbase <= 0) {
        showAlert('error','Informe um valor de Salário Base maior que zero.')
        return
    } else if (isNaN(salbase)) {
        showAlert('error','Informe um valor de Salário Base válido e maior que zero.')
        return
    }

    if (outrosdesc < 0) {
        showAlert('error','Informe um valor de Outros Descontos maior que zero.')
        return
    } else if (isNaN(outrosdesc)) {
        outrosdesc = 0
    }

    valorFormatado = salbase.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    salbruto.innerHTML = `<strong>${valorFormatado}</strong>`
    valorFormatado = outrosdesc.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    descontos.innerHTML = `${valorFormatado}`

    if (qtddepIRRF < 0) {
        showAlert('error','Informe uma quantidade de Dependente maior que zero.')
        return
    } else if (isNaN(qtddepIRRF)) {
        qtddepIRRF = 0
    } else {
        vlrDependentesIRRF = IRRFvalues.vlrdependente * qtddepIRRF
    }

    if (incimposto[0].checked) {
        incideImposto = "sim"
    } else {
        incideImposto = "nao"
    }

    if (incideImposto == "sim") {
        baseINSS = salbase - outrosdesc
    } else {
        baseINSS = salbase
    }

    base_comparacao = (Number(baseINSS / INSSvalues.salariominimo))
    valorFormatado = baseINSS.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    bcinss.innerHTML = `<strong>${valorFormatado}</strong>`

    if (qualvinc[0].checked) {
        vinculo = "segurado"
        document.getElementById('contrato').style.display = 'block'
    } else {
        vinculo = "individual"
        document.getElementById('contrato').style.display = 'none'
    }

    if (contrato[0].checked) {
        contratosegurado = "empregado"
    } else {
        contratosegurado = "menor"
    }

    if (contratosegurado == "empregado" && vinculo == "segurado") {
        aliquotaFGTS = 8
        bcfgts.innerHTML = `<strong>${valorFormatado}</strong>`
        alifgts.innerHTML = `${aliquotaFGTS}%`
    } else if (contratosegurado == "menor" && vinculo == "segurado") {
        aliquotaFGTS = 2
        bcfgts.innerHTML = `<strong>${valorFormatado}</strong>`
        alifgts.innerHTML = `${aliquotaFGTS}%`
    } else {
        bcfgts.innerHTML = `<strong>Não há.</strong>`
        alifgts.innerHTML = `Não há.`
    }

    if (vinculo == "segurado") {
        recolhimentoFGTS = baseINSS * aliquotaFGTS / 100
        valorFormatado = recolhimentoFGTS.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
        recfgts.innerHTML = `${valorFormatado}`
    } else {
        recfgts.innerHTML = `Não há.`
    }

    /*CÁLCULO DO INSS*/
    {
        if (baseINSS >= INSSvalues.salariomaximo && vinculo == "individual") {

            descontoINSS = INSSvalues.tetoindividual
            
        } else if (baseINSS < INSSvalues.salariomaximo && vinculo == "individual") {

            descontoINSS = baseINSS * INSSaliquots.aliq_teto_individual / 100
            
        } else if (vinculo == "segurado") {

            if (baseINSS >= INSSvalues.salariomaximo) {

                descontoINSS = INSSvalues.tetosegurado
                aliquotaefetivaINSS = (parseFloat(descontoINSS * 100 / baseINSS).toFixed(6))

            } else if (base_comparacao <= 1) {

                descontoINSS = Number((parseFloat(baseINSS * INSSaliquots.aliquota7 / 100).toFixed(6).slice(0, -4)))
                aliquotaefetivaINSS = (parseFloat(descontoINSS * 100 / baseINSS).toFixed(6))

            } else if (base_comparacao <= (INSSvalues.limite2 / INSSvalues.salariominimo)) {

                desc1 = Number((parseFloat(INSSvalues.salariominimo * INSSaliquots.aliquota7 / 100)).toFixed(6).slice(0, -4))
                desc2 = Number((parseFloat(((baseINSS - INSSvalues.salariominimo) * INSSaliquots.aliquota9 / 100))).toFixed(6).slice(0, -4))
                descontoINSS = (parseFloat((desc1 + desc2).toFixed(6).slice(0, -4)))
                aliquotaefetivaINSS = (parseFloat(descontoINSS * 100 / baseINSS).toFixed(6))

            } else if (base_comparacao <= (INSSvalues.limite3 / INSSvalues.salariominimo)) {

                desc1 = Number((parseFloat(INSSvalues.salariominimo * INSSaliquots.aliquota7 / 100)).toFixed(6).slice(0, -4))
                desc2 = Number((parseFloat((INSSvalues.limite2 - INSSvalues.salariominimo) * INSSaliquots.aliquota9 / 100)).toFixed(6).slice(0, -4))
                desc3 = Number((parseFloat((baseINSS - INSSvalues.limite2) * INSSaliquots.aliquota12 / 100)).toFixed(6).slice(0, -4))
                descontoINSS = (parseFloat((desc1 + desc2 + desc3).toFixed(6).slice(0, -4)))
                aliquotaefetivaINSS = (parseFloat(descontoINSS * 100 / baseINSS).toFixed(6))

            } else if (base_comparacao < (INSSvalues.salariomaximo / INSSvalues.salariominimo)) {

                desc1 = Number((parseFloat(INSSvalues.salariominimo * INSSaliquots.aliquota7 / 100)).toFixed(6).slice(0, -4))
                desc2 = Number((parseFloat((INSSvalues.limite2 - INSSvalues.salariominimo) * INSSaliquots.aliquota9 / 100)).toFixed(6).slice(0, -4))
                desc3 = Number((parseFloat((INSSvalues.limite3 - INSSvalues.limite2) * INSSaliquots.aliquota12 / 100)).toFixed(6).slice(0, -4))
                desc4 = Number((parseFloat((baseINSS - INSSvalues.limite3) * INSSaliquots.aliquota14 / 100)).toFixed(6).slice(0, -4))
                descontoINSS = (parseFloat((desc1 + desc2 + desc3 + desc4).toFixed(6).slice(0, -4)))
                aliquotaefetivaINSS = (parseFloat(descontoINSS * 100 / baseINSS).toFixed(6))

            }

        }

    }

    if (vinculo == "segurado"){
        aliinss.innerHTML = `${aliquotaefetivaINSS}%`
    } else {
        aliinss.innerHTML = `${INSSaliquots.aliq_teto_individual}%`
    }

    valorFormatado = descontoINSS.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    descinss.innerHTML = `${valorFormatado}`

    baseIRRF = baseINSS - descontoINSS - vlrDependentesIRRF /*Apurada a base de IR para cálculo do desconto abaixo*/

    valorFormatado = baseIRRF.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    bcirrf.innerHTML = `<strong>${valorFormatado}</strong>`
    valorFormatado = vlrDependentesIRRF.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    depirrf.innerHTML = `${valorFormatado}`

    {
        if (baseIRRF <= IRRFvalues.limite1) {
            
            aliirrf.innerHTML = `Não há.`
            dedirrf.innerHTML = `Não há.`
            descirrf.innerHTML = `Não há.`
     
        } else if (baseIRRF <= IRRFvalues.limite2) {

            descontoIRRF = Number((parseFloat(baseIRRF * IRRFvalues.aliquota7 / 100 - IRRFvalues.deducao1).toFixed(6).slice(0, -4)))
            aliquotaefetivaIRRF = (parseFloat(descontoIRRF * 100 / baseIRRF).toFixed(6))
            aliquotaIRRF = IRRFvalues.aliquota7
            deducaoIRRF = IRRFvalues.deducao1

        } else if (baseIRRF <= IRRFvalues.limite3) {

            descontoIRRF = Number((parseFloat(baseIRRF * IRRFvalues.aliquota15 / 100 - IRRFvalues.deducao2).toFixed(6).slice(0, -4)))
            aliquotaefetivaIRRF = (parseFloat(descontoIRRF * 100 / baseIRRF).toFixed(6))
            aliquotaIRRF = IRRFvalues.aliquota15
            deducaoIRRF = IRRFvalues.deducao2

        } else if (baseIRRF <= IRRFvalues.limite4) {

            descontoIRRF = Number((parseFloat(baseIRRF * IRRFvalues.aliquota22 / 100 - IRRFvalues.deducao3).toFixed(6).slice(0, -4)))
            aliquotaefetivaIRRF = (parseFloat(descontoIRRF * 100 / baseIRRF).toFixed(6))
            aliquotaIRRF = IRRFvalues.aliquota22
            deducaoIRRF = IRRFvalues.deducao3

        } else {

            descontoIRRF = Number((parseFloat(baseIRRF * IRRFvalues.aliquota27 / 100 - IRRFvalues.deducao4).toFixed(6).slice(0, -4)))
            aliquotaefetivaIRRF = (parseFloat(descontoIRRF * 100 / baseIRRF).toFixed(6))
            aliquotaIRRF = IRRFvalues.aliquota27
            deducaoIRRF = IRRFvalues.deducao4

        }
    }

    valorFormatado = descontoIRRF.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    descirrf.innerHTML = `${valorFormatado}`
    valorFormatado = deducaoIRRF.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    dedirrf.innerHTML = `${valorFormatado}`
    aliirrf.innerHTML = `${aliquotaIRRF}%`
    
    if (descontoIRRF < IRRFvalues.recolhimentominIRRF) {
        descontoIRRF = 0; aliquotaIRRF = 0; aliquotaefetivaIRRF = 0;
        Swal.fire({
            icon: 'warning',
            title: 'Hey!',
            text: 'O desconto de IRRF calculado é menor que R$10,00, portanto não foi considerado.'
        })
    }

    liquido = baseINSS - outrosdesc - descontoINSS - descontoIRRF
    valorFormatado = liquido.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    liqrec.innerHTML = `<strong>${valorFormatado}</strong>`

    mostrarResultado(baseIRRF, IRRFvalues.limite1)

}