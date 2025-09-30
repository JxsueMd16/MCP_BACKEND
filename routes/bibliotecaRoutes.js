import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import {
  listarLibros,
  obtenerLibro,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  listarCategorias,
  crearCategoria
} from '../controllers/bibliotecaController.js';

const router = Router();

router.get('/libros', authRequired, listarLibros);
router.get('/libros/:id', authRequired, obtenerLibro);
router.post('/libros', authRequired, crearLibro);
router.put('/libros/:id', authRequired, actualizarLibro);
router.delete('/libros/:id', authRequired, eliminarLibro);

router.get('/categorias', authRequired, listarCategorias);
router.post('/categorias', authRequired, crearCategoria);

export default router;
