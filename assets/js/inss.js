let anoCalculo;
let vinculo = "segurado";
let data;

$("#inssYear").on("change", function () {
    preparaINSS(this.value);
});

$("input:radio[name=vinculo]").on("change", function () {
    vinculo = this.value;
    $("#inssTeto").html(`Teto de ${(vinculo == "segurado" ? data.tetosegurado : data.tetoindividual).toLocaleString("pt-BR", currencyFormat)}`);
});

function populateINSS() {
    $("#inssYear").html("");
    getINSSYears().forEach(el => {
        $("#inssYear").append(`
            <option>${el}</option>
        `);
    });
    preparaINSS($("#inssYear").val());
}

function populateINSSTable(ano) {
    data = getINSSData(ano);
    let tData = data.tabela;
    data.max = getLimite(4, ano);
    $("#inssTable").html("");
    tData.forEach(el => {
        $("#inssTable").append(`
            <tr>
                <td>${el.nome} ${el.valor.toLocaleString("pt-BR", currencyFormat)}</td>
                <td>${el.aliquota}%</td>
            </tr>
        `);
    });
    $("#inssTable").append(`
        <tr>
            <td>Base de INSS > ${data.max.toLocaleString("pt-BR", currencyFormat)}</td>
            <td id="inssTeto">Teto de ${(vinculo == "segurado" ? data.tetosegurado : data.tetoindividual).toLocaleString("pt-BR", currencyFormat)}</td>
        </tr>
    `);
}

function preparaINSS(ano) {
    getHeader(`CÁLCULO DE INSS - ${ano}`, "");
    anoCalculo = ano;
    populateINSSTable(ano);
}

