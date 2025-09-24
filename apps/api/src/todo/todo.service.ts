import { Injectable } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { randomUUID } from 'crypto';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: randomUUID(), title: 'Try this starter', completed: false },
    { id: randomUUID(), title: 'Wire Postgres later', completed: false },
  ];

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: string): Todo | undefined {
    return this.todos.find(t => t.id === id);
  }

  create(title: string): Todo {
    const todo: Todo = { id: randomUUID(), title, completed: false };
    this.todos.unshift(todo);
    return todo;
  }

  update(id: string, partial: Partial<Todo>): Todo | undefined {
    const t = this.findOne(id);
    if (!t) return undefined;
    Object.assign(t, partial);
    return t;
  }

  delete(id: string): boolean {
    const before = this.todos.length;
    this.todos = this.todos.filter(t => t.id !== id);
    return this.todos.length < before;
  }
}
