import { RouteObject } from 'react-router';

export type Ro = RouteObject & {
  path: string; //确保有path
  key: string;
  name: string;
  children?: Ro[];
};
