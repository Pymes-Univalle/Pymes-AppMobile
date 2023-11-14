export interface Product {
    idProductos: number;
    nombre: string;
    precio: string;
    descripcion: string;
    idCategoria: number;
    cantidad: number;
    idProductor: number;
    estado: number;
    fechaRegistro: string;
    fechaActualizacion: string;
    fechaVencimiento: string;
    ruta: { ruta: string }[];
  }