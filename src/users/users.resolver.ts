import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Mutation,
  Args,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

   @ResolveField('order')
  order(@Parent() author: User) {
    return this.prisma.user.findUnique({ where: { id: author.id } }).order();
  }

  // @ResolveField('customer')
  // customer(@Parent() author: User) {
  //   return this.prisma.user.findUnique({ where: { id: author.id } }).customer();
  // }

  // @ResolveField('product_sample')
  // product_sample(@Parent() author: User) {
  //   return this.prisma.user.findUnique({ where: { id: author.id } }).product_sample();
  // }

  // @ResolveField('attendance')
  // attendance(@Parent() author: User) {
  //   return this.prisma.user.findUnique({ where: { id: author.id } }).attendance();
  // }

  // @ResolveField('location_history')
  // location_history(@Parent() author: User) {
  //   return this.prisma.user.findUnique({ where: { id: author.id } }).location_history();
  // }







  // @ResolveField('posts')
  // posts(@Parent() author: User) {
  //   return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  // }
}
