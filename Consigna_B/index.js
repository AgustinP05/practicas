const listRegistros = [
    {nombre: "Agustin Perea", tipoDoc:"DNI",numDoc:"44123321", nota1parcial:"4", nota2parcial:"7", nota1rec:"8", nota2rec:"" },
    {nombre: "Luke Trotamundos", tipoDoc:"LC/LE",numDoc:"441221", nota1parcial:"5", nota2parcial:"7", nota1rec:"", nota2rec:"" },
    {nombre: "Jimmy Hendrix", tipoDoc:"DNI",numDoc:"30123322", nota1parcial:"3", nota2parcial:"2", nota1rec:"", nota2rec:"7" }
]

const tablaAlumnos = document.getElementById("tablaAlumnos");
const listAlumnos = listRegistros

//------------- Funciones para registros
//Funcion para convertir un registro de la lista en html
const registroToRow = (registro) =>{
    const tr = document.createElement("tr")

    // th del Nombre
    const thNombre= document.createElement("th")
    thNombre.textContent = registro.nombre
    tr.appendChild(thNombre)

    const tdTipo = document.createElement("td");
    tdTipo.textContent = registro.tipoDoc;
    tr.appendChild(tdTipo);

    const tdNum = document.createElement("td");
    tdNum.textContent = registro.numDoc;
    tr.appendChild(tdNum);



    // --- Logica interna de notas  ---
    const n1 = registro.nota1parcial !== "" ? Number(registro.nota1parcial) : undefined;
    const n2 = registro.nota2parcial !== "" ? Number(registro.nota2parcial) : undefined;
    const r1 = registro.nota1rec !== "" ? Number(registro.nota1rec) : undefined;
    const r2 = registro.nota2rec !== "" ? Number(registro.nota2rec) : undefined;

    // El recuperatorio solo reemplaza al parcial internamente para definir la condición
    const nota1Definitiva = r1 !== undefined ? r1 : n1;
    const nota2Definitiva = r2 !== undefined ? r2 : n2;

    let claseCSS = "td_nota_reprobado";

    //Si es todo cero sería ausente
    if (n1 === undefined && n2 === undefined && r1 === undefined && r2 === undefined) {
        claseCSS = "td_nota_ausente";
    } else if (nota1Definitiva !== undefined && nota2Definitiva !== undefined) {
        
        const promedio = (nota1Definitiva + nota2Definitiva) / 2;

        if (nota1Definitiva >= 7 && nota2Definitiva >= 7 && promedio >= 7) {
            claseCSS = "td_nota_promocionado";
        } else if (nota1Definitiva >= 4 && nota2Definitiva >= 4 && promedio >= 4) {
            claseCSS = "td_nota_aprobado";
        } else {
            claseCSS = "td_nota_reprobado";
        }
    } else {
        // Si le falta alguna nota definitiva, se considera reprobado
        claseCSS = "td_nota_reprobado";
    }

    //Arrays de td de notas
     const notasCampos = [
        registro.nota1parcial,
        registro.nota2parcial,
        registro.nota1rec === "" ? "-" : registro.nota1rec,
        registro.nota2rec === "" ? "-" : registro.nota2rec
    ];

    // Se crea los td para cada nota y se agregam al tr
    notasCampos.forEach(notaTexto => {
        const tdNota = document.createElement("td");
        tdNota.textContent = notaTexto === "" ? "-" : notaTexto;
        
        // Le pintamos el color correspondiente basado en la condición calculada antes
        tdNota.classList.add(claseCSS); 
        tr.appendChild(tdNota);
    });

    return tr
}

//Se hacen html todos los registros de la lista y retornarlos
const mapearRegistros = () =>{
    return listAlumnos.map((alumno)=> registroToRow(alumno))
} 

//Actualizar el html de la tabla con los registros previamente parseados a html
const cargarTabla = () =>{
    //console.log(tablaAlumnos.innerHTML)
    tablaAlumnos.innerHTML = "" //limpio la tabla por las dudas  
    const filas = mapearRegistros()  
    tablaAlumnos.append(...filas)//Inserto todos los elementos dentro del array separados 

}


