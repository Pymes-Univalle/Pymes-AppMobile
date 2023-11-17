export interface Product {
  idProductos: number;
  nombre: string;
  precio: string;
  descripcion: string;
  idCategoria: number;
  cantidad: number;
  idProductor: number;
  estado: number;
  mainIndex: number;
  fechaRegistro: string;
  fechaActualizacion: string;
  fechaVencimiento: string | null;
  ruta: { id: number; ruta: string; idProducto: number; estado: number; fechaRegistro: string; fechaActualizacion: string; }[];
  categoria: { idCategoria: number; nombre: string; };
  atributo: { idAtributo: number; nombre: string; valor: string; idProducto: number; }[];
}

