import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";


const firebaseConfig = {
  apiKey: "AIzaSyD8p2tsqdtij3cQhWMUxgHZ2V80eEeLPA4",
  authDomain: "tostones-6370d.firebaseapp.com",
  projectId: "tostones-6370d",
  storageBucket: "tostones-6370d.appspot.com",
  messagingSenderId: "950636781905",
  appId: "1:950636781905:web:e2285bdf50c0297968b370",
  measurementId: "G-4DJGYN9K59"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

const productRef = collection(db, 'productos');


const productosArray = [];

getDocs(productRef)
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const producto = {
        nombre: doc.data().nombre,
        descripcion: doc.data().descripcion,
        precio: doc.data().precio,
        imagen: doc.data().img,
        id: doc.id
      };
      productosArray.push(producto);
    });
    return pintarImg(productosArray);
  })
  .then(() => {

    const grid = document.querySelector('.masonry');
    setTimeout(() => {
      grid.style.opacity = "1";
      const masonry = new Masonry(grid, {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-item',
        percentPosition: true
      });
    }, 100);

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    });

    const images = document.querySelectorAll('.masonry-item');
    images.forEach(image => observer.observe(image));
  })
  .catch(error => {
    console.error("Error al obtener los documentos:", error);
  });



const pintarImg = product => {
  return new Promise((resolve, reject) => {
    const productosAleatorios = [...product];

    for (let i = productosAleatorios.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productosAleatorios[i], productosAleatorios[j]] = [productosAleatorios[j], productosAleatorios[i]];
    }

    productosAleatorios.forEach(element => {
      const imgProduct = document.querySelector("#img-producto").content.cloneNode(true);
      imgProduct.querySelector(".title h3").textContent = element.nombre;
      imgProduct.querySelector(".item img").src = element.imagen[0];
      imgProduct.querySelector(".item").dataset.id = element.id;
      document.querySelector(".masonry").appendChild(imgProduct);
    });

    sliderItem();
    resolve();
  });
}




const sliderItem = () => {
  const fondo = document.querySelector(".fondo");
  const preview = document.querySelector(".preview-imgs");
  let flkty;

  document.querySelectorAll(".item").forEach(element => {

    element.addEventListener("click", ({ currentTarget: { dataset: { id } } }) => {
      const producto = productosArray.find(item => item.id === id);
      fondo.style.display = "flex";
      preview.innerHTML = producto.imagen.map(src => `
        <div class="cell">
          <img src="${src}" alt="${producto.nombre}">
        </div>
      `).join("");

      flkty = new Flickity(preview, {
        selectedAttraction: 0.08,
        friction: 0.4,
        cellAlign: 'center',
        contain: true
      });

      const loadImg = Array.from(preview.querySelectorAll(".cell img"));
      Promise.all(loadImg.map(img => img.decode())).then(() => {
        fondo.style.opacity = "1";
        flkty.reloadCells();
        flkty.select(0);
      });

      fondo.querySelector(".equis1").addEventListener("click", () => {
        fondo.style.opacity = "0";
        setTimeout(() => {
          fondo.style.display = "";
          preview.innerHTML = "";
          flkty.destroy();
        }, 300);
      });

      fondo.querySelector(".descripcion-btn").addEventListener("click", () => viewDes(producto));
    });
  });
};




function calcularUnd(eNumber) {
  return function (e) {
    const boton = e.target;
    const contenedor = e.target.closest('.numeros') || eNumber.closest('.numeros');

    if (!boton || !contenedor) return;
    const numeroElemento = contenedor.querySelectorAll('span')[1];
    let numero = Number(numeroElemento.textContent) || 0;

    if (boton.textContent === '+') {
      numero++;
      if (document.querySelector(".car-shop")) {
        document.querySelector(".car-shop").classList.remove("btn-invisible");
      }
    } else if (boton.textContent === '-') {
      if (numero > 0) {
        numero--;
      }
    }

    numeroElemento.textContent = numero;

    if (numero === 0 && document.querySelector(".car-shop")) {
      document.querySelector(".car-shop").classList.add("btn-invisible");
    }

    return numero;
  };
}




