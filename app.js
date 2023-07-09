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




function cerrarFondo() {
  const fondo = document.querySelector(".fondo");
  const preview = document.querySelector(".preview-imgs");
  const flkty = new Flickity(preview);

  fondo.style.opacity = "0";
  setTimeout(() => {
    fondo.style.display = "";
    preview.innerHTML = "";
    flkty.destroy();
  }, 300);
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

      fondo.querySelector(".equis1").addEventListener("click", cerrarFondo);
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


const cerrarFondoViewCard = (fondoViewCard) => {
  fondoViewCard.style.opacity = "0";
  setTimeout(() => {
    fondoViewCard.remove();
  }, 300);
};


let currentFondoViewCard = null;

const viewDes = (product) => {
  if (currentFondoViewCard) {
    cerrarFondoViewCard(currentFondoViewCard);
  }

  const cardView = document.querySelector("#card-descripcion").content.cloneNode(true);
  const fondoViewCard = cardView.querySelector(".descripcion-fondo");
  const numeros1 = cardView.querySelector('.numeros');
  const btnCar = cardView.querySelector('.car-shop');

  const imgElement = cardView.querySelector(".d-img img");
  const h2Element = cardView.querySelector(".d-body h2");
  const h3Element = cardView.querySelector(".d-body h3 span");
  const pElement = cardView.querySelector(".d-body p");

  imgElement.src = product.imagen[0];
  h2Element.textContent = product.nombre;
  h3Element.textContent = (product.precio).toLocaleString();
  pElement.textContent = product.descripcion;

  document.body.appendChild(cardView);

  fondoViewCard.style.display = "flex";
  fondoViewCard.style.opacity = "1";
  fondoViewCard.querySelector(".equis2").addEventListener("click", () => {
    cerrarFondoViewCard(fondoViewCard);
  });

  numeros1.addEventListener('click', calcularUnd(numeros1));

  btnCar.addEventListener('click', () => {
    if (numeros1.querySelectorAll('span')[1].textContent > 0) {
      cerrarFondo();
      cerrarFondoViewCard(currentFondoViewCard);
      viewCarShop(product.nombre, product.imagen[0], product.precio, numeros1, productosGuardados);
    }
  });

  currentFondoViewCard = fondoViewCard;
};






let productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
productosGuardados = productosGuardados.filter(item => item !== null);
localStorage.setItem('productos', JSON.stringify(productosGuardados));




function viewCarShop(nombre, img, precio, undNumber, productosGuardados) {
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
  console.log(productosGuardados)
}





function pintarCarrito(productosGuardados) {
  const carmenu = document.querySelector("#card-shop-menu").content.cloneNode(true);
  const carShoppingBody = carmenu.querySelector(".car-shoping-body");

  productosGuardados.forEach((item, index) => {
    const productMenu = document.querySelector("#product-shoping-menu").content.cloneNode(true);
    const trashButton = productMenu.querySelector('.trash');
    const numerosContainer = productMenu.querySelector('.numeros');
    const totalPriceSpan = productMenu.querySelector("h3 span");

    productMenu.querySelector("h3").textContent = item.name;
    productMenu.querySelector("img").src = item.img;
    productMenu.querySelector("h3 span").textContent = (item.precio * item.und).toLocaleString();
    productMenu.querySelector("h5 span").textContent = item.precio.toLocaleString();
    productMenu.querySelectorAll('.numeros span')[1].textContent = item.und;


    const handleNumClick = (e) => {
      const resultado = calcularUnd(numerosContainer)(e);
      totalPriceSpan.textContent = (item.precio * resultado).toLocaleString();
      item.und = resultado;
      productosGuardados[index] = item;

      if (resultado === 0) {
        handleTrashClick();
      }

      item.total = (item.precio * item.und).toLocaleString();
      localStorage.setItem('productos', JSON.stringify(productosGuardados));
      total(productosGuardados);
    };


    const handleTrashClick = () => {
      const productItem = trashButton.closest('.shopping-product');
      productItem.parentNode.removeChild(productItem);
      productosGuardados.splice(index, 1);
      localStorage.setItem('productos', JSON.stringify(productosGuardados));
      total(productosGuardados);
      index--;
    };


    numerosContainer.addEventListener('click', handleNumClick);
    trashButton.addEventListener('click', handleTrashClick);

    item.total = (item.precio * item.und).toLocaleString();
    localStorage.setItem('productos', JSON.stringify(productosGuardados));

    carShoppingBody.appendChild(productMenu);
  });

  document.body.appendChild(carmenu);
}




function cerrarFondo2() {
  const fondo2 = document.querySelector(".fondo-mentiras");
  fondo2.style.opacity = "";
  setTimeout(() => {
    fondo2.remove();
  }, 500);
}




document.querySelector(".car").addEventListener("click", async (e) => {
  if (e.target.closest(".car")) {
    pintarCarrito(productosGuardados);

    await new Promise(resolve => setTimeout(resolve));

    const fondo2 = document.querySelector(".fondo-mentiras");
    const equis3 = document.querySelector('.equis3');
    fondo2.style.opacity = "1";

    equis3.addEventListener("click", cerrarFondo2);

    const handleWppClick = (e) => {
      if (e.target.closest(".car-shoping-footer .wpp")) {
        mostrarPedido(productosGuardados);
      }
    };

    const wppElement = document.querySelector(".car-shoping-footer .wpp");

    wppElement.addEventListener("click", handleWppClick);
    wppElement.addEventListener("touchstart", handleWppClick);
    total(productosGuardados);
  }
});




function total(products) {
  const totalPrecio = products.reduce((acumulador, item) => acumulador + (item.precio * item.und), 0);
  document.querySelector(".car-shoping-footer h3 span").textContent = totalPrecio.toLocaleString();
  return totalPrecio;
}




function mostrarPedido(productosGuardados) {
  const clone = document.getElementById("wpp-pedido").content.cloneNode(true);
  const selectBarrio = clone.querySelector("#barrio");
  const inputPrecio = clone.querySelector("#precio");
  const direccionid = clone.querySelector("#direccion");
  const opcionEntrega = clone.querySelector(".wpp-pedido .op-entrega");
  const nombreInput = clone.querySelector("#nombre");
  const telefonoInput = clone.querySelector("#telefono");
  const nomenclatura = clone.querySelector("#direccion");

  const preciosBarrios = {
    barrio1: "5.000",
    barrio2: "7.000",
    barrio3: "10.000"
  };

  let nombreValue = "";
  let telefonoValue = "";
  let nomenclaturaValue = "";
  let barrioValue = "";
  let inputPrecioValue = 0;

  Object.entries(preciosBarrios).forEach(([barrio, precio]) => {
    const option = new Option(barrio, barrio);
    selectBarrio.appendChild(option);
  });

  selectBarrio.addEventListener("change", () => {
    inputPrecio.value = preciosBarrios[selectBarrio.value] || 0;
  });



  const equis4 = clone.querySelector(".equis4");
  equis4.addEventListener("click", function () {
    cerrarFondo2();
    const formWpp = document.querySelector(".wpp-pedido");
    formWpp.style.opacity = "0";
    setTimeout(() => {
      formWpp.remove();
    }, 500);
  });



  function handleOpcionEntrega(e) {
    e.preventDefault();

    var direccion = document.querySelector(".direccion");
    var enviarButton = opcionEntrega.querySelector(".enviar");
    var retirarButton = opcionEntrega.querySelector(".retirar");
    enviarButton.classList.toggle("naranja");
    retirarButton.classList.toggle("naranja");

    if (enviarButton.classList.contains("naranja")) {
      equis4.style.color = "white";
      direccion.style.display = "flex";
      selectBarrio.required = true;
      direccionid.required = true;
    } else {
      equis4.style.color = "";
      direccion.style.display = "";
      selectBarrio.removeAttribute = true;
      direccionid.removeAttribute = true;
    }
  }

  opcionEntrega.addEventListener("click", handleOpcionEntrega);

  const form = clone.querySelector("#wpp-pedido-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const precioDomicilio = preciosBarrios[barrioValue] || 0;
    inputPrecioValue = precioDomicilio;
    recolectarYenviar(nombreValue, telefonoValue, barrioValue, nomenclaturaValue, inputPrecioValue, opcionEntrega.querySelector(".enviar"), productosGuardados);
  });

  const inputs = [selectBarrio, nomenclatura, nombreInput, telefonoInput];
  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      if (input === selectBarrio) {
        barrioValue = e.target.value;
      } else if (input === nomenclatura) {
        nomenclaturaValue = e.target.value;
      } else if (input === nombreInput) {
        nombreValue = e.target.value;
      } else if (input === telefonoInput) {
        telefonoValue = e.target.value;
      }
    });
  });

  document.body.appendChild(clone);

}






function recolectarYenviar(nombre, telefono, barrio, direccion, precio, enviar, productosGuardados) {
  const totalApagar = total(productosGuardados);
  const lineasProductos = productosGuardados.map(item => `${item.und} x ${item.name} ....... $ ${item.total}`).join("\n\n");

  let enviarA = enviar.classList.contains("naranja") ?
    `

ENVIAR A
Barrio: ${barrio}
Valor: ${precio}
Dirección: ${direccion}` : "";

  let mensaje = `--------------------------------------------

Hola, quisiera hacer un pedido.${enviarA}

Nombre: ${nombre}
Teléfono: ${telefono}

--------------------------------------------

${lineasProductos}

--------------------------------------------

Total: .................. $ ${((Number(totalApagar) + (Number(precio) * 1000))).toLocaleString()}

--------------------------------------------`;


  const numeroTelefono = '+573026056195';
  const whatsappUrl = 'https://api.whatsapp.com/send?phone=' + numeroTelefono + '&text=' + encodeURIComponent(mensaje);
  window.open(whatsappUrl, '_blank');
}







