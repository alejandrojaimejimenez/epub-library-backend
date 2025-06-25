import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { SUserService } from '@services/SUserService';
import { CreateUserDTO } from '@dtos/user/CreateUserDTO';
import { UpdateUserDTO } from '@dtos/user/UpdateUserDTO';
import { BaseController } from '@controllers/BaseController';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(SUserService) private userService: SUserService
  ) {
    super();
  }

  async createUser(req: Request, res: Response) {
    const dto = plainToInstance(CreateUserDTO, req.body);
    await validateOrReject(dto);
    const user = await this.userService.createUser(dto);
    return res.status(201).json(user);
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(user);
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const dto = plainToInstance(UpdateUserDTO, req.body);
    await validateOrReject(dto);
    const user = await this.userService.updateUser(id, dto);
    return res.json(user);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await this.userService.deleteUser(id);
    return res.status(204).send();
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    return res.json(users);
  }
}
