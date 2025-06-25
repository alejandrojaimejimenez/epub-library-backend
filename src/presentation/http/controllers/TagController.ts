import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { BaseController } from './BaseController';
// import { STagService } from '@services/STagService'; // Descomentar y crear servicio según necesidades

export class TagController extends BaseController {
  // private tagService: STagService;

  constructor() {
    super();
    // this.tagService = container.resolve(STagService);
  }

  // Agrega aquí los métodos del controlador, usando this.handleError para errores
}