let currentFondoViewCard = null;
const viewDes = (product) => {
  if (currentFondoViewCard) currentFondoViewCard.remove();

  const cardView = document.querySelector("#card-descripcion").content.cloneNode(true);
  const fondoViewCard = cardView.querySelector(".descripcion-fondo");
  const numeros1 = cardView.querySelector('.numeros');
  const btnCar = cardView.querySelector('.car-shop');

  cardView.querySelector(".d-img img").src = product.imagen[0];
  cardView.querySelector(".d-body h2").textContent = product.nombre;
  cardView.querySelector(".d-body h3 span").textContent = (product.precio).toLocaleString();
  cardView.querySelector(".d-body p").textContent = product.descripcion;

  document.body.appendChild(cardView);

  fondoViewCard.style.display = "flex";
  fondoViewCard.style.opacity = "1";
  fondoViewCard.querySelector(".equis2").addEventListener("click", () => {
    fondoViewCard.style.opacity = "0";
    setTimeout(() => {
      fondoViewCard.remove();
    }, 300);
  });

  numeros1.addEventListener('click', calcularUnd(numeros1));

  btnCar.addEventListener('click', () => {
    if (numeros1.querySelectorAll('span')[1].textContent > 0) {
      viewCarShop(product.nombre, product.imagen[0], product.precio, numeros1);
    }
  });

  currentFondoViewCard = fondoViewCard;
};




let productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];

function viewCarShop(nombre, img, precio, undNumber) {
  const und = undNumber.querySelectorAll('span')[1].textContent;
  const productoExistente = productosGuardados.find(item => item.name === nombre);
  if (productoExistente) {
    productoExistente.und += Number(und);
  } else {
    const nuevoProducto = {
      name: nombre,
      img: img,
      precio: Number(precio),
      und: Number(und)
    };
    productosGuardados.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productosGuardados));
  }
}



function pintarCarrito(productosGuardados) {
  const carmenu = document.querySelector("#card-shop-menu").content.cloneNode(true);

  productosGuardados.forEach((item, index) => {

    const productMenu = document.querySelector("#product-shoping-menu").content.cloneNode(true);
    productMenu.querySelector("img").src = item.img;
    productMenu.querySelector("h3").textContent = item.name;
    productMenu.querySelector("h3 span").textContent = (item.precio * item.und).toLocaleString();
    productMenu.querySelector("h5 span").textContent = item.precio.toLocaleString();
    productMenu.querySelectorAll('.numeros span')[1].textContent = item.und;


    productMenu.querySelector('.numeros').addEventListener('click', (e) => {

      const resultado = calcularUnd(productMenu.querySelector('.numeros'))(e);
      e.target.closest('.shopping-product-info').querySelector("h3 span").textContent = (item.precio * resultado).toLocaleString();
      item.und = resultado;
      productosGuardados[index] = item;

      if (resultado === 0) {
        productosGuardados.splice(index, 1);
        document.querySelectorAll(".shopping-product")[index].remove();
      }

      item.total = (item.precio * item.und).toLocaleString();
      localStorage.setItem('productos', JSON.stringify(productosGuardados));
      total(productosGuardados);
    });


    productMenu.querySelector('.trash').addEventListener('click', (e) => {
      productosGuardados.splice(index, 1);
      localStorage.setItem('productos', JSON.stringify(productosGuardados));
      document.querySelectorAll(".shopping-product")[index].remove();
      total(productosGuardados);
    });

    item.total = (item.precio * item.und).toLocaleString();
    localStorage.setItem('productos', JSON.stringify(productosGuardados));

    carmenu.querySelector(".car-shoping-body").appendChild(productMenu);
  });

  document.body.appendChild(carmenu);
}




