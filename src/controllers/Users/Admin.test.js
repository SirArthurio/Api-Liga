import { getUsers,  createAdmin,  } from './Admin.controler.js';

jest.mock('../../models/Users/Admin.model.js', () => ({
  GetUsers: jest.fn(),
  GetUser: jest.fn(),
  CreateAdmin: jest.fn().mockImplementation((req, res) => {
    res.json(req.body);
  }),
  DeleteUser: jest.fn()
}));

jest.mock('../../models/Users/BaseUser.models.js', () => ({
  documentExist: jest.fn().mockResolvedValue(false),
  userExist: jest.fn().mockResolvedValue(false)
}));

describe("Pruebas de Admin Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      params: {},
      files: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    
    jest.clearAllMocks();
  });



  describe("createAdmin", () => {
    test("debe crear un admin válido", async () => {
      req.body = {
        name: "Admin Test",
        levelUser: "superadmin",
        user: "admin123",
        documentType: "CC",
        document: "123456789",
        birthdate: "1990-01-01",
        password: "securepass",
        img: "admin.jpg" 
      };
    
      
      await createAdmin(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: "Admin Test",
        document: "123456789"
      }));
    });

    test("debe retornar error 400 si faltan campos", async () => {
      req.body = {
        name: "",
        document: ""
      };
      
      await createAdmin(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Los campos son obligatorios",
        Status: "400"
      });
    });
  });

  
});