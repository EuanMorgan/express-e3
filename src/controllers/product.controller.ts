import {Request, Response} from 'express';
import {
  CreateProductInput,
  UpdateProductInput,
} from '../schemas/product.schema';
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from '../services/product.service';

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput['body']>,
  res: Response
) {
  const userId = res.locals.user!._id;

  const body = req.body;

  try {
    const product = await createProduct({user: userId, ...body});

    return res.send(product);
  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
}
import {Types} from 'mongoose';

export async function updateProductHandler(
  req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
  res: Response
) {
  const userId = res.locals.user!._id;
  const productId = req.params.productId;

  const update = req.body;

  try {
    const product = await findProduct({productId});

    if (!product) {
      return res.sendStatus(404);
    }

    if (String(product.user) !== String(userId)) {
      return res.sendStatus(403);
    }

    const updatedProduct = await findAndUpdateProduct({productId}, update, {
      new: true,
    });

    return res.send(updatedProduct);
  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
}
export async function getProductHandler(
  req: Request<UpdateProductInput['params']>,
  res: Response
) {
  const productId = req.params.productId;

  try {
    const product = await findProduct({productId});

    console.log(product, productId);

    if (!product) {
      return res.sendStatus(404);
    }

    return res.send(product);
  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
}
export async function deleteProductHandler(
  req: Request<UpdateProductInput['params']>,
  res: Response
) {
  const productId = req.params.productId;
  const userId = res.locals.user!._id;

  try {
    const product = await findProduct({productId});

    if (!product) {
      return res.sendStatus(404);
    }

    if (String(product.user) !== String(userId)) {
      return res.sendStatus(403);
    }

    await deleteProduct({productId});

    return res.status(200).send({message: 'Product deleted successfully'});
  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
}
