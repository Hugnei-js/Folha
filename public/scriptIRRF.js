function calcular(ano) {
    
    var INSSvalues = getINSSvalues(ano)
    var IRRFvalues = getValoresIRRF("IRRF")
    
    var baseirrf1 = (Number.parseFloat(document.getElementById('bcirrf1').value))
    var baseirrf2 = (Number.parseFloat(document.getElementById('bcirrf2').value))

    if (baseirrf1 < 0 || baseirrf2 < 0) {
        showAlert('error','Informe um valor para Base de IRRF ou IRRF Anterior maior que zero.')
        return
    } else if (isNaN(baseirrf1) && isNaN(baseirrf2)) {
        showAlert('error','Informe um valor para Base de IRRF ou IRRF Anterior válido, maior que zero e no formato 1000,00.')
        return
    } else if (isNaN(baseirrf1) && (typeof baseirrf2 == 'number')) {
        var baseirrf1 = 0
        var base = baseirrf1 + baseirrf2
    } else if ((typeof baseirrf2 == 'number') && isNaN(baseirrf2)) {
        var baseirrf2 = 0
        var base = baseirrf1 + baseirrf2
    } else {
        var base = baseirrf1 + baseirrf2
    }

    if (base <= 0) {
        showAlert('error','Informe um valor para Base de IRRF ou IRRF Anterior maior que zero.')
        return
    }

    if (isNaN(base)) {
        showAlert('error','Informe um valor para Base de IRRF ou IRRF Anterior válido, maior que zero e no formato 1000,00.')
        return
    }

    if (document.getElementById('irrfretido').value == '') {
        var irrfretido = 0
    } else {
        var irrfretido = (Number.parseFloat(document.getElementById('irrfretido').value))
    }

    if (irrfretido < 0) {
        showAlert('error','Informe um valor para IRRF Retido maior que 0')
        return
    }

    var qtde_salariominimo = ((Number.parseFloat(base / INSSvalues.salariominimo)).toFixed(2))
    var resultado = document.getElementById('result')
    var valores = document.getElementById('valores')

    var baseFormatado = base.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var limite1Formatado = IRRFvalues.limite1.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var retidoFormatado = irrfretido.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

    {

        if (base <= IRRFvalues.limite1) {

            var desconto = 0
            var aliquota = 0
            var deducao = 0
            var deducaoFormatado = 0
            var aliquotaefetiva = 0

            resultado.innerHTML = `<p class="resultado">A Base de IRRF informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                                   <p class="resultado">A Base de IRRF é menor ou igual a remuneração isenta (${limite1Formatado}).</p>
                                   <strong><p class="resultado">Para esse valor de Base de Cálculo não há recolhimento de Imposto de Renda.</p></strong>`

            valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                 <p class="resultado">Desconto do IRRF: Isento</p></strong>`

        } else if (base <= IRRFvalues.limite2) {

            var desconto = Number((parseFloat(base * IRRFvalues.aliquota7 / 100 - IRRFvalues.deducao1).toFixed(6).slice(0, -4)))

            if (desconto <= 0) { desconto = 0 }

            var aliquota = IRRFvalues.aliquota7
            var deducao = IRRFvalues.deducao1
            var deducaoFormatado = deducao.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
            var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

            resultado.innerHTML = `<p class="resultado">A Base de IRRF informada é composta por ${qtde_salariominimo} salários mínimos.</p>`

            valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p></strong>`

        } else if (base <= IRRFvalues.limite3) {

            var desconto = Number((parseFloat(base * IRRFvalues.aliquota15 / 100 - IRRFvalues.deducao2).toFixed(6).slice(0, -4)))

            if (desconto <= 0) { desconto = 0 }

            var aliquota = IRRFvalues.aliquota15
            var deducao = IRRFvalues.deducao2
            var deducaoFormatado = deducao.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
            var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

            resultado.innerHTML = `<p class="resultado">A Base de IRRF informada é composta por ${qtde_salariominimo} salários mínimos.</p>`

            valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p></strong>`

        } else if (base <= IRRFvalues.limite4) {

            var desconto = Number((parseFloat(base * IRRFvalues.aliquota22 / 100 - IRRFvalues.deducao3).toFixed(6).slice(0, -4)))

            if (desconto <= 0) { desconto = 0 }

            var aliquota = IRRFvalues.aliquota22
            var deducao = IRRFvalues.deducao3
            var deducaoFormatado = deducao.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
            var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

            resultado.innerHTML = `<p class="resultado">A Base de IRRF informada é composta por ${qtde_salariominimo} salários mínimos.</p>`

            valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p></strong>`

        } else {

            var desconto = Number((parseFloat(base * IRRFvalues.aliquota27 / 100 - IRRFvalues.deducao4).toFixed(6).slice(0, -4)))

            if (desconto <= 0) { desconto = 0 }

            var aliquota = IRRFvalues.aliquota27
            var deducao = IRRFvalues.deducao4
            var deducaoFormatado = deducao.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
            var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

            resultado.innerHTML = `<p class="resultado">A Base de IRRF informada é composta por ${qtde_salariominimo} salários mínimos.</p>`

            valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p></strong>`
        }

    }

    var desconto2 = parseFloat((desconto - irrfretido).toFixed(6).slice(0, -4))
    var descontoFormatado = desconto2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

    {
        if ((desconto2 < IRRFvalues.recolhimentomin) && (base > IRRFvalues.limite1)) {

            var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

            if (irrfretido > 0) {

                resultado.innerHTML += `<strong><p class="resultado">A Base de ${baseFormatado} * ${aliquota}%, menos a dedução da parcela de ${deducaoFormatado} e IRRF Retido de ${retidoFormatado}, 
                gera um desconto de IRRF de ${descontoFormatado}, que é menor que R$ 10,00. Portanto, para esse valor de Base de Cálculo não há recolhimento de Imposto de Renda.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Não há recolhimento de IRRF.</p></strong>`

            } else {

                resultado.innerHTML += `<strong><p class="resultado">A Base de ${baseFormatado} * ${aliquota}%, menos a dedução da parcela de ${deducaoFormatado}, gera um desconto de IRRF de ${descontoFormatado}, 
                que é menor que R$ 10,00. Portanto, para esse valor de Base de Cálculo não há recolhimento de Imposto de Renda.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Não há recolhimento de IRRF.</p></strong>`

            }

        } else if ((desconto2 >= IRRFvalues.recolhimentomin) && (base > IRRFvalues.limite1)) {

            var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))
            var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
            var deducao = deducao.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

            if (irrfretido > 0) {

                resultado.innerHTML += `<strong><p class="resultado">A Base de ${baseFormatado} * ${aliquota}%, menos a dedução da parcela de ${deducaoFormatado} e IRRF Retido de ${retidoFormatado}, 
                gera uma diferença a ser recolhida de IRRF de ${descontoFormatado}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Alíquota: ${aliquota}%</p>
                                      <p class="resultado">Dedução: ${deducao}</p> 
                                      <p class="resultado">Alíquota Efetiva: ${aliquotaefetiva}%</p>
                                      <p class="resultado">Desconto: ${desconto}</p>
                                      <p class="resultado">IRRF Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Diferença: ${descontoFormatado}</p></strong>`

            } else {

                resultado.innerHTML += `<p class="resultado"><strong>A Base de ${baseFormatado} * ${aliquota}%, menos a dedução da parcela de ${deducao}, gera um desconto de IRRF de ${desconto}.</strong></p>`

                valores.innerHTML += `<strong><p class="resultado">Alíquota: ${aliquota}%</p>
                                      <p class="resultado">Dedução: ${deducao}</p>
                                      <p class="resultado">Alíquota Efetiva: ${aliquotaefetiva}</p>
                                      <p class="resultado">Desconto: ${desconto}</p></strong>`

            }

        }

    }

    mostrarResultado()

}