//Agregar a la lista
const agregarNuevo = (dataAlumno) =>{
    //Le agregamos el registro a la lista
    listAlumnos.push(dataAlumno)

    //En este punto listAlumnos está actualizada
    //Procedemos a actualizar la tabla con la nueva data
    cargarTabla()
}


//-----------Validaciones
const validarNombre = () =>{
    const nombreInput = document.getElementById('nombreCompleto')
    const textError = document.getElementById('text-error')
    let validarCantCaracter = true

    // Validacion de si el valor contiene números o caracteres especiales invalidos
    //Por las dudas queridos profes les comparo de donde saco las expresiones regulares: https://www.spensiones.cl/xml/doc/apps/desafiliaciones/resolucionesDesafiliacion/ResolucionesDesafiliacion-v1.03.html
    const soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; 

    //const caracteres = nombreInput.value.length
    const caracteres = nombreInput.value.trim().length // El trim borra los espacios vacios del principio y del final
    //const nombreDividido = nombreInput.value.split(" ")
    const nombreDividido = nombreInput.value.trim().split(/\s+/).filter(p => p.length > 0) //La expresion regular de /\s+/ toma uno o mas espacios y los toma como un espacio solo

    palabras= nombreDividido.length
    //console.log("palabras ",palabras)
    
    nombreDividido.forEach(element => {
        //console.log(element)
        // if(validarCantCaracter == true){
        //      //console.log("De la pabra "+element+ " su cantidad es "+ element.length);
        //      element.length>=4 ? validarCantCaracter = true : validarCantCaracter = false;                                                                                                  
        //      //console.log("validaaar ",validarCantCaracter)
        //      return validarCantCaracter
        // }
        
        if(element.length < 4) {
            validarCantCaracter = false;
        }
    });

    if(nombreInput.value == ""){
        if(textError) textError.textContent = "No puede estar vacio"
        //nombreInput.classList.remove("is-valid")
        nombreInput.classList.add("is-invalid")
    }
    else if(!soloLetrasYEspacios.test(nombreInput.value)) { // Es un metodo de las expresiones regulares para validar si se cumple con la expresion regular declarada. Retorna true o false
        if(textError) textError.textContent = "El nombre solo debe contener letras"
        nombreInput.classList.add("is-invalid")
    }else if(palabras < 2){
        if(textError) textError.textContent = "Tiene que ser como minimo 2 palabras"
        //nombreInput.classList.remove("is-valid")
        nombreInput.classList.add("is-invalid")
    }else if(caracteres > 30){
        if(textError) textError.textContent = "No debe excederse de 30 caracteres"
        //nombreInput.classList.remove("is-valid")
        nombreInput.classList.add("is-invalid")
    }else if(validarCantCaracter == false){
        if(textError) textError.textContent = "Cada palabra debe tener minimo 4 caracteres"
        //nombreInput.classList.remove("is-valid")
        nombreInput.classList.add("is-invalid")
    }
    else{
        nombreInput.classList.remove("is-invalid")
        nombreInput.classList.add("is-valid")
    }

}

const inputTypeDoc = document.getElementById("inputTypeDoc")
const numDoc = document.getElementById("numDoc")

const validarTipoDoc = () =>{
    
    const tipoDocError = document.getElementById("tipoDoc-error")

    if(inputTypeDoc.value == "" || inputTypeDoc.value =="Tipo..."){
        inputTypeDoc.classList.remove("is-valid")
        inputTypeDoc.classList.add("is-invalid")
    }else{
        inputTypeDoc.classList.remove("is-invalid")
        inputTypeDoc.classList.add("is-valid")
    }
}


