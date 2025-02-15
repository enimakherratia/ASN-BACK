import { Product } from './product.model';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productSchema: Model<Product>,
  ) {}

  // Method to create multiple product items at once
  async createItems(items: CreateProductDto[]): Promise<string[]> {
    // Map the incoming CreateProductDto items to new Product model instances
    const newItems = items.map((item) => new this.productSchema(item));
    // Insert the new items into the database using Mongoose's insertMany method
    const result = await this.productSchema.insertMany(newItems);
    // Return the array of inserted product IDs
    return result.map((item) => item.id);
  }

  // Method to retrieve all products (currently from the in-memory array)
  getProducts() {
    return [...this.products]; // Returns a shallow copy of the products array
  }
}
