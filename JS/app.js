var dataRbd = [];
var dataSend = [];

document.getElementById("modal").addEventListener("click", () => {
  getRbd();
  sendData();
  onlyNumbers();
  // getColleges();
  responseRbd();
});

const sendData = () => {
  document.getElementById("formData").addEventListener("submit", (event) => {
    event.preventDefault();
    checkRut(rut);
    var data = $("#formData").serialize();
    var modalContent = $("#exampleModal");

    var name = document.getElementById("name").value;
    if (name.length == 0) {
      alert("El campo nombre es requerido");
      return;
    }
    var email = document.getElementById("email").value;
    if (email.length == 0) {
      alert("El campo correo es requerido");
      return;
    }
    var phone = document.getElementById("phone").value;
    if (phone.length == 0) {
      alert("El campo teléfono es requerido");
      return;
    }
    var charge = document.getElementById("charge").value;
    if (charge.length == 0) {
      alert("El campo cargo es requerido");
      return;
    }

    $.ajax({
      url: "./sendData.php",
      type: "POST",
      data: data,
      success: (data) => {
        if (data == 1) {
          Lobibox.alert("success", {
            title: "Confirmación",
            iconClass: "glyphicon glyphicon-ok-sign",
            msg: "Su solicitud ha sido enviada!",
          });
          this.submit();
          // modalContent.fadeOut();
        } else {
          alert("ERROR DEL SERVER");
        }
      },
    });
  });
};

const getRbd = () => {
  $.ajax({
    url: "./getColleges.php",
    type: "GET",
    success: (response) => {
      let json = JSON.parse(response);
      dataRbd.push(json);
    },
  });
};

// const getColleges = () => {
//   $.ajax({
//     url: "./mainQuery.php",
//     method: "GET",
//     success: (response) => {
//       let template = ``;
//       let json = JSON.parse(response);
//       for (const rbd in json) {
//         template += `<option value='${json[rbd].rbd}'>${json[rbd].colegio}</option>`;
//       }
//       return data.html(template);
//     },
//   });
//   data.select2();
// };

const responseRbd = () => {
  document.getElementById("rbd").addEventListener("change", ({ target }) => {
    const resultFilter = dataRbd.map((rbd) =>
      rbd.filter((element) => {
        if (element.rbd == target.value) {
          return element;
        }
      })
    );

    if (resultFilter[0].length >= 1) {
      document.getElementById("id").innerHTML = resultFilter[0][0].id;
      document.getElementById("nameCollege").innerHTML =
        resultFilter[0][0].colegio;
      document.getElementById("nameDependency").innerHTML =
        resultFilter[0][0].dependencia;
      document.getElementById("nameRegion").innerHTML =
        resultFilter[0][0].region;
      document.getElementById("nameComuna").innerHTML =
        resultFilter[0][0].comuna;
      $("#show").slideDown();
    } else {
      document.getElementById("nameCollege").innerHTML = "NO EXISTE COLEGIO!";
      document.getElementById("nameDependency").innerHTML = "";
      document.getElementById("nameRegion").innerHTML = "";
      document.getElementById("nameComuna").innerHTML = "";
      $("#show").slideUp();
    }
    //   resultFilter[0].length >= 1
    //     ? (document.getElementById("nameCollege").innerHTML =
    //         resultFilter[0][0].colegio, resultFilter[0][0].dependencia)
    //     : (document.getElementById("nameCollege").innerHTML = "NO EXISTE");
    console.log(resultFilter);
  });
};

const checkRut = (rut) => {
  // Despejar Puntos
  var valor = rut.value.replace(".", "");
  // Despejar Guión
  valor = valor.replace("-", "");

  // Aislar Cuerpo y Dígito Verificador
  cuerpo = valor.slice(0, -1);
  dv = valor.slice(-1).toUpperCase();

  // Formatear RUN
  rut.value = cuerpo + "-" + dv;

  // Si no cumple con el mínimo ej. (n.nnn.nnn)
  if (cuerpo.length < 7) {
    rut.setCustomValidity("RUT Incompleto");
    return false;
  }

  // Calcular Dígito Verificador
  suma = 0;
  multiplo = 2;

  // Para cada dígito del Cuerpo
  for (i = 1; i <= cuerpo.length; i++) {
    // Obtener su Producto con el Múltiplo Correspondiente
    index = multiplo * valor.charAt(cuerpo.length - i);

    // Sumar al Contador General
    suma = suma + index;

    // Consolidar Múltiplo dentro del rango [2,7]
    if (multiplo < 7) {
      multiplo = multiplo + 1;
    } else {
      multiplo = 2;
    }
  }

  // Calcular Dígito Verificador en base al Módulo 11
  dvEsperado = 11 - (suma % 11);

  // Casos Especiales (0 y K)
  dv = dv == "K" ? 10 : dv;
  v = dv == 0 ? 11 : dv;

  // Validar que el Cuerpo coincide con su Dígito Verificador
  if (dvEsperado != dv) {
    rut.setCustomValidity("RUT Inválido");
    return false;
  }
  // Si todo sale bien, eliminar errores (decretar que es válido)
  rut.setCustomValidity("");
};

const onlyNumbers = () => {
  let key = document
    .getElementById("rbd")
    .addEventListener("keydown", (event) => {
      if (
        (event.keyCode < 48 || event.keyCode > 57) &&
        (event.keyCode < 96 || event.keyCode > 105) &&
        event.keyCode !== 190 &&
        event.keyCode !== 110 &&
        event.keyCode !== 8 &&
        event.keyCode !== 9
      ) {
        return false;
      }
      let key = event.target.value;
    });
};