const validarNumDoc = () =>{
    
    const numDocError= document.getElementById("numDoc-error")
    const valorDoc = numDoc.value.trim();

    // Validación de que solo contenga números enteros  
    const esNumeroEntero = /^\d+$/;
    
    if(!esNumeroEntero.test(valorDoc) && valorDoc !== "") {
        if(numDocError) numDocError.textContent = "El documento debe contener solo números."
        numDoc.classList.remove('is-valid')
        numDoc.classList.add('is-invalid')
        return;
    }

    if(inputTypeDoc.value == "DNI"){
        if (numDoc.value.length < 7 || numDoc.value.length > 8 ) {
            if(numDocError) numDocError.textContent = "Debe ser entre 7 y 8 digitos."
            numDoc.classList.remove('is-valid')
            numDoc.classList.add('is-invalid')
        }else{
            numDoc.classList.remove('is-invalid')
            numDoc.classList.add('is-valid')
        }
        
    }else if(inputTypeDoc.value == "LC/LE"){
        if (numDoc.value.length < 6 || numDoc.value.length > 8 ) {
            if(numDocError) numDocError.textContent = "Debe ser entre 6 y 8 digitos."
            numDoc.classList.remove('is-valid')
            numDoc.classList.add('is-invalid')
        }else{
            numDoc.classList.remove('is-invalid')
            numDoc.classList.add('is-valid')
        }
    }

}

const validarNota = () =>{
    const input1nota = document.getElementById("nota1parcial")
    const nota1parcialError = document.getElementById("nota1parcial-error")

    const input2nota = document.getElementById("nota2parcial")
    const nota2parcialError = document.getElementById("nota2parcial-error")
    
    const input1rec = document.getElementById("nota1rec")
    const nota1recError = document.getElementById("nota1rec-error")
    const input2rec= document.getElementById("nota2rec")
    const nota2recError = document.getElementById("nota2rec-error")

    // Validacion de si la nota ingresada equivale a un entero/flotante numerico valido
    const esNumeroValido = (valor) => !isNaN(valor) && !isNaN(parseFloat(valor));

    //Nota 1
    if (input1nota.value.trim() == "") { //Los inputs de nota de examen no pueden estar vacios
        //if(nota1parcialError) nota1parcialError.textContent = "Pon la nota"
        //input1nota.classList.remove('is-valid')
        input1nota.classList.add('is-invalid')
    }else if (!esNumeroValido(input1nota.value) || Number(input1nota.value) < 0 || Number(input1nota.value) > 10 ) { 
        if(nota1parcialError) nota1parcialError.textContent = "La nota tiene que ser entre 1 y 10"
        //input1nota.classList.remove('is-valid')
        input1nota.classList.add('is-invalid')
    }else{
        input1nota.classList.remove('is-invalid')
        input1nota.classList.add('is-valid')
    }

    //Nota 2
    if (input2nota.value.trim() == "") {
        //if(nota2parcialError) nota1parcialError.textContent = "Pon la nota"
        //input2nota.classList.remove('is-valid')
        input2nota.classList.add('is-invalid')
    }else if (!esNumeroValido(input2nota.value) || Number(input2nota.value < 1) || Number(input2nota.value > 10) ) {
        if(nota2parcialError) nota2parcialError.textContent = "La nota tiene que ser entre 1 y 10"
        //input2nota.classList.remove('is-valid')
        input2nota.classList.add('is-invalid')
    }else{
        input2nota.classList.remove('is-invalid')
        input2nota.classList.add('is-valid')
    }

    //Recuperatorio 1
    if(input1rec.value.trim() !== ""){//Opcional pero si se escribe tiene que ser valido
        if (!esNumeroValido(input1rec.value) || Number(input1rec.value) < 1 || Number(input1rec.value) > 10) {
            if(nota1recError) nota1recError.textContent = "La nota tiene que ser entre 1 y 10"
            //input1rec.classList.remove('is-valid')
            input1rec.classList.add('is-invalid')
        } else {
            input1rec.classList.remove('is-invalid')
            input1rec.classList.add('is-valid')
        }
    }

    //Recuperatorio 2
    if (input2rec.value.trim() !== "") {
        if (!esNumeroValido(input2rec.value) || Number(input2rec.value) < 1 || Number(input2rec.value) > 10 ) {
            if(nota2recError) nota2recError.textContent = "La nota tiene que ser entre 1 y 10"
            //input2rec.classList.remove('is-valid')
            input2rec.classList.add('is-invalid')
        } else {
            input2rec.classList.remove('is-invalid')
            input2rec.classList.add('is-valid')
        }
    }

}


