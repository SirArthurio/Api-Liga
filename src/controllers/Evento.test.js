import {
  getEvents,
  getEvent,
  createEvents,
  updateEvents,
  deleteEvents,
  deleteAtletaEvento,
} from './events.controler.js';
import {
  GetEvents,
  GetEvent,
  CreateEvents,
  UpdateEvents,
  DeleteEvents,
  DeleteAtletaEvento,
} from '../models/events.model.js';


jest.mock('../models/events.model.js');

describe('Controlador de Eventos', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      files: {},
      session: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    test('debe obtener todos los eventos', async () => {
      GetEvents.mockImplementation((req, res) => {
        res.json([{id: 1, name: 'Evento 1'}]);
      });
      
      await getEvents(req, res);
      
      expect(GetEvents).toHaveBeenCalledWith(req, res);
      expect(res.json).toHaveBeenCalledWith([{id: 1, name: 'Evento 1'}]);
    });

    test('debe manejar errores al obtener eventos', async () => {
      GetEvents.mockImplementation(() => {
        throw new Error('Error de DB');
      });
      
      await getEvents(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error al obtener los Eventos/controlador ",
        error: expect.any(Error)
      });
    });
  });

  describe('getEvent', () => {
    test('debe obtener un evento específico', async () => {
      req.params.id = '1';
      GetEvent.mockImplementation((req, res) => {
        res.json({id: 1, name: 'Evento 1'});
      });
      
      await getEvent(req, res);
      
      expect(GetEvent).toHaveBeenCalledWith(req, res);
    });

    test('debe retornar error si falta ID', async () => {
      await getEvent(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "Falta el ID!"});
    });
  });

  describe('createEvents', () => {
    const validEventData = {
      name: 'Nuevo Evento',
      date: '2023-01-01',
      description: 'Descripción',
      category: 'Deportes',
      place: 'Estadio'
    };

    test('debe crear un evento con datos válidos', async () => {
      req.body = validEventData;
      req.files = {img: {name: 'imagen.jpg'}};
      
      CreateEvents.mockImplementation((req, res) => {
        res.status(201).json({...req.body, id: 1});
      });
      
      await createEvents(req, res);
      
      expect(CreateEvents).toHaveBeenCalledWith(req, res);
    });

    test('debe validar campos obligatorios', async () => {
      const campos = [
        {campo: 'name', mensaje: 'El nombre es obligatorio'},
        {campo: 'date', mensaje: 'La fecha es obligatoria'},
        {campo: 'description', mensaje: 'La descripcion es obligatoria'},
        {campo: 'category', mensaje: 'La categoria es obligatoria'},
        {campo: 'place', mensaje: 'El lugar es obligatorio'}
      ];
      
      for (const {campo, mensaje} of campos) {
        req.body = {...validEventData, [campo]: ''};
        await createEvents(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: mensaje});
        jest.clearAllMocks();
      }
    });

    test('debe validar que la imagen es obligatoria', async () => {
      req.body = validEventData;
      req.files = {};
      
      await createEvents(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "Falta la imagen"});
    });
  });

  describe('updateEvents', () => {
    test('debe actualizar un evento existente', async () => {
      req.params.id = '1';
      req.body = {
        name: 'Evento Actualizado',
        date: '2023-01-02',
        description: 'Descripción actualizada',
        category: 'Actualizada',
        place: 'Nuevo lugar'
      };
      
      UpdateEvents.mockImplementation((req, res) => {
        res.json({...req.body, id: 1});
      });
      
      await updateEvents(req, res);
      
      expect(UpdateEvents).toHaveBeenCalledWith(req, res);
    });

    test('debe validar campos al actualizar', async () => {
      req.params.id = '1';
      req.body = {};
      
      await updateEvents(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "los campos son obligatorios"});
    });
  });

  describe('deleteEvents', () => {
    test('debe eliminar un evento existente', async () => {
      req.params.id = '1';
      
      DeleteEvents.mockImplementation((req, res) => {
        res.json({message: 'Evento eliminado'});
      });
      
      await deleteEvents(req, res);
      
      expect(DeleteEvents).toHaveBeenCalledWith(req, res);
    });

    test('debe validar que se proporcione un ID', async () => {
      await deleteEvents(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "Y el id!?"});
    });
  });


  describe('deleteAtletaEvento', () => {
    test('debe eliminar un atleta de un evento', async () => {
      req.session.usuario_id = 'user123';
      req.params.id = '1';
      req.body.document = '123456';
      
      DeleteAtletaEvento.mockImplementation((req, res) => {
        res.json({message: 'Atleta eliminado'});
      });
      
      await deleteAtletaEvento(req, res);
      
      expect(DeleteAtletaEvento).toHaveBeenCalledWith(req, res);
    });
  });


});