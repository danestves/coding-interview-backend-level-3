import { db } from '../database/connection';

interface Item {
  id: number;
  name: string;
  price: number;
}

const excludeTimestamps = (item: any): Item => ({
  id: item.id,
  name: item.name,
  price: item.price
});

export const ItemsService = {
  async list(): Promise<Item[]> {
    const items = await db('items').select('*');
    return items.map(excludeTimestamps);
  },

  async getById(id: number): Promise<Item | null> {
    const item = await db('items').where({ id }).first();
    return item ? excludeTimestamps(item) : null;
  },

  async create(data: Omit<Item, 'id'>): Promise<Item> {
    const [id] = await db('items').insert(data);
    const item = await this.getById(id);
    if (!item) throw new Error('Failed to create item');
    return item;
  },

  async update(id: number, data: Omit<Item, 'id'>): Promise<Item | null> {
    const exists = await this.getById(id);
    if (!exists) return null;

    await db('items').where({ id }).update(data);
    const item = await this.getById(id);
    if (!item) throw new Error('Failed to update item');
    return item;
  },

  async delete(id: number): Promise<boolean> {
    const count = await db('items').where({ id }).delete();
    return count > 0;
  }
};
