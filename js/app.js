const Abrir_login = document.getElementById("abrir_login");
const Abrir_registro = document.getElementById("abrir_registro");

const Modal_login = document.getElementById("modal_login");
const Modal_registro = document.getElementById("modal_registro");
const Modal_user = document.getElementById("modal_user");

const Cerrar_login = document.getElementById("cerrar_login");
const Cerrar_registro = document.getElementById("cerrar_registro");
const Cerrar_user = document.getElementById("cerrar_user");
const Cerrar_sesion = document.getElementById("cerrar_sesion");

const btn_user = document.getElementById("btn_user");

const Form_login = document.getElementById("formulario_login");
const Form_registro = document.getElementById("formulario_registro");

const Tabla = document.getElementById("table");

let condicion = true;

const MostrarModal_login = () => {
  Modal_login.classList.toggle("is-active");
};

Abrir_login.addEventListener("click", MostrarModal_login);
Cerrar_login.addEventListener("click", MostrarModal_login);

const MostrarModal_registro = () => {
  Modal_registro.classList.toggle("is-active");
};

Abrir_registro.addEventListener("click", MostrarModal_registro);
Cerrar_registro.addEventListener("click", MostrarModal_registro);

const MostrarModal_user = () => {
  Modal_user.classList.toggle("is-active");
};
btn_user.addEventListener("click", MostrarModal_user);
Cerrar_user.addEventListener("click", MostrarModal_user);

Cerrar_sesion.addEventListener("click", () => {
  MostrarModal_user();
  Abrir_login.classList.toggle("hidden");
  btn_user.classList.toggle("hidden");
});

Form_login.addEventListener("submit", async (e) => {
  e.preventDefault();

  let username = Form_login.username_login.value;
  let contraseña = Form_login.contraseña_login.value;

  const userData = await checkUser(username, contraseña);

  if (userData) {
    swal("Ingreso Exitoso!", "Puedes Continuar!", "success");
    let { data: users } = await _supabase.from('users').select('*').eq("username", username).eq("contraseña", contraseña);
    Form_login.Id_login.value = users[0]["id"];
    let id = Form_login.Id_login.value;
    Modal_login.classList.toggle("is-active");
    Abrir_login.classList.toggle("hidden");
    btn_user.classList.toggle("hidden");
    MostarD(id)
  } else {
    swal("Ingreso Fallido!", "Ingresa un Usuario o Contraseña Validos!", "error");
  }

  Form_login.reset();
});

Form_registro.addEventListener("submit", async (e) => {
  e.preventDefault();

  let nombre = Form_registro.nombre.value;
  let apellido = Form_registro.apellido.value;
  let edad = Form_registro.edad.value;
  let ciudad = Form_registro.ciudad.value;
  let username = Form_registro.username.value;
  let contraseña = Form_registro.contraseña.value;

  let datos = {
    nombre: nombre,
    apellido: apellido,
    edad: edad,
    ciudad: ciudad,
    username: username,
    contraseña: contraseña,
  };
  
  if (condicion) {
    insertarDatos(datos);
  } else {
    let id = parseInt(Form_registro.inputId.value);
    actualizarD(id, datos);
  }
  Form_registro.reset();
  Modal_registro.classList.toggle("is-active");
});

async function checkUser(username, contraseña) {
  const { data, error } = await _supabase.from("users").select("*").eq("username", username).eq("contraseña", contraseña);

  if (error) {
    console.error(error);
    return null;
  }

  if (data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

async function MostarD(id) {
  let { data: users, error } = await _supabase.from("users").select("*").eq("id", id)

  if (error) {
    console.log(error);
    return;
  } else {
    Tabla.innerHTML = "";
    users.map((users) => {
      Tabla.innerHTML = `
         <tr>
           <td>${users.nombre}</td>
           <td>${users.apellido}</td>
           <td>${users.edad}</td>
           <td>${users.ciudad}</td>
           <td>${users.username}</td>
           <td>${users.contraseña}</td>
           <td>
             <button class="button is-warning" onClick="modificarD('${users.id}')"><i class="fas fa-pencil-alt"></i></button>
             <button class="button is-danger is-outlined" onClick="eliminarD('${users.id}')">Eliminar Cuenta</button>
           </td>
         </tr>
          `;

    });
  }
}

async function insertarDatos(dato) {
  const { data, error} = await _supabase.from("users").insert([dato]);
  if (error) {
    swal("Registro Fallido!", "Verifique los Campos o Este Nombre de Usuario ya existe!", "error");
    MostrarModal_registro();
    return;
  } else {
    swal("Registro exitoso!", "Puedes continuar!", "success");
  }
}

function eliminarD(id) {
  swal("¿Está seguro?", "¿Desea eliminar la cuenta?","warning",{
    buttons: {
      catch:{
        text:"Cancelar",
        value:false,
      },
      defeat:{
        text:"Si, Eliminar",
        value:true,
      },
    },
  }).then(async (value) => {
    if (value) {
      const { data, error } = await _supabase.from("users").delete().eq("id", id);
      if (error) {
        console.log(error);
        return;
      }
      swal("Cuenta eliminada","Ha sido eliminada correctamente.","success");
      MostrarModal_user();
      Abrir_login.classList.toggle("hidden");
      btn_user.classList.toggle("hidden");
    }
    return
  });
}

async function modificarD(id){
  MostrarModal_registro();
  MostrarModal_user();
  let { data: users, error } = await _supabase.from('users').select('*').eq('id', id)
  if (error) {
      console.log(error)
      return
  } else {
    Form_registro.inputId.value = users[0]["id"];
    Form_registro.nombre.value = users[0]["nombre"];
    Form_registro.apellido.value = users[0]["apellido"];
    Form_registro.edad.value = users[0]["edad"];
    Form_registro.ciudad.value = users[0]["ciudad"];
    Form_registro.username.value = users[0]["username"];
    Form_registro.contraseña.value = users[0]["contraseña"];

  condicion = false ;
}
}

async function actualizarD(id,dato){

  const { data, error } = await _supabase.from('users').update(dato).eq('id',id);

  if(error){
    console.log(error);
    return
  }
  condicion=true;
  MostrarModal_user();
  MostarD(id);

}
