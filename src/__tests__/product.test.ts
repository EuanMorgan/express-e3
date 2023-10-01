import supertest from 'supertest';
import {createServer} from '../utils/server';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {createProduct} from '../services/product.service';
import {signJwt} from '../utils/jwt.utils';
const userId = new mongoose.Types.ObjectId();
export const productPayload = {
  user: userId,
  title: 'Test Product',
  description:
    'Test Description fdfdsfiu ifuhdfdsuhf siufhdsifudshf svbvidsuvhewu dsovdhsfidsufhs fodsifjdsoifj odsifjdsofidsjf osdifjdsofdsfjdos odsjfdosifjdsoidsjf odsifjdsofidsjfdsoif odsifjdsofidsjfodsijf osdifjdsofidsjfodsijf osifjdsofidjsfoidsjf odifjsdofidsjfo',
  price: 100,
  image: 'testimage.jpg',
};

const userPayload = {
  _id: userId,
  email: 'test@test.com',
  name: 'Test User',
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
  const app = createServer();

  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
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

  describe('create product route', () => {
    describe('given the user is not authenticated', () => {
      it('should return a 403', async () => {
        const {statusCode} = await supertest(app).post('/api/products');

        expect(statusCode).toBe(403);
      });
    });

    describe('given the user is logged in', () => {
      it('should return a 200 and create a prodfuct', async () => {
        const jwt = signJwt(userPayload);

        const {statusCode, body} = await supertest(app)
          .post(`/api/products`)
          .set('Authorization', `Bearer ${jwt}`)
          .send(productPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          user: expect.any(String),
          title: 'Test Product',
          description:
            'Test Description fdfdsfiu ifuhdfdsuhf siufhdsifudshf svbvidsuvhewu dsovdhsfidsufhs fodsifjdsoifj odsifjdsofidsjf osdifjdsofdsfjdos odsjfdosifjdsoidsjf odsifjdsofidsjfdsoif odsifjdsofidsjfodsijf osdifjdsofidsjfodsijf osifjdsofidjsfoidsjf odifjsdofidsjfo',
          price: 100,
          image: 'testimage.jpg',
          productId: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });
  });
});
