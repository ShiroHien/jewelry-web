import { Express } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import blogRoutes from './blog.routes';
import uploadRoutes from './upload.routes';
import { API_ROUTES } from '../constants/routes';

export const registerApiRoutes = (app: Express, routeMiddleware: {
  auth: Array<(req: any, res: any, next: any) => void>;
  upload: Array<(req: any, res: any, next: any) => void>;
}) => {
  app.use(API_ROUTES.auth, ...routeMiddleware.auth, authRoutes);
  app.use(API_ROUTES.products, productRoutes);
  app.use(API_ROUTES.blog, blogRoutes);
  app.use(API_ROUTES.upload, ...routeMiddleware.upload, uploadRoutes);
};