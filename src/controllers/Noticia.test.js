import {
  getNoticias,
  getNoticia,
  createNoticias,
  updateNoticias,
  deleteNoticias
} from './noticias.controler.js';
import {
  ObtenerNoticias,
  ObtenerNoticia,
  CrearNoticia,
  actualizarNoticia,
  eliminarNoticia
} from '../models/noticias.models.js';

jest.mock('../models/noticias.models.js');

describe('Controlador de Noticias', () => {
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

  describe('getNoticias', () => {
    test('debe retornar todas las noticias', async () => {
      const mockNoticias = [{ id: 1, title: 'Noticia 1' }, { id: 2, title: 'Noticia 2' }];
      ObtenerNoticias.mockResolvedValue(mockNoticias);
      
      await getNoticias(req, res);
      
      expect(res.json).toHaveBeenCalledWith(mockNoticias);
    });

    test('debe manejar errores al obtener noticias', async () => {
      ObtenerNoticias.mockRejectedValue(new Error('Error de base de datos'));
      
      await getNoticias(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error al obtener noticias",
        error: "Error de base de datos"
      });
    });
  });

  describe('getNoticia', () => {
    test('debe retornar una noticia específica', async () => {
      const mockNoticia = { id: 1, title: 'Noticia 1' };
      req.params.id = '1';
      ObtenerNoticia.mockResolvedValue(mockNoticia);
      
      await getNoticia(req, res);
      
      expect(ObtenerNoticia).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockNoticia);
    });

    test('debe manejar errores al obtener una noticia', async () => {
      req.params.id = '1';
      ObtenerNoticia.mockRejectedValue(new Error('Noticia no encontrada'));
      
      await getNoticia(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error al obtener la noticia",
        error: "Noticia no encontrada"
      });
    });
  });

  describe('createNoticias', () => {
    test('debe crear una noticia con datos válidos', async () => {
      req.body = {
        name: 'Nueva Noticia',
        date: '2023-01-01',
        description: 'Descripción',
        category: 'Deportes'
      };
      req.files = { img: { name: 'imagen.jpg' } };
      
      const mockNoticiaCreada = { id: 1, ...req.body };
      CrearNoticia.mockResolvedValue(mockNoticiaCreada);
      
      await createNoticias(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNoticiaCreada);
    });

    test('debe validar campos obligatorios', async () => {
      // Test para cada campo requerido
      const campos = [
        { campo: 'name', mensaje: 'El nombre es obligatorio' },
        { campo: 'date', mensaje: 'La fecha es obligatoria' },
        { campo: 'description', mensaje: 'La descripción es obligatoria' },
        { campo: 'category', mensaje: 'La categoría es obligatoria' }
      ];
      
      for (const { campo, mensaje } of campos) {
        req.body = { name: 'Test', date: '2023-01-01', description: 'Desc', category: 'Cat' };
        req.body[campo] = ''; 
        
        await createNoticias(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: mensaje,
          Status: "400"
        });
        
        jest.clearAllMocks();
      }
    });

    test('debe validar que la imagen es obligatoria', async () => {
      req.body = {
        name: 'Noticia sin imagen',
        date: '2023-01-01',
        description: 'Descripción',
        category: 'General'
      };
      req.files = {}; 
      
      await createNoticias(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "La imagen es obligatoria",
        Status: "400"
      });
    });
  });

  describe('updateNoticias', () => {
    test('debe actualizar una noticia existente', async () => {
      req.params.id = '1';
      req.body = {
        name: 'Noticia Actualizada',
        date: '2023-01-02',
        description: 'Descripción actualizada',
        category: 'Actualizada'
      };
      
      actualizarNoticia.mockImplementation((req, res) => {
        res.json({ id: 1, ...req.body });
      });
      
      await updateNoticias(req, res);
      
      expect(actualizarNoticia).toHaveBeenCalledWith(req, res);
    });

    test('debe validar campos al actualizar', async () => {
      req.params.id = '1';
      req.body = {}; // Sin datos
      
      await updateNoticias(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "los campos son obligatorios compae"
      });
    });
  });

  describe('deleteNoticias', () => {
    test('debe eliminar una noticia existente', async () => {
      req.params.id = '1';
      
      eliminarNoticia.mockImplementation((req, res) => {
        res.json({ message: 'Noticia eliminada' });
      });
      
      await deleteNoticias(req, res);
      
      expect(eliminarNoticia).toHaveBeenCalledWith(req, res);
    });

    test('debe validar que se proporcione un ID', async () => {
      req.params = {}; // Sin ID
      
      await deleteNoticias(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Y el id compae?"
      });
    });
  });
});