function calcular() {
    let data = getINSSData(anoCalculo);
    let aliquotas = getAliquotas("INSS");

    let base1 = Number.parseFloat($("#base-1").val());
    let base2 = Number.parseFloat($("#base-2").val());
    let retido = Number.parseFloat($("#retido").val());

    if (base1 < 0 || base2 < 0 || isNaN(base1) || isNaN(base2)) {
        showAlert('error', 'Informe um valor para Base de INSS ou INSS Anterior válido maior que zero.')
        return
    }

    let base = base1 + base2;

    if (base <= 0) {
        showAlert('error', 'Informe um valor para Base de INSS ou INSS Anterior maior que zero.')
        return
    }

    if (retido < 0) {
        showAlert('error', 'Informe um valor para INSS Retido maior que 0')
        return
    }

    let salMin = getLimite(1, anoCalculo);
    let salMax = getLimite(4, anoCalculo);
    let limite2 = getLimite(2, anoCalculo);
    let limite3 = getLimite(3, anoCalculo);

    let qtde_salariominimo = Number.parseFloat(base / salMin).toFixed(2);
    let base_comparacao = Number.parseFloat(base / salMin);
    let baseFormatado = base.toLocaleString('pt-BR', currencyFormat);
    let minFormatado = salMin.toLocaleString('pt-BR', currencyFormat);
    let maxFormatado = salMax.toLocaleString('pt-BR', currencyFormat);
    let limite2Formatado = limite2.toLocaleString('pt-BR', currencyFormat);
    let limite3Formatado = limite3.toLocaleString('pt-BR', currencyFormat);
    let retidoFormatado = retido.toLocaleString('pt-BR', currencyFormat);

    let resultado = document.getElementById('resultados');
    let valores = document.getElementById('valores');

    let tetoFormatado = (vinculo == "segurado" ? data.tetosegurado.toLocaleString('pt-BR', currencyFormat) : data.tetoindividual.toLocaleString('pt-BR', currencyFormat));
    let aliquota = (vinculo == "segurado" ? Number.parseFloat(data.tetosegurado * 100 / salMax).toFixed(6) : aliquotas.aliq_teto_individual);
    let teto = (vinculo == "segurado" ? data.tetosegurado : data.tetoindividual);
    let desconto = 0;

    if (base >= salMax) {
        resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                               <p class="resultado">A Base de INSS é maior ou igual a remuneração máxima (${maxFormatado}).</p>
                               <strong><p class="resultado">O desconto de INSS para a base informada é o teto de ${tetoFormatado} (${maxFormatado} x ${aliquota}%).</p></strong>`

        valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p></strong>`

        if (retido > 0) {
            desconto = teto - retido
            descontoFormatado = desconto.toLocaleString('pt-BR', currencyFormat)
            let descontoDescricao = 'não gera diferença a recolher';
            if(desconto < 0) {
                descontoDescricao = 'gera restituição a ser paga no valor de ' + descontoFormatado;
            } else if(desconto > 0) {
                descontoDescricao = 'gera diferença a recolher no valor de ' + descontoFormatado;
            }

            resultado.innerHTML += `<strong><p class="resultado">O desconto de ${tetoFormatado} menos o valor já retido de ${retidoFormatado} ${descontoDescricao}.</p></strong>`
            valores.innerHTML += `<strong><p class="resultado">Alíquota: ${aliquota}%</p>
                                    <p class="resultado">Desconto do Teto: ${tetoFormatado}</p>
                                    <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                    <p class="resultado">Restituição: ${desconto}</p></strong>`
        } else {
            valores.innerHTML += `<strong><p class="resultado">Alíquota: ${aliquota}%</p>
                                  <p class="resultado">Desconto do Teto: ${tetoFormatado}</p></strong>`
        }
    } else {

        if (vinculo == "individual") { /*Cálculo abaixo do teto para contribuintes individuais, com alíquota fixa de ${INSSaliquots.aliq_teto_individual}%*/
            if (base < salMax) {
                resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                                       <p class="resultado">Por ser Contribuinte Individual, a alíquota fixa de recolhimento é ${aliquota}%.</p>`
                valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                     <p class="resultado">Alíquota: ${aliquota}%</p></strong>`
                desconto = base * aliquota / 100
            }
        }

        else if (vinculo == "segurado") { /*Cálculo abaixo do teto para contribuintes segurados, com alíquota efetiva%*/
            if (base_comparacao <= 1) { /*Cálculo abaixo do teto para contribuintes segurados, com remuneração até a primeira faixa%*/
                desconto = Number((parseFloat(base * aliquotas.aliquota7 / 100).toFixed(6).slice(0, -4)))
                var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))
                resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>`
                valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                     <p class="resultado">Alíquota Efetiva: ${aliquotaefetiva}%</p>`
            }

            else if (base_comparacao <= (limite2 / salMin)) { /*Cálculo abaixo do teto para contribuintes segurados, com remuneração até a segunda faixa%*/
                var desc1 = Number((parseFloat(INSSvalues.salariominimo * INSSaliquots.aliquota7 / 100)).toFixed(6).slice(0, -4))
                var desc2 = Number((parseFloat(((base - INSSvalues.salariominimo) * INSSaliquots.aliquota9 / 100))).toFixed(6).slice(0, -4))
                desconto = (parseFloat((desc1 + desc2).toFixed(6).slice(0, -4)))
                var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))

                var desc1 = desc1.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desc2 = desc2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML = `<p class="resultado">A Base de INSS informada é composta por ${qtde_salariominimo} salários mínimos.</p>
                                       <p class="resultado">1ª Faixa - Salário Mínimo (${minFormatado}) * ${INSSaliquots.aliquota7}% = ${desc1}</p>
                                       <p class="resultado">2ª Faixa - (${baseFormatado} - ${minFormatado}) * ${INSSaliquots.aliquota9}% = ${desc2}</p>`

                valores.innerHTML = `<strong><p class="resultado">Base de Cálculo: ${baseFormatado}</p>
                                     <p class="resultado">Alíquota Efetiva: ${aliquotaefetiva}%</p>`

            }

            else if (base_comparacao <= (limite3 / data.salariominimo)) { /*Cálculo abaixo do teto para contribuintes segurados, com remuneração até a terceira faixa%*/

                var desc1 = Number((parseFloat(data.salariominimo * aliquotas.aliquota7 / 100)).toFixed(6).slice(0, -4))
                var desc2 = Number((parseFloat((limite2 - data.salariominimo) * aliqutotas.aliquota9 / 100)).toFixed(6).slice(0, -4))
                var desc3 = Number((parseFloat((base - limite2) * aliqutotas.aliquota12 / 100)).toFixed(6).slice(0, -4))
                desconto = (parseFloat((desc1 + desc2 + desc3).toFixed(6).slice(0, -4)))
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

            else if (base_comparacao < (salMax / data.salariominimo)) { /*Cálculo abaixo do teto para contribuintes segurados, com remuneração até a quarta faixa%*/

                var desc1 = Number((parseFloat(INSSvalues.salariominimo * INSSaliquots.aliquota7 / 100)).toFixed(6).slice(0, -4))
                var desc2 = Number((parseFloat((INSSvalues.limite2 - INSSvalues.salariominimo) * INSSaliquots.aliquota9 / 100)).toFixed(6).slice(0, -4))
                var desc3 = Number((parseFloat((INSSvalues.limite3 - INSSvalues.limite2) * INSSaliquots.aliquota12 / 100)).toFixed(6).slice(0, -4))
                var desc4 = Number((parseFloat((base - INSSvalues.limite3) * INSSaliquots.aliquota14 / 100)).toFixed(6).slice(0, -4))
                desconto = (parseFloat((desc1 + desc2 + desc3 + desc4).toFixed(6).slice(0, -4)))
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

        if (inssretido > 0 && base < salMax) { /*Cálculo quando há retenção de INSS na competência*/

            var desconto2 = parseFloat((desconto - inssretido).toFixed(6).slice(0, -4))

            if (desconto2 < 0) {

                desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desconto2 = desconto2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de INSS apurado para a base informada é ${desconto}.</p>
                                        <p class="resultado">O desconto de ${desconto} menos o valor já retido de ${retidoFormatado} gera restituição a ser paga no valor de ${desconto2}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Desconto: ${desconto}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Restituição: ${desconto2}</p></strong>`

            }

            else if (desconto2 == 0) {

                desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desconto2 = desconto2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de INSS apurado para a base informada é ${desconto}.</p>
                                        <p class="resultado">O desconto de ${desconto} menos o valor já retido de ${retidoFormatado} não gera diferença a recolher.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Desconto: ${desconto}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Não há mais recolhimento de INSS.</p></strong>`

            }

            else if (desconto2 > 0) {

                desconto = desconto.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var desconto2 = desconto2.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })
                var inssretido = inssretido.toLocaleString('pt-BR', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' })

                resultado.innerHTML += `<strong><p class="resultado">O desconto de INSS apurado para a base informada é ${desconto}.</p>
                                        <p class="resultado">O desconto de ${desconto} menos o valor já retido de ${retidoFormatado} gera diferença a recolher no valor de ${desconto2}.</p></strong>`

                valores.innerHTML += `<strong><p class="resultado">Desconto: ${desconto}</p>
                                      <p class="resultado">INSS Retido: ${retidoFormatado}</p>
                                      <p class="resultado">Diferença: ${desconto2}</p></strong>`

            }

        }

        else if (base < salMax) {

            var aliquotaefetiva = (parseFloat(desconto * 100 / base).toFixed(6))
            resultado.innerHTML += `<p class="resultado"><strong>A base de ${baseFormatado} * ${aliquotaefetiva}% (alíquota efetiva) gera um desconto de INSS de ${desconto.toLocaleString('pt-BR', currencyFormat)}.</strong></p>`
            valores.innerHTML += `<strong><p class="resultado">Desconto: ${desconto}</p></strong>`

        }

    }

    $("#modal-resultados").addClass("is-active");

}