import { CreateProduct, UpdateProducts,DeleteProducts, GetProduct,GetProducts } from "../models/products.models.js";

export const getProducts = async (req, res) => {
  try {
    await GetProducts(req,res);
   } catch (error) {
     res.status(500).json({message:"error al obtener los productos/controlador"});
   }
};

export const getProduct = async (req, res) => {
  try {
   const {id}= req.params;
  
   if(!id){
    return res.status(400).json({message:"Falta el id!"})
   }
   await GetProduct(req,res);
  } catch (error) {
    res.status(500).json({message:"error al obtener el producto/controlador"})
  }
};

export const createProducts = async (req, res) => {
  try {
    const { name, description, price, stock, size } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }
    if (!description) {
      return res.status(400).json({ message: "La descripcion es obligatoria" });
    }
    if (!price || price < 0) {
      return res
        .status(400)
        .json({ message: "El precio no puede estar vacio o ser negativo" });
    }
    if (!stock || stock < 0) {
      return res
        .status(400)
        .json({ message: "El stock no puede estar vacio o ser negativo" });
    }
    if (!size) {
      return res.status(400).json({ message: "los tamaños son obligatorios" });
    }
    if (!name && !description && !price && !stock && !size && req.files?.img) {
      return res.status(400).json({ message: "Los campos son obligatorios!" });
    }
    if (!req.files?.img) {
      return res.status(400).json({ message: "Compae y la foto?" });
    }
    await CreateProduct(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el producto  en controler", error });
  }
};

export const updateProducts = async (req, res) => {
  try {
    const { name, description, price, stock, size } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }
    if (!description) {
      return res.status(400).json({ message: "La descripcion es obligatoria" });
    }
    if (!price || price < 0) {
      return res
        .status(400)
        .json({ message: "El precio no puede estar vacio o ser negativo" });
    }
    if (!stock || stock < 0) {
      return res
        .status(400)
        .json({ message: "El stock no puede estar vacio o ser negativo" });
    }
    if (!size) {
      return res.status(400).json({ message: "los tamaños son obligatorios" });
    }
    if (!name && !description && !price && !stock && !size && req.files?.img) {
      return res.status(400).json({ message: "Los campos son obligatorios!" });
    }
    if (req.files?.img) {
      return res.status(400).json({ message: "Compae y la foto?" });
    }
    await UpdateProducts(req, res);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el producto  en controler",
        error,
      });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({message:"falta el id!"});
    }
    await DeleteProducts(req, res);
  } catch (error) {}
};
