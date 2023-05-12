import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/common/pagination/pagination';
import { Order } from './post.model';

@ObjectType()
export class OrderConnection extends PaginatedResponse(Order) {}
