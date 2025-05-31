import {
  getProducts,
  getProduct,
  createProducts,
  updateProducts,
  deleteProducts
} from './productos.controler.js';
import {
  GetProducts,
  GetProduct,
  CreateProduct,
  UpdateProducts,
  DeleteProducts
} from '../models/products.models.js';

jest.mock('../models/products.models.js');

describe('Controlador de Productos', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      files: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    test('debe obtener todos los productos', async () => {
      const mockProducts = [{id: 1, name: 'Producto 1'}, {id: 2, name: 'Producto 2'}];
      GetProducts.mockImplementation((req, res) => {
        res.json(mockProducts);
      });
      
      await getProducts(req, res);
      
      expect(GetProducts).toHaveBeenCalledWith(req, res);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    test('debe manejar errores al obtener productos', async () => {
      GetProducts.mockImplementation(() => {
        throw new Error('Error de DB');
      });
      
      await getProducts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "error al obtener los productos/controlador"
      });
    });
  });

  describe('getProduct', () => {
    test('debe obtener un producto específico', async () => {
      req.params.id = '1';
      GetProduct.mockImplementation((req, res) => {
        res.json({id: 1, name: 'Producto 1'});
      });
      
      await getProduct(req, res);
      
      expect(GetProduct).toHaveBeenCalledWith(req, res);
    });

    test('debe retornar error si falta ID', async () => {
      await getProduct(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "Falta el id!"});
    });
  });

  describe('createProducts', () => {
    const validProductData = {
      name: 'Nuevo Producto',
      description: 'Descripción del producto',
      price: 100,
      stock: 10,
      size: 'M'
    };

    test('debe crear un producto con datos válidos', async () => {
      req.body = validProductData;
      req.files = {img: {name: 'producto.jpg'}};
      
      CreateProduct.mockImplementation((req, res) => {
        res.status(201).json({...req.body, id: 1});
      });
      
      await createProducts(req, res);
      
      expect(CreateProduct).toHaveBeenCalledWith(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('debe validar campos obligatorios', async () => {
      const campos = [
        {campo: 'name', mensaje: 'El nombre es obligatorio'},
        {campo: 'description', mensaje: 'La descripcion es obligatoria'},
        {campo: 'price', mensaje: 'El precio no puede estar vacio o ser negativo', value: -1},
        {campo: 'stock', mensaje: 'El stock no puede estar vacio o ser negativo', value: -1},
        {campo: 'size', mensaje: 'los tamaños son obligatorios'}
      ];
      
      for (const {campo, mensaje, value} of campos) {
        req.body = {...validProductData};
        req.body[campo] = value !== undefined ? value : '';
        await createProducts(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: mensaje});
        jest.clearAllMocks();
      }
    });

    test('debe validar que la imagen es obligatoria', async () => {
      req.body = validProductData;
      req.files = {};
      
      await createProducts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "Compae y la foto?"});
    });
  });

  describe('updateProducts', () => {
    test('debe actualizar un producto existente', async () => {
      req.body = {
        name: 'Producto Actualizado',
        description: 'Descripción actualizada',
        price: 150,
        stock: 15,
        size: 'L'
      };
      
      UpdateProducts.mockImplementation((req, res) => {
        res.json({...req.body, id: 1});
      });
      
      await updateProducts(req, res);
      
      expect(UpdateProducts).toHaveBeenCalledWith(req, res);
    });

    test('debe validar campos al actualizar', async () => {
      const campos = [
        {campo: 'name', mensaje: 'El nombre es obligatorio'},
        {campo: 'description', mensaje: 'La descripcion es obligatoria'},
        {campo: 'price', mensaje: 'El precio no puede estar vacio o ser negativo', value: -1},
        {campo: 'stock', mensaje: 'El stock no puede estar vacio o ser negativo', value: -1},
        {campo: 'size', mensaje: 'los tamaños son obligatorios'}
      ];
      
      for (const {campo, mensaje, value} of campos) {
        req.body = {
          name: 'Producto',
          description: 'Descripción',
          price: 100,
          stock: 10,
          size: 'M'
        };
        req.body[campo] = value !== undefined ? value : '';
        await updateProducts(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: mensaje});
        jest.clearAllMocks();
      }
    });
  });

  describe('deleteProducts', () => {
    test('debe eliminar un producto existente', async () => {
      req.params.id = '1';
      
      DeleteProducts.mockImplementation((req, res) => {
        res.json({message: 'Producto eliminado'});
      });
      
      await deleteProducts(req, res);
      
      expect(DeleteProducts).toHaveBeenCalledWith(req, res);
    });

    test('debe validar que se proporcione un ID', async () => {
      await deleteProducts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "falta el id!"});
    });
  });
});