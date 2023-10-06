// Variables globales
let arcanos;
let contenedorArcanos;
let introDiv;
let cartasSeleccionadas = null;

document.addEventListener("DOMContentLoaded", () => {
    arcanos = document.querySelectorAll(".arcano");
    contenedorArcanos = document.getElementById("arcanos");
    introDiv = document.getElementById("intro");

    const btnAleatorio = document.getElementById("btn-aleatorio");
    btnAleatorio.addEventListener("click", mostrarCartasSeleccionadas);

    const btnReiniciar = document.getElementById("btn-reiniciar");
    btnReiniciar.addEventListener("click", mostrarIntro);

    const btnMostrarTodos = document.getElementById("btn-mostrar-todos");
    btnMostrarTodos.addEventListener("click", () => mostrarCartas([...arcanos]));

    mostrarIntro();
});

function mostrarIntro() {
    contenedorArcanos.style.display = "none";
    introDiv.style.display = "block";
    if (cartasSeleccionadas) {
        cartasSeleccionadas.remove();
        cartasSeleccionadas = null;
    }
}

function mostrarCartaGrande(carta) {
    const imgSrc = carta.querySelector("img").src;
    const nombre = carta.querySelector("h2").textContent;
    const descripcion = carta.querySelector("p").textContent;

    const popup = document.createElement("div");
    popup.classList.add("arcano-popup");

    const img = document.createElement("img");
    img.src = imgSrc;
    img.style.maxWidth = "80%";

    const titulo = document.createElement("h2");
    titulo.textContent = nombre;

    const textoDescripcion = document.createElement("p");
    textoDescripcion.textContent = descripcion;

    popup.addEventListener("click", () => popup.remove());

    popup.appendChild(img);
    popup.appendChild(titulo);
    popup.appendChild(textoDescripcion);
    document.body.appendChild(popup);
}

function mostrarCartas(cartas) {
    introDiv.style.display = "none";

    if (cartasSeleccionadas) {
        cartasSeleccionadas.remove();
    }

    cartasSeleccionadas = document.createElement("div");
    cartasSeleccionadas.id = "arcanos-seleccionados";

    cartas.forEach(carta => {
        const clonedCarta = carta.cloneNode(true);
        clonedCarta.classList.add("arcano-seleccionado");
        clonedCarta.addEventListener("click", () => mostrarCartaGrande(clonedCarta));
        cartasSeleccionadas.appendChild(clonedCarta);
    });

    introDiv.insertAdjacentElement("afterend", cartasSeleccionadas);
}

function obtenerIndicesAleatorios(max, cantidad) {
    const indices = [];
    while (indices.length < cantidad) {
        const indiceAleatorio = Math.floor(Math.random() * max);
        if (!indices.includes(indiceAleatorio)) {
            indices.push(indiceAleatorio);
        }
    }
    return indices;
}

function mostrarCartasSeleccionadas() {
    fetchQuote();
    const indicesAleatorios = obtenerIndicesAleatorios(arcanos.length, 3);
    const cartas = indicesAleatorios.map(indice => arcanos[indice]);
    mostrarCartas(cartas);
}

async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) {
            console.error('Network response was not ok', response);
            return;
        }
        const quote = await response.json();
        const quoteTextElement = document.getElementById('quote-text');
        const quoteAuthorElement = document.getElementById('quote-author');
        if (quoteTextElement && quoteAuthorElement) {
            quoteTextElement.textContent = `"${quote.content}"`;
            quoteAuthorElement.textContent = `- ${quote.author}`;
        } else {
            console.error('HTML elements not found');
        }
    } catch (error) {
        console.error('Error fetching the quote:', error);
    }
}