const car = document.querySelector(".car");
car.addEventListener("click", async () => {
  pintarCarrito(productosGuardados);

  await new Promise(resolve => setTimeout(resolve));

  const fondo2 = document.querySelector(".fondo-mentiras");
  const equis3 = document.querySelector('.equis3');
  fondo2.style.opacity = "1";

  equis3.addEventListener("click", () => {
    fondo2.style.opacity = "";
    setTimeout(() => {
      fondo2.remove();
    }, 500);
  });

  const handleWppClick = (e) => {
    if (e.target.closest(".car-shoping-footer .wpp")) {
      mostrarPedido();
    }
  };

  const wppElement = document.querySelector(".car-shoping-footer .wpp");

  wppElement.addEventListener("click", handleWppClick);
  wppElement.addEventListener("touchstart", handleWppClick);
  total(productosGuardados);
});




function total(products) {
  const totalPrecio = products.reduce((acumulador, item) => acumulador + (item.precio * item.und), 0);
  document.querySelector(".car-shoping-footer h3 span").textContent = totalPrecio.toLocaleString();
}




function mostrarPedido() {
  const clone = document.getElementById("wpp-pedido").content.cloneNode(true);
  
  const preciosBarrios = {
    barrio1: "5.000",
    barrio2: "7.000",
    barrio3: "10.000"
  };

  const selectBarrio = clone.getElementById("barrio");
  const inputPrecio = clone.getElementById("precio");
  const direccion = clone.querySelector(".direccion");

  Object.entries(preciosBarrios).forEach(([barrio, precio]) => {
    const option = document.createElement("option");
    option.value = barrio;
    option.textContent = barrio;
    selectBarrio.appendChild(option);
  });

  selectBarrio.addEventListener("change", function () {
    const precioDomicilio = preciosBarrios[selectBarrio.value] || 0;
    inputPrecio.value = precioDomicilio;
  });

  const opcionEntrega = clone.querySelector(".wpp-pedido .op-entrega");
  const retirar = opcionEntrega.querySelector(".retirar");
  const enviar = opcionEntrega.querySelector(".enviar");

  function handleOpcionEntrega(e) {
    e.preventDefault();
    const isEnviar = e.target.closest(".enviar");
    enviar.classList.toggle("naranja", isEnviar);
    retirar.classList.toggle("naranja", !isEnviar);
    direccion.style.display = isEnviar ? "flex" : "";
  }

  opcionEntrega.addEventListener("click", handleOpcionEntrega);

  const btnEnviarP = clone.querySelector(".wpp-pedido .btn-enviar-p");

  function handleBtnEnviarClick(e) {
    e.preventDefault();
    if (e.target.closest(".btn-enviar-p")) {
      recolectarYenviar();
    }
  }

  btnEnviarP.addEventListener("click", handleBtnEnviarClick);
  document.body.appendChild(clone);
}




function recolectarYenviar() {
  const selectBarrio2 = document.getElementById("barrio");
  const enviar2 = document.querySelector(".enviar");
  const inputPrecio2 = document.getElementById("precio");
  
  const nombreInput = document.querySelector(".nombre").value;
  const telefonoInput = document.querySelector(".telefono").value;
  const nomenclatura = document.getElementById("direccion").value;
  let totalApagar = document.querySelector(".car-shoping-footer h3 span").textContent;

  const lineasProductos = productosGuardados.map(item => `${item.und} x ${item.name} ....... $ ${item.total}`).join("\n\n");

  let enviarA = "";
  if (enviar2.classList.contains("naranja")) {
    totalApagar = ((Number(totalApagar) + Number(inputPrecio2.value)) * 1000).toLocaleString();

    enviarA = `
    
ENVIAR A:
Barrio: ${selectBarrio2.value}
Valor: ${inputPrecio2.value}
Dirección: ${nomenclatura}
`;
  }

  const mensaje = `Hola, quisiera hacer un pedido.${enviarA}
  
Nombre: ${nombreInput}
Teléfono: ${telefonoInput}
  
--------------------------------------------
  
${lineasProductos}
  
--------------------------------------------
  
Total: .................. $ ${totalApagar}
  
--------------------------------------------`;

alert(mensaje)
  // const numeroTelefono = '+573005267747';
  // const whatsappUrl = 'https://api.whatsapp.com/send?phone=' + numeroTelefono + '&text=' + encodeURIComponent(mensaje);
  // window.open(whatsappUrl, '_blank');
}







    


