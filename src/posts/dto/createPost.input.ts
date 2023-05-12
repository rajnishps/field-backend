import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  product: string;

  @Field()
  @IsNotEmpty()
  quantity: string;

  @Field()
  @IsNotEmpty()
  delivery_date: string;

  @Field()
  @IsNotEmpty()
  delivery_location: string;
}
