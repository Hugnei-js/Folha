const removeSelected = true;
const currencyFormat = {maximumFractionDigits: 2, style: 'currency', currency: 'BRL'}
const mainMenuItems = [
    {
        name: "INSS",
        value: "inss"
    },
    {
        name: "IRRF",
        value: "irrf"
    },
    {
        name: "FOLHA",
        value: "folha"
    },
    {
        name: "EXTRAS NOTURNAS",
        value: "noturna"
    },
    {
        name: "PROJEÇÃO DE AVISO",
        value: "aviso"
    }
];

function getHeader(title, subtitle) {
    $("#header").html(`
    <div class="hero-body">
            <h1 class="font-30 font-bold">
                ${title}
            </h1>
            <h2 class="font-18 font-bold">
                ${subtitle}
            </h2>
        </div>
    `);
}

function getFooter() {
    $("#footer").html(`<p>&copy; Hugnei.Junior</p>`);
}

function getMenu(selected) {
    let menu = [...mainMenuItems];
    menu.unshift({ name: "INÍCIO", value: "index" });
    menu.forEach(el => {
        if (removeSelected) {
            if (el.value != selected) {
                getMenuItem(el);
            }
        } else {
            getMenuItem(el);
        }
    });
}

function getMenuItem(el) {
    $("#menu").append(`
        <a href="./${el.value}.html">
            <div class="tile is-parent width-300 height-100">
                <article class="tile is-child notification is-highlight padding-lr-24 btn">
                    <p class="title is-transparent text-black font-18">${el.name}</p>
                </article>
            </div>
        </a>
    `);
}

function getMainMenu() {
    mainMenuItems.forEach(el => {
        $("#mainMenu").append(`
        <a href="./${el.value}.html">
            <div class="tile is-parent width-300 height-100">
                <article class="tile is-child notification is-highlight padding-lr-24 btn">
                    <p class="title is-transparent text-black font-18">${el.name}</p>
                </article>
            </div>
        </a>
        `);
    });
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
