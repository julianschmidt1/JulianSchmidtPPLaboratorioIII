const datosJSON = '[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},{"id":51, "modelo":"Dodge Viper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},{"id":67, "modelo":"Boeing CH-47 Chinook","anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},{"id":666, "modelo":"Aprilia RSV 1000 R","anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},{"id":872, "modelo":"Boeing 747-400", "anoFab":1989,"velMax":988, "altMax":13, "autonomia":13450},{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953,"velMax":174, "altMax":3, "autonomia":870}]';
const datosTabla = JSON.parse(datosJSON);
const COLUMNAS = ["id", "modelo", "anoFab", "velMax", "cantPue", "cantRue", "autonomia", "altMax"];

let listaVehiculos = datosTabla.map(vehiculo => {
    const esAereo = vehiculo?.altMax;
    const { id, modelo, anoFab, velMax } = vehiculo;
    if (esAereo) {
        const { altMax, autonomia } = vehiculo;
        return new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
    } else {
        const { cantPue, cantRue } = vehiculo;
        return new Terrestre(id, modelo, anoFab, velMax, cantPue, cantRue);
    }
});

const $ = (elemento) => {
    return document.getElementById(elemento);
}

const tabla = $('contenedor-tabla');
const formulario = $('abm-form');
formulario.style.display = 'none';

console.log(listaVehiculos);

const contenedorCheckboxes = $('checkbox-columnas');
COLUMNAS.map(columna => {
    const nombre = document.createElement('label');
    const checkbox = document.createElement('input');
    nombre.textContent = columna;
    nombre.style.marginLeft = '10px';
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('checked', 'true');
    checkbox.setAttribute('id', `checkbox-${columna}`);

    contenedorCheckboxes.appendChild(nombre);
    contenedorCheckboxes.appendChild(checkbox);
});

const generarStatusPorDefecto = (prop) => {
    const checkbox = document.querySelector(`#checkbox-${prop}`);
    const columna = document.querySelector(`#cabecera-${prop}`);
    checkbox.checked = true;
    columna.style.display = 'table-cell';
}

const cambiarVisibilidadColumnas = () => {
    COLUMNAS.map(columna => {
        const filas = document.querySelectorAll(`#celda-${columna}`);
        const cabeceraColumna = $(`cabecera-${columna}`);
        const checkboxes = document.querySelectorAll(`#checkbox-${columna}`);
        checkboxes.forEach(checkbox => {
            checkbox.onclick = () => {
                const visibilidad = checkbox.checked ? 'table-cell' : 'none';
                filas?.forEach(col => {
                    col.style.display = visibilidad;
                });
                cabeceraColumna.style.display = visibilidad;
            }
        })

    });
}

const generarFilas = (lista) => {
    const filasAnteriores = tabla.querySelectorAll('tr');
    const filasTabla = $('filas-tabla');

    for (let i = 1; i < filasAnteriores.length; i++) {
        filasTabla.removeChild(filasAnteriores[i]);
    }

    lista.map((persona, index) => {
        const fila = document.createElement("tr");
        fila.setAttribute("id-fila", index);
        fila.setAttribute("class", "fila-generada")

        COLUMNAS.map(columna => {
            const celda = document.createElement("td");
            celda.setAttribute('id', `celda-${columna}`);

            generarStatusPorDefecto(columna);

            // Tuve que hacer esto porque cuando habia cantidad de puertas 0, mostraba N/A porque 0 cuenta como valor falsy. Magia Javascriptera :)
            celda.textContent = persona[columna] !== undefined && persona[columna] !== null && persona[columna] !== '' ? persona[columna] : 'N/A';
            fila.appendChild(celda);
        });
        filasTabla.appendChild(fila);
    });

    cambiarVisibilidadColumnas();
}

generarFilas(listaVehiculos);

const filtrarColumnas = () => {
    const selectInput = $('select-filtro');
    const valorSeleccionado = selectInput.value;

    switch (valorSeleccionado) {
        case '1':
            generarFilas(listaVehiculos);
            break;
        case '2':
            generarFilas(listaVehiculos?.filter(vehiculo => vehiculo instanceof Aereo))
            break;
        case '3':
            generarFilas(listaVehiculos?.filter(vehiculo => vehiculo instanceof Terrestre));
            break;
    }
    $('input-promedio').value = '';
}

const calcularPromedio = () => {
    const celdasEdad = Array.from(document.querySelectorAll('#celda-velMax'));
    const valoresEdad = celdasEdad?.map(valor => parseInt(valor.textContent));
    const promedio = valoresEdad.reduce((acumulador, valor) => acumulador + valor, 0) / valoresEdad.length;
    $('input-promedio').value = promedio.toFixed(2);
}

