const { createUser } = require('./User.controler');
const { CreateUser } = require('../../models/Users/User.model.js');
const { documentExist, userExist } = require('../../models/Users/BaseUser.models.js');

jest.mock('../../models/Users/User.model.js');
jest.mock('../../models/Users/BaseUser.models.js');

describe('User Controller - createUser', () => {
  let req, res;

  beforeEach(() => {
    req = {
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
    
   
    documentExist.mockResolvedValue(false);
    userExist.mockResolvedValue(false);
  });

  describe('Validaciones fallidas', () => {
    test('debe retornar error 400 si falta nombre', async () => {
      req.body = { document: "123" }; 
      
      await createUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "El nombre es obligatorio",
        Status: "400"
      });
    });

    test('debe retornar error si documento existe', async () => {
      req.body = { document: "123", name: "Test" };
      documentExist.mockResolvedValueOnce(true); 
      
      await createUser(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        message: "Documento ya existe, por favor ingrese otro",
        Status: "400"
      });
    });

    test('debe retornar error si usuario existe', async () => {
      req.body = { user: "existente", name: "Test", document: "123" };
      userExist.mockResolvedValueOnce(true);
      
      await createUser(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario ya existe, por favor ingrese otro",
        Status: "400"
      });
    });
  });

  describe('Flujo exitoso', () => {
    test('debe crear usuario con datos completos', async () => {
      const userData = {
        name: "Usuario Test",
        levelUser: "Administrador",
        user: "testuser",
        documentType: "CC",
        document: "123456789",
        birthdate: "2000-01-01",
        password: "securepass"
      };
      
      req.body = userData;
      req.files = { img: { name: "perfil.jpg" } };
      
      CreateUser.mockImplementation((req, res) => {
        res.json({
          message: "Usuario creado exitosamente",
          status: 201,
          user: { ...req.body, img: req.files.img.name }
        });
      });
      
      await createUser(req, res);
      
      
      expect(CreateUser).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario creado exitosamente",
        status: 201,
        user: expect.objectContaining({
          name: "Usuario Test",
          document: "123456789"
        })
      });
    });
  });
});