

function inicio() {
    location.replace("index.html")
}

function INSSano() {
    location.replace("inss.html")
}

function ConfIRRF() {
    location.replace("irrf.html")
}

function ConfFOL() {
    location.replace("folha.html")
}

function ConfHOR() {
    location.replace("noturna.html")
}

function ConfAVI() {
    location.replace("aviso.html")
}

function ConfINSS(ano) {
    $("#inssano").hide();
    $("#calculoinss").show();
    preparaINSS(ano)
}

function resultadoson() {
    $("#modal-resultados").show();
}

function resultadosoff() {
    $("#modal-resultados").hide();
}
function mostrarContrato() {
    $("#contrato").show();
}

function ocultarContrato() {
    $("#contrato").hide();
}

function limpar() {
    location.reload();
}

function mostrarResultado(baseIRRF, limiteIRRF) {

    Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Cálculo concluído!',
        showConfirmButton: false,
        timer: 1500
    })

    if (baseIRRF <= limiteIRRF) {
        Swal.fire({
            position: 'top',
            icon: 'warning',
            title: 'Hey!',
            text: 'A Base de IRRF é menor ou igual a remuneração isenta. Para esse valor de Base de Cálculo não há recolhimento de Imposto de Renda.',
            showConfirmButton: false,
            timer: 5000
        })
    }

    resultadoson()

}

function showAlert(icon, text) {

    if (icon == 'success') {
        title = 'Yes!'
    } else if (icon == 'error') {
        title = 'Ops...'
    } else if (icon == 'warning') {
        title = 'Hey!'
    }

    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: true
    })

}