const seleccionarTipoVehiculo = (estaEditando, tipoAereo) => {
    const esAereo = $('tipo-input').value == '1';
    console.log('select: ', $('tipo-input').value);

    console.log(esAereo, estaEditando, tipoAereo);

    if ((esAereo && !estaEditando || (estaEditando && tipoAereo != 'N/A'))) {
        $('autonomia-input').style.display = 'block';
        $('altMax-input').style.display = 'block';
        $('cantPue-input').style.display = 'none';
        $('cantRue-input').style.display = 'none';
    } else {
        $('cantPue-input').style.display = 'block';
        $('cantRue-input').style.display = 'block';
        $('autonomia-input').style.display = 'none';
        $('altMax-input').style.display = 'none';
    }
}

const abrirFormulario = (estaEditando, esAereo) => {
    seleccionarTipoVehiculo(estaEditando, esAereo);
    formulario.style.display = 'flex';
    tabla.style.display = 'none';
    $('boton-eliminar').style.display = estaEditando ? 'block' : 'none';
    $('tipo-input').style.display = estaEditando ? 'none' : 'block';
}

const abrirTabla = () => {
    formulario.style.display = 'none';
    tabla.style.display = 'block';
    $('modelo-input').value = '';
    $('anoFab-input').value = '';
    $('velMax-input').value = '';
    $('autonomia-input').value = '';
    $('altMax-input').value = '';
    $('cantPue-input').value = '';
    $('cantRue-input').value = '';
}

const eliminarAccion = () => {
    const idVehiculo = $('id-input').value;
    listaVehiculos = [...listaVehiculos.filter(vehiculo => vehiculo.id !== parseInt(idVehiculo))];
    generarFilas(listaVehiculos);
    abrirTabla();
}

const aceptarAccion = () => {
    const idVehiculo = $('id-input').value;
    const modelo = $('modelo-input').value.trim();
    const anoFabricacion = $('anoFab-input').value.trim();
    const velocidadMaxima = parseInt($('velMax-input').value);
    const cantidadPuertas = parseFloat($('cantPue-input').value);
    const cantidadRuedas = parseFloat($('cantRue-input').value);
    const autonomia = parseFloat($('autonomia-input').value);
    const alturaMaxima = $('altMax-input').value.trim();

    const esAereo = $('tipo-input').value == '1';

    const generarIdVehiculo = idVehiculo ? parseInt(idVehiculo) : Date.now();
    let nuevoVehiculo;

    console.log($('autonomia-input').value);

    if (esAereo) {
        nuevoVehiculo = new Aereo(
            generarIdVehiculo,
            modelo,
            anoFabricacion,
            velocidadMaxima,
            alturaMaxima,
            autonomia
        );
    } else {
        nuevoVehiculo = new Terrestre(
            generarIdVehiculo,
            modelo,
            anoFabricacion,
            velocidadMaxima,
            cantidadPuertas,
            cantidadRuedas
        );
    }

    if (
        modelo.length > 0 &&
        anoFabricacion > 1885 &&
        velocidadMaxima > 0 &&
        ((nuevoVehiculo instanceof Aereo && alturaMaxima > 0 && autonomia > 0) ||
            (nuevoVehiculo instanceof Terrestre && cantidadPuertas > -1 && cantidadRuedas > 0))
    ) {
        listaVehiculos = idVehiculo
            ? [...listaVehiculos.filter(vehiculo => vehiculo.id !== parseInt(idVehiculo)), nuevoVehiculo]
            : [...listaVehiculos, nuevoVehiculo];
        generarFilas(listaVehiculos);
        abrirTabla();
    } else {
        alert('Alguno de los valores no es valido!');
    }
}

tabla.addEventListener('dblclick', (e) => {
    const fila = e.target.closest('tr');
    const idFila = fila?.getAttribute('id-fila');

    if (fila && idFila) {
        const datos = {};
        const datosCelda = fila?.querySelectorAll('td');

        datosCelda.forEach((_, index) => {
            const columna = COLUMNAS[index];
            const valor = datosCelda[index].textContent;
            datos[columna] = valor;
        });

        console.log(datos);

        $('id-input').value = datos.id || '';
        $('modelo-input').value = datos.modelo || '';
        $('anoFab-input').value = datos.anoFab || '';
        $('velMax-input').value = datos.velMax || '';
        $('altMax-input').value = datos.altMax || '';
        $('autonomia-input').value = datos.autonomia || '';
        $('cantRue-input').value = datos.cantRue || '';
        $('cantPue-input').value = datos.cantPue || '';

        abrirFormulario(true, datos.autonomia);
    }
});

const cabeceraColumnas = document.querySelectorAll('th');

cabeceraColumnas.forEach(cabecera => {
    cabecera.addEventListener('click', () => {
        const columna = cabecera.getAttribute('columna');

        listaVehiculos.sort((a, b) => {
            if (a[columna] < b[columna]) {
                return -1;
            } else if (a[columna] > b[columna]) {
                return 1;
            } else {
                return 0;
            }
        });

        generarFilas(listaVehiculos);
        filtrarColumnas();
    });
});