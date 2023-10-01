import supertest from 'supertest';
import {createServer} from '../utils/server';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {createProduct} from '../services/product.service';
const userId = new mongoose.Types.ObjectId();
export const productPayload = {
  user: userId,
  title: 'Test Product',
  description: 'Test Description',
  price: 100,
  image: 'testimage.jpg',
};

describe('Product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
        const app = createServer();
        const productId = 'product124';
        await supertest(app).get(`/api/products/${productId}`).expect(404);

        expect(1).toBe(1);
      });
    });

    describe('given the product does exist', () => {
      it('should return a 200 status and the product', async () => {
        const product = await createProduct(productPayload);
        const app = createServer();

        const {body, statusCode} = await supertest(app).get(
          `/api/products/${product.productId}`
        );

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });
});
