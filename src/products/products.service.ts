import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Product } from './product.model';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productSchema: Model<Product>,
  ) {}

  async createItems(items: CreateProductDto[]): Promise<string[]> {
    const newItems = items.map((item) => new this.productSchema(item));
    const result = await this.productSchema.insertMany(newItems);
    return result.map((item) => item.id); // Retourner les IDs générés
  }

  getProducts() {
    return [...this.products];
  }
}