// function mostrarPedido() {
//   const clone = document.getElementById("wpp-pedido").content.cloneNode(true);
  

//   const preciosBarrios = {
//     barrio1: "5.000",
//     barrio2: "7.000",
//     barrio3: "10.000"
//   };

//   const selectBarrio = clone.getElementById("barrio");
//   const inputPrecio = clone.getElementById("precio");
//   const direccion = clone.querySelector(".direccion");

//   for (const barrio in preciosBarrios) {
//     const option = document.createElement("option");
//     option.value = barrio;
//     option.textContent = barrio;
//     selectBarrio.appendChild(option);
//   }

//   selectBarrio.addEventListener("change", function () {
//     const barrioSeleccionado = selectBarrio.value;
//     const precioDomicilio = preciosBarrios[barrioSeleccionado] || 0;
//     inputPrecio.value = precioDomicilio;
//   });

 
//   function handleOpcionEntrega(e) {
//     e.preventDefault();
//     if (e.target.closest(".enviar")) {
//       enviar.classList.add("naranja");
//       retirar.classList.remove("naranja");
//       direccion.style.display = "flex";
//     } else if (e.target.closest(".retirar")) {
//       retirar.classList.add("naranja");
//       enviar.classList.remove("naranja");
//       direccion.style.display = "";
//     }
//   }

//   const opcionEntrega = clone.querySelector(".wpp-pedido .op-entrega");
//   const retirar = opcionEntrega.querySelector(".retirar");
//   const enviar = opcionEntrega.querySelector(".enviar");
//   opcionEntrega.addEventListener("click", handleOpcionEntrega);
//   opcionEntrega.addEventListener("touchstart", handleOpcionEntrega, { passive: true });

//   function handleBtnEnviarClick(e) {
//     if (e.target.closest(".btn-enviar-p")) {
//       recolectarYenviar();
//     }
//   }

//   const btnEnviarP = clone.querySelector(".wpp-pedido .btn-enviar-p");
//   btnEnviarP.addEventListener("click", handleBtnEnviarClick);
//   btnEnviarP.addEventListener("touchstart", handleBtnEnviarClick, { passive: true });
//   document.body.appendChild(clone);
// }




// function recolectarYenviar() {

//   const selectBarrio2 = document.getElementById("barrio");
//   const enviar2 = document.querySelector(".enviar");
//   const inputPrecio2 = document.getElementById("precio");

//   const nombreInput = document.querySelector(".nombre").value;
//   const telefonoInput = document.querySelector(".telefono").value;
//   const nomenclatura = document.getElementById("direccion").value;
//   let totalApagar = document.querySelector(".car-shoping-footer h3 span").textContent;

//   const lineasProductos = productosGuardados.map(item => `${item.und} x ${item.name} ....... $ ${item.total}`).join("\n\n");

//   let enviarA = "";
//   if (enviar2.classList.contains("naranja")) {
//     totalApagar = ((Number(totalApagar) + Number(inputPrecio2.value)) * 1000).toLocaleString();

//     enviarA = `

// ENVIAR A:
// Barrio: ${selectBarrio2.value}
// Valor: ${inputPrecio2.value}
// Dirección: ${nomenclatura}
// `;
//   }

//   const mensaje = `Hola, quisiera hacer un pedido.${enviarA}
  
// Nombre: ${nombreInput}
// Teléfono: ${telefonoInput}
  
// --------------------------------
  
// ${lineasProductos}
  
// --------------------------------
  
// Total: .................. $ ${totalApagar}
  
// --------------------------------`;

//   console.log(mensaje)

//   const numeroTelefono = '+573005267747';
//   const whatsappUrl = 'https://api.whatsapp.com/send?phone=' + numeroTelefono + '&text=' + encodeURIComponent(mensaje);
//   window.open(whatsappUrl, '_blank');
// }