const validarEmail = () => {
    const emailInput = document.getElementById('emailAlumno');
    const emailError = document.getElementById('email-error');
    
    // Expresión regular estándar para emails
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailValue = emailInput.value.trim();

    if (emailValue === "") {
        if (emailError) emailError.textContent = "El correo electrónico no puede estar vacío.";
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");
    } 
    else if (!regexEmail.test(emailValue)) {
        if (emailError) emailError.textContent = "Ingrese un formato de correo válido (ej: usuario@dominio.com).";
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");
    } 
    else {
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
    }
}


// Ordenar la lista alfabéticamente y recargar la tabla
const ordenarAlumnosAlfabeticamente = () => {
    listAlumnos.sort((a, b) => {
        // localeCompare maneja correctamente acentos, mayúsculas y la Ñ
        return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
    });

    // Una vez ordenado el array en memoria, refrescamos la vista
    cargarTabla();
};

//Boton alternar formulario
const btnAlternar = document.getElementById("btnAlternarForm")
const formAlumno = document.getElementById("formAlumno")

if (btnAlternar && formAlumno) {
    btnAlternar.addEventListener("click", () => {
        
        formAlumno.classList.toggle("d-none");

        // Alternar texto del propio boton
        if (formAlumno.classList.contains("d-none")) {
            btnAlternar.textContent = "Agregar Alumno";
        } else {
            btnAlternar.textContent = "No Agregar Alumno";
        }
    });
}



document.addEventListener('DOMContentLoaded',()=>{
    const formulario = document.querySelector(".needs-validation");
    
    const btnOrdenar = document.getElementById("btnOrdenar");
    
    //Ni bien cargue la pagina, se cambian los registros de prueba por los de la lista
    cargarTabla()

    // Evento para el boton de ordenar
    if (btnOrdenar) {
        btnOrdenar.addEventListener('click', () => {
            ordenarAlumnosAlfabeticamente();
        });
    }
    
    //Valida en tiempo real si se cambió de opcion en el tipo de documento
    inputTypeDoc.addEventListener('change', (event) => {
        //console.log("hola",event.target.value);
        if(numDoc.disabled == false ) validarNumDoc();
        numDoc.disabled = false; 
        
    });

    //valida en tiempo real cuantos caracteres
    numDoc.addEventListener('change', (event) => {
        //console.log("Hola dos",event.target.value);
        validarNumDoc()
    });
        
    
            

    if(formulario){
        formulario.addEventListener('submit',(event)=>{//Al darle al boton de submit ejecuta lo siguiente
            event.preventDefault();
            event.stopPropagation();

            //valida el nombre luego del submit
            validarNombre()

            //valida el tipo de doc luego del submit
            validarTipoDoc()

            //Valida el dni
            validarNumDoc()

            //validar notas
            validarNota()

            //Validar email
            validarEmail()

            // Buscamos si quedo algun input con la clase 'is-invalid'
            const camposInvalidos = formulario.querySelectorAll('.is-invalid');

            // Si hay errores, frenamos la ejecución y no agregamos nada
            if (camposInvalidos.length > 0) {
                alert("El formulario contiene errores. No se puede guardar.");
                return; 
            }
           
            //Al darle al submit, si todo esta ok agrega este alumno
            const nuevoAlumno = {
                nombre: document.getElementById('nombreCompleto').value.trim(),
                tipoDoc: inputTypeDoc.value,
                numDoc: numDoc.value.trim(),
                nota1parcial: document.getElementById("nota1parcial").value.trim(),
                nota2parcial: document.getElementById("nota2parcial").value.trim(),
                nota1rec: document.getElementById("nota1rec").value.trim(),
                nota2rec: document.getElementById("nota2rec").value.trim()
            };

            agregarNuevo(nuevoAlumno)

            //Reiniciamos el formulario y estilos de validacion
            formulario.reset()
            formulario.querySelectorAll('.is-valid').forEach(input=> input.classList.remove('is-valid'))
            numDoc.disabled = true; // Volvemos a deshabilitar el documento hasta que elijan tipo de doc
        
            formulario.classList.add("d-none");
            btnAlternar.textContent = "Reportar incidente";
        })
    }
})