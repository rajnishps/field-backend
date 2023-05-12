import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Order extends BaseModel {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  product?: string | null;

   @Field()
  quantity: string;

   @Field()
  delivery_date: string;

  @Field()
  delivery_location: string;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => User, { nullable: true })
  author?: User | null;
}
