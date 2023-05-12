import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Subscription,
  Mutation,
} from '@nestjs/graphql';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Order } from './models/post.model';
import { OrderConnection } from './models/post-connection.model';
import { PostOrder } from './dto/post-order.input';
import { CreateOrderInput } from './dto/createPost.input';
// import { Order } from 'src/common/order/order';

const pubSub = new PubSub();

@Resolver(() => Order)
export class PostsResolver {
  constructor(private prisma: PrismaService) {}

  @Subscription(() => Order)
  postCreated() {
    return pubSub.asyncIterator('orderCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Order)
  async createPost(
    @UserEntity() user: User,
    @Args('data') data: CreateOrderInput
  ) {
    const newPost = this.prisma.order.create({
      data: {
        published: true,
        name: data.name,
        product: data.product,
        quantity: data.quantity,
        delivery_date: data.delivery_date,
        delivery_location: data.delivery_location,
        authorId: user.id,
      },
    });
    pubSub.publish('orderCreated', { orderCreated: newPost });
    return newPost;
  }

  @Query(() => OrderConnection)
  async publishedPosts(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => PostOrder,
      nullable: true,
    })
    orderBy: PostOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.order.findMany({
          include: { author: true },
          where: {
            published: true,
            name: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prisma.order.count({
          where: {
            published: true,
            name: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
    return a;
  }

  @Query(() => Order)
  userPosts(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .order({ where: { published: true } });

    // or
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  @Query(() => Order)
  async post(@Args() id: PostIdArgs) {
    return this.prisma.order.findUnique({ where: { id: id.postId } });
  }

  @ResolveField('author', () => User)
  async author(@Parent() post: Order) {
    return this.prisma.order.findUnique({ where: { id: post.id } }).author();
  }
}
