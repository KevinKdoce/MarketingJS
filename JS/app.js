var dataRbd = [];
var dataSend = [];

document.getElementById("modal").addEventListener("click", () => {
  getRbd();
  SameRut();
  sendData();
  onlyNumbers();
  responseRbd();
});

const sendData = () => {
  document.getElementById("formData").addEventListener("submit", (event) => {
    event.preventDefault();
    checkRut(rut);
    var name = $("#name").val();
    var email = $("#email").val();
    var phone = $("#phone").val();

    if (name.length == 0 || email.length == 0 || phone.length == 0) {
      $(".alertShow").fadeIn();
      return false;
    }

    var data = $("#formData").serialize();
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
          // this.submit();
          // data.load();
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

const SameRut = () => {
  $.ajax({
    url: "./sameRut.php",
    type: "GET",
    success: (response) => {
      let json = JSON.parse(response);
      dataSend.push(json);
    },
  });
};

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
      document.getElementById("nameCollege").value = resultFilter[0][0].colegio;
      document.getElementById("nameDependency").value =
        resultFilter[0][0].dependencia;
      document.getElementById("nameRegion").value = resultFilter[0][0].region;
      document.getElementById("nameComuna").value = resultFilter[0][0].comuna;
      $("#alertDanger").fadeOut();
      $("#nameCollege").fadeIn();
      $("#nameDependency").fadeIn();
      $("#nameRegion").fadeIn();
      $("#nameComuna").fadeIn();
      $("#show").slideDown();
      $("#sendData").prop("disabled", false);
    } else {
      $("#alertDanger").fadeIn();
      $("#nameCollege").fadeOut("");
      $("#nameDependency").fadeOut("");
      $("#nameRegion").fadeOut("");
      $("#nameComuna").fadeOut("");
      $("#show").slideUp();
      $("#sendData").prop("disabled", true);
    }
    //   resultFilter[0].length >= 1
    //     ? (document.getElementById("nameCollege").innerHTML =
    //         resultFilter[0][0].colegio, resultFilter[0][0].dependencia)
    //     : (document.getElementById("nameCollege").innerHTML = "NO EXISTE");
    // console.log(resultFilter);
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
  rut.setCustomValidity("");
  // Si todo sale bien, eliminar errores (decretar que es válido)
  const resultRut = dataSend.map((rutSearch) =>
    rutSearch.filter((element) => {
      if (element.Rut == rut) {
        return element;
      }
    })
  );
  if (resultRut[0].length >= 1) {
    $("#rutExist").html(
      "<div class='alert alert-danger d-flex align-items-center'><svg class='bi flex-shrink-0 me-2' width='24' height='24' role='img' aria-label='Danger:'><use xlink:href='#exclamation-triangle-fill'/></svg><div>Ya ha enviado una solicitud!</div></div>"
    );
    return false;
  }
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
