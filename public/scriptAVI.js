function calcular() {

    let finalAVI = new Date(document.getElementById("inicioAVI").value + 'T00:00:00')
    let desligamentoAVI = new Date(document.getElementById("inicioAVI").value + 'T00:00:00')
    let projecao = document.getElementById("projecao")
    let desligamento = document.getElementById("desligamento")
    let diasAVI = Number.parseInt(document.getElementById("diasAVI").value)
    let tipoAVI = document.getElementsByName('tipoAVI')
    let aviso = ''

    if (tipoAVI[0].checked) {
        aviso = "indenizado"
    } else {
        aviso = "trabalhado"
    }

    if (isNaN(finalAVI)) {
        showAlert('error','Informe uma data válida para o início do Aviso Prévio.')
        return
    } 
    
    if (isNaN(diasAVI) || diasAVI <= 0) {
        showAlert('error','Informe uma Quantidade de Dias de Aviso válida, entre 30 e 90 dias.')
        return
    } else if (diasAVI < 30 || diasAVI > 90) {
        showAlert('error','A Quantidade de Dias de Aviso deve estar entre 30 e 90 dias, conforme Lei 12.506.')
        return
    }

    diasAVI = diasAVI - 1

    finalAVI.setDate(finalAVI.getDate() + diasAVI)
    finalAVI = finalAVI.toISOString().split('T')[0]

    if (aviso == "trabalhado" && diasAVI > 30) {
        desligamentoAVI.setDate(desligamentoAVI.getDate() + 29)
        desligamentoAVI = desligamentoAVI.toISOString().split('T')[0]
    } else {
        desligamentoAVI = finalAVI
    }

    desligamento.value = desligamentoAVI
    projecao.value = finalAVI

    mostrarResultado()

}