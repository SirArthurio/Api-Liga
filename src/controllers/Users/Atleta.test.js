import { getAtleta, createAtleta } from './Atleta.controler.js';

jest.mock('../../models/Users/Atleta.model.js', () => ({
  GetAtleta: jest.fn(),
  CreateAtleta: jest.fn().mockImplementation((req, res) => {
    res.json(req.body);
  })
}));

jest.mock('../../models/Users/BaseUser.models.js', () => ({
  documentExist: jest.fn().mockResolvedValue(false),
  userExist: jest.fn().mockResolvedValue(false)
}));

describe("Pruebas de Atleta Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      session: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe("getAtleta", () => {
    test("debe retornar 400 si no se provee documento", async () => {
      await getAtleta(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "¿Y el documento?",
        status: "400"
      });
    });

    test("debe retornar el atleta cuando existe", async () => {
      const mockAtleta = {
        name: "Luis",
        document: "123456"
      };
      
      require('../../models/Users/Atleta.model.js').GetAtleta
        .mockImplementation((doc, res) => res.json(mockAtleta));
      
      req.query.document = "123456";
      
      await getAtleta(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        document: "123456"
      }));
    });
  });

  describe("createAtleta", () => {
    test("debe crear un atleta válido", async () => {
      req.body = {
        name: "Ana Vega",
        document: "789012",
        documentType: "CC",
        birthdate: "2000-01-01",
        sport: "Basketball",
        coach: "12344",
        user: "anavega",
        password: "securepass",
        img: "ana.png"
      };
      
      await createAtleta(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: "Ana Vega",
        document: "789012"
      }));
    });

    test("debe retornar error 400 si faltan campos", async () => {
      req.body = {
        name: "",
        document: ""
      };
      
      await createAtleta(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Todos los campos son obligatorios",
        status: "400"
      });
    });
  });
});