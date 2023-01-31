function calcular() {

    var horas = (Number.parseFloat(document.getElementById('horas').value))
    var minutos = (Number.parseFloat(document.getElementById('minutos').value))
    var indiceNoturno = 60 / 52.5

    if (isNaN(horas) && isNaN(minutos)) {
        showAlert('error','Informe as Horas e/ou Minutos com valores válidos e maiores que zero.')
        return
    } else if (minutos > 59) {
        showAlert('error','Informe minutos entre 00 e 59.')
        return
    } else if ((typeof minutos == 'number') && (isNaN(horas) || horas < 0)) {
        showAlert('error','Verifique o valor informado no campo de "horas".')
        return
    } else if ((typeof horas == 'number') && (isNaN(minutos) || minutos < 0)) {
        showAlert('error','Verifique o valor informado no campo de "minutos".')
        return
    }

    if (horas < 10 && minutos < 10) {
        result.innerHTML = `<strong><p class="resultado">Total de horas trabalhadas em período noturno: 0${horas}:0${minutos}</p></strong>`
    } else if (horas < 10 && minutos >= 10) {
        result.innerHTML = `<strong><p class="resultado">Total de horas trabalhadas em período noturno: 0${horas}:${minutos}</p></strong>`
    } else if (horas >= 10 && minutos < 10) {
        result.innerHTML = `<strong><p class="resultado">Total de horas trabalhadas em período noturno: ${horas}:0${minutos}</p></strong>`
    } else {
        result.innerHTML = `<strong><p class="resultado">Total de horas trabalhadas em período noturno: ${horas}:${minutos}</p></strong>`
    }

    if (minutos <= 0) {
        var horasNoturnasDecimais = horas * indiceNoturno
        var decimaisNoturnas = remainer = horasNoturnasDecimais % 1
        var minutosNoturnos = decimaisNoturnas * 60 / 100
        var roundMinutosNoturnos = minutosNoturnos.toFixed(2)
        var roundMinutosNoturnos2 = roundMinutosNoturnos * 100

        result.innerHTML += `<p class="resultado">Multiplica as horas inteiras pelo índice noturno: ${horas} * ${indiceNoturno} = ${horasNoturnasDecimais}</p>`

        if (Math.trunc(horasNoturnasDecimais) > horas) {
            horasAfter = Number.parseInt(Math.trunc(horasNoturnasDecimais))
        } else {
            horasAfter = horas
        }

        if (minutosNoturnos > 0) {
            result.innerHTML += `<p class="resultado">Converte os decimais em minutos: ${decimaisNoturnas} * 0.60 = ${minutosNoturnos}</p>
                                 <p class="resultado">Arredonda os minutos e soma às horas inteiras: ${horasAfter} + ${roundMinutosNoturnos}</p>`
        }
    } else if (minutos > 0) {
        var minutosDecimais = minutos / 60
        var horasDecimais = horas + minutosDecimais
        var horasNoturnasDecimais = horasDecimais * indiceNoturno
        var decimaisNoturnas = remainer = horasNoturnasDecimais % 1
        var minutosNoturnos = decimaisNoturnas * 60 / 100
        var roundMinutosNoturnos = minutosNoturnos.toFixed(2)
        var roundMinutosNoturnos2 = (roundMinutosNoturnos * 100).toFixed(0)

        if (Math.trunc(horasNoturnasDecimais) > horas) {
            horasAfter = Number.parseInt(Math.trunc(horasNoturnasDecimais))
        } else {
            horasAfter = horas
        }

        if (minutosNoturnos > 0) {
            result.innerHTML += `<p class="resultado">Converte os minutos em decimais: ${minutos} / 60 = ${minutosDecimais}</p>
            <p class="resultado">Novo valor da hora transformada em decimais: ${horasDecimais}</p>
            <p class="resultado">Multiplica as horas em decimais pelo índice noturno: ${horasDecimais} * ${indiceNoturno} = ${horasNoturnasDecimais}</p>
            <p class="resultado">Converte os decimais em minutos: ${decimaisNoturnas} * 0.60 = ${minutosNoturnos}</p>
            <p class="resultado">Arredonda os minutos e soma às horas inteiras: ${horasAfter} + ${roundMinutosNoturnos}</p>`
        } else {
            result.innerHTML += `<p class="resultado">Converte os minutos em decimais: ${minutos} / 60 = ${minutosDecimais}</p>
            <p class="resultado">Novo valor da hora transformada em decimais: ${horasDecimais}</p>
            <p class="resultado">Multiplica as horas em decimais pelo índice noturno: ${horasDecimais} * ${indiceNoturno} = ${horasNoturnasDecimais}</p>`
        }
    }

    if (horasAfter < 10 && roundMinutosNoturnos2 < 10) {
        result.innerHTML += `<strong><p class="resultado">As horas trabalhadas informadas convertidas para horas noturnas é igual a 0${horasAfter}:0${roundMinutosNoturnos2}.</p></strong><br>`
    } else if (horasAfter < 10 && roundMinutosNoturnos2 >= 10) {
        result.innerHTML += `<strong><p class="resultado">As horas trabalhadas informadas convertidas para horas noturnas é igual a 0${horasAfter}:${roundMinutosNoturnos2}.</p></strong><br>`
    } else if (horasAfter >= 10 && roundMinutosNoturnos2 < 10) {
        result.innerHTML += `<strong><p class="resultado">As horas trabalhadas informadas convertidas para horas noturnas é igual a ${horasAfter}:0${roundMinutosNoturnos2}.</p></strong><br>`
    } else {
        result.innerHTML += `<strong><p class="resultado">As horas trabalhadas informadas convertidas para horas noturnas é igual a ${horasAfter}:${roundMinutosNoturnos2}.</p></strong><br>`
    }

    mostrarResultado()

}