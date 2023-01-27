var anoCalculo

function preparaINSS(ano) {
    anoCalculo = ano
    var INSSvalues = getINSSvalues(ano)
    var INSSaliquots = getINSSaliquots("INSS")
    var format

    $("#anoCalculo").html(ano)
    format = INSSvalues.salariominimo.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    $("#limite1").html("Limite 1ª Faixa " + format)
    $("#aliquota1").html(INSSaliquots.aliquota7 + "%")
    format = INSSvalues.limite2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    $("#limite2").html("Limite 2ª Faixa " + format)
    $("#aliquota2").html(INSSaliquots.aliquota9 + "%")
    format = INSSvalues.limite3.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    $("#limite3").html("Limite 3ª Faixa " + format)
    $("#aliquota3").html(INSSaliquots.aliquota12 + "%")
    format = INSSvalues.salariomaximo.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    $("#limite4").html("Limite 4ª Faixa " + format)
    $("#aliquota4").html(INSSaliquots.aliquota14 + "%")
    $("#limite5").html("Base de INSS > " + format)
    format = INSSvalues.tetosegurado.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    $("#aliquota5").html("Teto de " + format)
}

function calcular() {
    initialize(anoCalculo)
}

function initialize(ano) {

    var INSSvalues = getINSSvalues(ano)
    var INSSaliquots = getINSSaliquots("INSS")

    var baseinss1 = (Number.parseFloat(document.getElementById('bcinss1').value))
    var baseinss2 = (Number.parseFloat(document.getElementById('bcinss2').value))

    var vinculo = ''
    var qualvinculo = document.getElementsByName('vinculo')

    if (baseinss1 < 0 || baseinss2 < 0) {
        showAlert('error','Informe um valor para Base de INSS ou INSS Anterior maior que zero.')
        return
    } else if (isNaN(baseinss1) && isNaN(baseinss2)) {
        showAlert('error','Informe um valor para Base de INSS ou INSS Anterior válido, maior que zero e no formato 1000,00.')
        return
    } else if (isNaN(baseinss1) && (typeof baseinss2 == 'number')) {
        var baseinss1 = 0
        var base = baseinss1 + baseinss2
    } else if ((typeof baseinss2 == 'number') && isNaN(baseinss2)) {
        var baseinss2 = 0
        var base = baseinss1 + baseinss2
    } else {
        var base = baseinss1 + baseinss2
    }

    if (base <= 0) {
        showAlert('error','Informe um valor para Base de INSS ou INSS Anterior maior que zero.')
        return
    }

    if (isNaN(base)) {
        showAlert('error','Informe um valor para Base de INSS ou INSS Anterior válido, maior que zero e no formato 1000,00.')
        return
    }

    if (document.getElementById('inssretido').value == '') {
        var inssretido = 0
    } else {
        var inssretido = (Number.parseFloat(document.getElementById('inssretido').value))
    }

    if (inssretido < 0) {
        showAlert('error','Informe um valor para INSS Retido maior que 0')
        return
    }

    if (qualvinculo[0].checked) {
        vinculo = "segurado"
    } else {
        vinculo = "individual"
    }

    var aliq_teto_segurado = ((Number.parseFloat(INSSvalues.tetosegurado * 100 / INSSvalues.salariomaximo)).toFixed(6))

    var qtde_salariominimo = ((Number.parseFloat(base / INSSvalues.salariominimo)).toFixed(2))
    var base_comparacao = (Number(base / INSSvalues.salariominimo))
    var resultado = document.getElementById('result')
    var valores = document.getElementById('valores')

    var baseFormatado = base.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var minFormatado = INSSvalues.salariominimo.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var maxFormatado = INSSvalues.salariomaximo.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var tetosegFormatado = INSSvalues.tetosegurado.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var tetoindFormatado = INSSvalues.tetoindividual.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var limite2Formatado = INSSvalues.limite2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var limite3Formatado = INSSvalues.limite3.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
    var retidoFormatado = inssretido.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

    if (base >= INSSvalues.salariomaximo && vinculo == "individual") { /*Para calcular o teto para contribuintes individuais*/

        resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                               <p class="resultado">A Base de INSS é maior ou igual a remuneração máxima (${maxFormatado}).</p>
                               <strong><p class="resultado">O desconto de INSS para a base informada é o teto de ${tetoindFormatado} (${maxFormatado} x ${INSSaliquots.aliq_teto_individual}%).</p></strong>`

        valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p></strong>`

        if (inssretido > 0) {

            var desconto = INSSvalues.tetoindividual - inssretido

            if (desconto < 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de ${tetoindFormatado} menos o valor já retido de ${retidoFormatado} gera restituição a ser paga no valor de ${desconto}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Alíquota: ${INSSaliquots.aliq_teto_individual}%</p>
                                      <p class="resultado">Desconto do Teto: ${tetoindFormatado}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Restituição: ${desconto}</p></strong>`

            } else if (desconto == 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de ${tetoindFormatado} menos o valor já retido de ${retidoFormatado} não gera diferença a recolher.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Alíquota: ${INSSaliquots.aliq_teto_individual}%</p>
                                      <p class="resultado">Desconto do Teto: ${tetoindFormatado}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Não há mais recolhimento de INSS.</p></strong>`

            } else if (desconto > 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de ${tetoindFormatado} menos o valor já retido de ${retidoFormatado} gera diferença a recolher no valor de ${desconto}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Alíquota: ${INSSaliquots.aliq_teto_individual}%</p>
                                      <p class="resultado">Desconto do Teto: ${tetoindFormatado}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Diferença: ${desconto}</p></strong>`

            }

        } else {

            var desconto = INSSvalues.tetoindividual
            valores.innerHTML += `<strong><p class="resultado">Alíquota: ${INSSaliquots.aliq_teto_individual}%</p>
                                  <p class="resultado">Desconto do Teto: ${tetoindFormatado}</p></strong>`

        }

    }

    if (base >= INSSvalues.salariomaximo && vinculo == "segurado") { /*Para calcular o teto para contribuintes segurados*/

        resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                            <p class="resultado">A Base de INSS é maior ou igual a remuneração máxima (${maxFormatado}).</p>
                            <strong><p class="resultado">O desconto de INSS para a base informada é o teto de ${tetosegFormatado} (${maxFormatado} x ${aliq_teto_segurado}%).</p></strong>`

        valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p></strong>`

        if (inssretido > 0) {

            var desconto = INSSvalues.tetosegurado - inssretido

            if (desconto < 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de ${tetosegFormatado} menos o valor já retido de ${retidoFormatado} gera restituição a ser paga no valor de ${desconto}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Alíquota: ${aliq_teto_segurado}%</p>
                                      <p class="resultado">Desconto do Teto: ${tetosegFormatado}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Restituição: ${desconto}</p></strong>`

            } else if (desconto == 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de ${tetosegFormatado} menos o valor já retido de ${retidoFormatado} não gera diferença a recolher.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Alíquota: ${aliq_teto_segurado}%</p>
                                      <p class="resultado">Desconto do Teto: ${tetosegFormatado}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Não há mais recolhimento de INSS.</p></strong>`

            } else if (desconto > 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de ${tetosegFormatado} menos o valor já retido de ${retidoFormatado} gera diferença a recolher no valor de ${desconto}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Alíquota: ${aliq_teto_segurado}%</p>
                                      <p class="resultado">Desconto do Teto: ${tetosegFormatado}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Diferença: ${desconto}</p></strong>`

            }

        } else {

            var desconto = INSSvalues.tetosegurado
            valores.innerHTML += `<strong><p class="resultado">Alíquota: ${aliq_teto_segurado}%</p>
                                  <p class="resultado">Desconto do Teto: ${tetosegFormatado}</p></strong>`

        }
    }

    {
        if (vinculo == "individual") { /*Cálculo abaixo do teto para contribuintes individuais, com alíquota fixa de ${INSSaliquots.aliq_teto_individual}%*/

            if (base < INSSvalues.salariomaximo) {

                resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                                       <p class="resultado">Por ser Contribuinte Individual, a alíquota fixa de recolhimento é ${INSSaliquots.aliq_teto_individual}%.</p>`

                valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                     <p class="resultado">Alíquota: ${INSSaliquots.aliq_teto_individual}%</p></strong>`

                var desconto = base * INSSaliquots.aliq_teto_individual / 100

            }
        }

        else if (vinculo == "segurado") { /*Cálculo abaixo do teto para contribuintes segurados, com alíquota efetiva%*/

            if (base_comparacao <= 1) { /*Cálculo abaixo do teto para contribuintes segurados, com remuneração até a primeira faixa%*/

                var desconto = Number((parseFloat(base * INSSaliquots.aliquota7 / 100).toFixed(6).slice(0, -4)))
                var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

                resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>`

                valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                     <p class="resultado">Alíquota Efetiva: ${aliquotaefetiva}%</p>`

            }

            else if (base_comparacao <= (INSSvalues.limite2 / INSSvalues.salariominimo)) { /*Cálculo abaixo do teto para contribuintes segurados, com remuneração até a segunda faixa%*/

                var desc1 = Number((parseFloat(INSSvalues.salariominimo * INSSaliquots.aliquota7 / 100)).toFixed(6).slice(0, -4))
                var desc2 = Number((parseFloat(((base - INSSvalues.salariominimo) * INSSaliquots.aliquota9 / 100))).toFixed(6).slice(0, -4))
                var desconto = (parseFloat((desc1 + desc2).toFixed(6).slice(0, -4)))
                var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

                var desc1 = desc1.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desc2 = desc2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                                       <p class="resultado">1ª Faixa - Salário Mínimo (${minFormatado}) * ${INSSaliquots.aliquota7}% = ${desc1}</p>
                                       <p class="resultado">2ª Faixa - (${baseFormatado} - ${minFormatado}) * ${INSSaliquots.aliquota9}% = ${desc2}</p>`

                valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                     <p class="resultado">Alíquota Efetiva: ${aliquotaefetiva}%</p>`

            }

            else if (base_comparacao <= (INSSvalues.limite3 / INSSvalues.salariominimo)) { /*Cálculo abaixo do teto para contribuintes segurados, com remuneração até a terceira faixa%*/

                var desc1 = Number((parseFloat(INSSvalues.salariominimo * INSSaliquots.aliquota7 / 100)).toFixed(6).slice(0, -4))
                var desc2 = Number((parseFloat((INSSvalues.limite2 - INSSvalues.salariominimo) * INSSaliquots.aliquota9 / 100)).toFixed(6).slice(0, -4))
                var desc3 = Number((parseFloat((base - INSSvalues.limite2) * INSSaliquots.aliquota12 / 100)).toFixed(6).slice(0, -4))
                var desconto = (parseFloat((desc1 + desc2 + desc3).toFixed(6).slice(0, -4)))
                var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

                var desc1 = desc1.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desc2 = desc2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desc3 = desc3.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                                       <p class="resultado">1ª Faixa - Salário Mínimo (${minFormatado}) * ${INSSaliquots.aliquota7}% = ${desc1}</p>
                                       <p class="resultado">2ª Faixa - (${limite2Formatado} - ${minFormatado}) * ${INSSaliquots.aliquota9}% = ${desc2}</p>
                                       <p class="resultado">3ª Faixa - (${baseFormatado} - ${limite2Formatado}) * ${INSSaliquots.aliquota12}% = ${desc3}</p>`

                valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                     <p class="resultado">Alíquota Efetiva: ${aliquotaefetiva}%</p>`

            }

            else if (base_comparacao < (INSSvalues.salariomaximo / INSSvalues.salariominimo)) { /*Cálculo abaixo do teto para contribuintes segurados, com remuneração até a quarta faixa%*/

                var desc1 = Number((parseFloat(INSSvalues.salariominimo * INSSaliquots.aliquota7 / 100)).toFixed(6).slice(0, -4))
                var desc2 = Number((parseFloat((INSSvalues.limite2 - INSSvalues.salariominimo) * INSSaliquots.aliquota9 / 100)).toFixed(6).slice(0, -4))
                var desc3 = Number((parseFloat((INSSvalues.limite3 - INSSvalues.limite2) * INSSaliquots.aliquota12 / 100)).toFixed(6).slice(0, -4))
                var desc4 = Number((parseFloat((base - INSSvalues.limite3) * INSSaliquots.aliquota14 / 100)).toFixed(6).slice(0, -4))
                var desconto = (parseFloat((desc1 + desc2 + desc3 + desc4).toFixed(6).slice(0, -4)))
                var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

                var desc1 = desc1.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desc2 = desc2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desc3 = desc3.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desc4 = desc4.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                                       <p class="resultado">1ª Faixa - Salário Mínimo (${minFormatado}) * ${INSSaliquots.aliquota7}% = ${desc1}</p>
                                       <p class="resultado">2ª Faixa - (${limite2Formatado} - ${minFormatado}) * ${INSSaliquots.aliquota9}% = ${desc2}</p>
                                       <p class="resultado">3ª Faixa - (${limite3Formatado} - ${limite2Formatado}) * ${INSSaliquots.aliquota12}% = ${desc3}</p>
                                       <p class="resultado">4ª Faixa - (${baseFormatado} - ${limite3Formatado}) * ${INSSaliquots.aliquota14}% = ${desc4}</p>`

                valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                     <p class="resultado">Alíquota Efetiva: ${aliquotaefetiva}%</p>`

            }

        }

        if (inssretido > 0 && base < INSSvalues.salariomaximo) { /*Cálculo quando há retenção de INSS na competência*/

            var desconto2 = parseFloat((desconto - inssretido).toFixed(6).slice(0, -4))

            if (desconto2 < 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desconto2 = desconto2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de INSS apurado para a base informada é ${desconto}.</p>
                                        <p class="resultado">O desconto de ${desconto} menos o valor já retido de ${retidoFormatado} gera restituição a ser paga no valor de ${desconto2}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Desconto: ${desconto}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Restituição: ${desconto2}</p></strong>`

            }

            else if (desconto2 == 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desconto2 = desconto2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de INSS apurado para a base informada é ${desconto}.</p>
                                        <p class="resultado">O desconto de ${desconto} menos o valor já retido de ${retidoFormatado} não gera diferença a recolher.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Desconto: ${desconto}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Não há mais recolhimento de INSS.</p></strong>`

            }

            else if (desconto2 > 0) {

                var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desconto2 = desconto2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var inssretido = inssretido.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de INSS apurado para a base informada é ${desconto}.</p>
                                        <p class="resultado">O desconto de ${desconto} menos o valor já retido de ${retidoFormatado} gera diferença a recolher no valor de ${desconto2}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Desconto: ${desconto}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Diferença: ${desconto2}</p></strong>`

            }

        }

        else if (base < INSSvalues.salariomaximo) {

            var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))
            var desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

            resultado.innerHTML += `<p class="resultado"><strong>A base de ${baseFormatado} * ${aliquotaefetiva}% (alíquota efetiva) gera um desconto de INSS de ${desconto}.</strong></p>`

            valores.innerHTML += `<strong><p class="resultado">Desconto: ${desconto}</p></strong>`

        }

    }

    mostrarResultado()

}