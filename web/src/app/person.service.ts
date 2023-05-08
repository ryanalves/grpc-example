import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Person } from './types/person';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private socket: Socket) {}

  getPersons() {
    return this.socket.fromEvent<Person[]>('persons');
  }

  getPerson() {
    return this.socket.fromEvent<Person>('person');
  }
}
