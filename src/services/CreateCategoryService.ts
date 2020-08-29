import { getRepository } from 'typeorm';
import Category from '../models/Category';

export default class CreateCategoryService {
  public async execute(categoryTitle: string): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const category = categoryRepository.create({
      title: categoryTitle,
    });

    await categoryRepository.save(category);

    return category;
  }
}
