import { login, } from './BaseUser.controler.js';
import { Login,  } from "../../models/Users/BaseUser.models.js";

jest.mock("../../models/Users/BaseUser.models.js");

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      session: {},
      cookies: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('debe retornar error 400 si falta usuario', async () => {
      req.body = { password: 'password123' };
      
      await login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "El usuario es obligatorio",
        status: false
      });
    });

    test('debe retornar error 400 si falta contraseña', async () => {
      req.body = { user: 'admin' };
      
      await login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "La contraseña es obligatoria",
        status: false
      });
    });

    test('debe establecer sesión y cookie cuando login es exitoso', async () => {
      req.body = { user: 'admin', password: 'password123' };
      const mockUser = { _id: '123', username: 'admin' };
      const mockToken = 'fake.token.here';
      
      Login.mockResolvedValue({
        status: true,
        message: "Login exitoso",
        user: mockUser,
        token: mockToken
      });
      
      await login(req, res);
      
      expect(req.session.usuario_id).toBe('123');
      expect(res.cookie).toHaveBeenCalledWith('jwt', mockToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logueado con éxito",
        status: true,
        user: mockUser,
        token: mockToken
      });
    });

    test('debe retornar error 400 cuando credenciales son incorrectas', async () => {
      req.body = { user: 'admin', password: 'wrongpass' };
      
      Login.mockResolvedValue({
        status: false,
        message: "Credenciales incorrectas"
      });
      
      await login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Credenciales incorrectas",
        status: false
      });
    });

    test('debe manejar errores internos del servidor', async () => {
      req.body = { user: 'admin', password: 'password123' };
      
      Login.mockRejectedValue(new Error("Error de base de datos"));
      
      await login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error en el servidor controlador",
        error: "Error de base de datos",
        status: false
      });
    });
  });

 

 

  
});