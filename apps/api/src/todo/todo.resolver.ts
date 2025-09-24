import { Args, ID, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { TodoService } from './todo.service';
import { KeycloakGuard } from '../auth/keycloak.guard';

@Resolver(() => Todo)
@UseGuards(KeycloakGuard)
export class TodoResolver {
  constructor(private readonly service: TodoService) {}

  @Query(() => [Todo], { name: 'todos' })
  todos(@Context() context: any): Todo[] {
    const user = context.req.user;
    console.log('Authenticated user:', user.preferred_username || user.sub);
    return this.service.findAll();
  }

  @Mutation(() => Todo)
  createTodo(@Args('title') title: string, @Context() context: any): Todo {
    const user = context.req.user;
    console.log('Creating todo for user:', user.preferred_username || user.sub);
    return this.service.create(title);
  }

  @Mutation(() => Todo, { nullable: true })
  toggleTodo(@Args('id', { type: () => ID }) id: string): Todo | null {
    const t = this.service.findOne(id);
    if (!t) return null;
    return this.service.update(id, { completed: !t.completed }) ?? null;
  }

  @Mutation(() => Todo, { nullable: true })
  updateTodo(
    @Args('id', { type: () => ID }) id: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('completed', { nullable: true }) completed?: boolean,
  ): Todo | null {
    return this.service.update(id, { title, completed }) ?? null;
  }

  @Mutation(() => Boolean)
  deleteTodo(@Args('id', { type: () => ID }) id: string): boolean {
    return this.service.delete(id);
  }
}
