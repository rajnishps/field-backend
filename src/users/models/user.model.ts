import 'reflect-metadata';
import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Order } from 'src/posts/models/post.model';
// import { Customer } from 'src/customers/models/customer.model'
import { BaseModel } from 'src/common/models/base.model';
import { Role } from '@prisma/client';
// import { Order } from 'src/common/order/order';

registerEnumType(Role,{
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends BaseModel {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field(() => Role)
  role: Role;

  // @Field(() => [Post], { nullable: true })
  // posts?: [Post] | null;

  @Field(() => Order , { nullable: true } )
  order?: Order;

  // @Field(() => Customer , { nullable: true })
  // customer?: Customer;

  // @Field(() => Product , { nullable: true })
  // product_sample?: Product;

  // @Field(() => Attendance , { nullable: true })
  // attendance?: Attendance;

  // @Field(() => Location_History , { nullable: true })
  // location_history?: Location_History;

  @HideField()
  password: string;
}
