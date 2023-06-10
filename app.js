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
    product.forEach(element => {
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
        selectedAttraction: 0.06,
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
    } else if (boton.textContent === '-') {
      if (numero > 0) numero--;
    }

    numeroElemento.textContent = numero;
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
  cardView.querySelector(".d-body h3 span").textContent = product.precio;
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
  btnCar.addEventListener('click', () => viewCarShop(product.nombre, product.imagen[0], product.precio, numeros1));

  currentFondoViewCard = fondoViewCard;
};


let productosShoping = [];
function viewCarShop(nombre, img, precio, undNumber) {
  const und = undNumber.querySelectorAll('span')[1].textContent;
  const productoExistente = productosShoping.find(item => item.name === nombre);
  if (productoExistente) {
    productoExistente.und += Number(und);
  } else {
    const nuevoProducto = {
      name: nombre,
      img: img,
      precio: Number(precio),
      und: Number(und)
    };
    productosShoping.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productosShoping));
  }
}

const car = document.querySelector(".car");
car.addEventListener("click", async () => {

  const productosGuardados = JSON.parse(localStorage.getItem('productos'));
  const carmenu = document.querySelector("#card-shop-menu").content.cloneNode(true);

  productosGuardados.forEach((item,index) => {
    const productMenu = document.querySelector("#product-shoping-menu").content.cloneNode(true);

    productMenu.querySelector("img").src = item.img;
    productMenu.querySelector("h3").textContent = item.name;
    productMenu.querySelector("h3 span").textContent = item.precio * item.und;
    productMenu.querySelectorAll('.numeros span')[1].textContent = item.und;

    productMenu.querySelector('.numeros').addEventListener('click', (e) => {
      const resultado = calcularUnd(productMenu.querySelector('.numeros'))(e);
      e.target.closest('.shopping-product-info').querySelector("h3 span").textContent = item.precio * resultado;

      item.und = resultado;
      productosGuardados[index] = item; 
      localStorage.setItem('productos', JSON.stringify(productosGuardados));

      total(productosGuardados);
    });

    carmenu.querySelector(".car-shoping-body").appendChild(productMenu);
  });

  document.body.appendChild(carmenu);

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

  total(productosGuardados);
});

function total(products) {
  let totalPrecio = 0;
  totalPrecio = products.reduce((acumulador, item) => acumulador + (item.precio * item.und), 0);

  const totalPrecioElement = document.querySelector(".car-shoping-footer h3 span");
  totalPrecioElement.textContent = totalPrecio;
}
